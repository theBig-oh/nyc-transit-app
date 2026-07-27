// Dev-only build step: fetches MTA's static GTFS zip, pulls routes.txt,
// and groups route short names by their official route_color.
// Re-run manually when MTA updates the feed (npm run build:routes).
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import AdmZip from 'adm-zip'

const SOURCE_URL = 'http://web.mta.info/developers/data/nyct/subway/google_transit.zip'
const OUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'data',
  'routes.json',
)

const res = await fetch(SOURCE_URL)
if (!res.ok) throw new Error(`Failed to fetch google_transit.zip: ${res.status}`)
const buffer = Buffer.from(await res.arrayBuffer())

const zip = new AdmZip(buffer)
const entry = zip.getEntry('routes.txt')
if (!entry) throw new Error('routes.txt not found in zip')
const csv = entry.getData().toString('utf8')

// crude CSV split that respects quoted fields (route_desc contains commas)
function splitCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') { inQuotes = !inQuotes; continue }
    if (c === ',' && !inQuotes) { out.push(cur); cur = ''; continue }
    cur += c
  }
  out.push(cur)
  return out
}

const lines = csv.trim().split('\n')
const header = splitCsvLine(lines[0])
const idxShort = header.indexOf('route_short_name')
const idxColor = header.indexOf('route_color')

const byColor = new Map()
for (const line of lines.slice(1)) {
  const f = splitCsvLine(line)
  const short = f[idxShort]
  const color = `#${f[idxColor]}`
  if (!byColor.has(color)) byColor.set(color, [])
  const arr = byColor.get(color)
  if (!arr.includes(short)) arr.push(short)
}

const grouped = [...byColor.entries()].map(([color, routes]) => ({ color, routes }))

writeFileSync(OUT_PATH, JSON.stringify(grouped, null, 2))
console.log(`Wrote ${grouped.length} color groups to ${OUT_PATH}`)
console.log(grouped)
