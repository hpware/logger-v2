# 部署指南

## Docker 部署

### Dockerfile 說明
使用多階段建置優化映像大小：

```dockerfile
# 建置階段
FROM oven/bun:latest as builder
WORKDIR /app
COPY package.json ./
RUN bun install
COPY . .
RUN bun run build

# 執行階段
FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/.output /app/.output
RUN bun install --production
EXPOSE 3000
CMD ["bun", "run", "preview"]
```

### 建置和執行
```bash
# 建置映像
docker build -t aiot-monitor .

# 執行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="your_postgres_url" \
  -e GEMINI_API_KEY="your_gemini_key" \
  -e MINIO_ENDPOINT="your_minio_endpoint" \
  aiot-monitor
```

## GitHub Actions CI/CD

### 自動化流程
位於 `.github/workflows/build_docker_compose.yml`

**觸發條件：**
- 推送到 master 分支
- 手動觸發

**流程步驟：**
1. 檢出程式碼
2. 登入 GitHub Container Registry
3. 提取中繼資料
4. 建置和推送 Docker 映像

### 映像標籤
- `latest` - 最新版本
- `master` - master 分支
- `sha-{commit}` - 特定提交

## 環境變數設定

### 必要環境變數
```env
# 資料庫
DATABASE_URL=postgresql://user:password@host:port/database

# AI 服務
GEMINI_API_KEY=your_gemini_api_key

# 儲存服務
MINIO_ENDPOINT=your_minio_endpoint
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET_NAME=your_bucket_name
R2_URL=your_r2_url
```

## 生產環境建議

### 效能優化
- 使用 PostgreSQL 連線池
- 設定適當的記憶體限制
- 啟用 gzip 壓縮

### 安全性
- 使用 HTTPS
- 設定防火牆規則
- 定期更新依賴套件

### 監控
- 設定健康檢查端點
- 監控資料庫效能
- 記錄應用程式日誌

## 擴展部署

### Docker Compose 範例
```yaml
version: '3.8'
services:
  app:
    image: ghcr.io/your-repo/aiot-monitor:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - minio

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aiot
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
```