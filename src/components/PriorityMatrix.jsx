import { Link } from 'react-router-dom'
import { formatAngka, formatPoin } from '../lib/format'
import { labelKategori } from '../lib/prioritas'
import { tautanProvinsi } from '../lib/params'
import { CATATAN_PEMEKARAN_UMUM, jenisPemekaran, tahunAwalUmum } from './pemekaran'

const URUTAN = ['Mendesak', 'Membaik', 'Pantau', 'Berhasil']

// Merah = mendesak (sama dengan lima teratas di grafik prioritas); biru makin terang = makin baik.
// Diuji dengan validator palet dataviz; biru terang selalu disertai label teks.
const WARNA_KUADRAN = {
  Mendesak: { latar: '#c2372d', teks: 'text-putih' },
  Membaik: { latar: '#2E5F9E', teks: 'text-putih' },
  Pantau: { latar: '#5C8DC9', teks: 'text-putih' },
  Berhasil: { latar: '#A9C2E2', teks: 'text-tinta' },
}

const idKuadran = (kategori) => `kuadran-${kategori.toLowerCase()}`

function Swatch({ kategori }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 shrink-0 rounded-[3px]"
      style={{ background: WARNA_KUADRAN[kategori].latar }}
    />
  )
}

// Satu batang tersegmen: 38 provinsi dibagi habis ke empat kuadran, lebar sebanding jumlah.
export function SebaranKuadran({ data }) {
  const isi = URUTAN.map((k) => ({
    kategori: k,
    jumlah: data.filter((d) => d.kategori === k).length,
  })).filter((x) => x.jumlah > 0)
  const ringkas = `Sebaran ${data.length} provinsi: ${isi
    .map((x) => `${x.jumlah} ${labelKategori(x.kategori).toLowerCase()}`)
    .join('; ')}.`
  return (
    <figure className="mt-4">
      <div role="group" aria-label={ringkas} className="flex h-10 gap-0.5">
        {isi.map(({ kategori, jumlah }) => {
          const w = WARNA_KUADRAN[kategori]
          return (
            <a
              key={kategori}
              href={`#${idKuadran(kategori)}`}
              onClick={() => {
                // Kotak tujuan mungkin terlipat: buka dulu sebelum digulir ke sana.
                const kotak = document.getElementById(idKuadran(kategori))
                if (kotak) kotak.open = true
              }}
              aria-label={`${labelKategori(kategori)}: ${jumlah} provinsi`}
              data-kuadran={kategori}
              data-jumlah={jumlah}
              className={`flex min-w-0 items-center justify-center overflow-hidden rounded-[4px] text-[1.25rem] font-bold leading-none tabular-nums outline-offset-2 transition-shadow duration-150 hover:shadow-[inset_0_0_0_2px_rgb(24_33_44/0.55)] ${w.teks}`}
              style={{ flexGrow: jumlah, flexBasis: 0, background: w.latar }}
            >
              <span aria-hidden="true">{jumlah}</span>
            </a>
          )
        })}
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-tinta">
        {isi.map(({ kategori, jumlah }) => (
          <span key={kategori} className="inline-flex items-center gap-1.5">
            <Swatch kategori={kategori} />
            {labelKategori(kategori)} · <span className="font-semibold tabular-nums">{jumlah}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

export default function PriorityMatrix({ data, tahun }) {
  if (!data || !data.length) return null
  const tahunAwal = tahunAwalUmum(data) ?? 2019
  const adaPemekaran = data.some((d) => jenisPemekaran(d.kode, d.tahunAwal))
  return (
    <section className="mt-12 border-t border-garis pt-6">
      <h2 className="subjudul text-tinta">Tertinggal dan memburuk, atau tertinggal tetapi membaik?</h2>
      <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-tinta">
        Dari {data.length} provinsi, {data.filter((d) => d.kategori === 'Mendesak').length} berada di kuadran
        mendesak: partisipasi SMA-nya di bawah nilai tengah dan tidak membaik sejak {tahunAwal}
        {adaPemekaran ? ' (provinsi hasil pemekaran: sejak data pertamanya)' : ''}.
      </p>
      <SebaranKuadran data={data} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {URUTAN.map((kategori) => {
          const items = data.filter((d) => d.kategori === kategori)
          return (
            // Daftar nama dilipat; hanya kuadran mendesak yang terbuka. Batang di atas sudah memberi gambaran.
            <details
              key={kategori}
              id={idKuadran(kategori)}
              open={kategori === 'Mendesak'}
              className="group scroll-mt-24 self-start rounded-lg border border-garis bg-putih"
            >
              <summary className="tekan flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-tinta [&::-webkit-details-marker]:hidden">
                <Swatch kategori={kategori} />
                <h3 className="flex-1">{labelKategori(kategori)}</h3>
                <span className="tabular-nums text-tinta-redup">{items.length}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-4 w-4 shrink-0 text-tinta-redup transition-transform duration-150 ease-out group-open:rotate-90"
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
              </summary>
              {items.length ? (
                <ul className="space-y-1 px-3 pb-3 text-sm text-tinta">
                  {items.map((d) => (
                    <li key={d.kode} className="flex flex-wrap justify-between gap-2">
                      <Link
                        to={tautanProvinsi(d.kode, tahun)}
                        className="underline decoration-garis underline-offset-2 hover:text-tinta-redup"
                      >
                        {d.provinsi}
                      </Link>
                      <span className="text-tinta-redup">
                        {formatAngka(d.level, 1)}% · {formatPoin(d.tren, 1)}
                        {jenisPemekaran(d.kode, d.tahunAwal) && (
                          <>
                            {' '}
                            ({d.tahunAwal}–{d.tahunAkhir})<span aria-hidden="true">*</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 pb-3 text-sm text-tinta-redup">Tidak ada provinsi di kuadran ini.</p>
              )}
            </details>
          )
        })}
      </div>
      <p className="teks-bantu mt-3 max-w-[68ch]">
        Kuadran: partisipasi SMA terbaru dan perubahannya sejak {tahunAwal}. Alat bantu, bukan penilaian
        resmi.
      </p>
      {adaPemekaran && (
        <p className="teks-bantu mt-1 max-w-[68ch]">
          <span aria-hidden="true">* </span>
          {CATATAN_PEMEKARAN_UMUM}
        </p>
      )}
    </section>
  )
}
