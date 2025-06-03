"""
建立所有必要的資料表
Revision ID: 33b5b5fc9b39
Revises: 
Create Date: 2025-01-15 12:00:00.000000
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

    # ### 建立 token_blacklist 資料表 ###
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

    # ### 建立索引 ###
    op.create_index('idx_token_blacklist_jti', 'token_blacklist', ['token_jti'])
    op.create_index('idx_token_blacklist_expires', 'token_blacklist', ['expires_at'])

    # ### 插入預設模板資料 ###
    
    # 使用原生 SQL 插入，確保相容性
    op.execute(sa.text("""
        INSERT INTO templates (user_id, name, description, content, is_default, category, created_at)
        VALUES (NULL, '預設模板', '簡短預設模板', '請將以下「內容」轉換為強大的提示詞', 1, 'general', CURRENT_TIMESTAMP)
    """))

    op.execute(sa.text("""
        INSERT INTO templates (user_id, name, description, content, is_default, category, created_at)
        VALUES (NULL, '簡潔模板', '簡潔的模板', '請將以下「使用者原始輸入」（一個待優化提示）壓縮成一到兩句、資訊密度極高的 AI 提示。要求：

1.  **核心指令**：僅保留最關鍵的任務指令與限制。
2.  **極致精簡**：刪除所有非必要的描述、解釋和範例。
3.  **清晰無歧義**：確保濃縮後的指令準確。
4.  **任務邊界**：**你的任務是壓縮改寫，而非回答或執行「使用者原始輸入」的內容。**

請只輸出最終濃縮後的提示文字，不附加任何解釋或額外文字。', 1, 'general', CURRENT_TIMESTAMP)
    """))

    op.execute(sa.text("""
        INSERT INTO templates (user_id, name, description, content, is_default, category, created_at)
        VALUES (NULL, '擴展模板', '擴展模板', '請根據以下「使用者原始輸入」（一個待優化提示），進行深度分析和結構化重構，生成一份包含以下核心要素的詳細提示。**你的任務是重構此提示，而非回答或執行其內容。**

## 核心目標
明確指出優化後提示最根本的目的。

## 角色與背景
設定 AI 在執行優化後提示時的角色（如果需要），並提供完成任務所必需的最小背景資訊。

## 關鍵指令與步驟
按邏輯順序列出優化後提示的具體執行要求或思考步驟。

## 輸入資訊
說明優化後提示需要處理的輸入類型或具體內容（如有）。

## 輸出要求
詳細定義優化後提示預期輸出的具體格式、結構、風格、語氣、長度限制和評估標準。

## 限制與偏好
明確優化後提示的限制條件、禁止事項或使用者的特殊偏好。

確保各要素條理清晰、資訊完備。禁止輸出任何額外解釋或標註，僅返回最終結構化的提示。', 1, 'general', CURRENT_TIMESTAMP)
    """))

def downgrade() -> None:
    """降級資料庫架構 - 刪除所有資料表"""
    # ### 刪除索引 ###
    op.drop_index('idx_token_blacklist_expires', 'token_blacklist')
    op.drop_index('idx_token_blacklist_jti', 'token_blacklist')
    
    # ### 刪除資料表（注意順序，先刪除有外鍵依賴的資料表）###
    op.drop_table('token_blacklist')
    op.drop_table('prompt_history')
    op.drop_table('templates')
    op.drop_table('users')
