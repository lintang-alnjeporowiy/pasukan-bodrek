"""expand_vessels_table_fields

Revision ID: g0123456789f
Revises: f0123456789e
Create Date: 2026-07-21 18:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'g0123456789f'
down_revision: Union[str, Sequence[str], None] = 'f0123456789e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('vessels', sa.Column('operating_speed_knots', sa.Float(), nullable=False, server_default='14.0'))
    op.add_column('vessels', sa.Column('main_engine_power_kw', sa.Float(), nullable=False, server_default='5000.0'))
    op.add_column('vessels', sa.Column('aux_engine_power_kw', sa.Float(), nullable=False, server_default='500.0'))
    
    op.add_column('vessels', sa.Column('me_sfoc', sa.Float(), nullable=False, server_default='180.0'))
    op.add_column('vessels', sa.Column('me_sea_load_factor', sa.Float(), nullable=False, server_default='0.85'))
    op.add_column('vessels', sa.Column('me_port_load_factor', sa.Float(), nullable=False, server_default='0.10'))
    
    op.add_column('vessels', sa.Column('ae_sfoc', sa.Float(), nullable=False, server_default='220.0'))
    op.add_column('vessels', sa.Column('ae_sea_load_factor', sa.Float(), nullable=False, server_default='0.70'))
    op.add_column('vessels', sa.Column('ae_port_load_factor', sa.Float(), nullable=False, server_default='0.50'))
    
    op.add_column('vessels', sa.Column('charter_rate', sa.Float(), nullable=False, server_default='0.0'))
    op.add_column('vessels', sa.Column('charter_rate_basis', sa.String(length=20), nullable=False, server_default='PER_DAY'))

def downgrade() -> None:
    op.drop_column('vessels', 'charter_rate_basis')
    op.drop_column('vessels', 'charter_rate')
    op.drop_column('vessels', 'ae_port_load_factor')
    op.drop_column('vessels', 'ae_sea_load_factor')
    op.drop_column('vessels', 'ae_sfoc')
    op.drop_column('vessels', 'me_port_load_factor')
    op.drop_column('vessels', 'me_sea_load_factor')
    op.drop_column('vessels', 'me_sfoc')
    op.drop_column('vessels', 'aux_engine_power_kw')
    op.drop_column('vessels', 'main_engine_power_kw')
    op.drop_column('vessels', 'operating_speed_knots')
