import pytest
import uuid
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.study_port import StudyPortModel
from src.infrastructure.database.models.external_port import ExternalPortModel
from src.infrastructure.database.models.route import RouteModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_route_lifecycle_and_validation(db_session):
    """Test full CRUD lifecycle and validation rules for Routes on PostgreSQL."""
    # 1. Create Test Project
    proj_res = client.post("/projects", json={
        "name": "Route Test Project",
        "base_year": 2026,
        "planning_horizon": 20
    })
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Create Study Port for Project
    port_res = client.post(f"/projects/{project_id}/study-port", json={
        "name": "Pelabuhan Utama Surabaya",
        "location": "Jawa Timur",
        "latitude": -7.2,
        "longitude": 112.7,
        "description": "Port for testing routes"
    })
    assert port_res.status_code == 201
    study_port_id = port_res.json()["id"]

    # 3. Create External Port
    ext_res = client.post("/external-ports", json={
        "name": "Port of Singapore",
        "country": "Singapore",
        "latitude": 1.35,
        "longitude": 103.8,
        "max_draft": 16.0,
        "max_loa": 350.0,
        "cargo_productivity": 1500.0,
        "productivity_unit": "ton/hour"
    })
    assert ext_res.status_code == 201
    external_port_id = ext_res.json()["id"]

    # 4. Create INBOUND Route
    route_inbound_payload = {
        "name": "Singapore -> Surabaya Inbound",
        "direction": "INBOUND",
        "external_port_id": external_port_id,
        "distance_nm": 750.5,
        "description": "Jalur Impor Singapura - Surabaya",
        "is_active": True
    }
    create_inbound_res = client.post(f"/projects/{project_id}/routes", json=route_inbound_payload)
    assert create_inbound_res.status_code == 201
    inbound_data = create_inbound_res.json()
    assert inbound_data["name"] == route_inbound_payload["name"]
    assert inbound_data["direction"] == "INBOUND"
    assert inbound_data["distance_nm"] == 750.5
    assert inbound_data["project_id"] == project_id
    assert inbound_data["study_port_id"] == study_port_id
    inbound_id = inbound_data["id"]

    # 5. Create OUTBOUND Route
    route_outbound_payload = {
        "name": "Surabaya -> Singapore Outbound",
        "direction": "OUTBOUND",
        "external_port_id": external_port_id,
        "distance_nm": 750.5,
        "is_active": True
    }
    create_outbound_res = client.post(f"/projects/{project_id}/routes", json=route_outbound_payload)
    assert create_outbound_res.status_code == 201
    outbound_id = create_outbound_res.json()["id"]

    # 6. List Routes for Project
    list_res = client.get(f"/projects/{project_id}/routes")
    assert list_res.status_code == 200
    routes_list = list_res.json()
    assert len(routes_list) >= 2

    # 7. Get Route by ID
    get_res = client.get(f"/routes/{inbound_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == route_inbound_payload["name"]

    # 8. Update Route
    update_res = client.patch(f"/routes/{inbound_id}", json={"distance_nm": 780.0, "is_active": False})
    assert update_res.status_code == 200
    assert update_res.json()["distance_nm"] == 780.0
    assert update_res.json()["is_active"] is False

    # 9. Validation Errors
    # Invalid distance <= 0
    invalid_dist_res = client.post(f"/projects/{project_id}/routes", json={
        "name": "Invalid Route",
        "direction": "INBOUND",
        "external_port_id": external_port_id,
        "distance_nm": -10.0
    })
    assert invalid_dist_res.status_code == 422

    # Non-existent External Port
    fake_ext_id = str(uuid.uuid4())
    invalid_ext_res = client.post(f"/projects/{project_id}/routes", json={
        "name": "Fake Port Route",
        "direction": "INBOUND",
        "external_port_id": fake_ext_id,
        "distance_nm": 100.0
    })
    assert invalid_ext_res.status_code == 404

    # 10. Delete Route
    del_res = client.delete(f"/routes/{inbound_id}")
    assert del_res.status_code == 204

    del_res_2 = client.delete(f"/routes/{outbound_id}")
    assert del_res_2.status_code == 204

    # Verify deletion
    assert client.get(f"/routes/{inbound_id}").status_code == 404

    # 11. Database Cleanup
    db_ext = db_session.query(ExternalPortModel).filter(ExternalPortModel.id == uuid.UUID(external_port_id)).first()
    if db_ext:
        db_session.delete(db_ext)

    db_port = db_session.query(StudyPortModel).filter(StudyPortModel.id == uuid.UUID(study_port_id)).first()
    if db_port:
        db_session.delete(db_port)

    db_proj = db_session.query(ProjectModel).filter(ProjectModel.id == uuid.UUID(project_id)).first()
    if db_proj:
        db_session.delete(db_proj)

    db_session.commit()

def test_route_creation_without_study_port(db_session):
    """Test that creating a route for a project without a Study Port returns 400 error."""
    # Create project without study port
    proj_res = client.post("/projects", json={
        "name": "No Study Port Project",
        "base_year": 2026,
        "planning_horizon": 20
    })
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    ext_res = client.post("/external-ports", json={
        "name": "Port of Klang",
        "country": "Malaysia",
        "latitude": 3.0,
        "longitude": 101.4,
        "max_draft": 15.0,
        "max_loa": 300.0
    })
    assert ext_res.status_code == 201
    external_port_id = ext_res.json()["id"]

    route_res = client.post(f"/projects/{project_id}/routes", json={
        "name": "Failed Route",
        "direction": "INBOUND",
        "external_port_id": external_port_id,
        "distance_nm": 500.0
    })
    assert route_res.status_code == 400
    assert "Study Port" in route_res.json()["detail"]

    # Cleanup
    db_ext = db_session.query(ExternalPortModel).filter(ExternalPortModel.id == uuid.UUID(external_port_id)).first()
    if db_ext:
        db_session.delete(db_ext)
    db_proj = db_session.query(ProjectModel).filter(ProjectModel.id == uuid.UUID(project_id)).first()
    if db_proj:
        db_session.delete(db_proj)
    db_session.commit()
