# 資料庫架構

## 資料表結構

### logger

主要感測器資料記錄表

```sql
CREATE TABLE logger (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cwa_type TEXT,
    cwa_location TEXT,
    cwa_temp NUMERIC,
    cwa_hum NUMERIC,
    cwa_daily_high NUMERIC,
    cwa_daily_low NUMERIC,
    local_temp NUMERIC,
    local_hum NUMERIC,
    local_gps_lat NUMERIC,
    local_gps_long NUMERIC,
    local_time TEXT,
    local_jistatus BOOLEAN,
    local_light BOOLEAN,
    local_detect JSONB,
    device_uuid TEXT
);
```

### machines

裝置註冊表

```sql
CREATE TABLE machines (
    uuid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip TEXT NOT NULL,
    token TEXT NOT NULL
);
```

### detect

動物偵測記錄表

```sql
CREATE TABLE detect (
    id SERIAL PRIMARY KEY,
    device_id TEXT,
    item TEXT,
    imageurl TEXT,
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### device_status

裝置狀態控制表

```sql
CREATE TABLE device_status (
    device_uuid TEXT PRIMARY KEY,
    jistatus BOOLEAN NOT NULL,
    lightstatus INTEGER NOT NULL
);
```

## 資料關聯

- `logger.device_uuid` → `machines.uuid`
- `detect.device_id` → `machines.uuid`
- `device_status.device_uuid` → `machines.uuid`

## 資料庫初始化

訪問 `/createDatabase` 端點自動建立所有必要的資料表。
