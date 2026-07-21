"""create_bathymetry_tables

Revision ID: b0123456789a
Revises: 9a82f345678b
Create Date: 2026-07-21 17:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'b0123456789a'
down_revision: Union[str, Sequence[str], None] = '9a82f345678b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'bathymetry_profiles',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('study_port_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['study_port_id'], ['study_ports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'bathymetry_points',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('bathymetry_profile_id', sa.UUID(), nullable=False),
        sa.Column('distance_from_shore', sa.Float(), nullable=False),
        sa.Column('water_depth', sa.Float(), nullable=False),
        sa.Column('sequence', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['bathymetry_profile_id'], ['bathymetry_profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('bathymetry_points')
    op.drop_table('bathymetry_profiles')
