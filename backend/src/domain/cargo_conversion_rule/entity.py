import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List

@dataclass
class CargoConversionRule:
    id: uuid.UUID
    source_unit: str
    target_unit: str
    conversion_factor: float
    commodity_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

@dataclass
class CalculationTraceStep:
    step: int
    description: str
    formula: str
    result: str

@dataclass
class CalculationTrace:
    source_value: float
    source_unit: str
    target_unit: str
    target_value: float
    conversion_factor: float
    status: str
    applied_rule_id: Optional[uuid.UUID] = None
    applied_rule_description: Optional[str] = None
    steps: List[CalculationTraceStep] = field(default_factory=list)
