import { Link, useLocation } from 'react-router-dom'
import { ALUR, langkahAlur, tautanAlur } from '../content/alur'

// Penanda alur 1–4: menjawab "saya di mana" dan "bisa ke mana" di setiap halaman cerita.
export default function AlurCerita({ aktif }) {
  const { search } = useLocation()
  const sekarang = langkahAlur(aktif)
  if (!sekarang) return null

  return (
    <nav aria-label="Alur cerita" className="mb-5 print:hidden">
      <p className="teks-bantu md:hidden">
        Langkah {sekarang.langkah} dari {ALUR.length} ·{' '}
        <span className="font-semibold text-tinta">{sekarang.pendek}</span>
      </p>
      <ol className="hidden items-center gap-3 md:flex">
        {ALUR.map((a, i) => {
          const isAktif = a.id === aktif
          return (
            <li key={a.id} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-garis" />}
              <Link
                to={tautanAlur(a.to, search)}
                aria-current={isAktif ? 'step' : undefined}
                className={`tekan inline-flex min-h-11 items-center gap-2 rounded-md text-sm ${
                  isAktif ? 'font-semibold text-tinta' : 'text-tinta-redup hover:text-tinta'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.8125rem] ${
                    isAktif ? 'bg-tinta text-putih' : 'border border-garis'
                  }`}
                >
                  {a.langkah}
                </span>
                <span>
                  <span className="sr-only">Langkah {a.langkah}: </span>
                  {a.pendek}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
