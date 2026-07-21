"""create_vessels_table

Revision ID: f0123456789e
Revises: d0123456789c
Create Date: 2026-07-21 18:05:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'f0123456789e'
down_revision: Union[str, Sequence[str], None] = 'd0123456789c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'vessels',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=True),
        sa.Column('ship_type', sa.String(length=100), nullable=False),
        sa.Column('loa', sa.Float(), nullable=False),
        sa.Column('beam', sa.Float(), nullable=False),
        sa.Column('draft', sa.Float(), nullable=False),
        sa.Column('depth', sa.Float(), nullable=False),
        sa.Column('dwt', sa.Float(), nullable=False),
        sa.Column('gt', sa.Float(), nullable=True),
        sa.Column('capacity', sa.Float(), nullable=False),
        sa.Column('capacity_unit', sa.String(length=50), nullable=False, server_default='Ton'),
        sa.Column('service_speed_knots', sa.Float(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
    )

def downgrade() -> None:
    op.drop_table('vessels')
