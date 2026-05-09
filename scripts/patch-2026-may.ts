/**
 * Apply the May 2026 content patch (slides 9 / 10 / 11 / 12 of the
 * 0508 修正簡報):
 *
 *   - move-in (Nomad Hualien)：申請須知改為精簡 6 / 7 + 主辦解釋權；申請方式改為郵件投遞流程
 *   - venue-rental (場地租用)：空間簡介加入照片區塊（兩張）
 *   - friendly-shops (友善店家／遊程體驗)：建立新頁面
 *
 * Run:  pnpm tsx scripts/patch-2026-may.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

// ---------- Move-in (Nomad Hualien) ----------
const MOVE_IN_PATCH_ZH = `
<h2>關於 Nomad Hualien</h2>
<p><strong>Nomad Hualien · 花蓮雲基地數位遊牧者進駐計劃</strong>邀請來自全球的數位遊牧者把花蓮當作下一個工作據點。從台灣東海岸出發，提供工作空間與社群交流平台，推動<strong>國際與在地連結</strong>。</p>
<p>主辦：花蓮縣政府　|　執行：遊遊股份有限公司　|　115 年度（2026）</p>

<h3>📑 招募簡章下載</h3>
<ul>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-zh.pdf?prefix=media" target="_blank" rel="noopener">下載中文版簡章（PDF · 8 頁）</a></li>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-en.pdf?prefix=media" target="_blank" rel="noopener">Download English brochure (PDF · 8 pages)</a></li>
</ul>

<h2>名額與期程</h2>
<ul>
  <li><strong>名額：</strong>5 名／每期（滾動調整）</li>
  <li><strong>進駐期間：</strong>即日起至 2026 / 09 / 30</li>
  <li><strong>單次期程：</strong>最短 1 個月、最長 3 個月</li>
  <li><strong>費用：</strong>全程免費，無需負擔進駐費用</li>
  <li><strong>續駐：</strong>需重新申請並經核准，至多延長一次</li>
</ul>

<h2>招募對象與申請資格</h2>
<p>本計畫以<strong>國際數位遊牧者</strong>為主要招募對象，即具備遠距工作能力、得以在不同地點執行工作的國際專業人士。</p>
<ul>
  <li>從事數位相關工作（軟體開發、設計、數位行銷、內容創作、線上教學、自由接案等），可透過網路進行遠端工作。</li>
  <li>持有有效護照及合法在臺簽證，或持有其他國家的數位遊牧簽證。</li>
  <li>有意在花蓮進行 1 至 3 個月的短期數位工作與生活體驗。</li>
  <li>願意參與雲基地舉辦之社群小聚、分享活動與國際交流活動。</li>
</ul>

<h2>申請應備文件</h2>
<ol>
  <li>進駐申請表 1 份</li>
  <li>個人簡介及數位工作計畫書 1 份</li>
  <li>護照影本</li>
  <li>數位工作成果作品集或相關證明文件</li>
</ol>
<p>完整表單與聲明文件請參考上方下載的簡章。</p>

<h2>審查與評選機制</h2>
<p>由工作小組進行書面審查，未滿 60 分者不予進駐；通過後將公告於本網站並以 Email 通知。</p>
<table>
  <thead>
    <tr><th>審查項目</th><th>內容</th><th>比重</th></tr>
  </thead>
  <tbody>
    <tr><td>數位工作計畫</td><td>計畫完整性、工作項目與遠端可行性、在花蓮期間的時間規劃</td><td>30%</td></tr>
    <tr><td>專業能力與經歷</td><td>數位專業技能、過往作品或專案經驗、遠端工作經驗</td><td>25%</td></tr>
    <tr><td>社群貢獻潛力</td><td>願意分享專業知能、與在地產業互動意願、跨文化交流能力</td><td>25%</td></tr>
    <tr><td>花蓮在地連結性</td><td>對花蓮產業或文化的興趣與了解、符合數位遊牧發展理念</td><td>20%</td></tr>
  </tbody>
</table>
<p>通過後須於 10 天內至花蓮雲基地辦理簽約，逾期視同放棄並由備取遞補。</p>

<h2>進駐空間與設備</h2>
<ul>
  <li>2 樓個人獨立進駐空間，提供書桌、椅子、置物櫃等家具設備。</li>
  <li>1 樓共創空間：共用辦公桌、會議區、可預約之私人會議室。</li>
  <li>高速網路、列印與週邊設備。</li>
  <li>每月固定遊牧者交流聚會（三三小聚）。</li>
  <li>步行可達在地便利設施（縣府、夜市、車站）。</li>
  <li>駐點人員平日現場協助。</li>
</ul>

<h2>申請須知</h2>
<table>
  <thead>
    <tr><th>項目</th><th>內容</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>權利</strong></td>
      <td>於核准期間內使用場地設施及現場支援服務。</td>
    </tr>
    <tr>
      <td><strong>義務</strong></td>
      <td>遵守場館所有規章制度，負責且正當地使用設備，嚴禁擅自變更；配合管理團隊管理，若有重大變更須立即通報。</td>
    </tr>
    <tr>
      <td><strong>強制執行</strong></td>
      <td>若違反規範經勸告後未改善，管理方得終止其進駐資格。</td>
    </tr>
    <tr>
      <td><strong>退駐</strong></td>
      <td>進駐期滿或提前退駐時，進駐者須將空間恢復原狀，並完成退駐程序。</td>
    </tr>
  </tbody>
</table>
<ul>
  <li>本須知如有未盡事宜，<strong>主辦單位保有解釋與修改之權利</strong>。</li>
  <li>申請資料不齊全或不實者，<strong>視同放棄</strong>，並由備取遞補。</li>
</ul>

<h2>申請方式</h2>
<ol>
  <li>請將申請應備文件及報名表郵寄至 <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>。</li>
  <li>來信郵件標題請註明：<strong>「115 Hualien Hub Studio Residency Application Form - 姓名」</strong>。</li>
  <li>駐點人員將於 3 個工作日內回覆審查結果與後續流程。</li>
</ol>
`.trim()

const MOVE_IN_PATCH_EN = `
<h2>About Nomad Hualien</h2>
<p><strong>Nomad Hualien — the Hualien Cloud Hub International Digital Nomad Residency Programme</strong> invites digital nomads from around the world to base their next chapter in Hualien. From Taiwan&rsquo;s east coast, the programme provides workspace and a community platform that connects <strong>international and local</strong>.</p>
<p>Hosted by Hualien County Government　|　Operated by Yo-Yo Co., Ltd.　|　FY 2026 (民國 115 年度)</p>

<h3>📑 Recruitment Brochures</h3>
<ul>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-en.pdf?prefix=media" target="_blank" rel="noopener">Download English brochure (PDF · 8 pages)</a></li>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-zh.pdf?prefix=media" target="_blank" rel="noopener">下載中文版簡章 (PDF · 8 頁)</a></li>
</ul>

<h2>Slots &amp; Schedule</h2>
<ul>
  <li><strong>Slots:</strong> 5 residents per cohort (rolling adjustment)</li>
  <li><strong>Window:</strong> open through 30 September 2026</li>
  <li><strong>Stay length:</strong> 1 to 3 months per residency</li>
  <li><strong>Cost:</strong> free of charge for the entire stay</li>
  <li><strong>Extension:</strong> requires a fresh application; up to one extension per resident</li>
</ul>

<h2>Who can apply</h2>
<p>The programme is for <strong>international digital nomads</strong> — professionals who can work remotely from any location.</p>
<ul>
  <li>You work in a digital field (software, design, digital marketing, content creation, online teaching, freelance, etc.) and can do your job over the internet.</li>
  <li>You hold a valid passport and a legal Taiwan visa, or a digital-nomad visa from another country.</li>
  <li>You want to spend 1 – 3 months living and working in Hualien.</li>
  <li>You&rsquo;re happy to take part in the Hub&rsquo;s community meet-ups, talks and international exchange events.</li>
</ul>

<h2>Required documents</h2>
<ol>
  <li>Application form (1 copy)</li>
  <li>Bio &amp; digital work plan (1 copy)</li>
  <li>Copy of your passport</li>
  <li>Portfolio or supporting materials</li>
</ol>
<p>The full application packet and declaration forms are inside the brochure linked above.</p>

<h2>Review &amp; selection</h2>
<p>A working group performs a written review. Applications below 60 points are not admitted. Successful applicants are announced on this site and notified by email.</p>
<table>
  <thead>
    <tr><th>Criterion</th><th>What we look at</th><th>Weight</th></tr>
  </thead>
  <tbody>
    <tr><td>Digital work plan</td><td>plan completeness, what you do remotely &amp; its feasibility, your time plan in Hualien</td><td>30%</td></tr>
    <tr><td>Skills &amp; track record</td><td>digital-domain skills, past work, remote-work experience</td><td>25%</td></tr>
    <tr><td>Community contribution</td><td>willingness to share, interest in working with locals, cross-cultural ability</td><td>25%</td></tr>
    <tr><td>Local connection</td><td>understanding of and interest in Hualien&rsquo;s industry / culture, fit with the digital-nomad vision</td><td>20%</td></tr>
  </tbody>
</table>
<p>Selected applicants must complete the residency agreement at the Hub within 10 days; otherwise the slot passes to the wait-list.</p>

<h2>Studio &amp; facilities</h2>
<ul>
  <li>Private studio on the 2nd floor with desk, chair and locker.</li>
  <li>Ground-floor coworking: shared desks, meeting area, bookable private meeting rooms.</li>
  <li>High-speed internet, printing and basic peripherals.</li>
  <li>Monthly community meet-up (Hualien 33).</li>
  <li>Local amenities — county hall, night market, train station — within walking distance.</li>
  <li>On-site staff support during weekdays.</li>
</ul>

<h2>Terms &amp; Conditions</h2>
<table>
  <thead>
    <tr><th>Item</th><th>Detail</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Rights</strong></td>
      <td>Use of facilities and on-site support during the approved residency period.</td>
    </tr>
    <tr>
      <td><strong>Obligations</strong></td>
      <td>Comply with all venue rules; use equipment responsibly with no unauthorized changes; cooperate with management and report major changes promptly.</td>
    </tr>
    <tr>
      <td><strong>Enforcement</strong></td>
      <td>Management may terminate the residency if violations continue after a warning.</td>
    </tr>
    <tr>
      <td><strong>Move-out</strong></td>
      <td>Upon expiration or early exit, residents must restore the space and complete move-out procedures.</td>
    </tr>
  </tbody>
</table>
<ul>
  <li>The host <strong>reserves the right to interpret and amend</strong> these terms at any time.</li>
  <li>Applications with missing or inaccurate documents are <strong>deemed withdrawn</strong> and may be replaced from the wait-list.</li>
</ul>

<h2>How to Apply</h2>
<ol>
  <li>Mail the application form and required documents to <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>.</li>
  <li>Use the email subject line: <strong>&ldquo;115 Hualien Hub Studio Residency Application Form - YOUR NAME&rdquo;</strong>.</li>
  <li>Our staff will reply within 3 working days with the review outcome and next steps.</li>
</ol>
`.trim()

// ---------- Venue rental ----------
const VENUE_PATCH_ZH = `
<h2>空間簡介</h2>

<figure>
  <img src="/api/media/file/cowork-space-scaled-e1774513567779.jpg?prefix=media" alt="共創空間實景" />
  <figcaption>共創空間 Coworking Space</figcaption>
</figure>

<h3>共創空間 Coworking Space</h3>
<ul>
  <li>容納人數：20 ～ 25 人</li>
  <li>面積：約 15 坪（約 50 平方公尺）</li>
  <li>含投影、桌椅、無線網路</li>
  <li>適合工作坊、講座、小型發表</li>
</ul>

<figure>
  <img src="/api/media/file/IMG_2373.jpg?prefix=media" alt="戶外空間實景" />
  <figcaption>戶外空間 Outdoor Plaza</figcaption>
</figure>

<h3>戶外空間 Outdoor Plaza</h3>
<ul>
  <li>容納人數：上限 80 人</li>
  <li>適合市集、影展、開放式活動</li>
</ul>

<h2>申請須知 — 花蓮雲基地管理規則</h2>
<p>租借前請詳閱以下規則。</p>

<h3>一、適用範圍</h3>
<p>租借本基地會議室（以下簡稱本會議室）場地者，請詳閱管理規則，即代表願意遵守相關規定。</p>

<h3>二、管理單位</h3>
<p>會議室由花蓮雲基地（以下簡稱本基地）所管理。</p>

<h3>三、進出本基地規定</h3>
<ul>
  <li>禁止攜帶違禁品、易燃物、易爆物等危險物品及寵物進入本基地。</li>
  <li>請自行保管攜入之物品，本基地恕不負責任何保管或賠償責任。</li>
</ul>

<h3>四、會議室場地租用規定</h3>
<ol>
  <li>如需在會議室及特定區域牆面張貼海報或文宣，請向本基地洽詢；本基地將提供適當位置。嚴禁在未告知駐點人員之下，自行於建物表面進行任何黏、貼、釘、掛等行為，若因此造成建物毀損，租借單位應負責恢復原狀或照價賠償。</li>
  <li>活動音量不得妨礙其他場地進行，違規不聽勸阻時本基地有權立即中止活動。</li>
  <li>所有佈置應限於租用範圍及本基地指定區域內，不得隨意放置或妨礙其他使用人權利。</li>
  <li>本基地內嚴禁使用特效（爆竹、爆點、碎彩紙、金粉、噴膠、煙霧、煙火、明火等）。租借單位擅自使用應負清潔責任，如造成意外，並負一切賠償責任。</li>
  <li>使用場地應於核准時段內準時結束；如須延長使用時間，須經本基地同意。</li>
  <li>本基地全面禁菸；若主辦單位人員或與會人員違規受罰，所有罰鍰概由租借單位負責。</li>
  <li>租借單位及其承包或施工廠商應視需要投保相關保險，任何施工或活動進行中造成之財物損失與人員傷亡，或不當影響其他單位活動，概由租借單位負責賠償。</li>
  <li>嚴禁以產地標示不實、不實廣告、仿冒商標或侵犯他人專利之產品於本基地發表或展示；嚴禁未經著作權利人同意或授權之重製、公開演出、公開播送、公開上映或公開傳輸行為。</li>
  <li>嚴禁擅自搬離會議室內活動傢俱及設備，唯經本基地同意者不在此限；違規須自行承擔一切賠償與法律責任。</li>
  <li>本規則如有未盡事宜，本基地保有隨時修改之權利。</li>
  <li>本規則自 114 年 6 月 13 日起實施。</li>
</ol>

<h2>申請</h2>
<p>📄 <a href="/api/media/file/%E9%9B%B2%E5%9F%BA%E5%9C%B0%E7%A9%BA%E9%96%93%E7%A7%9F%E5%80%9F%E5%96%AE_1140613.docx.pdf?prefix=media" target="_blank" rel="noopener">下載「雲基地空間租借申請表」（PDF）</a></p>
<p>請填寫申請表單後郵寄至 <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>，將由專人聯繫後續相關事宜。</p>
`.trim()

const VENUE_PATCH_EN = `
<h2>The Spaces</h2>

<figure>
  <img src="/api/media/file/cowork-space-scaled-e1774513567779.jpg?prefix=media" alt="Coworking space" />
  <figcaption>Coworking Space</figcaption>
</figure>

<h3>Coworking Space</h3>
<ul>
  <li>Capacity: 20 to 25 people</li>
  <li>Area: about 50 sqm (~15 ping)</li>
  <li>Projector, tables and chairs, Wi-Fi included</li>
  <li>Good fit for workshops, talks, small launches</li>
</ul>

<figure>
  <img src="/api/media/file/IMG_2373.jpg?prefix=media" alt="Outdoor plaza" />
  <figcaption>Outdoor Plaza</figcaption>
</figure>

<h3>Outdoor Plaza</h3>
<ul>
  <li>Capacity: up to 80 people</li>
  <li>Good fit for markets, screenings, open-air events</li>
</ul>

<h2>House Rules — Hualien Cloud Hub</h2>
<p>Please read the rules below before booking.</p>

<h3>1. Scope</h3>
<p>Renting the Cloud Hub meeting space implies acceptance of these rules.</p>

<h3>2. Management</h3>
<p>The venue is managed by Hualien Cloud Hub.</p>

<h3>3. Entry &amp; Exit</h3>
<ul>
  <li>No prohibited items, flammables, explosives or pets are allowed on premises.</li>
  <li>Personal belongings are the responsibility of the renter; the venue is not liable for storage or damages.</li>
</ul>

<h3>4. Booking Rules</h3>
<ol>
  <li>Posters or signage on walls require prior approval; the venue will assign permitted spots. Sticking, taping, nailing or hanging items without notice is prohibited; any damage must be restored or compensated.</li>
  <li>Event volume must not interfere with other spaces; the venue may stop an event if rules are repeatedly violated.</li>
  <li>All set-up must remain within the rented area and venue-designated zones, without obstructing other users.</li>
  <li>Special effects (firecrackers, confetti, gold powder, spray glue, smoke, fireworks, open flame) are strictly prohibited. Renters bear cleaning and full liability for any incident.</li>
  <li>Use the space within the approved hours; extensions require prior approval.</li>
  <li>The venue is smoke-free; any fines incurred by the organizer or attendees are paid by the renter.</li>
  <li>Renters and their contractors must carry appropriate insurance. The renter bears full liability for any property loss, injuries or disruption to other tenants caused by the event.</li>
  <li>The venue strictly prohibits exhibiting goods with false origin labels, deceptive advertising, counterfeit trademarks or patent-infringing items, and any unauthorized reproduction, public performance, broadcast, screening or transmission of copyrighted works.</li>
  <li>Do not move venue furniture or equipment without consent; violators bear all liabilities.</li>
  <li>The venue reserves the right to amend these rules at any time.</li>
  <li>These rules take effect from 13 June 2025 (民國 114 年 6 月 13 日).</li>
</ol>

<h2>Apply</h2>
<p>📄 <a href="/api/media/file/%E9%9B%B2%E5%9F%BA%E5%9C%B0%E7%A9%BA%E9%96%93%E7%A7%9F%E5%80%9F%E5%96%AE_1140613.docx.pdf?prefix=media" target="_blank" rel="noopener">Download the venue rental application form (PDF)</a></p>
<p>Fill in the form and email it to <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>; a coordinator will follow up.</p>
`.trim()

// ---------- Friendly shops / Local experiences ----------
// Source: 1150407 雙語化店家加入數位游牧名單 (22 partners across 4 categories)
const FRIENDLY_ZH = `
<h2>關於數位游牧友善店家</h2>
<p>22 間花蓮在地夥伴掛上「數位游牧友善店家」標章，從原民風味料理、賞鯨遊程到溫泉旅宿，把工作之外的日子接起來。把工作放下、走出基地，會發現花蓮原來這麼大。</p>

<h2>遊程體驗 Tour Experiences</h2>
<ul>
  <li><strong>多羅滿海上娛樂</strong> — <a href="tel:+88638333821">(+886) 3-833-3821</a></li>
  <li><strong>高山森林基地</strong> — <a href="tel:+886933991926">(+886) 933-991-926</a></li>
  <li><strong>易踏趣</strong> — <a href="tel:+886978583656">(+886) 978-583-656</a></li>
  <li><strong>Bian Jiao 邊邊角角</strong> — <a href="tel:+886938798400">(+886) 938-798-400</a></li>
  <li><strong>吉籟獵人學校</strong> — <a href="tel:+886925758258">(+886) 925-758-258</a></li>
  <li><strong>禾亮家香草 Pura Vida Herbs</strong> — <a href="tel:+886975377615">(+886) 975-377-615</a></li>
  <li><strong>後山金工房</strong> — <a href="tel:+886980436674">(+886) 980-436-674</a></li>
  <li><strong>東岸國際旅行社</strong> — <a href="tel:+886922264795">(+886) 922-264-795</a></li>
</ul>

<h2>餐飲業者 Restaurants &amp; Cafés</h2>
<ul>
  <li><strong>達基力部落屋</strong> — <a href="tel:+886970323871">(+886) 970-323-871</a></li>
  <li><strong>芳草古樹風味館</strong> — <a href="tel:+886910265272">(+886) 910-265-272</a></li>
  <li><strong>九日良田工作坊</strong> — <a href="tel:+886977051477">(+886) 977-051-477</a></li>
  <li><strong>林氏海產</strong> — <a href="tel:+886905815891">(+886) 905-815-891</a></li>
  <li><strong>豆奏會</strong> — <a href="tel:+886920923327">(+886) 920-923-327</a></li>
  <li><strong>林記魚丸</strong> — <a href="tel:+886975977806">(+886) 975-977-806</a></li>
  <li><strong>艾斯可菲小館</strong> — <a href="tel:+886955567736">(+886) 955-567-736</a></li>
  <li><strong>加家食堂</strong> — <a href="tel:+886915185066">(+886) 915-185-066</a></li>
  <li><strong>七星潭慕名私房料理</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
  <li><strong>以映慕名</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
  <li><strong>法礫原民料理</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
</ul>

<h2>伴手禮 Souvenirs</h2>
<ul>
  <li><strong>清風茶行</strong> — <a href="tel:+886980192849">(+886) 980-192-849</a></li>
  <li><strong>洄遊吧食魚體驗館</strong> — <a href="tel:+886968779878">(+886) 968-779-878</a></li>
</ul>

<h2>旅宿業 Lodging</h2>
<ul>
  <li><strong>虎爺溫泉休閒事業有限公司</strong> — <a href="tel:+886988783823">(+886) 988-783-823</a></li>
</ul>

<h2>雲基地常去的口袋名單</h2>
<ul>
  <li><strong>波提娜麗咖啡</strong> — 在地精品咖啡，雲基地手沖咖啡專業養成的講師團隊。</li>
  <li><strong>花蓮市區小食</strong> — 沿著中山路、府前路一帶，小麵店、刀削麵、肉羹⋯⋯走 10 分鐘就能換一道。</li>
</ul>

<p>名單持續更新中。如果你也想加入「數位游牧友善店家」、或推薦其他在地店家，歡迎來信 <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>。</p>
`.trim()

const FRIENDLY_EN = `
<h2>About the Digital-Nomad-Friendly Network</h2>
<p>Twenty-two Hualien partners — restaurants, indigenous kitchens, whale-watching crews, soak-worthy hot-spring inns — wear the &ldquo;Digital-Nomad-Friendly&rdquo; mark. Step out of the Hub and Hualien gets a lot bigger.</p>

<h2>Tours &amp; Experiences</h2>
<ul>
  <li><strong>Turumoan Whale Watching</strong> — <a href="tel:+88638333821">(+886) 3-833-3821</a></li>
  <li><strong>Gaoshan Forest Base</strong> — <a href="tel:+886933991926">(+886) 933-991-926</a></li>
  <li><strong>Yi Ta Qu</strong> — <a href="tel:+886978583656">(+886) 978-583-656</a></li>
  <li><strong>Bian Jiao</strong> — <a href="tel:+886938798400">(+886) 938-798-400</a></li>
  <li><strong>Cidal Hunter School</strong> — <a href="tel:+886925758258">(+886) 925-758-258</a></li>
  <li><strong>Pura Vida Herbs</strong> — <a href="tel:+886975377615">(+886) 975-377-615</a></li>
  <li><strong>Houshan Metal Workshop</strong> — <a href="tel:+886980436674">(+886) 980-436-674</a></li>
  <li><strong>East Coast Travel</strong> — <a href="tel:+886922264795">(+886) 922-264-795</a></li>
</ul>

<h2>Restaurants &amp; Cafés</h2>
<ul>
  <li><strong>Dakili Tribal House</strong> — <a href="tel:+886970323871">(+886) 970-323-871</a></li>
  <li><strong>Fragrant Heritage Kitchen</strong> — <a href="tel:+886910265272">(+886) 910-265-272</a></li>
  <li><strong>9 Liang Tian Workshop</strong> — <a href="tel:+886977051477">(+886) 977-051-477</a></li>
  <li><strong>Lin Family Seafood</strong> — <a href="tel:+886905815891">(+886) 905-815-891</a></li>
  <li><strong>Dou Zou Hui</strong> — <a href="tel:+886920923327">(+886) 920-923-327</a></li>
  <li><strong>Lin&rsquo;s Fishball</strong> — <a href="tel:+886975977806">(+886) 975-977-806</a></li>
  <li><strong>Escoffier Bistro</strong> — <a href="tel:+886955567736">(+886) 955-567-736</a></li>
  <li><strong>Jia Jia Diner</strong> — <a href="tel:+886915185066">(+886) 915-185-066</a></li>
  <li><strong>Qixingtan Mu-Ming Private Kitchen</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
  <li><strong>Yi Ying Mu-Ming</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
  <li><strong>Fa Li Indigenous Cuisine</strong> — <a href="tel:+886987663328">(+886) 987-663-328</a></li>
</ul>

<h2>Souvenirs</h2>
<ul>
  <li><strong>Qing Feng Tea House</strong> — <a href="tel:+886980192849">(+886) 980-192-849</a></li>
  <li><strong>FishBar — Fish-Eating Experience</strong> — <a href="tel:+886968779878">(+886) 968-779-878</a></li>
</ul>

<h2>Lodging</h2>
<ul>
  <li><strong>Hu-Ye Hot Spring Resort</strong> — <a href="tel:+886988783823">(+886) 988-783-823</a></li>
</ul>

<h2>Hub favourites within walking distance</h2>
<ul>
  <li><strong>Bottega Manli</strong> — local specialty coffee; the team behind Cloud Coffee&rsquo;s monthly hand-drip class.</li>
  <li><strong>Downtown Hualien</strong> — Zhongshan Road / Fuqian Road are lined with noodle bars, dumpling stops and rice-bowl shops. Walk ten minutes and you&rsquo;ll find a different bowl.</li>
</ul>

<p>The list is growing. To join the &ldquo;Digital-Nomad-Friendly&rdquo; network or recommend a place, email us at <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>.</p>
`.trim()

async function updatePage(
  payload: any,
  slug: string,
  zh: string,
  en: string,
) {
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const page = res.docs[0]
  if (!page) {
    console.warn(`  ! page '${slug}' not found, skipping`)
    return
  }
  await payload.update({
    collection: 'pages',
    id: page.id,
    locale: 'zh-TW',
    data: { legacyHtml: zh, body: null } as any,
  })
  console.log(`  ✓ ${slug} [zh-TW] body cleared, legacyHtml updated`)
  await payload.update({
    collection: 'pages',
    id: page.id,
    locale: 'en',
    data: { legacyHtml: en, body: null } as any,
  })
  console.log(`  ✓ ${slug} [en] body cleared, legacyHtml updated`)
}

async function ensureFriendlyShopsPage(payload: any) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'friendly-shops' } },
    limit: 1,
    depth: 0,
  })
  let id = existing.docs[0]?.id
  if (!id) {
    const created = await payload.create({
      collection: 'pages',
      locale: 'zh-TW',
      data: {
        slug: 'friendly-shops',
        title: '友善店家｜遊程體驗',
        status: 'published',
        legacyHtml: FRIENDLY_ZH,
        hero: {
          heading: '友善店家 ・ 遊程體驗',
          subheading: '走出工作桌，把花蓮的山海跟在地夥伴一起放進這趟旅程。',
        },
      } as any,
    })
    id = created.id
    console.log(`  ✓ created friendly-shops page (id=${id})`)
  } else {
    console.log(`  · friendly-shops exists (id=${id}), updating`)
  }
  await payload.update({
    collection: 'pages',
    id: id!,
    locale: 'zh-TW',
    data: {
      legacyHtml: FRIENDLY_ZH,
      body: null,
      title: '友善店家｜遊程體驗',
      status: 'published',
    } as any,
  })
  await payload.update({
    collection: 'pages',
    id: id!,
    locale: 'en',
    data: {
      legacyHtml: FRIENDLY_EN,
      body: null,
      title: 'Friendly Shops & Tour Experiences',
      hero: {
        heading: 'Friendly Shops · Tour Experiences',
        subheading: 'Step away from the desk and into Hualien — with the partners we trust.',
      },
    } as any,
  })
  console.log('  ✓ friendly-shops content patched (zh-TW + en)')
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })

  console.log('→ patching move-in (Nomad Hualien)')
  await updatePage(payload, 'move-in', MOVE_IN_PATCH_ZH, MOVE_IN_PATCH_EN)

  console.log('\n→ patching venue-rental')
  await updatePage(payload, 'venue-rental', VENUE_PATCH_ZH, VENUE_PATCH_EN)

  console.log('\n→ ensuring friendly-shops page')
  await ensureFriendlyShopsPage(payload)

  console.log('\n🎉 patch complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
