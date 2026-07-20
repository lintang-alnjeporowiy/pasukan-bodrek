from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.infrastructure.database.session import get_db
from src.application.cargo_conversion_rule.schemas import (
    CargoConversionRuleCreate,
    CargoConversionRuleUpdate,
    CargoConversionRuleResponse,
    ConvertCargoRequest,
    ConvertCargoResponse,
)
from src.application.cargo_conversion_rule.service import CargoConversionRuleService

router = APIRouter(tags=["Cargo Conversion Rules"])

@router.post(
    "/conversion-rules",
    response_model=CargoConversionRuleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new cargo conversion rule"
)
def create_conversion_rule(
    rule_in: CargoConversionRuleCreate,
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    return service.create_rule(rule_in)

@router.get(
    "/conversion-rules",
    response_model=List[CargoConversionRuleResponse],
    summary="List conversion rules with optional filters"
)
def list_conversion_rules(
    commodity_id: Optional[UUID] = Query(None, description="Filter by commodity ID"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    return service.list_rules(commodity_id=commodity_id, is_active=is_active)

@router.get(
    "/conversion-rules/{rule_id}",
    response_model=CargoConversionRuleResponse,
    summary="Get a conversion rule by ID"
)
def get_conversion_rule(
    rule_id: UUID,
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    return service.get_rule(rule_id)

@router.patch(
    "/conversion-rules/{rule_id}",
    response_model=CargoConversionRuleResponse,
    summary="Update an existing conversion rule"
)
def update_conversion_rule(
    rule_id: UUID,
    rule_in: CargoConversionRuleUpdate,
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    return service.update_rule(rule_id, rule_in)

@router.delete(
    "/conversion-rules/{rule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a conversion rule"
)
def delete_conversion_rule(
    rule_id: UUID,
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    service.delete_rule(rule_id)
    return None

@router.post(
    "/cargo-conversions/convert",
    response_model=ConvertCargoResponse,
    summary="Execute cargo conversion and return calculation trace"
)
def convert_cargo(
    request: ConvertCargoRequest,
    db: Session = Depends(get_db)
):
    service = CargoConversionRuleService(db)
    return service.convert_cargo(request)
