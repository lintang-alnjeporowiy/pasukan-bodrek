from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.repositories.commodity import CommodityRepository
from src.domain.commodity.models import CommodityCreate, CommodityUpdate, CommodityDomain

class CommodityService:
    """Application Service to coordinate commodity-related workflows."""

    def __init__(self, db: Session):
        self.repository = CommodityRepository(db)

    def create_commodity(self, commodity_in: CommodityCreate) -> CommodityDomain:
        """Business logic for creating a new commodity."""
        db_commodity = self.repository.create(commodity_in)
        return CommodityDomain.model_validate(db_commodity)

    def get_commodity(self, commodity_id: UUID) -> Optional[CommodityDomain]:
        """Business logic for retrieving a commodity by ID."""
        db_commodity = self.repository.get_by_id(commodity_id)
        if not db_commodity:
            return None
        return CommodityDomain.model_validate(db_commodity)

    def list_commodities(self) -> List[CommodityDomain]:
        """Business logic for listing all commodities."""
        db_commodities = self.repository.list_all()
        return [CommodityDomain.model_validate(c) for c in db_commodities]

    def update_commodity(self, commodity_id: UUID, commodity_in: CommodityUpdate) -> Optional[CommodityDomain]:
        """Business logic for updating a commodity."""
        db_commodity = self.repository.get_by_id(commodity_id)
        if not db_commodity:
            return None
        db_commodity = self.repository.update(db_commodity, commodity_in)
        return CommodityDomain.model_validate(db_commodity)

    def delete_commodity(self, commodity_id: UUID) -> bool:
        """Business logic for deleting a commodity."""
        db_commodity = self.repository.get_by_id(commodity_id)
        if not db_commodity:
            return False
        self.repository.delete(db_commodity)
        return True
