from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from src.infrastructure.database import get_db
from src.domain.tenant.models import TenantCreate, TenantDomain, TenantUpdate
from src.application.tenant import TenantService

router = APIRouter(tags=["Tenants"])

@router.post("/projects/{project_id}/tenants", response_model=TenantDomain, status_code=status.HTTP_201_CREATED)
def create_tenant(project_id: UUID, tenant_in: TenantCreate, db: Session = Depends(get_db)):
    """Create a new tenant under a project."""
    service = TenantService(db)
    return service.create_tenant(project_id, tenant_in)

@router.get("/projects/{project_id}/tenants", response_model=List[TenantDomain])
def list_tenants(project_id: UUID, db: Session = Depends(get_db)):
    """List all tenants under a project."""
    service = TenantService(db)
    return service.list_tenants(project_id)

@router.get("/tenants/{tenant_id}", response_model=TenantDomain)
def get_tenant(tenant_id: UUID, db: Session = Depends(get_db)):
    """Get a tenant by its unique ID."""
    service = TenantService(db)
    tenant = service.get_tenant(tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return tenant

@router.patch("/tenants/{tenant_id}", response_model=TenantDomain)
def update_tenant(tenant_id: UUID, tenant_in: TenantUpdate, db: Session = Depends(get_db)):
    """Update details of a specific tenant."""
    service = TenantService(db)
    tenant = service.update_tenant(tenant_id, tenant_in)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return tenant

@router.delete("/tenants/{tenant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tenant(tenant_id: UUID, db: Session = Depends(get_db)):
    """Delete a specific tenant."""
    service = TenantService(db)
    success = service.delete_tenant(tenant_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return
