import pytest
import uuid
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.study_port import StudyPortModel
from src.infrastructure.database.models.bathymetry import BathymetryProfileModel, BathymetryPointModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_bathymetry_lifecycle(db_session):
    """Test full CRUD lifecycle and validation for Bathymetry Profiles and Points."""
    # 1. Create a test Project
    proj_res = client.post("/projects", json={
        "name": "Bathymetry Test Project",
        "base_year": 2026,
        "planning_horizon": 20
    })
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Create a Study Port for the Project
    port_res = client.post(f"/projects/{project_id}/study-port", json={
        "name": "Pelabuhan Utama Batimetri",
        "location": "DKI Jakarta",
        "latitude": -6.1,
        "longitude": 106.8,
        "description": "Port for testing bathymetry"
    })

    assert port_res.status_code == 201
    study_port_id = port_res.json()["id"]

    # 3. Create Bathymetry Profile with initial points
    profile_payload = {
        "name": "Profil Alur Pelayaran Utama",
        "description": "Profil kedalaman dari shoreline ke kolam labuh",
        "points": [
            {"distance_from_shore": 10.0, "water_depth": 5.0, "sequence": 1},
            {"distance_from_shore": 50.0, "water_depth": 12.5, "sequence": 2}
        ]
    }
    create_profile_res = client.post(f"/study-ports/{study_port_id}/bathymetry-profiles", json=profile_payload)
    assert create_profile_res.status_code == 201
    profile_data = create_profile_res.json()
    assert profile_data["name"] == profile_payload["name"]
    assert profile_data["study_port_id"] == study_port_id
    assert len(profile_data["points"]) == 2
    profile_id = profile_data["id"]
    point_1_id = profile_data["points"][0]["id"]

    # 4. List Bathymetry Profiles for the Study Port
    list_res = client.get(f"/study-ports/{study_port_id}/bathymetry-profiles")
    assert list_res.status_code == 200
    profiles_list = list_res.json()
    assert len(profiles_list) >= 1
    assert profile_id in [p["id"] for p in profiles_list]

    # 5. Get Bathymetry Profile by ID
    get_res = client.get(f"/bathymetry-profiles/{profile_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == profile_payload["name"]

    # 6. Add a new Bathymetry Point to the Profile
    point_payload = {"distance_from_shore": 100.0, "water_depth": 18.0, "sequence": 3}
    add_pt_res = client.post(f"/bathymetry-profiles/{profile_id}/points", json=point_payload)
    assert add_pt_res.status_code == 201
    point_data = add_pt_res.json()
    assert point_data["distance_from_shore"] == 100.0
    assert point_data["water_depth"] == 18.0
    point_3_id = point_data["id"]

    # 7. Update Bathymetry Point
    update_pt_res = client.patch(f"/bathymetry-points/{point_3_id}", json={"water_depth": 20.0})
    assert update_pt_res.status_code == 200
    assert update_pt_res.json()["water_depth"] == 20.0

    # 8. Update Bathymetry Profile Metadata
    update_profile_res = client.patch(f"/bathymetry-profiles/{profile_id}", json={"name": "Profil Alur Pelayaran Updated"})
    assert update_profile_res.status_code == 200
    assert update_profile_res.json()["name"] == "Profil Alur Pelayaran Updated"

    # 9. Delete a Bathymetry Point
    del_pt_res = client.delete(f"/bathymetry-points/{point_3_id}")
    assert del_pt_res.status_code == 204

    # 10. Delete Bathymetry Profile
    del_profile_res = client.delete(f"/bathymetry-profiles/{profile_id}")
    assert del_profile_res.status_code == 204

    # Verify Profile deletion
    get_deleted_res = client.get(f"/bathymetry-profiles/{profile_id}")
    assert get_deleted_res.status_code == 404

    # 11. Cleanup Test Database Records
    db_port = db_session.query(StudyPortModel).filter(StudyPortModel.id == uuid.UUID(study_port_id)).first()
    if db_port:
        db_session.delete(db_port)
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == uuid.UUID(project_id)).first()
    if db_project:
        db_session.delete(db_project)
    db_session.commit()

def test_bathymetry_validation_errors():
    """Test validation rules for bathymetry inputs."""
    random_study_port_id = str(uuid.uuid4())

    # Non-existent Study Port -> 404
    profile_res = client.post(f"/study-ports/{random_study_port_id}/bathymetry-profiles", json={
        "name": "Invalid Profile"
    })
    assert profile_res.status_code == 404

    # Negative distance_from_shore -> 422
    invalid_pt_res = client.post(f"/study-ports/{random_study_port_id}/bathymetry-profiles", json={
        "name": "Invalid Point Profile",
        "points": [{"distance_from_shore": -5.0, "water_depth": 10.0}]
    })
    assert invalid_pt_res.status_code == 422

    # Negative water_depth -> 422
    invalid_depth_res = client.post(f"/study-ports/{random_study_port_id}/bathymetry-profiles", json={
        "name": "Invalid Depth Profile",
        "points": [{"distance_from_shore": 10.0, "water_depth": -2.0}]
    })
    assert invalid_depth_res.status_code == 422
