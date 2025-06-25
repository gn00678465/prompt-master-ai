# Prompt Master AI - 前端

Prompt Master AI 的前端介面，提供優雅的 UI 來使用 prompt 最佳化功能。

## 功能特色

### 🔐 安全儲存
- 使用瀏覽器原生 Web Crypto API 進行 API 密鑰加密
- AES-GCM 256 位元加密演算法
- 本地 IndexedDB 儲存，保護用戶隱私

### 🎯 智能最佳化
- 支援多種 AI 模型（Gemini Pro、GPT 系列等）
- 提供預設模板，快速開始
- 即時最佳化建議

### 📱 現代化介面
- 響應式設計，支援各種裝置
- 直觀的使用者介面
- 深色/淺色主題切換

## 技術架構

### 前端技術棧
- **框架**: TanStack Start + React 19
- **樣式**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand
- **資料存取**: TanStack Query
- **本地儲存**: Dexie.js (IndexedDB)
- **加密**: Web Crypto API
- **建構工具**: Vite

### 安全功能

#### API 密鑰加密儲存
使用瀏覽器原生 Web Crypto API 實作：

```typescript
// 加密 API 密鑰
const encryptedKey = await encryptText(apiKey)

// 解密 API 密鑰
const decryptedKey = await decryptText(encryptedKey)
```

**加密規格：**
- 演算法：AES-GCM
- 金鑰長度：256 位元
- IV（初始化向量）：隨機產生 12 位元組
- 儲存格式：Base64 編碼

**安全特點：**
- 加密金鑰儲存在 localStorage 中
- 每次加密使用不同的隨機 IV
- 無法從加密文字反推原始內容
- 符合 Web 標準，不依賴第三方函式庫

## 開發指南

### 安裝相依套件
```bash
pnpm install
```

### 開發模式
```bash
pnpm dev
```

### 建構專案
```bash
pnpm build
```

### 測試加密功能
```bash
# 在瀏覽器 console 中執行
import { testCrypto } from './test/crypto.test'
testCrypto()
```

## 專案結構

```
src/
├── components/          # UI 元件
│   ├── ui/             # 基礎 UI 元件
│   ├── api-key-input.tsx  # API 密鑰輸入元件
│   ├── prompt-optimizer.tsx  # Prompt 最佳化元件
│   └── ...
├── hooks/              # 自訂 React Hooks
├── routes/             # 路由頁面
├── stores/             # Zustand 狀態管理
├── types/              # TypeScript 型別定義
├── utils/              # 工具函式
│   ├── crypto.ts       # 加密工具
│   ├── db.ts          # 資料庫配置
│   └── api.ts         # API 客戶端
└── styles/             # 樣式檔案
```

## 最佳實踐

### 安全考量
1. **API 密鑰保護**: 所有 API 密鑰都經過加密後才儲存
2. **本地儲存**: 敏感資料不會上傳到伺服器
3. **錯誤處理**: 加密/解密錯誤會優雅處理

### 效能最佳化
1. **程式碼分割**: 使用動態 import 減少初始載入時間
2. **快取策略**: TanStack Query 提供智能快取
3. **懶載入**: 元件按需載入

## 相關文件

- [SPEC.md](./SPEC.md) - 功能規格文件
- [CLAUDE.md](./CLAUDE.md) - Claude 開發指南
- [後端 API 文件](../backend/README.md)
