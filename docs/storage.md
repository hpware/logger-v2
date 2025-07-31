# 儲存系統說明

## MinIO/S3 設定

系統使用 MinIO 作為物件儲存，相容 S3 API。

### 環境變數

```env
MINIO_ENDPOINT=your_minio_endpoint
MINIO_ACCESS_KEY=your_access_key
MINIO_SECRET_KEY=your_secret_key
MINIO_BUCKET_NAME=your_bucket_name
R2_URL=your_r2_url
```

## 儲存配置

### 兩種儲存設定

#### 1. uploadImage.ts 設定

```typescript
const s3Client = new S3Client({
  region: "tw-home-1",
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});
```

**圖片 URL 格式：**

```
${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/uploads/${fileName}
```

#### 2. device_store 設定

```typescript
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});
```

**圖片 URL 格式：**

```
${process.env.R2_URL}/${deviceId}/${fileName}
```

## 檔案上傳流程

### 1. 圖片處理

- 接收 base64 編碼圖片
- 移除 data URL 前綴
- 轉換為 Buffer

### 2. 檔案命名

```typescript
const fileName = `image_${uuidv4()}.jpg`;
```

### 3. 上傳參數

```typescript
const upload = new Upload({
  client: s3Client,
  params: {
    Bucket: process.env.MINIO_BUCKET_NAME!,
    Key: `${deviceId}/${fileName}`,
    Body: buffer,
    ContentType: "image/jpeg",
  },
});
```

## 儲存結構

```
bucket/
├── uploads/           # 獨立上傳的圖片
│   └── image_uuid.jpg
└── device-uuid/       # 裝置專用資料夾
    └── image_uuid.jpg
```

## 存取控制

- 使用 Access Key 和 Secret Key 認證
- 支援 forcePathStyle 模式
- 自動產生唯一檔名避免衝突

## 錯誤處理

- 上傳失敗時拋出例外
- 記錄詳細錯誤訊息
- 確保資料庫和儲存的一致性
