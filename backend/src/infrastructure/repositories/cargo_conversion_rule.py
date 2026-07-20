from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.infrastructure.database.models.cargo_conversion_rule import CargoConversionRuleModel

class CargoConversionRuleRepository:
    """Repository to manage CargoConversionRule database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, rule_id: UUID) -> Optional[CargoConversionRuleModel]:
        """Retrieve a conversion rule by its unique ID."""
        return self.db.query(CargoConversionRuleModel).filter(CargoConversionRuleModel.id == rule_id).first()

    def list_rules(
        self, commodity_id: Optional[UUID] = None, is_active: Optional[bool] = None
    ) -> List[CargoConversionRuleModel]:
        """List conversion rules with optional filters."""
        query = self.db.query(CargoConversionRuleModel)
        if commodity_id is not None:
            query = query.filter(CargoConversionRuleModel.commodity_id == commodity_id)
        if is_active is not None:
            query = query.filter(CargoConversionRuleModel.is_active == is_active)
        return query.order_by(CargoConversionRuleModel.created_at.asc()).all()

    def find_matching_rule(
        self, source_unit: str, target_unit: str, commodity_id: Optional[UUID] = None
    ) -> Optional[CargoConversionRuleModel]:
        """
        Find an active conversion rule for (source_unit -> target_unit).
        Prioritizes commodity-specific rules over global rules (commodity_id=None).
        """
        source_clean = source_unit.strip().lower()
        target_clean = target_unit.strip().lower()

        # 1. Try commodity-specific active rule if commodity_id provided
        if commodity_id:
            rule = (
                self.db.query(CargoConversionRuleModel)
                .filter(
                    CargoConversionRuleModel.commodity_id == commodity_id,
                    CargoConversionRuleModel.is_active.is_(True),
                    func.lower(CargoConversionRuleModel.source_unit) == source_clean,
                    func.lower(CargoConversionRuleModel.target_unit) == target_clean,
                )
                .first()
            )
            if rule:
                return rule

        # 2. Fallback to global active rule (commodity_id is None)
        rule = (
            self.db.query(CargoConversionRuleModel)
            .filter(
                CargoConversionRuleModel.commodity_id.is_(None),
                CargoConversionRuleModel.is_active.is_(True),
                func.lower(CargoConversionRuleModel.source_unit) == source_clean,
                func.lower(CargoConversionRuleModel.target_unit) == target_clean,
            )
            .first()
        )
        return rule

    def create(self, rule_data: dict) -> CargoConversionRuleModel:
        """Create a new cargo conversion rule."""
        db_rule = CargoConversionRuleModel(
            commodity_id=rule_data.get("commodity_id"),
            source_unit=rule_data["source_unit"],
            target_unit=rule_data["target_unit"],
            conversion_factor=rule_data["conversion_factor"],
            description=rule_data.get("description"),
            is_active=rule_data.get("is_active", True),
        )
        self.db.add(db_rule)
        self.db.commit()
        self.db.refresh(db_rule)
        return db_rule

    def update(self, db_rule: CargoConversionRuleModel, update_data: dict) -> CargoConversionRuleModel:
        """Update an existing cargo conversion rule."""
        for field, value in update_data.items():
            if value is not None:
                setattr(db_rule, field, value)
        self.db.commit()
        self.db.refresh(db_rule)
        return db_rule

    def delete(self, db_rule: CargoConversionRuleModel) -> None:
        """Delete a cargo conversion rule."""
        self.db.delete(db_rule)
        self.db.commit()
