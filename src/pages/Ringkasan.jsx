import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, PAIRS, perbandingan, nasional } from '../lib/metrik'
import {
  KELOMPOK_AWAM,
  kalimatDimensi,
  kalimatRingkasanUtama,
  tahunTerakhir,
  temuanTigaDimensi,
} from '../lib/temuan'
import { validJenjang, validTahun, tulisParam, tautanKesenjangan, labelKelompok } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { fotoJenjang } from '../lib/foto'
import { formatJumlahOrang, formatPersen, formatPoin } from '../lib/format'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import StatRow from '../components/StatRow'
import Dumbbell from '../components/Dumbbell'
import BatangBerdampingan from '../components/BatangBerdampingan'
import { BENTUK_GRAFIK, bentukDariParam, nilaiParamBentuk } from '../components/bentukGrafik'
import CaraMembaca from '../components/CaraMembaca'
import AksiData from '../components/AksiData'
import { aksiStandar } from '../components/aksiStandar'
import Sumber from '../components/Sumber'
import LangkahBerikutnya from '../components/LangkahBerikutnya'
import HeroBanner from '../components/HeroBanner'
import KreditFoto from '../components/KreditFoto'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

// Keterangan pendek di bawah angka besar temuan: angka persennya tidak diulang.
// Nilai dan nama kelompok sama dengan kalimatDimensi di src/lib/temuan.js; arah mengikuti tanda selisih.
function keteranganTemuan(t) {
  const tertinggal = KELOMPOK_AWAM[PAIRS[t.dimensi].tertinggal]
  const pembanding = KELOMPOK_AWAM[PAIRS[t.dimensi].pembanding].replace(/^dari /, '').replace(/^di /, '')
  const arah = t.selisih >= 0 ? 'di atas' : 'di bawah'
  return `anak ${tertinggal} tidak sekolah · ${formatPoin(Math.abs(t.selisih), 1)} ${arah} ${pembanding}`
}

const DIMENSI = [
  { key: 'wilayah', label: 'Wilayah' },
  { key: 'ekonomi', label: 'Ekonomi' },
  { key: 'gender', label: 'Gender' },
]

export default function Ringkasan() {
  const { status, tidakSekolah, indikator, error, reload } = useData()
  const [params, setParams] = useSearchParams()

  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(
    params.get('tahun'),
    tahunTersedia,
    tahunTersedia[tahunTersedia.length - 1] || tahunTerakhir(tidakSekolah),
  )
  const jenjang = validJenjang(params.get('jenjang'), JENJANG)
  const bentuk = bentukDariParam(params)

  useDocumentMeta({
    judul: 'Ringkasan kesenjangan pendidikan | SETARA',
    deskripsi:
      'Ringkasan kesenjangan pendidikan Indonesia: wilayah, ekonomi, gender, dan prioritas provinsi dari data BPS.',
  })

  const foto = fotoJenjang(jenjang)
  const hero = (
    <HeroBanner
      ramping
      judul="SETARA"
      deskripsi={
        <>
          Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses.
          <span className="hidden md:inline">
            {' '}
            Melihat siapa yang paling tertinggal, seberapa jauh, dan apa yang bisa dilakukan, dari data BPS.
          </span>
        </>
      }
      gambar={foto.src}
      srcSet={foto.srcSet}
      alt={foto.alt}
      kredit={<KreditFoto foto={foto} />}
    />
  )

  if (status === 'loading') {
    return (
      <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
        {hero}
        <div className="mt-8">
          <Muat />
        </div>
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

  const kalimatUtama =
    kalimatRingkasanUtama(tidakSekolah, jenjang, tahun) ||
    kalimatDimensi(tidakSekolah, 'ekonomi', jenjang, tahun) ||
    'Kesenjangan pendidikan paling tajam terlihat di tingkat ekonomi.'
  const temuan = temuanTigaDimensi(tidakSekolah, tahun, jenjang)

  const wilayah = perbandingan(tidakSekolah, 'wilayah', jenjang, tahun)
  const ekonomi = perbandingan(tidakSekolah, 'ekonomi', jenjang, tahun)
  const gender = perbandingan(tidakSekolah, 'gender', jenjang, tahun)
  const perDimensi = { wilayah, ekonomi, gender }
  const angkaNasional = nasional(tidakSekolah, jenjang, tahun)
  const dampakEko = dampakEkonomi(tidakSekolah, indikator, jenjang, tahun)
  const dampakGen = dampakGender(tidakSekolah, indikator, jenjang, tahun)

  const items = DIMENSI.map((d) => ({
    label: d.label,
    pembanding: perDimensi[d.key].pembanding,
    tertinggal: perDimensi[d.key].tertinggal,
  }))
  const adaGrafik = items.some((it) => it.pembanding !== null || it.tertinggal !== null)
  const namaPembanding = DIMENSI.map((d) =>
    labelKelompok(PAIRS[d.key].pembanding)
      .replace(/ \(20%\)/, '')
      .toLowerCase(),
  ).join(', ')
  const namaTertinggal = DIMENSI.map((d) =>
    labelKelompok(PAIRS[d.key].tertinggal)
      .replace(/ \(20%\)/, '')
      .toLowerCase(),
  ).join(', ')

  const terbesar = DIMENSI.map((d) => ({ ...d, selisih: perDimensi[d.key].selisih }))
    .filter((d) => d.selisih !== null)
    .reduce((m, d) => (d.selisih > (m ? m.selisih : -1) ? d : m), null)

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      {hero}

      <p className="judul-temuan mt-8 max-w-[30ch] text-tinta">{kalimatUtama}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SegmentedControl
          options={JENJANG.map((j) => ({ value: j, label: j }))}
          value={jenjang}
          onChange={(v) => tulisParam(params, setParams, 'jenjang', v)}
          label="Jenjang"
        />
        <TahunSelect
          options={tahunTersedia}
          value={tahun}
          onChange={(v) => tulisParam(params, setParams, 'tahun', v)}
        />
      </div>

      <section className="mt-6 rounded-lg border border-garis bg-putih p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <h2 className="subjudul text-tinta">
            Tiga jarak antarkelompok · {jenjang} {tahun}
          </h2>
          {adaGrafik && (
            <SegmentedControl
              options={BENTUK_GRAFIK}
              value={bentuk}
              onChange={(v) => tulisParam(params, setParams, 'grafik', nilaiParamBentuk(v))}
              label="Bentuk grafik"
            />
          )}
        </div>
        {adaGrafik ? (
          <div className="mt-4">
            {bentuk === 'batang' ? (
              <BatangBerdampingan
                items={items}
                pembandingNama={namaPembanding}
                tertinggalNama={namaTertinggal}
                ringkasan={kalimatUtama}
                baris="dimensi"
              />
            ) : (
              <Dumbbell
                items={items}
                pembandingNama={namaPembanding}
                tertinggalNama={namaTertinggal}
                ringkasan={kalimatUtama}
                baris="dimensi"
                labelLebar={84}
              />
            )}
          </div>
        ) : (
          <p className="teks-bantu mt-3">Data belum tersedia untuk tahun {tahun}.</p>
        )}
        <Sumber tahun={tahun} selisih />
        <CaraMembaca>
          {bentuk === 'batang' ? (
            <p>
              Setiap baris membandingkan dua kelompok anak yang tidak sekolah pada {jenjang} {tahun}: batang
              merah di atas untuk kelompok yang lebih tertinggal, batang biru di bawahnya untuk kelompok
              pembanding. Keduanya berawal dari garis yang sama.
            </p>
          ) : (
            <p>
              Setiap baris membandingkan dua kelompok anak yang tidak sekolah pada {jenjang} {tahun}:
              lingkaran biru untuk kelompok pembanding, persegi merah untuk kelompok yang lebih tertinggal.
            </p>
          )}
          <p>
            {(() => {
              const dasar =
                bentuk === 'batang'
                  ? 'Makin besar beda panjang kedua batang, makin jauh jaraknya.'
                  : 'Garis yang lebih panjang berarti jarak yang lebih jauh.'
              return terbesar
                ? `${dasar} Pada ${jenjang}, jarak terbesar ada pada ${terbesar.label.toLowerCase()}, yaitu ${formatPoin(terbesar.selisih, 1)}.`
                : dasar
            })()}
          </p>
          <p>Angka ini adalah persentase anak, bukan jumlah anak, dan berasal dari survei sampel.</p>
        </CaraMembaca>
        <details className="group mt-1">
          <summary className="tekan inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-sm font-semibold text-tinta [&::-webkit-details-marker]:hidden">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 transition-transform duration-150 ease-out group-open:rotate-90"
            >
              <path
                d="M6 3.5 10.5 8 6 12.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Lihat angka lengkap · {jenjang} {tahun}
          </summary>
          <div className="pl-6">
            <StatRow label="Nasional" a={{ label: 'Anak tidak sekolah', value: angkaNasional }} />
            <StatRow
              label="Selisih kota dan desa"
              a={{ label: 'Kota', value: wilayah.pembanding }}
              b={{ label: 'Desa', value: wilayah.tertinggal }}
              selisih={wilayah.selisih}
            />
            <StatRow
              label="Selisih kelompok termiskin dan terkaya"
              a={{ label: 'Termiskin (20%)', value: ekonomi.tertinggal }}
              b={{ label: 'Terkaya (20%)', value: ekonomi.pembanding }}
              selisih={ekonomi.selisih}
            />
            <StatRow
              label="Selisih laki-laki dan perempuan"
              a={{ label: 'Laki-laki', value: gender.tertinggal }}
              b={{ label: 'Perempuan', value: gender.pembanding }}
              selisih={gender.selisih}
            />
          </div>
        </details>
      </section>

      <section className="mt-12 border-t border-garis pt-6">
        <h2 className="subjudul text-tinta">Tiga temuan utama ({tahun})</h2>
        {/* Setiap temuan tersusun tegak: label, angka, kalimat, tautan. HP bertumpuk, desktop tiga kolom. */}
        <ul className="mt-4 md:grid md:grid-cols-3">
          {temuan.map((t) => (
            <li
              key={t.dimensi}
              className="flex flex-col border-b border-garis py-5 first:pt-0 last:border-0 md:border-b-0 md:border-l md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
            >
              <p className="label-grafik uppercase tracking-wide text-tinta-redup">
                {t.dimensi} · {t.jenjang}
              </p>
              <p className="mt-2 font-serif text-[2.75rem] font-semibold leading-none tracking-[-0.02em] text-tinta tabular-nums md:text-[3.25rem]">
                {formatPersen(t.tertinggal, 1)}
              </p>
              <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-tinta">{keteranganTemuan(t)}</p>
              <Link
                to={tautanKesenjangan({ tab: t.dimensi, tahun, jenjang: t.jenjang })}
                aria-label={`Rincian di Kesenjangan: ${t.dimensi}, ${t.jenjang}`}
                className="mt-auto inline-flex whitespace-nowrap min-h-11 items-center gap-1 self-start pt-2 text-sm font-semibold text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
              >
                Rincian di Kesenjangan<span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {(dampakEko || dampakGen) && (
        <section className="mt-12 border-t border-garis pt-6">
          <h2 className="subjudul text-tinta">Perkiraan jumlah anak</h2>
          <p className="teks-bantu mt-1">
            <span className="font-semibold text-tinta">Perkiraan, bukan sensus.</span> Persentase diubah
            menjadi perkiraan jumlah anak memakai proyeksi penduduk usia sekolah. Lihat{' '}
            <Link
              to="/metode#rumus"
              className="underline decoration-garis underline-offset-2 hover:decoration-tinta"
            >
              rumus dan asumsinya
            </Link>
            .
          </p>
          <ul className="mt-3 max-w-[68ch]">
            {dampakEko && (
              <li className="border-b border-garis py-3 last:border-0">
                <p className="text-base leading-relaxed text-tinta">
                  <span className="font-semibold">Ekonomi · {jenjang}:</span> sekitar{' '}
                  {formatJumlahOrang(dampakEko.estimasi)} usia {jenjang} berpotensi kembali bersekolah jika
                  kelompok termiskin setara kelompok terkaya.
                </p>
              </li>
            )}
            {dampakGen && (
              <li className="border-b border-garis py-3 last:border-0">
                <p className="text-base leading-relaxed text-tinta">
                  <span className="font-semibold">Gender · {jenjang}:</span> sekitar{' '}
                  {formatJumlahOrang(dampakGen.estimasi)} {dampakGen.kelompok.toLowerCase()} usia {jenjang}{' '}
                  berpotensi kembali bersekolah jika setara kelompok pembanding.
                </p>
              </li>
            )}
          </ul>
        </section>
      )}

      <AksiData
        aksi={aksiStandar({
          temuan: kalimatUtama,
          judulBagikan: 'SETARA | Ringkasan kesenjangan pendidikan',
          csv: {
            nama: `setara-ringkasan-${jenjang}-${tahun}.csv`,
            baris: DIMENSI.map((d) => ({
              dimensi: d.label,
              pembanding: perDimensi[d.key].pembanding,
              tertinggal: perDimensi[d.key].tertinggal,
              selisih: perDimensi[d.key].selisih,
            })),
            kolom: [
              { key: 'dimensi', label: 'Dimensi' },
              { key: 'pembanding', label: 'Kelompok pembanding (%)' },
              { key: 'tertinggal', label: 'Kelompok lebih tertinggal (%)' },
              { key: 'selisih', label: 'Selisih (poin)' },
            ],
          },
          sitasi: { judul: kalimatUtama, tahun },
          bisaCetak: true,
        })}
      />

      <LangkahBerikutnya ke="kesenjangan" />
    </main>
  )
}
