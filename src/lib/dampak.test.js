import { describe, expect, it } from 'vitest'
import { dampakEkonomi, dampakGender, populasiUsiaNasional, populasiUsiaProvinsi } from './dampak'

const rows = [
  { indikator: 'populasi_umur_nasional', kelompok: '5-9', gender: 'Jumlah', tahun: 2025, nilai: 1000, wilayah: 'nasional' },
  { indikator: 'populasi_umur_nasional', kelompok: '10-14', gender: 'Jumlah', tahun: 2025, nilai: 2000, wilayah: 'nasional' },
  { indikator: 'populasi_umur_nasional', kelompok: '15-19', gender: 'Jumlah', tahun: 2025, nilai: 900, wilayah: 'nasional' },
  { indikator: 'populasi_umur_nasional', kelompok: '15-19', gender: 'Laki-Laki', tahun: 2025, nilai: 800, wilayah: 'nasional' },
  { indikator: 'populasi_umur_nasional', kelompok: '15-19', gender: 'Perempuan', tahun: 2025, nilai: 700, wilayah: 'nasional' },
]

const tidakSekolah = [
  { dimensi: 'ekonomi', kelompok: 'Kuintil 1', jenjang: 'SMA', tahun: 2023, nilai: 30.66 },
  { dimensi: 'ekonomi', kelompok: 'Kuintil 5', jenjang: 'SMA', tahun: 2023, nilai: 14.67 },
  { dimensi: 'gender', kelompok: 'Laki-laki', jenjang: 'SMA', tahun: 2023, nilai: 23.78 },
  { dimensi: 'gender', kelompok: 'Perempuan', jenjang: 'SMA', tahun: 2023, nilai: 19.34 },
]

describe('dampak', () => {
  it('menginterpolasi populasi usia sekolah dari kelompok lima tahunan', () => {
    // 7-12: 3/5 dari 5-9 + 3/5 dari 10-14
    expect(populasiUsiaNasional(rows, 7, 12)).toBeCloseTo(1800, 5)
  })

  it('menghitung estimasi dampak ekonomi', () => {
    const hasil = dampakEkonomi(tidakSekolah, rows, 'SMA', 2023)
    expect(hasil).not.toBeNull()
    // 16-18: 3/5 dari 15-19 = 540
    expect(hasil.estimasi).toBeCloseTo(540 * 0.2 * ((30.66 - 14.67) / 100), 4)
    expect(hasil.metode).toContain('20%')
  })

  it('menghitung estimasi dampak gender dengan populasi laki-laki', () => {
    const hasil = dampakGender(tidakSekolah, rows, 'SMA', 2023)
    expect(hasil).not.toBeNull()
    expect(hasil.kelompok).toBe('Laki-laki')
    // 16-18 laki-laki: 3/5 dari 800 = 480
    expect(hasil.estimasi).toBeCloseTo(480 * ((23.78 - 19.34) / 100), 4)
  })

  it('populasi provinsi: baris "Jumlah" SP2020 tidak ikut dihitung sebagai total', () => {
    const p = (kelompok, gender, nilai) => ({ indikator: 'populasi_umur', kode: '1100', tahun: 2020, kelompok, gender, nilai })
    const prov = [
      p('00-04', 'Laki-laki', 50),
      p('00-04', 'Perempuan', 50),
      p('05-09', 'Laki-laki', 50),
      p('05-09', 'Perempuan', 50),
      p('Jumlah', 'Laki-laki', 100),
      p('Jumlah', 'Perempuan', 100),
      { indikator: 'populasi_provinsi', kode: '1100', tahun: 2025, kelompok: 'Jumlah', nilai: 400 },
    ]
    // Total 2020 = 200 (bukan 400), jadi skala 2025 = 400 ÷ 200 = 2.
    // Usia 3-6: 2/5 dari 00-04 + 2/5 dari 05-09 = 40 + 40 = 80, dikali 2 = 160.
    expect(populasiUsiaProvinsi(prov, '1100', 3, 6)).toBeCloseTo(160, 5)
  })

  it('mengembalikan null jika data tidak lengkap', () => {
    expect(dampakEkonomi(tidakSekolah, [], 'SMA', 2023)).toBeNull()
  })
})
