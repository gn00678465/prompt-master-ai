"""init migration

Revision ID: 33b5b5fc9b39
Revises: 
Create Date: 2025-05-21 21:04:51.271256

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '33b5b5fc9b39'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### 建立 templates 資料表 ###
    op.create_table(
        'templates',
        sa.Column('template_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_default', sa.Boolean, nullable=False, server_default=sa.text('0')),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    # ### end Alembic commands ###
    op.execute("""
               INSERT INTO templates (user_id, name, description, content, is_default, category, created_at)
               VALUES (
                    NULL,
                    '預設模板',
                    '簡短預設模板',
                    '請將內容轉換為強大的提示詞',
                    1,
                    'general',
                    CURRENT_TIMESTAMP
               )
               """)


def downgrade() -> None:
    """Downgrade schema."""
    # ### 刪除 templates 資料表 ###
    op.drop_table('templates')
    # ### end Alembic commands ###
