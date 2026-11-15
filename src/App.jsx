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
]

const [Ringkasan, Kesenjangan, Provinsi, ProvinsiDetail, Rekomendasi, Metode, BacaRujukan] = MUAT_HALAMAN.map((f) =>
  lazy(f),
)

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
  }, [pathname, hash, key])

  return null
}

// Kode semua halaman dimuat diam-diam setelah halaman pertama tampil,
// supaya perpindahan halaman tidak tersendat oleh "memuat…".
function useMuatDiLatar() {
  useEffect(() => {
    if (import.meta.env.MODE === 'test') return
    const muat = () => MUAT_HALAMAN.forEach((f) => f().catch(() => {}))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(muat, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(muat, 1200)
    return () => clearTimeout(id)
  }, [])
}

export default function App() {
  const { pathname } = useLocation()
  const adaAlur = Boolean(alurDariPath(pathname))
  useMuatDiLatar()

  return (
    <div className="min-h-screen bg-kertas text-tinta">
      <Nav />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Ringkasan />} />
          <Route path="/kesenjangan" element={<Kesenjangan />} />
          <Route path="/provinsi" element={<Provinsi />} />
          <Route path="/provinsi/:kode" element={<ProvinsiDetail />} />
          <Route path="/rekomendasi" element={<Rekomendasi />} />
          <Route path="/metode" element={<Metode />} />
          <Route path="/rujukan/:id" element={<BacaRujukan />} />
          <Route path="*" element={<Ringkasan />} />
        </Routes>
        <PenandaHalaman />
      </Suspense>
      <Footer ruangAlur={adaAlur} />
      <AlurCerita />
    </div>
  )
}
