FROM node:22-alpine AS base

# 多階段構建 - 構建階段
FROM base AS builder

# 設定工作目錄
WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製源代碼
COPY . .

# 構建應用
RUN pnpm run build

# 生產階段
FROM base AS production

# 安裝 dumb-init 用於正確處理信號
RUN apk add --no-cache dumb-init curl

# 創建非 root 用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 設定工作目錄
WORKDIR /app

# 設定環境變數
ENV NODE_ENV=production
ENV VITE_API_URL=""

# 從構建階段複製構建產物
COPY --from=builder --chown=nextjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# 切換到非 root 用戶
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 啟動應用
CMD ["dumb-init", "node", ".output/server/index.mjs"]
