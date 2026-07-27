// Dev-only build step: fetches MTA's static station list and trims it down
// to what the app actually needs. Re-run manually when MTA updates the feed
// (npm run build:stations) — this is NOT part of the runtime app.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const SOURCE_URL = 'http://web.mta.info/developers/data/nyct/subway/Stations.csv'
const OUT_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'data',
  'stations.json',
)

const res = await fetch(SOURCE_URL)
if (!res.ok) throw new Error(`Failed to fetch Stations.csv: ${res.status}`)
const csv = await res.text()

const lines = csv.trim().split('\n')
const header = lines[0].split(',')
const col = (name) => header.indexOf(name)

const idxGtfsStopId = col('GTFS Stop ID')
const idxStopName = col('Stop Name')
const idxRoutes = col('Daytime Routes')
const idxLat = col('GTFS Latitude')
const idxLon = col('GTFS Longitude')
const idxComplexId = col('Complex ID')
const idxBorough = col('Borough')

const stations = lines.slice(1).map((line) => {
  const f = line.split(',')
  return {
    stopId: f[idxGtfsStopId],
    name: f[idxStopName],
    routes: f[idxRoutes].split(' ').filter(Boolean),
    lat: Number(f[idxLat]),
    lon: Number(f[idxLon]),
    complexId: f[idxComplexId],
    borough: f[idxBorough],
  }
})

writeFileSync(OUT_PATH, JSON.stringify(stations, null, 2))
console.log(`Wrote ${stations.length} stations to ${OUT_PATH}`)
