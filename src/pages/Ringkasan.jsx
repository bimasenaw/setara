import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, perbandingan, nasional } from '../lib/metrik'
import { kalimatDimensi, kalimatRingkasanUtama, tahunTerakhir, temuanTigaDimensi } from '../lib/temuan'
import { validJenjang, validTahun, tulisParam, tautanKesenjangan } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import StatRow from '../components/StatRow'
import Accordion from '../components/Accordion'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

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

  useDocumentMeta({
    judul: 'SETARA | Ringkasan kesenjangan pendidikan',
    deskripsi:
      'Ringkasan kesenjangan pendidikan Indonesia: wilayah, ekonomi, gender, dan prioritas provinsi dari data BPS.',
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

  const kalimatUtama =
    kalimatRingkasanUtama(tidakSekolah, jenjang, tahun) ||
    kalimatDimensi(tidakSekolah, 'ekonomi', jenjang, tahun)
  const temuan = temuanTigaDimensi(tidakSekolah, tahun)

  const wilayah = perbandingan(tidakSekolah, 'wilayah', jenjang, tahun)
  const ekonomi = perbandingan(tidakSekolah, 'ekonomi', jenjang, tahun)
  const gender = perbandingan(tidakSekolah, 'gender', jenjang, tahun)
  const angkaNasional = nasional(tidakSekolah, jenjang, tahun)
  const dampakEko = dampakEkonomi(tidakSekolah, indikator, jenjang, tahun)
  const dampakGen = dampakGender(tidakSekolah, indikator, jenjang, tahun)

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
        <div>
          <h1 className="font-serif text-[1.75rem] font-semibold leading-tight text-tinta md:text-[2.5rem]">
            SETARA
          </h1>
          <p className="mt-1 text-base text-tinta-redup">
            Melihat kesenjangan pendidikan lewat data BPS.
          </p>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-tinta">
            SETARA (Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses) menunjukkan siapa yang
            paling tertinggal dalam pendidikan Indonesia. Dari data BPS (Susenas), aplikasi ini
            memetakan angka anak tidak sekolah lewat tiga sudut: wilayah (desa dan kota), ekonomi
            (kelompok pengeluaran), dan gender, serta peringkat partisipasi pendidikan usia dini per
            provinsi. Setiap temuan diarahkan menjadi solusi yang didukung studi literatur.
          </p>
        </div>
        <img
          src="/images/foto-kelas.svg"
          alt="Ilustrasi suasana kelas"
          className="h-52 w-full rounded-lg border border-garis object-cover md:h-full"
          loading="lazy"
        />
      </div>

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

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={tautanKesenjangan({ tab: 'ekonomi', tahun, jenjang })}
          className="min-h-11 rounded-lg bg-tinta px-4 py-2 text-base text-putih hover:bg-tinta-redup"
        >
          Lihat kesenjangan
        </Link>
        <Link
          to="/provinsi"
          className="min-h-11 rounded-lg border border-garis bg-putih px-4 py-2 text-base text-tinta hover:bg-kertas"
        >
          Lihat peringkat provinsi
        </Link>
      </div>

      <section className="mt-10">
        <p className="max-w-[30ch] font-serif text-[1.75rem] leading-snug text-tinta md:text-[2.5rem]">
          {kalimatUtama || 'Kesenjangan pendidikan paling tajam terlihat di tingkat ekonomi.'}
        </p>
        <Accordion judul="Apa maksud temuan ini?">
          <p>
            Angka pada kalimat di atas adalah persentase anak usia sekolah yang tidak sedang
            bersekolah. Semakin tinggi angkanya, semakin banyak anak yang tertinggal.
          </p>
          <p>
            Perbedaan antara dua kelompok disebut selisih poin. Contohnya, selisih 10 poin berarti
            satu kelompok 10 poin lebih tinggi daripada kelompok lain.
          </p>
        </Accordion>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-tinta">Tiga temuan utama ({tahun})</h2>
        <div className="mt-3 space-y-3">
          {temuan.map((t) => (
            <Link
              key={t.dimensi}
              to={tautanKesenjangan({ tab: t.dimensi, tahun, jenjang: t.jenjang })}
              className="block rounded-lg border border-garis bg-putih p-4 hover:border-tinta"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-tinta-redup">
                {t.dimensi}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-tinta">{t.kalimat}</p>
              <p className="mt-1 text-xs text-tinta-redup">
                Selisih {formatPoin(t.selisih, 2)} · buka detail {t.jenjang}
              </p>
            </Link>
          ))}
        </div>
        <Accordion judul="Dari mana temuan ini?">
          <p>
            Temuan dihitung otomatis dari data BPS. Setiap kotak bisa dibuka untuk melihat rincian
            wilayah, ekonomi, atau gender pada jenjang yang disebut.
          </p>
          <p>
            Angka di kalimat temuan selalu sama dengan angka di halaman detail. Jika data berubah,
            kalimatnya ikut berubah.
          </p>
        </Accordion>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-tinta">Empat angka ringkasan · {jenjang} {tahun}</h2>
        <div className="mt-3 rounded-lg border border-garis bg-putih p-5">
          <StatRow
            label="Nasional"
            a={{ label: 'Anak tidak sekolah', value: angkaNasional }}
          />
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
          <p className="mt-3 text-xs text-tinta-redup">
            Selisih dihitung dalam poin persentase. Satuan nilai: persen. Sumber: BPS, Susenas {tahun}.
          </p>
          <Accordion judul="Apa arti empat angka ini?">
            <p>
              Nasional adalah angka rata-rata seluruh Indonesia. Selisih kota dan desa menunjukkan
              perbedaan antara anak di kota dan anak di desa.
            </p>
            <p>
              Kelompok termiskin adalah 20% keluarga dengan pengeluaran terendah. Kelompok terkaya
              adalah 20% keluarga dengan pengeluaran tertinggi.
            </p>
            <p>
              Selisih laki-laki dan perempuan menunjukkan perbedaan angka anak tidak sekolah antara
              kedua kelompok. Semua selisih ditulis dalam poin, bukan persen.
            </p>
          </Accordion>
        </div>
      </section>

      {(dampakEko || dampakGen) && (
        <section className="mt-10 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Perkiraan jumlah anak</h2>
          <p className="mt-1 text-sm text-tinta-redup">
            Angka ini mengubah persentase menjadi perkiraan jumlah anak. Sifatnya indikatif, bukan
            angka sensus.
          </p>
          <div className="mt-3 space-y-3">
            {dampakEko && (
              <div className="border-b border-garis pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-tinta">
                  Ekonomi · {jenjang}: sekitar {formatJumlahOrang(dampakEko.estimasi)} anak usia{' '}
                  {jenjang} berpotensi kembali bersekolah jika kelompok termiskin setara kelompok
                  terkaya.
                </p>
                <p className="mt-1 text-sm text-tinta-redup">
                  Selisih {formatAngka(dampakEko.gap, 1)} poin.
                </p>
              </div>
            )}
            {dampakGen && (
              <div className="border-b border-garis pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-tinta">
                  Gender · {jenjang}: sekitar {formatJumlahOrang(dampakGen.estimasi)} anak{' '}
                  {dampakGen.kelompok.toLowerCase()} usia {jenjang} berpotensi kembali bersekolah jika
                  setara kelompok pembanding.
                </p>
                <p className="mt-1 text-sm text-tinta-redup">
                  Selisih {formatAngka(dampakGen.gap, 2)} poin.
                </p>
              </div>
            )}
          </div>
          <Accordion judul="Bagaimana perkiraan ini dihitung?">
            {dampakEko && <p>{dampakEko.metode}</p>}
            {dampakGen && <p>{dampakGen.metode}</p>}
            <p>
              Perhitungan memakai proyeksi populasi dan asumsi pembagian kelompok. Angka ini bukan
              hasil sensus. Rumus lengkap ada di halaman Metode.
            </p>
          </Accordion>
        </section>
      )}
    </main>
  )
}
