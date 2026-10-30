import { useState } from 'react'
import { formatAngka } from '../lib/format'
import { nilaiTerbaru } from '../lib/indikator'

const INDIKATOR = [
  { label: 'Partisipasi usia SMA', indikator: 'aps', jenjang: 'SMA', satuan: '%' },
  { label: 'APK PAUD 3–6', indikator: 'apk_paud', kelompok: 'Total', satuan: '%' },
  { label: 'Rata-rata lama sekolah', indikator: 'lama_sekolah', kelompok: '15+', satuan: ' tahun' },
  { label: 'Penduduk miskin', indikator: 'kemiskinan', kelompok: 'Jumlah', satuan: '%' },
  { label: 'IPM', indikator: 'ipm', kelompok: 'Total', satuan: '' },
  { label: 'Indeks ketimpangan gender', indikator: 'ikg', kelompok: 'Total', satuan: '' },
]

export default function BandingProvinsi({ rows, provinsiList, defaultA, defaultB }) {
  const [a, setA] = useState(defaultA || provinsiList[0]?.kode || '')
  const [b, setB] = useState(defaultB || provinsiList[1]?.kode || '')

  if (!provinsiList.length) return null

  const namaA = provinsiList.find((p) => p.kode === a)?.provinsi || 'Provinsi A'
  const namaB = provinsiList.find((p) => p.kode === b)?.provinsi || 'Provinsi B'

  const data = INDIKATOR.map((item) => {
    const va = nilaiTerbaru(rows, { ...item, kode: a })
    const vb = nilaiTerbaru(rows, { ...item, kode: b })
    return {
      ...item,
      va: va.nilai,
      vb: vb.nilai,
      selisih: va.nilai !== null && vb.nilai !== null ? va.nilai - vb.nilai : null,
      tahun: va.tahun || vb.tahun,
    }
  })

  return (
    <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
      <h2 className="text-base font-semibold text-tinta">Bandingkan dua provinsi</h2>
      <p className="mt-1 text-sm text-tinta-redup">
        Perbandingan indikator terbaru yang tersedia. Selisih dihitung provinsi pertama dikurangi
        provinsi kedua.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-tinta">
          <span className="text-tinta-redup">Provinsi A</span>
          <select
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-base text-tinta focus:outline-none focus:ring-2 focus:ring-biru"
          >
            {provinsiList.map((p) => (
              <option key={p.kode} value={p.kode}>
                {p.provinsi}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-tinta">
          <span className="text-tinta-redup">Provinsi B</span>
          <select
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-base text-tinta focus:outline-none focus:ring-2 focus:ring-biru"
          >
            {provinsiList.map((p) => (
              <option key={p.kode} value={p.kode}>
                {p.provinsi}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-garis text-tinta-redup">
              <th className="py-2 pr-4 font-medium">Indikator</th>
              <th className="py-2 pr-4 font-medium">{namaA}</th>
              <th className="py-2 pr-4 font-medium">{namaB}</th>
              <th className="py-2 font-medium">Selisih</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-b border-garis last:border-0">
                <td className="py-2 pr-4 text-tinta">
                  {d.label}
                  {d.tahun && <span className="ml-1 text-xs text-tinta-redup">({d.tahun})</span>}
                </td>
                <td className="py-2 pr-4 text-tinta">
                  {d.va === null ? '—' : `${formatAngka(d.va, 2)}${d.satuan}`}
                </td>
                <td className="py-2 pr-4 text-tinta">
                  {d.vb === null ? '—' : `${formatAngka(d.vb, 2)}${d.satuan}`}
                </td>
                <td className="py-2 text-tinta">
                  {d.selisih === null
                    ? '—'
                    : `${d.selisih >= 0 ? '+' : '−'}${formatAngka(Math.abs(d.selisih), 2)} poin`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
