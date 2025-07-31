# API 文件

## 裝置相關 API

### GET /api/devices

取得所有已註冊的裝置清單

**回應格式：**

```json
{
  "endpoint": "/logger/devicedata/",
  "viewpoint": "/logger/device/",
  "data": [
    {
      "uuid": "device-uuid",
      "name": "裝置名稱",
      "ip": "192.168.1.100",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/device_store/[slug]

IoT 裝置上傳感測器資料和圖片

**請求參數：**

- `slug`: 裝置 UUID

**請求內容：**

```json
{
  "cwa_type": "天氣類型",
  "cwa_location": "氣象站位置",
  "cwa_temp": 25.5,
  "cwa_hum": 60,
  "local_temp": 26.0,
  "local_hum": 65,
  "local_gps_lat": 25.033,
  "local_gps_long": 121.5654,
  "local_detect": "base64圖片資料",
  "local_jistatus": true
}
```

### POST /api/devicedata/[slug]

取得裝置最新資料

**請求內容：**

```json
{
  "dataid": 123
}
```

**回應格式：**

```json
{
  "cached": false,
  "dataid": 124,
  "cwa_temp": 25.5,
  "local_temp": 26.0,
  "local_detect": [...],
  "device_live_link": "192.168.1.100:8080"
}
```

## 管理 API

### POST /api/admin/createmachine

新增裝置

**請求內容：**

```json
{
  "machine_name": "裝置名稱",
  "machine_ip": "192.168.1.100:8080",
  "password": "存取密碼"
}
```

### POST /api/getAuthToken

取得認證令牌

**請求內容：**

```json
{
  "deviceId": "device-uuid",
  "password": "密碼"
}
```

## 圖片上傳 API

### POST /api/uploadImage

獨立圖片上傳和分析

**請求內容：**

```json
{
  "image": "base64圖片資料",
  "deviceId": "device-uuid"
}
```
