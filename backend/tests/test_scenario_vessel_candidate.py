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
from src.infrastructure.database.models.scenario_vessel_candidate import ScenarioVesselCandidateModel

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_scenario_vessel_candidate_manual_selection(db_session):
    # 1. Setup entities
    project = ProjectModel(name="Proyek Armada Selection", base_year=2026, planning_horizon=20)
    db_session.add(project)
    db_session.commit()

    scenario = ScenarioModel(project_id=project.id, name="Skenario Optimasi 1")
    tenant = TenantModel(project_id=project.id, name="Tenant Optimasi")
    db_session.add(scenario)
    db_session.add(tenant)
    db_session.commit()

    sp = StudyPortModel(project_id=project.id, name="SP Test", location="Test", latitude=0.0, longitude=0.0, max_draft=15.0, max_loa=250.0)
    ep = ExternalPortModel(name="EP Test", country="ID", latitude=0.0, longitude=0.0, max_draft=15.0, max_loa=250.0)
    db_session.add(sp)
    db_session.add(ep)
    db_session.commit()

    route = RouteModel(project_id=project.id, study_port_id=sp.id, external_port_id=ep.id, name="Route Test", direction="INBOUND", distance_nm=100.0)
    comm = CommodityModel(name="Curah Test", code="CRH-01", unit="Ton")
    db_session.add(route)
    db_session.add(comm)
    db_session.commit()

    cf = CargoFlowModel(
        scenario_id=scenario.id, tenant_id=tenant.id, commodity_id=comm.id, route_id=route.id,
        direction="INBOUND", origin="EP Test", destination_port="SP Test", base_annual_demand=500000.0, unit="Ton"
    )
    v1 = VesselModel(name="Vessel Candidate A", ship_type="BULK_CARRIER", loa=150.0, beam=20.0, draft=7.0, depth=10.0, dwt=15000.0, capacity=14000.0, capacity_unit="Ton", service_speed_knots=12.0, is_active=True)
    v2 = VesselModel(name="Vessel Candidate B", ship_type="BULK_CARRIER", loa=160.0, beam=22.0, draft=8.0, depth=11.0, dwt=18000.0, capacity=17000.0, capacity_unit="Ton", service_speed_knots=13.0, is_active=True)

    db_session.add(cf)
    db_session.add(v1)
    db_session.add(v2)
    db_session.commit()

    # 2. Save manual selection (choose v1 only)
    save_res = client.put(
        f"/scenarios/{scenario.id}/cargo-flows/{cf.id}/candidate-vessels",
        json={"selected_vessel_ids": [str(v1.id)]}
    )
    assert save_res.status_code == 200
    saved_ids = save_res.json()
    assert len(saved_ids) == 1
    assert saved_ids[0] == str(v1.id)

    # 3. Retrieve candidates via candidate-vessels endpoint
    get_res = client.get(f"/cargo-flows/{cf.id}/candidate-vessels?scenario_id={scenario.id}")
    assert get_res.status_code == 200
    data = get_res.json()

    candidates_map = {item["vessel"]["id"]: item for item in data["candidates"]}
    assert candidates_map[str(v1.id)]["is_selected_for_scenario"] is True
    assert candidates_map[str(v2.id)]["is_selected_for_scenario"] is False

    # Cleanup
    db_session.query(ScenarioVesselCandidateModel).filter(ScenarioVesselCandidateModel.scenario_id == scenario.id).delete()
    db_session.delete(cf)
    db_session.delete(v1)
    db_session.delete(v2)
    db_session.delete(comm)
    db_session.delete(route)
    db_session.delete(sp)
    db_session.delete(ep)
    db_session.delete(tenant)
    db_session.delete(scenario)
    db_session.delete(project)
    db_session.commit()
