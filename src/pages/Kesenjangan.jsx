import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, PAIRS, perbandingan } from '../lib/metrik'
import { kalimatDimensi, kalimatAwam } from '../lib/temuan'
import { DIMS, validDim, validJenjang, validTahun, tulisParam } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { sdgUntuk } from '../lib/sdg'
import { buatSitasi, copyText, downloadCsv, shareTeks } from '../lib/ekspor'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import { SOLUSI_MATRIX, JENJANG_KATEGORI, refs } from '../lib/solusi'
import TabBar from '../components/TabBar'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import Dumbbell from '../components/Dumbbell'
import TrenMultiGaris from '../components/TrenMultiGaris'
import KonteksNasional from '../components/KonteksNasional'
import { Muat, Gagal, BelumTersedia } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

const WARNA_JENJANG = {
  SD: '#C2372D',
  SMP: '#6F8CAB',
  SMA: '#5A6676',
}

function Sumber({ tahun }) {
  return (
    <p className="mt-2 text-xs text-tinta-redup">
      Satuan: persen. Sumber: BPS, Susenas {tahun}.
    </p>
  )
}

export default function Kesenjangan() {
  const { status, tidakSekolah, indikator, error, reload } = useData()
  const [params, setParams] = useSearchParams()
  const [salinan, setSalinan] = useState('')

  const dim = validDim(params.get('tab'))
  const kategori = validJenjang(params.get('jenjang'), JENJANG_KATEGORI, 'Umum')
  const jenjang = kategori === 'Umum' ? null : kategori
  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(
    params.get('tahun'),
    tahunTersedia,
    tahunTersedia[tahunTersedia.length - 1],
  )

  useDocumentMeta({
    judul: `Kesenjangan ${DIMS.find((d) => d.value === dim)?.label || ''} — SETARA`,
    deskripsi:
      'Kesenjangan pendidikan Indonesia menurut wilayah, ekonomi, dan gender. Data BPS Susenas, dengan tabel, tren, dan solusi berbasis studi.',
  })

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
        <Gagal message={error} onReload={reload} />
      </main>
    )
  }

  const pair = PAIRS[dim]
  const dimLabel = DIMS.find((d) => d.value === dim)?.label

  const perJenjang = JENJANG.map((j) => ({
    jenjang: j,
    ...perbandingan(tidakSekolah, dim, j, tahun),
  }))

  const validPerJenjang = perJenjang.filter((p) => p.selisih !== null)
  const terbesar = validPerJenjang.reduce(
    (m, p) => (p.selisih > (m ? m.selisih : -1) ? p : m),
    null,
  )
  const jenjangFokus = jenjang || terbesar?.jenjang || null

  const judulUtama = jenjangFokus
    ? kalimatDimensi(tidakSekolah, dim, jenjangFokus, tahun)
    : null
  const catatanAwam = jenjangFokus
    ? kalimatAwam(tidakSekolah, dim, pair.tertinggal, jenjangFokus, tahun)
    : null

  const items = perJenjang.map((p) => ({
    label: p.jenjang,
    pembanding: p.pembanding,
    tertinggal: p.tertinggal,
  }))

  const trendUmum = tahunTersedia
    .map((t) => {
      const row = { tahun: t }
      for (const j of JENJANG) {
        row[j] = perbandingan(tidakSekolah, dim, j, t).selisih
      }
      return row
    })
    .filter((d) => JENJANG.some((j) => d[j] !== null))

  const trendSpesifik = jenjang
    ? tahunTersedia
        .map((t) => {
          const p = perbandingan(tidakSekolah, dim, jenjang, t)
          return { tahun: t, pembanding: p.pembanding, tertinggal: p.tertinggal }
        })
        .filter((d) => d.pembanding !== null || d.tertinggal !== null)
    : []

  const trendData = jenjang ? trendSpesifik : trendUmum
  const trendTitle = jenjang
    ? `Tren ${pair.pembanding} vs ${pair.tertinggal} · ${kategori}`
    : `Tren selisih ${pair.tertinggal}–${pair.pembanding} per jenjang`
  const trendLines = jenjang
    ? [
        { key: 'pembanding', label: pair.pembanding, color: '#6F8CAB' },
        { key: 'tertinggal', label: pair.tertinggal, color: '#C2372D' },
      ]
    : JENJANG.map((j) => ({ key: j, label: j, color: WARNA_JENJANG[j] }))

  const trendInsight = (() => {
    if (jenjang) {
      if (trendSpesifik.length < 2) return null
      const a = trendSpesifik[0]
      const b = trendSpesifik[trendSpesifik.length - 1]
      const gapA = a.pembanding !== null && a.tertinggal !== null ? a.tertinggal - a.pembanding : null
      const gapB = b.pembanding !== null && b.tertinggal !== null ? b.tertinggal - b.pembanding : null
      if (gapA === null || gapB === null) return null
      const arah = gapB > gapA ? 'melebar' : gapB < gapA ? 'menyempit' : 'stabil'
      return `Selisih ${pair.tertinggal}–${pair.pembanding} di jenjang ${jenjang} ${arah}: ${formatPoin(
        Math.abs(gapA),
        1,
      )} (${a.tahun}) menjadi ${formatPoin(Math.abs(gapB), 1)} (${b.tahun}).`
    }

    if (trendUmum.length < 2) return null
    const akhir = trendUmum[trendUmum.length - 1]
    const jenjangTerbesar = JENJANG.reduce((m, j) => {
      if (akhir[j] === null) return m
      return m === null || akhir[j] > akhir[m] ? j : m
    }, null)
    if (!jenjangTerbesar) return null
    const seri = trendUmum.filter((d) => d[jenjangTerbesar] !== null)
    if (seri.length < 2) return null
    const awal = seri[0]
    const delta = akhir[jenjangTerbesar] - awal[jenjangTerbesar]
    const arah = delta > 0 ? 'melebar' : delta < 0 ? 'menyempit' : 'stabil'
    return `Selisih terbesar ada di ${jenjangTerbesar}: ${formatPoin(
      akhir[jenjangTerbesar],
      1,
    )} (${akhir.tahun}), ${arah} ${formatPoin(Math.abs(delta), 1)} sejak ${awal.tahun}.`
  })()

  const dampak =
    dim === 'ekonomi'
      ? dampakEkonomi(tidakSekolah, indikator, jenjangFokus, tahun)
      : dim === 'gender'
        ? dampakGender(tidakSekolah, indikator, jenjangFokus, tahun)
        : null

  const solusiList = SOLUSI_MATRIX[dim]?.[kategori] || []
  const sdg = sdgUntuk(dim)

  const salin = async () => {
    const teks = `${judulUtama || `Kesenjangan ${dimLabel}`} Sumber: BPS, Susenas ${tahun}.`
    const ok = await copyText(teks)
    setSalinan(ok ? 'Temuan disalin.' : 'Gagal menyalin; blok teks dan salin manual.')
  }

  const bagikan = async () => {
    const ok = await shareTeks({
      title: 'SETARA — Kesenjangan pendidikan',
      text: judulUtama || `Kesenjangan ${dimLabel}`,
      url: window.location.href,
    })
    if (!ok) setSalinan('Share tidak tersedia; tautan disalin.')
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <h1 className="max-w-[26ch] font-serif text-[1.75rem] leading-snug text-tinta md:text-[2.5rem]">
        {judulUtama || `Kesenjangan ${dimLabel}`}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <TabBar
          options={DIMS}
          value={dim}
          onChange={(v) => tulisParam(params, setParams, 'tab', v)}
          label="Dimensi kesenjangan"
        />
        <TahunSelect
          options={tahunTersedia}
          value={tahun}
          onChange={(v) => tulisParam(params, setParams, 'tahun', v)}
        />
        <SegmentedControl
          options={JENJANG_KATEGORI.map((j) => ({ value: j, label: j }))}
          value={kategori}
          onChange={(v) => tulisParam(params, setParams, 'jenjang', v)}
          label="Kategori jenjang"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={salin}
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Salin temuan
        </button>
        <button
          type="button"
          onClick={bagikan}
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Bagikan
        </button>
        <button
          type="button"
          onClick={() =>
            downloadCsv(
              `setara-${dim}-${kategori}-${tahun}.csv`,
              perJenjang.map((r) => ({
                jenjang: r.jenjang,
                pembanding: r.pembanding,
                tertinggal: r.tertinggal,
                selisih: r.selisih,
                rasio: r.rasio,
              })),
              [
                { key: 'jenjang', label: 'Jenjang' },
                { key: 'pembanding', label: pair.pembanding },
                { key: 'tertinggal', label: pair.tertinggal },
                { key: 'selisih', label: 'Selisih (poin)' },
                { key: 'rasio', label: 'Rasio' },
              ],
            )
          }
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Unduh CSV
        </button>
        <button
          type="button"
          onClick={() =>
            copyText(
              buatSitasi({
                judul: judulUtama || `Kesenjangan ${dimLabel}`,
                tahun,
              }),
            ).then((ok) => setSalinan(ok ? 'Sitasi disalin.' : 'Gagal menyalin sitasi.'))
          }
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Salin sitasi
        </button>
        <Link
          to="/metode"
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Metode
        </Link>
      </div>
      {salinan && <p className="mt-2 text-sm text-tinta-redup">{salinan}</p>}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="font-serif text-[1.25rem] leading-snug text-tinta">
          {judulUtama || 'Angka anak tidak sekolah per jenjang'}
        </h2>
        {items.some((it) => it.pembanding !== null || it.tertinggal !== null) ? (
          <>
            <div className="mt-4">
              <Dumbbell
                items={items}
                pembandingNama={pair.pembanding}
                tertinggalNama={pair.tertinggal}
                ringkasan={judulUtama || undefined}
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

      {dampak && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">
            Skala dampak · {jenjangFokus} {tahun}
          </h2>
          <p className="mt-1 text-sm font-semibold text-tinta">
            Sekitar {formatJumlahOrang(dampak.estimasi)} anak usia {jenjangFokus} berpotensi kembali
            bersekolah jika kelompok tertinggal setara kelompok pembanding.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-tinta-redup">{dampak.metode}</p>
          <p className="mt-1 text-xs text-tinta-redup">Asumsi: {dampak.asumsi}</p>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-tinta">{trendTitle} (2019–2023)</h2>
          <span className="text-sm text-tinta-redup">Kategori mengikuti filter di atas.</span>
        </div>
        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {trendData.length > 0 ? (
            <>
              {trendInsight && <p className="text-sm text-tinta">{trendInsight}</p>}
              <div className="mt-3">
                <TrenMultiGaris
                  data={trendData}
                  lines={trendLines}
                  satuan={jenjang ? 'persen' : 'poin persentase'}
                  ringkasan={trendInsight || undefined}
                  namaFile={`setara-tren-${dim}-${kategori}.csv`}
                />
              </div>
            </>
          ) : (
            <BelumTersedia alasan="tidak ada data tren" />
          )}
          <Sumber tahun="2019–2023" />
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Metrik kesenjangan per jenjang</h2>
        <p className="mt-1 text-sm text-tinta-redup">
          Selisih absolut = nilai tertinggi dikurangi terendah (poin persentase). Rasio = nilai
          tertinggi dibagi terendah.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-tinta-redup">
                <th className="py-2 pr-4 font-medium">Jenjang</th>
                <th className="py-2 pr-4 font-medium">{pair.pembanding}</th>
                <th className="py-2 pr-4 font-medium">{pair.tertinggal}</th>
                <th className="py-2 pr-4 font-medium">Selisih (poin)</th>
                <th className="py-2 font-medium">Rasio</th>
              </tr>
            </thead>
            <tbody>
              {perJenjang.map((r) => (
                <tr
                  key={r.jenjang}
                  className={`border-b border-garis last:border-0 ${
                    r.jenjang === jenjang ? 'bg-kertas' : ''
                  }`}
                >
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
        <p className="mt-2 text-xs text-tinta-redup">
          {kategori === 'Umum'
            ? 'Kategori Umum menampilkan semua jenjang.'
            : `Baris disorot: ${kategori}.`}{' '}
          Satuan nilai: persen. Sumber: BPS, Susenas {tahun}.
        </p>
      </section>

      <KonteksNasional rows={indikator} dimensi={dim} />

      {sdg.length > 0 && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Kaitan tujuan pembangunan berkelanjutan</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-tinta">
            {sdg.map((s) => (
              <li key={s.id}>
                <span className="font-semibold">{s.judul}:</span> {s.teks}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-tinta-redup">
            Pemetaan ini menunjukkan relevansi temuan, bukan klaim bahwa aplikasi mengukur target SDG
            secara resmi.
          </p>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-base font-semibold text-tinta">Solusi berbasis studi</h2>
          <span className="text-sm text-tinta-redup">
            Kategori {kategori} mengikuti filter di atas.
          </span>
        </div>
        {solusiList.length > 0 ? (
          <ol className="mt-3 space-y-2">
            {solusiList.map((s, i) => (
              <li key={i} className="rounded-lg border border-garis bg-putih p-4">
                <p className="text-sm font-semibold leading-relaxed text-tinta">
                  <span className="font-serif text-[1.25rem] font-semibold">{i + 1}.</span> {s.temuan}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-tinta">
                  <span className="font-semibold">Solusi:</span> {s.solusi}
                </p>
                <div className="mt-1.5 text-xs leading-relaxed text-tinta-redup">
                  <span className="font-semibold">Sumber:</span>
                  <ul className="mt-0.5 space-y-0.5">
                    {refs(s.sumber).map((r) => (
                      <li key={r.id}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-garis underline-offset-2 hover:text-tinta"
                        >
                          {r.referensi}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-tinta-redup">Belum ada solusi untuk kombinasi ini.</p>
        )}
        <p className="mt-3 text-xs text-tinta-redup">
          Temuan di atas dihitung dari data BPS. Solusi berasal dari studi literatur; hubungannya
          indikatif, bukan klaim sebab-akibat.
        </p>
      </section>
    </main>
  )
}
