import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.cargo_conversion_rule import CargoConversionRuleModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_conversion_rule_crud_and_calculation(db_session: Session):
    # 0. Initial table cleanup for test isolation
    db_session.query(CargoConversionRuleModel).delete()
    db_session.commit()

    # 1. Create a commodity for test context
    commodity_payload = {
        "name": "Wheat Grain",
        "code": "WHEAT_TEST",
        "unit": "Ton",
        "description": "Test Commodity for conversion",
        "is_active": True
    }
    comm_res = client.post("/commodities", json=commodity_payload)
    assert comm_res.status_code == 201
    commodity_id = comm_res.json()["id"]

    # 2. Create a global conversion rule (Ton -> TEU, factor 0.55)
    global_rule_payload = {
        "commodity_id": None,
        "source_unit": "Ton",
        "target_unit": "TEU",
        "conversion_factor": 0.55,
        "description": "Standard containerization factor (1 ton wheat = 0.55 TEU)",
        "is_active": True
    }
    g_res = client.post("/conversion-rules", json=global_rule_payload)
    assert g_res.status_code == 201
    g_data = g_res.json()
    assert g_data["source_unit"] == "Ton"
    assert g_data["target_unit"] == "TEU"
    assert g_data["conversion_factor"] == 0.55
    global_rule_id = g_data["id"]

    # 3. Create a commodity-specific conversion rule (Wheat Ton -> Snack Ton, factor 0.50)
    spec_rule_payload = {
        "commodity_id": commodity_id,
        "source_unit": "Ton",
        "target_unit": "Snack Ton",
        "conversion_factor": 0.50,
        "description": "1 ton raw wheat yields 0.50 ton processed snack food",
        "is_active": True
    }
    s_res = client.post("/conversion-rules", json=spec_rule_payload)
    assert s_res.status_code == 201
    spec_data = s_res.json()
    assert spec_data["commodity_id"] == commodity_id
    assert spec_data["commodity_name"] == "Wheat Grain"
    spec_rule_id = spec_data["id"]

    # 4. List conversion rules
    list_res = client.get("/conversion-rules")
    assert list_res.status_code == 200
    rule_ids = [r["id"] for r in list_res.json()]
    assert global_rule_id in rule_ids
    assert spec_rule_id in rule_ids

    # 4b. Filter conversion rules by commodity_id
    filtered_res = client.get(f"/conversion-rules?commodity_id={commodity_id}")
    assert filtered_res.status_code == 200
    filtered_data = filtered_res.json()
    assert len(filtered_data) == 1
    assert filtered_data[0]["id"] == spec_rule_id

    # 5. Get rule by ID
    get_res = client.get(f"/conversion-rules/{global_rule_id}")
    assert get_res.status_code == 200
    assert get_res.json()["conversion_factor"] == 0.55

    # 6. Test Calculation Engine: Same unit conversion (Ton -> Ton)
    same_unit_payload = {
        "source_value": 500000.0,
        "source_unit": "Ton",
        "target_unit": "Ton"
    }
    calc_same_res = client.post("/cargo-conversions/convert", json=same_unit_payload)
    assert calc_same_res.status_code == 200
    same_calc_data = calc_same_res.json()
    assert same_calc_data["target_value"] == 500000.0
    assert same_calc_data["conversion_factor"] == 1.0
    assert same_calc_data["status"] == "SUCCESS"
    assert len(same_calc_data["steps"]) >= 2

    # 7. Test Calculation Engine: Rule-based conversion (500,000 Ton -> TEU)
    calc_rule_payload = {
        "source_value": 500000.0,
        "source_unit": "Ton",
        "target_unit": "TEU"
    }
    calc_res = client.post("/cargo-conversions/convert", json=calc_rule_payload)
    assert calc_res.status_code == 200
    calc_data = calc_res.json()
    assert calc_data["target_value"] == 275000.0  # 500000 * 0.55
    assert calc_data["conversion_factor"] == 0.55
    assert calc_data["applied_rule_id"] == global_rule_id
    assert calc_data["status"] == "SUCCESS"
    assert len(calc_data["steps"]) == 2
    assert "Rule Resolution" in calc_data["steps"][0]["description"]

    # 8. Test Calculation Engine: Commodity-specific conversion (100,000 Ton -> Snack Ton)
    calc_spec_payload = {
        "source_value": 100000.0,
        "source_unit": "Ton",
        "target_unit": "Snack Ton",
        "commodity_id": commodity_id
    }
    calc_spec_res = client.post("/cargo-conversions/convert", json=calc_spec_payload)
    assert calc_spec_res.status_code == 200
    spec_calc_data = calc_spec_res.json()
    assert spec_calc_data["target_value"] == 50000.0  # 100000 * 0.50
    assert spec_calc_data["applied_rule_id"] == spec_rule_id

    # 9. Test Calculation Engine Error: No active rule found for unknown conversion
    calc_err_payload = {
        "source_value": 100.0,
        "source_unit": "Ton",
        "target_unit": "UnknownUnit"
    }
    err_res = client.post("/cargo-conversions/convert", json=calc_err_payload)
    assert err_res.status_code == 422

    # 10. Update a conversion rule (PATCH)
    update_payload = {
        "conversion_factor": 0.60,
        "description": "Updated factor to 0.60"
    }
    patch_res = client.patch(f"/conversion-rules/{global_rule_id}", json=update_payload)
    assert patch_res.status_code == 200
    assert patch_res.json()["conversion_factor"] == 0.60

    # 11. Delete both conversion rules
    del_res_1 = client.delete(f"/conversion-rules/{global_rule_id}")
    assert del_res_1.status_code == 204
    del_res_2 = client.delete(f"/conversion-rules/{spec_rule_id}")
    assert del_res_2.status_code == 204

    # 12. Cleanup leftover DB commodity record
    db_comm = db_session.query(CommodityModel).filter(CommodityModel.id == uuid.UUID(commodity_id)).first()
    if db_comm:
        db_session.delete(db_comm)
        db_session.commit()
