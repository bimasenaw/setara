import { Link } from 'react-router-dom'
import { formatAngka, formatPoin } from '../lib/format'
import { labelKategori } from '../lib/prioritas'
import { tautanProvinsi } from '../lib/params'

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
  return (
    <section className="mt-12 border-t border-garis pt-6">
      <h2 className="subjudul text-tinta">Tertinggal dan memburuk, atau tertinggal tetapi membaik?</h2>
      <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-tinta">
        Dari {data.length} provinsi, {data.filter((d) => d.kategori === 'Mendesak').length} berada di kuadran
        mendesak: partisipasi SMA-nya di bawah nilai tengah dan tidak membaik sejak{' '}
        {data[0]?.tahunAwal ?? 2019}.
      </p>
      <SebaranKuadran data={data} />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {URUTAN.map((kategori) => {
          const items = data.filter((d) => d.kategori === kategori)
          return (
            <div
              key={kategori}
              id={idKuadran(kategori)}
              className="scroll-mt-24 rounded-lg border border-garis bg-putih p-3"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-tinta">
                <Swatch kategori={kategori} />
                {labelKategori(kategori)}
              </h3>
              {items.length ? (
                <ul className="mt-2 space-y-1 text-sm text-tinta">
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
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-tinta-redup">Tidak ada provinsi di kuadran ini.</p>
              )}
            </div>
          )
        })}
      </div>
      <p className="teks-bantu mt-3 max-w-[68ch]">
        Kuadran ditentukan oleh tingkat partisipasi SMA terbaru dan perubahannya sejak{' '}
        {data[0]?.tahunAwal ?? 2019}. Ini alat bantu prioritas, bukan penilaian resmi terhadap kinerja
        provinsi.
      </p>
    </section>
  )
}
