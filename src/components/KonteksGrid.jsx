import { Link } from 'react-router-dom'
import { formatAngka, formatPoin } from '../lib/format'

export default function KonteksGrid({ items, judul = 'Konteks yang perlu diperiksa' }) {
  if (!items || !items.length) return null
  return (
    <section className="mt-12 rounded-lg border border-garis bg-putih p-5">
      <h2 className="subjudul text-tinta">{judul}</h2>
      <div className="mt-4 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta" tabIndex={0} role="region" aria-label="Tabel konteks provinsi">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-garis text-tinta-redup">
              <th className="py-2 pr-4 font-medium">Indikator</th>
              <th className="py-2 pr-4 font-medium">Provinsi</th>
              <th className="py-2 pr-4 font-medium">Nasional</th>
              <th className="py-2 font-medium">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label} className="border-b border-garis last:border-0 align-top">
                <td className="py-2 pr-4 text-tinta">
                  <span className="font-semibold">{item.label}</span>
                  {item.catatan && (
                    <span className="mt-0.5 block text-xs text-tinta-redup">{item.catatan}</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-tinta">
                  {item.nilai === null
                    ? 'Data belum tersedia'
                    : `${formatAngka(item.nilai, 2)}${item.satuan || ''}`}
                </td>
                <td className="py-2 pr-4 text-tinta">
                  {item.nasional === null ? '-' : `${formatAngka(item.nasional, 2)}${item.satuan || ''}`}
                </td>
                <td className="py-2 text-tinta">
                  {item.selisih === null || item.selisih === undefined
                    ? '-'
                    : `${formatPoin(Math.abs(item.selisih), 2)} ${item.selisih >= 0 ? 'di atas' : 'di bawah'}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="teks-bantu mt-3 max-w-[68ch]">
        Angka-angka ini membantu membaca konteks dan tidak membuktikan sebab-akibat. Arti setiap indikator ada
        di{' '}
        <Link
          to="/metode#istilah"
          className="underline decoration-garis underline-offset-2 hover:decoration-tinta"
        >
          istilah di halaman Metode
        </Link>
        .
      </p>
    </section>
  )
}
