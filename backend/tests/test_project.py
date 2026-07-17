import pytest
from uuid import uuid4
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_project_lifecycle(db_session):
    """Test creating, retrieving, and listing projects through API endpoints."""
    # 1. Create a project
    project_data = {
        "name": "Test Project Pelabuhan",
        "description": "Project test untuk simulasi perencanaan perairan pelabuhan",
        "location": "Jakarta",
        "base_year": 2026,
        "planning_horizon": 20
    }
    
    response = client.post("/projects", json=project_data)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["name"] == project_data["name"]
    assert res_data["location"] == project_data["location"]
    assert res_data["base_year"] == project_data["base_year"]
    assert res_data["planning_horizon"] == project_data["planning_horizon"]
    assert "id" in res_data
    
    project_id = res_data["id"]
    
    # 2. Get the project by ID
    get_response = client.get(f"/projects/{project_id}")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["id"] == project_id
    assert get_data["name"] == project_data["name"]
    
    # 3. List projects and verify our project is in the list
    list_response = client.get("/projects")
    assert list_response.status_code == 200
    list_data = list_response.json()
    project_ids = [p["id"] for p in list_data]
    assert project_id in project_ids

    # 4. Update the project details (PATCH)
    update_data = {
        "name": "Test Project Pelabuhan Updated",
        "base_year": 2028,
        "planning_horizon": 25
    }
    patch_response = client.patch(f"/projects/{project_id}", json=update_data)
    assert patch_response.status_code == 200
    patch_data = patch_response.json()
    assert patch_data["id"] == project_id
    assert patch_data["name"] == "Test Project Pelabuhan Updated"
    assert patch_data["base_year"] == 2028
    assert patch_data["planning_horizon"] == 25

    # Verify update persisted
    get_response_2 = client.get(f"/projects/{project_id}")
    assert get_response_2.status_code == 200
    assert get_response_2.json()["name"] == "Test Project Pelabuhan Updated"

    # 5. Clean up the database record
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if db_project:
        db_session.delete(db_project)
        db_session.commit()
