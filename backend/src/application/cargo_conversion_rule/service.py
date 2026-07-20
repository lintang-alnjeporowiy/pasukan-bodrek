from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.infrastructure.repositories.cargo_conversion_rule import CargoConversionRuleRepository
from src.infrastructure.repositories.commodity import CommodityRepository
from src.application.cargo_conversion_rule.schemas import (
    CargoConversionRuleCreate,
    CargoConversionRuleUpdate,
    CargoConversionRuleResponse,
    ConvertCargoRequest,
    ConvertCargoResponse,
    CalculationTraceStepSchema,
)

class CargoConversionRuleService:
    """Service to handle business logic and calculation engine for Cargo Conversion Rules."""

    def __init__(self, db: Session):
        self.db = db
        self.repository = CargoConversionRuleRepository(db)
        self.commodity_repo = CommodityRepository(db)

    def _enrich_rule_response(self, db_rule) -> CargoConversionRuleResponse:
        commodity_name = None
        if db_rule.commodity_id:
            comm = self.commodity_repo.get_by_id(db_rule.commodity_id)
            if comm:
                commodity_name = comm.name

        return CargoConversionRuleResponse(
            id=db_rule.id,
            commodity_id=db_rule.commodity_id,
            commodity_name=commodity_name,
            source_unit=db_rule.source_unit,
            target_unit=db_rule.target_unit,
            conversion_factor=db_rule.conversion_factor,
            description=db_rule.description,
            is_active=db_rule.is_active,
            created_at=db_rule.created_at,
            updated_at=db_rule.updated_at,
        )

    def create_rule(self, rule_in: CargoConversionRuleCreate) -> CargoConversionRuleResponse:
        if rule_in.commodity_id:
            comm = self.commodity_repo.get_by_id(rule_in.commodity_id)
            if not comm:
                raise HTTPException(
                    status_code=status.HTTP404_NOT_FOUND,
                    detail=f"Komoditas dengan ID {rule_in.commodity_id} tidak ditemukan."
                )

        db_rule = self.repository.create(rule_in.model_dump())
        return self._enrich_rule_response(db_rule)

    def get_rule(self, rule_id: UUID) -> CargoConversionRuleResponse:
        db_rule = self.repository.get_by_id(rule_id)
        if not db_rule:
            raise HTTPException(
                status_code=status.HTTP404_NOT_FOUND,
                detail=f"Conversion Rule dengan ID {rule_id} tidak ditemukan."
            )
        return self._enrich_rule_response(db_rule)

    def list_rules(
        self, commodity_id: Optional[UUID] = None, is_active: Optional[bool] = None
    ) -> List[CargoConversionRuleResponse]:
        db_rules = self.repository.list_rules(commodity_id=commodity_id, is_active=is_active)
        return [self._enrich_rule_response(rule) for rule in db_rules]

    def update_rule(self, rule_id: UUID, rule_in: CargoConversionRuleUpdate) -> CargoConversionRuleResponse:
        db_rule = self.repository.get_by_id(rule_id)
        if not db_rule:
            raise HTTPException(
                status_code=status.HTTP404_NOT_FOUND,
                detail=f"Conversion Rule dengan ID {rule_id} tidak ditemukan."
            )

        update_data = rule_in.model_dump(exclude_unset=True)
        if "commodity_id" in update_data and update_data["commodity_id"] is not None:
            comm = self.commodity_repo.get_by_id(update_data["commodity_id"])
            if not comm:
                raise HTTPException(
                    status_code=status.HTTP404_NOT_FOUND,
                    detail=f"Komoditas dengan ID {update_data['commodity_id']} tidak ditemukan."
                )

        updated_db_rule = self.repository.update(db_rule, update_data)
        return self._enrich_rule_response(updated_db_rule)

    def delete_rule(self, rule_id: UUID) -> None:
        db_rule = self.repository.get_by_id(rule_id)
        if not db_rule:
            raise HTTPException(
                status_code=status.HTTP404_NOT_FOUND,
                detail=f"Conversion Rule dengan ID {rule_id} tidak ditemukan."
            )
        self.repository.delete(db_rule)

    def convert_cargo(self, request: ConvertCargoRequest) -> ConvertCargoResponse:
        """
        Execute cargo demand conversion based on active conversion rules and generate calculation trace.
        Formula: D_target = D_source * conversion_factor
        """
        source_clean = request.source_unit.strip()
        target_clean = request.target_unit.strip()

        # Step 1: Same unit check
        if source_clean.lower() == target_clean.lower():
            target_val = request.source_value
            steps = [
                CalculationTraceStepSchema(
                    step=1,
                    description=f"Unit Match Check: Source unit '{source_clean}' matches target unit '{target_clean}'.",
                    formula="Direct 1:1 Identity Mapping",
                    result=f"Factor = 1.0"
                ),
                CalculationTraceStepSchema(
                    step=2,
                    description=f"Calculation: {request.source_value} {source_clean} x 1.0",
                    formula=f"D_target = {request.source_value} x 1.0",
                    result=f"Target Value = {target_val} {target_clean}"
                )
            ]
            return ConvertCargoResponse(
                source_value=request.source_value,
                source_unit=source_clean,
                target_unit=target_clean,
                target_value=target_val,
                conversion_factor=1.0,
                status="SUCCESS",
                applied_rule_id=None,
                applied_rule_description="Identity unit conversion (1:1)",
                steps=steps
            )

        # Step 2: Lookup matching rule
        rule = self.repository.find_matching_rule(
            source_unit=source_clean,
            target_unit=target_clean,
            commodity_id=request.commodity_id
        )

        if not rule:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Tidak ditemukan Conversion Rule aktif untuk konversi satuan '{source_clean}' -> '{target_clean}'."
            )

        target_val = request.source_value * rule.conversion_factor
        steps = [
            CalculationTraceStepSchema(
                step=1,
                description=f"Rule Resolution: Matched active conversion rule for '{source_clean}' -> '{target_clean}'.",
                formula=f"Conversion Rule ID: {rule.id}",
                result=f"Conversion Factor = {rule.conversion_factor}"
            ),
            CalculationTraceStepSchema(
                step=2,
                description=f"Apply Conversion Formula: D_target = D_source x ConversionFactor",
                formula=f"D_target = {request.source_value} {source_clean} x {rule.conversion_factor}",
                result=f"Target Value = {target_val} {target_clean}"
            )
        ]

        return ConvertCargoResponse(
            source_value=request.source_value,
            source_unit=source_clean,
            target_unit=target_clean,
            target_value=target_val,
            conversion_factor=rule.conversion_factor,
            status="SUCCESS",
            applied_rule_id=rule.id,
            applied_rule_description=rule.description,
            steps=steps
        )
