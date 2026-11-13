import { Link, useLocation } from 'react-router-dom'
import { ALUR, langkahAlur, tautanAlur } from '../content/alur'

// Penutup halaman cerita: satu tautan ke pertanyaan berikutnya, filter ikut terbawa.
export default function LangkahBerikutnya({ ke }) {
  const { search } = useLocation()
  const tujuan = langkahAlur(ke)
  if (!tujuan) return null

  return (
    <nav aria-label="Langkah berikutnya" className="mt-12 border-t border-garis pt-6 print:hidden">
      <Link
        to={tautanAlur(tujuan.to, search)}
        className="tekan group block max-w-[68ch] rounded-lg py-2"
      >
        <span className="teks-bantu block">
          Langkah berikutnya · {tujuan.langkah} dari {ALUR.length}
        </span>
        <span className="mt-1 block font-serif text-[1.5rem] font-semibold leading-snug tracking-[-0.01em] text-tinta underline decoration-garis decoration-2 underline-offset-4 group-hover:decoration-tinta">
          {tujuan.pertanyaan}
        </span>
        <span className="mt-1 block text-base leading-relaxed text-tinta-redup">{tujuan.ajakan}</span>
      </Link>
    </nav>
  )
}
