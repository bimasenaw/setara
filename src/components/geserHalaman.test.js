import { afterEach, describe, expect, it, vi } from 'vitest'
import { arahNavigasi, geserKe, halamanSiap, urutanHalaman } from './geserHalaman'

describe('arahNavigasi', () => {
  it('mengikuti urutan menu navbar', () => {
    expect(urutanHalaman('/')).toBe(0)
    expect(urutanHalaman('/provinsi/9400')).toBe(2)
    expect(arahNavigasi('/', '/kesenjangan')).toBe('maju')
    expect(arahNavigasi('/rekomendasi', '/provinsi?tahun=2023')).toBe('mundur')
    expect(arahNavigasi('/metode', '/')).toBe('mundur')
  })

  it('masuk ke profil provinsi maju, kembali ke daftar mundur, halaman sama tanpa geser', () => {
    expect(arahNavigasi('/provinsi', '/provinsi/9400')).toBe('maju')
    expect(arahNavigasi('/provinsi/9400', '/provinsi')).toBe('mundur')
    expect(arahNavigasi('/kesenjangan', '/kesenjangan?jenjang=SMP')).toBeNull()
  })
})

describe('geserKe', () => {
  afterEach(() => {
    delete document.startViewTransition
    delete document.documentElement.dataset.arah
  })

  it('tanpa dukungan browser langsung berpindah', () => {
    const navigasi = vi.fn()
    geserKe(navigasi, 'maju')
    expect(navigasi).toHaveBeenCalledOnce()
    expect(document.documentElement.dataset.arah).toBeUndefined()
  })

  it('menandai arah dan menunggu halaman baru siap', async () => {
    let selesai
    let callback
    document.startViewTransition = vi.fn((cb) => {
      callback = cb()
      return { ready: Promise.resolve(), finished: new Promise((r) => (selesai = r)) }
    })
    const navigasi = vi.fn()
    geserKe(navigasi, 'mundur')
    expect(navigasi).toHaveBeenCalledOnce()
    expect(document.documentElement.dataset.arah).toBe('mundur')

    halamanSiap()
    await expect(callback).resolves.toBeUndefined()
    selesai()
    await vi.waitFor(() => expect(document.documentElement.dataset.arah).toBeUndefined())
  })
})
