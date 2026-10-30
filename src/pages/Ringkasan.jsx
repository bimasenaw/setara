import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, perbandingan, nasional } from '../lib/metrik'
import { kalimatDimensi, kalimatRingkasanUtama, tahunTerakhir, temuanTigaDimensi } from '../lib/temuan'
import { validJenjang, validTahun, tulisParam, tautanKesenjangan } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { fotoJenjang } from '../lib/foto'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import StatRow from '../components/StatRow'
import Accordion from '../components/Accordion'
import HeroBanner from '../components/HeroBanner'
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
  const temuan = temuanTigaDimensi(tidakSekolah, tahun, jenjang)
  const foto = fotoJenjang(jenjang)

  const wilayah = perbandingan(tidakSekolah, 'wilayah', jenjang, tahun)
  const ekonomi = perbandingan(tidakSekolah, 'ekonomi', jenjang, tahun)
  const gender = perbandingan(tidakSekolah, 'gender', jenjang, tahun)
  const angkaNasional = nasional(tidakSekolah, jenjang, tahun)
  const dampakEko = dampakEkonomi(tidakSekolah, indikator, jenjang, tahun)
  const dampakGen = dampakGender(tidakSekolah, indikator, jenjang, tahun)
  const gapUtama = [
    { label: 'kota dan desa', value: wilayah.selisih },
    { label: 'kelompok termiskin dan terkaya', value: ekonomi.selisih },
    { label: 'laki-laki dan perempuan', value: gender.selisih },
  ]
    .filter((g) => g.value !== null)
    .reduce((m, g) => (g.value > (m ? m.value : -1) ? g : m), null)

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <HeroBanner
        judul="SETARA"
        deskripsi="Melihat kesenjangan pendidikan lewat data BPS. Aplikasi ini menunjukkan siapa yang paling tertinggal, seberapa jauh, dan apa yang bisa dilakukan."
        gambar={foto.src}
        alt={foto.alt}
      />

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
        <Accordion judul="Apa makna temuan ini?">
          <p>
            Temuan ini menunjukkan bahwa anak dari keluarga termiskin lebih berisiko tidak sekolah
            daripada anak dari keluarga terkaya. Selisih {formatPoin(ekonomi.selisih, 1)} berarti
            jarak antara kedua kelompok sebesar itu.
          </p>
          <p>
            Semakin besar selisihnya, semakin tidak setara akses pendidikannya. Angka ini menunjukkan
            persentase, bukan jumlah anak.
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
        <Accordion judul="Apa makna tiga temuan ini?">
          <p>
            Tiga temuan ini menunjukkan pola yang konsisten: kelompok yang sama cenderung tertinggal
            di beberapa sudut sekaligus. Ini berarti kesenjangan bukan hanya soal rata-rata nasional.
          </p>
          <p>
            Gunakan ketiga temuan bersama untuk melihat apakah masalahnya lebih kuat di wilayah,
            ekonomi, atau gender.
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
          <Accordion judul="Apa makna empat angka ini?">
            <p>
              Empat angka ini menunjukkan bahwa kesenjangan tidak hanya terlihat dari rata-rata
              nasional. Ada jarak antara kota dan desa, antara kelompok termiskin dan terkaya, serta
              antara laki-laki dan perempuan.
            </p>
            {gapUtama && (
              <p>
                Pada jenjang {jenjang}, selisih terbesar ada pada {gapUtama.label}, yaitu{' '}
                {formatPoin(gapUtama.value, 1)}. Ini menunjukkan dimensi yang paling perlu
                diperhatikan.
              </p>
            )}
            <p>Semua selisih ditulis dalam poin, bukan persen.</p>
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
          <Accordion judul="Apa makna perkiraan ini?">
            <p>
              Perkiraan ini menunjukkan skala anak yang mungkin terdampak, bukan hanya persentase.
              Jika kesenjangan ditutup, sekitar {formatJumlahOrang(dampakEko?.estimasi)} anak pada
              dimensi ekonomi dan {formatJumlahOrang(dampakGen?.estimasi)} anak pada dimensi gender
              berpotensi kembali bersekolah.
            </p>
            {dampakEko && <p>{dampakEko.metode}</p>}
            {dampakGen && <p>{dampakGen.metode}</p>}
            <p>
              Angka ini memakai proyeksi populasi dan asumsi pembagian kelompok. Bukan hasil sensus.
            </p>
          </Accordion>
        </section>
      )}
    </main>
  )
}
