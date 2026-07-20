from dataclasses import dataclass
from typing import Optional

@dataclass
class ResolvedParameter:
    parameter_key: str
    parameter_name: str
    category: str
    system_default_value: str
    effective_value: str
    unit: str
    source: str  # "SCENARIO_OVERRIDE" | "PROJECT_DEFAULT" | "SYSTEM_DEFAULT"
    is_overridden: bool
    description: str
    project_default_value: Optional[str] = None
    override_value: Optional[str] = None
    reason: Optional[str] = None
