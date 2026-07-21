"""add_draft_loa_to_study_ports

Revision ID: i0123456789h
Revises: h0123456789g
Create Date: 2026-07-21 18:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'i0123456789h'
down_revision: Union[str, Sequence[str], None] = 'h0123456789g'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('study_ports', sa.Column('max_draft', sa.Float(), nullable=True))
    op.add_column('study_ports', sa.Column('max_loa', sa.Float(), nullable=True))

def downgrade() -> None:
    op.drop_column('study_ports', 'max_loa')
    op.drop_column('study_ports', 'max_draft')
