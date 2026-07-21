"""create_external_ports_table

Revision ID: 9a82f345678b
Revises: 8f73b624a91c
Create Date: 2026-07-21 16:55:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '9a82f345678b'
down_revision: Union[str, Sequence[str], None] = '8f73b624a91c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'external_ports',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('country', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('max_draft', sa.Float(), nullable=False),
        sa.Column('max_loa', sa.Float(), nullable=False),
        sa.Column('cargo_productivity', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('productivity_unit', sa.String(length=50), nullable=False, server_default='ton/hour'),
        sa.Column('additional_port_time', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('external_ports')
