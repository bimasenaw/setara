import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { formatAngka, formatPoin, formatJumlahOrang } from '../lib/format'
import { daftarProvinsi, nilaiTerbaru, seriTahunan, tahunTerbaru } from '../lib/indikator'
import { dampakTerbaru } from '../lib/dampak'
import { hitungPrioritas, matriksPrioritas } from '../lib/prioritas'
import { rekomendasiProvinsi } from '../lib/rekomendasi'
import { gabungSeri, perubahanPeringkat } from '../lib/tren'
import { copyText, downloadCsv, shareTeks, buatSitasi } from '../lib/ekspor'
import ProvinsiTrend from '../components/ProvinsiTrend'
import KonteksGrid from '../components/KonteksGrid'
import RekomendasiList from '../components/RekomendasiList'
import SegmentedControl from '../components/SegmentedControl'
import Accordion from '../components/Accordion'
import HeroBanner from '../components/HeroBanner'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

const TREN_OPTIONS = [
  { value: 'aps', label: 'Partisipasi SMA' },
  { value: 'paud', label: 'Partisipasi PAUD' },
]

function konteksItems(rows, kode) {
  const defs = [
    { label: 'Partisipasi usia SMA', indikator: 'aps', jenjang: 'SMA', satuan: '%' },
    { label: 'Partisipasi PAUD 3-6 tahun', indikator: 'apk_paud', kelompok: 'Total', satuan: '%' },
    { label: 'Rata-rata lama sekolah', indikator: 'lama_sekolah', kelompok: '15+', satuan: ' tahun' },
    { label: 'Penduduk miskin', indikator: 'kemiskinan', kelompok: 'Jumlah', satuan: '%' },
    { label: 'Indeks Pembangunan Manusia (IPM)', indikator: 'ipm', kelompok: 'Total', satuan: '' },
    { label: 'Indeks ketimpangan gender', indikator: 'ikg', kelompok: 'Total', satuan: '' },
    { label: 'Rasio APM gender SMA', indikator: 'rasio_apm_gender', jenjang: 'SMA', satuan: '' },
  ]
  return defs.map((d) => {
    const prov = nilaiTerbaru(rows, { ...d, kode })
    const nas = nilaiTerbaru(rows, { ...d, kode: '9999' })
    const selisih =
      prov.nilai !== null && nas.nilai !== null ? prov.nilai - nas.nilai : null
    return {
      label: d.label,
      nilai: prov.nilai,
      nasional: nas.nilai,
      selisih,
      satuan: d.satuan,
      catatan:
        prov.tahun && nas.tahun && prov.tahun !== nas.tahun
          ? `Tahun provinsi ${prov.tahun}; nasional ${nas.tahun}.`
          : prov.tahun
            ? `Tahun ${prov.tahun}.`
            : 'Data belum tersedia.',
    }
  })
}

export default function ProvinsiDetail() {
  const { kode } = useParams()
  const { status, indikator, error, reload } = useData()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('aps')
  const [pesan, setPesan] = useState('')

  const provinsi = daftarProvinsi(indikator).find((p) => p.kode === kode)
  const tahun = Number(params.get('tahun')) || tahunTerbaru(indikator, { indikator: 'aps' }) || 2025

  useDocumentMeta({
    judul: `${provinsi?.provinsi || 'Provinsi'} | SETARA`,
    deskripsi: `Profil pendidikan ${provinsi?.provinsi || 'provinsi'}: tren partisipasi, APK PAUD, konteks, dan rekomendasi.`,
  })

  const prioritas = useMemo(() => hitungPrioritas(indikator), [indikator])
  const matriks = useMemo(() => matriksPrioritas(indikator), [indikator])

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

  if (!provinsi) {
    return (
      <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <h1 className="font-serif text-[1.75rem] text-tinta">Provinsi tidak ditemukan</h1>
        <p className="mt-2 text-tinta-redup">
          Kode provinsi <span className="font-semibold">{kode}</span> tidak ada di data BPS yang
          tersedia.
        </p>
        <Link
          to="/provinsi"
          className="mt-4 inline-block min-h-11 rounded-lg bg-tinta px-4 py-2 text-putih hover:bg-tinta-redup"
        >
          Kembali ke peringkat provinsi
        </Link>
      </main>
    )
  }

  const skor = prioritas.daftar.find((p) => p.kode === kode)
  const kategori = matriks.data.find((p) => p.kode === kode)
  const rekomendasi = rekomendasiProvinsi(indikator, kode)
  const dampak = dampakTerbaru(indikator, kode)
  const konteks = konteksItems(indikator, kode)

  const trend =
    mode === 'aps'
      ? gabungSeri(
          seriTahunan(indikator, { indikator: 'aps', kode, jenjang: 'SMA' }),
          seriTahunan(indikator, { indikator: 'aps', kode: '9999', jenjang: 'SMA' }),
        )
      : gabungSeri(
          seriTahunan(indikator, { indikator: 'apk_paud', kode, kelompok: 'Total' }),
          seriTahunan(indikator, { indikator: 'apk_paud', kode: '9999', kelompok: 'Total' }),
        )

  const peringkat = mode === 'aps' ? perubahanPeringkat(indikator, kode, 'aps', { jenjang: 'SMA' }) : null
  const labelTren = mode === 'aps' ? 'Partisipasi sekolah usia SMA' : 'APK PAUD 3–6'
  const satuanTren = 'persen'

  const [awal, akhir] = [trend[0], trend[trend.length - 1]]
  const deltaTren =
    awal && akhir && typeof awal.provinsi === 'number' && typeof akhir.provinsi === 'number'
      ? akhir.provinsi - awal.provinsi
      : null

  const salin = async () => {
    const ok = await copyText(
      `${provinsi.provinsi}: skor prioritas ${formatAngka(skor?.skor, 1)}/100. Sumber: BPS.`,
    )
    setPesan(ok ? 'Ringkasan disalin.' : 'Gagal menyalin.')
  }

  const bagikan = async () => {
    const ok = await shareTeks({
      title: `SETARA | ${provinsi.provinsi}`,
      text: `Profil pendidikan ${provinsi.provinsi}`,
      url: window.location.href,
    })
    if (!ok) setPesan('Share tidak tersedia; tautan disalin.')
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <p className="text-sm text-tinta-redup">
        <Link to="/provinsi" className="underline decoration-garis underline-offset-2">
          ← Kembali ke peringkat provinsi
        </Link>
      </p>
      <div className="mt-2">
        <HeroBanner
          judul={provinsi.provinsi}
          deskripsi="Profil ini menunjukkan posisi provinsi, tren partisipasi, konteks, dan langkah yang bisa diprioritaskan."
          gambar="/images/foto-provinsi.svg"
          alt="Ilustrasi wilayah Indonesia"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={salin}
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Salin ringkasan
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
              `setara-${provinsi.provinsi}-${tahun}.csv`,
              konteks.map((k) => ({
                indikator: k.label,
                provinsi: k.nilai,
                nasional: k.nasional,
                selisih: k.selisih,
              })),
              [
                { key: 'indikator', label: 'Indikator' },
                { key: 'provinsi', label: 'Provinsi' },
                { key: 'nasional', label: 'Nasional' },
                { key: 'selisih', label: 'Selisih' },
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
            copyText(buatSitasi({ judul: `Profil ${provinsi.provinsi}`, tahun })).then((ok) =>
              setPesan(ok ? 'Sitasi disalin.' : 'Gagal menyalin sitasi.'),
            )
          }
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Salin sitasi
        </button>
      </div>
      {pesan && <p className="mt-2 text-sm text-tinta-redup">{pesan}</p>}

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-garis bg-putih p-4">
          <p className="text-xs text-tinta-redup">Indeks prioritas</p>
          <p className="mt-1 font-serif text-[1.75rem] text-tinta">
            {skor ? `${formatAngka(skor.skor, 1)}/100` : 'Data belum tersedia'}
          </p>
          <p className="mt-1 text-xs text-tinta-redup">
            {skor ? `Peringkat ${skor.peringkat} dari ${prioritas.daftar.length}` : '-'}
          </p>
        </div>
        <div className="rounded-lg border border-garis bg-putih p-4">
          <p className="text-xs text-tinta-redup">Kuadran prioritas</p>
          <p className="mt-1 text-sm font-semibold text-tinta">{kategori?.kategori || 'Belum tersedia'}</p>
          <p className="mt-1 text-xs text-tinta-redup">
            Level {kategori ? `${formatAngka(kategori.level, 1)}%` : '-'} · tren{' '}
            {kategori ? formatPoin(kategori.tren, 1) : '-'}
          </p>
        </div>
        <div className="rounded-lg border border-garis bg-putih p-4">
          <p className="text-xs text-tinta-redup">Cakupan indikator</p>
          <p className="mt-1 font-serif text-[1.75rem] text-tinta">
            {skor ? `${skor.cakupan}/6` : '-'}
          </p>
          <p className="mt-1 text-xs text-tinta-redup">
            Indikator yang tersedia untuk provinsi ini.
          </p>
        </div>
        <Accordion judul="Apa makna tiga angka di atas?">
          <p>
            Skor {skor ? `${formatAngka(skor.skor, 1)}/100` : 'belum tersedia'} berarti provinsi ini
            berada pada urutan {skor ? skor.peringkat : '-'} dalam kebutuhan prioritas. Semakin tinggi
            skornya, semakin besar kebutuhan untuk diprioritaskan.
          </p>
          <p>
            Kuadran {kategori?.kategori || 'belum tersedia'} menunjukkan arah partisipasi provinsi.
            Cakupan {skor ? `${skor.cakupan}/6` : '-'} menunjukkan berapa banyak data yang tersedia
            untuk membaca kondisi ini.
          </p>
        </Accordion>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-tinta">Tren {labelTren}</h2>
          <SegmentedControl options={TREN_OPTIONS} value={mode} onChange={setMode} label="Indikator tren" />
        </div>
        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {trend.length ? (
            <>
              <p className="text-sm text-tinta-redup">
                Perbandingan {provinsi.provinsi} dengan rata-rata nasional.{' '}
                {deltaTren !== null && (
                  <>
                    Perubahan {formatPoin(deltaTren, 2)} dari {awal.tahun} ke {akhir.tahun}.
                  </>
                )}
                {peringkat && (
                  <>
                    {' '}
                    Peringkat {awal ? peringkat.awal.peringkat : '-'} →{' '}
                    {akhir ? peringkat.akhir.peringkat : '-'} dari {peringkat.akhir?.total || '-'}{' '}
                    provinsi (selisih peringkat {peringkat.deltaPeringkat >= 0 ? '+' : ''}
                    {peringkat.deltaPeringkat}).
                  </>
                )}
              </p>
              <div className="mt-3">
                <ProvinsiTrend
                  data={trend}
                  namaProvinsi={provinsi.provinsi}
                  label={labelTren}
                  satuan={satuanTren}
                />
              </div>
            </>
          ) : (
            <p className="text-tinta-redup">Data tren belum tersedia.</p>
          )}
          <p className="mt-3 text-xs text-tinta-redup">Sumber: BPS, Susenas.</p>
          <Accordion judul="Apa makna tren ini?">
            <p>
              Garis merah menunjukkan angka provinsi, garis biru menunjukkan rata-rata nasional. Jika
              garis merah mendekat ke garis biru, provinsi ini sedang mengejar nasional. Jika menjauh,
              provinsi ini makin tertinggal.
            </p>
            {deltaTren !== null && (
              <p>
                Perubahan {formatPoin(deltaTren, 2)} dari {awal.tahun} ke {akhir.tahun} menunjukkan
                arah tersebut. Angka ini bukan proyeksi.
              </p>
            )}
          </Accordion>
        </div>
      </section>

      {dampak && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Perkiraan jumlah anak PAUD</h2>
          <p className="mt-1 text-sm font-semibold text-tinta">
            Sekitar {formatJumlahOrang(dampak.estimasi)} anak usia 3–6 tahun berpotensi mendapat
            layanan PAUD tambahan jika partisipasi menyamai nasional.
          </p>
          <Accordion judul="Apa makna angka ini?">
            <p>
              Angka ini menunjukkan berapa banyak anak yang bisa memperoleh layanan PAUD jika
              partisipasi provinsi menyamai nasional. Artinya, masalahnya bukan hanya skor rendah,
              tetapi akses anak yang belum terpenuhi.
            </p>
            <p>{dampak.metode}</p>
            <p>Asumsi: {dampak.asumsi}</p>
            <p>Angka ini adalah perkiraan, bukan hasil sensus.</p>
          </Accordion>
        </section>
      )}

      <KonteksGrid items={konteks} judul="Konteks provinsi" />

      <RekomendasiList items={rekomendasi} judul={`Rekomendasi kontekstual · ${provinsi.provinsi}`} />

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Makna catatan</h2>
        <Accordion judul="Apa makna catatan ini?">
          <p>
            Skor prioritas menunjukkan kebutuhan relatif, bukan penilaian resmi. Provinsi dengan skor
            rendah bukan berarti tidak punya masalah, dan skor tinggi bukan berarti gagal.
          </p>
          <p>
            Partisipasi sekolah dan angka anak tidak sekolah adalah dua hal berbeda. Hubungan
            antarindikator tidak membuktikan sebab-akibat.
          </p>
        </Accordion>
        <Link
          to="/metode"
          className="mt-3 inline-block min-h-11 rounded-lg border border-garis bg-putih px-3 py-2 text-sm text-tinta hover:bg-kertas"
        >
          Buka metode dan sumber
        </Link>
      </section>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Data provinsi lain</h2>
        <p className="mt-1 text-sm text-tinta-redup">
          Bandingkan dengan provinsi lain di halaman peringkat, atau pilih provinsi dari tabel.
        </p>
        <Link
          to="/provinsi"
          className="mt-3 inline-block min-h-11 rounded-lg bg-tinta px-4 py-2 text-sm text-putih hover:bg-tinta-redup"
        >
          Lihat semua provinsi
        </Link>
      </section>
    </main>
  )
}
