import type { AppState, ViewMode, ControlIdx, NearbyStation } from './types'

export const PAGE_SIZE = 3
export const MAX_FETCH = 12
export const DEFAULT_REFRESH_MS = 30_000
export const DEFAULT_GPS_UPDATE_MS = 2_000
export let REFRESH_MS = DEFAULT_REFRESH_MS
export let GPS_UPDATE_MS = DEFAULT_GPS_UPDATE_MS
export function setRefreshMs(v: number) { REFRESH_MS = v }
export function setGpsUpdateMs(v: number) { GPS_UPDATE_MS = v }
export const FALLBACK_LAT = 40.7742744
export const FALLBACK_LON = -73.924307
export const TILE_W = 288
export const FULL_W = 576
export const FULL_H = 288
export const CTRL_H = 48
export const MAP_W = 288
export const MAP_H = 144
export const MAP_ZOOM_BASE = 15
export const SCROLL_DEBOUNCE_MS = 400

export const mtaURL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs"

export let appState: AppState = 'splash'
export let viewMode: ViewMode = 'available'
export let userLat = FALLBACK_LAT
export let userLon = FALLBACK_LON
export let allStations: NearbyStation[] = []
export let stations: NearbyStation[] = []
export let stationPage = 0
export let controlsCursor: ControlIdx = 0
export let refreshTimer: ReturnType<typeof setInterval> | null = null
export let gpsTimer: ReturnType<typeof setInterval> | null = null
export const DEFAULT_GLASSES_BRIGHTNESS = -15
export const DEFAULT_GLASSES_CONTRAST = -5
export const DEFAULT_GLASSES_DITHER: DitherMode = 'threshold'
export const DEFAULT_PHONE_BRIGHTNESS = 157
export const DEFAULT_PHONE_CONTRAST = 72
export const DEFAULT_PHONE_DITHER: DitherMode = 'threshold'
export const DEFAULT_PHONE_INVERT = false

export function setAppState(v: AppState) { appState = v }
export function setViewMode(v: ViewMode) { viewMode = v }
export function setUserLat(v: number) { userLat = v }
export function setUserLon(v: number) { userLon = v }

export const trainRoutesByColor = [
  {
    "color": "#0062CF",
    "routes": [
      "A",
      "C",
      "E"
    ]
  },
  {
    "color": "#EB6800",
    "routes": [
      "B",
      "D",
      "F",
      "F Express",
      "M"
    ]
  },
  {
    "color": "#799534",
    "routes": [
      "G"
    ]
  },
  {
    "color": "#8E5C33",
    "routes": [
      "J",
      "Z"
    ]
  },
  {
    "color": "#7C858C",
    "routes": [
      "L",
      "S"
    ]
  },
  {
    "color": "#F6BC26",
    "routes": [
      "N",
      "Q",
      "R",
      "W"
    ]
  },
  {
    "color": "#D82233",
    "routes": [
      "1",
      "2",
      "3"
    ]
  },
  {
    "color": "#009952",
    "routes": [
      "4",
      "5",
      "6",
      "6 Express"
    ]
  },
  {
    "color": "#9A38A1",
    "routes": [
      "7",
      "7 Express"
    ]
  },
  {
    "color": "#08179C",
    "routes": [
      "SIR"
    ]
  }
];
