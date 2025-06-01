"""建立所有必要的資料表

Revision ID: create_all_tables
Revises: 33b5b5fc9b39
Create Date: 2025-01-XX XX:XX:XX.XXXXXX
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
    """升級資料庫架構 - 建立所有必要的資料表"""
    # ### 建立 users 資料表 ###
    op.create_table(
        'users',
        sa.Column('user_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('username', sa.String(length=255),
                  nullable=False, unique=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
    )

    # ### 建立 templates 資料表 ###
    op.create_table(
        'templates',
        sa.Column('template_id', sa.Integer,
                  primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey(
            'users.user_id'), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_default', sa.Boolean, nullable=False,
                  server_default=sa.text('0')),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # ### 建立 prompt_history 資料表 ###
    op.create_table(
        'prompt_history',
        sa.Column('history_id', sa.Integer,
                  primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey(
            'users.user_id'), nullable=False),
        sa.Column('original_prompt', sa.Text, nullable=False),
        sa.Column('optimized_prompt', sa.Text, nullable=True),
        sa.Column('template_id', sa.Integer, sa.ForeignKey(
            'templates.template_id'), nullable=True),
        sa.Column('model_used', sa.String(length=100), nullable=False),
        sa.Column('temperature', sa.Float, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
    )

    # ### 建立 user_preferences 資料表 ###
    op.create_table(
        'user_preferences',
        sa.Column('preference_id', sa.Integer,
                  primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey(
            'users.user_id'), nullable=False, unique=True),
        sa.Column('default_model', sa.String(length=100),
                  nullable=False, server_default=sa.text("'gemini-pro'")),
        sa.Column('default_temperature', sa.Float,
                  nullable=False, server_default=sa.text("0.7")),
        sa.Column('default_template_id', sa.Integer, sa.ForeignKey(
            'templates.template_id'), nullable=True),
        sa.Column('theme', sa.String(length=50), nullable=False,
                  server_default=sa.text("'light'")),
        sa.Column('created_at', sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )

    # """新增 Token 黑名單表"""
    op.create_table(
        'token_blacklist',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('token_jti', sa.String(length=255),
                  nullable=False, unique=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey(
            'users.user_id'), nullable=False),
        sa.Column('blacklisted_at', sa.DateTime(timezone=True),
                  nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
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

    # 建立索引
    op.create_index('idx_token_blacklist_jti',
                    'token_blacklist', ['token_jti'])
    op.create_index('idx_token_blacklist_expires',
                    'token_blacklist', ['expires_at'])


def downgrade() -> None:
    """降級資料庫架構 - 刪除所有資料表"""
    # ### 刪除 user_preferences 資料表 ###
    op.drop_table('user_preferences')

    # ### 刪除 prompt_history 資料表 ###
    op.drop_table('prompt_history')

    # ### 刪除 templates 資料表 ###
    op.drop_table('templates')

    # ### 刪除 users 資料表 ###
    op.drop_table('users')

    # ### 刪除 token_blacklist 資料表 ###
    op.drop_table('token_blacklist')
