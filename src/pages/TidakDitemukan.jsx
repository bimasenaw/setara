import { Link, useLocation } from 'react-router-dom'
import KepalaHalaman from '../components/KepalaHalaman'
import { ALUR } from '../content/alur'
import useDocumentMeta from '../lib/useDocumentMeta'

// Alamat yang tidak dikenal: jelaskan, lalu tawarkan jalan kembali ke awal cerita.
export default function TidakDitemukan() {
  const { pathname } = useLocation()

  useDocumentMeta({
    judul: 'Halaman tidak ditemukan | SETARA',
    deskripsi: 'Halaman yang dicari tidak ada di SETARA.',
  })

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <KepalaHalaman
        judul="Halaman tidak ditemukan"
        konteks={`Alamat ${pathname} tidak ada di SETARA. Mungkin salah ketik, atau tautannya sudah berubah.`}
      />
      <p className="mt-8">
        <Link
          to="/"
          className="tekan inline-flex min-h-11 items-center rounded-lg bg-tinta px-5 text-base font-semibold text-putih"
        >
          Kembali ke Ringkasan
        </Link>
      </p>
      <nav aria-label="Halaman SETARA" className="mt-10 border-t border-garis pt-6">
        <p className="teks-bantu">Atau mulai dari salah satu pertanyaan:</p>
        <ol className="mt-2">
          {ALUR.map((a) => (
            <li key={a.id}>
              <Link
                to={a.to}
                className="inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
              >
                {a.langkah}. {a.pertanyaan}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/metode"
              className="inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
            >
              Metode dan sumber
            </Link>
          </li>
        </ol>
      </nav>
    </main>
  )
}
