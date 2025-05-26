# PromptMaster AI 前端規格書

## 2. 後端功能規格

### 2.1 Prompt 智能優化引擎

#### 2.1.1 功能描述
整合 Google Gemini API，設計並實現 Prompt 優化邏輯。

#### 2.1.2 核心功能
- 接收原始 Prompt 並應用模板結構
- 與 Google Gemini API 通信
- 處理 API 回應並提取優化結果
- 提供詳細的優化分析

#### 2.1.3 技術實現
- 設計自定義的 Prompt 處理邏輯
- 實現不同類型 Prompt 的處理策略
- 管理 API 密鑰和認證

### 2.2 模板系統

#### 2.2.1 預設模板
實現至少三個預設優化模板（內容創作、程式碼生成、問題解決），提供不同類型 Prompt 的優化指導。

#### 2.2.2 模板管理
- 提供模板的 CRUD 操作
- 支持用戶自定義模板
- 實現模板權限管理（私有/公共）

### 2.3 用戶認證與授權

#### 2.3.1 用戶管理
- 實現用戶註冊、登入和認證
- 使用 JWT 令牌進行身份驗證
- 安全存儲用戶密碼（使用加密）

#### 2.3.2 權限控制
- 限制用戶只能訪問自己的資源
- 控制模板訪問權限（預設/自定義）
- 實現 API 訪問控制

### 2.4 歷史記錄管理

#### 2.4.1 功能描述
記錄用戶的 Prompt 優化歷史，支持查詢和重用。

#### 2.4.2 核心功能
- 存儲優化請求和結果
- 提供歷史記錄查詢
- 支持按用戶、日期等篩選

---

## 3. 資料庫設計

### 3.1 資料模型

#### 3.1.1 用戶表 (users)
```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

#### 3.1.2 模板表 (templates)
```sql
CREATE TABLE templates (
    template_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### 3.1.3 優化歷史記錄表 (prompt_history)
```sql
CREATE TABLE prompt_history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    original_prompt TEXT NOT NULL,
    optimized_prompt TEXT,
    template_id INTEGER,
    model_used TEXT,
    temperature REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (template_id) REFERENCES templates(template_id)
);
```

#### 3.1.4 用戶偏好設定表 (user_preferences)
```sql
CREATE TABLE user_preferences (
    preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    default_model TEXT,
    default_temperature REAL,
    default_template_id INTEGER,
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (default_template_id) REFERENCES templates(template_id)
);
```

### 3.2 資料庫索引
- 對 `templates` 表的 `user_id` 和 `is_default` 欄位建立索引
- 對 `prompt_history` 表的 `user_id` 和 `created_at` 欄位建立索引
- 對 `user_preferences` 表的 `user_id` 欄位建立唯一索引

---

## 4. 後端架構

### 4.1 FastAPI 應用結構
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # 主應用入口
│   ├── config.py               # 配置文件
│   ├── dependencies.py         # 依賴項
│   ├── models/                 # 資料模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── template.py
│   │   └── prompt_history.py
│   ├── schemas/                # 請求/響應模式
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── template.py
│   │   └── prompt.py
│   ├── api/                    # API 路由
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── prompts.py
│   │   ├── templates.py
│   │   └── models.py
│   ├── services/               # 業務邏輯
│   │   ├── __init__.py
│   │   ├── prompt_optimizer.py
│   │   └── gemini_client.py
│   └── utils/                  # 通用工具
│       ├── __init__.py
│       └── security.py
├── tests/                      # 測試
├── alembic/                    # 資料庫遷移
├── requirements.txt            # 依賴項
└── README.md
```

### 4.2 核心元件

#### 4.2.1 Gemini API 客戶端
設計一個客戶端類封裝 Google Gemini API 的交互。

主要功能：
- API 認證與設置
- 請求構建與發送
- 回應處理與解析
- 錯誤處理與重試

#### 4.2.2 Prompt 優化服務
實現核心的 Prompt 優化邏輯。

主要功能：
- 模板應用邏輯
- Prompt 處理策略
- 結果分析生成

#### 4.2.3 資料庫存取層
使用 SQLAlchemy ORM 實現資料庫交互。

主要功能：
- 模型定義
- CRUD 操作實現
- 事務管理

---

## 5. API 規格

### 5.1 認證 API

#### `POST /api/auth/register`
註冊新用戶。

**請求體**：
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**回應（成功）**：
```json
{
  "user_id": "integer",
  "username": "string",
  "email": "string",
  "created_at": "string"
}
```

#### `POST /api/auth/login`
用戶登入。

**請求體**：
```json
{
  "username": "string",
  "password": "string"
}
```

**回應（成功）**：
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user_id": "integer",
  "username": "string"
}
```

#### `GET /api/auth/me`
獲取當前用戶信息。

**請求頭**：
```
Authorization: Bearer {token}
```

**回應（成功）**：
```json
{
  "user_id": "integer",
  "username": "string",
  "email": "string",
  "created_at": "string"
}
```

#### `GET /api/auth/logout`
用戶登出。

**請求頭**：
```
Authorization: Bearer {token}
```

**回應（成功）**：
```json
{
  "data": "string"
}
```

### 5.2 Prompt API

#### `POST /api/prompts/optimize`
優化 Prompt。

**請求頭**：
```
Authorization: Bearer {token}
```

**請求體**：
```json
{
  "original_prompt": "string",
  "template_id": "integer (可選)",
  "model": "string (default: gemini-pro)",
  "temperature": "float (default: 0.7)"
}
```

**回應（成功）**：
```json
{
  "optimized_prompt": "string",
  "improvement_analysis": "string",
  "original_prompt": "string"
}
```

#### `GET /api/prompts/history`
獲取用戶的 Prompt 歷史記錄。

**請求頭**：
```
Authorization: Bearer {token}
```

**回應（成功）**：
```json
[
  {
    "history_id": "integer",
    "original_prompt": "string",
    "optimized_prompt": "string",
    "model_used": "string",
    "temperature": "float",
    "created_at": "string"
  }
]
```

### 5.3 模板 API

#### `GET /api/templates`
獲取模板列表。

**請求頭**：
```
Authorization: Bearer {token}
```

**請求參數**：
- `category` (可選): 模板類別
- `is_default` (可選): 是否為預設模板

**回應（成功）**：
```json
[
  {
    "template_id": "integer",
    "name": "string",
    "description": "string",
    "is_default": "boolean",
    "category": "string",
    "created_at": "string"
  }
]
```

#### `POST /api/templates`
創建新模板。

**請求頭**：
```
Authorization: Bearer {token}
```

**請求體**：
```json
{
  "name": "string",
  "description": "string",
  "content": "string",
  "category": "string (可選)"
}
```

**回應（成功）**：
```json
{
  "template_id": "integer",
  "name": "string",
  "description": "string",
  "content": "string",
  "is_default": false,
  "category": "string",
  "created_at": "string"
}
```

### 5.4 模型 API

#### `GET /api/models`
獲取可用的模型列表。

**請求頭**：
```
Authorization: Bearer {token}
```

**回應（成功）**：
```json
[
  {
    "id": "string",
    "displayName": "string"
  }
]
```

---

## 6. 預設模板設計

### 6.1 內容創作模板
```
# 內容創作優化模板

請按照以下結構優化提示詞，使其能夠生成更高質量的創意內容：

## 格式要求
- 清晰定義內容類型（文章、故事、腳本等）
- 指定目標受眾
- 明確風格和語調
- 添加長度或字數要求

## 核心元素
- 主題和焦點明確
- 包含具體的內容結構建議
- 提供關鍵點或必須涵蓋的要素
- 加入具體例子或參考資料（如適用）

## 特殊指示
- 需要避免的內容或方向
- 特殊格式要求
- 獨特的創意角度建議
```

### 6.2 程式碼生成模板
```
# 程式碼生成優化模板

請按照以下結構優化提示詞，使其能夠生成更高質量、更實用的程式碼：

## 技術規格
- 清晰指定程式語言和版本
- 定義目標框架或庫
- 說明代碼運行環境
- 明確功能需求和預期輸出

## 結構要求
- 代碼組織和模塊化建議
- 命名規範和風格指南
- 錯誤處理要求
- 註釋和文檔要求

## 最佳實踐
- 性能考量
- 安全性要求
- 可擴展性建議
- 測試要求（如適用）

## 限制條件
- 代碼長度或複雜度限制
- 依賴項限制
- 兼容性要求
```

### 6.3 問題解決模板
```
# 問題解決優化模板

請按照以下結構優化提示詞，使其能夠得到更全面、更深入的問題解析和解決方案：

## 問題陳述
- 清晰描述需要解決的問題
- 提供相關背景和上下文
- 定義問題的範圍和限制
- 說明已嘗試的方法（如適用）

## 解決方案要求
- 解決方案的類型（理論分析、實踐步驟、策略建議等）
- 詳細程度要求
- 是否需要多種替代方案
- 可行性和實施難度評估要求

## 評估標準
- 解決方案應滿足的關鍵標準
- 成功的定義和衡量方式
- 需要考慮的權衡因素
- 優先級考量

## 輸出格式
- 結構化回答（步驟、清單、比較等）
- 視覺化需求（如圖表、流程圖）
- 總結和建議的呈現方式
```

---

## 7. 後端安全考量

### 7.1 認證與授權
- 使用 JWT 令牌進行身份驗證
- 實現密碼哈希（bcrypt）
- 設置令牌過期時間
- 實現適當的授權檢查

### 7.2 資料保護
- 資料驗證與清理
- 防止 SQL 注入攻擊
- 敏感資料加密
- 安全處理第三方 API 密鑰

### 7.3 API 安全
- 實施速率限制
- CORS 策略設置
- 請求驗證
- 安全的錯誤處理

---

## 8. 後端測試規格

### 8.1 單元測試
- 測試核心業務邏輯
- 測試數據模型和查詢
- 測試工具函數

### 8.2 整合測試
- 測試 API 端點功能
- 測試資料庫交互
- 測試外部 API 整合

### 8.3 性能測試
- 測試 API 端點的響應時間
- 測試並發請求處理能力
- 測試資料庫性能

---

## 9. 部署與監控

### 9.1 部署考量
- 環境變數管理
- 資料庫遷移策略
- 容器化部署支持
- CI/CD 整合

### 9.2 監控與日誌
- 設計 API 性能監控
- 實現錯誤日誌記錄
- 配置異常警報系統
- 設置 API 使用量監控

---

## 10. 參考資源

- [FastAPI 官方文檔](https://fastapi.tiangolo.com/)
- [SQLAlchemy 文檔](https://docs.sqlalchemy.org/)
- [Google Generative AI Python SDK](https://github.com/google/generative-ai-python)
- [JWT 認證](https://jwt.io/)