import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatAngka } from '../lib/format'
import { tautanProvinsi } from '../lib/params'

// Grafik utama halaman Provinsi: batang horizontal skor indeks prioritas 0–100.
// Sepuluh teratas tampil lebih dulu. Lima teratas merah bata (didahulukan), sisanya biru kelabu.
// Setiap baris menaut ke profil provinsi; nilai juga terbaca sebagai teks.
const TAMPIL_AWAL = 10
const LIMA_TERATAS = 5

export default function GrafikPrioritas({ daftar, tahun, komponen = [] }) {
  const [semua, setSemua] = useState(false)
  if (!daftar?.length) return null
  const tampil = semua ? daftar : daftar.slice(0, TAMPIL_AWAL)
  const sisa = daftar.length - TAMPIL_AWAL

  return (
    <div>
      <ol
        aria-label="Indeks prioritas per provinsi, dari skor tertinggi"
        className="divide-y divide-garis border-y border-garis"
      >
        {tampil.map((p) => {
          const teratas = p.peringkat <= LIMA_TERATAS
          return (
            <li key={p.kode} className="flex items-center gap-3 py-2">
              <span className="w-6 shrink-0 text-right text-sm tabular-nums text-tinta-redup">
                {p.peringkat}
              </span>
              <Link
                to={tautanProvinsi(p.kode, tahun)}
                className="min-h-11 w-[8.25rem] shrink-0 content-center text-[0.9375rem] leading-tight text-tinta underline decoration-garis underline-offset-2 hover:decoration-tinta md:w-48"
              >
                {p.provinsi}
              </Link>
              <span aria-hidden="true" className="h-3 min-w-0 flex-1 rounded-full bg-kertas">
                <span
                  className={`block h-3 rounded-full ${teratas ? 'bg-merah' : 'bg-biru'}`}
                  style={{ width: `${Math.max(2, Math.min(100, p.skor))}%` }}
                />
              </span>
              <span className="w-11 shrink-0 text-right font-semibold tabular-nums text-tinta">
                {formatAngka(p.skor, 1)}
              </span>
            </li>
          )
        })}
      </ol>

      {sisa > 0 && (
        <button
          type="button"
          aria-expanded={semua}
          onClick={() => setSemua((v) => !v)}
          className="tekan mt-3 inline-flex min-h-11 items-center rounded-lg border border-garis bg-putih px-4 text-base text-tinta hover:bg-kertas"
        >
          {semua ? 'Tampilkan 10 teratas' : `Tampilkan semua provinsi (${daftar.length})`}
        </button>
      )}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-redup">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-merah" />
          Lima provinsi yang paling perlu didahulukan
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-biru" />
          Provinsi lainnya
        </span>
      </div>

      {komponen.length > 0 && (
        <p className="teks-bantu mt-2">
          Tahun data per indikator: {komponen.map((k) => `${k.label} ${k.tahun ?? '-'}`).join(' · ')}.
        </p>
      )}
    </div>
  )
}
