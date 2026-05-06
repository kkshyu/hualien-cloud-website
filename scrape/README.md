# 花蓮雲基地（hualien.cloud）站點抓取結果

抓取時間：2026-05-01
來源網站：https://www.hualien.cloud
目的：完整封存可公開瀏覽內容（含 WP 後台可匯出資料），供後續重構使用。

## 站點概覽

| 項目 | 值 |
|------|----|
| 站名 | 花蓮雲基地 |
| 平台 | WordPress（block editor + classic theme） |
| 主題 | Blocksy（active） |
| 主要外掛 | Spectra (UAG)、TranslatePress、Starter Templates、Chaty、Limit Login Attempts、WPvivid Backup |
| 多語 | zh-TW（預設）、en（TranslatePress） |
| 首頁 | 靜態頁面 page id=24（slug `home`） |
| 文章 | 1 篇（id=812 「花蓮三三小聚 【三月】」） |
| 頁面 | 6 個 |
| 媒體 | 205 個檔案（179 jpg、43 png、4 mp4、4 heic、3 pdf、3 svg、1 avif、1 webp） |
| 使用者 | 5 位（admin、duncan、kk、liann、jimmy30628），公開可見 3 位 |

## 目錄結構

```
scrape/
├── README.md               ← 本文件
├── manifest.json           ← 完整資料清單（含 sha256、檔案大小）
│
├── raw/                    ← 站點探索原始資料
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── wp-sitemap-posts-page-1.xml      ← 6 個頁面 URL
│   ├── wp-sitemap-posts-post-1.xml      ← 1 篇文章 URL
│   ├── wp-sitemap-taxonomies-category-1.xml
│   ├── wp-sitemap-users-1.xml
│   └── all_urls.txt        ← 9 個公開 URL（去重）
│
├── api/                    ← WP REST API + 後台資料
│   ├── wxr-export-all.xml  ★ WordPress eXtended RSS（標準匯入檔，2.4 MB）
│   ├── pages.json          6 頁面（含 _embed）
│   ├── posts.json          1 文章
│   ├── media-all.json      205 媒體（合併 3 頁 pagination）
│   ├── media-p[1-3].json   原始分頁媒體 JSON
│   ├── categories.json
│   ├── tags.json
│   ├── users.json          公開可見 3 位
│   ├── comments.json       0
│   ├── admin-data.json     ★ 後台專屬：menu/menu-items/templates/themes/plugins/settings/users-edit
│   ├── widgets-sidebars.json
│   ├── customize.html      WP Customizer 完整 HTML（4.4 MB）
│   ├── customizer-settings.json ★ 720 個 Customizer 設定值（Blocksy 主題、Widgets、Nav menus）
│   ├── customize-extracted.json  Customizer 衍生資料
│   ├── navigation.json     blocksy 區塊式導覽（block-based）
│   ├── menu-items.json
│   ├── menus.json
│   ├── templates.json      （0，classic theme 無 FSE templates）
│   ├── template-parts.json （0）
│   ├── spectra-popup.json  （0）
│   ├── blocks.json         （0）
│   ├── wp-json-root.json   /wp-json 根節點
│   ├── wp-types.json       自訂內容類型清單
│   ├── originals.txt       205 個原始檔 URL（已下載到 files/）
│   ├── asset_urls.txt      141 個頁面引用資源 URL
│   ├── external_links.txt  80 個外部/頁面連結
│   ├── page_urls.txt       7 個頁面/文章對外連結
│   ├── media-urls.txt      1126 個 URL（含所有 thumbnail 尺寸）
│   └── cookies.txt         登入 cookie（含 wordpress_sec_*）— 不要提交至 git
│
├── pages/                  ★ 9 個 zh-TW 公開 HTML（直接 curl 抓取）
│   ├── home.html
│   ├── news.html
│   ├── how-to-arrive.html        （如何前往）
│   ├── venue-rental.html         （場地租用）
│   ├── move-in.html              （進駐）
│   ├── cloudcoffee.html          （活動）
│   ├── post-812.html             （花蓮三三小聚 【三月】）
│   ├── category-uncategorized.html
│   └── author-liann.html
│
├── pages_en/               ★ 9 個英文 HTML（TranslatePress /en/ 路徑）
│   └── （結構與 pages/ 相同）
│
├── files/                  ★ 媒體庫原始檔（依 WP /wp-content/uploads/YYYY/MM/）
│   ├── 2024/...
│   ├── 2025/...
│   └── 2026/...            （205 個檔，647 MB）
│
├── assets/                 ← 從 HTML 解析出的靜態資源（CSS/JS/字型/圖示）
│   └── wp-content/
│       ├── plugins/        外掛公用 JS/CSS
│       ├── themes/blocksy/ 主題前端 CSS/JS
│       └── uploads/        ⚠ 與 files/ 重複（HTML 引用副本，可手動移除）
│
├── screenshots/            ← Playwright 視覺擷取
│   └── homepage.png        全頁 zh-TW 首頁
│
└── *.sh / *.py             抓取與處理腳本（可重新執行）
```

## 重構建議

1. **最佳重新建站方法**：直接於新 WordPress 安裝匯入 `api/wxr-export-all.xml`（工具 → 匯入 → WordPress）。
   - 同時安裝相同 plugins（Blocksy 主題、Spectra、TranslatePress 等）。
   - 套用 `api/customizer-settings.json` 的 720 項設定（手動或寫腳本還原 `theme_mods_blocksy`）。
   - 匯入 `files/` 目錄至 `wp-content/uploads/`。

2. **改用其他平台**（Astro / Next.js / Hugo 等）：
   - 來源資料：`api/pages.json`、`api/posts.json`、`api/media-all.json`、`api/admin-data.json`（含 menu-items 樹）。
   - 內容主體：每個 page/post 的 `content.rendered` 為 Gutenberg 區塊渲染後的 HTML，可直接搬移；`content.raw` 為 `<!-- wp:* -->` 區塊原始碼，可解析重組。
   - 多語：以 `pages_en/*.html` 提取對應翻譯字串（TranslatePress 將翻譯內聯於 HTML）。
   - 媒體：`files/` 直接挪用，依 `media-all.json` 的 `id → source_url` 對照表重新映射。

3. **選單結構**（`api/admin-data.json` `menu-items`）：
   ```
   活動 Events            → /cloudcoffee/
   場地 Venue (#)
     ├ 進駐空間 Studios    → /進駐/
     └ 共創空間 Coworking → /場地租用/
   語言 (#)
     ├ 繁體中文            → /language_switcher/chinese/
     └ English             → /language_switcher/english/
   ```

## 抓取狀態速查

| 任務 | 結果 |
|------|------|
| Sitemap 探索 | 9 URL ✓ |
| WP REST API 公開端點 | posts/pages/media/categories/users/tags/comments ✓ |
| WP REST API 後台端點（cookie 授權） | menu-items/menus/templates/navigation/settings/themes/plugins/widgets/sidebars ✓ |
| WordPress WXR XML | 2.4 MB（包含所有 posts/pages/attachments metadata） ✓ |
| HTML 全頁鏡像 | 9 zh-TW + 9 en ✓ |
| 媒體原始檔下載 | 205/205 ✓ |
| CSS/JS/字型靜態資源 | 140 個檔 ✓ |
| Customizer 設定值 | 720 項 ✓ |
| 視覺截圖 | 1 張首頁全頁 ✓ |

## 安全提醒

- `api/cookies.txt` 含登入 session（WordPress `wordpress_sec_*` HttpOnly cookie），請於重構前刪除或加入 `.gitignore`。
- 後台仍開放 `wp-login.php`，建議重構後啟用 2FA / IP 白名單。
- 多位管理員帳號採弱密碼（admin/00000000），重構後應強制重設。
