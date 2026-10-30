import {
  daftarProvinsi,
  median,
  nilaiPada,
  seriTahunan,
  tahunTerbaru,
} from './indikator'

export const KOMPONEN_PRIORITAS = [
  {
    id: 'aps_sma',
    label: 'Partisipasi usia SMA',
    indikator: 'aps',
    jenjang: 'SMA',
    higherIsBetter: true,
    satuan: 'persen',
  },
  {
    id: 'apk_paud',
    label: 'APK PAUD 3-6',
    indikator: 'apk_paud',
    kelompok: 'Total',
    higherIsBetter: true,
    satuan: 'persen',
  },
  {
    id: 'lama_sekolah',
    label: 'Rata-rata lama sekolah',
    indikator: 'lama_sekolah',
    kelompok: '15+',
    higherIsBetter: true,
    satuan: 'tahun',
  },
  {
    id: 'kemiskinan',
    label: 'Penduduk miskin',
    indikator: 'kemiskinan',
    kelompok: 'Jumlah',
    higherIsBetter: false,
    satuan: 'persen',
  },
  {
    id: 'ipm',
    label: 'IPM',
    indikator: 'ipm',
    kelompok: 'Total',
    higherIsBetter: true,
    satuan: 'indeks',
  },
  {
    id: 'ikg',
    label: 'Ketimpangan gender',
    indikator: 'ikg',
    kelompok: 'Total',
    higherIsBetter: false,
    satuan: 'indeks',
  },
]

function filterKomponen(komponen) {
  return {
    indikator: komponen.indikator,
    kelompok: komponen.kelompok,
    jenjang: komponen.jenjang,
  }
}

function nilaiKomponen(rows, komponen, kode, tahun) {
  return nilaiPada(rows, {
    ...filterKomponen(komponen),
    kode,
    tahun,
  })
}

function skorPersentil(values, higherIsBetter) {
  const sorted = [...values].sort((a, b) => a.nilai - b.nilai)
  const n = sorted.length
  const map = new Map()
  sorted.forEach((item, index) => {
    const persentil = n <= 1 ? 50 : (index / (n - 1)) * 100
    map.set(item.kode, higherIsBetter ? 100 - persentil : persentil)
  })
  return map
}

export function hitungPrioritas(rows) {
  const provinsi = daftarProvinsi(rows)
  const komponen = KOMPONEN_PRIORITAS.map((item) => {
    const tahun = tahunTerbaru(rows, { ...filterKomponen(item), wilayah: 'provinsi' })
    const values = provinsi
      .map((p) => ({ kode: p.kode, nilai: nilaiKomponen(rows, item, p.kode, tahun) }))
      .filter((d) => d.nilai !== null)
    return {
      ...item,
      tahun,
      values,
      skor: skorPersentil(values, item.higherIsBetter),
    }
  })

  const daftar = provinsi
    .map((p) => {
      const skorList = []
      const detail = {}
      for (const k of komponen) {
        const skor = k.skor.get(p.kode)
        const nilai = k.values.find((v) => v.kode === p.kode)?.nilai ?? null
        detail[k.id] = { nilai, skor: skor ?? null, tahun: k.tahun, label: k.label }
        if (skor !== undefined) skorList.push(skor)
      }
      const skor = skorList.length ? skorList.reduce((a, b) => a + b, 0) / skorList.length : null
      return {
        ...p,
        skor,
        cakupan: skorList.length,
        komponen: detail,
      }
    })
    .filter((p) => p.skor !== null)
    .sort((a, b) => b.skor - a.skor)

  daftar.forEach((p, i) => {
    p.peringkat = i + 1
  })

  return { daftar, komponen, provinsi }
}

export function matriksPrioritas(rows, jenjang = 'SMA', tahunAwal = 2019) {
  const provinsi = daftarProvinsi(rows)
  const data = provinsi
    .map((p) => {
      const seri = seriTahunan(rows, { indikator: 'aps', kode: p.kode, jenjang })
      if (!seri.length) return null
      const awal = seri.find((d) => d.tahun >= tahunAwal) || seri[0]
      const akhir = seri[seri.length - 1]
      return {
        ...p,
        level: akhir.nilai,
        tahunLevel: akhir.tahun,
        tren: akhir.nilai - awal.nilai,
        tahunAwal: awal.tahun,
        tahunAkhir: akhir.tahun,
      }
    })
    .filter(Boolean)

  const medianLevel = median(data.map((d) => d.level))
  const medianTren = median(data.map((d) => d.tren))

  return {
    data: data.map((d) => {
      let kategori = 'Pantau'
      if (d.level <= medianLevel && d.tren <= 0) kategori = 'Mendesak'
      else if (d.level <= medianLevel && d.tren > 0) kategori = 'Membaik'
      else if (d.level > medianLevel && d.tren <= 0) kategori = 'Pantau'
      else kategori = 'Berhasil'
      return { ...d, kategori }
    }),
    medianLevel,
    medianTren,
  }
}

export function labelKategori(kategori) {
  const map = {
    Mendesak: 'Perlu intervensi mendesak',
    Membaik: 'Tertinggal tetapi membaik',
    Pantau: 'Pantau, tren melemah',
    Berhasil: 'Berhasil, pertahankan',
  }
  return map[kategori] || kategori
}
