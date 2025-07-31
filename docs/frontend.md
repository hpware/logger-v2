# 前端頁面說明

## 頁面結構

### 主頁面 (`pages/index.vue`)
- 裝置選擇和登入介面
- 密碼驗證和認證令牌取得
- 裝置清單動態載入

**主要功能：**
- 裝置下拉選單
- 密碼輸入驗證
- 載入動畫效果
- 自動跳轉到裝置頁面

### 裝置監控頁面 (`pages/devices/[slug].vue`)
即時監控特定裝置的資料

**顯示內容：**
- 即時攝影機畫面
- 天氣資料（溫度、濕度、每日高低溫）
- 本地感測器資料
- GPS 位置資訊
- 裝置控制（蠕動馬達、燈光）
- 動物偵測歷史記錄

**即時更新：**
- 每 3 秒自動更新資料
- 使用快取機制避免重複請求

### 管理中心 (`pages/admin/index.vue`)
系統管理主頁面

**功能選項：**
- 新增裝置
- 刪除裝置
- 資料庫初始化

### 新增裝置頁面 (`pages/admin/createmachine.vue`)
新增 IoT 裝置到系統

**輸入欄位：**
- 裝置名稱
- IP 位址和埠號
- 存取密碼

## 佈局系統

### 主佈局 (`layouts/main.vue`)
一般頁面使用的佈局

### 管理佈局 (`layouts/admin.vue`)
管理頁面專用佈局

## 樣式系統

使用 TailwindCSS 4 和自定義 CSS 類別：

```css
.text-border {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.btn {
  @apply py-2 px-4 rounded-md font-semibold transition-all duration-300;
}
```

## 動畫效果

使用 Animate.css 提供頁面轉場效果：
- `animate__fadeIn` - 淡入效果
- `animate__fadeOut` - 淡出效果