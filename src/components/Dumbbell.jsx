import { useMeasure } from '../lib/useMeasure'
import { formatAngka } from '../lib/format'
import DataTable from './DataTable'

function niceMax(v) {
  if (v <= 0) return 10
  return Math.ceil(v / 10) * 10
}

const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA = '#18212C'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function Dumbbell({ items, pembandingNama, tertinggalNama, satuan = '%', ringkasan }) {
  const [ref, width] = useMeasure()

  const nilai = items.flatMap((it) => [it.pembanding, it.tertinggal]).filter((n) => n !== null)
  const max = niceMax(Math.max(0, ...nilai))

  const rowH = 60
  const axisH = 28
  const plotLeft = 46
  const plotRightPad = 88

  const height = items.length * rowH + axisH

  const plotRight = Math.max(plotLeft + 60, width - plotRightPad)
  const plotWidth = plotRight - plotLeft

  const x = (v) => (v === null ? null : plotLeft + (v / max) * plotWidth)

  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={
            ringkasan ||
            `Grafik dumbbell ${pembandingNama} dan ${tertinggalNama}. Angka di kanan adalah selisih dalam poin persentase.`
          }
        >
          {items.map((it, i) => {
            const y = i * rowH + rowH / 2
            const xa = x(it.pembanding)
            const xb = x(it.tertinggal)
            const gap = it.tertinggal !== null && it.pembanding !== null ? it.tertinggal - it.pembanding : null

            return (
              <g key={it.label}>
                <text
                  x={plotLeft - 12}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="0.9375rem"
                  fontWeight={600}
                  fill={TINTA}
                >
                  {it.label}
                </text>

                {xa !== null && xb !== null && (
                  <line x1={xa} y1={y} x2={xb} y2={y} stroke={TINTA_REDUP} strokeWidth={4} strokeLinecap="round" />
                )}

                {xa !== null && (
                  <g>
                    <circle cx={xa} cy={y} r={7} fill={BIRU} />
                    <circle cx={xa} cy={y} r={2.5} fill="#FFFFFF" />
                  </g>
                )}

                {xb !== null && (
                  <rect x={xb - 7} y={y - 7} width={14} height={14} fill={MERAH} />
                )}

                {gap !== null && (
                  <text
                    x={plotRight + 8}
                    y={y}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize="0.875rem"
                    fontWeight={700}
                    fill={TINTA}
                  >
                    {`${gap >= 0 ? '+' : '−'}${formatAngka(Math.abs(gap), 1)} poin`}
                  </text>
                )}
              </g>
            )
          })}

          <line x1={plotLeft} y1={items.length * rowH} x2={plotRight} y2={items.length * rowH} stroke={GARIS} strokeWidth={1} />

          {ticks.map((t) => {
            const tx = x(t)
            const isLast = t === max
            return (
              <g key={t}>
                <line x1={tx} y1={items.length * rowH} x2={tx} y2={items.length * rowH + 4} stroke={GARIS} strokeWidth={1} />
                <text
                  x={tx}
                  y={items.length * rowH + 16}
                  textAnchor={isLast ? 'end' : t === 0 ? 'start' : 'middle'}
                  fontSize="0.75rem"
                  fill={TINTA_REDUP}
                >
                  {`${formatAngka(t, 0)}${satuan}`}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="mt-2 space-y-1 text-sm leading-relaxed text-tinta-redup">
          <p>Angka di kanan tiap jenjang adalah selisih antara kedua kelompok dalam poin persentase.</p>
          <p className="flex items-start gap-2">
            <span className="mt-1 inline-block h-3 w-3 shrink-0 bg-merah" aria-hidden="true" />
            <span>
              {tertinggalNama} (kelompok yang lebih tertinggal).
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span
              className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full bg-biru"
              aria-hidden="true"
            />
            <span>
              {pembandingNama} (pembanding).
            </span>
          </p>
        </div>
        <DataTable
          judul="Lihat data dumbbell"
          namaFile="setara-dumbbell.csv"
          baris={items.map((it) => ({
            jenjang: it.label,
            pembanding: it.pembanding,
            tertinggal: it.tertinggal,
            selisih:
              it.pembanding !== null && it.tertinggal !== null
                ? `${it.tertinggal - it.pembanding >= 0 ? '+' : '−'}${formatAngka(
                    Math.abs(it.tertinggal - it.pembanding),
                    2,
                  )} poin`
                : null,
          }))}
          kolom={[
            { key: 'jenjang', label: 'Jenjang' },
            { key: 'pembanding', label: pembandingNama },
            { key: 'tertinggal', label: tertinggalNama },
            { key: 'selisih', label: 'Selisih' },
          ]}
        />
        </>
      )}
    </div>
  )
}
