import pytest
import uuid
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.vessel import VesselModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_vessel_crud_and_validation(db_session):
    """Test full CRUD lifecycle and validation rules for Vessels on PostgreSQL."""
    payload = {
        "name": "MV Nusantara Perdana",
        "code": "NSP-01",
        "ship_type": "CONTAINER_SHIP",
        "is_active": True,
        "description": "Kapal Petikemas Feeder Domestic",
        # Principal Dimensions
        "loa": 185.5,
        "beam": 28.0,
        "draft": 9.5,
        "depth": 14.2,
        "dwt": 25000.0,
        "gt": 18000.0,
        # Cargo
        "capacity": 1600.0,
        "capacity_unit": "TEU",
        # Operational
        "service_speed_knots": 16.5,
        "operating_speed_knots": 14.5,
        # Machinery
        "main_engine_power_kw": 12000.0,
        "aux_engine_power_kw": 1200.0,
        # Fuel
        "me_sfoc": 175.0,
        "me_sea_load_factor": 0.85,
        "me_port_load_factor": 0.10,
        "ae_sfoc": 210.0,
        "ae_sea_load_factor": 0.70,
        "ae_port_load_factor": 0.40,
        # Commercial
        "charter_rate": 15000.0,
        "charter_rate_basis": "PER_DAY"
    }

    # 1. Create Vessel
    create_res = client.post("/vessels", json=payload)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["name"] == payload["name"]
    assert data["main_engine_power_kw"] == 12000.0
    assert data["charter_rate"] == 15000.0
    assert data["charter_rate_basis"] == "PER_DAY"
    vessel_id = data["id"]

    # 2. Get All Vessels
    list_res = client.get("/vessels")
    assert list_res.status_code == 200
    vessels = list_res.json()
    assert any(v["id"] == vessel_id for v in vessels)

    # 3. Get Vessel by ID
    get_res = client.get(f"/vessels/{vessel_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == payload["name"]

    # 4. Update Vessel
    update_res = client.patch(f"/vessels/{vessel_id}", json={"operating_speed_knots": 15.0, "charter_rate": 16000.0})
    assert update_res.status_code == 200
    assert update_res.json()["operating_speed_knots"] == 15.0
    assert update_res.json()["charter_rate"] == 16000.0

    # 5. Validations
    # Invalid Main Engine Power <= 0
    assert client.post("/vessels", json={**payload, "main_engine_power_kw": 0.0}).status_code == 422
    # Invalid Operating Speed <= 0
    assert client.post("/vessels", json={**payload, "operating_speed_knots": -1.0}).status_code == 422
    # Invalid Charter Rate < 0
    assert client.post("/vessels", json={**payload, "charter_rate": -500.0}).status_code == 422

    # 6. Delete Vessel
    del_res = client.delete(f"/vessels/{vessel_id}")
    assert del_res.status_code == 204

    # Clean up verification
    assert client.get(f"/vessels/{vessel_id}").status_code == 404
