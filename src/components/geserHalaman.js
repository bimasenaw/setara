import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Transisi geser antarhalaman memakai View Transitions API bawaan browser.
// Arah mengikuti urutan menu: ke kanan di navbar = halaman baru masuk dari kanan.

const URUTAN = ['/', '/kesenjangan', '/provinsi', '/rekomendasi', '/metode']

function jalur(to) {
  return String(to).split(/[?#]/)[0] || '/'
}

export function urutanHalaman(pathname) {
  const akar = '/' + (jalur(pathname).split('/').filter(Boolean)[0] || '')
  const i = URUTAN.indexOf(akar)
  return i === -1 ? 0 : i
}

function kedalaman(pathname) {
  return jalur(pathname).split('/').filter(Boolean).length
}

// 'maju', 'mundur', atau null bila tujuan sama dengan halaman sekarang.
export function arahNavigasi(dari, ke) {
  const a = urutanHalaman(dari)
  const b = urutanHalaman(ke)
  if (a !== b) return b > a ? 'maju' : 'mundur'
  const da = kedalaman(dari)
  const db = kedalaman(ke)
  if (da !== db) return db > da ? 'maju' : 'mundur'
  return null
}

let selesaikan = null
let token = 0

// Dipanggil setelah halaman baru selesai dirender, agar snapshot "sesudah" sudah lengkap.
export function halamanSiap() {
  const s = selesaikan
  selesaikan = null
  s?.()
}

export function geserKe(navigasi, arah) {
  const doc = typeof document === 'undefined' ? null : document
  if (!arah || !doc || typeof doc.startViewTransition !== 'function') {
    navigasi()
    return
  }

  // Transisi sebelumnya yang belum selesai langsung ditutup.
  halamanSiap()
  const root = doc.documentElement
  const milik = ++token
  root.dataset.arah = arah

  const vt = doc.startViewTransition(
    () =>
      new Promise((resolve) => {
        const batas = setTimeout(resolve, 1000)
        selesaikan = () => {
          clearTimeout(batas)
          resolve()
        }
        navigasi()
      }),
  )
  vt.ready?.catch(() => {})
  Promise.resolve(vt.finished)
    .catch(() => {})
    .finally(() => {
      if (token === milik) delete root.dataset.arah
    })
}

// Pengendali klik untuk tautan: klik biasa digeser, klik dengan tombol pengubah dibiarkan.
export function useKlikGeser() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (to) => (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const arah = arahNavigasi(pathname, to)
      if (!arah) return
      e.preventDefault()
      geserKe(() => navigate(to), arah)
    },
    [navigate, pathname],
  )
}
