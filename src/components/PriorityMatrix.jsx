import { Link } from 'react-router-dom'
import { formatAngka, formatPoin } from '../lib/format'
import { labelKategori } from '../lib/prioritas'
import { tautanProvinsi } from '../lib/params'

const URUTAN = ['Mendesak', 'Membaik', 'Pantau', 'Berhasil']

export default function PriorityMatrix({ data, tahun }) {
  if (!data || !data.length) return null
  return (
    <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
      <h2 className="text-base font-semibold text-tinta">Matriks prioritas provinsi</h2>
      <p className="mt-1 text-sm text-tinta-redup">
        Berdasarkan level partisipasi usia SMA dan perubahan sejak 2019. Kuadran dibagi memakai median
        provinsi; ini alat bantu prioritas, bukan penilaian kinerja resmi.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {URUTAN.map((kategori) => {
          const items = data.filter((d) => d.kategori === kategori)
          return (
            <div key={kategori} className="rounded-lg border border-garis bg-kertas p-3">
              <h3 className="text-sm font-semibold text-tinta">{labelKategori(kategori)}</h3>
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
    </section>
  )
}
