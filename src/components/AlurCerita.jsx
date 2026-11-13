import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ALUR, alurDariPath, tautanAlur } from '../content/alur'
import { useKlikGeser } from './geserHalaman'

// Penanda alur 1–4 yang melayang di bawah layar.
// Langkah aktif mengikuti halaman yang dibuka dari navbar; saat digulir ke bawah ia mengecil.
export default function AlurCerita() {
  const { pathname, search } = useLocation()
  const klikGeser = useKlikGeser()
  const [ringkas, setRingkas] = useState(false)
  const sekarang = alurDariPath(pathname)

  useEffect(() => {
    const cek = () => setRingkas(window.scrollY > 48)
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [])

  if (!sekarang) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center pb-[calc(1rem+env(safe-area-inset-bottom))] print:hidden"
    >
      <nav
        aria-label="Alur cerita"
        className={`header-kaca vt-alur pointer-events-auto origin-bottom rounded-full border border-garis p-1 shadow-[0_4px_16px_rgb(24_33_44/0.12)] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-within:scale-100 hover:scale-100 ${
          ringkas ? 'scale-[0.8]' : 'scale-100'
        }`}
      >
        <ol className="flex items-center">
          {ALUR.map((a) => {
            const isAktif = a.id === sekarang.id
            const to = tautanAlur(a.to, search)
            return (
              <li key={a.id}>
                <Link
                  to={to}
                  onClick={klikGeser(to)}
                  aria-current={isAktif ? 'step' : undefined}
                  aria-label={`Langkah ${a.langkah} dari ${ALUR.length}: ${a.pendek}`}
                  title={a.pendek}
                  className="tekan group flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[0.9375rem] font-semibold leading-none transition-colors duration-150 ${
                      isAktif
                        ? 'bg-tinta text-putih'
                        : 'text-tinta-redup group-hover:bg-kertas group-hover:text-tinta'
                    }`}
                  >
                    {a.langkah}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
