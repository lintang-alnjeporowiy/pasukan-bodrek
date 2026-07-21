"""create_routes_table

Revision ID: c0123456789b
Revises: b0123456789a
Create Date: 2026-07-21 17:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c0123456789b'
down_revision: Union[str, Sequence[str], None] = 'b0123456789a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'routes',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('project_id', sa.UUID(), nullable=False),
        sa.Column('study_port_id', sa.UUID(), nullable=False),
        sa.Column('external_port_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('direction', sa.String(length=20), nullable=False),
        sa.Column('distance_nm', sa.Float(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['study_port_id'], ['study_ports.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['external_port_id'], ['external_ports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('routes')
