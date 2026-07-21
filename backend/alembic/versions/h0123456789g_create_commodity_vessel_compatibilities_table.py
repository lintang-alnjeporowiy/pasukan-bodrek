"""create_commodity_vessel_compatibilities_table

Revision ID: h0123456789g
Revises: g0123456789f
Create Date: 2026-07-21 18:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'h0123456789g'
down_revision: Union[str, Sequence[str], None] = 'g0123456789f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'commodity_vessel_compatibilities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('commodity_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('commodities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('vessel_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('vessels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.UniqueConstraint('commodity_id', 'vessel_id', name='uq_commodity_vessel_compatibility')
    )

def downgrade() -> None:
    op.drop_table('commodity_vessel_compatibilities')
