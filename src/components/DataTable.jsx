import { downloadCsv } from '../lib/ekspor'

export default function DataTable({ judul = 'Lihat data (tabel)', kolom, baris, namaFile, catatan }) {
  if (!baris || !baris.length) return null
  const rows = baris.map((row) => {
    const out = {}
    for (const k of kolom) {
      out[k.key] = typeof k.nilai === 'function' ? k.nilai(row) : row[k.key]
    }
    return out
  })

  return (
    <details className="mt-3 rounded-lg border border-garis bg-kertas p-3 text-sm">
      <summary className="cursor-pointer font-semibold text-tinta">{judul}</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-garis text-tinta-redup">
              {kolom.map((k) => (
                <th key={k.key} className="py-2 pr-4 font-medium">
                  {k.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-garis last:border-0">
                {kolom.map((k) => (
                  <td key={k.key} className="py-2 pr-4 text-tinta">
                    {row[k.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {catatan && <p className="mt-2 text-xs text-tinta-redup">{catatan}</p>}
      <button
        type="button"
        onClick={() => downloadCsv(namaFile || 'setara-data.csv', rows, kolom)}
        className="mt-3 min-h-11 rounded-lg border border-garis bg-putih px-3 text-sm text-tinta hover:bg-kertas"
      >
        Unduh CSV
      </button>
    </details>
  )
}
