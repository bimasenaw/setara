import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Ringkasan from './pages/Ringkasan'
import Kesenjangan from './pages/Kesenjangan'
import Provinsi from './pages/Provinsi'

export default function App() {
  return (
    <div className="min-h-screen bg-kertas text-tinta">
      <Nav />
      <Routes>
        <Route path="/" element={<Ringkasan />} />
        <Route path="/kesenjangan" element={<Kesenjangan />} />
        <Route path="/provinsi" element={<Provinsi />} />
        <Route path="*" element={<Ringkasan />} />
      </Routes>
      <Footer />
    </div>
  )
}
