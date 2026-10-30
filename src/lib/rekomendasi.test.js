import { describe, expect, it } from 'vitest'
import { rekomendasiProvinsi } from './rekomendasi'

const rows = [
  { indikator: 'apk_paud', kode: '1100', provinsi: 'Aceh', wilayah: 'provinsi', tahun: 2025, kelompok: 'Total', nilai: 20 },
  { indikator: 'apk_paud', kode: '9999', provinsi: 'Indonesia', wilayah: 'nasional', tahun: 2025, kelompok: 'Total', nilai: 40 },
  { indikator: 'kemiskinan', kode: '1100', provinsi: 'Aceh', wilayah: 'provinsi', tahun: 2025, kelompok: 'Jumlah', nilai: 15 },
  { indikator: 'kemiskinan', kode: '9999', provinsi: 'Indonesia', wilayah: 'nasional', tahun: 2025, kelompok: 'Jumlah', nilai: 9 },
  { indikator: 'aps', kode: '1100', provinsi: 'Aceh', wilayah: 'provinsi', tahun: 2025, jenjang: 'SMA', nilai: 60 },
  { indikator: 'aps', kode: '9999', provinsi: 'Indonesia', wilayah: 'nasional', tahun: 2025, jenjang: 'SMA', nilai: 75 },
  { indikator: 'lama_sekolah', kode: '1100', provinsi: 'Aceh', wilayah: 'provinsi', tahun: 2025, kelompok: '15+', nilai: 6 },
  { indikator: 'lama_sekolah', kode: '9999', provinsi: 'Indonesia', wilayah: 'nasional', tahun: 2025, kelompok: '15+', nilai: 9 },
  { indikator: 'rasio_apm_gender', kode: '1100', provinsi: 'Aceh', wilayah: 'provinsi', tahun: 2025, jenjang: 'SMA', nilai: 90 },
]

describe('rekomendasi', () => {
  it('mengeluarkan rekomendasi kontekstual untuk provinsi tertinggal', () => {
    const hasil = rekomendasiProvinsi(rows, '1100')
    expect(hasil.length).toBeGreaterThan(1)
    expect(hasil.some((r) => r.judul.includes('PAUD'))).toBe(true)
    expect(hasil.some((r) => r.judul.includes('bantuan tunai'))).toBe(true)
    expect(hasil.every((r) => r.sumber.length > 0)).toBe(true)
  })

  it('memberi rekomendasi pemantauan jika tidak ada celah besar', () => {
    const aman = [
      ...rows.map((r) => (r.kode === '1100' ? { ...r, nilai: r.indikator === 'kemiskinan' ? 8 : r.indikator === 'rasio_apm_gender' ? 100 : 90 } : r)),
    ]
    const hasil = rekomendasiProvinsi(aman, '1100')
    expect(hasil.length).toBeGreaterThan(0)
  })
})
