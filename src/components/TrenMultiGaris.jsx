import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { formatAngka } from '../lib/format'
import DataTable from './DataTable'

const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function TrenMultiGaris({
  data,
  lines,
  satuan = 'persen',
  ringkasan,
  namaFile = 'setara-tren.csv',
}) {
  if (!data.length || !lines.length) return null

  const allNilai = data.flatMap((d) => lines.map((l) => d[l.key])).filter((n) => typeof n === 'number')
  const max = allNilai.length ? Math.ceil((Math.max(...allNilai) + 5) / 5) * 5 : 20

  return (
    <div className="w-full">
      <div
        className="h-[300px] w-full"
        role="img"
        aria-label={ringkasan || `Grafik tren ${lines.map((l) => l.label).join(', ')}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid vertical={false} stroke={GARIS} />
            <XAxis
              dataKey="tahun"
              tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
              axisLine={{ stroke: GARIS }}
              tickLine={false}
            />
            <YAxis
              domain={[0, max]}
              tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(v) => formatAngka(v, 0)}
            />
            {lines.map((l) => (
              <Line
                key={l.key}
                type="linear"
                dataKey={l.key}
                name={l.label}
                stroke={l.color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: l.color, strokeWidth: 0 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tinta-redup">
        {lines.map((l) => (
          <span key={l.key} className="flex items-center gap-2">
            <span
              className="inline-block h-0.5 w-5 shrink-0"
              style={{ backgroundColor: l.color }}
              aria-hidden="true"
            />
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
        kolom={[
          { key: 'tahun', label: 'Tahun' },
          ...lines.map((l) => ({ key: l.key, label: l.label })),
        ]}
      />
    </div>
  )
}
