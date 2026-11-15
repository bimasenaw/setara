import { describe, expect, it } from 'vitest'
import { skalaRapi } from './skala'

describe('skalaRapi', () => {
  it.each([
    [26.06, [0, 10, 20, 30]],
    [15, [0, 5, 10, 15]],
    [79, [0, 20, 40, 60, 80]],
    [30.66, [0, 10, 20, 30, 40]],
    [99.86, [0, 20, 40, 60, 80, 100]],
    [30, [0, 10, 20, 30]],
    [7.56, [0, 2, 4, 6, 8]],
    [1.15, [0, 0.25, 0.5, 0.75, 1, 1.25]],
  ])('maks %s → %j', (maks, ticks) => {
    const s = skalaRapi(maks)
    expect(s.ticks).toEqual(ticks)
    expect(s.maks).toBe(ticks[ticks.length - 1])
    expect(s.maks).toBeGreaterThanOrEqual(maks)
  })

  it('jumlah angka sumbu selalu 4–6, kecuali kasus kosong', () => {
    for (let m = 0.3; m < 500; m *= 1.37) {
      const n = skalaRapi(m).ticks.length
      expect(n).toBeGreaterThanOrEqual(3)
      expect(n).toBeLessThanOrEqual(6)
    }
  })

  it('nol, negatif, atau tidak terhingga memakai skala bawaan', () => {
    expect(skalaRapi(0).ticks).toEqual([0, 5, 10])
    expect(skalaRapi(-3).ticks).toEqual([0, 5, 10])
    expect(skalaRapi(Infinity).ticks).toEqual([0, 5, 10])
  })

  it('desimal mengikuti langkah', () => {
    expect(skalaRapi(1.15).desimal).toBe(2)
    expect(skalaRapi(26).desimal).toBe(0)
  })
})
