import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ALUR, MOTTO } from '../content/alur'
import { FOKUSABEL, bingkai, karet, kurvaLanjutan, proyeksi, ySekarang } from './gerak'

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

// Bagian yang bisa menciut: tinggi beranimasi dari isi ke nol (grid 1fr → 0fr), lalu tidak bisa difokus.
function Lipat({ buka, className = '', children }) {
  return (
    <div
      inert={!buka}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
        buka ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      } ${className}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

// Kartu panduan alur: tumbuh dari penanda alur, menjelaskan arti angka 1–4.
// Kartu tidak tertutup saat halaman digulir: penjelasannya menciut sehingga yang tersisa hanya motto KUAT
// dan tombol Sebelumnya/Lanjut. Gagang di atas kartu (ketuk, atau usap di HP) membuka dan menciutkannya.
// Kartu hanya ditutup dengan sengaja: tombol ×, Selesai, Nanti saja, atau Esc.

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
  const [ringkas, setRingkas] = useState(false)
  const kartuRef = useRef(null)
  const judulRef = useRef(null)
  const utamaRef = useRef(null)
  const seret = useRef(null)
  const abaikanKlik = useRef(false)
  const gulirRef = useRef(null)
  const [lebih, setLebih] = useState(false)
  // Bisa digulir: area daftar perlu bisa difokus keyboard supaya bisa digulir dengan tombol panah.
  const [bisaGulir, setBisaGulir] = useState(false)

  // Dua mode: ikhtisar (empat langkah sekaligus) dan tur (satu langkah per halaman).
  const tur = mode === 'tur' && sekarang
  const kunci = tur ? sekarang.id : 'ikhtisar'
  const terakhir = tur && sekarang.langkah === ALUR.length

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
    const ukur = () => {
      setLebih(el.scrollHeight - el.scrollTop - el.clientHeight > 4)
      setBisaGulir(el.scrollHeight - el.clientHeight > 4)
    }
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
  if (buka !== bukaTerakhir) {
    setBukaTerakhir(buka)
    if (buka) {
      setRingkas(false)
      setFase(fase === 'tutup' ? 'masuk' : 'buka')
    } else {
      setFase(fase === 'tutup' ? 'tutup' : 'keluar')
    }
  }

  // Pindah langkah: penjelasan langkah baru selalu terbuka.
  const [kunciTerakhir, setKunciTerakhir] = useState(kunci)
  if (kunci !== kunciTerakhir) {
    setKunciTerakhir(kunci)
    setRingkas(false)
  }

  // Menggulir halaman ke bawah menciutkan kartu; kembali ke atas halaman membukanya lagi.
  useEffect(() => {
    if (!buka) return
    let akhir = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 48) setRingkas(false)
      else if (y - akhir > 8) setRingkas(true)
      akhir = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [buka])

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

  // Esc menutup (untuk pengguna keyboard). Sentuhan di luar kartu dan menggulir tidak menutup.
  useEffect(() => {
    if (!buka) return
    const keyDown = (e) => {
      if (e.key === 'Escape') tutup('esc')
    }
    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  })

  function onKeyDown(e) {
    if (e.key !== 'Tab' || otomatis) return
    // Dibuka lewat tombol "?": Tab berputar di dalam kartu (bagian yang menciut dilewati).
    const item = [...kartuRef.current.querySelectorAll(FOKUSABEL)].filter((el) => !el.closest('[inert]'))
    if (!item.length) return
    const pertama = item[0]
    const akhir = item[item.length - 1]
    if (e.shiftKey && document.activeElement === pertama) {
      e.preventDefault()
      akhir.focus()
    } else if (!e.shiftKey && document.activeElement === akhir) {
      e.preventDefault()
      pertama.focus()
    }
  }

  // ---- Usap gagang: ke bawah menciutkan, ke atas membuka (sentuh/pena saja) ----
  function mulaiSeret(e) {
    if (e.pointerType === 'mouse') return
    const tombol = e.target.closest('button')
    if (tombol && !tombol.hasAttribute('data-gagang')) return
    const el = kartuRef.current
    if (!el || !buka) return
    const awal = ySekarang(el)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    seret.current = {
      y0: e.clientY - awal,
      dy: awal,
      jauh: 0,
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
    // Kartu tidak pernah dilempar keluar: kedua arah memakai karet.
    s.dy = Math.sign(mentah) * karet(Math.abs(mentah), el.offsetHeight)
    s.jauh = Math.max(s.jauh, Math.abs(mentah))
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
    const tujuan = s.dy + proyeksi(v)
    if (s.jauh > 6) abaikanKlik.current = true // seret, bukan ketukan: klik yang menyusul diabaikan
    if (tujuan > 40) setRingkas(true)
    else if (tujuan < -40) setRingkas(false)
    // Kembali ke tempat, meneruskan kecepatan jari ke arah tujuan.
    const jarak = Math.abs(s.dy)
    const durasi = 0.3
    const vKeTujuan = -v * Math.sign(s.dy || 1)
    el.style.transition = `transform ${durasi}s ${kurvaLanjutan(vKeTujuan, jarak, durasi)}`
    el.style.transform = 'translateY(0px)'
  }

  function klikGagang() {
    if (abaikanKlik.current) {
      abaikanKlik.current = false
      return
    }
    setRingkas((r) => !r)
  }

  function onTransitionEnd(e) {
    if (e.target !== kartuRef.current) return
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

  const judul = (
    <p
      id={`${id}-judul`}
      ref={judulRef}
      tabIndex={-1}
      className="text-pretty font-serif text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em] text-tinta focus:outline-none md:text-[1.375rem]"
    >
      {tur ? sekarang.pertanyaan : 'Satu cerita, empat langkah'}
    </p>
  )

  return (
    <div
      ref={kartuRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-judul`}
      data-fase={fase}
      data-ringkas={ringkas ? 'ya' : undefined}
      onKeyDown={onKeyDown}
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
        <button
          type="button"
          data-gagang
          onClick={klikGagang}
          aria-expanded={!ringkas}
          aria-label={ringkas ? 'Tampilkan penjelasan panduan' : 'Ringkas panduan'}
          className="group mx-auto flex h-6 w-20 items-center justify-center rounded-full"
        >
          <span
            aria-hidden="true"
            className="h-1 w-9 rounded-full bg-garis transition-colors duration-150 group-hover:bg-tinta-redup"
          />
        </button>
        <div className="flex items-start gap-2 pl-5 pr-2">
          <div key={kunci} className="min-w-0 flex-1 animate-[muncul_200ms_ease-out]">
            {tur ? (
              <>
                <Lipat buka={!ringkas}>
                  <p className="teks-bantu mb-1 pt-1">
                    Langkah {sekarang.langkah} dari {ALUR.length} ·{' '}
                    <span className="font-medium text-tinta">{sekarang.halaman}</span>
                  </p>
                  {judul}
                </Lipat>
                <MottoKuat aktif={sekarang.id} tur />
              </>
            ) : (
              <>
                <div className="pt-1">{judul}</div>
              </>
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
        inert={ringkas}
        className={`grid min-h-0 flex-1 transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
          ringkas ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        }`}
      >
        <div
          ref={gulirRef}
          onScroll={cekLebih}
          data-lebih={lebih ? 'ya' : undefined}
          tabIndex={bisaGulir ? 0 : undefined}
          role={bisaGulir ? 'region' : undefined}
          aria-label={bisaGulir ? 'Isi panduan' : undefined}
          className="panduan-gulir min-h-0 overflow-y-auto overscroll-contain px-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinta"
        >
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
                        <p className="teks-bantu mt-0.5">{a.halaman}</p>
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
            className="flex min-h-11 grow items-center justify-center gap-1 whitespace-nowrap rounded-full px-4 text-base text-tinta-redup transition-colors duration-150 hover:bg-kertas hover:text-tinta md:grow-0"
          >
            {tur && (
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
                <path d="M10 3.5L5.5 8L10 12.5" />
              </svg>
            )}
            {tur ? 'Sebelumnya' : 'Nanti saja'}
          </button>
        </div>
      </div>
    </div>
  )
}
