# 使用 uv 官方 Python 3.11 slim 映像檔作為基礎映像檔
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

# 設定工作目錄
WORKDIR /app

# 設定環境變數
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# 複製 uv 相關檔案
COPY pyproject.toml uv.lock ./

# 安裝依賴項目
RUN uv sync --frozen --no-cache

# 複製應用程式原始碼
COPY . .

# 建立 SQLite 資料庫目錄
RUN mkdir -p /app/data

# 暴露應用程式連接埠
EXPOSE 8000

# 使用 uv 執行應用程式
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
