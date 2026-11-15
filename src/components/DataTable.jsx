import { downloadCsv } from '../lib/ekspor'

// Tabel di balik setiap grafik. Labelnya sama di semua grafik, dan gayanya sama dengan CaraMembaca.
export default function DataTable({ judul = 'Lihat angka dalam tabel', kolom, baris, namaFile, catatan }) {
  if (!baris || !baris.length) return null
  const rows = baris.map((row) => {
    const out = {}
    for (const k of kolom) {
      out[k.key] = typeof k.nilai === 'function' ? k.nilai(row) : row[k.key]
    }
    return out
  })

  return (
    <details className="group mt-3 text-sm">
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
        {judul}
      </summary>
      <div
        className="mt-1 overflow-x-auto rounded-lg border border-garis bg-putih px-3 group-open:animate-[muncul_150ms_ease-out] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
        tabIndex={0}
        role="region"
        aria-label="Tabel data"
      >
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
                    {row[k.key] ?? '-'}
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
