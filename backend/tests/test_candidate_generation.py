import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.scenario import ScenarioModel
from src.infrastructure.database.models.tenant import TenantModel
from src.infrastructure.database.models.study_port import StudyPortModel
from src.infrastructure.database.models.external_port import ExternalPortModel
from src.infrastructure.database.models.route import RouteModel
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.cargo_flow import CargoFlowModel
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

def test_candidate_generation_pipeline(db_session):
    # 1. Create Project, Scenario & Tenant
    project = ProjectModel(name="Proyek Pembangkit Jawa", base_year=2026, planning_horizon=20)
    db_session.add(project)
    db_session.commit()

    scenario = ScenarioModel(project_id=project.id, name="Skenario Baseline")
    tenant = TenantModel(project_id=project.id, name="Tenant Utama")
    db_session.add(scenario)
    db_session.add(tenant)
    db_session.commit()

    sp = StudyPortModel(project_id=project.id, name="SP Jepara", location="Jepara", latitude=-6.5, longitude=110.6, max_draft=12.0, max_loa=220.0)
    ep = ExternalPortModel(name="EP Kalimantan", country="Indonesia", latitude=-1.2, longitude=116.8, max_draft=9.0, max_loa=190.0)
    db_session.add(sp)
    db_session.add(ep)
    db_session.commit()

    # 2. Create Route & Commodity
    route = RouteModel(project_id=project.id, study_port_id=sp.id, external_port_id=ep.id, name="Route Batubara", direction="INBOUND", distance_nm=350.0)
    comm = CommodityModel(name="Batubara High Calorie", code="COAL-HC", unit="Ton")
    db_session.add(route)
    db_session.add(comm)
    db_session.commit()

    # 3. Create Cargo Flow
    cf = CargoFlowModel(
        scenario_id=scenario.id,
        tenant_id=tenant.id,
        commodity_id=comm.id,
        route_id=route.id,
        direction="INBOUND",
        origin="EP Kalimantan",
        destination_port="SP Jepara",
        base_annual_demand=1000000.0,
        unit="Ton"
    )
    db_session.add(cf)
    db_session.commit()

    # 4. Create 3 Vessels
    # Vessel 1: Fully compatible
    v1 = VesselModel(name="Vessel 1 OK", ship_type="BULK_CARRIER", loa=170.0, beam=26.0, draft=8.0, depth=12.0, dwt=25000.0, capacity=24000.0, capacity_unit="Ton", service_speed_knots=14.0, operating_speed_knots=13.0, main_engine_power_kw=6000.0, aux_engine_power_kw=600.0, is_active=True)
    # Vessel 2: Draft 10.5m exceeds EP max_draft (9.0m)
    v2 = VesselModel(name="Vessel 2 Deep", ship_type="BULK_CARRIER", loa=180.0, beam=28.0, draft=10.5, depth=14.0, dwt=35000.0, capacity=33000.0, capacity_unit="Ton", service_speed_knots=14.0, operating_speed_knots=13.0, main_engine_power_kw=7500.0, aux_engine_power_kw=700.0, is_active=True)
    # Vessel 3: Not registered in commodity compatibility
    v3 = VesselModel(name="Vessel 3 Incompatible Cargo", ship_type="TANKER", loa=160.0, beam=25.0, draft=7.5, depth=11.0, dwt=20000.0, capacity=19000.0, capacity_unit="m3", service_speed_knots=15.0, operating_speed_knots=14.0, main_engine_power_kw=5500.0, aux_engine_power_kw=500.0, is_active=True)

    db_session.add(v1)
    db_session.add(v2)
    db_session.add(v3)
    db_session.commit()

    # 5. Set Commodity compatibility for v1 and v2 only
    comp1 = CommodityVesselCompatibilityModel(commodity_id=comm.id, vessel_id=v1.id, is_active=True)
    comp2 = CommodityVesselCompatibilityModel(commodity_id=comm.id, vessel_id=v2.id, is_active=True)
    db_session.add(comp1)
    db_session.add(comp2)
    db_session.commit()


    # 6. Execute Candidate Generation API
    res = client.get(f"/cargo-flows/{cf.id}/candidate-vessels?scenario_id={scenario.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["total_vessels_evaluated"] >= 3

    candidates = {item["vessel"]["name"]: item for item in data["candidates"]}
    
    # Vessel 1: OK
    assert candidates["Vessel 1 OK"]["is_compatible"] is True, f"Rejection reasons: {candidates['Vessel 1 OK']['rejection_reasons']}"

    
    # Vessel 2: Rejected (Draft > 9.0m)
    assert candidates["Vessel 2 Deep"]["is_compatible"] is False
    assert len(candidates["Vessel 2 Deep"]["rejection_reasons"]) > 0

    # Vessel 3: Rejected (Commodity incompatibility)
    assert candidates["Vessel 3 Incompatible Cargo"]["is_compatible"] is False


    # Cleanup
    db_session.query(CommodityVesselCompatibilityModel).filter(CommodityVesselCompatibilityModel.commodity_id == comm.id).delete()
    db_session.delete(cf)
    db_session.delete(v1)
    db_session.delete(v2)
    db_session.delete(v3)
    db_session.delete(comm)
    db_session.delete(route)
    db_session.delete(sp)
    db_session.delete(ep)
    db_session.delete(tenant)
    db_session.delete(scenario)
    db_session.delete(project)
    db_session.commit()
