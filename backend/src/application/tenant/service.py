from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.repositories.tenant import TenantRepository
from src.infrastructure.database.models.tenant import TenantModel
from src.domain.tenant.models import TenantCreate, TenantUpdate, TenantDomain

class TenantService:
    """Application Service to coordinate tenant-related workflows."""

    def __init__(self, db: Session):
        self.repository = TenantRepository(db)

    def _map_to_domain(self, db_tenant: TenantModel) -> TenantDomain:
        domain = TenantDomain.model_validate(db_tenant)
        if db_tenant.commodity:
            domain.commodity_name = db_tenant.commodity.name
        return domain

    def create_tenant(self, project_id: UUID, tenant_in: TenantCreate) -> TenantDomain:
        """Business logic for creating a new tenant."""
        db_tenant = self.repository.create(project_id, tenant_in)
        return self._map_to_domain(db_tenant)

    def get_tenant(self, tenant_id: UUID) -> Optional[TenantDomain]:
        """Business logic for retrieving a tenant by ID."""
        db_tenant = self.repository.get_by_id(tenant_id)
        if not db_tenant:
            return None
        return self._map_to_domain(db_tenant)

    def list_tenants(self, project_id: UUID) -> List[TenantDomain]:
        """Business logic for listing all tenants for a project."""
        db_tenants = self.repository.list_by_project(project_id)
        return [self._map_to_domain(t) for t in db_tenants]

    def update_tenant(self, tenant_id: UUID, tenant_in: TenantUpdate) -> Optional[TenantDomain]:
        """Business logic for updating a tenant."""
        db_tenant = self.repository.get_by_id(tenant_id)
        if not db_tenant:
            return None
        db_tenant = self.repository.update(db_tenant, tenant_in)
        return self._map_to_domain(db_tenant)

    def delete_tenant(self, tenant_id: UUID) -> bool:
        """Business logic for deleting a tenant."""
        db_tenant = self.repository.get_by_id(tenant_id)
        if not db_tenant:
            return False
        self.repository.delete(db_tenant)
        return True
