import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Muat } from './components/StatusBox'

const Ringkasan = lazy(() => import('./pages/Ringkasan'))
const Kesenjangan = lazy(() => import('./pages/Kesenjangan'))
const Provinsi = lazy(() => import('./pages/Provinsi'))
const ProvinsiDetail = lazy(() => import('./pages/ProvinsiDetail'))
const Metode = lazy(() => import('./pages/Metode'))

function Fallback() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <Muat />
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-kertas text-tinta">
      <Nav />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Ringkasan />} />
          <Route path="/kesenjangan" element={<Kesenjangan />} />
          <Route path="/provinsi" element={<Provinsi />} />
          <Route path="/provinsi/:kode" element={<ProvinsiDetail />} />
          <Route path="/metode" element={<Metode />} />
          <Route path="*" element={<Ringkasan />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}
