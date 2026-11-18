// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { hitungPrioritas } from '../lib/prioritas'
import { kalimatKepekaan, ujiKepekaan } from './kepekaan'

const prioritas = hitungPrioritas(JSON.parse(readFileSync('public/data/indikator.json', 'utf8')))

describe('Uji kepekaan indeks prioritas', () => {
  it('pada data sekarang tiga teratas sama di keenam percobaan', () => {
    const uji = ujiKepekaan(prioritas.daftar, prioritas.komponen)
    expect(uji.hasil).toHaveLength(6)
    expect(uji.stabil).toBe(3)
    expect(uji.asli.slice(0, 3).map((p) => p.provinsi)).toEqual([
      'Papua Pegunungan',
      'Papua Tengah',
      'Papua Selatan',
    ])
    expect(kalimatKepekaan(uji.stabil, 6)).toBe(
      'Tiga teratas tetap sama walau salah satu dari 6 indikator dihapus.',
    )
  })

  it('kalimatnya ikut berubah bila data tidak stabil', () => {
    const komponen = [{ id: 'a' }, { id: 'b' }]
    const daftar = [
      { kode: '1', provinsi: 'A', komponen: { a: { skor: 100 }, b: { skor: 0 } } },
      { kode: '2', provinsi: 'B', komponen: { a: { skor: 0 }, b: { skor: 90 } } },
    ]
    const uji = ujiKepekaan(daftar, komponen, 2)
    expect(uji.stabil).toBe(0)
    expect(kalimatKepekaan(uji.stabil, 2)).toBeNull()
  })
})

describe('Angka di halaman Metode cocok dengan data', () => {
  const metode = readFileSync('src/pages/Metode.jsx', 'utf8')

  it('contoh Papua Pegunungan', () => {
    const p = prioritas.daftar.find((x) => x.kode === '9700')
    const tampil = (n) => {
      const r = Math.round(n * 10) / 10
      return Number.isInteger(r) ? String(r) : String(r).replace('.', ',')
    }
    const bagian = prioritas.komponen.map((k) => tampil(p.komponen[k.id].skor)).join(' + ')
    expect(metode).toContain(`(${bagian}) ÷ 6 = ${tampil(p.skor)}`)
  })

  it('jumlah pasangan nilai kembar dan pengaruh maksimumnya', () => {
    let pasang = 0
    for (const k of prioritas.komponen) {
      const hit = {}
      for (const v of k.values) hit[v.nilai] = (hit[v.nilai] || 0) + 1
      pasang += Object.values(hit).filter((n) => n > 1).length
    }
    expect(metode).toContain(`Ada ${pasang} pasang provinsi`)
    // Satu langkah persentil = 100 / (n − 1); dibagi enam indikator.
    expect(100 / 37 / 6).toBeCloseTo(0.45, 2)
  })
})
