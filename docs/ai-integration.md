# AI 整合說明

## Gemini AI 設定

系統使用 Google Gemini AI 進行圖片分析和動物識別。

### 環境變數
```env
GEMINI_API_KEY=your_gemini_api_key
```

### AI 模型
使用 `gemini-2.5-flash` 模型進行圖片分析

## 圖片分析流程

### 1. 圖片預處理
```typescript
const base64Data = base64ImageString.replace(/^data:image\/\w+;base64,/, "");
const buffer = Buffer.from(base64Data, "base64");
```

### 2. AI 分析請求
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    `What animals do you see in this image? Please be specific but concise, 
     and it REQUIRES to be an animal, no trees, no branches. 
     And return with the JSON format, 
     { "item": "scientific_name", "chinese_name": "chinese_name", 
       "found_timestamp": "the_current_time" }`,
    ...imageParts,
  ],
});
```

### 3. 回應格式
AI 回傳 JSON 格式的分析結果：
```json
{
  "item": "Passer montanus",
  "chinese_name": "麻雀",
  "found_timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 動物識別特點

- **專注動物識別**：只識別動物，忽略植物和其他物體
- **學名和中文名**：提供科學學名和中文名稱
- **時間戳記**：記錄偵測時間
- **錯誤處理**：無法識別時回傳 null

## 整合端點

### 主要整合點
1. `/api/device_store/[slug].post.ts` - IoT 裝置上傳
2. `/api/uploadImage.ts` - 獨立圖片上傳

### 資料儲存
分析結果儲存在 `detect` 資料表：
- `device_id`: 裝置 UUID
- `item`: 動物學名
- `imageurl`: 圖片 URL
- `detected_at`: 偵測時間

## 效能考量

- 使用非同步處理避免阻塞
- 錯誤處理機制確保系統穩定性
- 圖片大小限制避免過度消耗資源