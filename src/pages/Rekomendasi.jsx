import { Link } from 'react-router-dom'
import { refs } from '../lib/solusi'
import { REKOMENDASI_UTAMA, tautanDataRekomendasi } from '../content/rekomendasi'
import KepalaHalaman from '../components/KepalaHalaman'
import useDocumentMeta from '../lib/useDocumentMeta'

// Kerangka Fase 1. Fase 3 menambahkan kalimat temuan yang dihitung dari data,
// daftar provinsi yang perlu didahulukan, kaitan SDGs, dan batas rekomendasi.
export default function Rekomendasi() {
  useDocumentMeta({
    judul: 'SETARA | Rekomendasi',
    deskripsi:
      'Lima rekomendasi berbasis studi untuk menutup kesenjangan pendidikan Indonesia, dimulai dari kelompok dan daerah yang paling tertinggal.',
  })

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <KepalaHalaman
        judul="Lima langkah untuk menutup kesenjangan, dimulai dari kelompok dan daerah yang paling tertinggal."
        konteks="Setiap langkah berangkat dari temuan di halaman sebelumnya dan didukung studi yang dapat diperiksa lewat DOI."
      />

      <ol className="mt-10 border-t border-garis">
        {REKOMENDASI_UTAMA.map((r, i) => (
          <li key={r.id} id={r.id} className="border-b border-garis py-6">
            <p className="teks-bantu">
              {i + 1}. Sasaran: <span className="font-semibold text-tinta">{r.sasaran}</span>
            </p>
            <h2 className="judul-bagian mt-1 max-w-[48ch] text-tinta">{r.judul}</h2>
            <p className="mt-2 max-w-[68ch] text-base leading-relaxed text-tinta">{r.intervensi}</p>
            <ul className="mt-3 space-y-1">
              {refs(r.sumber).map((ref) => (
                <li key={ref.id} className="teks-bantu">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-garis underline-offset-2 hover:text-tinta"
                  >
                    {ref.sitasi}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to={tautanDataRekomendasi(r.data)}
              className="tekan mt-3 inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
            >
              Lihat datanya
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10">
        <Link
          to="/metode"
          className="tekan inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
        >
          Lihat metode dan keterbatasan
        </Link>
      </p>
    </main>
  )
}
