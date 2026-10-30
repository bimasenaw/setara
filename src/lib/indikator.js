export function filterRows(rows, filter = {}) {
  const { indikator, kode, tahun, kelompok, jenjang, gender, wilayah } = filter
  return rows.filter((r) => {
    if (indikator && r.indikator !== indikator) return false
    if (kode && r.kode !== kode) return false
    if (tahun !== undefined && tahun !== null && r.tahun !== tahun) return false
    if (kelompok && r.kelompok !== kelompok) return false
    if (jenjang && r.jenjang !== jenjang) return false
    if (gender && r.gender !== gender) return false
    if (wilayah && r.wilayah !== wilayah) return false
    return true
  })
}

export function nilaiPada(rows, filter) {
  const row = filterRows(rows, filter).find((r) => typeof r.nilai === 'number')
  return row ? row.nilai : null
}

export function barisPada(rows, filter) {
  return filterRows(rows, filter).find((r) => typeof r.nilai === 'number') || null
}

export function tahunTersedia(rows, filter = {}) {
  return [...new Set(filterRows(rows, filter).map((r) => r.tahun))].sort((a, b) => a - b)
}

export function tahunTerbaru(rows, filter = {}) {
  const years = tahunTersedia(rows, filter)
  return years.length ? years[years.length - 1] : null
}

export function nilaiTerbaru(rows, filter = {}) {
  const years = tahunTersedia(rows, filter)
  for (let i = years.length - 1; i >= 0; i -= 1) {
    const nilai = nilaiPada(rows, { ...filter, tahun: years[i] })
    if (nilai !== null) return { nilai, tahun: years[i] }
  }
  return { nilai: null, tahun: null }
}

export function seriTahunan(rows, filter = {}) {
  const years = tahunTersedia(rows, filter)
  return years
    .map((tahun) => ({ tahun, nilai: nilaiPada(rows, { ...filter, tahun }) }))
    .filter((d) => d.nilai !== null)
}

export function daftarProvinsi(rows) {
  const map = new Map()
  for (const r of rows) {
    if (r.wilayah !== 'provinsi' || !r.kode || !r.provinsi) continue
    if (!map.has(r.kode)) map.set(r.kode, { kode: r.kode, provinsi: r.provinsi })
  }
  return [...map.values()].sort((a, b) => a.provinsi.localeCompare(b.provinsi))
}

export function provinsiByKode(rows, kode) {
  const row = rows.find((r) => r.wilayah === 'provinsi' && r.kode === kode)
  return row ? { kode: row.kode, provinsi: row.provinsi } : null
}

export function bandingkanProvinsi(rows, indikator, kode, tahun, extra = {}) {
  const provinsi = nilaiPada(rows, { indikator, kode, tahun, ...extra })
  const nasional = nilaiPada(rows, { indikator, kode: '9999', tahun, ...extra })
  if (provinsi === null || nasional === null) return { provinsi, nasional, selisih: null }
  return { provinsi, nasional, selisih: provinsi - nasional }
}

export function median(values) {
  const numbers = values.filter((v) => typeof v === 'number' && Number.isFinite(v)).sort((a, b) => a - b)
  if (!numbers.length) return null
  const mid = Math.floor(numbers.length / 2)
  return numbers.length % 2 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2
}

export function urutkanProvinsi(rows, indikator, tahun, extra = {}) {
  const out = []
  for (const p of daftarProvinsi(rows)) {
    const nilai = nilaiPada(rows, { indikator, kode: p.kode, tahun, ...extra })
    if (nilai === null) continue
    out.push({ ...p, nilai })
  }
  return out.sort((a, b) => a.nilai - b.nilai)
}
