import { cariNilai } from './metrik'
import { nilaiPada, nilaiTerbaru } from './indikator'

export const USIA_JENJANG = {
  SD: [7, 12],
  SMP: [13, 15],
  SMA: [16, 18],
  PAUD: [3, 6],
}

function parseKelompok(label) {
  const m = String(label || '').match(/^(\d{1,2})\s*[-–]\s*(\d{1,2})$/)
  if (!m) return null
  return [Number(m[1]), Number(m[2])]
}

function porsi(kelompok, awal, akhir) {
  const range = parseKelompok(kelompok)
  if (!range) return 0
  const [a, b] = range
  const overlap = Math.max(0, Math.min(akhir, b) - Math.max(awal, a) + 1)
  return overlap / (b - a + 1)
}

export function populasiUsiaNasional(rows, awal, akhir, gender = 'Jumlah') {
  let all = rows.filter(
    (r) =>
      r.indikator === 'populasi_umur_nasional' &&
      (r.gender === gender || (gender === 'Jumlah' && !r.gender)),
  )
  if (!all.length && gender === 'Jumlah') {
    all = rows.filter(
      (r) =>
        r.indikator === 'populasi_umur_nasional' &&
        (r.gender === 'Laki-Laki' || r.gender === 'Perempuan'),
    )
  }
  if (!all.length) return null
  const tahun = Math.max(...all.map((r) => r.tahun))
  const ageRows = all.filter((r) => r.tahun === tahun)
  const total = ageRows.reduce((sum, r) => sum + (r.nilai || 0) * porsi(r.kelompok, awal, akhir), 0)
  return total || null
}

export function populasiUsiaProvinsi(rows, kode, awal, akhir) {
  const ageRows = rows.filter(
    (r) => r.indikator === 'populasi_umur' && r.kode === kode && r.tahun === 2020,
  )
  if (!ageRows.length) return null
  const dasar2020 = ageRows.reduce((sum, r) => sum + (r.nilai || 0) * porsi(r.kelompok, awal, akhir), 0)
  const total2020 = ageRows.reduce((sum, r) => sum + (r.nilai || 0), 0)
  const total2025 = nilaiPada(rows, {
    indikator: 'populasi_provinsi',
    kode,
    tahun: 2025,
    kelompok: 'Jumlah',
  })
  if (!dasar2020 || !total2020) return null
  const skala = total2025 && total2020 ? total2025 / total2020 : 1
  return dasar2020 * skala
}

function angkaTidakSekolah(tidakSekolah, dimensi, kelompok, jenjang, tahun) {
  return cariNilai(tidakSekolah, dimensi, kelompok, jenjang, tahun)
}

export function dampakEkonomi(tidakSekolah, indikator, jenjang, tahun) {
  const usia = USIA_JENJANG[jenjang]
  if (!usia) return null
  const k1 = angkaTidakSekolah(tidakSekolah, 'ekonomi', 'Kuintil 1', jenjang, tahun)
  const k5 = angkaTidakSekolah(tidakSekolah, 'ekonomi', 'Kuintil 5', jenjang, tahun)
  if (k1 === null || k5 === null) return null
  const gap = k1 - k5
  if (gap <= 0) return null
  const populasi = populasiUsiaNasional(indikator, usia[0], usia[1])
  if (!populasi) return null
  const estimasi = populasi * 0.2 * (gap / 100)
  return {
    estimasi,
    populasi,
    gap,
    k1,
    k5,
    metode:
      'Populasi usia sekolah (proyeksi 2025) × asumsi 20% anak per kuintil × selisih angka tidak sekolah kuintil 1 dan 5.',
    asumsi: 'Kuintil pengeluaran dianggap terbagi merata 20% terhadap populasi anak usia sekolah.',
  }
}

export function dampakGender(tidakSekolah, indikator, jenjang, tahun) {
  const usia = USIA_JENJANG[jenjang]
  if (!usia) return null
  const laki = angkaTidakSekolah(tidakSekolah, 'gender', 'Laki-laki', jenjang, tahun)
  const perempuan = angkaTidakSekolah(tidakSekolah, 'gender', 'Perempuan', jenjang, tahun)
  if (laki === null || perempuan === null) return null
  const popLaki = populasiUsiaNasional(indikator, usia[0], usia[1], 'Laki-Laki')
  const popPerempuan = populasiUsiaNasional(indikator, usia[0], usia[1], 'Perempuan')
  if (!popLaki || !popPerempuan) return null
  if (laki >= perempuan) {
    const estimasi = popLaki * ((laki - perempuan) / 100)
    return {
      estimasi,
      kelompok: 'Laki-laki',
      gap: laki - perempuan,
      metode:
        'Populasi laki-laki usia sekolah (proyeksi 2025) × selisih angka tidak sekolah laki-laki dan perempuan.',
      asumsi: 'Populasi laki-laki dan perempuan dihitung dari proyeksi kelompok umur.',
    }
  }
  const estimasi = popPerempuan * ((perempuan - laki) / 100)
  return {
    estimasi,
    kelompok: 'Perempuan',
    gap: perempuan - laki,
    metode:
      'Populasi perempuan usia sekolah (proyeksi 2025) × selisih angka tidak sekolah perempuan dan laki-laki.',
    asumsi: 'Populasi laki-laki dan perempuan dihitung dari proyeksi kelompok umur.',
  }
}

export function dampakPaud(rows, kode, tahun) {
  const provinsi = nilaiPada(rows, { indikator: 'apk_paud', kode, tahun, kelompok: 'Total' })
  const nasional = nilaiPada(rows, { indikator: 'apk_paud', kode: '9999', tahun, kelompok: 'Total' })
  if (provinsi === null || nasional === null) return null
  const gap = nasional - provinsi
  if (gap <= 0) return null
  const populasi = populasiUsiaProvinsi(rows, kode, 3, 6)
  if (!populasi) return null
  return {
    estimasi: populasi * (gap / 100),
    populasi,
    gap,
    provinsi,
    nasional,
    metode:
      'Populasi usia 3-6 tahun × selisih APK PAUD provinsi dan nasional. Populasi 2020 diskalakan ke total penduduk 2025.',
    asumsi:
      'Distribusi umur SP2020 dipakai sebagai pendekatan; angka ini indikatif, bukan sensus 2025.',
  }
}

export function dampakTerbaru(rows, kode) {
  const { tahun } = nilaiTerbaru(rows, {
    indikator: 'apk_paud',
    kode: '9999',
    kelompok: 'Total',
  })
  if (nilaiPada(rows, { indikator: 'apk_paud', kode, tahun, kelompok: 'Total' }) === null) {
    const fallback = nilaiTerbaru(rows, { indikator: 'apk_paud', kode, kelompok: 'Total' })
    if (fallback.tahun) {
      return dampakPaud(rows, kode, fallback.tahun)
    }
  }
  return dampakPaud(rows, kode, tahun)
}
