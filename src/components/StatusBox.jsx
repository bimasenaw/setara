export function Muat() {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="space-y-3 rounded-lg border border-garis bg-putih p-6"
    >
      <div className="h-5 w-1/3 animate-pulse rounded bg-garis" />
      <div className="h-40 animate-pulse rounded bg-kertas" />
    </div>
  )
}

export function Gagal({ message, onReload }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-garis bg-putih p-6 text-tinta"
    >
      <p className="font-semibold">Gagal memuat data.</p>
      <p className="mt-1 text-tinta-redup">{message}</p>
      {onReload && (
        <button
          type="button"
          onClick={onReload}
          className="mt-4 min-h-11 rounded-lg bg-tinta px-4 text-putih hover:bg-tinta-redup"
        >
          Muat ulang
        </button>
      )}
    </div>
  )
}

export function BelumTersedia({ alasan }) {
  return (
    <p className="text-tinta-redup">
      Data belum tersedia{alasan ? `: ${alasan}` : ''}.
    </p>
  )
}
