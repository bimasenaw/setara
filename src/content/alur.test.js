import { describe, expect, it } from 'vitest'
import { ALUR, MOTTO } from './alur'

const kata = (s) => s.trim().split(/\s+/).length

describe('Teks alur cerita', () => {
  it('penjelasan tur cukup satu kalimat pendek per langkah', () => {
    for (const a of ALUR) {
      expect(kata(a.panduan), a.id).toBeLessThanOrEqual(18)
      expect(a.panduan.match(/\./g)?.length ?? 0, a.id).toBeLessThanOrEqual(2)
    }
  })

  it('motto tetap KUAT', () => {
    expect(MOTTO).toBe('KUAT')
  })
})
