from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class CargoConversionRuleCreate(BaseModel):
    commodity_id: Optional[UUID] = None
    source_unit: str = Field(..., min_length=1, max_length=50, json_schema_extra={"example": "Ton"})
    target_unit: str = Field(..., min_length=1, max_length=50, json_schema_extra={"example": "TEU"})
    conversion_factor: float = Field(..., gt=0, json_schema_extra={"example": 0.55})
    description: Optional[str] = Field(None, max_length=255)
    is_active: bool = True

class CargoConversionRuleUpdate(BaseModel):
    commodity_id: Optional[UUID] = None
    source_unit: Optional[str] = Field(None, min_length=1, max_length=50)
    target_unit: Optional[str] = Field(None, min_length=1, max_length=50)
    conversion_factor: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None

class CargoConversionRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    commodity_id: Optional[UUID] = None
    commodity_name: Optional[str] = None
    source_unit: str
    target_unit: str
    conversion_factor: float
    description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class ConvertCargoRequest(BaseModel):
    source_value: float = Field(..., ge=0, json_schema_extra={"example": 500000.0})
    source_unit: str = Field(..., min_length=1, max_length=50, json_schema_extra={"example": "Ton"})
    target_unit: str = Field(..., min_length=1, max_length=50, json_schema_extra={"example": "TEU"})
    commodity_id: Optional[UUID] = None

class CalculationTraceStepSchema(BaseModel):
    step: int
    description: str
    formula: str
    result: str

class ConvertCargoResponse(BaseModel):
    source_value: float
    source_unit: str
    target_unit: str
    target_value: float
    conversion_factor: float
    status: str
    applied_rule_id: Optional[UUID] = None
    applied_rule_description: Optional[str] = None
    steps: List[CalculationTraceStepSchema]
