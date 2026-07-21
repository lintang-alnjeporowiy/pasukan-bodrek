"""create_scenario_vessel_candidates_table

Revision ID: j0123456789i
Revises: i0123456789h
Create Date: 2026-07-21 18:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'j0123456789i'
down_revision: Union[str, Sequence[str], None] = 'i0123456789h'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'scenario_vessel_candidates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('scenario_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('scenarios.id', ondelete='CASCADE'), nullable=False),
        sa.Column('cargo_flow_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('cargo_flows.id', ondelete='CASCADE'), nullable=True),
        sa.Column('vessel_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('vessels.id', ondelete='CASCADE'), nullable=False),
        sa.Column('is_selected', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.UniqueConstraint('scenario_id', 'cargo_flow_id', 'vessel_id', name='uq_scenario_cargo_flow_vessel_candidate')
    )

def downgrade() -> None:
    op.drop_table('scenario_vessel_candidates')
