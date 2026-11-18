import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { formatAngka, formatPoin, formatJumlahOrang } from '../lib/format'
import { daftarProvinsi, nilaiTerbaru, seriTahunan, tahunTerbaru } from '../lib/indikator'
import { dampakTerbaru } from '../lib/dampak'
import { hitungPrioritas, labelKategori, matriksPrioritas } from '../lib/prioritas'
import { rekomendasiProvinsi } from '../lib/rekomendasi'
import { gabungSeri, perubahanPeringkat } from '../lib/tren'
import ProvinsiTrend from '../components/ProvinsiTrend'
import KonteksGrid from '../components/KonteksGrid'
import RekomendasiList from '../components/RekomendasiList'
import SegmentedControl from '../components/SegmentedControl'
import KepalaHalaman from '../components/KepalaHalaman'
import CaraMembaca from '../components/CaraMembaca'
import AksiData from '../components/AksiData'
import { aksiStandar } from '../components/aksiStandar'
import Sumber from '../components/Sumber'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'
import { fotoProvinsi } from '../content/fotoProvinsi'

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
    const selisih = prov.nilai !== null && nas.nilai !== null ? prov.nilai - nas.nilai : null
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
      <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <Muat />
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <Gagal message={error} onReload={reload} />
      </main>
    )
  }

  if (!provinsi) {
    return (
      <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <h1 className="font-serif text-[1.75rem] text-tinta">Provinsi tidak ditemukan</h1>
        <p className="mt-2 text-tinta-redup">
          Kode provinsi <span className="font-semibold">{kode}</span> tidak ada di data BPS yang tersedia.
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
  // Foto ikon daerah dari Wikimedia Commons; foto umum bila provinsi belum punya foto sendiri.
  const foto = fotoProvinsi(kode) || {
    src: '/images/foto-umum.jpeg',
    alt: 'Foto suasana pendidikan di Indonesia',
  }
  const kreditFoto = foto.artis ? (
    <>
      Foto: {foto.alt}.{' '}
      <a
        href={foto.sumber}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-garis underline-offset-2 hover:text-tinta"
      >
        {foto.artis}
      </a>
      ,{' '}
      <a
        href={foto.lisensiUrl}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-garis underline-offset-2 hover:text-tinta"
      >
        {foto.lisensi}
      </a>
      , via Wikimedia Commons. Diperkecil.
    </>
  ) : null

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

  const konteksPeringkat = skor
    ? `Peringkat ${skor.peringkat} dari ${prioritas.daftar.length} pada indeks prioritas.`
    : 'Peringkat belum tersedia karena data indikator belum cukup.'

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <nav aria-label="Remah navigasi" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-tinta-redup">
          <li>
            <Link
              to={`/provinsi?tahun=${tahun}`}
              className="inline-flex min-h-11 items-center underline decoration-garis underline-offset-2 hover:text-tinta"
            >
              Provinsi
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-tinta">
            {provinsi.provinsi}
          </li>
        </ol>
      </nav>

      <KepalaHalaman
        judul={provinsi.provinsi}
        konteks={konteksPeringkat}
        gambar={foto.src}
        alt={foto.alt}
        kredit={kreditFoto}
      />

      <section
        aria-label="Tiga angka utama"
        className="mt-8 grid gap-6 border-y border-garis py-6 sm:grid-cols-3"
      >
        <div>
          <p className="teks-bantu">Indeks prioritas</p>
          <p className="mt-1 font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.02em] text-tinta tabular-nums md:text-[2.75rem]">
            {skor ? formatAngka(skor.skor, 1) : '-'}
            {skor && <span className="text-[1.25rem] text-tinta-redup">/100</span>}
          </p>
          <p className="teks-bantu mt-2">
            {skor ? `Peringkat ${skor.peringkat} dari ${prioritas.daftar.length}` : 'Data belum tersedia'}
          </p>
        </div>
        <div>
          <p className="teks-bantu">Kuadran prioritas</p>
          <p className="mt-1 font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.02em] text-tinta md:text-[2.75rem]">
            {kategori?.kategori || '-'}
          </p>
          <p className="teks-bantu mt-2">
            {kategori
              ? `${labelKategori(kategori.kategori)}. Level ${formatAngka(kategori.level, 1)}% · tren ${formatPoin(kategori.tren, 1)}`
              : 'Belum tersedia'}
          </p>
        </div>
        <div>
          <p className="teks-bantu">Cakupan indikator</p>
          <p className="mt-1 font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.02em] text-tinta tabular-nums md:text-[2.75rem]">
            {skor ? `${skor.cakupan}/6` : '-'}
          </p>
          <p className="teks-bantu mt-2">Indikator yang tersedia untuk provinsi ini.</p>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="subjudul text-tinta">Tren {labelTren}</h2>
          <SegmentedControl options={TREN_OPTIONS} value={mode} onChange={setMode} label="Indikator tren" />
        </div>
        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {trend.length ? (
            <>
              <p className="text-base leading-relaxed text-tinta">
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
                    {akhir ? peringkat.akhir.peringkat : '-'} dari {peringkat.akhir?.total || '-'} provinsi
                    (selisih peringkat {peringkat.deltaPeringkat >= 0 ? '+' : ''}
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
          <Sumber tahun={trend.length ? `${trend[0].tahun}–${trend[trend.length - 1].tahun}` : undefined} />
          <CaraMembaca>
            <p>
              Garis merah menunjukkan angka {provinsi.provinsi}, garis biru menunjukkan rata-rata nasional.
            </p>
            <p>
              {deltaTren !== null
                ? `Perubahan ${formatPoin(deltaTren, 2)} dari ${awal.tahun} ke ${akhir.tahun}. Bila garis merah mendekat ke garis biru, provinsi ini sedang mengejar nasional; bila menjauh, makin tertinggal.`
                : 'Bila garis merah mendekat ke garis biru, provinsi ini sedang mengejar nasional; bila menjauh, makin tertinggal.'}
            </p>
            <p>Angka ini menunjukkan arah, bukan proyeksi.</p>
          </CaraMembaca>
        </div>
      </section>

      {dampak && (
        <section className="mt-12 border-t border-garis pt-6">
          <h2 className="subjudul text-tinta">Perkiraan jumlah anak PAUD</h2>
          <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-tinta">
            Sekitar {formatJumlahOrang(dampak.estimasi)} usia 3–6 tahun berpotensi mendapat layanan PAUD
            tambahan jika partisipasi menyamai nasional.
          </p>
          <p className="teks-bantu mt-1 max-w-[68ch]">
            Perkiraan, bukan sensus. {dampak.metode} Asumsi: {dampak.asumsi}
          </p>
        </section>
      )}

      <KonteksGrid items={konteks} judul="Konteks provinsi" />

      <RekomendasiList items={rekomendasi} judul={`Rekomendasi kontekstual · ${provinsi.provinsi}`} />

      <AksiData
        aksi={aksiStandar({
          temuan: `${provinsi.provinsi}: skor prioritas ${skor ? formatAngka(skor.skor, 1) : '-'}/100. ${konteksPeringkat}`,
          judulBagikan: `SETARA | ${provinsi.provinsi}`,
          csv: {
            nama: `setara-${provinsi.provinsi}-${tahun}.csv`,
            baris: konteks.map((k) => ({
              indikator: k.label,
              provinsi: k.nilai,
              nasional: k.nasional,
              selisih: k.selisih,
            })),
            kolom: [
              { key: 'indikator', label: 'Indikator' },
              { key: 'provinsi', label: 'Provinsi' },
              { key: 'nasional', label: 'Nasional' },
              { key: 'selisih', label: 'Selisih' },
            ],
          },
          sitasi: { judul: `Profil ${provinsi.provinsi}`, tahun },
          bisaCetak: true,
        })}
      />

      <nav aria-label="Navigasi provinsi" className="mt-12 flex flex-wrap gap-x-6 border-t border-garis pt-6">
        <Link
          to={`/provinsi?tahun=${tahun}`}
          className="tekan inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
        >
          ← Kembali ke peringkat provinsi
        </Link>
        <Link
          to="/metode"
          className="tekan inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
        >
          Metode dan keterbatasan
        </Link>
      </nav>
    </main>
  )
}
