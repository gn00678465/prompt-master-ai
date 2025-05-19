# PromptMaster AI 規格書

## 1. 專案概述

### 1.1 專案目標
開發「PromptMaster AI」的前端介面，支援與後端的互動，實現 Prompt 的優化、改寫與增強功能。前端需提供直觀的使用者界面，讓使用者能夠輕鬆提交 Prompt、選擇模板、調整參數並查看優化結果。

### 1.2 前端主要功能
- 提供 Prompt 輸入與優化結果展示介面
- 實現可客製化的模板選擇與管理系統
- 提供模型與參數控制元件
- 實現用戶身份驗證和歷史記錄管理

### 1.3 技術棧
- **框架**: Next.js (React)
- **語言**: TypeScript
- **狀態管理**: React Context API
- **樣式**: Tailwind CSS 或其他 UI 框架
- **API 通訊**: Axios

---

## 2. 前端功能規格

### 2.1 用戶介面

#### 2.1.1 核心頁面
1. **首頁**
   - 應用介紹與功能概述
   - 註冊/登入入口
   - 產品特色展示

2. **Prompt 優化頁面**
   - 原始 Prompt 輸入區域
   - 模板選擇功能
   - 模型和參數控制區域
   - 優化結果顯示區

3. **模板管理頁面**
   - 預設模板展示
   - 自定義模板列表
   - 創建/編輯模板功能

4. **歷史記錄頁面**
   - 歷史優化記錄列表
   - 篩選和搜索功能
   - 重用功能

5. **設置頁面**
   - 用戶資料管理
   - 默認偏好設定
   - 主題切換功能

#### 2.1.2 核心元件
1. **PromptInput 元件**
   - 多行文本輸入框
   - 字數統計功能
   - 清空和提交按鈕

2. **TemplateSelector 元件**
   - 下拉選擇框
   - 模板預覽功能
   - 創建新模板入口

3. **ModelSelector 元件**
   - 模型選擇下拉框
   - 參數說明提示

4. **TemperatureSlider 元件**
   - 溫度參數調節滑塊
   - 視覺化參數顯示
   - 參數影響提示

5. **OptimizationResult 元件**
   - 原始與優化後對比顯示
   - 優化分析展示
   - 複製和保存功能

### 2.2 用戶體驗規格

#### 2.2.1 響應式設計
- 支援桌面、平板和移動設備
- 桌面版佈局採用左側控制面板 + 右側主內容區域
- 移動版佈局採用垂直堆疊的元素排列

#### 2.2.2 載入狀態與互動反饋
- 提交優化請求時顯示載入動畫
- 操作成功/失敗後顯示適當的通知
- 即時顯示輸入字數等參數
- 滾動到結果區域的平滑過渡

#### 2.2.3 無障礙設計
- 符合 WCAG 2.1 AA 標準
- 提供適當的顏色對比
- 支援鍵盤導航
- 添加恰當的 ARIA 屬性

---

## 3. 前端架構

### 3.1 Next.js 應用結構
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

### 3.2 狀態管理

#### 3.2.1 認證狀態 (AuthContext)
管理用戶的登入狀態、認證令牌和用戶資訊。

**主要狀態**:
- `user`: 當前用戶資訊
- `isLoading`: 認證請求狀態
- `error`: 認證錯誤訊息

**主要功能**:
- `login()`: 處理用戶登入
- `register()`: 處理用戶註冊
- `logout()`: 處理用戶登出
- `clearError()`: 清除錯誤訊息

#### 3.2.2 Prompt 狀態 (PromptContext)
管理 Prompt 優化相關的狀態。

**主要狀態**:
- `originalPrompt`: 原始 Prompt 文字
- `optimizedPrompt`: 優化後的 Prompt 文字
- `improvementAnalysis`: 優化分析內容

**主要功能**:
- `setOriginalPrompt()`: 更新原始 Prompt
- `setOptimizedPrompt()`: 更新優化後的 Prompt
- `reset()`: 重置 Prompt 狀態

### 3.3 API 服務

#### 3.3.1 API 客戶端設置
```typescript
// 示例架構，不需要實現
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加認證令牌
api.interceptors.request.use(/* ... */);

// 響應攔截器 - 處理錯誤
api.interceptors.response.use(/* ... */);

// API 服務實現
const apiService = {
  auth: {
    login: async (username, password) => { /* ... */ },
    register: async (userData) => { /* ... */ },
    me: async () => { /* ... */ },
  },
  prompts: {
    optimize: async (data) => { /* ... */ },
    history: async () => { /* ... */ },
    // ...其他方法
  },
  // ...其他服務
};

export default apiService;
```

---

## 4. 前後端交互

### 4.1 API 整合

#### 4.1.1 認證 API
- `POST /api/auth/register`: 用戶註冊
- `POST /api/auth/login`: 用戶登入
- `GET /api/auth/me`: 獲取當前用戶資訊

#### 4.1.2 Prompt API
- `POST /api/prompts/optimize`: 提交 Prompt 進行優化
- `GET /api/prompts/history`: 獲取用戶的 Prompt 歷史

#### 4.1.3 模板 API
- `GET /api/templates`: 獲取模板列表
- `GET /api/templates/{template_id}`: 獲取特定模板
- `POST /api/templates`: 創建新模板
- `PUT /api/templates/{template_id}`: 更新模板
- `DELETE /api/templates/{template_id}`: 刪除模板

#### 4.1.4 模型 API
- `GET /api/models`: 獲取可用的模型列表

### 4.2 請求/響應格式
詳見後端 API 規格。前端需要根據這些格式進行資料發送和接收處理。

### 4.3 錯誤處理
- 實現全局錯誤處理邏輯
- 顯示用戶友好的錯誤訊息
- 實現錯誤重試機制
- 處理網絡錯誤和服務器錯誤

---

## 5. 前端測試規格

### 5.1 單元測試
- 測試各個 React 元件的渲染和行為
- 測試自定義 hook 的功能
- 測試上下文提供者的狀態管理

### 5.2 整合測試
- 測試頁面級元件
- 測試與 API 的整合
- 測試表單提交和數據流程

### 5.3 端到端測試
- 測試完整用戶流程
- 測試不同平台和瀏覽器的兼容性
- 測試響應式設計在不同設備上的表現

---

## 6. 前端安全考量

### 6.1 認證與授權
- 安全處理和存儲認證令牌
- 實現自動登出過期會話
- 保護受限頁面不被未授權訪問

### 6.2 資料安全
- 避免在客戶端存儲敏感資訊
- 實施 XSS 防護措施
- 針對表單實施適當的資料驗證

### 6.3 API 安全
- 保護 API 請求
- 防止 CSRF 攻擊
- 實施恰當的錯誤處理

---

## 7. 前端部署規格

### 7.1 構建流程
- 設置不同環境的構建配置
- 優化構建產出的大小和性能
- 實施代碼分割和懶加載

### 7.2 部署流程
- 支援靜態站點生成 (SSG) 或服務器端渲染 (SSR)
- 配置持續集成/持續部署 (CI/CD)
- 設置適當的緩存策略

### 7.3 性能優化
- 實施圖片和資源優化
- 添加適當的預加載和預取策略
- 監控和改進頁面速度指標

---

## 8. 參考資源

- [Next.js 官方文檔](https://nextjs.org/docs)
- [React 官方文檔](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Axios 文檔](https://axios-http.com/docs/intro)

---

# PromptMaster AI 後端規格書

## 1. 專案概述

### 1.1 專案目標
開發「PromptMaster AI」的後端系統，提供 Prompt 優化服務的核心功能，包括與 Google Gemini API 的整合、資料庫操作、API 端點設計以及認證系統。

### 1.2 後端主要功能
- Prompt 智能優化引擎
- 模板管理系統
- 用戶認證與授權
- 歷史記錄追蹤

### 1.3 技術棧
- **框架**: FastAPI (Python)
- **資料庫**: SQLite
- **ORM**: SQLAlchemy
- **API 文檔**: Swagger/OpenAPI
- **外部 API**: Google Gemini API