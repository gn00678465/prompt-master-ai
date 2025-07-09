# 多階段建置 Dockerfile
# 階段 1: 建置階段
FROM node:22-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 安裝 pnpm
RUN corepack enable

# 複製套件管理檔案
COPY package.json pnpm-lock.yaml ./

# 安裝依賴套件
RUN pnpm install --frozen-lockfile

# 複製原始碼
COPY . .

# 執行建置
RUN pnpm run build

# 階段 2: 生產階段
FROM node:22-alpine AS runner

# 安裝必要套件
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    dumb-init

# 建立非 root 使用者
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 設定工作目錄
WORKDIR /app

# 從建置階段複製建置結果
COPY --from=builder --chown=nextjs:nodejs /app/.output ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 切換到非 root 使用者
USER nextjs

# 暴露端口
EXPOSE 3000

# 使用 dumb-init 作為 PID 1，直接執行應用程式
ENTRYPOINT ["dumb-init", "--"]

# 針對 Next.js 建置輸出
CMD ["node", "server/index.mjs"]
