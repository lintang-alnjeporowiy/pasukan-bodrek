from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.commodity import CommodityModel
from src.domain.commodity.models import CommodityCreate, CommodityUpdate

class CommodityRepository:
    """Repository to manage Commodity database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, commodity_id: UUID) -> Optional[CommodityModel]:
        """Retrieve a commodity by its unique ID."""
        return self.db.query(CommodityModel).filter(CommodityModel.id == commodity_id).first()

    def list_all(self) -> List[CommodityModel]:
        """List all commodities ordered by name."""
        return self.db.query(CommodityModel).order_by(CommodityModel.name.asc()).all()

    def create(self, commodity_in: CommodityCreate) -> CommodityModel:
        """Create a new commodity."""
        db_commodity = CommodityModel(
            name=commodity_in.name,
            code=commodity_in.code,
            unit=commodity_in.unit,
            description=commodity_in.description,
            is_active=commodity_in.is_active
        )
        self.db.add(db_commodity)
        self.db.commit()
        self.db.refresh(db_commodity)
        return db_commodity

    def update(self, db_commodity: CommodityModel, commodity_in: CommodityUpdate) -> CommodityModel:
        """Update an existing commodity."""
        update_data = commodity_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_commodity, field, value)
        self.db.commit()
        self.db.refresh(db_commodity)
        return db_commodity

    def delete(self, db_commodity: CommodityModel) -> None:
        """Delete a commodity."""
        self.db.delete(db_commodity)
        self.db.commit()
