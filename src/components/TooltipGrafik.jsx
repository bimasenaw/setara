import { formatAngka } from '../lib/format'

// Tooltip grafik garis: tahun di atas, lalu nilai setiap garis. Teks memakai warna tinta;
// warna garis hanya ada di penanda kecil di samping nama.
export function PenandaGaris({ warna, pola, lebar = 20 }) {
  return (
    <svg aria-hidden="true" width={lebar} height="8" className="shrink-0">
      <line x1="0" y1="4" x2={lebar} y2="4" stroke={warna} strokeWidth="2" strokeDasharray={pola} />
    </svg>
  )
}

export default function TooltipGrafik({ active, payload, label, satuan = '%', desimal = 2, pola = {} }) {
  if (!active || !payload?.length) return null
  const isi = payload.filter((p) => typeof p.value === 'number')
  if (!isi.length) return null
  return (
    <div className="min-w-[9rem] rounded-lg border border-garis bg-putih px-3 py-2 text-sm shadow-[0_4px_16px_rgb(24_33_44/0.12)]">
      <p className="font-semibold text-tinta">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {isi.map((p) => (
          <li key={p.dataKey} className="flex items-center gap-2 text-tinta-redup">
            <PenandaGaris warna={p.color || p.stroke} pola={pola[p.dataKey]} lebar={14} />
            <span className="flex-1">{p.name}</span>
            <span className="font-medium tabular-nums text-tinta">
              {formatAngka(p.value, desimal)}
              {satuan}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
