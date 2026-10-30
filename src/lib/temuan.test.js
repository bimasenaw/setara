import { describe, expect, it } from 'vitest'
import { kalimatDimensi, kalimatRingkasanUtama, temuanTigaDimensi } from './temuan'

const data = [
  { dimensi: 'wilayah', kelompok: 'Perkotaan', jenjang: 'SD', tahun: 2023, nilai: 0.32 },
  { dimensi: 'wilayah', kelompok: 'Perdesaan', jenjang: 'SD', tahun: 2023, nilai: 1.12 },
  { dimensi: 'wilayah', kelompok: 'Total', jenjang: 'SD', tahun: 2023, nilai: 0.67 },
  { dimensi: 'wilayah', kelompok: 'Perkotaan', jenjang: 'SMP', tahun: 2023, nilai: 5.82 },
  { dimensi: 'wilayah', kelompok: 'Perdesaan', jenjang: 'SMP', tahun: 2023, nilai: 8.45 },
  { dimensi: 'wilayah', kelompok: 'Total', jenjang: 'SMP', tahun: 2023, nilai: 6.93 },
  { dimensi: 'wilayah', kelompok: 'Perkotaan', jenjang: 'SMA', tahun: 2023, nilai: 18.5 },
  { dimensi: 'wilayah', kelompok: 'Perdesaan', jenjang: 'SMA', tahun: 2023, nilai: 26.06 },
  { dimensi: 'wilayah', kelompok: 'Total', jenjang: 'SMA', tahun: 2023, nilai: 21.61 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 1', jenjang: 'SD', tahun: 2023, nilai: 1.15 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 5', jenjang: 'SD', tahun: 2023, nilai: 0.38 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 1', jenjang: 'SMP', tahun: 2023, nilai: 10.11 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 5', jenjang: 'SMP', tahun: 2023, nilai: 5.05 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 1', jenjang: 'SMA', tahun: 2023, nilai: 30.66 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 5', jenjang: 'SMA', tahun: 2023, nilai: 14.67 },
  { dimensi: 'gender', kelompok: 'Laki-laki', jenjang: 'SD', tahun: 2023, nilai: 0.68 },
  { dimensi: 'gender', kelompok: 'Perempuan', jenjang: 'SD', tahun: 2023, nilai: 0.66 },
  { dimensi: 'gender', kelompok: 'Laki-laki', jenjang: 'SMP', tahun: 2023, nilai: 7.97 },
  { dimensi: 'gender', kelompok: 'Perempuan', jenjang: 'SMP', tahun: 2023, nilai: 5.86 },
  { dimensi: 'gender', kelompok: 'Laki-laki', jenjang: 'SMA', tahun: 2023, nilai: 23.78 },
  { dimensi: 'gender', kelompok: 'Perempuan', jenjang: 'SMA', tahun: 2023, nilai: 19.34 },
]

describe('temuan', () => {
  it('membuat kalimat dengan satuan poin, bukan persen', () => {
    const kalimat = kalimatDimensi(data, 'wilayah', 'SMA', 2023)
    expect(kalimat).toContain('poin')
    expect(kalimat).not.toContain('7,6% lebih tinggi')
  })

  it('membuat kalimat ringkasan ekonomi', () => {
    expect(kalimatRingkasanUtama(data, 'SMA', 2023)).toContain('keluarga termiskin')
  })

  it('menghasilkan tiga temuan dimensi', () => {
    const temuan = temuanTigaDimensi(data, 2023)
    expect(temuan).toHaveLength(3)
    expect(temuan.map((t) => t.dimensi)).toEqual(['wilayah', 'ekonomi', 'gender'])
    expect(temuan.every((t) => t.kalimat)).toBe(true)
  })
})
