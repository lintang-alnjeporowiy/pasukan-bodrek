import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.tenant import TenantModel
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

def test_tenant_lifecycle(db_session):
    """Test creating, retrieving, listing (with scoping), updating, and deleting tenants."""
    # 1. Create a test project
    project_payload = {
        "name": "Project Tenant Test",
        "description": "Project for testing tenant CRUD scoping",
        "base_year": 2026,
        "planning_horizon": 25
    }
    proj_res = client.post("/projects", json=project_payload)
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Create a test commodity
    commodity_payload = {
        "name": "CPO",
        "unit": "Ton",
        "is_active": True
    }
    comm_res = client.post("/commodities", json=commodity_payload)
    assert comm_res.status_code == 201
    commodity_id = comm_res.json()["id"]

    # 3. Create a tenant for the project
    tenant_payload = {
        "name": "PT Sawit Sejahtera",
        "commodity_id": commodity_id,
        "description": "Tenant pengolah CPO",
        "is_active": True
    }
    tenant_res = client.post(f"/projects/{project_id}/tenants", json=tenant_payload)
    assert tenant_res.status_code == 201
    tenant_data = tenant_res.json()
    assert tenant_data["name"] == tenant_payload["name"]
    assert tenant_data["project_id"] == project_id
    assert tenant_data["commodity_id"] == commodity_id
    assert tenant_data["commodity_name"] == "CPO"
    assert tenant_data["is_active"] is True
    tenant_id = tenant_data["id"]

    # 4. Get the tenant by ID
    get_res = client.get(f"/tenants/{tenant_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "PT Sawit Sejahtera"

    # 5. List tenants for this project
    list_res = client.get(f"/projects/{project_id}/tenants")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert len(list_data) >= 1
    assert tenant_id in [t["id"] for t in list_data]

    # 6. List tenants for another random project (Verify scoping)
    other_project_id = str(uuid.uuid4())
    other_list_res = client.get(f"/projects/{other_project_id}/tenants")
    assert other_list_res.status_code == 200
    assert len(other_list_res.json()) == 0

    # 7. Update the tenant (PATCH)
    update_payload = {
        "name": "PT Sawit Sejahtera Jaya",
        "is_active": False
    }
    patch_res = client.patch(f"/tenants/{tenant_id}", json=update_payload)
    assert patch_res.status_code == 200
    patch_data = patch_res.json()
    assert patch_data["name"] == "PT Sawit Sejahtera Jaya"
    assert patch_data["is_active"] is False

    # 8. Delete the tenant
    delete_res = client.delete(f"/tenants/{tenant_id}")
    assert delete_res.status_code == 204

    # 9. Verify deletion from list
    list_res_2 = client.get(f"/projects/{project_id}/tenants")
    assert tenant_id not in [t["id"] for t in list_res_2.json()]

    # Cleanup leftover DB records
    db_tenant = db_session.query(TenantModel).filter(TenantModel.id == tenant_id).first()
    if db_tenant:
        db_session.delete(db_tenant)
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if db_project:
        db_session.delete(db_project)
    db_commodity = db_session.query(CommodityModel).filter(CommodityModel.id == commodity_id).first()
    if db_commodity:
        db_session.delete(db_commodity)
    db_session.commit()
