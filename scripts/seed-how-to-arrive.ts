/**
 * Rewrites the /how-to-arrive page with up-to-date transit information
 * (台鐵 / 客運 / 國道客運 / 自駕 / 飛機) and embeds the user-provided
 * Google Maps short link.
 *
 *   pnpm tsx scripts/seed-how-to-arrive.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config.js'

const GMAPS_SHORT = 'https://maps.app.goo.gl/te6GjLyxRcXAWU4w7'
// Google's classic embed query — works without API key for "place lookup".
const GMAPS_EMBED =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('花蓮雲基地 花蓮市府前路3號') +
  '&output=embed'

const ZH = `
<p>花蓮雲基地坐落在花蓮市府前路 3 號，距離花蓮車站步行約 20 分鐘、計程車車程約 5 分鐘。下面整理常見的交通方式，從台北、桃園、台中或高雄出發都可以參考。</p>

<figure class="map-embed">
  <iframe
    src="${GMAPS_EMBED}"
    width="100%"
    height="420"
    style="border:0;border-radius:12px;"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
    title="花蓮雲基地 Google 地圖"
  ></iframe>
  <figcaption style="margin-top:0.75rem;">
    <a href="${GMAPS_SHORT}" target="_blank" rel="noopener">在 Google 地圖中開啟 →</a>
  </figcaption>
</figure>

<h2>地址</h2>
<p><strong>花蓮縣花蓮市府前路 3 號</strong>（鄰近花蓮縣政府、東大門夜市）</p>

<h2>從台北出發</h2>

<h3>🚆 台鐵（最推薦）</h3>
<ul>
  <li>台北 → 花蓮：太魯閣號／普悠瑪號／自強號 3000，車程約 2 小時</li>
  <li>票價約 NTD 440</li>
  <li>連假與週末務必提前訂票，可使用台鐵 e 訂通 App 或台鐵官網</li>
  <li>抵達花蓮車站後，搭計程車約 5 分鐘（NTD 150 內）即可到雲基地</li>
</ul>

<h3>🚌 國道客運</h3>
<ul>
  <li>首都客運 1663（台北 ⇄ 花蓮）：台北轉運站發車，車程約 3.5 – 4 小時，票價約 NTD 320</li>
  <li>統聯 1580（板橋 ⇄ 花蓮）：板橋客運站發車，類似行車時間</li>
  <li>下車站「花蓮轉運站」距離雲基地步行約 15 分鐘，亦可轉搭計程車</li>
</ul>

<h3>🚗 自駕</h3>
<ul>
  <li>國道 5 號（國 5）→ 蘇澳交流道 → 蘇花改／台 9 線南下 → 花蓮市</li>
  <li>連假請務必預估蘇澳→花蓮路段的車流；出發前查詢公路總局即時路況</li>
  <li>雲基地周邊有路邊停車格與公有停車場，建議預約後再出發</li>
</ul>

<h2>從台中、高雄出發</h2>
<ul>
  <li><strong>台鐵環島列車：</strong>自強號／普悠瑪／太魯閣號可橫貫南北，台中 → 花蓮約 5 小時、高雄 → 花蓮約 6 小時。</li>
  <li><strong>自駕（南迴）：</strong>南二高 → 國 1 → 國 5 → 蘇花改南下；西部直接走國 1／國 3 接國 5 也可以。</li>
</ul>

<h2>從花蓮車站到雲基地</h2>
<ul>
  <li>步行：約 1.5 公里，行走 20 分鐘</li>
  <li>計程車：5 分鐘，車資約 NTD 100 – 150</li>
  <li>租機車／自行車：花蓮車站前東出口有多家租車店，雲基地有路邊停車</li>
  <li>公車：花蓮客運 1126／1129，於「縣府」站下車後步行 3 分鐘</li>
</ul>

<h2>聯絡我們</h2>
<p>到達現場若需要協助，可寫信到 <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a> 或電洽 (+886) 03-835-0046。</p>
`.trim()

const EN = `
<p>Hualien Cloud Hub sits at <strong>No. 3 Fuqian Rd., Hualien City</strong> — a 20-minute walk or a five-minute taxi ride from Hualien Train Station. Below are the common ways to get here from Taipei, Taichung or Kaohsiung.</p>

<figure class="map-embed">
  <iframe
    src="${GMAPS_EMBED}"
    width="100%"
    height="420"
    style="border:0;border-radius:12px;"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
    title="Hualien Cloud Hub on Google Maps"
  ></iframe>
  <figcaption style="margin-top:0.75rem;">
    <a href="${GMAPS_SHORT}" target="_blank" rel="noopener">Open in Google Maps →</a>
  </figcaption>
</figure>

<h2>Address</h2>
<p><strong>No. 3, Fuqian Rd., Hualien City, Hualien County 970, Taiwan</strong> — next to the County Government Hall and a short walk from Dongdamen Night Market.</p>

<h2>From Taipei</h2>

<h3>🚆 Taiwan Railways (most recommended)</h3>
<ul>
  <li>Taipei → Hualien on a Taroko / Puyuma / TC3000 express: about 2 hours</li>
  <li>Fare: roughly NTD 440</li>
  <li>Book early on weekends/holidays via the TRA Tickets app or the official TRA website</li>
  <li>From Hualien Station: a five-minute taxi (under NTD 150) lands you at the Cloud Hub</li>
</ul>

<h3>🚌 Intercity bus</h3>
<ul>
  <li>Capital Bus 1663 (Taipei ⇄ Hualien) — departs Taipei Bus Station, about 3.5 to 4 hours, around NTD 320</li>
  <li>UBus 1580 (Banqiao ⇄ Hualien) — departs Banqiao Bus Station, similar timing</li>
  <li>Hualien Bus Terminal is a 15-minute walk from the Cloud Hub; taxis are easy to catch</li>
</ul>

<h3>🚗 By car</h3>
<ul>
  <li>National Highway 5 → Su&apos;ao Interchange → Suhua Improvement / Provincial Highway 9 south to Hualien City</li>
  <li>Expect heavy traffic on weekends and long weekends; check live road conditions before leaving</li>
  <li>Street parking and public lots are available nearby — reserve ahead during peak season</li>
</ul>

<h2>From Taichung or Kaohsiung</h2>
<ul>
  <li><strong>Train (around-the-island):</strong> Taroko / Puyuma / Tze-Chiang services run north-south. Taichung → Hualien ~5 hours; Kaohsiung → Hualien ~6 hours.</li>
  <li><strong>By car:</strong> West-coast freeways (Highway 1 / 3) connect to Highway 5, then onward via Suhua Improvement.</li>
</ul>

<h2>From Hualien Station to the Cloud Hub</h2>
<ul>
  <li>Walk: 1.5 km, about 20 minutes</li>
  <li>Taxi: five minutes, NTD 100 – 150</li>
  <li>Scooter / bike rental: several shops at the east exit of Hualien Station; on-street parking on site</li>
  <li>Hualien Bus 1126 / 1129 — alight at &ldquo;County Government&rdquo; (縣府) and walk three minutes</li>
</ul>

<h2>Contact</h2>
<p>If you need help on arrival, drop us a line at <a href="mailto:contact@hualien.cloud">contact@hualien.cloud</a> or call (+886) 03-835-0046.</p>
`.trim()

async function main() {
  const payload = await getPayload({ config: payloadConfig as any })
  const r = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'how-to-arrive' } },
    limit: 1,
    depth: 0,
  })
  const page = r.docs[0]
  if (!page) {
    console.error('  ! how-to-arrive page not found in DB')
    process.exit(1)
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    locale: 'zh-TW',
    data: { legacyHtml: ZH, body: null } as any,
  })
  console.log(`  ✓ how-to-arrive [zh-TW] body rewritten`)

  await payload.update({
    collection: 'pages',
    id: page.id,
    locale: 'en',
    data: { legacyHtml: EN, body: null } as any,
  })
  console.log(`  ✓ how-to-arrive [en] body rewritten`)

  console.log('\n🎉 done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
