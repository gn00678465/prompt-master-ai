# PromptMaster AI 規格書

## 1. 專案概述

### 1.1 專案目標
開發一個名為「PromptMaster AI」的應用程式，透過整合 Google Gemini API，實現對 Prompt 的優化、改寫與增強。使用者能夠透過應用程式提升他們的 AI 提示詞質量，獲得更好的 AI 回應結果。

### 1.2 主要功能
- Prompt 智能優化引擎
- 可客製化的優化模板系統
- 靈活的模型與參數控制
- 用戶管理與歷史記錄追蹤

### 1.3 目標用戶
- AI 內容創作者
- 開發者和技術專業人士
- 需要有效使用 AI 工具的一般用戶

### 1.4 技術棧
- **後端**：FastAPI (Python)
- **前端**：Next.js (React) + TypeScript
- **資料庫**：SQLite
- **API 整合**：Google Gemini API

---

## 2. 功能規格

### 2.1 Prompt 智能優化引擎

#### 2.1.1 功能描述
整合 Google Gemini API，分析使用者輸入的原始 Prompt，並自動生成更精準、更有效、更具創造力的優化版本。

#### 2.1.2 詳細需求
- 接收用戶輸入的原始 Prompt
- 根據選定的模板和參數進行分析和處理
- 生成優化後的 Prompt 版本
- 提供改寫理由和優化建議
- 支持不同類型的 Prompt（內容創作、程式碼生成、問題解決等）

#### 2.1.3 技術實現
- 使用 Google Generative AI Python 套件連接 Gemini API
- 實現自定義的 Prompt 處理邏輯
- 設計不同類型 Prompt 的處理策略

### 2.2 可客製化的優化模板系統

#### 2.2.1 功能描述
提供預設和自定義的優化模板，幫助使用者針對不同場景獲得最佳優化效果。

#### 2.2.2 預設模板（至少包含以下三種）
1. **內容創作模板**
   - 適用於優化內容創作類提示詞，包括文章、故事、詩歌等
   - 包含格式要求、核心元素、特殊指示等部分

2. **程式碼生成模板**
   - 適用於優化程式碼生成類提示詞
   - 包含技術規格、結構要求、最佳實踐、限制條件等部分

3. **問題解決模板**
   - 適用於優化問題解決類提示詞
   - 包含問題陳述、解決方案要求、評估標準、輸出格式等部分

#### 2.2.3 自定義模板功能
- 允許使用者創建、編輯、刪除自己的模板
- 提供模板管理介面
- 支持模板分類和搜索
- 存儲模板至資料庫

### 2.3 靈活的模型與參數控制

#### 2.3.1 功能描述
提供介面讓使用者選擇不同的 Google Gemini API 模型版本，並調整相關參數。

#### 2.3.2 詳細需求
- 支持選擇不同的 Gemini 模型（如 gemini-pro, gemini-ultra 等可用模型）
- 提供溫度 (temperature) 參數調整，範圍從 0.0 到 1.0
- 可視化參數調整介面
- 提供參數效果說明與建議

#### 2.3.3 技術實現
- 通過 API 獲取可用模型列表
- 實現參數控制界面元件
- 在 API 請求中傳遞選定的參數

### 2.4 用戶管理與歷史記錄

#### 2.4.1 使用者管理
- 支持用戶註冊和登入
- JWT 基於的認證系統
- 用戶偏好設置管理

#### 2.4.2 Prompt 歷史記錄
- 儲存使用者的優化歷史
- 提供歷史記錄查詢和管理
- 支持重用歷史 Prompt 和優化結果

---

## 3. 用戶介面規格

### 3.1 核心頁面

#### 3.1.1 首頁
- 應用介紹和主要功能說明
- 註冊/登入入口
- 產品特色展示

#### 3.1.2 Prompt 優化頁面
- 原始 Prompt 輸入區域
- 模板選擇下拉菜單
- 模型和參數控制區域
- 優化按鈕
- 優化結果顯示區域（包括優化後的 Prompt 和改進分析）
- 複製結果和保存功能

#### 3.1.3 模板管理頁面
- 預設模板列表
- 用戶自定義模板列表
- 創建新模板按鈕
- 模板編輯和刪除功能

#### 3.1.4 歷史記錄頁面
- 歷史優化記錄列表
- 搜索和過濾功能
- 查看詳情和重用選項

#### 3.1.5 設置頁面
- 用戶資料管理
- 默認偏好設置
- 主題設定（明/暗模式）

### 3.2 組件設計

#### 3.2.1 Prompt 輸入組件
- 多行文本輸入
- 字數統計
- 清空和提交按鈕

#### 3.2.2 模板選擇組件
- 下拉選擇框
- 模板預覽功能
- 分類過濾選項

#### 3.2.3 模型控制組件
- 模型選擇下拉框
- 溫度調整滑塊
- 參數說明提示

#### 3.2.4 優化結果組件
- 原始和優化後 Prompt 對比
- 改進建議顯示
- 複製和保存按鈕

### 3.3 響應式設計
- 支持桌面、平板和移動設備
- 在小屏幕上重新排列控制元素
- 優化移動設備的輸入體驗

---

## 4. 技術架構

### 4.1 後端架構

#### 4.1.1 FastAPI 應用結構
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

#### 4.1.2 資料庫模式
```sql
-- 用戶表
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 模板表
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

-- 優化歷史記錄表
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

-- 用戶偏好設定表
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

### 4.2 前端架構

#### 4.2.1 Next.js 應用結構
```
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx             # 首頁
│   │   ├── optimize.tsx          # 優化頁面
│   │   ├── templates/
│   │   │   ├── index.tsx         # 模板列表頁
│   │   │   └── [id].tsx          # 模板詳情頁
│   │   ├── history.tsx           # 歷史記錄頁
│   │   └── auth/
│   │       ├── login.tsx         # 登入頁
│   │       └── register.tsx      # 註冊頁
│   ├── components/
│   │   ├── Layout/
│   │   ├── PromptOptimizer/
│   │   │   ├── PromptInput.tsx
│   │   │   ├── OptimizationResult.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   └── TemperatureSlider.tsx
│   │   ├── Templates/
│   │   ├── Auth/
│   │   └── ui/                   # 通用 UI 元件
│   ├── contexts/
│   │   ├── AuthContext.tsx       # 認證狀態管理
│   │   └── PromptContext.tsx     # Prompt 狀態管理
│   ├── services/
│   │   └── api.ts                # API 服務
│   ├── hooks/
│   │   ├── useTemplates.ts
│   │   └── useModels.ts
│   ├── styles/
│   └── utils/
└── package.json
```

#### 4.2.2 狀態管理策略
- 使用 React Context API 管理全局狀態
- 身份驗證狀態管理
- Prompt 相關狀態管理
- 請求狀態（加載、錯誤等）管理

### 4.3 系統互動流程

#### 4.3.1 Prompt 優化流程
1. 使用者輸入原始 Prompt
2. 選擇模板、模型和參數
3. 發送優化請求至後端
4. 後端獲取模板內容
5. 後端構建 Gemini API 請求
6. 獲取 API 回應並處理結果
7. 返回優化後的 Prompt 和分析至前端
8. 前端展示結果並提供後續操作選項

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
```
username=string&password=string
```
(application/x-www-form-urlencoded 格式)

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

## 6. 安全考量

### 6.1 身份驗證與授權
- 使用 JWT 令牌進行身份驗證
- 實施適當的密碼哈希（bcrypt）
- 實現基於角色的訪問控制
- 設置令牌過期時間

### 6.2 資料保護
- 加密敏感數據
- 防止 SQL 注入攻擊
- 實施 XSS 和 CSRF 防護
- 保護 API 密鑰

### 6.3 API 安全
- 實施速率限制
- 輸入驗證和消毒
- 適當的錯誤處理（不暴露敏感信息）
- 設置 CORS 策略

---

## 7. 測試策略

### 7.1 單元測試
- 測試核心業務邏輯
- 測試 API 端點
- 測試前端組件

### 7.2 整合測試
- 測試前後端交互
- 測試數據庫操作
- 測試外部 API 整合

### 7.3 端到端測試
- 測試完整用戶流程
- 測試響應式設計
- 跨瀏覽器兼容性測試

---

## 8. 部署與監控

### 8.1 部署策略
- 使用 Docker 容器化應用
- 提供開發、測試和生產環境配置
- 實施 CI/CD 自動化流程
- 管理環境變數和秘密

### 8.2 監控與日誌
- API 性能監控
- 錯誤跟蹤與報警
- 用戶行為分析
- 系統資源使用監控

---

## 9. 時間線與里程碑

### 9.1 單人開發時間線 (12-16週)
1. **基本架構與核心功能** (3-4週)
2. **功能完善與優化** (3-4週)
3. **擴展功能** (3-4週)
4. **測試與部署** (2-3週)

### 9.2 關鍵里程碑
1. **架構設計完成**: 確定系統架構、資料庫模式和 API 規格
2. **核心功能實現**: 完成 Prompt 優化引擎和預設模板系統
3. **前端原型**: 實現基本用戶界面和交互
4. **MVP 完成**: 提供最小可行產品
5. **完整功能版本**: 完成所有計劃功能
6. **產品發布**: 完成測試和部署

---

## 10. 限制與假設

### 10.1 限制
- Google Gemini API 的使用限制和費用考量
- 單人開發資源和時間限制
- SQLite 資料庫的擴展性限制

### 10.2 假設
- 用戶具有基本的 Prompt 工程知識
- Google Gemini API 在專案期間保持穩定
- 單一開發者能夠熟練使用所有相關技術

---

## 11. 附錄

### 11.1 術語表
- **Prompt**: 提供給 AI 模型的輸入文本
- **Prompt 工程**: 優化提示詞以獲得更好的 AI 回應的技術
- **Gemini API**: Google 提供的大型語言模型 API
- **溫度 (Temperature)**: 控制 AI 生成內容隨機性的參數

### 11.2 參考資源
- [Google Generative AI Python SDK](https://github.com/google/generative-ai-python)
- [FastAPI 官方文檔](https://fastapi.tiangolo.com/)
- [Next.js 官方文檔](https://nextjs.org/docs)
- [SQLite 官方文檔](https://www.sqlite.org/docs.html)