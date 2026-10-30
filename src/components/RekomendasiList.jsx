import { refs } from '../lib/solusi'
import Accordion from './Accordion'

export default function RekomendasiList({ items, judul = 'Rekomendasi kontekstual' }) {
  if (!items || !items.length) return null
  return (
    <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
      <h2 className="text-base font-semibold text-tinta">{judul}</h2>
      <ol className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={`${item.judul}-${i}`} className="border-b border-garis pb-4 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-kertas px-2 py-0.5 text-xs font-semibold text-tinta-redup">
                {item.prioritas}
              </span>
              <h3 className="text-sm font-semibold text-tinta">
                {i + 1}. {item.judul}
              </h3>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-tinta">{item.solusi}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-tinta-redup">{item.dasar}</p>
            <ul className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-tinta-redup">
              {refs(item.sumber).map((r) => (
                <li key={r.id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-garis underline-offset-2 hover:text-tinta"
                  >
                    {r.referensi}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <Accordion judul="Bagaimana rekomendasi ini disusun?">
        <p>
          Rekomendasi mengikuti aturan sederhana dari data provinsi. Contohnya, jika partisipasi PAUD
          rendah dan kemiskinan tinggi, prioritas diarahkan ke perluasan PAUD dan bantuan biaya.
        </p>
        <p>
          Setiap poin menyertakan studi pendukung. Ini bukan model prediksi dan tidak menjamin hasil
          tertentu. Rekomendasi sebaiknya dibaca bersama konteks daerah.
        </p>
      </Accordion>
    </section>
  )
}
