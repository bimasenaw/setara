import { formatAngka, formatPoin } from '../lib/format'

export default function StatRow({ label, a, b, selisih, satuan = '%', catatan }) {
  return (
    <div className="border-b border-garis py-3 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-semibold text-tinta">{label}</p>
        {selisih !== null && selisih !== undefined && (
          <p className="text-sm font-semibold text-tinta">{formatPoin(Math.abs(selisih), 1)}</p>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-redup">
        {a && (
          <span>
            {a.label}:{' '}
            <span className="font-medium text-tinta">
              {a.value === null ? 'Data belum tersedia' : `${formatAngka(a.value, 2)}${satuan}`}
            </span>
          </span>
        )}
        {b && (
          <span>
            {b.label}:{' '}
            <span className="font-medium text-tinta">
              {b.value === null ? 'Data belum tersedia' : `${formatAngka(b.value, 2)}${satuan}`}
            </span>
          </span>
        )}
      </div>
      {catatan && <p className="mt-1 text-xs text-tinta-redup">{catatan}</p>}
    </div>
  )
}
