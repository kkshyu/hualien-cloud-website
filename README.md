# 花蓮雲基地 官方網站

以 **Payload CMS 3 + Next.js 15 + Postgres + MinIO** 重建的花蓮雲基地官方網站，部署在 Zeabur。

## 功能

- **最新消息**（`/news`）— 列表、單篇詳情、分頁
- **媒體庫**（`/media`）— 圖片畫廊、原圖檢視
- **動態頁面**（`/[slug]`）— 場地租用、進駐、如何前往等
- **後台**（`/admin`）— Payload Admin UI，可編輯所有內容、上傳媒體（自動同步到 MinIO）
- **雙語**（zh-TW / en）— 透過 Payload `localization`
- **草稿與發佈**、**SEO meta**、**自訂導覽選單**、**站台設定全域**

## 技術堆疊

| 層級 | 技術 |
|------|------|
| Web 框架 | Next.js 15（App Router、`output: standalone`）|
| CMS | Payload 3.84（Lexical rich text、versions、drafts、i18n）|
| 資料庫 | PostgreSQL 16（`@payloadcms/db-postgres`）|
| 物件儲存 | MinIO（透過 `@payloadcms/storage-s3`，S3 相容）|
| 樣式 | 純 CSS（`src/app/(frontend)/styles.css`）|
| 部署 | Zeabur（web + postgres + minio 三服務）|

## 目錄結構

```
src/
├── app/(frontend)/        # 前台路由：home, news, media, [slug]
├── app/(payload)/         # Payload admin 與 API
├── collections/           # Users, Media, Posts, Pages, Categories
├── globals/               # Navigation, SiteSettings
├── components/            # Header, Footer, RichText
├── lib/                   # media.ts 等共用函式
└── payload.config.ts
scripts/seed.ts            # 從 scrape/ 匯入資料
scrape/                    # 舊站爬取資料（gitignore 大檔，僅給 seed 用）
docker-compose.yml         # 本機 postgres + minio
zeabur.json                # Zeabur 一鍵部署模板
```

## 本機開發

需要 Node ≥20.9、pnpm 9、Docker。

```bash
# 1) 啟動本機 postgres + minio
docker compose up -d

# 2) 環境變數
cp .env.example .env
# 編輯 .env 把 PAYLOAD_SECRET 換成長隨機字串

# 3) 安裝依賴並啟動 dev server
pnpm install
pnpm dev
```

打開 <http://localhost:3000>（前台）或 <http://localhost:3000/admin>（後台）。
MinIO console：<http://localhost:9001>（帳密 `minioadmin / minioadmin`）。

第一次進入 admin 會引導建立管理員帳號；或先跑 seed 自動建立：

```bash
ADMIN_EMAIL=admin@hualien.cloud ADMIN_PASSWORD=your-strong-password pnpm seed
```

## 從 scrape/ 匯入資料

`scripts/seed.ts` 會：

1. 建立管理員帳號（若不存在）
2. 把 `scrape/files/**` 下的 205 個媒體檔上傳到 MinIO（透過 Payload）
3. 把 `scrape/api/pages.json` + `posts.json` 匯入為頁面與最新消息（HTML 存在 `legacyHtml` 欄位，會自動把舊 URL 改寫為新 URL）
4. 初始化導覽與站台設定

slug 對應表（在 `scripts/seed.ts` 內可調）：

| WordPress slug | 新 slug |
|---|---|
| home | home |
| cloudcoffee | cloudcoffee |
| `%e9%80%b2%e9%a7%90` | move-in |
| `%e5%a0%b4%e5%9c%b0%e7%a7%9f%e7%94%a8` | venue-rental |
| `%e5%a6%82%e4%bd%95%e5%89%8d%e5%be%80` | how-to-arrive |
| news | (跳過 — `/news` 改為動態列表) |

匯入後請進 admin 把 `legacyHtml` 內容用 Lexical 編輯器重建，再清空 `legacyHtml`。

## 部署到 Zeabur

### 自動（推薦）

1. 把這個 repo push 到 GitHub
2. 在 Zeabur 建立新專案，新增三個服務：
   - **web** — 從 GitHub 部署（Next.js 自動偵測）
   - **postgres** — 從 marketplace 加 PostgreSQL
   - **minio** — 從 marketplace 加 MinIO
3. 在 web 的 Environment Variables 設：
   - `PAYLOAD_SECRET`（長隨機字串）
   - `DATABASE_URL` = postgres 服務的 `${POSTGRES_CONNECTION_STRING}`
   - `S3_ENDPOINT` = minio 服務的內網位址
   - `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` = minio 的 root 憑證
   - `S3_BUCKET=hualien-media`
   - `S3_FORCE_PATH_STYLE=true`
   - `NEXT_PUBLIC_SITE_URL` = 對外網域
4. 在 minio console 建立 `hualien-media` bucket（或讓 seed 失敗一次後手動建立）
5. 部署完成後跑 seed：在 web 服務的 console 執行 `pnpm seed`

### Zeabur 模板（CLI）

`zeabur.json` 已經定義了完整的服務組合，可用 Zeabur CLI 一鍵部署。

## 安全注意事項

- `legacyHtml` 內容渲染前會經過 `sanitize-html`（見 `src/components/RichText.tsx`），但仍建議遷移到 Lexical 編輯器後清空 `legacyHtml`
- MinIO 的 `hualien-media` bucket 預設為 download-anonymous，如要私有化可改用 signed URL
- 預設管理員密碼必須改！seed 的 `change-me-now` 只是為了首次啟動方便

## TODO（後續可加）

- [ ] 把 legacyHtml 自動轉成 Lexical（`@payloadcms/richtext-lexical/html`）
- [ ] Tailwind CSS / shadcn 美化 UI
- [ ] 支援 webhook：發佈消息後通知 LINE / Discord
- [ ] 站台搜尋（pg_trgm 或 Meilisearch）
- [ ] 全文 RSS / Atom feed
- [ ] sitemap.xml 動態產生
