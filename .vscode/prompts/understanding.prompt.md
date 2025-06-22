---
mode: agent
tools: ['readFile', 'codebase']
---

協助我了解此專案內容

> Copilot: I'll help you understand this project's content by exploring the codebase structure and key components. Let me start by examining the overall project structure and then dive into specific files to understand the functionality. I'll help you understand this project's content by exploring the codebase structure and key components. Let me examine the project specifications and then dive into the backend and frontend implementations. 讓我繼續幫您了解這個專案的內容。基於我已經讀取的規格文件，這是一個「PromptMaster AI」專案，主要功能是透過 Google Gemini API 來優化 AI 提示詞。讓我進一步探索關鍵的實現文件。 基於我已經探索的內容，讓我繼續深入了解這個專案的核心功能實現。讓我查看關鍵的業務邏輯和組件。 基於我對這個專案的探索，我來為您詳細介紹「PromptMaster AI」專案的內容。
> 
> ## 專案概述
> 
> **PromptMaster AI** 是一個 AI 提示詞優化應用程式，主要功能是透過 Google Gemini API 來分析、優化和改善用戶的 AI 提示詞，幫助用戶獲得更好的 AI 回應結果。
> 
> ## 技術架構
> 
> ### 後端 (FastAPI + Python)
> - **框架**: FastAPI
> - **資料庫**: SQLite + SQLModel
> - **API 整合**: Google Gemini API
> - **認證**: JWT Token 認證系統
> - **資料庫遷移**: Alembic
> 
> ### 前端 (React + TypeScript)
> - **框架**: TanStack Start (Full-Stack React)
> - **路由**: TanStack Router
> - **狀態管理**: TanStack Query + Zustand
> - **樣式**: Tailwind CSS + Radix UI
> - **表單處理**: React Hook Form + Zod
> 
> ## 核心功能
> 
> ### 1. Prompt 智能優化引擎
> - 整合 Google Gemini API
> - 根據選定的模板和參數分析原始 Prompt
> - 自動生成優化版本並提供改寫理由
> - 支持不同類型的 Prompt 優化（內容創作、程式碼生成、問題解決等）
> 
> ### 2. 模板系統
> **預設模板**（至少三種）:
> - 內容創作模板
> - 程式碼生成模板  
> - 問題解決模板
> 
> **自定義模板功能**:
> - 用戶可創建、編輯、刪除自己的模板
> - 模板管理介面
> - 模板分類和搜索功能
> 
> ### 3. 模型與參數控制
> - 支持選擇不同的 Gemini 模型版本
> - 溫度參數調整（0.0-1.0）
> - 可視化參數調整介面
> 
> ### 4. 用戶管理與歷史記錄
> - 用戶註冊、登入系統
> - JWT 基於的認證機制
> - Prompt 優化歷史記錄
> - 歷史記錄查詢和重用功能
> 
> ## 核心頁面結構
> 
> ### 前端頁面
> 1. **首頁** (`/`) - 應用介紹和功能說明
> 2. **認證頁面** (`/auth`) - 登入/註冊
> 3. **Prompt 優化頁面** - 主要功能頁面
> 4. **模板管理頁面** (`/templates`) - 模板 CRUD 操作
> 5. **歷史記錄頁面** (`/history`) - 查看過往優化記錄
> 
> ### 後端 API 結構
> - `/api/v1/auth` - 認證相關 API
> - `/api/v1/prompts` - Prompt 優化 API
> - `/api/v1/templates` - 模板管理 API
> - `/api/v1/models` - 模型相關 API
> 
> ## 關鍵實現特色
> 
> ### 1. 安全性
> - JWT Token 包含 JTI (JWT ID) 進行唯一識別
> - Token 黑名單機制
> - 密碼加密存儲
> - 權限控制（用戶只能訪問自己的資源）
> 
> ### 2. 資料庫設計
> 包含以下主要模型：
> - `User` - 用戶資料
> - `Template` - 模板資料
> - `PromptHistory` - 優化歷史記錄
> - `TokenBlacklist` - Token 黑名單
> 
> ### 3. API 整合
> - 封裝 Google Gemini API 客戶端
> - 錯誤處理與重試機制
> - 支持多種 Gemini 模型選擇
> 
> ### 4. 用戶體驗
> - 響應式設計
> - 明/暗主題切換
> - 實時參數調整
> - 結果複製和保存功能
> 
> 這個專案是一個完整的全端應用程式，旨在幫助用戶更有效地使用 AI 工具，透過智能化的 Prompt 優化來提升 AI 互動的品質和效果。我來協助你了解這個專案的內容。讓我先閱讀一些關鍵檔案來全面了解專案結構。 現在讓我查看前端的相關檔案以了解目前的實作狀況： 基於我對專案檔案的分析，現在為你詳細介紹 **PromptMaster AI** 專案的內容：
> 
> ## 📝 專案概述
> 
> **PromptMaster AI** 是一個智能的 Prompt 優化平台，旨在幫助使用者提升 AI 對話品質和效果。專案整合 Google Gemini API，提供：
> 
> ### 🎯 核心功能
> - **🤖 智能優化**: 使用 AI 技術分析並改善您的 Prompt
> - **📝 模板系統**: 內建多種專業模板，支援自定義
> - **📊 歷史追蹤**: 完整記錄優化歷史，方便比較和重用
> - **🔐 安全可靠**: 完整的用戶認證和資料保護機制
> - **🌐 現代介面**: 直觀易用的 Web 介面
> 
> ### 🎨 目標用戶
> - AI 內容創作者
> - 開發者和技術專業人士
> - 需要有效使用 AI 工具的一般用戶
> 
> ## 🏗️ 技術架構
> 
> ### 後端 (FastAPI)
> - **框架**: FastAPI + SQLModel
> - **資料庫**: SQLite 
> - **認證**: JWT + Token 黑名單機制
> - **AI 整合**: Google Gemini API
> 
> ### 前端 (TanStack Start)
> - **框架**: TanStack Start (Full-Stack React)
> - **路由**: TanStack Router
> - **語言**: TypeScript
> - **狀態管理**: TanStack Query + Zustand
> - **樣式**: Tailwind CSS
> - **表單處理**: React Hook Form + Zod
> 
> ## 🚀 核心功能詳解
> 
> ### 1. Prompt 智能優化引擎
> - 整合 Google Gemini API
> - 根據選定的模板和參數進行分析
> - 生成優化後的 Prompt 版本
> - 提供改寫理由和優化建議
> 
> ### 2. 模板系統
> **預設模板**（至少三種）：
> - **內容創作模板**: 適用於文章、故事、詩歌等
> - **程式碼生成模板**: 適用於程式碼生成需求
> - **問題解決模板**: 適用於問題分析和解決
> 
> **自定義模板功能**：
> - ✅ 建立、編輯、刪除自己的模板
> - ✅ 模板分類和搜索
> - ✅ 權限管理（用戶只能管理自己的模板）
> 
> ### 3. 用戶認證與授權
> - JWT Token 認證（包含 JTI）
> - Token 黑名單機制實現安全登出
> - 用戶註冊、登入功能
> - 權限控制（用戶只能訪問自己的資源）
> 
> ### 4. 歷史記錄管理
> - 記錄用戶的 Prompt 優化歷史
> - 支援查詢和重用
> - 按用戶、日期等篩選
> 
> ## 📁 專案結構
> 
> ```
> prompt-master-ai/
> ├── backend/                 # 後端 API 服務
> │   ├── app/
> │   │   ├── api/            # API 路由
> │   │   ├── models/         # 資料模型
> │   │   ├── schemas/        # 請求/回應結構
> │   │   ├── services/       # 業務邏輯
> │   │   └── utils/          # 工具函式
> │   ├── alembic/            # 資料庫遷移
> │   └── tests/              # 測試
> ├── frontend/               # 前端應用程式
> │   └── src/
> │       ├── routes/         # 路由定義
> │       ├── components/     # React 元件
> │       ├── stores/         # 狀態管理
> │       └── types/          # TypeScript 類型
> ├── docs/                   # 文件
> └── README.md
> ```
> 
> ## 🎨 主要頁面與功能
> 
> ### 前端頁面
> 1. **首頁** (`/`) - 應用介紹與功能概述
> 2. **認證頁面** (`/auth`) - 登入功能
> 3. **Prompt 優化頁面** (`/`) - 主要功能介面
> 4. **模板管理頁面** (`/templates`) - 模板 CRUD 操作
> 5. **歷史記錄頁面** (`/history`) - 查看優化歷史
> 
> ### API 端點
> **認證相關**:
> - `POST /api/auth/login` - 用戶登入
> - `GET /api/auth/me` - 取得用戶資訊
> - `POST /api/auth/logout` - 用戶登出
> 
> **Prompt 相關**:
> - `POST /api/v1/prompts/optimize` - 優化 Prompt
> - `GET /api/v1/prompts/history` - 取得歷史記錄
> 
> **模板相關**:
> - `GET /api/v1/templates` - 取得模板清單
> - `POST /api/v1/templates` - 建立模板
> - `PUT /api/v1/templates/{id}` - 更新模板
> - `DELETE /api/v1/templates/{id}` - 刪除模板
> 
> ## 💾 資料庫設計
> 
> 主要資料表包括：
> - **users** - 用戶資訊
> - **templates** - 模板資料（預設與自定義）
> - **prompt_history** - 優化歷史記錄
> - **token_blacklist** - Token 黑名單
> 
> ## 🔄 核心工作流程
> 
> 1. **使用者輸入** 原始 Prompt
> 2. **選擇模板** 和調整參數
> 3. **後端處理** 獲取模板內容
> 4. **呼叫 Gemini API** 進行優化
> 5. **回傳結果** 並儲存歷史記錄
> 6. **前端展示** 優化結果和分析
> 
> ## 📈 專案現狀
> 
> 從程式碼來看，專案已經實現了：
> - ✅ 完整的後端 API 架構
> - ✅ 前端基礎元件和路由
> - ✅ 模板管理功能（CRUD）
> - ✅ 用戶認證系統
> - ✅ Gemini API 整合
> - ✅ 資料庫模型設計
> 
> 這是一個結構完整、功能豐富的全端 AI 應用專案，專注於提升 AI Prompt 的品質和效果！
