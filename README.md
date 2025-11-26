# Config CRUD API

這是一個用於管理 `config.json` 的 CRUD API 系統，包含完整的後端 API 和管理介面。

## 功能特色

- ✅ **完整 CRUD 操作**：讀取、更新整個配置或特定區塊
- 📦 **備份管理**：建立和還原配置備份
- 🎨 **視覺化管理介面**：使用網站主題色彩的現代化管理面板
- 🔒 **JSON 驗證**：自動驗證配置格式
- 🚀 **即時預覽**：編輯時即時查看配置

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動伺服器

```bash
npm start
```

伺服器將在 `http://localhost:3000` 啟動

### 3. 訪問管理介面

打開瀏覽器訪問：
- **管理面板**：http://localhost:3000/swag-admin-domain-asap.html
- **主網站**：http://localhost:3000/index.html

## API 端點

### 讀取配置

#### 獲取完整配置
```bash
GET /api/config
```

**回應範例：**
```json
{
  "success": true,
  "data": { /* 完整配置 */ }
}
```

#### 獲取特定區塊
```bash
GET /api/config/:section
```

**範例：**
```bash
GET /api/config/lines
GET /api/config/fixed_links
```

### 更新配置

#### 更新完整配置
```bash
PUT /api/config
Content-Type: application/json

{
  "site_title": "SWAG.LIVE",
  "theme_color": "#00d2be",
  ...
}
```

#### 更新特定區塊
```bash
PATCH /api/config/:section
Content-Type: application/json

[
  {
    "name": "線路一",
    "url": "https://example.com"
  }
]
```

**範例：**
```bash
# 更新線路列表
PATCH /api/config/lines

# 更新固定連結
PATCH /api/config/fixed_links

# 更新公告
PATCH /api/config/announcement
```

### 備份管理

#### 建立備份
```bash
POST /api/config/backup
```

**回應範例：**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "filename": "config-backup-2025-11-27T00-15-30-123Z.json"
}
```

#### 列出所有備份
```bash
GET /api/backups
```

**回應範例：**
```json
{
  "success": true,
  "data": [
    {
      "filename": "config-backup-2025-11-27T00-15-30-123Z.json",
      "created": "2025-11-27T00:15:30.123Z"
    }
  ]
}
```

#### 還原備份
```bash
POST /api/config/restore/:filename
```

**範例：**
```bash
POST /api/config/restore/config-backup-2025-11-27T00-15-30-123Z.json
```

## 管理介面使用說明

### 配置編輯器

1. **選擇編輯模式**：
   - 完整配置：編輯整個 config.json
   - 特定區塊：只編輯某個區塊（如線路列表、固定連結等）

2. **編輯 JSON**：
   - 直接在文字區域編輯 JSON
   - 使用「格式化」按鈕美化 JSON 格式

3. **儲存變更**：
   - 點擊「儲存配置」按鈕
   - 系統會自動驗證 JSON 格式

### 備份管理

1. **建立備份**：
   - 點擊「建立備份」按鈕
   - 系統會自動建立帶時間戳的備份檔案

2. **還原備份**：
   - 在備份列表中找到要還原的備份
   - 點擊「還原」按鈕
   - 確認後即可還原配置

## 配置結構

```json
{
  "site_title": "網站標題",
  "theme_color": "主題顏色 (HEX)",
  "logo_url": "Logo URL",
  "announcement": "公告文字",
  "fixed_links": [
    {
      "name": "連結名稱",
      "url": "連結 URL",
      "highlight": true/false
    }
  ],
  "lines": [
    {
      "name": "線路名稱",
      "url": "線路 URL"
    }
  ],
  "contact_info": [
    {
      "label": "聯絡方式標籤",
      "url": "聯絡 URL",
      "icon": "圖示名稱"
    }
  ],
  "app_download": {
    "title": "下載標題",
    "description": "下載描述",
    "url": "下載 URL",
    "icon": "圖示名稱"
  },
  "bottom_promo": {
    "image": "廣告圖片 URL",
    "url": "廣告連結 URL"
  }
}
```

## 安全性建議

> [!WARNING]
> 此 API 目前**沒有身份驗證機制**，僅適用於本地開發或內部網路環境。

如需在生產環境使用，建議：

1. **添加身份驗證**：
   - 使用 JWT 或 session-based 認證
   - 添加 API key 驗證

2. **限制訪問**：
   - 使用防火牆限制訪問 IP
   - 設置 CORS 白名單

3. **HTTPS**：
   - 在生產環境使用 HTTPS
   - 使用反向代理（如 Nginx）

## 故障排除

### 端口已被佔用

如果 3000 端口已被使用，可以設置環境變數：

```bash
PORT=8080 npm start
```

### 無法連接 API

確認：
1. 伺服器是否正在運行
2. 防火牆是否允許連接
3. API URL 是否正確（檢查 admin.html 中的 `API_BASE`）

### JSON 格式錯誤

使用管理介面的「格式化」功能，或使用線上 JSON 驗證工具檢查格式。

## 技術棧

- **後端**：Node.js + Express
- **前端**：原生 HTML/CSS/JavaScript
- **儲存**：檔案系統（JSON）

## 授權

MIT License
