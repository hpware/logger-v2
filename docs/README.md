# AIOT 生態物種即時監測回報裝置網頁系統 文件

這是一個基於 Nuxt.js 的 IoT 生態監測系統，整合了即時感測器資料收集、圖片上傳、AI 動物識別和資料視覺化功能。

## 文件目錄

- [系統架構](./architecture.md) - 整體系統架構說明
- [API 文件](./api.md) - 所有 API 端點說明
- [資料庫架構](./database.md) - 資料庫表格和關聯說明
- [前端頁面](./frontend.md) - 前端頁面和組件說明
- [部署指南](./deployment.md) - Docker 和部署設定
- [開發指南](./development.md) - 開發環境設定和指南
- [AI 整合](./ai-integration.md) - Gemini AI 和圖片分析
- [儲存系統](./storage.md) - MinIO/S3 儲存設定

## 快速開始

1. 安裝依賴：`bun install`
2. 設定環境變數
3. 啟動開發伺服器：`bun dev`
4. 訪問 `http://localhost:3000`

## 主要功能

- 🌡️ 即時感測器資料監控
- 📸 圖片上傳和 AI 動物識別
- 📊 資料視覺化和歷史記錄
- 🔧 裝置管理和控制
- 🗄️ PostgreSQL 資料庫整合
- ☁️ MinIO/S3 雲端儲存