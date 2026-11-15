import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { bisaDitampilkan, potongSorot } from '../content/kutipan'
import { FOKUSABEL, bingkai, karet, kurvaLanjutan, proyeksi, ySekarang } from './gerak'

// Panel bukti: kutipan asli jurnal di balik satu rujukan.
// Desktop: popover yang tumbuh dari tombol rujukan. HP: lembar dari bawah yang bisa diusap.
// Tanpa latar gelap: panel informatif dan tidak menghalangi halaman.

const LEBAR_PANEL = 448 // 28rem
const JARAK = 8

function layarHP() {
  return typeof window !== 'undefined' && window.matchMedia?.('(max-width: 47.99rem)').matches
}

export default function PanelBukti({ id, buka, rujukan, sumber, kutipan, kunci, tombolRef, onTutup }) {
  const [fase, setFase] = useState(buka ? 'masuk' : 'tutup')
  const [bukaTerakhir, setBukaTerakhir] = useState(buka)
  const [sudahDiusap, setSudahDiusap] = useState(false)
  const [hp, setHp] = useState(layarHP)
  const [letak, setLetak] = useState(null)
  const panelRef = useRef(null)
  const judulRef = useRef(null)
  const seret = useRef(null)

  // buka/tutup dari induk → fase animasi. Membuka saat sedang menutup langsung berbalik.
  if (buka !== bukaTerakhir) {
    setBukaTerakhir(buka)
    if (buka) {
      setSudahDiusap(false)
      setHp(layarHP())
      setFase(fase === 'tutup' ? 'masuk' : 'buka')
    } else {
      setFase(fase === 'tutup' || sudahDiusap ? 'tutup' : 'keluar')
    }
  }

  useEffect(() => {
    if (fase !== 'masuk') return
    return bingkai(() => setFase('buka'))
  }, [fase])

  useEffect(() => {
    if (fase !== 'keluar') return
    const t = setTimeout(() => setFase('tutup'), 200)
    return () => clearTimeout(t)
  }, [fase])

  useLayoutEffect(() => {
    if (fase === 'masuk') judulRef.current?.focus({ preventScroll: true })
  }, [fase])

  // Desktop: letakkan di bawah tombol bila muat, selain itu di atasnya. Ikuti tombol saat digulir.
  const terpasang = fase !== 'tutup'
  useLayoutEffect(() => {
    if (!terpasang || hp) return
    let antre = 0
    const ukur = () => {
      antre = 0
      const tombol = tombolRef.current
      const panel = panelRef.current
      if (!tombol || !panel) return
      const r = tombol.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const lebar = Math.min(LEBAR_PANEL, vw - 32)
      const tinggi = panel.offsetHeight
      const ruangBawah = vh - r.bottom - JARAK - 16
      const ruangAtas = r.top - JARAK - 16
      const bawah = ruangBawah >= Math.min(tinggi, 320) || ruangBawah >= ruangAtas
      const kiri = Math.min(Math.max(16, r.left + r.width / 2 - lebar / 2), vw - lebar - 16)
      setLetak({
        kiri,
        lebar,
        atas: bawah ? r.bottom + JARAK : null,
        bawah: bawah ? null : vh - r.top + JARAK,
        tinggiMaks: Math.max(200, bawah ? ruangBawah : ruangAtas),
        asal: `${r.left + r.width / 2 - kiri}px ${bawah ? '0' : '100%'}`,
      })
    }
    const jadwal = () => {
      if (!antre) antre = requestAnimationFrame(ukur)
    }
    ukur()
    window.addEventListener('scroll', jadwal, { passive: true, capture: true })
    window.addEventListener('resize', jadwal)
    return () => {
      if (antre) cancelAnimationFrame(antre)
      window.removeEventListener('scroll', jadwal, { capture: true })
      window.removeEventListener('resize', jadwal)
    }
  }, [terpasang, hp, tombolRef])

  function tutup() {
    if (panelRef.current?.contains(document.activeElement)) tombolRef.current?.focus({ preventScroll: true })
    onTutup()
  }

  // Esc dan sentuhan di luar panel menutup.
  useEffect(() => {
    if (!buka) return
    const keyDown = (e) => {
      if (e.key === 'Escape') tutup()
    }
    const pointerDown = (e) => {
      const t = e.target
      if (panelRef.current?.contains(t) || tombolRef.current?.contains(t)) return
      onTutup()
    }
    document.addEventListener('keydown', keyDown)
    document.addEventListener('pointerdown', pointerDown)
    return () => {
      document.removeEventListener('keydown', keyDown)
      document.removeEventListener('pointerdown', pointerDown)
    }
  })

  // Tab berputar di dalam panel selama terbuka.
  function onKeyDown(e) {
    if (e.key !== 'Tab') return
    const item = [...panelRef.current.querySelectorAll(FOKUSABEL)]
    if (!item.length) return
    const pertama = item[0]
    const terakhir = item[item.length - 1]
    if (e.shiftKey && (document.activeElement === pertama || document.activeElement === judulRef.current)) {
      e.preventDefault()
      terakhir.focus()
    } else if (!e.shiftKey && document.activeElement === terakhir) {
      e.preventDefault()
      pertama.focus()
    }
  }

  // ---- HP: usap ke bawah untuk menutup (sentuh/pena saja) ----
  function mulaiSeret(e) {
    if (!hp || e.pointerType === 'mouse' || e.target.closest('button, a')) return
    const el = panelRef.current
    if (!el || !buka) return
    const awal = ySekarang(el)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    seret.current = { y0: e.clientY - awal, dy: awal, riwayat: [{ y: e.clientY, t: e.timeStamp }] }
    el.style.transition = 'none'
    el.style.transform = `translateY(${awal}px)`
  }

  function gerakSeret(e) {
    const s = seret.current
    const el = panelRef.current
    if (!s || !el) return
    const mentah = e.clientY - s.y0
    s.dy = mentah >= 0 ? mentah : -karet(-mentah, el.offsetHeight)
    s.riwayat.push({ y: e.clientY, t: e.timeStamp })
    while (s.riwayat.length > 2 && e.timeStamp - s.riwayat[0].t > 100) s.riwayat.shift()
    el.style.transform = `translateY(${s.dy}px)`
  }

  function lepasSeret() {
    const s = seret.current
    const el = panelRef.current
    seret.current = null
    if (!s || !el) return
    const a = s.riwayat[0]
    const b = s.riwayat[s.riwayat.length - 1]
    const v = b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0
    const tinggi = el.offsetHeight
    if (s.dy + proyeksi(v) > tinggi * 0.35) {
      const jarak = tinggi + 32 - s.dy
      const durasi = 0.28
      setSudahDiusap(true)
      el.style.transition = `transform ${durasi}s ${kurvaLanjutan(v, jarak, durasi)}, opacity ${durasi}s ease-in`
      el.style.transform = `translateY(${s.dy + jarak}px)`
      el.style.opacity = '0'
    } else {
      const durasi = 0.3
      el.style.transition = `transform ${durasi}s ${kurvaLanjutan(-v * Math.sign(s.dy || 1), Math.abs(s.dy), durasi)}`
      el.style.transform = 'translateY(0px)'
    }
  }

  function onTransitionEnd(e) {
    if (e.target !== panelRef.current) return
    if (sudahDiusap) {
      if (e.propertyName === 'transform') tutup()
      return
    }
    if (fase === 'keluar') {
      setFase('tutup')
      return
    }
    if (e.propertyName === 'transform' && !seret.current && panelRef.current.style.transform) {
      panelRef.current.style.transition = ''
      panelRef.current.style.transform = ''
    }
  }

  if (fase === 'tutup' || !kutipan) return null

  const tampil = bisaDitampilkan(sumber)
  const awalPotong = /^[a-z]/.test(kutipan.teks)
  const akhirPotong = !/[.!?]$/.test(kutipan.teks)
  const gayaLetak = hp
    ? undefined
    : letak
      ? {
          left: letak.kiri,
          width: letak.lebar,
          top: letak.atas ?? undefined,
          bottom: letak.bawah ?? undefined,
          maxHeight: letak.tinggiMaks,
          '--asal': letak.asal,
        }
      : { left: -9999, top: 0, width: Math.min(LEBAR_PANEL, window.innerWidth - 32) }

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-judul`}
      data-fase={fase}
      data-bentuk={hp ? 'lembar' : 'popover'}
      onKeyDown={onKeyDown}
      onTransitionEnd={onTransitionEnd}
      style={gayaLetak}
      className={`panel-bukti fixed z-40 flex flex-col overflow-hidden border border-garis bg-putih text-left shadow-[0_12px_40px_rgb(24_33_44/0.18)] print:hidden ${
        hp
          ? 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]'
          : 'max-h-[32rem] rounded-2xl'
      }`}
    >
      <div
        className="shrink-0 touch-none select-none md:touch-auto md:select-auto"
        onPointerDown={mulaiSeret}
        onPointerMove={gerakSeret}
        onPointerUp={lepasSeret}
        onPointerCancel={lepasSeret}
      >
        {hp && <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-full bg-garis" />}
        <div className="flex items-start gap-2 pl-5 pr-2 pt-3">
          <div className="min-w-0 flex-1 pt-1.5">
            <p
              id={`${id}-judul`}
              ref={judulRef}
              tabIndex={-1}
              className="text-base font-semibold leading-snug text-tinta focus:outline-none"
            >
              {rujukan.sitasi.replace(/^\(|\)$/g, '')}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.8125rem] leading-snug text-tinta-redup">
              <span className="rounded-full bg-kertas px-2 py-0.5 font-medium text-tinta">
                {sumber.jenis}
              </span>
              <span>hlm. {kutipan.halaman}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup bukti"
            onClick={tutup}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tinta-redup transition-colors duration-150 hover:bg-kertas hover:text-tinta"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
        <blockquote
          lang="en"
          className="mt-3 border-l-2 border-tinta pl-3 font-serif text-base leading-relaxed text-tinta"
        >
          {awalPotong && '…'}
          {potongSorot(kutipan.teks, kutipan.sorot).map((b, i) =>
            b.sorot ? (
              <mark key={i} className="rounded-sm bg-[rgb(250_204_21/0.4)] px-0.5 text-tinta">
                {b.teks}
              </mark>
            ) : (
              <span key={i}>{b.teks}</span>
            ),
          )}
          {akhirPotong && '…'}
        </blockquote>

        <p className="mt-3 text-sm leading-relaxed text-tinta">
          <span className="font-semibold">Mendukung:</span> {kutipan.mendukung}
        </p>

        <p className="mt-3 text-[0.8125rem] leading-snug text-tinta-redup">{rujukan.referensi}</p>

        {!tampil && (
          <p className="mt-3 flex gap-2 rounded-lg bg-kertas p-3 text-[0.8125rem] leading-snug text-tinta">
            <span aria-hidden="true" className="font-semibold">
              ⓘ
            </span>
            <span>
              Jurnal ini dilindungi hak cipta, jadi isinya tidak bisa ditampilkan di SETARA. Kutipan di atas
              ada di halaman {kutipan.halaman}. Buka PDF lengkapnya di {sumber.baca.label}.
            </span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-garis px-4 py-3 md:px-5">
        {tampil ? (
          <Link
            to={`/rujukan/${rujukan.id}?k=${kunci}`}
            onClick={onTutup}
            className="tekan inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-tinta px-5 text-base font-semibold text-putih"
          >
            Baca selengkapnya
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </Link>
        ) : (
          <a
            href={sumber.baca.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Baca selengkapnya di ${sumber.baca.label} (tab baru)`}
            className="tekan inline-flex min-h-11 items-center justify-center gap-1 rounded-full bg-tinta px-5 text-base font-semibold text-putih"
          >
            Baca selengkapnya
            <span aria-hidden="true">↗</span>
          </a>
        )}
        <a
          href={rujukan.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center text-sm text-tinta-redup underline decoration-garis underline-offset-2 hover:text-tinta"
        >
          Halaman penerbit (DOI)
        </a>
      </div>
    </div>
  )
}
