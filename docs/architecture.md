# 系統架構

## 技術堆疊

### 前端

- **Nuxt.js 3** - Vue.js 全端框架
- **TailwindCSS 4** - CSS 框架
- **Animate.css** - 動畫效果
- **TypeScript** - 型別安全

### 後端

- **Nuxt Server API** - 伺服器端 API
- **PostgreSQL** - 主要資料庫
- **Bun** - JavaScript 執行環境

### 外部服務

- **Google Gemini AI** - 圖片分析和動物識別
- **MinIO/S3** - 圖片儲存
- **中央氣象署 API** - 天氣資料

### 部署

- **Docker** - 容器化部署
- **GitHub Actions** - CI/CD 自動化

## 系統流程

```
IoT 裝置 → API 端點 → 資料處理 → 資料庫儲存
                    ↓
圖片上傳 → MinIO 儲存 → Gemini AI 分析 → 偵測結果儲存
                    ↓
前端介面 ← 即時資料查詢 ← 資料庫
```

## 資料夾結構

```
├── pages/           # 前端頁面
├── server/          # 後端 API 和邏輯
├── styles/          # CSS 樣式
├── docs/            # 文件
├── .github/         # GitHub Actions
└── Dockerfile       # Docker 設定
```
