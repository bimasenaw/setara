import { useMeasure } from '../lib/useMeasure'
import { formatAngka } from '../lib/format'

function niceMax(v) {
  if (v <= 0) return 10
  return Math.ceil(v / 10) * 10
}

const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA = '#18212C'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function Dumbbell({ items, pembandingNama, tertinggalNama, satuan = '%' }) {
  const [ref, width] = useMeasure()

  const nilai = items.flatMap((it) => [it.pembanding, it.tertinggal]).filter((n) => n !== null)
  const max = niceMax(Math.max(0, ...nilai))

  const rowH = 60
  const axisH = 28
  const keyH = 24
  const plotLeft = 46
  const plotRightPad = 88

  const height = items.length * rowH + axisH + keyH

  const plotRight = Math.max(plotLeft + 60, width - plotRightPad)
  const plotWidth = plotRight - plotLeft

  const x = (v) => (v === null ? null : plotLeft + (v / max) * plotWidth)

  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Grafik dumbbell ${pembandingNama} dan ${tertinggalNama}.`}
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
                  fontSize={15}
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
                    fontSize={14}
                    fontWeight={700}
                    fill={TINTA}
                  >
                    {`+${formatAngka(gap, 1)} poin`}
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
                  fontSize={12}
                  fill={TINTA_REDUP}
                >
                  {`${formatAngka(t, 0)}${satuan}`}
                </text>
              </g>
            )
          })}

          <g transform={`translate(${plotLeft}, ${items.length * rowH + axisH + 6})`}>
            <circle cx={7} cy={9} r={6} fill={BIRU} />
            <text x={18} y={13} fontSize={13} fill={TINTA} dominantBaseline="middle">
              {pembandingNama}
            </text>
            <rect x={54} y={3} width={12} height={12} fill={MERAH} />
            <text x={72} y={13} fontSize={13} fill={TINTA} dominantBaseline="middle">
              {tertinggalNama}
            </text>
          </g>
        </svg>
      )}
    </div>
  )
}
