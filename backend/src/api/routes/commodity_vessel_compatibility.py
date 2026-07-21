from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.infrastructure.database import get_db
from src.domain.vessel_compatibility.schemas import (
    CommodityVesselCompatibilityCreate,
    CommodityVesselCompatibilityResponse,
    BatchSetVesselsForCommodityInput,
)
from src.application.vessel_compatibility.service import CommodityVesselCompatibilityService

router = APIRouter(prefix="/commodity-vessel-compatibilities", tags=["Commodity Vessel Compatibility"])

@router.get("", response_model=List[CommodityVesselCompatibilityResponse])
def list_compatibilities(
    commodity_id: Optional[UUID] = None,
    vessel_id: Optional[UUID] = None,
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar kompatibilitas komoditas dan kapal."""
    service = CommodityVesselCompatibilityService(db)
    return service.get_all(commodity_id=commodity_id, vessel_id=vessel_id, active_only=active_only)

@router.post("", response_model=CommodityVesselCompatibilityResponse, status_code=status.HTTP_201_CREATED)
def add_compatibility(
    input_data: CommodityVesselCompatibilityCreate,
    db: Session = Depends(get_db)
):
    """Menambahkan hubungan kompatibilitas antara komoditas dan kapal."""
    service = CommodityVesselCompatibilityService(db)
    return service.add_compatibility(input_data)

@router.put("/batch", response_model=List[CommodityVesselCompatibilityResponse])
def batch_set_vessels_for_commodity(
    payload: BatchSetVesselsForCommodityInput,
    db: Session = Depends(get_db)
):
    """Batch update daftar kapal yang kompatibel dengan suatu komoditas."""
    service = CommodityVesselCompatibilityService(db)
    return service.batch_set_vessels_for_commodity(payload)

@router.delete("/{comp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_compatibility(
    comp_id: UUID,
    db: Session = Depends(get_db)
):
    """Menghapus hubungan kompatibilitas komoditas dan kapal."""
    service = CommodityVesselCompatibilityService(db)
    service.delete_compatibility(comp_id)
    return
