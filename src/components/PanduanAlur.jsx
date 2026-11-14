import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ALUR, MOTTO } from '../content/alur'

// Motto KUAT: empat huruf, empat langkah, urutannya sama dengan penanda alur.
// Di mode tur, huruf langkah yang sedang dibuka menyala dan yang lain meredup.
function MottoKuat({ aktif, tur }) {
  return (
    <div className="mb-1 mt-2 grid grid-cols-4 gap-1 rounded-xl bg-kertas p-1">
      <p className="sr-only">
        Motto {MOTTO}: {ALUR.map((a) => a.kata).join(', ')}.
      </p>
      {ALUR.map((a) => {
        const ini = a.id === aktif
        return (
          <div
            key={a.id}
            aria-hidden="true"
            className={`flex flex-col items-center rounded-lg px-1 py-2 transition-colors duration-200 ${
              ini ? 'bg-putih shadow-[0_1px_3px_rgb(24_33_44/0.12)]' : ''
            }`}
          >
            <span
              className={`font-serif text-[1.5rem] font-semibold leading-none ${
                ini || !tur ? 'text-tinta' : 'text-tinta-redup'
              }`}
            >
              {a.huruf}
            </span>
            <span className="mt-1 text-[0.8125rem] leading-tight text-tinta-redup">{a.kata}</span>
          </div>
        )
      })}
    </div>
  )
}

// Kartu panduan alur: tumbuh dari penanda alur, menjelaskan arti angka 1–4.
// Di HP, kartu bisa diusap ke bawah untuk ditutup (mengikuti jari, meneruskan kecepatan).

// Hambatan lembut saat ditarik melewati batas: makin jauh, makin berat.
function karet(lebih, dimensi, c = 0.55) {
  return (lebih * dimensi * c) / (dimensi + c * Math.abs(lebih))
}

// Proyeksi titik berhenti dari kecepatan lepas (px/s), seperti perlambatan gulir.
function proyeksi(v, d = 0.99) {
  return ((v / 1000) * d) / (1 - d)
}

// Kurva yang kemiringan awalnya sama dengan kecepatan jari, agar tidak ada sambungan
// yang terasa antara menyeret dan animasi.
function kurvaLanjutan(v, jarak, durasi) {
  const kemiringan = jarak > 0 ? (Math.max(0, v) * durasi) / jarak : 0
  const x1 = 0.25
  const y1 = Math.min(1, x1 * kemiringan)
  return `cubic-bezier(${x1}, ${y1.toFixed(3)}, 0.4, 1)`
}

function ySekarang(el) {
  try {
    const t = getComputedStyle(el).transform
    return t && t !== 'none' ? new DOMMatrixReadOnly(t).m42 : 0
  } catch {
    return 0
  }
}

// Menjalankan fn dua bingkai lagi. Pembatalan berlaku untuk kedua bingkai, supaya kartu yang
// ditutup tepat saat mulai membuka tidak kembali ke fase "buka".
function bingkai(fn) {
  if (typeof requestAnimationFrame === 'function') {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(fn)
    })
    return () => cancelAnimationFrame(id)
  }
  const id = setTimeout(fn, 16)
  return () => clearTimeout(id)
}

const FOKUSABEL = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

export default function PanduanAlur({
  id,
  buka,
  otomatis,
  mode,
  sekarang,
  onTutup,
  onMulaiTur,
  onLanjut,
  onKembali,
  tombolRef,
}) {
  const [fase, setFase] = useState(buka ? 'masuk' : 'tutup')
  const kartuRef = useRef(null)
  const judulRef = useRef(null)
  const utamaRef = useRef(null)
  const seret = useRef(null)
  const gulirRef = useRef(null)
  const [lebih, setLebih] = useState(false)

  // Tepi bawah daftar memudar hanya bila masih ada isi di bawahnya.
  function cekLebih() {
    const el = gulirRef.current
    if (el) setLebih(el.scrollHeight - el.scrollTop - el.clientHeight > 4)
  }

  const terpasang = fase !== 'tutup'
  useEffect(() => {
    if (!terpasang) return
    const el = gulirRef.current
    if (!el) return
    const ukur = () => setLebih(el.scrollHeight - el.scrollTop - el.clientHeight > 4)
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(ukur) : null
    ro?.observe(el)
    window.addEventListener('resize', ukur)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', ukur)
    }
  }, [terpasang])

  // buka/tutup dari induk → fase animasi. Membuka saat sedang menutup langsung berbalik.
  const [bukaTerakhir, setBukaTerakhir] = useState(buka)
  const [sudahDiusap, setSudahDiusap] = useState(false)
  if (buka !== bukaTerakhir) {
    setBukaTerakhir(buka)
    if (buka) {
      setSudahDiusap(false)
      setFase(fase === 'tutup' ? 'masuk' : 'buka')
    } else {
      setFase(fase === 'tutup' || sudahDiusap ? 'tutup' : 'keluar')
    }
  }

  // Bingkai pertama dilukis dalam keadaan awal, baru bergerak ke keadaan terbuka.
  useEffect(() => {
    if (fase !== 'masuk') return
    return bingkai(() => setFase('buka'))
  }, [fase])

  // Cadangan bila transitionend tidak datang (mis. tab di latar belakang).
  useEffect(() => {
    if (fase !== 'keluar') return
    const t = setTimeout(() => setFase('tutup'), 250)
    return () => clearTimeout(t)
  }, [fase])

  // Fokus saat muncul: otomatis → judul (diumumkan pembaca layar); dari tombol "?" → tombol utama.
  useLayoutEffect(() => {
    if (fase !== 'masuk') return
    const sasaran = otomatis ? judulRef.current : utamaRef.current
    sasaran?.focus({ preventScroll: true })
  }, [fase, otomatis])

  function tutup(cara) {
    const fokusDiDalam = kartuRef.current?.contains(document.activeElement)
    if (fokusDiDalam) tombolRef.current?.focus({ preventScroll: true })
    onTutup(cara)
  }

  // Esc dan sentuhan di luar kartu menutup.
  useEffect(() => {
    if (!buka) return
    const keyDown = (e) => {
      if (e.key === 'Escape') tutup('esc')
    }
    const pointerDown = (e) => {
      const t = e.target
      if (kartuRef.current?.contains(t) || tombolRef.current?.contains(t)) return
      onTutup('luar')
    }
    document.addEventListener('keydown', keyDown)
    document.addEventListener('pointerdown', pointerDown)
    return () => {
      document.removeEventListener('keydown', keyDown)
      document.removeEventListener('pointerdown', pointerDown)
    }
  })

  function onKeyDown(e) {
    if (e.key !== 'Tab' || otomatis) return
    // Dibuka lewat tombol "?": Tab berputar di dalam kartu.
    const item = [...kartuRef.current.querySelectorAll(FOKUSABEL)]
    if (!item.length) return
    const pertama = item[0]
    const terakhir = item[item.length - 1]
    if (e.shiftKey && document.activeElement === pertama) {
      e.preventDefault()
      terakhir.focus()
    } else if (!e.shiftKey && document.activeElement === terakhir) {
      e.preventDefault()
      pertama.focus()
    }
  }

  function onBlur(e) {
    // Muncul otomatis: bila fokus keyboard meninggalkan kartu, kartu ikut menutup.
    const ke = e.relatedTarget
    if (!otomatis || !buka || !ke) return
    if (kartuRef.current?.contains(ke) || tombolRef.current?.contains(ke)) return
    onTutup('fokus')
  }

  // ---- Usap ke bawah untuk menutup (sentuh/pena saja) ----
  function mulaiSeret(e) {
    if (e.pointerType === 'mouse' || e.target.closest('button')) return
    const el = kartuRef.current
    if (!el || !buka) return
    const awal = ySekarang(el)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    seret.current = {
      y0: e.clientY - awal,
      dy: awal,
      riwayat: [{ y: e.clientY, t: e.timeStamp }],
    }
    el.style.transition = 'none'
    el.style.transform = `translateY(${awal}px)`
  }

  function gerakSeret(e) {
    const s = seret.current
    const el = kartuRef.current
    if (!s || !el) return
    const mentah = e.clientY - s.y0
    s.dy = mentah >= 0 ? mentah : -karet(-mentah, el.offsetHeight)
    s.riwayat.push({ y: e.clientY, t: e.timeStamp })
    while (s.riwayat.length > 2 && e.timeStamp - s.riwayat[0].t > 100) s.riwayat.shift()
    el.style.transform = `translateY(${s.dy}px)`
  }

  function lepasSeret() {
    const s = seret.current
    const el = kartuRef.current
    seret.current = null
    if (!s || !el) return
    const a = s.riwayat[0]
    const b = s.riwayat[s.riwayat.length - 1]
    const v = b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0
    const tinggi = el.offsetHeight

    if (s.dy + proyeksi(v) > tinggi * 0.4) {
      // Lempar keluar: lanjut ke bawah dengan kecepatan jari, menyelinap ke balik penanda alur.
      const jarak = tinggi + 96 - s.dy
      const durasi = 0.28
      setSudahDiusap(true)
      el.style.transition = `transform ${durasi}s ${kurvaLanjutan(v, jarak, durasi)}, opacity ${durasi}s ease-in`
      el.style.transform = `translateY(${s.dy + jarak}px)`
      el.style.opacity = '0'
    } else {
      // Kembali ke tempat, juga meneruskan kecepatan ke arah tujuan.
      const jarak = Math.abs(s.dy)
      const durasi = 0.3
      const vKeTujuan = -v * Math.sign(s.dy || 1)
      el.style.transition = `transform ${durasi}s ${kurvaLanjutan(vKeTujuan, jarak, durasi)}`
      el.style.transform = 'translateY(0px)'
    }
  }

  function onTransitionEnd(e) {
    if (e.target !== kartuRef.current) return
    if (sudahDiusap) {
      if (e.propertyName === 'transform') onTutup('usap')
      return
    }
    if (fase === 'keluar') {
      setFase('tutup')
      return
    }
    if (e.propertyName === 'transform' && !seret.current && kartuRef.current.style.transform) {
      kartuRef.current.style.transition = ''
      kartuRef.current.style.transform = ''
    }
  }

  if (fase === 'tutup') return null

  // Dua mode: ikhtisar (empat langkah sekaligus) dan tur (satu langkah per halaman).
  const tur = mode === 'tur' && sekarang
  const kunci = tur ? sekarang.id : 'ikhtisar'
  const terakhir = tur && sekarang.langkah === ALUR.length

  return (
    <div
      ref={kartuRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-judul`}
      data-fase={fase}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onTransitionEnd={onTransitionEnd}
      className="panduan-alur vt-panduan pointer-events-auto mb-3 flex max-h-[calc(100dvh-11.5rem)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-garis bg-putih shadow-[0_12px_40px_rgb(24_33_44/0.18)] md:max-h-[calc(100dvh-9rem)] print:hidden"
    >
      <p aria-live="polite" className="sr-only">
        {tur ? `Langkah ${sekarang.langkah} dari ${ALUR.length}: ${sekarang.pertanyaan}` : ''}
      </p>

      <div
        className="shrink-0 touch-none select-none md:touch-auto md:select-auto"
        onPointerDown={mulaiSeret}
        onPointerMove={gerakSeret}
        onPointerUp={lepasSeret}
        onPointerCancel={lepasSeret}
      >
        <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-full bg-garis md:hidden" />
        <div className="flex items-start gap-2 pl-5 pr-2 pt-3 md:pt-4">
          <div key={kunci} className="min-w-0 flex-1 animate-[muncul_200ms_ease-out] pt-1">
            {tur && (
              <p className="teks-bantu mb-1">
                Langkah {sekarang.langkah} dari {ALUR.length} ·{' '}
                <span className="font-medium text-tinta">{sekarang.halaman}</span>
              </p>
            )}
            <p
              id={`${id}-judul`}
              ref={judulRef}
              tabIndex={-1}
              className="text-pretty font-serif text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em] text-tinta focus:outline-none md:text-[1.375rem]"
            >
              {tur ? sekarang.pertanyaan : 'Satu cerita, empat langkah'}
            </p>
            {!tur && (
              <p className="teks-bantu mt-1 text-pretty">
                Empat pertanyaan yang dibaca berurutan. Tur singkat memandu Anda dari halaman ke halaman.
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Tutup panduan"
            onClick={() => tutup('silang')}
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

      <div
        ref={gulirRef}
        onScroll={cekLebih}
        data-lebih={lebih ? 'ya' : undefined}
        className="panduan-gulir min-h-0 flex-1 overflow-y-auto overscroll-contain px-5"
      >
        <MottoKuat aktif={sekarang?.id} tur={tur} />
        {tur ? (
          <p
            key={kunci}
            className="animate-[muncul_200ms_ease-out] pb-4 pt-2 text-base leading-relaxed text-tinta"
          >
            {sekarang.panduan}
          </p>
        ) : (
          <>
            <ol className="py-1 md:py-2">
              {ALUR.map((a) => {
                const aktif = a.id === sekarang?.id
                return (
                  <li key={a.id} className="flex gap-3 py-2.5">
                    <span
                      aria-hidden="true"
                      className={`mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.9375rem] font-semibold leading-none ${
                        aktif ? 'bg-tinta text-putih' : 'bg-kertas text-tinta-redup'
                      }`}
                    >
                      {a.langkah}
                    </span>
                    <div className="min-w-0">
                      <p className="subjudul text-tinta">{a.pertanyaan}</p>
                      <p className="teks-bantu mt-0.5">
                        <span className="font-medium text-tinta">{a.halaman}</span> · {a.isi}
                      </p>
                      {aktif && (
                        <p className="label-grafik mt-1.5 inline-flex rounded-full bg-kertas px-2 py-0.5 text-tinta">
                          Anda di sini
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
            <p className="teks-bantu pb-3 pt-1">Sumber, rumus, dan keterbatasan ada di menu Metode.</p>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-garis px-4 py-3 md:px-5">
        <div className="flex flex-row-reverse flex-wrap items-center gap-x-2 gap-y-1 md:justify-start">
          <button
            ref={utamaRef}
            type="button"
            onClick={() => (tur ? (terakhir ? tutup('selesai') : onLanjut()) : onMulaiTur())}
            className="flex min-h-12 grow-[2] items-center justify-center gap-1 whitespace-nowrap rounded-full bg-tinta px-5 text-base font-semibold text-putih md:min-h-11 md:grow-0"
          >
            {tur ? (terakhir ? 'Selesai' : 'Lanjut') : 'Mulai tur'}
            {tur && !terakhir && (
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
            )}
          </button>
          <button
            type="button"
            onClick={() => (tur ? onKembali() : tutup('nanti'))}
            className="flex min-h-11 grow items-center justify-center whitespace-nowrap rounded-full px-4 text-base text-tinta-redup transition-colors duration-150 hover:bg-kertas hover:text-tinta md:grow-0"
          >
            {tur ? 'Kembali' : 'Nanti saja'}
          </button>
        </div>
      </div>
    </div>
  )
}
