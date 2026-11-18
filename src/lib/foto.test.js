// @vitest-environment node
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SEMUA_FOTO_JENJANG, fotoJenjang } from './foto'

describe('Foto hero per jenjang', () => {
  it('setiap ukuran di srcset ada berkasnya', () => {
    for (const [k, f] of Object.entries(SEMUA_FOTO_JENJANG)) {
      expect(existsSync(`public${f.src}`), k).toBe(true)
      for (const bagian of f.srcSet.split(', ')) {
        const [jalur, lebar] = bagian.split(' ')
        expect(lebar, k).toMatch(/^\d+w$/)
        expect(existsSync(`public${jalur}`), jalur).toBe(true)
      }
    }
  })

  it('berlisensi bebas dengan kredit lengkap', () => {
    for (const [k, f] of Object.entries(SEMUA_FOTO_JENJANG)) {
      expect(f.lisensi, k).toMatch(/^CC BY(-SA)? [0-9.]+$/)
      expect(f.artis.length, k).toBeGreaterThan(1)
      expect(f.sumber, k).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      expect(f.lisensiUrl, k).toMatch(/^https:\/\/creativecommons\.org\/licenses\//)
    }
  })

  it('jenjang tak dikenal jatuh ke foto umum', () => {
    expect(fotoJenjang('PAUD')).toBe(SEMUA_FOTO_JENJANG.Umum)
  })
})
