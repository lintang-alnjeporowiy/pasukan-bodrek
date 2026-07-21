import pytest
import uuid
from uuid import uuid4

from fastapi.testclient import TestClient
from src.main import app
from src.infrastructure.database.session import SessionLocal
from src.infrastructure.database.models.project import ProjectModel
from src.infrastructure.database.models.scenario import ScenarioModel
from src.infrastructure.database.models.tenant import TenantModel
from src.infrastructure.database.models.commodity import CommodityModel
from src.infrastructure.database.models.cargo_flow import CargoFlowModel
from src.application.calculation.demand_projection import DemandProjectionService

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    """Provides a database session for test verification and cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_demand_projection_calculation():
    # Arrange variables
    cargo_flow_id = uuid4()
    planning_horizon = 5
    start_year = 2
    base_year = 2026
    initial_demand = 1000.0
    growth_rate = 0.05
    maximum_demand = 1080.0

    # Act
    result = DemandProjectionService.calculate_projection(
        cargo_flow_id=cargo_flow_id,
        planning_horizon=planning_horizon,
        start_year=start_year,
        base_year=base_year,
        initial_demand=initial_demand,
        growth_rate=growth_rate,
        maximum_demand=maximum_demand
    )

    # Assert
    assert result.cargo_flow_id == cargo_flow_id
    assert result.planning_horizon == planning_horizon
    assert len(result.projections) == 5

    # Year 1 (calendar 2026): before start_year (2)
    assert result.projections[0].year == 1
    assert result.projections[0].calendar_year == 2026
    assert result.projections[0].demand == 0.0
    assert "Di bawah operation start year" in result.projections[0].trace

    # Year 2 (calendar 2027): start_year (2)
    assert result.projections[1].year == 2
    assert result.projections[1].calendar_year == 2027
    assert result.projections[1].demand == 1000.0
    assert "Operation start year" in result.projections[1].trace

    # Year 3 (calendar 2028): 1000 * 1.05 = 1050
    assert result.projections[2].year == 3
    assert result.projections[2].calendar_year == 2028
    assert pytest.approx(result.projections[2].demand) == 1050.0
    assert "Demand tumbuh dari" in result.projections[2].trace

    # Year 4 (calendar 2029): 1050 * 1.05 = 1102.5 -> capped at 1080
    assert result.projections[3].year == 4
    assert result.projections[3].calendar_year == 2029
    assert result.projections[3].demand == 1080.0
    assert "melebihi kapasitas maksimum" in result.projections[3].trace

    # Year 5 (calendar 2030): 1080 * 1.05 = 1134 -> capped at 1080
    assert result.projections[4].year == 5
    assert result.projections[4].calendar_year == 2030
    assert result.projections[4].demand == 1080.0


def test_api_projection_endpoint(db_session):
    # Create project, scenario, tenant, commodity
    project = ProjectModel(
        name="Test Projection Project",
        base_year=2026,
        planning_horizon=5
    )
    db_session.add(project)
    db_session.commit()

    scenario = ScenarioModel(
        project_id=project.id,
        name="Test Scenario",
        status="DRAFT"
    )
    db_session.add(scenario)
    db_session.commit()

    commodity = CommodityModel(
        name="Projection Wheat",
        unit="Ton",
        is_active=True
    )
    db_session.add(commodity)
    db_session.commit()

    tenant = TenantModel(
        project_id=project.id,
        name="Projection Tenant",
        is_active=True
    )
    db_session.add(tenant)
    db_session.commit()

    # Create cargo flow with specific values
    response = client.post(
        f"/scenarios/{scenario.id}/cargo-flows",
        json={
            "tenant_id": str(tenant.id),
            "commodity_id": str(commodity.id),
            "direction": "INBOUND",
            "origin": "India",
            "destination_port": "KEK Terminal",
            "base_annual_demand": 1000.0,
            "unit": "Ton",
            "start_year": 2,
            "growth_rate": 0.05,
            "maximum_demand": 1080.0
        }
    )
    assert response.status_code == 201
    flow_id = response.json()["id"]

    # Call projection endpoint
    proj_response = client.get(f"/cargo-flows/{flow_id}/projection")
    assert proj_response.status_code == 200
    
    data = proj_response.json()
    assert data["cargo_flow_id"] == flow_id
    assert data["planning_horizon"] == 5
    assert data["start_year"] == 2
    assert data["initial_demand"] == 1000.0
    assert data["growth_rate"] == 0.05
    assert data["maximum_demand"] == 1080.0
    assert len(data["projections"]) == 5
    assert data["projections"][0]["demand"] == 0.0
    assert data["projections"][1]["demand"] == 1000.0
    assert data["projections"][2]["demand"] == 1050.0
    assert data["projections"][3]["demand"] == 1080.0
    assert data["projections"][4]["demand"] == 1080.0

    # Cleanup leftover DB records
    db_flow = db_session.query(CargoFlowModel).filter(CargoFlowModel.id == uuid.UUID(flow_id)).first()
    if db_flow:
        db_session.delete(db_flow)
    db_tenant = db_session.query(TenantModel).filter(TenantModel.id == tenant.id).first()
    if db_tenant:
        db_session.delete(db_tenant)
    db_commodity = db_session.query(CommodityModel).filter(CommodityModel.id == commodity.id).first()
    if db_commodity:
        db_session.delete(db_commodity)
    db_scenario = db_session.query(ScenarioModel).filter(ScenarioModel.id == scenario.id).first()
    if db_scenario:
        db_session.delete(db_scenario)
    db_project = db_session.query(ProjectModel).filter(ProjectModel.id == project.id).first()
    if db_project:
        db_session.delete(db_project)
    db_session.commit()

