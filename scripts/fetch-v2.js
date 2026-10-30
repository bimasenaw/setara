import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BASE = 'https://webapi.bps.go.id/v1/api'
const DOMAIN = '0000'
const DELAY_MS = 450
const RETRIES = 3

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

async function fetchJson(url, attempt = 1) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(45000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    if (attempt < RETRIES) {
      const wait = attempt * 900
      console.warn(`  retry ${attempt}/${RETRIES - 1} setelah ${wait} ms: ${err.message}`)
      await sleep(wait)
      return fetchJson(url, attempt + 1)
    }
    throw err
  }
}

function stripTags(s) {
  return String(s ?? '').replace(/<[^>]*>/g, ' ')
}

function cleanLabel(s) {
  return stripTags(s).replace(/\s+/g, ' ').trim()
}

function prettyProvince(s) {
  const raw = cleanLabel(s).toLowerCase()
  if (!raw) return ''
  const titled = raw
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
  return titled
    .replace(/\bD i\b/g, 'DI')
    .replace(/\bDki\b/g, 'DKI')
    .replace(/\bKep\b\.?/g, 'Kep.')
    .replace(/\.\./g, '.')
    .replace(/\bKep\. Riau\b/g, 'Kepulauan Riau')
}

function nilaiDari(datacontent, key) {
  if (!datacontent || datacontent[key] === undefined) return null
  const raw = datacontent[key]
  if (raw === null || raw === '' || raw === undefined) return null
  const n = parseFloat(raw)
  return Number.isNaN(n) ? null : n
}

function provinceInfo(vervarLabel) {
  const provinsi = prettyProvince(vervarLabel)
  if (!provinsi) return { wilayah: 'provinsi', kode: null, provinsi: null }
  if (/^indonesia$/i.test(provinsi)) {
    return { wilayah: 'nasional', kode: '9999', provinsi: 'Indonesia' }
  }
  return { wilayah: 'provinsi', kode: null, provinsi }
}

const JENJANG_USIA = {
  '7-12': 'SD',
  '13-15': 'SMP',
  '16-18': 'SMA',
  '19-23': 'PT',
  '19-24': 'PT',
}

const JENJANG_APM = {
  'SD/sederajat': 'SD',
  'SMP/sederajat': 'SMP',
  'SM/sederajat': 'SMA',
  'Perguruan Tinggi': 'PT',
}

const JENJANG_FASILITAS = {
  SD: 'SD',
  SMP: 'SMP',
  SMU: 'SMA',
  SMK: 'SMA',
  'Perguruan Tinggi': 'PT',
}

const SOURCES = [
  {
    varId: 2211,
    indikator: 'aps',
    judul: 'Angka Partisipasi Sekolah (APS) menurut provinsi dan kelompok umur',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    minYear: 2016,
    maxYear: 2025,
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => {
      const wilayah = provinceInfo(vervarLabel)
      const kelompok = cleanLabel(turvarLabel)
      return {
        ...wilayah,
        tahun,
        kelompok,
        jenjang: JENJANG_USIA[kelompok] || null,
        nilai,
      }
    },
  },
  {
    varId: 301,
    indikator: 'aps',
    judul: 'Angka Partisipasi Sekolah (APS) menurut provinsi (seri lama)',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2015],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => {
      const wilayah = provinceInfo(vervarLabel)
      const kelompok = cleanLabel(turvarLabel)
      return {
        ...wilayah,
        tahun,
        kelompok,
        jenjang: JENJANG_USIA[kelompok] || null,
        nilai,
      }
    },
  },
  {
    varId: 1439,
    indikator: 'apk_paud',
    judul: 'Angka Partisipasi Kasar (APK) PAUD 3-6 tahun menurut provinsi',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    minYear: 2016,
    maxYear: 2025,
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: 'Total',
      jenjang: 'PAUD',
      nilai,
    }),
  },
  {
    varId: 1440,
    indikator: 'apk_paud_wilayah',
    judul: 'APK PAUD menurut klasifikasi desa',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'PAUD',
      nilai,
    }),
  },
  {
    varId: 1441,
    indikator: 'apk_paud_gender',
    judul: 'APK PAUD menurut jenis kelamin',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'PAUD',
      nilai,
    }),
  },
  {
    varId: 1442,
    indikator: 'apk_paud_ekonomi',
    judul: 'APK PAUD menurut kuintil pengeluaran',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'PAUD',
      nilai,
    }),
  },
  {
    varId: 1339,
    indikator: 'apk_sma_gender',
    judul: 'APK SMA/sederajat menurut jenis kelamin',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'SMA',
      nilai,
    }),
  },
  {
    varId: 1342,
    indikator: 'apk_sma_wilayah',
    judul: 'APK SMA/sederajat menurut klasifikasi desa',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'SMA',
      nilai,
    }),
  },
  {
    varId: 1343,
    indikator: 'apk_sma_ekonomi',
    judul: 'APK SMA/sederajat menurut kuintil pengeluaran',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    onlyYears: [2019, 2023, 2025],
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      jenjang: 'SMA',
      nilai,
    }),
  },
  {
    varId: 1429,
    indikator: 'lama_sekolah',
    judul: 'Rata-rata lama sekolah penduduk 15 tahun ke atas menurut provinsi',
    satuan: 'tahun',
    sumber: 'BPS, Susenas',
    minYear: 2016,
    maxYear: 2025,
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: '15+',
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 1455,
    indikator: 'rasio_apm_gender',
    judul: 'Rasio APM perempuan/laki-laki menurut provinsi dan jenjang',
    satuan: 'indeks',
    sumber: 'BPS, Susenas',
    minYear: 2016,
    maxYear: 2025,
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => {
      const kelompok = cleanLabel(turvarLabel)
      return {
        ...provinceInfo(vervarLabel),
        tahun,
        kelompok,
        jenjang: JENJANG_APM[kelompok] || null,
        nilai,
      }
    },
  },
  {
    varId: 192,
    indikator: 'kemiskinan',
    judul: 'Persentase penduduk miskin (P0) menurut provinsi',
    satuan: 'persen',
    sumber: 'BPS, Susenas',
    minYear: 2019,
    maxYear: 2026,
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: cleanLabel(turvarLabel),
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 413,
    indikator: 'ipm',
    provinceOnly: true,
    judul: 'Indeks Pembangunan Manusia (metode baru) menurut provinsi',
    satuan: 'indeks',
    sumber: 'BPS',
    minYear: 2019,
    maxYear: 2024,
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: 'Total',
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 2196,
    indikator: 'ikg',
    provinceOnly: true,
    judul: 'Indeks Ketimpangan Gender menurut provinsi',
    satuan: 'indeks',
    sumber: 'BPS',
    minYear: 2019,
    maxYear: 2025,
    mapRow: ({ vervarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: 'Total',
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 205,
    indikator: 'fasilitas_sekolah',
    judul: 'Jumlah desa yang memiliki fasilitas sekolah menurut provinsi dan jenjang',
    satuan: 'desa',
    sumber: 'BPS, Potensi Desa',
    onlyYears: [2021, 2024, 2025],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => {
      const kelompok = cleanLabel(turvarLabel)
      return {
        ...provinceInfo(vervarLabel),
        tahun,
        kelompok,
        jenjang: JENJANG_FASILITAS[kelompok] || null,
        nilai,
      }
    },
  },
  {
    varId: 2781,
    indikator: 'populasi_provinsi',
    judul: 'Jumlah penduduk menurut provinsi dan jenis kelamin',
    satuan: 'orang',
    sumber: 'BPS',
    onlyYears: [2025],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: cleanLabel(turvarLabel),
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 2135,
    indikator: 'populasi_umur',
    judul: 'Jumlah penduduk laki-laki menurut provinsi dan kelompok umur (SP2020)',
    satuan: 'orang',
    sumber: 'BPS, SP2020',
    onlyYears: [2020],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: cleanLabel(turvarLabel),
      gender: 'Laki-laki',
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 2137,
    indikator: 'populasi_umur',
    judul: 'Jumlah penduduk perempuan menurut provinsi dan kelompok umur (SP2020)',
    satuan: 'orang',
    sumber: 'BPS, SP2020',
    onlyYears: [2020],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => ({
      ...provinceInfo(vervarLabel),
      tahun,
      kelompok: cleanLabel(turvarLabel),
      gender: 'Perempuan',
      jenjang: null,
      nilai,
    }),
  },
  {
    varId: 2777,
    indikator: 'populasi_umur_nasional',
    judul: 'Jumlah penduduk menurut kelompok umur dan jenis kelamin',
    satuan: 'orang',
    sumber: 'BPS',
    onlyYears: [2025],
    mapRow: ({ vervarLabel, turvarLabel, tahun, nilai }) => ({
      wilayah: 'nasional',
      kode: '9999',
      provinsi: 'Indonesia',
      tahun,
      kelompok: cleanLabel(vervarLabel),
      gender: cleanLabel(turvarLabel),
      jenjang: null,
      nilai,
    }),
  },
]

async function fetchYears(key, varId) {
  const url = `${BASE}/list/model/th/domain/${DOMAIN}/key/${key}/var/${varId}`
  const json = await fetchJson(url)
  const second = json?.data?.[1]
  const rows = Array.isArray(second) ? second : Array.isArray(second?.value) ? second.value : []
  if (!Array.isArray(rows)) return []
  return rows
    .map((r) => ({ thId: String(r.th_id), year: Number(r.th) }))
    .filter((r) => Number.isFinite(r.year))
}

function comboKeys(json, varId, thId) {
  const vervar = Array.isArray(json.vervar) ? json.vervar : []
  const turvar = Array.isArray(json.turvar) && json.turvar.length ? json.turvar : [{ val: '0', label: 'Tidak ada' }]
  const turtahun = Array.isArray(json.turtahun) && json.turtahun.length ? json.turtahun : [{ val: '0', label: '' }]
  const out = []
  for (const v of vervar) {
    for (const t of turvar) {
      for (const u of turtahun) {
        out.push({
          key: `${v.val}${varId}${t.val}${thId}${u.val}`,
          vervarVal: String(v.val),
          vervarLabel: v.label,
          turvarVal: String(t.val),
          turvarLabel: t.label,
          turtahunLabel: u.label,
        })
      }
    }
  }
  return out
}

async function fetchSource(key, source) {
  console.log(`\n[${source.varId}] ${source.judul}`)
  const allYears = await fetchYears(key, source.varId)
  const selected = allYears.filter(({ year }) => {
    if (source.onlyYears) return source.onlyYears.includes(year)
    if (source.minYear && year < source.minYear) return false
    if (source.maxYear && year > source.maxYear) return false
    return true
  })

  if (!selected.length) {
    console.warn('  tidak ada tahun yang cocok')
    return { rows: [], years: [] }
  }

  console.log(`  tahun: ${selected.map((s) => s.year).join(', ')}`)
  const rows = []
  for (const { thId, year } of selected) {
    const url = `${BASE}/list/model/data/domain/${DOMAIN}/var/${source.varId}/th/${thId}/key/${key}`
    try {
      const json = await fetchJson(url)
      const dc = json.datacontent || {}
      for (const c of comboKeys(json, source.varId, thId)) {
        const nilai = nilaiDari(dc, c.key)
        if (nilai === null) continue
        const mapped = source.mapRow({
          vervarLabel: c.vervarLabel,
          turvarLabel: c.turvarLabel,
          turtahunLabel: c.turtahunLabel,
          tahun: year,
          nilai,
        })
        if (!mapped || mapped.nilai === null || mapped.nilai === undefined) continue
        if (!mapped.provinsi) continue
        if (source.provinceOnly && mapped.wilayah === 'provinsi' && !/^\d{2}00$/.test(c.vervarVal)) {
          continue
        }
        if (mapped.wilayah === 'provinsi' && !mapped.kode) {
          mapped.kode = c.vervarVal
        }
        rows.push({
          indikator: source.indikator,
          var_id: source.varId,
          ...mapped,
        })
      }
    } catch (err) {
      console.error(`  gagal ${source.varId}/${year}: ${err.message}`)
    }
    await sleep(DELAY_MS)
  }
  console.log(`  ${rows.length} baris`)
  return { rows, years: selected.map((s) => s.year) }
}

function dedupe(rows) {
  const seen = new Map()
  for (const r of rows) {
    const key = [
      r.indikator,
      r.var_id,
      r.wilayah,
      r.kode || r.provinsi,
      r.tahun,
      r.kelompok,
      r.jenjang || '',
      r.gender || '',
    ].join('|')
    seen.set(key, r)
  }
  return [...seen.values()]
}

async function main() {
  const key = loadKey()
  const rows = []
  const metaIndicators = []

  for (const source of SOURCES) {
    const result = await fetchSource(key, source)
    rows.push(...result.rows)
    metaIndicators.push({
      indikator: source.indikator,
      var_id: source.varId,
      judul: source.judul,
      satuan: source.satuan,
      sumber: source.sumber,
      tahun: result.years,
      baris: result.rows.length,
    })
  }

  const cleanRows = dedupe(rows).sort((a, b) => {
    if (a.indikator !== b.indikator) return a.indikator.localeCompare(b.indikator)
    if (a.tahun !== b.tahun) return a.tahun - b.tahun
    if ((a.kode || '') !== (b.kode || '')) return String(a.kode).localeCompare(String(b.kode))
    if (a.kelompok !== b.kelompok) return a.kelompok.localeCompare(b.kelompok)
    return String(a.jenjang).localeCompare(String(b.jenjang))
  })

  const dataDir = join(ROOT, 'public', 'data')
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(join(dataDir, 'indikator.json'), JSON.stringify(cleanRows, null, 2))

  const meta = {
    generatedAt: new Date().toISOString(),
    source: 'BPS WebAPI',
    domain: DOMAIN,
    catatan:
      'Angka anak tidak sekolah (var 1984/1986/1988) dan partisipasi pembelajaran satu tahun sebelum SD (var 1990) tetap memakai data 2015-2023. Indikator baru memakai tahun terbaru yang tersedia di API.',
    indikator: metaIndicators,
    keterbatasan: [
      'Data berasal dari survei sampel (Susenas); selisih kecil perlu ditafsirkan hati-hati.',
      'Beberapa indikator memiliki RSE tinggi di provinsi tertentu, terutama provinsi baru Papua.',
      'Angka APK/APS tidak boleh dicampur langsung dengan angka anak tidak sekolah dalam satu grafik.',
      'Korelasi bukan sebab-akibat.',
    ],
  }
  writeFileSync(join(dataDir, 'meta.json'), JSON.stringify(meta, null, 2))

  console.log(`\nSelesai.`)
  console.log(`  indikator.json : ${cleanRows.length} baris`)
  console.log(`  meta.json      : ${metaIndicators.length} sumber`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
