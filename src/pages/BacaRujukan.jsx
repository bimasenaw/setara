import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SUMBER, bisaDitampilkan, potongSorot } from '../content/kutipan'
import { refById } from '../lib/solusi'
import useDocumentMeta from '../lib/useDocumentMeta'

// Penampil PDF rujukan berlisensi terbuka. Halaman yang dikutip dimuat lebih dulu, lalu layar
// menggulir ke kalimat yang disorot. Berkas PDF tidak diubah: sorotan dibuat di lapisan teks.

const norm = (s) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

// Muat pdf.js hanya di halaman ini, beserta worker-nya.
let pdfjsJanji = null
function muatPdfjs() {
  pdfjsJanji ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(
    ([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      return pdfjs
    },
  )
  return pdfjsJanji
}

// Bungkus bagian teks yang cocok dengan kalimat sorot memakai <mark>, di dalam span lapisan teks.
function tandaiSorot(textDivs, strs, daftarSorot) {
  let gabung = ''
  const peta = []
  strs.forEach((str, d) => {
    for (let c = 0; c < str.length; c++) {
      for (const ch of norm(str[c])) {
        gabung += ch
        peta.push([d, c])
      }
    }
  })
  const perDiv = new Map()
  for (const s of daftarSorot) {
    const cari = norm(s)
    const i = cari ? gabung.indexOf(cari) : -1
    if (i < 0) continue
    const [d0, c0] = peta[i]
    const [d1, c1] = peta[i + cari.length - 1]
    for (let d = d0; d <= d1; d++) {
      const dari = d === d0 ? c0 : 0
      const sampai = d === d1 ? c1 + 1 : strs[d].length
      perDiv.set(d, [...(perDiv.get(d) || []), [dari, sampai]])
    }
  }
  const marks = []
  for (const [d, rentang] of perDiv) {
    const div = textDivs[d]
    const str = strs[d]
    if (!div || div.textContent !== str) continue
    rentang.sort((a, b) => a[0] - b[0])
    div.textContent = ''
    let posisi = 0
    for (const [a, b] of rentang) {
      if (a < posisi) continue
      if (a > posisi) div.append(str.slice(posisi, a))
      const m = document.createElement('mark')
      m.className = 'sorot-pdf'
      m.textContent = str.slice(a, b)
      div.append(m)
      marks.push(m)
      posisi = b
    }
    if (posisi < str.length) div.append(str.slice(posisi))
  }
  return marks
}

function HalamanPdf({ pdfjs, doc, nomor, rasio, lebar, sorot, paksa, onSorot, onTerlihat }) {
  const wadahRef = useRef(null)
  const [dekat, setDekat] = useState(paksa)

  // Gambar halaman hanya saat mendekati layar.
  useEffect(() => {
    const el = wadahRef.current
    if (!el || dekat || typeof IntersectionObserver !== 'function') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setDekat(true)
      },
      { rootMargin: '1200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [dekat])

  // Laporkan halaman yang sedang dibaca.
  useEffect(() => {
    const el = wadahRef.current
    if (!el || typeof IntersectionObserver !== 'function') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onTerlihat(nomor)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [nomor, onTerlihat])

  useEffect(() => {
    const wadah = wadahRef.current
    if (!dekat || !wadah || !lebar) return
    let batal = false
    let tugas = null
    let lapisanTeks = null
    ;(async () => {
      const page = await doc.getPage(nomor)
      if (batal) return
      const skala = lebar / page.getViewport({ scale: 1 }).width
      const vp = page.getViewport({ scale: skala })
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(vp.width * dpr)
      canvas.height = Math.floor(vp.height * dpr)
      canvas.className = 'absolute inset-0 h-full w-full'
      canvas.setAttribute('aria-hidden', 'true')
      tugas = page.render({
        canvas,
        canvasContext: canvas.getContext('2d'),
        viewport: vp,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      })
      await tugas.promise
      if (batal) return
      const lapisan = document.createElement('div')
      lapisan.className = 'textLayer'
      wadah.style.setProperty('--scale-factor', String(skala))
      wadah.style.setProperty('--total-scale-factor', String(skala))
      wadah.style.aspectRatio = `${vp.width} / ${vp.height}`
      lapisanTeks = new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: lapisan,
        viewport: vp,
      })
      await lapisanTeks.render()
      if (batal) return
      wadah.replaceChildren(canvas, lapisan)
      if (sorot?.length) {
        const marks = tandaiSorot(lapisanTeks.textDivs, lapisanTeks.textContentItemsStr, sorot)
        onSorot?.(marks)
      }
    })().catch(() => {
      // Halaman gagal digambar: kotak kosong tetap menjaga tata letak.
    })
    return () => {
      batal = true
      tugas?.cancel?.()
      lapisanTeks?.cancel?.()
    }
  }, [dekat, doc, nomor, lebar, pdfjs, sorot, onSorot])

  return (
    <div
      ref={wadahRef}
      data-halaman={nomor}
      aria-label={`Halaman ${nomor}`}
      role="img"
      className="relative w-full overflow-hidden bg-putih shadow-[0_1px_4px_rgb(24_33_44/0.12)]"
      style={{ aspectRatio: rasio }}
    />
  )
}

function KartuKutipan({ kutipan, className = '' }) {
  if (!kutipan) return null
  return (
    <div className={`rounded-xl border border-garis bg-putih p-4 ${className}`}>
      <p className="teks-bantu">Kalimat yang disorot · hlm. {kutipan.halaman}</p>
      <blockquote
        lang="en"
        className="mt-2 border-l-2 border-tinta pl-3 font-serif text-base leading-relaxed text-tinta"
      >
        {potongSorot(kutipan.teks, kutipan.sorot).map((b, i) =>
          b.sorot ? (
            <mark key={i} className="rounded-sm bg-[rgb(250_204_21/0.4)] px-0.5 text-tinta">
              {b.teks}
            </mark>
          ) : (
            <span key={i}>{b.teks}</span>
          ),
        )}
      </blockquote>
      <p className="mt-2 text-sm leading-relaxed text-tinta">
        <span className="font-semibold">Mendukung:</span> {kutipan.mendukung}
      </p>
    </div>
  )
}

export default function BacaRujukan() {
  const { id } = useParams()
  const [cari] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const rujukan = refById(id)
  const sumber = SUMBER[id]
  const kunci = cari.get('k') || 'utama'
  const kutipan = sumber?.kutipan[kunci] || sumber?.kutipan.utama
  const tampil = bisaDitampilkan(sumber)

  useDocumentMeta({
    judul: rujukan ? `SETARA | ${rujukan.sitasi.replace(/^\(|\)$/g, '')}` : 'SETARA | Rujukan',
    deskripsi: rujukan?.referensi,
  })

  const [pdf, setPdf] = useState({ status: 'muat' })
  const [lebar, setLebar] = useState(0)
  const [terlihat, setTerlihat] = useState(kutipan?.halamanPdf || 1)
  const daftarRef = useRef(null)
  const marksRef = useRef([])
  const sudahGulir = useRef(false)

  useEffect(() => {
    if (!tampil) return
    let batal = false
    let tugas = null
    muatPdfjs()
      .then(async (pdfjs) => {
        tugas = pdfjs.getDocument({ url: sumber.pdf, isEvalSupported: false })
        const doc = await tugas.promise
        const p1 = (await doc.getPage(1)).getViewport({ scale: 1 })
        if (!batal) setPdf({ status: 'siap', pdfjs, doc, rasio: `${p1.width} / ${p1.height}` })
      })
      .catch(() => {
        if (!batal) setPdf({ status: 'gagal' })
      })
    return () => {
      batal = true
      tugas?.destroy?.()
    }
  }, [tampil, sumber?.pdf])

  // Lebar halaman mengikuti lebar kolom. Berubah berarti halaman digambar ulang.
  useEffect(() => {
    const el = daftarRef.current
    if (!el) return
    const ukur = () => {
      const w = Math.round(el.clientWidth)
      setLebar((lama) => (Math.abs(lama - w) > 2 ? w : lama))
    }
    ukur()
    if (typeof ResizeObserver !== 'function') return
    const ro = new ResizeObserver(ukur)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pdf.status])

  const keKutipan = useCallback(
    (perilaku = 'smooth') => {
      const m = marksRef.current[0]
      const reduksi = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (m?.isConnected) {
        m.scrollIntoView({ block: 'center', behavior: reduksi ? 'auto' : perilaku })
      } else {
        document
          .querySelector(`[data-halaman="${kutipan?.halamanPdf || 1}"]`)
          ?.scrollIntoView({ block: 'start', behavior: reduksi ? 'auto' : perilaku })
      }
    },
    [kutipan?.halamanPdf],
  )

  const onSorot = useCallback(
    (marks) => {
      marksRef.current = marks
      if (!sudahGulir.current && marks.length) {
        sudahGulir.current = true
        requestAnimationFrame(() => keKutipan('auto'))
      }
    },
    [keKutipan],
  )

  // Halaman kutipan sudah di posisi sebelum sorotan siap: gulir ke halamannya dulu.
  useEffect(() => {
    if (pdf.status !== 'siap' || !lebar || sudahGulir.current) return
    requestAnimationFrame(() => {
      if (!sudahGulir.current) keKutipan('auto')
    })
  }, [pdf.status, lebar, keKutipan])

  const kembali = () => (location.key !== 'default' ? navigate(-1) : navigate('/rekomendasi'))

  if (!rujukan || !sumber) {
    return (
      <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-24 pt-8">
        <h1 className="judul-bagian text-tinta">Rujukan tidak ditemukan</h1>
        <Link
          to="/rekomendasi"
          className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4"
        >
          Kembali ke Rekomendasi
        </Link>
      </main>
    )
  }

  const sorot = kutipan?.sorot
  const jumlah = pdf.status === 'siap' ? pdf.doc.numPages : null

  return (
    <main id="konten" className="mx-auto w-full max-w-[56rem] px-4 pb-32 pt-6 md:pt-8">
      <button
        type="button"
        onClick={kembali}
        className="tekan inline-flex min-h-11 items-center gap-1 text-base text-tinta-redup hover:text-tinta"
      >
        <span aria-hidden="true">←</span> Kembali
      </button>

      <h1 className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-tinta md:text-[2rem]">
        {rujukan.sitasi.replace(/^\(|\)$/g, '')}
      </h1>
      <p className="teks-bantu mt-2 max-w-[68ch]">{rujukan.referensi}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tinta-redup">
        <span className="rounded-full bg-putih px-2 py-0.5 font-medium text-tinta">{sumber.jenis}</span>
        {sumber.lisensi && (
          <a
            href={sumber.lisensi.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center underline decoration-garis underline-offset-2 hover:text-tinta md:min-h-0"
          >
            Lisensi {sumber.lisensi.nama}
          </a>
        )}
        <a
          href={rujukan.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center underline decoration-garis underline-offset-2 hover:text-tinta md:min-h-0"
        >
          Sumber asli ↗
        </a>
      </p>

      <KartuKutipan kutipan={kutipan} className="mt-5" />

      {!tampil ? (
        <p className="mt-6 rounded-lg bg-putih p-4 text-sm leading-relaxed text-tinta">
          Jurnal ini dilindungi hak cipta, jadi isinya tidak bisa ditampilkan di SETARA.{' '}
          <a href={sumber.baca.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Buka PDF lengkapnya di {sumber.baca.label} ↗
          </a>
        </p>
      ) : pdf.status === 'gagal' ? (
        <p role="alert" className="mt-6 rounded-lg bg-putih p-4 text-sm leading-relaxed text-tinta">
          PDF tidak bisa dimuat. Kutipannya tetap ada di atas.{' '}
          <a href={rujukan.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            Buka di situs penerbit ↗
          </a>
        </p>
      ) : (
        <div ref={daftarRef} className="mt-6 flex flex-col gap-4" aria-busy={pdf.status !== 'siap'}>
          {pdf.status === 'muat' && <p className="teks-bantu">Memuat PDF…</p>}
          {pdf.status === 'siap' &&
            lebar > 0 &&
            Array.from({ length: jumlah }, (_, i) => i + 1).map((n) => (
              <HalamanPdf
                key={`${n}-${lebar}`}
                pdfjs={pdf.pdfjs}
                doc={pdf.doc}
                nomor={n}
                rasio={pdf.rasio}
                lebar={lebar}
                paksa={n === kutipan?.halamanPdf}
                sorot={n === kutipan?.halamanPdf ? sorot : null}
                onSorot={n === kutipan?.halamanPdf ? onSorot : null}
                onTerlihat={setTerlihat}
              />
            ))}
        </div>
      )}

      {tampil && pdf.status === 'siap' && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center pb-[calc(1rem+env(safe-area-inset-bottom))] print:hidden">
          <div className="header-kaca pointer-events-auto flex items-center gap-1 rounded-full border border-garis p-1 shadow-[0_4px_16px_rgb(24_33_44/0.12)]">
            <span className="px-3 text-sm tabular-nums text-tinta-redup">
              Hlm. {terlihat} dari {jumlah}
            </span>
            <button
              type="button"
              onClick={() => keKutipan()}
              className="tekan inline-flex min-h-11 items-center rounded-full bg-tinta px-4 text-sm font-semibold text-putih"
            >
              Ke kutipan
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
