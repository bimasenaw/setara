import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatAngka } from '../lib/format'
import DataTable from './DataTable'
import { skalaRapi } from './skala'
import TooltipGrafik, { PenandaGaris } from './TooltipGrafik'

const TINTA = '#18212C'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

// Label nama garis di titik terakhir yang punya nilai, supaya identitas tidak bergantung warna saja.
function labelUjung(nama, indeksAkhir) {
  return function LabelUjung({ x, y, index }) {
    if (index !== indeksAkhir || x == null || y == null) return null
    return (
      <text x={x + 8} y={y} dy="0.35em" fontSize="0.75rem" fontWeight={600} fill={TINTA}>
        {nama}
      </text>
    )
  }
}

export default function TrenMultiGaris({
  data,
  lines,
  satuan = 'persen',
  ringkasan,
  namaFile = 'setara-tren.csv',
}) {
  if (!data.length || !lines.length) return null

  const allNilai = data.flatMap((d) => lines.map((l) => d[l.key])).filter((n) => typeof n === 'number')
  const skala = skalaRapi(allNilai.length ? Math.max(...allNilai) : 20)
  const pola = Object.fromEntries(lines.map((l) => [l.key, l.pola]))
  const panjangLabel = Math.max(...lines.map((l) => String(l.label).length))

  return (
    <div className="w-full">
      <div
        className="h-[300px] w-full"
        role="img"
        aria-label={ringkasan || `Grafik tren ${lines.map((l) => l.label).join(', ')}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: Math.min(120, 16 + panjangLabel * 7), bottom: 8, left: 8 }}
          >
            <CartesianGrid vertical={false} stroke={GARIS} />
            <XAxis
              dataKey="tahun"
              tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
              axisLine={{ stroke: GARIS }}
              tickLine={false}
            />
            <YAxis
              domain={[0, skala.maks]}
              ticks={skala.ticks}
              tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(v) => formatAngka(v, skala.desimal)}
            />
            <Tooltip
              cursor={{ stroke: TINTA_REDUP, strokeWidth: 1 }}
              content={<TooltipGrafik satuan={satuan === 'persen' ? '%' : ' poin'} pola={pola} />}
            />
            {lines.map((l) => {
              let akhir = -1
              data.forEach((d, i) => {
                if (typeof d[l.key] === 'number') akhir = i
              })
              return (
                <Line
                  key={l.key}
                  type="linear"
                  dataKey={l.key}
                  name={l.label}
                  stroke={l.color}
                  strokeWidth={2}
                  strokeDasharray={l.pola}
                  dot={{ r: 4, fill: l.color, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: l.color, stroke: '#fff', strokeWidth: 2 }}
                  connectNulls
                  isAnimationActive={false}
                >
                  <LabelList dataKey={l.key} content={labelUjung(l.label, akhir)} />
                </Line>
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tinta-redup">
        {lines.map((l) => (
          <span key={l.key} className="flex items-center gap-2" data-garis={l.key}>
            <PenandaGaris warna={l.color} pola={l.pola} />
            {l.label}
          </span>
        ))}
        <span>Satuan: {satuan}.</span>
      </div>

      <DataTable
        judul="Lihat data tren"
        namaFile={namaFile}
        baris={data.map((d) => {
          const row = { tahun: d.tahun }
          for (const l of lines) row[l.key] = formatAngka(d[l.key], 2)
          return row
        })}
        kolom={[{ key: 'tahun', label: 'Tahun' }, ...lines.map((l) => ({ key: l.key, label: l.label }))]}
      />
    </div>
  )
}
