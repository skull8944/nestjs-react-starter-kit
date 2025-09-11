# NestJS React Starter Kit (Server)

一個現代化的 NestJS 後端框架，為全端應用提供堅實的基礎架構。此框架整合了 Azure AD 認證、權限控制、PostgreSQL 資料庫及 Prisma ORM，專為企業級應用開發而設計。

## 功能特色

- **Azure AD 整合**：使用 Microsoft 身份驗證和授權
- **權限管理系統**：彈性的角色和選單權限控制
- **PostgreSQL + Prisma**：強大的資料庫 ORM 工具，支援多 Schema
- **Docker 支援**：容器化部署方案
- **Swagger API 文檔**：自動生成的 API 文檔
- **配置管理**：環境變數和配置系統
- **郵件功能**：使用 Nodemailer 發送郵件
- **快取管理**：整合 Cache Manager
- **事件系統**：支援事件驅動架構
- **排程任務**：支援定時任務
- **健康檢查**：使用 Terminus 進行系統健康監測

## 技術棧

- **Node.js** (>= v22)
- **NestJS** v11
- **Prisma** v6
- **TypeScript** v5
- **PostgreSQL**
- **Jest** (單元測試)
- **Swagger** (API 文檔)
- **Azure MSAL** (Microsoft 認證)
- **Docker** (容器化)

## 系統要求

- Node.js >= 22
- PostgreSQL 資料庫
- Azure AD 租戶 (用於身份驗證)

## 快速開始

### 安裝相依套件

```bash
npm install
```

### 環境設定

創建 `.env` 文件並配置以下環境變數：

```env
# 應用程式設定
NODE_ENV=dev
APP_PORT=8080

# 資料庫連線字串
dbConnectionString=postgresql://username:password@localhost:5432/database?schema=public

# Azure AD 設定
AAD_CLIENT_ID=your-client-id
AAD_TENANT_ID=your-tenant-id
AAD_CLIENT_SECRET=your-client-secret
```

### 資料庫遷移

```bash
# 產生 Prisma 客戶端
npm run prisma:generate

# 創建遷移
npm run prisma:migrate

# 應用遷移
npm run prisma:deploy

# 初始化權限資料
npm run seed
```

### 運行應用程式

```bash
# 開發模式
npm run start:dev

# 除錯模式
npm run start:debug

# 生產模式
npm run build
npm run start:prod
```

## 專案結構

```text
server/
├── prisma/                 # Prisma 配置和遷移文件
│   ├── schema/             # 資料庫 Schema 定義
│   │   ├── permission/     # 權限相關模型
│   │   └── public/         # 公共模型
│   └── seed/               # 資料庫種子數據
├── src/
│   ├── constants/          # 常數定義
│   ├── core/               # 核心模組
│   │   ├── azure/          # Azure 服務整合
│   │   ├── config/         # 應用配置
│   │   ├── database/       # 資料庫模組
│   │   └── mail/           # 郵件模組
│   ├── middleware/         # 中間件
│   ├── modules/            # 功能模組
│   │   ├── account/        # 帳號管理
│   │   ├── auth/           # 身份驗證
│   │   ├── job/            # 排程系統
│   │   ├── permission/     # 權限管理
│   │   └── setting/        # 系統設定
│   ├── types/              # TypeScript 類型定義
│   └── utils/              # 工具函數
```

## API 文檔

應用運行後，可以通過以下 URL 訪問 Swagger API 文檔：

```bash
http://localhost:8080/api-docs
```

## 測試

```bash
# 單元測試
npm run test

# 測試覆蓋率
npm run test:cov

# 監視模式
npm run test:watch
```

## Docker 部署

專案包含 Dockerfile 和 docker-compose 配置，方便容器化部署：

```bash
# 構建 Docker 映像
docker build -t nestjs-starter .

# 運行容器
docker run -p 8080:8080 nestjs-starter
```

## 功能模組說明

### 認證模組 (Auth)

- Azure AD 身份驗證整合
- JWT 令牌管理
- 基於角色的訪問控制

### 帳號模組 (Account)

- 使用者管理
- 個人資料處理

### 權限模組 (Permission)

- 角色定義與管理
- 選單權限控制
- 使用者-角色關聯
- 詳細說明請參閱 [權限模組文檔](/server/src/modules/permission/README.md)

### 設定模組 (Setting)

- 系統設定管理
- 全域參數配置

### 排程系統 (Job)

- 基於 BullMQ 的任務佇列管理
- Cron 表達式排程任務
- 任務優先級和超時控制
- 失敗重試機制
- 執行歷史追蹤
- 詳細說明請參閱 [排程系統文檔](/server/src/modules/job/README.md)

## 貢獻指南

1. Fork 本專案
2. 創建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 創建 Pull Request

## 授權

此專案根據 [MIT 授權](LICENSE) 進行授權。
