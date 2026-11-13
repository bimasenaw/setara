import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import FontSizeControl from './FontSizeControl'
import { useKlikGeser } from './geserHalaman'

const LINKS = [
  { to: '/', label: 'Ringkasan', end: true },
  { to: '/kesenjangan', label: 'Kesenjangan' },
  { to: '/provinsi', label: 'Provinsi' },
  { to: '/rekomendasi', label: 'Rekomendasi' },
  { to: '/metode', label: 'Metode' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const klikGeser = useKlikGeser()
  const [tergulir, setTergulir] = useState(false)

  // Garis bawah header hanya muncul saat konten mulai lewat di bawahnya.
  useEffect(() => {
    const cek = () => setTergulir(window.scrollY > 4)
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [])

  // Di HP, item aktif digulir ke area yang terlihat.
  useEffect(() => {
    const aktif = navRef.current?.querySelector('[aria-current="page"]')
    aktif?.scrollIntoView?.({ block: 'nearest', inline: 'center' })
  }, [pathname])

  return (
    <header
      className={`header-kaca vt-kepala sticky top-0 z-30 border-b transition-colors duration-150 ${
        tergulir ? 'border-garis' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center gap-x-6 px-4 md:flex-nowrap">
        <NavLink
          to="/"
          onClick={klikGeser('/')}
          className="tekan flex min-h-12 items-center font-serif text-[1.25rem] font-semibold leading-none tracking-[-0.01em] text-tinta"
        >
          SETARA
        </NavLink>
        <nav
          ref={navRef}
          aria-label="Navigasi utama"
          className="tanpa-scrollbar tepi-pudar -mx-4 flex w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto px-3 md:mx-0 md:w-auto md:px-0 md:[mask-image:none]"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={klikGeser(l.to)}
              className={({ isActive }) =>
                `tekan inline-flex min-h-11 shrink-0 items-center rounded-md px-3 text-base leading-snug ${
                  isActive
                    ? 'font-semibold text-tinta underline decoration-2 underline-offset-[6px]'
                    : 'text-tinta-redup hover:text-tinta'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto hidden md:block">
          <FontSizeControl />
        </div>
      </div>
    </header>
  )
}
