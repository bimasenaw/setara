import {
  daftarProvinsi,
  nilaiPada,
  seriTahunan,
  tahunTersedia,
} from './indikator'

export function seriProvinsi(rows, kode, indikator, extra = {}) {
  return seriTahunan(rows, { indikator, kode, ...extra })
}

export function seriNasional(rows, indikator, extra = {}) {
  return seriTahunan(rows, { indikator, kode: '9999', ...extra })
}

export function gabungSeri(provinsi, nasional) {
  const map = new Map()
  for (const d of nasional) {
    map.set(d.tahun, { tahun: d.tahun, nasional: d.nilai, provinsi: null })
  }
  for (const d of provinsi) {
    const row = map.get(d.tahun) || { tahun: d.tahun, nasional: null, provinsi: null }
    row.provinsi = d.nilai
    map.set(d.tahun, row)
  }
  return [...map.values()].sort((a, b) => a.tahun - b.tahun)
}

export function perubahan(seri) {
  if (!seri.length) return null
  const awal = seri[0]
  const akhir = seri[seri.length - 1]
  return {
    awal,
    akhir,
    delta: akhir.nilai - awal.nilai,
  }
}

export function peringkatPerTahun(rows, indikator, extra = {}) {
  const years = tahunTersedia(rows, { indikator, ...extra })
  const provinsi = daftarProvinsi(rows)
  const map = new Map()
  for (const tahun of years) {
    const values = provinsi
      .map((p) => ({
        ...p,
        nilai: nilaiPada(rows, { indikator, kode: p.kode, tahun, ...extra }),
      }))
      .filter((p) => p.nilai !== null)
      .sort((a, b) => b.nilai - a.nilai)
    values.forEach((p, index) => {
      if (!map.has(p.kode)) map.set(p.kode, [])
      map.get(p.kode).push({ tahun, peringkat: index + 1, nilai: p.nilai, total: values.length })
    })
  }
  return map
}

export function perubahanPeringkat(rows, kode, indikator, extra = {}) {
  const peta = peringkatPerTahun(rows, indikator, extra)
  const seri = peta.get(kode) || []
  if (seri.length < 2) return null
  const awal = seri[0]
  const akhir = seri[seri.length - 1]
  return {
    awal,
    akhir,
    deltaPeringkat: awal.peringkat - akhir.peringkat,
  }
}

export function provinsiPalingBerubah(rows, indikator, extra = {}) {
  const provinsi = daftarProvinsi(rows)
  const list = provinsi
    .map((p) => {
      const seri = seriTahunan(rows, { indikator, kode: p.kode, ...extra })
      if (seri.length < 2) return null
      const awal = seri[0]
      const akhir = seri[seri.length - 1]
      return {
        ...p,
        awal,
        akhir,
        delta: akhir.nilai - awal.nilai,
      }
    })
    .filter(Boolean)
  const membaik = [...list].sort((a, b) => b.delta - a.delta).slice(0, 5)
  const memburuk = [...list].sort((a, b) => a.delta - b.delta).slice(0, 5)
  return { membaik, memburuk }
}
