"""add_route_id_to_cargo_flows

Revision ID: d0123456789c
Revises: c0123456789b
Create Date: 2026-07-21 17:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd0123456789c'
down_revision: Union[str, Sequence[str], None] = 'c0123456789b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('cargo_flows', sa.Column('route_id', sa.UUID(), nullable=True))
    op.create_foreign_key(
        'fk_cargo_flows_route_id_routes',
        'cargo_flows',
        'routes',
        ['route_id'],
        ['id'],
        ondelete='SET NULL'
    )

def downgrade() -> None:
    op.drop_constraint('fk_cargo_flows_route_id_routes', 'cargo_flows', type_='foreignkey')
    op.drop_column('cargo_flows', 'route_id')
