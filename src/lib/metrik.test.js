import { describe, expect, it } from 'vitest'
import { cariNilai, nasional, perbandingan, rasio, selisih } from './metrik'

const data = [
  { dimensi: 'wilayah', kelompok: 'Perkotaan', jenjang: 'SMA', tahun: 2023, nilai: 18.5 },
  { dimensi: 'wilayah', kelompok: 'Perdesaan', jenjang: 'SMA', tahun: 2023, nilai: 26.06 },
  { dimensi: 'wilayah', kelompok: 'Total', jenjang: 'SMA', tahun: 2023, nilai: 21.61 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 1', jenjang: 'SMA', tahun: 2023, nilai: 30.66 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 5', jenjang: 'SMA', tahun: 2023, nilai: 14.67 },
  { dimensi: 'gender', kelompok: 'Laki-laki', jenjang: 'SMA', tahun: 2023, nilai: 23.78 },
  { dimensi: 'gender', kelompok: 'Perempuan', jenjang: 'SMA', tahun: 2023, nilai: 19.34 },
]

describe('metrik', () => {
  it('mencari nilai dan mengembalikan null jika tidak ada', () => {
    expect(cariNilai(data, 'wilayah', 'Perdesaan', 'SMA', 2023)).toBe(26.06)
    expect(cariNilai(data, 'wilayah', 'Perdesaan', 'SMA', 2022)).toBeNull()
  })

  it('menghitung selisih absolut dan rasio', () => {
    expect(selisih(30.66, 14.67)).toBeCloseTo(15.99, 2)
    expect(rasio(30.66, 14.67)).toBeCloseTo(2.09, 2)
    expect(selisih(null, 1)).toBeNull()
    expect(rasio(1, 0)).toBeNull()
  })

  it('mengambil nilai nasional dari kelompok Total', () => {
    expect(nasional(data, 'SMA', 2023)).toBe(21.61)
  })

  it('membandingkan pasangan dimensi', () => {
    const p = perbandingan(data, 'ekonomi', 'SMA', 2023)
    expect(p.pembanding).toBe(14.67)
    expect(p.tertinggal).toBe(30.66)
    expect(p.selisih).toBeCloseTo(15.99, 2)
  })
})
