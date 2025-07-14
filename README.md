# Prompt Master AI

AI 提示詞最佳化工具，提供提示詞範本管理、歷史記錄追蹤和智慧最佳化功能。

## 功能特色

- 🤖 AI 提示詞最佳化
- 📝 提示詞範本管理
- 📚 歷史記錄追蹤
- 🔐 使用者認證系統
- 🐳 Docker 容器化部署

## 快速開始

### 環境設定

1. 複製環境變數範例檔案：
```bash
cp .env.example .env
```

2. 編輯 `.env` 檔案，設定必要的環境變數：
```bash
# JWT 認證密鑰 (請務必更改為安全的隨機字串)
SECRET_KEY=your-very-secure-secret-key-change-this-in-production

# Google Gemini API 金鑰
GEMINI_API_KEY=your-gemini-api-key-here

# 前端 API URL (生產環境時請更改為實際域名)
VITE_API_URL=http://localhost:8000
```

### Docker 部署

#### 開發環境
```bash
# 使用預設設定啟動
docker-compose up -d
```

#### 生產環境
```bash
# 自訂 API URL
VITE_API_URL=https://api.yourdomain.com docker-compose up -d --build
```

### 本地開發

#### 後端開發
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 前端開發
```bash
cd frontend
pnpm install
pnpm run dev
```

## 核心參數說明

### VITE_API_URL
前端應用程式的 API 基礎 URL。這是一個**編譯時參數**，需要在建構 Docker 映像檔時指定。

- **開發環境**：`http://localhost:8000`
- **生產環境**：`https://api.yourdomain.com`

### 編譯時參數設定
```bash
# 方法 1: 透過環境變數
export VITE_API_URL=https://api.yourdomain.com
docker-compose up -d --build

# 方法 2: 直接在命令中指定
VITE_API_URL=https://api.yourdomain.com docker-compose up -d --build

# 方法 3: 手動建構 Docker 映像檔
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t prompt-master-frontend ./frontend
```

## 架構說明

- **前端**：React + TanStack Router + Vite
- **後端**：FastAPI + SQLite + Redis
- **容器化**：Docker + Docker Compose

## 開發流程

1. 建立功能分支
2. 開發與測試
3. 提交 Pull Request
4. Code Review
5. 合併到主分支
6. 自動部署

## 貢獻指南

歡迎提交 Issue 和 Pull Request 來改善這個專案。

## 授權條款

MIT License
