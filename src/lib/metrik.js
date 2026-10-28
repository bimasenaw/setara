export const JENJANG = ['SD', 'SMP', 'SMA']

export const TAHUN_SEKOLAH = [2019, 2020, 2021, 2022, 2023]

export const TAHUN_PROVINSI = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

export const PAIRS = {
  wilayah: { pembanding: 'Perkotaan', tertinggal: 'Perdesaan' },
  ekonomi: { pembanding: 'Kuintil 5', tertinggal: 'Kuintil 1' },
  gender: { pembanding: 'Perempuan', tertinggal: 'Laki-laki' },
}

export const DIMENSI_LABEL = {
  wilayah: 'Wilayah',
  ekonomi: 'Ekonomi',
  gender: 'Gender',
}

export function cariNilai(data, dimensi, kelompok, jenjang, tahun) {
  const row = data.find(
    (d) =>
      d.dimensi === dimensi &&
      d.kelompok === kelompok &&
      d.jenjang === jenjang &&
      d.tahun === tahun,
  )
  return row ? row.nilai : null
}

export function selisih(a, b) {
  if (a === null || b === null) return null
  return Math.max(a, b) - Math.min(a, b)
}

export function rasio(a, b) {
  if (a === null || b === null || Math.min(a, b) === 0) return null
  return Math.max(a, b) / Math.min(a, b)
}

export function nasional(data, jenjang, tahun) {
  return cariNilai(data, 'wilayah', 'Total', jenjang, tahun)
}

export function perbandingan(data, dimensi, jenjang, tahun) {
  const pair = PAIRS[dimensi]
  const pembanding = cariNilai(data, dimensi, pair.pembanding, jenjang, tahun)
  const tertinggal = cariNilai(data, dimensi, pair.tertinggal, jenjang, tahun)
  return {
    pembanding,
    tertinggal,
    selisih: selisih(pembanding, tertinggal),
    rasio: rasio(pembanding, tertinggal),
  }
}
