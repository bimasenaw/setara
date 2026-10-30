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
      <h1 className="max-w-[28ch] font-serif text-[1.75rem] leading-snug text-tinta md:text-[2.5rem]">
        {judul || 'Peringkat partisipasi pendidikan usia dini per provinsi'}
      </h1>

      <div className="mt-4 overflow-hidden rounded-lg border border-garis">
        <img
          src="/images/foto-provinsi.svg"
          alt="Ilustrasi wilayah Indonesia"
          className="h-40 w-full object-cover md:h-52"
          loading="lazy"
        />
      </div>

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
        <Accordion judul="Cara membaca peringkat ini">
          <p>
            Setiap titik adalah satu provinsi. Titik yang semakin ke kanan berarti partisipasi
            pendidikannya semakin tinggi.
          </p>
          <p>
            Garis putus-putus adalah rata-rata nasional. Lima provinsi terendah diberi warna merah.
            Sumbu dimulai dari 50% agar perbedaan antarprovinsi lebih mudah terlihat.
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
              <Accordion judul="Bagaimana angka ini dihitung?">
                <p>{dampak.metode}</p>
                <p>Asumsi: {dampak.asumsi}</p>
                <p>
                  Angka ini adalah perkiraan, bukan hasil sensus. Gunakan sebagai gambaran skala.
                </p>
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
        <Accordion judul="Bagaimana skor prioritas dihitung?">
          <p>
            Skor 0 sampai 100. Semakin tinggi skornya, semakin besar kebutuhan untuk diprioritaskan.
            Skor adalah rata-rata dari enam ukuran: partisipasi SMA, partisipasi PAUD, lama sekolah,
            kemiskinan, IPM, dan ketimpangan gender.
          </p>
          <p>
            Semua ukuran diberi bobot yang sama. Jika satu provinsi tidak punya data lengkap, cakupan
            indikatornya lebih kecil dan ditampilkan di tabel.
          </p>
          <p>
            Indeks ini alat bantu untuk membaca prioritas, bukan penilaian resmi atau vonis terhadap
            kinerja provinsi.
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
          <Accordion judul="Cara membaca perubahan ini">
            <p>
              Daftar ini membandingkan angka partisipasi SMA pada tahun awal yang tersedia dengan
              tahun terakhir. Angka positif berarti partisipasi naik, angka negatif berarti turun.
            </p>
            <p>
              Perubahan ini bukan ramalan. Data hanya menunjukkan apa yang sudah terjadi pada periode
              yang tersedia.
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
        <Accordion judul="Apa arti selisih dari nasional?">
          <p>
            Selisih adalah nilai provinsi dikurangi nilai nasional. Jika hasilnya positif, provinsi
            berada di atas rata-rata nasional. Jika negatif, provinsi berada di bawah rata-rata.
          </p>
          <p>
            Selisih ditulis dalam poin, bukan persen. Selisih kecil pada survei sampel perlu dibaca
            dengan hati-hati.
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
