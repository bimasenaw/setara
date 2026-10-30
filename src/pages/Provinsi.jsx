import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { kalimatProvinsi } from '../lib/temuan'
import { validTahun, tulisParam, tautanProvinsi } from '../lib/params'
import { dampakTerbaru } from '../lib/dampak'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import { hitungPrioritas, matriksPrioritas } from '../lib/prioritas'
import { provinsiPalingBerubah } from '../lib/tren'
import { rekomendasiProvinsi } from '../lib/rekomendasi'
import { tahunTerbaru, urutkanProvinsi } from '../lib/indikator'
import { buatSitasi, cetak, copyText, downloadCsv, shareTeks } from '../lib/ekspor'
import { solusiUntuk } from '../lib/solusi'
import TahunSelect from '../components/TahunSelect'
import DotPlotProvinsi from '../components/DotPlotProvinsi'
import SolusiBlock from '../components/SolusiBlock'
import PriorityMatrix from '../components/PriorityMatrix'
import RekomendasiList from '../components/RekomendasiList'
import BandingProvinsi from '../components/BandingProvinsi'
import Accordion from '../components/Accordion'
import HeroBanner from '../components/HeroBanner'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

const REKOMENDASI = [
  'Prioritaskan intervensi pendidikan usia dini di provinsi dengan partisipasi terendah.',
  'Perluas akses jenjang menengah di perdesaan dan keluarga termiskin, tempat angka anak tidak sekolah paling tinggi.',
  'Gunakan data BPS sebagai dasar target per provinsi, bukan rata-rata nasional yang menyembunyikan kesenjangan.',
]

function selisihNasional(nilai, nasional) {
  if (nilai === null || nasional === null) return null
  return nilai - nasional
}

export default function Provinsi() {
  const { status, provinsi, indikator, error, reload } = useData()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState({ key: 'nilai', dir: 'asc' })
  const [cari, setCari] = useState('')
  const [pesan, setPesan] = useState('')

  const tahunTersedia = [...new Set(provinsi.provinsi.map((p) => p.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(
    params.get('tahun'),
    tahunTersedia,
    tahunTersedia[tahunTersedia.length - 1],
  )

  useDocumentMeta({
    judul: 'Provinsi dan prioritas | SETARA',
    deskripsi:
      'Peringkat partisipasi pendidikan usia dini, indeks prioritas, dan rekomendasi kontekstual per provinsi dari data BPS.',
  })

  const nasional = provinsi.nasional.find((n) => n.tahun === tahun)?.nilai ?? null

  const semuaBaris = useMemo(() => {
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

  const baris = useMemo(() => {
    if (!cari.trim()) return semuaBaris
    const q = cari.toLowerCase()
    return semuaBaris.filter((p) => p.provinsi.toLowerCase().includes(q))
  }, [semuaBaris, cari])

  const terendah = useMemo(
    () =>
      [...semuaBaris]
        .filter((p) => p.nilai !== null)
        .sort((a, b) => a.nilai - b.nilai)
        .slice(0, 5),
    [semuaBaris],
  )

  const prioritas = useMemo(() => hitungPrioritas(indikator), [indikator])
  const matriks = useMemo(() => matriksPrioritas(indikator), [indikator])
  const berubah = useMemo(() => provinsiPalingBerubah(indikator, 'aps', { jenjang: 'SMA' }), [indikator])
  const tahunPaud = useMemo(() => tahunTerbaru(indikator, { indikator: 'apk_paud' }), [indikator])
  const apkPaud = useMemo(
    () =>
      tahunPaud
        ? urutkanProvinsi(indikator, 'apk_paud', tahunPaud, { kelompok: 'Total' })
        : [],
    [indikator, tahunPaud],
  )
  const terendahPaud = apkPaud.slice(0, 5)
  const dampak = terendahPaud[0] ? dampakTerbaru(indikator, terendahPaud[0].kode) : null
  const rekomendasi = terendahPaud[0]
    ? rekomendasiProvinsi(indikator, terendahPaud[0].kode)
    : []

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

  const terendahPertama = terendah[0]
  const judul = terendahPertama
    ? kalimatProvinsi(terendahPertama.provinsi, terendahPertama.nilai, nasional)
    : null

  const headerSort = (key) => {
    if (sort.key === key) setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' })
    else setSort({ key, dir: 'asc' })
  }

  const panah = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  const salin = async () => {
    const teks = `${judul || 'Peringkat provinsi'} Sumber: BPS, Susenas ${tahun}.`
    const ok = await copyText(teks)
    setPesan(ok ? 'Temuan disalin.' : 'Gagal menyalin.')
  }

  const bagikan = async () => {
    const ok = await shareTeks({
      title: 'SETARA | Prioritas provinsi',
      text: judul || 'Peringkat partisipasi pendidikan usia dini per provinsi',
      url: window.location.href,
    })
    if (!ok) setPesan('Share tidak tersedia; tautan disalin.')
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <HeroBanner
        judul={judul || 'Peringkat partisipasi pendidikan usia dini per provinsi'}
        deskripsi="Halaman ini menunjukkan provinsi mana yang perlu diprioritaskan, seberapa jauh jaraknya dari nasional, dan apa yang bisa dilakukan."
        gambar="/images/foto-provinsi.svg"
        alt="Ilustrasi wilayah Indonesia"
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <TahunSelect
          options={tahunTersedia}
          value={tahun}
          onChange={(v) => tulisParam(params, setParams, 'tahun', v)}
        />
        <button
          type="button"
          onClick={() => setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' })}
          className="min-h-11 rounded-lg border border-garis bg-putih px-4 text-base text-tinta hover:bg-kertas"
        >
          Urut {sort.dir === 'asc' ? 'naik' : 'turun'}
        </button>
        <label className="flex items-center gap-2 text-sm text-tinta">
          <span className="text-tinta-redup">Cari provinsi</span>
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="mis. Papua"
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-base text-tinta focus:outline-none focus:ring-2 focus:ring-biru"
          />
        </label>
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
          onClick={() => cetak()}
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Cetak / PDF
        </button>
        <button
          type="button"
          onClick={() =>
            downloadCsv(
              `setara-provinsi-${tahun}.csv`,
              semuaBaris.map((p) => ({
                provinsi: p.provinsi,
                nilai: p.nilai,
                selisih: p.selisih,
              })),
              [
                { key: 'provinsi', label: 'Provinsi' },
                { key: 'nilai', label: 'Nilai (%)' },
                { key: 'selisih', label: 'Selisih dari nasional (poin)' },
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
            copyText(buatSitasi({ judul: judul || 'Peringkat provinsi', tahun })).then((ok) =>
              setPesan(ok ? 'Sitasi disalin.' : 'Gagal menyalin sitasi.'),
            )
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
      {pesan && <p className="mt-2 text-sm text-tinta-redup">{pesan}</p>}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="font-serif text-[1.25rem] leading-snug text-tinta">
          Peringkat partisipasi pendidikan usia dini per provinsi
        </h2>
        <div className="mt-4">
          <DotPlotProvinsi provinsi={baris} nilaiNasional={nasional} />
        </div>
        <p className="mt-3 text-xs text-tinta-redup">
          Satuan: persen. Sumber: BPS, Susenas {tahun}.
        </p>
        <Accordion judul="Apa makna peringkat ini?">
          {terendah[0] && (
            <p>
              Pada {tahun}, {terendah[0].provinsi} berada paling jauh di bawah rata-rata nasional,
              yaitu {formatAngka(terendah[0].nilai, 2)}% berbanding {formatAngka(nasional, 2)}%.
              Artinya, provinsi ini paling perlu dikejar partisipasi pendidikannya.
            </p>
          )}
          <p>
            Titik yang makin ke kanan menunjukkan partisipasi yang makin tinggi. Garis putus-putus
            adalah rata-rata nasional, dan lima provinsi terendah diberi warna merah.
          </p>
          <p>
            Empat provinsi baru Papua belum memiliki data pada indikator ini, sehingga tidak muncul di
            peringkat.
          </p>
        </Accordion>
      </section>

      {terendahPaud.length > 0 && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">
            Prioritas APK PAUD 3–6 tahun ({tahunPaud})
          </h2>
          <p className="mt-1 text-sm text-tinta-redup">
            Lima provinsi dengan APK PAUD terendah pada data terbaru. APK mengukur partisipasi kasar,
            bukan angka anak tidak sekolah.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-tinta">
            {terendahPaud.map((p, i) => (
              <li key={p.kode}>
                <span className="font-semibold">{i + 1}.</span>{' '}
                <Link
                  to={tautanProvinsi(p.kode, tahunPaud)}
                  className="underline decoration-garis underline-offset-2 hover:text-tinta-redup"
                >
                  {p.provinsi}
                </Link>{' '}
                | {formatAngka(p.nilai, 2)}%
              </li>
            ))}
          </ul>
          {dampak && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-tinta">
                Jika provinsi terendah menyamai APK PAUD nasional, sekitar{' '}
                <span className="font-semibold">{formatJumlahOrang(dampak.estimasi)}</span> anak usia
                3–6 tahun berpotensi mendapat layanan PAUD tambahan.
              </p>
              <Accordion judul="Apa makna angka ini?">
                <p>
                  Angka ini menunjukkan berapa banyak anak yang bisa memperoleh layanan PAUD jika
                  provinsi terendah menyamai rata-rata nasional. Artinya, masalahnya bukan hanya skor
                  rendah, tetapi akses anak yang belum terpenuhi.
                </p>
                <p>{dampak.metode}</p>
                <p>Asumsi: {dampak.asumsi}</p>
                <p>Angka ini adalah perkiraan, bukan hasil sensus.</p>
              </Accordion>
            </>
          )}
        </section>
      )}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Indeks prioritas SETARA</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-tinta-redup">
                <th className="py-2 pr-4 font-medium">Peringkat</th>
                <th className="py-2 pr-4 font-medium">Provinsi</th>
                <th className="py-2 pr-4 font-medium">Skor</th>
                <th className="py-2 font-medium">Cakupan indikator</th>
              </tr>
            </thead>
            <tbody>
              {prioritas.daftar.slice(0, 10).map((p) => (
                <tr key={p.kode} className="border-b border-garis last:border-0">
                  <td className="py-2 pr-4 text-tinta">{p.peringkat}</td>
                  <td className="py-2 pr-4 text-tinta">
                    <Link
                      to={tautanProvinsi(p.kode, tahun)}
                      className="underline decoration-garis underline-offset-2 hover:text-tinta-redup"
                    >
                      {p.provinsi}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 font-semibold text-tinta">{formatAngka(p.skor, 1)}</td>
                  <td className="py-2 text-tinta">{p.cakupan}/6</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-tinta-redup">
          Klik provinsi untuk melihat tren, konteks, dan rekomendasi. Indeks ini bukan penilaian resmi.
        </p>
        <Accordion judul="Apa makna skor prioritas ini?">
          {prioritas.daftar[0] && (
            <p>
              Provinsi dengan skor tertinggi adalah {prioritas.daftar[0].provinsi} (
              {formatAngka(prioritas.daftar[0].skor, 1)}/100). Artinya, provinsi ini memiliki
              kombinasi kebutuhan paling besar menurut enam ukuran yang dipakai.
            </p>
          )}
          <p>
            Skor 0 sampai 100 dihitung dari partisipasi SMA, partisipasi PAUD, lama sekolah,
            kemiskinan, IPM, dan ketimpangan gender. Semua ukuran diberi bobot sama.
          </p>
          <p>
            Skor tinggi bukan vonis terhadap kinerja provinsi. Skor ini alat bantu untuk menentukan
            prioritas dan membaca kebutuhan data.
          </p>
        </Accordion>
      </section>

      <PriorityMatrix data={matriks.data} tahun={2025} />

      <BandingProvinsi
        rows={indikator}
        provinsiList={prioritas.daftar.map((p) => ({ kode: p.kode, provinsi: p.provinsi }))}
        defaultA={prioritas.daftar[0]?.kode}
        defaultB={prioritas.daftar[prioritas.daftar.length - 1]?.kode}
      />

      {berubah.membaik.length > 0 && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Provinsi paling berubah · partisipasi SMA</h2>
          <p className="mt-1 text-sm text-tinta-redup">
            Perubahan poin dari tahun awal yang tersedia sampai tahun terakhir. Bukan proyeksi.
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-tinta">Paling membaik</h3>
              <ul className="mt-1 space-y-1 text-sm text-tinta">
                {berubah.membaik.map((p) => (
                  <li key={p.kode}>
                    {p.provinsi}: {formatPoin(p.delta, 2)} ({p.awal.tahun}–{p.akhir.tahun})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-tinta">Paling melemah</h3>
              <ul className="mt-1 space-y-1 text-sm text-tinta">
                {berubah.memburuk.map((p) => (
                  <li key={p.kode}>
                    {p.provinsi}: {formatPoin(p.delta, 2)} ({p.awal.tahun}–{p.akhir.tahun})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Accordion judul="Apa makna perubahan ini?">
            {berubah.membaik[0] && (
              <p>
                Provinsi yang paling membaik adalah {berubah.membaik[0].provinsi}, naik{' '}
                {formatPoin(berubah.membaik[0].delta, 2)}. Artinya, partisipasi di provinsi ini
                bergerak ke arah yang lebih baik.
              </p>
            )}
            <p>
              Perubahan positif berarti partisipasi naik. Perubahan negatif berarti partisipasi
              turun. Daftar ini menunjukkan arah, bukan ramalan.
            </p>
          </Accordion>
        </section>
      )}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Selisih dari nilai nasional</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
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
                <th className="py-2 pr-4 font-medium">
                  <button type="button" onClick={() => headerSort('selisih')} className="min-h-11">
                    Selisih dari nasional{panah('selisih')}
                  </button>
                </th>
                <th className="py-2 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {baris.map((p) => (
                <tr key={p.kode} className="border-b border-garis last:border-0">
                  <td className="py-2 pr-4 text-tinta">{p.provinsi}</td>
                  <td className="py-2 pr-4 text-tinta">
                    {p.nilai !== null ? formatAngka(p.nilai, 2) : 'Data belum tersedia'}
                  </td>
                  <td className="py-2 pr-4 text-tinta">
                    {p.selisih !== null
                      ? `${p.selisih >= 0 ? '+' : '−'}${formatAngka(Math.abs(p.selisih), 2)} poin`
                      : '-'}
                  </td>
                  <td className="py-2">
                    <Link
                      to={tautanProvinsi(p.kode, tahun)}
                      className="underline decoration-garis underline-offset-2 hover:text-tinta-redup"
                    >
                      Lihat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Accordion judul="Apa makna selisih dari nasional?">
          <p>
            Selisih positif berarti partisipasi provinsi lebih tinggi dari rata-rata nasional.
            Selisih negatif berarti provinsi tertinggal dari nasional.
          </p>
          <p>
            Semakin besar selisih negatifnya, semakin jauh provinsi itu dari capaian nasional. Selisih
            kecil pada survei sampel perlu dibaca dengan hati-hati.
          </p>
        </Accordion>
      </section>

      {rekomendasi.length > 0 && (
        <RekomendasiList
          items={rekomendasi}
          judul={`Rekomendasi kontekstual · ${
            terendahPaud[0]?.provinsi || 'provinsi prioritas'
          }`}
        />
      )}

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Rekomendasi keputusan</h2>
        <SolusiBlock solusi={solusiUntuk('provinsi')} />
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-tinta">
          {REKOMENDASI.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>
    </main>
  )
}
