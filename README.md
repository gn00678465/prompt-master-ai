# PromptMaster AI

一個智能的 Prompt 優化平台，幫助用戶提升 AI 對話品質和效果。

## 專案概述

PromptMaster AI 是一個基於 Google Gemini API 的智能 Prompt 優化平台，提供：

- 🤖 **智能優化**: 使用 AI 技術分析並改善您的 Prompt
- 📝 **模板系統**: 內建多種專業模板，支援自定義
- 📊 **歷史追蹤**: 完整記錄優化歷史，方便比較和重用
- 🔐 **安全可靠**: 完整的用戶認證和資料保護機制
- 🌐 **現代介面**: 直觀易用的 Web 介面

## 技術架構

### 後端 (FastAPI)
- **框架**: FastAPI + SQLModel
- **資料庫**: SQLite
- **認證**: JWT + Argon2
- **AI 整合**: Google Gemini API

### 前端 (計劃中)
- **框架**: React + TypeScript
- **UI 函式庫**: Material-UI / Ant Design
- **狀態管理**: Zustand / Redux Toolkit
- **HTTP 客戶端**: Axios

## 專案結構

```
prompt-master-ai/
├── backend/                 # 後端 API 服務
│   ├── app/                # 應用程式核心
│   │   ├── api/           # API 路由
│   │   ├── models/        # 資料模型
│   │   ├── schemas/       # 請求/回應結構
│   │   ├── services/      # 業務邏輯
│   │   └── utils/         # 工具函式
│   ├── alembic/           # 資料庫遷移
│   └── tests/             # 測試
├── frontend/               # 前端應用程式 (計劃中)
├── docs/                   # 文件
└── README.md              # 本文件
```

## 快速開始

### 環境需求

- Python 3.11+
- Node.js 18+ (前端開發)
- Google Gemini API Key

### 後端設定

1. **進入後端目錄**
```bash
cd backend
```

2. **安裝相依套件**
```bash
# 使用 pip
pip install -r requirements.txt

# 或使用 uv (推薦)
uv sync
```

3. **環境變數設定**

建立 `backend/.env` 文件：
```env
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=sqlite:///database.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. **執行應用程式**
```bash
python -m app
```

後端服務將在 `http://localhost:8000` 啟動。

### API 文件

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 核心功能

### 1. Prompt 優化

使用專業模板指導 AI 優化您的 Prompt：

```json
{
  "original_prompt": "寫一個關於貓的故事",
  "template_id": 1,
  "model": "gemini-pro"
}
```

### 2. 模板系統

內建三種專業模板：

- **內容創作模板**: 優化創意內容生成
- **程式碼產生器模板**: 改善程式碼產生器品質
- **問題解決模板**: 提升問題分析能力

### 3. 歷史管理

- 完整的優化歷史記錄
- 支援搜尋和篩選
- 快速重用過往 Prompt

### 4. 用戶系統

- 安全的用戶註冊和登入
- 個人化設定
- 資料隱私保護

## 開發指南

### 後端開發

詳細的後端開發指南請參考：[backend/README.md](./backend/README.md)

主要指令：
```bash
# 啟動開發服務器
cd backend && python -m app

# 執行測試
cd backend && python -m pytest

# 資料庫遷移
cd backend && alembic upgrade head

# 程式碼格式化
cd backend && ruff format .
```

### 前端開發 (計劃中)

前端將使用 React + TypeScript 開發，敬請期待。

## API 規格

### 認證端點
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `GET /api/auth/me` - 取得用戶資訊
- `POST /api/auth/logout` - 用戶登出

### Prompt 端點
- `POST /api/prompts/optimize` - 優化 Prompt
- `GET /api/prompts/history` - 取得歷史記錄

### 模板端點
- `GET /api/templates` - 取得模板清單
- `POST /api/templates` - 建立模板
- `PUT /api/templates/{id}` - 更新模板
- `DELETE /api/templates/{id}` - 刪除模板

### 模型端點
- `GET /api/models` - 取得可用模型

## 部署

### Docker 部署

```bash
# 建構映像
docker build -t promptmaster-ai ./backend

# 執行容器
docker run -p 8000:8000 \
  -e SECRET_KEY=your-secret-key \
  -e GEMINI_API_KEY=your-api-key \
  promptmaster-ai
```

### 生產環境

建議使用以下配置：

1. **反向代理**: Nginx 或 Traefik
2. **HTTPS**: Let's Encrypt 憑證
3. **資料庫**: PostgreSQL 或 MySQL
4. **監控**: Prometheus + Grafana
5. **日誌**: ELK Stack 或 Loki

## 貢獻

歡迎貢獻程式碼！請遵循以下步驟：

1. Fork 專案
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 提交變更：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

### 開發規範

- 遵循 PEP 8 程式碼風格
- 編寫完整的測試
- 更新相關文件
- 提交清晰的 commit 訊息

## 路線圖

### v0.1.0 (目前版本)
- ✅ 後端 API 開發
- ✅ 基本 Prompt 優化功能
- ✅ 用戶認證系統
- ✅ 模板管理

### v0.2.0 (計劃中)
- 🔄 前端 Web 應用程式
- 🔄 更多優化模板
- 🔄 批次處理功能
- 🔄 API 速率限制

### v0.3.0 (未來)
- 📋 多語言支援
- 📋 進階分析功能
- 📋 團隊協作功能
- 📋 整合更多 AI 模型

## 授權

本專案採用 MIT 授權條款。詳細內容請參考 [LICENSE](./LICENSE) 文件。

## 支援與回饋

- **問題回報**: 請在 GitHub Issues 中提出
- **功能建議**: 歡迎在 Discussions 中討論
- **文件問題**: 請提交 Pull Request 改善

## 致謝

感謝以下開源專案：

- [FastAPI](https://fastapi.tiangolo.com/) - 現代化的 Python Web 框架
- [SQLModel](https://sqlmodel.tiangolo.com/) - 現代化的 SQL 資料庫 ORM
- [Google Generative AI](https://github.com/google/generative-ai-python) - Google AI 開發套件

---

**專案狀態**: 開發中  
**目前版本**: 0.1.0  
**最後更新**: 2025年6月