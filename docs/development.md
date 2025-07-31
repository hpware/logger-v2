# 開發指南

## 開發環境設定

### 系統需求

- Node.js 18+ 或 Bun
- PostgreSQL 12+
- MinIO 或 S3 相容儲存

### 安裝步驟

1. **複製專案**

```bash
git clone <repository-url>
cd aiot-monitor
```

2. **安裝依賴**

```bash
# 使用 bun (推薦)
bun install

# 或使用 npm
npm install
```

3. **環境變數設定**
   複製 `.env.example` 到 `.env` 並填入設定值

4. **資料庫初始化**
   啟動應用程式後訪問 `/createDatabase` 建立資料表

5. **啟動開發伺服器**

```bash
bun dev
# 或
npm run dev
```

## 專案結構

```
├── pages/              # 頁面路由
│   ├── index.vue      # 主頁面
│   ├── devices/       # 裝置相關頁面
│   └── admin/         # 管理頁面
├── server/            # 後端 API
│   ├── api/           # API 端點
│   ├── db/            # 資料庫連線
│   └── routes/        # 伺服器路由
├── layouts/           # 頁面佈局
├── styles/            # CSS 樣式
└── docs/              # 文件
```

## 開發規範

### TypeScript 使用

- 所有新檔案使用 TypeScript
- 定義適當的型別介面
- 使用嚴格模式

### API 開發

- 使用 Nuxt 伺服器 API
- 統一錯誤處理格式
- 加入適當的驗證

### 前端開發

- 使用 Composition API
- 響應式設計原則
- 無障礙設計考量

## 除錯技巧

### 後端除錯

```typescript
// 在 server/api 檔案中加入
console.log("Debug info:", data);
```

### 前端除錯

```vue
<script setup>
// 使用 Vue DevTools
console.log("Component data:", reactive_data);
</script>
```

### 資料庫除錯

```typescript
// 檢視 SQL 查詢
const result = await sql`SELECT * FROM logger`;
console.log("Query result:", result);
```

## 測試

### 手動測試

1. 測試裝置註冊流程
2. 驗證資料上傳功能
3. 檢查 AI 分析結果
4. 確認前端顯示正確

### API 測試

使用 Postman 或 curl 測試 API 端點：

```bash
# 測試裝置清單
curl http://localhost:3000/api/devices

# 測試資料上傳
curl -X POST http://localhost:3000/api/device_store/uuid \
  -H "Content-Type: application/json" \
  -d '{"local_temp": 25.5}'
```

## 常見問題

### 資料庫連線失敗

檢查 `DATABASE_URL` 環境變數和 PostgreSQL 服務狀態

### 圖片上傳失敗

確認 MinIO 設定和網路連線

### AI 分析錯誤

檢查 `GEMINI_API_KEY` 和 API 配額

## 貢獻指南

1. 建立功能分支
2. 遵循程式碼風格
3. 加入適當註解
4. 測試功能完整性
5. 提交 Pull Request
