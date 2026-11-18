import { describe, expect, it } from 'vitest'
import { toCsv } from './ekspor'

const baris = (csv) => csv.split('\r\n')

describe('ekspor CSV untuk Excel Indonesia', () => {
  it('memakai titik koma sebagai pemisah dan mengutip teks yang memuat titik koma atau kutip', () => {
    const csv = toCsv(
      [
        { provinsi: 'Aceh', nilai: 10.5 },
        { provinsi: 'Papua; Barat', nilai: 20 },
        { provinsi: 'Kata "kutip", koma', nilai: 1 },
      ],
      [
        { key: 'provinsi', label: 'Provinsi' },
        { key: 'nilai', label: 'Nilai' },
      ],
    )
    expect(baris(csv)[0]).toBe('Provinsi;Nilai')
    expect(baris(csv)[1]).toBe('Aceh;10,5')
    expect(csv).toContain('"Papua; Barat"')
    expect(csv).toContain('"Kata ""kutip"", koma";1')
  })

  it('angka memakai desimal koma tanpa ekor floating point', () => {
    const csv = toCsv(
      [{ a: 26.06 - 18.5, b: 2023, c: -0.4 }],
      [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
        { key: 'c', label: 'C' },
      ],
    )
    expect(baris(csv)[1]).toBe('7,56;2023;-0,4')
  })

  it('teks angka bersatuan menjadi angka, satuannya pindah ke judul kolom', () => {
    const csv = toCsv(
      [
        { s: '+7,56 poin', n: '26,10', p: '62,98%' },
        { s: '−2,40 poin', n: 'Data belum tersedia', p: '3,10%' },
      ],
      [
        { key: 's', label: 'Selisih' },
        { key: 'n', label: 'Nilai (%)' },
        { key: 'p', label: 'APK (%)' },
      ],
    )
    expect(baris(csv)[0]).toBe('Selisih (poin);Nilai (%);APK (%)')
    expect(baris(csv)[1]).toBe('7,56;26,10;62,98')
    expect(baris(csv)[2]).toBe('-2,40;Data belum tersedia;3,10')
  })

  it('angka ribuan bertitik tidak dibaca sebagai desimal', () => {
    const csv = toCsv([{ j: '424.000' }], [{ key: 'j', label: 'Jumlah' }])
    expect(baris(csv)[1]).toBe('424.000')
  })
})
