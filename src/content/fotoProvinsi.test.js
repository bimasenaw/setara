// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FOTO_PROVINSI, fotoProvinsi } from './fotoProvinsi'

const indikator = JSON.parse(readFileSync('public/data/indikator.json', 'utf8'))
const baris = Array.isArray(indikator) ? indikator : indikator.rows || indikator.data || []
const kodeProvinsi = [...new Set(baris.map((r) => String(r.kode)).filter((k) => k && k !== '9999'))]

describe('Foto provinsi', () => {
  it('setiap provinsi punya foto, dan berkasnya ada', () => {
    expect(kodeProvinsi.length).toBe(38)
    for (const k of kodeProvinsi) {
      const f = fotoProvinsi(k)
      expect(f, k).toBeTruthy()
      expect(existsSync(`public${f.src}`), f.src).toBe(true)
      for (const bagian of f.srcSet.split(', ')) {
        const jalur = bagian.split(' ')[0]
        expect(existsSync(`public${jalur}`), jalur).toBe(true)
      }
    }
  })

  it('lisensinya bebas dipakai ulang dan kreditnya lengkap', () => {
    for (const [k, f] of Object.entries(FOTO_PROVINSI)) {
      expect(f.lisensi, k).toMatch(/^(CC0|Public domain|CC BY(-SA)? [0-9.]+)$/)
      expect(f.lisensi, k).not.toMatch(/NC|ND/)
      expect(f.artis.length, k).toBeGreaterThan(1)
      expect(f.sumber, k).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
      expect(f.alt.length, k).toBeGreaterThan(5)
    }
  })
})
