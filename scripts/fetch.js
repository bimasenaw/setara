import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BASE = 'https://webapi.bps.go.id/v1/api'
const DOMAIN = '0000'
const DELAY_MS = 300

function loadKey() {
  const envPath = join(ROOT, '.env')
  let raw
  try {
    raw = readFileSync(envPath, 'utf8')
  } catch {
    console.error('File .env tidak ditemukan. Salin .env.example menjadi .env lalu isi BPS_API_KEY.')
    process.exit(1)
  }
  const m = raw.match(/^BPS_API_KEY=(.+)$/m)
  if (!m || !m[1].trim()) {
    console.error('BPS_API_KEY kosong di .env.')
    process.exit(1)
  }
  return m[1].trim()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} untuk ${url}`)
  }
  return res.json()
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function prettyProvince(label) {
  return titleCase(label)
    .replace(/\bDki\b/g, 'DKI')
    .replace(/\bDi\b/g, 'DI')
    .replace(/\bKep\. Riau\b/g, 'Kepulauan Riau')
}

const JENJANG = { 1672: 'SD', 1673: 'SMP', 1674: 'SMA' }

const DIMENSI = {
  1984: { dimensi: 'wilayah', kelompok: { 1: 'Perkotaan', 2: 'Perdesaan', 3: 'Total' } },
  1986: { dimensi: 'gender', kelompok: { 1: 'Laki-laki', 2: 'Perempuan', 3: 'Total' } },
  1988: {
    dimensi: 'ekonomi',
    kelompok: { 1: 'Kuintil 1', 2: 'Kuintil 2', 3: 'Kuintil 3', 4: 'Kuintil 4', 5: 'Kuintil 5' },
  },
}

const TIDAK_SEKOLAH_VARS = [1984, 1986, 1988]
const TIDAK_SEKOLAH_TH = [119, 120, 121, 122, 123]
const PROVINSI_VAR = 1990
const PROVINSI_TH = [115, 116, 117, 118, 119, 120, 121, 122, 123]

function tahunDariRespons(json, thId) {
  const tahuns = json && Array.isArray(json.tahun) ? json.tahun : []
  const t = tahuns.find((x) => String(x.val) === String(thId))
  if (t && t.label) {
    const y = parseInt(t.label, 10)
    if (!Number.isNaN(y)) return y
  }
  return 1900 + thId
}

function nilaiDari(datacontent, key) {
  const raw = datacontent[key]
  if (raw === undefined || raw === null || raw === '') return null
  const n = parseFloat(raw)
  if (Number.isNaN(n)) return null
  return n
}

function kombinasiKey(json, varCode, thId) {
  const vervar = Array.isArray(json.vervar) ? json.vervar : []
  const turvar = Array.isArray(json.turvar) ? json.turvar : []
  const turtahun = Array.isArray(json.turtahun) ? json.turtahun : [{ val: '0' }]
  const keys = []
  for (const v of vervar) {
    for (const t of turvar) {
      for (const u of turtahun) {
        keys.push({ vervar: String(v.val), turvar: String(t.val), turtahun: String(u.val) })
      }
    }
  }
  return keys.map((k) => ({
    ...k,
    key: `${k.vervar}${varCode}${k.turvar}${thId}${k.turtahun}`,
  }))
}

async function ambilTidakSekolah(key) {
  const rows = []
  for (const varCode of TIDAK_SEKOLAH_VARS) {
    const meta = DIMENSI[varCode]
    for (const thId of TIDAK_SEKOLAH_TH) {
      const url = `${BASE}/list/model/data/domain/${DOMAIN}/var/${varCode}/th/${thId}/key/${key}`
      let json
      try {
        json = await fetchJson(url)
      } catch (err) {
        console.error(`Gagal ${varCode}/${thId}: ${err.message}`)
        await sleep(DELAY_MS)
        continue
      }
      const tahun = tahunDariRespons(json, thId)
      const dc = json.datacontent || {}
      for (const k of kombinasiKey(json, varCode, thId)) {
        const jenjang = JENJANG[k.turvar]
        if (!jenjang) continue
        const kelompok = meta.kelompok[k.vervar]
        if (!kelompok) continue
        const nilai = nilaiDari(dc, k.key)
        if (nilai === null) continue
        rows.push({ dimensi: meta.dimensi, kelompok, jenjang, tahun, nilai })
      }
      await sleep(DELAY_MS)
    }
  }
  return rows
}

async function ambilProvinsi(key) {
  const provinsi = []
  const nasional = []
  for (const thId of PROVINSI_TH) {
    const url = `${BASE}/list/model/data/domain/${DOMAIN}/var/${PROVINSI_VAR}/th/${thId}/key/${key}`
    let json
    try {
      json = await fetchJson(url)
    } catch (err) {
      console.error(`Gagal ${PROVINSI_VAR}/${thId}: ${err.message}`)
      await sleep(DELAY_MS)
      continue
    }
    const tahun = tahunDariRespons(json, thId)
    const dc = json.datacontent || {}
    for (const k of kombinasiKey(json, PROVINSI_VAR, thId)) {
      const nilai = nilaiDari(dc, k.key)
      if (nilai === null) continue
      if (k.vervar === '9999') {
        nasional.push({ tahun, nilai })
        continue
      }
      const label = (json.vervar || []).find((v) => String(v.val) === k.vervar)
      const nama = prettyProvince(label ? label.label : k.vervar)
      provinsi.push({ kode: k.vervar, provinsi: nama, tahun, nilai })
    }
    await sleep(DELAY_MS)
  }
  return { provinsi, nasional }
}

async function main() {
  const key = loadKey()
  console.log('Mengambil data anak tidak sekolah (1984/1986/1988) ...')
  const tidakSekolah = await ambilTidakSekolah(key)
  console.log('Mengambil data partisipasi PAUD per provinsi (1990) ...')
  const { provinsi, nasional } = await ambilProvinsi(key)

  const dataDir = join(ROOT, 'public', 'data')
  mkdirSync(dataDir, { recursive: true })

  writeFileSync(join(dataDir, 'tidak_sekolah.json'), JSON.stringify(tidakSekolah, null, 2))
  writeFileSync(
    join(dataDir, 'provinsi.json'),
    JSON.stringify({ nasional, provinsi }, null, 2),
  )

  console.log(`\nSelesai.`)
  console.log(`  tidak_sekolah.json : ${tidakSekolah.length} baris`)
  console.log(`  provinsi.json      : ${provinsi.length} baris provinsi, ${nasional.length} baris nasional`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
