from src.api.routes.project import router as project_router
from src.api.routes.scenario import router as scenario_router
from src.api.routes.commodity import router as commodity_router
from src.api.routes.tenant import router as tenant_router
from src.api.routes.cargo_flow import router as cargo_flow_router
from src.api.routes.cargo_conversion_rule import router as cargo_conversion_rule_router
from src.api.routes.scenario_parameter import router as scenario_parameter_router

__all__ = [
    "project_router",
    "scenario_router",
    "commodity_router",
    "tenant_router",
    "cargo_flow_router",
    "cargo_conversion_rule_router",
    "scenario_parameter_router",
]
