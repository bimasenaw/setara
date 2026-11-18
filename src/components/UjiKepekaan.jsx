import { useMemo, useRef } from 'react'
import { useBukaDariHash } from './bukaDariHash'
import { kalimatKepekaan, ujiKepekaan } from './kepekaan'

// Satu kalimat yang selalu tampil, lalu rincian enam percobaan di balik lipatan (#kepekaan).
export default function UjiKepekaan({ daftar, komponen }) {
  const ref = useRef(null)
  useBukaDariHash('kepekaan', ref)
  const uji = useMemo(() => ujiKepekaan(daftar, komponen), [daftar, komponen])
  if (!daftar?.length || !komponen?.length) return null

  const kalimat = kalimatKepekaan(uji.stabil, komponen.length)
  const kodeAsli = new Set(uji.asli.map((p) => p.kode))

  return (
    <div className="mt-4">
      <p className="flex items-start gap-2 text-sm leading-relaxed text-tinta">
        {kalimat ? (
          <>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-tinta">
              <path
                d="M3 8.5 6.5 12 13 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              <span className="font-semibold">Uji kepekaan:</span> {kalimat}
            </span>
          </>
        ) : (
          <span>
            <span className="font-semibold">Uji kepekaan:</span> peringkat teratas berubah bila salah satu
            indikator dihapus.
          </span>
        )}
      </p>

      <details ref={ref} id="kepekaan" className="group scroll-mt-24">
        <summary className="tekan inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-sm font-semibold text-tinta [&::-webkit-details-marker]:hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4 transition-transform duration-150 ease-out group-open:rotate-90"
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
          Lihat uji kepekaan
        </summary>
        <div className="pb-2 pl-6 group-open:animate-[muncul_150ms_ease-out]">
          <p className="max-w-[68ch] text-sm leading-relaxed text-tinta-redup">
            Indeks dihitung ulang {komponen.length} kali, setiap kali tanpa satu indikator. Lima teratas hasil
            hitung ulang ditampilkan; yang bergaris putus-putus tidak ada di lima teratas asli.
          </p>
          <ol className="mt-3 space-y-3">
            {uji.hasil.map((h) => (
              <li key={h.tanpa.id} data-tanpa={h.tanpa.id}>
                <p className="text-sm font-semibold text-tinta">Tanpa {h.tanpa.label}</p>
                <ol className="mt-1 flex flex-wrap gap-1.5">
                  {h.teratas.map((p, i) => {
                    const baru = !kodeAsli.has(p.kode)
                    return (
                      <li
                        key={p.kode}
                        data-baru={baru ? 'ya' : undefined}
                        className={`rounded-full px-2.5 py-0.5 text-xs leading-5 text-tinta ${
                          baru ? 'border border-dashed border-tinta-redup bg-putih' : 'bg-kertas'
                        }`}
                      >
                        <span className="font-semibold tabular-nums">{i + 1}.</span> {p.provinsi}
                        {baru && <span className="text-tinta-redup"> (baru)</span>}
                      </li>
                    )
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </details>
    </div>
  )
}
