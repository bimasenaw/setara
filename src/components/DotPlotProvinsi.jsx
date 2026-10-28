import { useMeasure } from '../lib/useMeasure'
import { formatAngka } from '../lib/format'

const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA = '#18212C'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function DotPlotProvinsi({ provinsi, nilaiNasional }) {
  const [ref, width] = useMeasure()

  const MIN = 50
  const MAX = 100

  const prioritas = [...provinsi]
    .filter((p) => p.nilai !== null)
    .sort((a, b) => a.nilai - b.nilai)
    .slice(0, 5)
    .map((p) => p.kode)

  const labelW = 150
  const valueW = 56
  const rowH = 34
  const headH = 26

  const plotLeft = labelW
  const plotRight = Math.max(plotLeft + 60, width - valueW)
  const plotWidth = plotRight - plotLeft
  const height = headH + provinsi.length * rowH

  const x = (v) => plotLeft + ((v - MIN) / (MAX - MIN)) * plotWidth

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Peringkat partisipasi pendidikan usia dini per provinsi."
        >
          {provinsi.map((p, i) => {
            const y = headH + i * rowH + rowH / 2
            const isPrioritas = prioritas.includes(p.kode)
            return (
              <g key={p.kode}>
                <text
                  x={plotLeft - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={13}
                  fill={isPrioritas ? TINTA : TINTA_REDUP}
                  fontWeight={isPrioritas ? 600 : 400}
                >
                  {p.provinsi}
                </text>

                {p.nilai !== null && (
                  <g>
                    {isPrioritas ? (
                      <rect x={x(p.nilai) - 6} y={y - 6} width={12} height={12} fill={MERAH} />
                    ) : (
                      <circle cx={x(p.nilai)} cy={y} r={5.5} fill={BIRU} />
                    )}
                    <text
                      x={plotRight + 8}
                      y={y}
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={13}
                      fill={isPrioritas ? TINTA : TINTA_REDUP}
                      fontWeight={isPrioritas ? 700 : 400}
                    >
                      {formatAngka(p.nilai, 2)}
                    </text>
                  </g>
                )}

                {p.nilai === null && (
                  <text
                    x={plotRight + 8}
                    y={y}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize={12}
                    fill={TINTA_REDUP}
                  >
                    Data belum tersedia
                  </text>
                )}
              </g>
            )
          })}

          <line x1={plotLeft} y1={headH} x2={plotRight} y2={headH} stroke={GARIS} strokeWidth={1} />

          {[50, 60, 70, 80, 90, 100].map((t) => (
            <g key={t}>
              <line x1={x(t)} y1={headH} x2={x(t)} y2={headH + 4} stroke={GARIS} strokeWidth={1} />
              <text
                x={x(t)}
                y={headH + 16}
                textAnchor={t === MIN ? 'start' : t === MAX ? 'end' : 'middle'}
                fontSize={12}
                fill={TINTA_REDUP}
              >
                {t}
              </text>
            </g>
          ))}

          {nilaiNasional !== null && (
            <g>
              <line
                x1={x(nilaiNasional)}
                y1={headH}
                x2={x(nilaiNasional)}
                y2={height}
                stroke={TINTA}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={x(nilaiNasional)}
                y={14}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill={TINTA}
              >
                Indonesia {formatAngka(nilaiNasional, 2)}
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
