import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.commodity import CommodityModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_commodity_lifecycle(db_session):
    """Test creating, retrieving, updating, listing, and deleting commodities."""
    # 1. Create a commodity
    commodity_data = {
        "name": "Batubara",
        "code": "C-COAL",
        "unit": "Ton",
        "description": "Commodity batubara bulk",
        "is_active": True
    }
    response = client.post("/commodities", json=commodity_data)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["name"] == commodity_data["name"]
    assert res_data["code"] == commodity_data["code"]
    assert res_data["unit"] == commodity_data["unit"]
    assert res_data["is_active"] is True
    assert "id" in res_data
    commodity_id = res_data["id"]

    # 2. Get the commodity by ID
    get_response = client.get(f"/commodities/{commodity_id}")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["id"] == commodity_id
    assert get_data["name"] == commodity_data["name"]

    # 3. List commodities
    list_response = client.get("/commodities")
    assert list_response.status_code == 200
    list_data = list_response.json()
    commodity_ids = [c["id"] for c in list_data]
    assert commodity_id in commodity_ids

    # 4. Update the commodity details (PATCH)
    update_data = {
        "name": "Batubara Kalori Tinggi",
        "code": "C-COAL-HG",
        "unit": "Ton",
        "is_active": False
    }
    patch_response = client.patch(f"/commodities/{commodity_id}", json=update_data)
    assert patch_response.status_code == 200
    patch_data = patch_response.json()
    assert patch_data["id"] == commodity_id
    assert patch_data["name"] == "Batubara Kalori Tinggi"
    assert patch_data["code"] == "C-COAL-HG"
    assert patch_data["is_active"] is False

    # Verify update persisted
    get_response_2 = client.get(f"/commodities/{commodity_id}")
    assert get_response_2.status_code == 200
    assert get_response_2.json()["name"] == "Batubara Kalori Tinggi"

    # 5. Delete the commodity
    delete_response = client.delete(f"/commodities/{commodity_id}")
    assert delete_response.status_code == 204

    # Verify commodity deleted from list
    list_response_2 = client.get("/commodities")
    assert list_response_2.status_code == 200
    commodity_ids_2 = [c["id"] for c in list_response_2.json()]
    assert commodity_id not in commodity_ids_2

    # 6. Clean up the database record if still exists
    db_commodity = db_session.query(CommodityModel).filter(CommodityModel.id == commodity_id).first()
    if db_commodity:
        db_session.delete(db_commodity)
        db_session.commit()
