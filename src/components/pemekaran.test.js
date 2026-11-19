import { describe, expect, it } from 'vitest'
import { catatanPemekaran, jenisPemekaran, tahunAwalUmum } from './pemekaran'

describe('pemekaran Papua', () => {
  it('provinsi baru diberi catatan rentang data yang pendek', () => {
    expect(jenisPemekaran('9700', 2024)).toBe('baru')
    expect(catatanPemekaran('Papua Pegunungan', '9700', 2024, 2025)).toContain('hanya mencakup 1 tahun')
  })

  it('provinsi induk hanya diberi catatan bila tahun awalnya sebelum data dipisah', () => {
    expect(jenisPemekaran('9400', 2019)).toBe('induk')
    expect(catatanPemekaran('Papua', '9400', 2019, 2025)).toContain('tidak sebanding')
    expect(jenisPemekaran('9400', 2024)).toBeNull()
  })

  it('provinsi lain tidak diberi catatan', () => {
    expect(catatanPemekaran('Aceh', '1100', 2019, 2025)).toBeNull()
  })

  it('tahun awal umum memakai nilai terbanyak, bukan baris pertama', () => {
    expect(tahunAwalUmum([{ tahunAwal: 2024 }, { tahunAwal: 2019 }, { tahunAwal: 2019 }])).toBe(2019)
  })
})
