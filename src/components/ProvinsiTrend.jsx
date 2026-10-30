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

const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

export default function ProvinsiTrend({ data, namaProvinsi = 'Provinsi', label = 'Nilai', satuan = '' }) {
  if (!data.length) return null
  const nilai = data.flatMap((d) => [d.provinsi, d.nasional]).filter((n) => typeof n === 'number')
  const max = nilai.length ? Math.ceil((Math.max(...nilai) + 5) / 5) * 5 : 100

  return (
    <div className="w-full">
      <div
        className="h-[280px] w-full"
        role="img"
        aria-label={`Grafik tren ${label} ${namaProvinsi} dibanding nasional.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 16, bottom: 8, left: 8 }}>
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
            <Line
              type="linear"
              dataKey="nasional"
              name="Nasional"
              stroke={BIRU}
              strokeWidth={2}
              dot={{ r: 3, fill: BIRU, strokeWidth: 0 }}
              connectNulls
            />
            <Line
              type="linear"
              dataKey="provinsi"
              name={namaProvinsi}
              stroke={MERAH}
              strokeWidth={2.5}
              dot={{ r: 3, fill: MERAH, strokeWidth: 0 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-sm text-tinta-redup">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-merah" aria-hidden="true" />
          {namaProvinsi}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-biru" aria-hidden="true" />
          Nasional
        </span>
        <span>Satuan: {satuan || 'nilai'}.</span>
      </div>
      <DataTable
        judul="Lihat data tren provinsi"
        namaFile="setara-tren-provinsi.csv"
        baris={data.map((d) => ({
          tahun: d.tahun,
          provinsi: formatAngka(d.provinsi, 2),
          nasional: formatAngka(d.nasional, 2),
          selisih:
            typeof d.provinsi === 'number' && typeof d.nasional === 'number'
              ? `${formatAngka(d.provinsi - d.nasional, 2)} poin`
              : null,
        }))}
        kolom={[
          { key: 'tahun', label: 'Tahun' },
          { key: 'provinsi', label: namaProvinsi },
          { key: 'nasional', label: 'Nasional' },
          { key: 'selisih', label: 'Selisih' },
        ]}
      />
    </div>
  )
}
