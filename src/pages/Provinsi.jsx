import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { kalimatProvinsi } from '../lib/temuan'
import TahunSelect from '../components/TahunSelect'
import DotPlotProvinsi from '../components/DotPlotProvinsi'
import { Muat, Gagal } from '../components/StatusBox'
import { formatAngka } from '../lib/format'

const REKOMENDASI = [
  'Prioritaskan intervensi pendidikan usia dini di Papua dan provinsi dengan partisipasi terendah.',
  'Perluas akses jenjang menengah di perdesaan dan keluarga kuintil terbawah, tempat angka anak tidak sekolah paling tinggi.',
  'Gunakan data BPS sebagai dasar target per provinsi, bukan rata-rata nasional yang menyembunyikan kesenjangan.',
]

function selisihNasional(nilai, nasional) {
  if (nilai === null || nasional === null) return null
  return nilai - nasional
}

export default function Provinsi() {
  const { status, provinsi, error } = useData()
  const [params, setParams] = useSearchParams()

  const tahunTersedia = [
    ...new Set(provinsi.provinsi.map((p) => p.tahun)),
  ].sort((a, b) => a - b)

  const tahunParam = Number(params.get('tahun'))
  const tahun = tahunTersedia.includes(tahunParam)
    ? tahunParam
    : tahunTersedia[tahunTersedia.length - 1]

  const [sort, setSort] = useState({ key: 'nilai', dir: 'asc' })

  const nasional = provinsi.nasional.find((n) => n.tahun === tahun)?.nilai ?? null

  const baris = useMemo(() => {
    const list = provinsi.provinsi
      .filter((p) => p.tahun === tahun)
      .map((p) => ({
        ...p,
        selisih: selisihNasional(p.nilai, nasional),
      }))

    const key = sort.key
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const va = a[key]
      const vb = b[key]
      if (va === null && vb === null) return a.provinsi.localeCompare(b.provinsi)
      if (va === null) return 1
      if (vb === null) return -1
      if (typeof va === 'string') return va.localeCompare(vb) * dir
      return (va - vb) * dir
    })
  }, [provinsi, tahun, nasional, sort])

  const terendah = [...baris]
    .filter((p) => p.nilai !== null)
    .sort((a, b) => a.nilai - b.nilai)
    .slice(0, 5)

  const setTahun = (v) => {
    const next = new URLSearchParams(params)
    next.set('tahun', v)
    setParams(next, { replace: true })
  }

  if (status === 'loading') {
    return (
      <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <Muat />
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <Gagal message={error} onReload={() => window.location.reload()} />
      </main>
    )
  }

  const terendahPertama = terendah[0]
  const judul = terendahPertama
    ? kalimatProvinsi(terendahPertama.provinsi, terendahPertama.nilai, nasional)
    : null

  const headerSort = (key) => {
    if (sort.key === key) {
      setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' })
    } else {
      setSort({ key, dir: 'asc' })
    }
  }

  const panah = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <h1 className="max-w-[26ch] font-serif text-[28px] leading-snug text-tinta md:text-[40px]">
        {judul || 'Peringkat partisipasi pendidikan usia dini per provinsi'}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <TahunSelect options={tahunTersedia} value={tahun} onChange={setTahun} />
        <button
          type="button"
          onClick={() => setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' })}
          className="min-h-11 rounded-lg border border-garis bg-putih px-4 text-base text-tinta hover:bg-kertas"
        >
          Urut {sort.dir === 'asc' ? 'naik' : 'turun'}
        </button>
      </div>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="font-serif text-[20px] leading-snug text-tinta">
          Peringkat partisipasi pembelajaran terorganisir satu tahun sebelum SD
        </h2>
        <p className="mt-1 text-sm text-tinta-redup">
          Sumbu dimulai dari 50% agar selisih antar provinsi terbaca; garis putus-putus adalah
          nilai nasional.
        </p>
        <p className="mt-2 text-sm text-tinta-redup">
          Empat provinsi baru Papua (Papua Barat Daya, Papua Selatan, Papua Tengah, Papua
          Pegunungan) belum memiliki data pada indikator ini sehingga tidak tampil di peringkat.
        </p>
        <div className="mt-4">
          <DotPlotProvinsi provinsi={baris} nilaiNasional={nasional} />
        </div>
        <p className="mt-3 text-xs text-tinta-redup">
          Satuan: persen. Sumber: BPS, Susenas {tahun}.
        </p>
      </section>

      {terendah.length > 0 && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Prioritas intervensi</h2>
          <p className="mt-1 text-sm text-tinta-redup">
            Lima provinsi dengan partisipasi terendah; {terendah[0].provinsi} jauh di bawah provinsi
            lainnya.
          </p>
          <ul className="mt-3 space-y-1">
            {terendah.map((p, i) => (
              <li key={p.kode} className="text-sm text-tinta">
                <span className="font-semibold">{i + 1}.</span> {p.provinsi} —{' '}
                {p.nilai !== null ? `${formatAngka(p.nilai, 2)}%` : 'Data belum tersedia'}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Selisih dari nilai nasional</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-tinta-redup">
                <th className="py-2 pr-4 font-medium">
                  <button type="button" onClick={() => headerSort('provinsi')} className="min-h-11">
                    Provinsi{panah('provinsi')}
                  </button>
                </th>
                <th className="py-2 pr-4 font-medium">
                  <button type="button" onClick={() => headerSort('nilai')} className="min-h-11">
                    Nilai{panah('nilai')}
                  </button>
                </th>
                <th className="py-2 font-medium">
                  <button type="button" onClick={() => headerSort('selisih')} className="min-h-11">
                    Selisih dari nasional{panah('selisih')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {baris.map((p) => (
                <tr key={p.kode} className="border-b border-garis last:border-0">
                  <td className="py-2 pr-4 text-tinta">{p.provinsi}</td>
                  <td className="py-2 pr-4 text-tinta">
                    {p.nilai !== null ? formatAngka(p.nilai, 2) : 'Data belum tersedia'}
                  </td>
                  <td className="py-2 text-tinta">
                    {p.selisih !== null
                      ? `${p.selisih >= 0 ? '+' : '−'}${formatAngka(Math.abs(p.selisih), 2)}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Rekomendasi keputusan</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-tinta">
          {REKOMENDASI.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>
    </main>
  )
}
