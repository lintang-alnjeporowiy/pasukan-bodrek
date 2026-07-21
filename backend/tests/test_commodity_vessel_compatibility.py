import pytest
import uuid
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.vessel import VesselModel
from src.infrastructure.database.models.commodity_vessel_compatibility import CommodityVesselCompatibilityModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_commodity_vessel_compatibility_crud(db_session):
    """Test full CRUD lifecycle and duplicate prohibition for Commodity-Vessel Compatibility."""
    # 1. Create a Commodity
    comm = CommodityModel(name="Batubara Bulk", code="COAL-01", unit="Ton", is_active=True)
    db_session.add(comm)
    
    # 2. Create Vessels
    v1 = VesselModel(
        name="MV Bulk Cargo 01", ship_type="BULK_CARRIER", loa=190.0, beam=30.0, draft=10.0, depth=15.0,
        dwt=35000.0, capacity=32000.0, capacity_unit="Ton", service_speed_knots=14.0, operating_speed_knots=13.5,
        main_engine_power_kw=8000.0, aux_engine_power_kw=800.0, me_sfoc=180.0, me_sea_load_factor=0.85,
        me_port_load_factor=0.10, ae_sfoc=220.0, ae_sea_load_factor=0.70, ae_port_load_factor=0.50,
        charter_rate=12000.0, charter_rate_basis="PER_DAY", is_active=True
    )
    v2 = VesselModel(
        name="MV Bulk Cargo 02", ship_type="BULK_CARRIER", loa=200.0, beam=32.0, draft=11.0, depth=16.0,
        dwt=45000.0, capacity=42000.0, capacity_unit="Ton", service_speed_knots=14.5, operating_speed_knots=14.0,
        main_engine_power_kw=9500.0, aux_engine_power_kw=900.0, me_sfoc=180.0, me_sea_load_factor=0.85,
        me_port_load_factor=0.10, ae_sfoc=220.0, ae_sea_load_factor=0.70, ae_port_load_factor=0.50,
        charter_rate=15000.0, charter_rate_basis="PER_DAY", is_active=True
    )
    db_session.add(v1)
    db_session.add(v2)
    db_session.commit()

    comm_id = str(comm.id)
    v1_id = str(v1.id)
    v2_id = str(v2.id)

    # 3. Create Compatibility Mapping
    create_res = client.post("/commodity-vessel-compatibilities", json={
        "commodity_id": comm_id,
        "vessel_id": v1_id,
        "notes": "Spesifikasi kapal curah kering cocok untuk batubara"
    })
    assert create_res.status_code == 201
    comp_data = create_res.json()
    assert comp_data["commodity_id"] == comm_id
    assert comp_data["vessel_id"] == v1_id
    comp_id = comp_data["id"]

    # 4. Duplicate prohibition check
    dup_res = client.post("/commodity-vessel-compatibilities", json={
        "commodity_id": comm_id,
        "vessel_id": v1_id
    })
    assert dup_res.status_code == 409

    # 5. List compatibilities by commodity
    list_res = client.get(f"/commodity-vessel-compatibilities?commodity_id={comm_id}")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 6. Batch update compatible vessels for commodity
    batch_res = client.put("/commodity-vessel-compatibilities/batch", json={
        "commodity_id": comm_id,
        "vessel_ids": [v1_id, v2_id]
    })
    assert batch_res.status_code == 200
    batch_data = batch_res.json()
    assert len(batch_data) == 2

    # 7. Delete one mapping using new id
    del_target_id = batch_data[0]["id"]
    del_res = client.delete(f"/commodity-vessel-compatibilities/{del_target_id}")
    assert del_res.status_code == 204


    # Cleanup
    db_session.query(CommodityVesselCompatibilityModel).filter(CommodityVesselCompatibilityModel.commodity_id == comm.id).delete()
    db_session.delete(v1)
    db_session.delete(v2)
    db_session.delete(comm)
    db_session.commit()
