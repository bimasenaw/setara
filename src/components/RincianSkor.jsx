import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatAngka } from '../lib/format'
import { useBukaDariHash } from './bukaDariHash'

const MERAH = '#C2372D'
const BIRU = '#6F8CAB'
const AMBANG_MERAH = 80 // skor 80 ke atas: sangat perlu didahulukan

function nilaiTampil(nilai, satuan) {
  if (nilai === null || nilai === undefined) return 'tidak ada data'
  if (satuan === 'persen') return `${formatAngka(nilai, 2)}%`
  if (satuan === 'tahun') return `${formatAngka(nilai, 2)} tahun`
  // Indeks: IPM berskala puluhan (2 desimal), ketimpangan gender di bawah 1 (3 desimal).
  return formatAngka(nilai, Math.abs(nilai) < 1 ? 3 : 2)
}

// Skor bulat ditulis tanpa ",0" (100, bukan 100,0); lainnya satu desimal.
function skorTampil(n) {
  const r = Math.round(n * 10) / 10
  return Number.isInteger(r) ? String(r) : formatAngka(r, 1)
}

// Contoh perhitungan satu skor indeks: enam skor persentil, lalu rata-ratanya.
// `provinsi` adalah satu baris hitungPrioritas().daftar; `komponen` adalah hitungPrioritas().komponen.
// Tidak ada rumus baru: semua angka dibaca dari src/lib/prioritas.js.
export default function RincianSkor({ provinsi, komponen, jumlahProvinsi }) {
  const ref = useRef(null)
  useBukaDariHash('perhitungan', ref)
  if (!provinsi || !komponen?.length) return null

  const baris = komponen.map((k) => ({ ...k, ...provinsi.komponen[k.id] }))
  const ada = baris.filter((b) => b.skor !== null && b.skor !== undefined)
  const skorAkhir = formatAngka(provinsi.skor, 1)
  // Rata-rata dari angka yang dibulatkan bisa berbeda tipis dari skor sebenarnya: pakai "≈" bila begitu.
  const rataBulat = ada.reduce((s, b) => s + Math.round(b.skor * 10) / 10, 0) / ada.length
  const tanda = formatAngka(rataBulat, 1) === skorAkhir ? '=' : '≈'

  return (
    <details ref={ref} id="perhitungan" className="group scroll-mt-24 border-b border-garis">
      <summary className="tekan flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md py-2 text-base font-semibold text-tinta [&::-webkit-details-marker]:hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out group-open:rotate-90"
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Bagaimana skor {skorAkhir} dihitung?
      </summary>

      <div className="max-w-[44rem] pb-5 pl-6 group-open:animate-[muncul_150ms_ease-out]">
        <p className="text-sm leading-relaxed text-tinta-redup">
          Setiap indikator diberi skor 0–100 menurut posisi provinsi di antara {jumlahProvinsi} provinsi; 100
          berarti paling perlu didahulukan. Skor indeks adalah rata-ratanya.
        </p>

        <ul className="mt-4 space-y-3">
          {baris.map((b) => {
            const adaSkor = b.skor !== null && b.skor !== undefined
            const warna = adaSkor && b.skor >= AMBANG_MERAH ? MERAH : BIRU
            return (
              <li key={b.id} data-indikator={b.id}>
                <p className="text-sm leading-snug text-tinta">
                  <span className="font-semibold">{b.label}</span>
                  <span className="text-tinta-redup">
                    {' '}
                    · {nilaiTampil(b.nilai, b.satuan)}
                    {b.tahun ? ` (${b.tahun})` : ''}
                  </span>
                </p>
                <p className="text-xs leading-snug text-tinta-redup">
                  {b.higherIsBetter ? 'Makin rendah, makin perlu.' : 'Makin tinggi, makin perlu.'}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <div aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-garis">
                    {adaSkor && (
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${b.skor}%`, background: warna }}
                      />
                    )}
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-tinta">
                    {adaSkor ? skorTampil(b.skor) : '–'}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 border-t border-garis pt-3 text-sm leading-relaxed text-tinta">
          Rata-rata {ada.length} skor: ({ada.map((b) => skorTampil(b.skor)).join(' + ')}) ÷ {ada.length}{' '}
          {tanda} <span className="text-base font-semibold tabular-nums">{skorAkhir}</span>
        </p>
        <p className="mt-2 text-sm">
          <Link
            to="/metode#rumus"
            className="inline-flex min-h-11 items-center text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
          >
            Rumus lengkap di Metode →
          </Link>
        </p>
      </div>
    </details>
  )
}
