/**
 * Rewrite 進駐 (move-in) and 場地租用 (venue-rental) pages with
 * bilingual content harvested from scrape/pages/move-in.html and
 * scrape/pages/venue-rental.html.
 *
 *   pnpm tsx scripts/seed-residency-and-venue.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

// ---------- 進駐 (Nomad Hualien · 數位遊牧者進駐計劃) ----------
const MOVE_IN_ZH = `
<h2>關於 Nomad Hualien</h2>
<p><strong>Nomad Hualien · 花蓮雲基地數位遊牧者進駐計劃</strong>邀請來自全球的數位遊牧者，把花蓮當作下一個工作據點。從台灣的東海岸出發，連結國際遊牧社群、在地產業與創作者，把「在花蓮工作」變成一段可被細細說起的職涯經驗。</p>
<p>第一梯次徵選已順利完成，入選者來自希臘、日本、印度、臺灣與德國，跨足科技、設計、行銷與內容創作領域。第二梯次正在規劃中，歡迎下載簡章了解最新進駐期程與申請方式。</p>

<h3>📑 招募簡章下載</h3>
<ul>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-zh.pdf?prefix=media" target="_blank" rel="noopener">下載中文版簡章（PDF · 8 頁）</a></li>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-en.pdf?prefix=media" target="_blank" rel="noopener">Download English brochure (PDF · 8 pages)</a></li>
</ul>

<h2>空間簡介</h2>
<ul>
  <li>個人工作室（私人房間，含獨立衛浴與空調）</li>
  <li>一樓共創空間（共用辦公桌、會議區）</li>
  <li>可預約私人會議室</li>
  <li>高速網路、列印與週邊設備</li>
  <li>每月固定遊牧者交流聚會（三三小聚）</li>
  <li>步行可達在地便利設施（縣府、夜市、車站）</li>
  <li>駐點人員平日現場協助</li>
</ul>

<h2>申請須知</h2>

<h3>一、目的</h3>
<p>為促進國際交流並維護辦公空間品質，特訂定本準則以規範所有進駐申請與管理事宜。</p>

<h3>二、申請資格</h3>
<p>經雲基地核可，且符合政策目標之個人或團體。</p>

<h3>三、進駐期間</h3>
<ul>
  <li><strong>期程：</strong>1 個月至 3 個月（視審核結果而定）。</li>
  <li><strong>續約：</strong>如需延長，須重新提出申請並經核准。</li>
</ul>

<h3>四、申請需求</h3>
<ul>
  <li>進駐申請書</li>
  <li>個人或團隊簡介（包含背景與工作性質）</li>
  <li>進駐目的及預計進駐日期</li>
  <li>如需補充其他證明文件，將另行告知</li>
</ul>

<h3>五、審核流程</h3>
<ul>
  <li><strong>初審：</strong>執行單位確認文件齊備。</li>
  <li><strong>核定：</strong>由主辦單位正式核可。</li>
  <li><strong>進駐：</strong>獲得正式批准後方可使用進駐空間。</li>
</ul>

<h3>六、權利與義務</h3>
<ul>
  <li><strong>權利：</strong>於核准期間內使用場地設施及現場支援服務。</li>
  <li><strong>義務：</strong>遵守場館所有規章制度，負責且正當地使用設備，嚴禁擅自變更；配合管理團隊管理，若有重大變更須立即通報。</li>
</ul>

<h3>七、終止進駐與退駐</h3>
<ul>
  <li><strong>強制執行：</strong>若違反規範經勸告後未改善，管理方得終止其進駐資格。</li>
  <li><strong>退駐：</strong>進駐期滿或提前退駐時，進駐者須將空間恢復原狀，並完成退駐程序。</li>
</ul>

<h2>申請方式</h2>
<p>請來信 <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a>，附上你的姓名、駐留期間、簡介，以及希望在花蓮做的事；可一併附上上方下載的中文 / 英文簡章內所列附件。駐點人員會在 3 個工作日內回覆審查結果與後續流程。</p>
`.trim()

const MOVE_IN_EN = `
<h2>About Nomad Hualien</h2>
<p><strong>Nomad Hualien · the Hualien Cloud Hub Digital Nomad Residency Program</strong> invites digital nomads from around the world to make Hualien their next base. Starting from Taiwan&rsquo;s east coast, the programme connects international nomad communities with local industry and makers — turning &ldquo;working in Hualien&rdquo; into a chapter of your career worth telling.</p>
<p>The first cohort is in residence: five participants from Greece, Japan, India, Taiwan and Germany, working across tech, design, marketing and content. The second cohort is being planned. Download the brochure below for the latest dates and how to apply.</p>

<h3>📑 Recruitment Brochures</h3>
<ul>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-en.pdf?prefix=media" target="_blank" rel="noopener">Download English brochure (PDF · 8 pages)</a></li>
  <li>📄 <a href="/api/media/file/nomad-hualien-recruitment-brochure-zh.pdf?prefix=media" target="_blank" rel="noopener">下載中文版簡章 (PDF · 8 頁)</a></li>
</ul>

<h2>About the Space</h2>
<ul>
  <li>Private studio rooms with ensuite bathroom and air conditioning</li>
  <li>Ground-floor coworking area with shared desks and meeting nooks</li>
  <li>Bookable private meeting rooms</li>
  <li>High-speed internet, printing and basic equipment</li>
  <li>Monthly community meet-ups (Hualien 33)</li>
  <li>Local amenities — county hall, night market, train station — within walking distance</li>
  <li>On-site staff support during weekdays</li>
</ul>

<h2>Terms and Conditions</h2>

<h3>I. Purpose</h3>
<p>To facilitate international exchange and maintain workspace quality, these guidelines govern all residency applications and management.</p>

<h3>II. Eligibility</h3>
<p>Individuals or teams aligned with the programme&rsquo;s policy goals, as approved by the Cloud Hub.</p>

<h3>III. Residency Period</h3>
<ul>
  <li><strong>Duration:</strong> 1 to 3 months (subject to approval).</li>
  <li><strong>Extensions:</strong> a new application and approval are required.</li>
</ul>

<h3>IV. Application Requirements</h3>
<ul>
  <li>Application form</li>
  <li>A short bio / profile (background and the nature of your work)</li>
  <li>Purpose of stay and requested dates</li>
  <li>Supporting documents on request</li>
</ul>

<h3>V. Review Process</h3>
<ul>
  <li><strong>Initial screening:</strong> verification of documents by the execution team.</li>
  <li><strong>Final approval:</strong> official authorization by the host authority.</li>
  <li><strong>Entry:</strong> access is granted only after formal approval.</li>
</ul>

<h3>VI. Rights &amp; Obligations</h3>
<ul>
  <li><strong>Rights:</strong> use of facilities and on-site support during the approved term.</li>
  <li><strong>Obligations:</strong> comply with all venue rules; use equipment responsibly with no unauthorized changes; cooperate with management and report major changes promptly.</li>
</ul>

<h3>VII. Termination &amp; Move-out</h3>
<ul>
  <li><strong>Enforcement:</strong> management may terminate residency if violations continue after a warning.</li>
  <li><strong>Departure:</strong> upon expiration or early exit, residents must restore the space and complete move-out procedures.</li>
</ul>

<h2>How to Apply</h2>
<p>Email <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a> with your name, intended residency dates, a short bio, and what you&rsquo;d like to make in Hualien. You can also attach the materials listed in the brochure above. Our staff will follow up within three working days with the review outcome and next steps.</p>
`.trim()

// ---------- 場地租用 ----------
const VENUE_ZH = `
<h2>空間簡介</h2>

<h3>共創空間 Coworking Space</h3>
<ul>
  <li>容納人數：20 ～ 25 人</li>
  <li>面積：約 15 坪（約 50 平方公尺）</li>
  <li>含投影、桌椅、無線網路</li>
  <li>適合工作坊、講座、小型發表</li>
</ul>

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

const VENUE_EN = `
<h2>The Spaces</h2>

<h3>Coworking Space</h3>
<ul>
  <li>Capacity: 20 to 25 people</li>
  <li>Area: about 50 sqm (~15 ping)</li>
  <li>Projector, tables and chairs, Wi-Fi included</li>
  <li>Good fit for workshops, talks, small launches</li>
</ul>

<h3>Outdoor Plaza</h3>
<ul>
  <li>Capacity: up to 80 people</li>
  <li>Good fit for markets, screenings, open-air events</li>
</ul>

<h2>Terms and Conditions — Hualien Cloud Hub House Rules</h2>
<p>Please read the rules below before booking.</p>

<h3>1. Scope</h3>
<p>Renting the Cloud Hub meeting space (&ldquo;the venue&rdquo;) implies acceptance of these rules.</p>

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

async function findCoverIdByFilename(payload: any, filename: string) {
  const r = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  return r.docs[0]?.id ?? null
}

async function updatePage(
  payload: any,
  slug: string,
  zh: string,
  en: string,
  opts: { coverFilename?: string; titleZh?: string; titleEn?: string } = {},
) {
  const r = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const p = r.docs[0]
  if (!p) {
    console.warn(`  ! page '${slug}' not found`)
    return
  }
  const coverId = opts.coverFilename ? await findCoverIdByFilename(payload, opts.coverFilename) : null
  await payload.update({
    collection: 'pages',
    id: p.id,
    locale: 'zh-TW',
    data: {
      legacyHtml: zh,
      body: null,
      ...(opts.titleZh ? { title: opts.titleZh } : {}),
      ...(coverId ? { cover: coverId } : {}),
    } as any,
  })
  console.log(`  ✓ ${slug} [zh-TW] body rewritten${coverId ? ' (+cover)' : ''}${opts.titleZh ? ' (+title)' : ''}`)

  await payload.update({
    collection: 'pages',
    id: p.id,
    locale: 'en',
    data: {
      legacyHtml: en,
      body: null,
      ...(opts.titleEn ? { title: opts.titleEn } : {}),
    } as any,
  })
  console.log(`  ✓ ${slug} [en] body rewritten${opts.titleEn ? ' (+title)' : ''}`)
}

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  await updatePage(payload, 'move-in', MOVE_IN_ZH, MOVE_IN_EN, {
    coverFilename: 'cowork-space-scaled-e1774513567779.jpg',
    titleZh: 'Nomad Hualien｜花蓮雲基地數位遊牧者進駐計劃',
    titleEn: 'Nomad Hualien — Digital Nomad Residency Programme',
  })
  await updatePage(payload, 'venue-rental', VENUE_ZH, VENUE_EN, {
    coverFilename: 'IMG_2373.jpg',
  })
  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
