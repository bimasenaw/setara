import { useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, PAIRS, perbandingan } from '../lib/metrik'
import { kalimatDimensi, kalimatAwam } from '../lib/temuan'
import SegmentedControl from '../components/SegmentedControl'
import TahunSelect from '../components/TahunSelect'
import Dumbbell from '../components/Dumbbell'
import TrenGaris from '../components/TrenGaris'
import { Muat, Gagal, BelumTersedia } from '../components/StatusBox'
import { formatAngka } from '../lib/format'

const DIMS = [
  { value: 'wilayah', label: 'Wilayah' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'gender', label: 'Gender' },
]

function Sumber({ tahun }) {
  return (
    <p className="mt-2 text-xs text-tinta-redup">
      Satuan: persen. Sumber: BPS, Susenas {tahun}.
    </p>
  )
}

export default function Kesenjangan() {
  const { status, tidakSekolah, error } = useData()
  const [params, setParams] = useSearchParams()

  const dim = params.get('tab') || 'wilayah'
  const jenjang = params.get('jenjang') || 'SMA'

  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahunParam = Number(params.get('tahun'))
  const tahun = tahunTersedia.includes(tahunParam)
    ? tahunParam
    : tahunTersedia[tahunTersedia.length - 1]

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
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

  const pair = PAIRS[dim]
  const dimLabel = DIMS.find((d) => d.value === dim)?.label

  const perJenjang = JENJANG.map((j) => ({
    jenjang: j,
    ...perbandingan(tidakSekolah, dim, j, tahun),
  }))

  const valid = perJenjang.filter((p) => p.selisih !== null)
  const terbesar = valid.reduce((m, p) => (p.selisih > (m ? m.selisih : -1) ? p : m), null)

  const judulUtama = terbesar
    ? kalimatDimensi(tidakSekolah, dim, terbesar.jenjang, tahun)
    : null

  const catatanAwam = terbesar
    ? kalimatAwam(tidakSekolah, dim, pair.tertinggal, terbesar.jenjang, tahun)
    : null

  const items = perJenjang.map((p) => ({
    label: p.jenjang,
    pembanding: p.pembanding,
    tertinggal: p.tertinggal,
  }))

  const trendData = tahunTersedia
    .map((t) => {
      const p = perbandingan(tidakSekolah, dim, jenjang, t)
      return { tahun: t, pembanding: p.pembanding, tertinggal: p.tertinggal }
    })
    .filter((d) => d.pembanding !== null || d.tertinggal !== null)

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <h1 className="max-w-[26ch] font-serif text-[28px] leading-snug text-tinta md:text-[40px]">
        {judulUtama || `Kesenjangan ${dimLabel}`}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SegmentedControl
          options={DIMS}
          value={dim}
          onChange={(v) => setParam('tab', v)}
          label="Dimensi kesenjangan"
        />
        <TahunSelect
          options={tahunTersedia}
          value={tahun}
          onChange={(v) => setParam('tahun', v)}
        />
      </div>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="font-serif text-[20px] leading-snug text-tinta">
          {judulUtama || `Angka anak tidak sekolah per jenjang`}
        </h2>
        {items.some((it) => it.pembanding !== null || it.tertinggal !== null) ? (
          <>
            <div className="mt-4">
              <Dumbbell
                items={items}
                pembandingNama={pair.pembanding}
                tertinggalNama={pair.tertinggal}
              />
            </div>
            {catatanAwam && <p className="mt-3 text-sm text-tinta-redup">{catatanAwam}</p>}
          </>
        ) : (
          <div className="mt-4">
            <BelumTersedia alasan={`tidak ada data untuk tahun ${tahun}`} />
          </div>
        )}
        <Sumber tahun={tahun} />
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-tinta">Tren 2019–2023</h2>
          <SegmentedControl
            options={JENJANG.map((j) => ({ value: j, label: j }))}
            value={jenjang}
            onChange={(v) => setParam('jenjang', v)}
            label="Jenjang untuk tren"
          />
        </div>
        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {trendData.length > 0 ? (
            <TrenGaris
              data={trendData}
              pembandingNama={pair.pembanding}
              tertinggalNama={pair.tertinggal}
            />
          ) : (
            <BelumTersedia alasan="tidak ada data tren" />
          )}
          <Sumber tahun={tahun} />
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Metrik kesenjangan per jenjang</h2>
        <p className="mt-1 text-sm text-tinta-redup">
          Selisih absolut = nilai tertinggi dikurangi terendah (poin persentase). Rasio = nilai
          tertinggi dibagi terendah.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-tinta-redup">
                <th className="py-2 pr-4 font-medium">Jenjang</th>
                <th className="py-2 pr-4 font-medium">{pair.pembanding}</th>
                <th className="py-2 pr-4 font-medium">{pair.tertinggal}</th>
                <th className="py-2 pr-4 font-medium">Selisih</th>
                <th className="py-2 font-medium">Rasio</th>
              </tr>
            </thead>
            <tbody>
              {perJenjang.map((r) => (
                <tr key={r.jenjang} className="border-b border-garis last:border-0">
                  <td className="py-2 pr-4 font-semibold text-tinta">{r.jenjang}</td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.pembanding !== null ? formatAngka(r.pembanding, 2) : '—'}
                  </td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.tertinggal !== null ? formatAngka(r.tertinggal, 2) : '—'}
                  </td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.selisih !== null ? `+${formatAngka(r.selisih, 2)}` : '—'}
                  </td>
                  <td className="py-2 text-tinta">
                    {r.rasio !== null ? `${formatAngka(r.rasio, 1)}×` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
