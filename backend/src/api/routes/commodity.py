from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from src.infrastructure.database import get_db
from src.domain.commodity.models import CommodityCreate, CommodityDomain, CommodityUpdate
from src.application.commodity import CommodityService

router = APIRouter(prefix="/commodities", tags=["Commodities"])

@router.post("", response_model=CommodityDomain, status_code=status.HTTP_201_CREATED)
def create_commodity(commodity_in: CommodityCreate, db: Session = Depends(get_db)):
    """Create a new master commodity."""
    service = CommodityService(db)
    return service.create_commodity(commodity_in)

@router.get("", response_model=List[CommodityDomain])
def list_commodities(db: Session = Depends(get_db)):
    """List all master commodities."""
    service = CommodityService(db)
    return service.list_commodities()

@router.get("/{commodity_id}", response_model=CommodityDomain)
def get_commodity(commodity_id: UUID, db: Session = Depends(get_db)):
    """Get a commodity by its unique ID."""
    service = CommodityService(db)
    commodity = service.get_commodity(commodity_id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found"
        )
    return commodity

@router.patch("/{commodity_id}", response_model=CommodityDomain)
def update_commodity(commodity_id: UUID, commodity_in: CommodityUpdate, db: Session = Depends(get_db)):
    """Update details of a specific commodity."""
    service = CommodityService(db)
    commodity = service.update_commodity(commodity_id, commodity_in)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found"
        )
    return commodity

@router.delete("/{commodity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_commodity(commodity_id: UUID, db: Session = Depends(get_db)):
    """Delete a specific commodity."""
    service = CommodityService(db)
    success = service.delete_commodity(commodity_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found"
        )
    return
