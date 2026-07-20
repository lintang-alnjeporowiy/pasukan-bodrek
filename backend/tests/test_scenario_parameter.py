import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.scenario import ScenarioModel
from src.infrastructure.database.models.scenario_parameter import (
    ProjectParameterModel,
    ScenarioParameterOverrideModel,
)

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_scenario_parameter_override_precedence(db_session: Session):
    # 1. Create a project and scenario
    project_payload = {
        "name": "Parameter Test Project",
        "description": "Project for testing parameter precedence hierarchy",
        "location": "Jakarta",
        "base_year": 2026,
        "planning_horizon": 20
    }
    p_res = client.post("/projects", json=project_payload)
    assert p_res.status_code == 201
    project_id = p_res.json()["id"]

    scenario_payload = {
        "project_id": project_id,
        "parent_scenario_id": None,
        "name": "Parameter Test Scenario",
        "description": "Scenario for testing parameter overrides",
        "status": "DRAFT"
    }
    s_res = client.post("/scenarios", json=scenario_payload)
    assert s_res.status_code == 201
    scenario_id = s_res.json()["id"]

    param_key = "OUTBOUND_CONVERSION_FACTOR"

    # Step A: Test System Default fallback (No project or scenario overrides set)
    res_a = client.get(f"/scenarios/{scenario_id}/parameters/{param_key}")
    assert res_a.status_code == 200
    data_a = res_a.json()
    assert data_a["system_default_value"] == "0.50"
    assert data_a["project_default_value"] is None
    assert data_a["override_value"] is None
    assert data_a["effective_value"] == "0.50"
    assert data_a["source"] == "SYSTEM_DEFAULT"
    assert data_a["is_overridden"] is False

    # Step B: Set Project Default ("0.65")
    proj_req = {
        "parameter_key": param_key,
        "value": "0.65"
    }
    p_def_res = client.post(f"/projects/{project_id}/parameters/default", json=proj_req)
    assert p_def_res.status_code == 200

    # Verify resolution: Effective value should now be Project Default ("0.65")
    res_b = client.get(f"/scenarios/{scenario_id}/parameters/{param_key}")
    assert res_b.status_code == 200
    data_b = res_b.json()
    assert data_b["system_default_value"] == "0.50"
    assert data_b["project_default_value"] == "0.65"
    assert data_b["override_value"] is None
    assert data_b["effective_value"] == "0.65"
    assert data_b["source"] == "PROJECT_DEFAULT"
    assert data_b["is_overridden"] is False

    # Step C: Set Scenario Parameter Override ("0.60")
    scen_req = {
        "parameter_key": param_key,
        "override_value": "0.60",
        "reason": "Testing sensitivity scenario override"
    }
    scen_override_res = client.post(f"/scenarios/{scenario_id}/parameters/override", json=scen_req)
    assert scen_override_res.status_code == 200
    data_c = scen_override_res.json()
    assert data_c["system_default_value"] == "0.50"
    assert data_c["project_default_value"] == "0.65"
    assert data_c["override_value"] == "0.60"
    assert data_c["effective_value"] == "0.60"
    assert data_c["source"] == "SCENARIO_OVERRIDE"
    assert data_c["is_overridden"] is True
    assert data_c["reason"] == "Testing sensitivity scenario override"

    # Step D: Test List All Parameters endpoint
    list_res = client.get(f"/scenarios/{scenario_id}/parameters")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["scenario_id"] == scenario_id
    assert len(list_data["parameters"]) >= 4

    # Step E: Delete Scenario Parameter Override (Revert to Project Default)
    del_override_res = client.delete(f"/scenarios/{scenario_id}/parameters/override/{param_key}")
    assert del_override_res.status_code == 200
    data_e = del_override_res.json()
    assert data_e["override_value"] is None
    assert data_e["effective_value"] == "0.65"  # Reverted to Project Default
    assert data_e["source"] == "PROJECT_DEFAULT"
    assert data_e["is_overridden"] is False

    # Cleanup DB records
    db_session.query(ScenarioParameterOverrideModel).filter(ScenarioParameterOverrideModel.scenario_id == uuid.UUID(scenario_id)).delete()
    db_session.query(ProjectParameterModel).filter(ProjectParameterModel.project_id == uuid.UUID(project_id)).delete()
    db_session.query(ScenarioModel).filter(ScenarioModel.id == uuid.UUID(scenario_id)).delete()
    db_session.query(ProjectModel).filter(ProjectModel.id == uuid.UUID(project_id)).delete()
    db_session.commit()
