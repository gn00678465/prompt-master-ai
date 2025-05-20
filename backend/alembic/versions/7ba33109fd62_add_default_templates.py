"""add default templates

Revision ID: 7ba33109fd62
Revises: 
Create Date: 2025-05-20 21:32:17.650892

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7ba33109fd62'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    templates_table = sa.table(
        'templates',
        sa.column('user_id', sa.Integer),
        sa.column('name', sa.String),
        sa.column('description', sa.String),
        sa.column('content', sa.Text),
        sa.column('is_default', sa.Boolean),
        sa.column('category', sa.String),
    )

    op.bulk_insert(
        templates_table,
        [
            {
                "user_id": None,
                "name": "內容創作優化模板",
                "description": "提升創意內容品質的結構化模板",
                "content": """# 內容創作優化模板\n\n請按照以下結構優化提示詞，使其能夠生成更高質量的創意內容：\n\n## 格式要求\n- 清晰定義內容類型（文章、故事、腳本等）\n- 指定目標受眾\n- 明確風格和語調\n- 添加長度或字數要求\n\n## 核心元素\n- 主題和焦點明確\n- 包含具體的內容結構建議\n- 提供關鍵點或必須涵蓋的要素\n- 加入具體例子或參考資料（如適用）\n\n## 特殊指示\n- 需要避免的內容或方向\n- 特殊格式要求\n- 獨特的創意角度建議\n""",
                "is_default": True,
                "category": "內容創作"
            },
            {
                "user_id": None,
                "name": "程式碼生成優化模板",
                "description": "提升程式碼產生品質的結構化模板",
                "content": """# 程式碼生成優化模板\n\n請按照以下結構優化提示詞，使其能夠生成更高質量、更實用的程式碼：\n\n## 技術規格\n- 清晰指定程式語言和版本\n- 定義目標框架或庫\n- 說明代碼運行環境\n- 明確功能需求和預期輸出\n\n## 結構要求\n- 代碼組織和模塊化建議\n- 命名規範和風格指南\n- 錯誤處理要求\n- 註釋和文檔要求\n\n## 最佳實踐\n- 性能考量\n- 安全性要求\n- 可擴展性建議\n- 測試要求（如適用）\n\n## 限制條件\n- 代碼長度或複雜度限制\n- 依賴項限制\n- 兼容性要求\n""",
                "is_default": True,
                "category": "程式碼生成"
            },
            {
                "user_id": None,
                "name": "問題解決優化模板",
                "description": "提升問題解析與解決方案品質的結構化模板",
                "content": """# 問題解決優化模板\n\n請按照以下結構優化提示詞，使其能夠得到更全面、更深入的問題解析和解決方案：\n\n## 問題陳述\n- 清晰描述需要解決的問題\n- 提供相關背景和上下文\n- 定義問題的範圍和限制\n- 說明已嘗試的方法（如適用）\n\n## 解決方案要求\n- 解決方案的類型（理論分析、實踐步驟、策略建議等）\n- 詳細程度要求\n- 是否需要多種替代方案\n- 可行性和實施難度評估要求\n\n## 評估標準\n- 解決方案應滿足的關鍵標準\n- 成功的定義和衡量方式\n- 需要考慮的權衡因素\n- 優先級考量\n\n## 輸出格式\n- 結構化回答（步驟、清單、比較等）\n- 視覺化需求（如圖表、流程圖）\n- 總結和建議的呈現方式\n""",
                "is_default": True,
                "category": "問題解決"
            }
        ]
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
