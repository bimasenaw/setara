import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ALUR, alurDariPath, tautanAlur } from '../content/alur'
import { arahNavigasi, geserKe, useKlikGeser } from './geserHalaman'
import PanduanAlur from './PanduanAlur'
import { sudahDilihat, tandaiDilihat } from './statusPanduan'

// Penanda alur 1–4 yang melayang di bawah layar.
// Langkah aktif mengikuti halaman yang dibuka dari navbar; saat digulir ke bawah ia mengecil.
// Kunjungan pertama memunculkan kartu panduan; tombol "?" membukanya lagi.
export default function AlurCerita() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const klikGeser = useKlikGeser()
  const idPanduan = useId()
  const tombolRef = useRef(null)
  const [ringkas, setRingkas] = useState(false)
  const [panduan, setPanduan] = useState({ buka: false, otomatis: false })
  const sekarang = alurDariPath(pathname)
  const adaLangkah = Boolean(sekarang)
  const paksa = new URLSearchParams(search).get('panduan') === '1'

  useEffect(() => {
    const cek = () => setRingkas(window.scrollY > 48)
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [])

  // Kunjungan pertama (atau ?panduan=1): muncul setelah halaman sempat terlihat.
  useEffect(() => {
    if (!adaLangkah || (!paksa && sudahDilihat())) return
    const t = setTimeout(() => setPanduan({ buka: true, otomatis: true }), 600)
    return () => clearTimeout(t)
  }, [adaLangkah, paksa])

  const tutup = useCallback(() => {
    tandaiDilihat()
    setPanduan((p) => ({ ...p, buka: false }))
    const params = new URLSearchParams(search)
    if (params.has('panduan')) {
      params.delete('panduan')
      const q = params.toString()
      navigate({ pathname, search: q ? `?${q}` : '' }, { replace: true })
    }
  }, [navigate, pathname, search])

  const mulai = useCallback(() => {
    tutup()
    const to = tautanAlur('/', search)
    geserKe(() => navigate(to), arahNavigasi(pathname, to))
  }, [tutup, navigate, pathname, search])

  if (!sekarang) return null

  // Tombol Lanjut: ke langkah berikutnya; di langkah terakhir tidak ditampilkan.
  const berikutnya = ALUR.find((a) => a.langkah === sekarang.langkah + 1) || null
  const keBerikutnya = berikutnya ? tautanAlur(berikutnya.to, search) : null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center pb-[calc(1rem+env(safe-area-inset-bottom))] print:hidden">
      <PanduanAlur
        id={idPanduan}
        buka={panduan.buka}
        otomatis={panduan.otomatis}
        sekarang={sekarang}
        onTutup={tutup}
        onMulai={mulai}
        tombolRef={tombolRef}
      />
      <nav
        aria-label="Alur cerita"
        className={`header-kaca vt-alur pointer-events-auto origin-bottom rounded-full border border-garis p-1 shadow-[0_4px_16px_rgb(24_33_44/0.12)] transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-within:scale-100 hover:scale-100 ${
          ringkas && !panduan.buka ? 'scale-[0.8]' : 'scale-100'
        }`}
      >
        <div className="flex items-center">
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
          <span aria-hidden="true" className="mx-0.5 h-6 w-px bg-garis" />
          <button
            ref={tombolRef}
            type="button"
            aria-label="Apa arti angka ini?"
            aria-expanded={panduan.buka}
            aria-controls={panduan.buka ? idPanduan : undefined}
            title="Apa arti angka ini?"
            onClick={() => (panduan.buka ? tutup() : setPanduan({ buka: true, otomatis: false }))}
            className="group flex h-11 w-11 items-center justify-center rounded-full"
          >
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-dashed text-[0.9375rem] font-semibold leading-none transition-colors duration-150 ${
                panduan.buka
                  ? 'border-tinta bg-kertas text-tinta'
                  : 'border-tinta-redup text-tinta-redup group-hover:border-tinta group-hover:text-tinta'
              }`}
            >
              ?
            </span>
          </button>
          {berikutnya && (
            <Link
              to={keBerikutnya}
              onClick={klikGeser(keBerikutnya)}
              aria-label={`Lanjut ke langkah ${berikutnya.langkah}: ${berikutnya.pendek}`}
              title={`Lanjut: ${berikutnya.pendek}`}
              className="tekan group flex h-11 items-center rounded-full pl-0.5 pr-0.5"
            >
              <span
                aria-hidden="true"
                className="flex h-8 items-center gap-1 whitespace-nowrap rounded-full bg-tinta pl-3.5 pr-2.5 text-[0.9375rem] font-semibold leading-none text-putih"
              >
                Lanjut
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 3.5L10.5 8L6 12.5" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
