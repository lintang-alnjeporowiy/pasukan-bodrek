from uuid import UUID
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class ProjectParameterCreateRequest(BaseModel):
    parameter_key: str = Field(..., min_length=1, max_length=100, json_schema_extra={"example": "OUTBOUND_CONVERSION_FACTOR"})
    value: str = Field(..., min_length=1, max_length=255, json_schema_extra={"example": "0.65"})

class ScenarioParameterOverrideRequest(BaseModel):
    parameter_key: str = Field(..., min_length=1, max_length=100, json_schema_extra={"example": "OUTBOUND_CONVERSION_FACTOR"})
    override_value: str = Field(..., min_length=1, max_length=255, json_schema_extra={"example": "0.60"})
    reason: Optional[str] = Field(None, max_length=255, json_schema_extra={"example": "Sensitivity analysis scenario"})

class ResolvedParameterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    parameter_key: str
    parameter_name: str
    category: str
    system_default_value: str
    project_default_value: Optional[str] = None
    override_value: Optional[str] = None
    effective_value: str
    unit: str
    source: str  # "SCENARIO_OVERRIDE" | "PROJECT_DEFAULT" | "SYSTEM_DEFAULT"
    is_overridden: bool
    reason: Optional[str] = None
    description: str

class ResolvedParameterListResponse(BaseModel):
    scenario_id: UUID
    project_id: UUID
    parameters: List[ResolvedParameterResponse]
