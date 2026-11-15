import { DaftarRujukan } from './TombolRujukan'

// Rekomendasi kontekstual satu provinsi. Rujukan berupa tombol yang membuka kutipan buktinya,
// jadi daftar pustaka panjang tidak ditampilkan di sini.
export default function RekomendasiList({ items, judul = 'Rekomendasi kontekstual' }) {
  if (!items || !items.length) return null
  return (
    <section className="mt-12 border-t border-garis pt-6">
      <h2 className="subjudul text-tinta">{judul}</h2>
      <p className="teks-bantu mt-1 max-w-[68ch]">
        Langkah yang paling relevan menurut data provinsi ini. Bukan model prediksi dan tidak menjamin hasil
        tertentu; baca bersama konteks daerah.
      </p>
      <ol className="mt-2">
        {items.map((item, i) => (
          <li key={`${item.judul}-${i}`} className="border-b border-garis py-4 last:border-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-putih px-2 py-0.5 text-xs font-semibold text-tinta-redup">
                {item.prioritas}
              </span>
              <h3 className="text-base font-semibold text-tinta">
                {i + 1}. {item.judul}
              </h3>
            </div>
            <p className="mt-1.5 max-w-[68ch] text-base leading-relaxed text-tinta">{item.solusi}</p>
            <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-tinta-redup">{item.dasar}</p>
            <DaftarRujukan
              sumber={item.sumber}
              tempat={`profil.${item.judul}`}
              label="Bukti:"
              className="mt-1.5"
            />
          </li>
        ))}
      </ol>
    </section>
  )
}
