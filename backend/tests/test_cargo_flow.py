import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.scenario import ScenarioModel
from src.infrastructure.database.models.tenant import TenantModel
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.cargo_flow import CargoFlowModel
import uuid

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_cargo_flow_lifecycle(db_session):
    """Test creating, retrieving, listing, updating, and deleting cargo flows."""
    # 1. Create a test project
    project_payload = {
        "name": "Project Cargo Flow Test",
        "description": "Project for testing cargo flow CRUD",
        "base_year": 2026,
        "planning_horizon": 25
    }
    proj_res = client.post("/projects", json=project_payload)
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Create a test scenario under the project
    scenario_payload = {
        "project_id": project_id,
        "name": "Scenario Cargo Flow Test",
        "description": "Scenario for testing cargo flows"
    }
    scen_res = client.post("/scenarios", json=scenario_payload)
    assert scen_res.status_code == 201
    scenario_id = scen_res.json()["id"]

    # 3. Create a test commodity
    commodity_payload = {
        "name": "Wheat",
        "unit": "Ton",
        "is_active": True
    }
    comm_res = client.post("/commodities", json=commodity_payload)
    assert comm_res.status_code == 201
    commodity_id = comm_res.json()["id"]

    # 4. Create a test tenant under the project
    tenant_payload = {
        "name": "PT Bogasari",
        "commodity_id": commodity_id,
        "description": "Pabrik tepung terigu",
        "is_active": True
    }
    tenant_res = client.post(f"/projects/{project_id}/tenants", json=tenant_payload)
    assert tenant_res.status_code == 201
    tenant_id = tenant_res.json()["id"]

    # 5. Create an inbound cargo flow under the scenario
    flow_payload = {
        "tenant_id": tenant_id,
        "commodity_id": commodity_id,
        "direction": "INBOUND",
        "origin": "Australia",
        "destination_port": "KEK Port",
        "base_annual_demand": 500000.0,
        "unit": "Ton",
        "is_active": True
    }
    flow_res = client.post(f"/scenarios/{scenario_id}/cargo-flows", json=flow_payload)
    assert flow_res.status_code == 201
    flow_data = flow_res.json()
    assert flow_data["direction"] == "INBOUND"
    assert flow_data["origin"] == "Australia"
    assert flow_data["destination_port"] == "KEK Port"
    assert flow_data["base_annual_demand"] == 500000.0
    assert flow_data["tenant_name"] == "PT Bogasari"
    assert flow_data["commodity_name"] == "Wheat"
    flow_id = flow_data["id"]

    # 5b. Create an outbound cargo flow under the scenario
    outbound_payload = {
        "tenant_id": tenant_id,
        "commodity_id": commodity_id,
        "direction": "OUTBOUND",
        "origin": "KEK Port",
        "destination_port": "Surabaya Domestic Terminal",
        "base_annual_demand": 250000.0,
        "unit": "Ton",
        "is_active": True
    }
    outbound_res = client.post(f"/scenarios/{scenario_id}/cargo-flows", json=outbound_payload)
    assert outbound_res.status_code == 201
    outbound_data = outbound_res.json()
    assert outbound_data["direction"] == "OUTBOUND"
    assert outbound_data["origin"] == "KEK Port"
    assert outbound_data["destination_port"] == "Surabaya Domestic Terminal"
    assert outbound_data["base_annual_demand"] == 250000.0
    outbound_id = outbound_data["id"]

    # 6. Get the cargo flow by ID
    get_res = client.get(f"/cargo-flows/{flow_id}")
    assert get_res.status_code == 200
    assert get_res.json()["origin"] == "Australia"

    # 7. List cargo flows for this scenario (all)
    list_res = client.get(f"/scenarios/{scenario_id}/cargo-flows")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert len(list_data) >= 2
    assert flow_id in [f["id"] for f in list_data]
    assert outbound_id in [f["id"] for f in list_data]

    # 7b. Filter cargo flows by direction=INBOUND
    inbound_list_res = client.get(f"/scenarios/{scenario_id}/cargo-flows?direction=INBOUND")
    assert inbound_list_res.status_code == 200
    inbound_ids = [f["id"] for f in inbound_list_res.json()]
    assert flow_id in inbound_ids
    assert outbound_id not in inbound_ids

    # 7c. Filter cargo flows by direction=OUTBOUND
    outbound_list_res = client.get(f"/scenarios/{scenario_id}/cargo-flows?direction=OUTBOUND")
    assert outbound_list_res.status_code == 200
    outbound_ids = [f["id"] for f in outbound_list_res.json()]
    assert outbound_id in outbound_ids
    assert flow_id not in outbound_ids

    # 8. List cargo flows for another random scenario (Verify scoping)
    other_scenario_id = str(uuid.uuid4())
    other_list_res = client.get(f"/scenarios/{other_scenario_id}/cargo-flows")
    assert other_list_res.status_code == 200
    assert len(other_list_res.json()) == 0

    # 9. Update the cargo flow (PATCH)
    update_payload = {
        "origin": "Canada",
        "base_annual_demand": 600000.0,
        "is_active": False
    }
    patch_res = client.patch(f"/cargo-flows/{flow_id}", json=update_payload)
    assert patch_res.status_code == 200
    patch_data = patch_res.json()
    assert patch_data["origin"] == "Canada"
    assert patch_data["base_annual_demand"] == 600000.0
    assert patch_data["is_active"] is False

    # 10. Delete both cargo flows
    delete_res_1 = client.delete(f"/cargo-flows/{flow_id}")
    assert delete_res_1.status_code == 204
    delete_res_2 = client.delete(f"/cargo-flows/{outbound_id}")
    assert delete_res_2.status_code == 204

    # 11. Verify deletion from list
    list_res_2 = client.get(f"/scenarios/{scenario_id}/cargo-flows")
    assert flow_id not in [f["id"] for f in list_res_2.json()]
    assert outbound_id not in [f["id"] for f in list_res_2.json()]

    # Cleanup leftover DB records
    db_flow = db_session.query(CargoFlowModel).filter(CargoFlowModel.id == flow_id).first()
    if db_flow:
        db_session.delete(db_flow)
    db_tenant = db_session.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if db_tenant:
        db_session.delete(db_tenant)
    db_commodity = db_session.query(CommodityModel).filter(CommodityModel.id == commodity_id).first()
    if db_commodity:
        db_session.delete(db_commodity)
    db_scenario = db_session.query(ScenarioModel).filter(ScenarioModel.id == scenario_id).first()
    if db_scenario:
        db_session.delete(db_scenario)
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if db_project:
        db_session.delete(db_project)
    db_session.commit()
