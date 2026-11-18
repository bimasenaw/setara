import { DaftarRujukan } from './TombolRujukan'

// Kalimat solusi dipisah: kalimat pertama selalu tampil, sisanya (rincian bukti) dilipat.
function pisahKalimat(teks) {
  const i = teks.indexOf('. ')
  return i === -1 ? [teks, ''] : [teks.slice(0, i + 1), teks.slice(i + 2)]
}

// Rekomendasi kontekstual satu provinsi. Rujukan berupa tombol yang membuka kutipan buktinya,
// jadi daftar pustaka panjang tidak ditampilkan di sini.
export default function RekomendasiList({ items, judul = 'Rekomendasi kontekstual' }) {
  if (!items || !items.length) return null
  return (
    <section className="mt-12 border-t border-garis pt-6">
      <h2 className="subjudul text-tinta">{judul}</h2>
      <p className="teks-bantu mt-1 max-w-[68ch]">
        Langkah paling relevan menurut data provinsi ini; bukan prediksi dan tidak menjamin hasil.
      </p>
      <ol className="mt-2">
        {items.map((item, i) => {
          const [inti, rincian] = pisahKalimat(item.solusi)
          return (
            <li key={`${item.judul}-${i}`} className="border-b border-garis py-4 last:border-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-putih px-2 py-0.5 text-xs font-semibold text-tinta-redup">
                  {item.prioritas}
                </span>
                <h3 className="text-base font-semibold text-tinta">
                  {i + 1}. {item.judul}
                </h3>
              </div>
              <p className="mt-1.5 max-w-[68ch] text-base leading-relaxed text-tinta">{inti}</p>
              <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-tinta-redup">{item.dasar}</p>
              {rincian && (
                <details className="group mt-1">
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
                    Selengkapnya
                  </summary>
                  <p className="max-w-[68ch] pb-1 pl-6 text-sm leading-relaxed text-tinta-redup">{rincian}</p>
                </details>
              )}
              <DaftarRujukan
                sumber={item.sumber}
                tempat={`profil.${item.judul}`}
                label="Bukti:"
                className="mt-1.5"
              />
            </li>
          )
        })}
      </ol>
    </section>
  )
}
