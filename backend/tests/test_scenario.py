import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.scenario import ScenarioModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_scenario_lifecycle(db_session):
    """Test creating, retrieving, and listing scenarios."""
    # 1. Create a project (required as foreign key)
    project_data = {
        "name": "Project for Scenario Test",
        "description": "Project to test scenario creation",
        "location": "Surabaya",
        "base_year": 2026,
        "planning_horizon": 10
    }
    project_response = client.post("/projects", json=project_data)
    assert project_response.status_code == 201
    project_res = project_response.json()
    project_id = project_res["id"]

    # 2. Create a scenario under the project
    scenario_data = {
        "project_id": project_id,
        "parent_scenario_id": None,
        "name": "Scenario Baseline",
        "description": "Baseline scenario with default configuration",
        "status": "DRAFT"
    }
    scenario_response = client.post("/scenarios", json=scenario_data)
    assert scenario_response.status_code == 201
    scenario_res = scenario_response.json()
    assert scenario_res["name"] == scenario_data["name"]
    assert scenario_res["status"] == "DRAFT"
    assert scenario_res["project_id"] == project_id
    assert "id" in scenario_res
    scenario_id = scenario_res["id"]

    # 3. Retrieve the scenario by ID
    get_response = client.get(f"/scenarios/{scenario_id}")
    assert get_response.status_code == 200
    get_res = get_response.json()
    assert get_res["id"] == scenario_id
    assert get_res["name"] == scenario_data["name"]

    # 4. List scenarios by project ID
    list_response = client.get(f"/projects/{project_id}/scenarios")
    assert list_response.status_code == 200
    list_res = list_response.json()
    assert len(list_res) == 1
    assert list_res[0]["id"] == scenario_id

    # 5. Update the scenario details (PATCH)
    update_data = {
        "name": "Scenario Baseline Updated",
        "description": "Baseline scenario description updated",
        "status": "READY"
    }
    patch_response = client.patch(f"/scenarios/{scenario_id}", json=update_data)
    assert patch_response.status_code == 200
    patch_res = patch_response.json()
    assert patch_res["id"] == scenario_id
    assert patch_res["name"] == "Scenario Baseline Updated"
    assert patch_res["description"] == "Baseline scenario description updated"
    assert patch_res["status"] == "READY"

    # Verify update persisted
    get_response_2 = client.get(f"/scenarios/{scenario_id}")
    assert get_response_2.status_code == 200
    get_res_2 = get_response_2.json()
    assert get_res_2["name"] == "Scenario Baseline Updated"

    # 6. Delete the scenario
    delete_response = client.delete(f"/scenarios/{scenario_id}")
    assert delete_response.status_code == 204

    # Verify scenario deleted from project list
    list_response_2 = client.get(f"/projects/{project_id}/scenarios")
    assert list_response_2.status_code == 200
    assert len(list_response_2.json()) == 0

    # 7. Clean up the database project record
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if db_project:
        db_session.delete(db_project)
    db_session.commit()
