import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ALUR, alurDariPath, tautanAlur } from '../content/alur'
import { arahNavigasi, geserKe, useKlikGeser } from './geserHalaman'
import PanduanAlur from './PanduanAlur'
import { sudahDilihat, tandaiDilihat } from './statusPanduan'

// Penanda alur 1–4 yang melayang di bawah layar.
// Langkah aktif mengikuti halaman yang dibuka dari navbar; saat digulir ke bawah ia mengecil.
// Kunjungan pertama memunculkan kartu panduan berisi tur 1–4; tombol "?" membukanya lagi.
export default function AlurCerita() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const klikGeser = useKlikGeser()
  const idPanduan = useId()
  const tombolRef = useRef(null)
  const [ringkas, setRingkas] = useState(false)
  const [panduan, setPanduan] = useState({ buka: false, otomatis: false, mode: 'ikhtisar' })
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
    const t = setTimeout(
      () => setPanduan((p) => (p.buka ? p : { buka: true, otomatis: true, mode: 'ikhtisar' })),
      600,
    )
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

  // Tur: kartu tetap terbuka, halaman di belakangnya bergeser ke langkah yang dijelaskan.
  const pergi = useCallback(
    (to) => geserKe(() => navigate(to), arahNavigasi(pathname, to)),
    [navigate, pathname],
  )

  const mulaiTur = useCallback(() => {
    setPanduan((p) => ({ ...p, mode: 'tur' }))
    if (sekarang && sekarang.langkah !== 1) pergi(tautanAlur(ALUR[0].to, search))
  }, [pergi, search, sekarang])

  const lanjutTur = useCallback(() => {
    const berikutnya = sekarang && ALUR[sekarang.langkah]
    if (berikutnya) pergi(tautanAlur(berikutnya.to, search))
  }, [pergi, search, sekarang])

  const kembaliTur = useCallback(() => {
    if (!sekarang || sekarang.langkah === 1) {
      setPanduan((p) => ({ ...p, mode: 'ikhtisar' }))
      return
    }
    pergi(tautanAlur(ALUR[sekarang.langkah - 2].to, search))
  }, [pergi, search, sekarang])

  if (!sekarang) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center pb-[calc(1rem+env(safe-area-inset-bottom))] print:hidden">
      <PanduanAlur
        id={idPanduan}
        buka={panduan.buka}
        otomatis={panduan.otomatis}
        mode={panduan.mode}
        sekarang={sekarang}
        onTutup={tutup}
        onMulaiTur={mulaiTur}
        onLanjut={lanjutTur}
        onKembali={kembaliTur}
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
            onClick={() =>
              panduan.buka ? tutup() : setPanduan({ buka: true, otomatis: false, mode: 'ikhtisar' })
            }
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
        </div>
      </nav>
    </div>
  )
}
