import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import AlurCerita from './components/AlurCerita'
import { Muat } from './components/StatusBox'
import { halamanSiap } from './components/geserHalaman'
import { alurDariPath } from './content/alur'

const MUAT_HALAMAN = [
  () => import('./pages/Ringkasan'),
  () => import('./pages/Kesenjangan'),
  () => import('./pages/Provinsi'),
  () => import('./pages/ProvinsiDetail'),
  () => import('./pages/Rekomendasi'),
  () => import('./pages/Metode'),
  () => import('./pages/BacaRujukan'),
  () => import('./pages/TidakDitemukan'),
]

const [Ringkasan, Kesenjangan, Provinsi, ProvinsiDetail, Rekomendasi, Metode, BacaRujukan, TidakDitemukan] =
  MUAT_HALAMAN.map((f) => lazy(f))

function Fallback() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <Muat />
    </main>
  )
}

// Berjalan setelah halaman baru benar-benar tampil: gulir kembali ke atas saat
// berpindah halaman (bukan saat filter berubah), lalu beri tanda transisi boleh dimulai.
function PenandaHalaman() {
  const { pathname, hash, key } = useLocation()
  const sebelumnya = useRef(pathname)

  useLayoutEffect(() => {
    if (sebelumnya.current !== pathname && !hash) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    sebelumnya.current = pathname
    halamanSiap()
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      el?.scrollIntoView?.({ block: 'start' })
    }
  }, [pathname, hash, key])

  return null
}

// Kode semua halaman dimuat diam-diam setelah halaman pertama tampil,
// supaya perpindahan halaman tidak tersendat oleh "memuat…".
function useMuatDiLatar() {
  useEffect(() => {
    if (import.meta.env.MODE === 'test') return
    // Tunggu interaksi pertama (atau paling lambat 6 detik) supaya tidak bersaing dengan tampilan pertama.
    const PEMICU = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    let selesai = false
    const muat = () => {
      if (selesai) return
      selesai = true
      lepas()
      MUAT_HALAMAN.forEach((f) => f().catch(() => {}))
    }
    const lepas = () => PEMICU.forEach((e) => window.removeEventListener(e, muat))
    PEMICU.forEach((e) => window.addEventListener(e, muat, { passive: true, once: true }))
    const id = setTimeout(muat, 6000)
    return () => {
      clearTimeout(id)
      lepas()
    }
  }, [])
}

export default function App() {
  const { pathname } = useLocation()
  const adaAlur = Boolean(alurDariPath(pathname))
  useMuatDiLatar()

  return (
    <div className="flex min-h-dvh flex-col bg-kertas text-tinta">
      <Nav />
      {/* Isi minimal setinggi layar: footer tidak muncul lalu terdorong saat data dimuat. */}
      <div className="min-h-dvh">
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Ringkasan />} />
            <Route path="/kesenjangan" element={<Kesenjangan />} />
            <Route path="/provinsi" element={<Provinsi />} />
            <Route path="/provinsi/:kode" element={<ProvinsiDetail />} />
            <Route path="/rekomendasi" element={<Rekomendasi />} />
            <Route path="/metode" element={<Metode />} />
            <Route path="/rujukan/:id" element={<BacaRujukan />} />
            <Route path="*" element={<TidakDitemukan />} />
          </Routes>
          <PenandaHalaman />
        </Suspense>
      </div>
      {/* Jarak minimal ke footer; sisa ruang di halaman pendek mendorong footer ke bawah layar. */}
      <div aria-hidden="true" className="h-16 shrink-0" />
      <Footer ruangAlur={adaAlur} />
      <AlurCerita />
    </div>
  )
}
