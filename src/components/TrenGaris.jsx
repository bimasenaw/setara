import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { formatAngka } from '../lib/format'
import DataTable from './DataTable'

const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function TrenGaris({ data, pembandingNama, tertinggalNama, ringkasan }) {
  if (!data.length) return null

  const allNilai = data.flatMap((d) => [d.pembanding, d.tertinggal]).filter((n) => n !== null)
  const max = allNilai.length ? Math.ceil((Math.max(...allNilai) + 5) / 5) * 5 : 20

  return (
    <div className="w-full">
      <div
        className="h-[300px] w-full"
        role="img"
        aria-label={ringkasan || `Grafik tren ${pembandingNama} dan ${tertinggalNama}.`}
      >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid vertical={false} stroke={GARIS} />
          <XAxis
            dataKey="tahun"
            tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
            axisLine={{ stroke: GARIS }}
            tickLine={false}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            domain={[0, max]}
            ticks={[0, max / 4, max / 2, (3 * max) / 4, max].map((t) => Math.round(t * 10) / 10)}
            tick={{ fontSize: '0.75rem', fill: TINTA_REDUP }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) => formatAngka(v, 0)}
          />
          <Line
            type="linear"
            dataKey="pembanding"
            name={pembandingNama}
            stroke={BIRU}
            strokeWidth={2.5}
            dot={{ r: 4, fill: BIRU, strokeWidth: 0 }}
          >
            <LabelList
              dataKey="pembanding"
              position="bottom"
              fontSize="0.6875rem"
              fill={TINTA_REDUP}
              formatter={(v) => (v === null || v === undefined || Number.isNaN(v) ? '' : formatAngka(v, 1))}
            />
          </Line>
          <Line
            type="linear"
            dataKey="tertinggal"
            name={tertinggalNama}
            stroke={MERAH}
            strokeWidth={2.5}
            dot={{ r: 4, fill: MERAH, strokeWidth: 0 }}
          >
            <LabelList
              dataKey="tertinggal"
              position="top"
              fontSize="0.6875rem"
              fill={TINTA_REDUP}
              formatter={(v) => (v === null || v === undefined || Number.isNaN(v) ? '' : formatAngka(v, 1))}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
      </div>
      <DataTable
        judul="Lihat data tren"
        namaFile="setara-tren.csv"
        baris={data.map((d) => ({
          tahun: d.tahun,
          pembanding: formatAngka(d.pembanding, 2),
          tertinggal: formatAngka(d.tertinggal, 2),
          selisih:
            d.pembanding !== null && d.tertinggal !== null
              ? `${formatAngka(d.tertinggal - d.pembanding, 2)} poin`
              : null,
        }))}
        kolom={[
          { key: 'tahun', label: 'Tahun' },
          { key: 'pembanding', label: pembandingNama },
          { key: 'tertinggal', label: tertinggalNama },
          { key: 'selisih', label: 'Selisih' },
        ]}
      />
    </div>
  )
}
