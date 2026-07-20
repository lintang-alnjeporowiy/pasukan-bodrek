from dataclasses import dataclass
from typing import Dict, Optional

@dataclass
class SystemParameterDef:
    key: str
    name: str
    default_value: str
    unit: str
    category: str
    description: str
    data_type: str = "float"

SYSTEM_PARAMETERS_REGISTRY: Dict[str, SystemParameterDef] = {
    "OUTBOUND_CONVERSION_FACTOR": SystemParameterDef(
        key="OUTBOUND_CONVERSION_FACTOR",
        name="Outbound Cargo Conversion Factor",
        default_value="0.50",
        unit="Ratio",
        category="Cargo Conversion",
        description="Default conversion multiplier for derived outbound cargo flows.",
        data_type="float"
    ),
    "MAXIMUM_BOR": SystemParameterDef(
        key="MAXIMUM_BOR",
        name="Maximum Berth Occupancy Ratio (BOR)",
        default_value="0.70",
        unit="Ratio",
        category="Port Planning",
        description="Maximum allowable berth occupancy ratio before port congestion occurs.",
        data_type="float"
    ),
    "PORT_STAY_BUFFER_HOURS": SystemParameterDef(
        key="PORT_STAY_BUFFER_HOURS",
        name="Port Stay Operational Buffer",
        default_value="4.0",
        unit="Hours",
        category="Port Operations",
        description="Operational safety buffer added to total port stay duration.",
        data_type="float"
    ),
    "DEFAULT_CARGO_GROWTH_RATE": SystemParameterDef(
        key="DEFAULT_CARGO_GROWTH_RATE",
        name="Default Cargo Growth Rate",
        default_value="0.02",
        unit="Decimal",
        category="Demand Projection",
        description="Default annual compound growth rate used for long-term demand forecasting.",
        data_type="float"
    ),
}

def get_system_parameter_def(key: str) -> Optional[SystemParameterDef]:
    return SYSTEM_PARAMETERS_REGISTRY.get(key)
