from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.tenant import TenantModel
from src.domain.tenant.models import TenantCreate, TenantUpdate

class TenantRepository:
    """Repository to manage Tenant database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, tenant_id: UUID) -> Optional[TenantModel]:
        """Retrieve a tenant by its unique ID."""
        return self.db.query(TenantModel).filter(TenantModel.id == tenant_id).first()

    def list_by_project(self, project_id: UUID) -> List[TenantModel]:
        """List all tenants belonging to a specific project ordered by name."""
        return self.db.query(TenantModel)\
            .filter(TenantModel.project_id == project_id)\
            .order_by(TenantModel.name.asc())\
            .all()

    def create(self, project_id: UUID, tenant_in: TenantCreate) -> TenantModel:
        """Create a new tenant under a project."""
        db_tenant = TenantModel(
            project_id=project_id,
            commodity_id=tenant_in.commodity_id,
            name=tenant_in.name,
            description=tenant_in.description,
            is_active=tenant_in.is_active
        )
        self.db.add(db_tenant)
        self.db.commit()
        self.db.refresh(db_tenant)
        return db_tenant

    def update(self, db_tenant: TenantModel, tenant_in: TenantUpdate) -> TenantModel:
        """Update an existing tenant."""
        update_data = tenant_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_tenant, field, value)
        self.db.commit()
        self.db.refresh(db_tenant)
        return db_tenant

    def delete(self, db_tenant: TenantModel) -> None:
        """Delete a tenant."""
        self.db.delete(db_tenant)
        self.db.commit()
