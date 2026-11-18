import { Link } from 'react-router-dom'
import { useData } from '../lib/data'
import { downloadCsv } from '../lib/ekspor'
import { REFERENSI } from '../lib/solusi'
import { SUMBER, bisaDitampilkan } from '../content/kutipan'
import KepalaHalaman from '../components/KepalaHalaman'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

const RUMUS = [
  {
    judul: 'Selisih absolut',
    teks: 'Nilai kelompok tertinggi dikurangi nilai kelompok terendah, dalam poin persentase.',
  },
  {
    judul: 'Rasio',
    teks: 'Nilai kelompok tertinggi dibagi nilai kelompok terendah.',
  },
  {
    judul: 'Selisih dari nasional',
    teks: 'Nilai provinsi dikurangi nilai Indonesia pada indikator yang sama.',
  },
  {
    judul: 'Skor prioritas',
    teks: 'Rata-rata skor persentil enam indikator: partisipasi SMA, APK PAUD, lama sekolah, kemiskinan, IPM, dan ketimpangan gender. Indikator yang lebih buruk diberi skor prioritas lebih tinggi. Bobot sama; cakupan data ditampilkan.',
  },
  {
    judul: 'Estimasi jumlah anak',
    teks: 'Persentase selisih dikalikan populasi usia sekolah. Untuk kelompok pengeluaran, dipakai asumsi 20% anak per kelompok pengeluaran. Populasi provinsi memakai distribusi umur SP2020 yang diskalakan ke total penduduk 2025. Angka ini indikatif, bukan sensus. Asumsi 20% anak per kelompok bersifat sederhana: bila keluarga berpengeluaran rendah memiliki lebih banyak anak, estimasi untuk kelompok termiskin cenderung lebih rendah dari keadaan sebenarnya.',
  },
  {
    judul: 'Kuadran prioritas',
    teks: 'Membandingkan level partisipasi terbaru dengan perubahan sejak 2019. Garis pembagi memakai median provinsi. Kuadran adalah alat bantu, bukan penilaian kinerja resmi.',
  },
]

const ISI = [
  { id: 'sumber', label: 'Sumber dan pembaruan' },
  { id: 'indikator', label: 'Indikator' },
  { id: 'istilah', label: 'Istilah' },
  { id: 'rumus', label: 'Rumus dan asumsi' },
  { id: 'keterbatasan', label: 'Keterbatasan' },
  { id: 'pustaka', label: 'Daftar pustaka' },
  { id: 'sitasi', label: 'Sitasi' },
]

const ISTILAH = [
  ['Anak tidak sekolah', 'Anak usia sekolah yang tidak sedang mengikuti pendidikan formal atau nonformal.'],
  ['Poin', 'Satuan untuk selisih antara dua persentase. Selisih 10 poin berbeda dengan 10%.'],
  [
    'Kelompok termiskin dan terkaya',
    'Penduduk dibagi menjadi lima kelompok berdasarkan pengeluaran. Kelompok termiskin adalah 20% dengan pengeluaran terendah.',
  ],
  [
    'APK dan APS',
    'APK adalah angka partisipasi kasar. APS adalah angka partisipasi sekolah. Keduanya mengukur partisipasi, bukan angka anak tidak sekolah.',
  ],
  ['PAUD', 'Pendidikan anak usia dini untuk anak usia 3-6 tahun.'],
  [
    'IPM',
    'Indeks Pembangunan Manusia, ringkasan kesehatan, pendidikan, dan pendapatan. Semakin tinggi, semakin baik.',
  ],
  [
    'Indeks ketimpangan gender',
    'Ketimpangan antara laki-laki dan perempuan. Semakin rendah angkanya, semakin setara.',
  ],
  [
    'Rasio APM gender',
    '100 berarti setara. Di bawah 100 berarti perempuan tertinggal, dan di atas 100 berarti laki-laki tertinggal.',
  ],
  ['Estimasi', 'Perkiraan yang dihitung dari data, bukan angka sensus atau angka resmi.'],
]

function Bagian({ id, judul, children }) {
  return (
    <section id={id} className="mt-12 first:mt-0 border-t border-garis pt-6 first:border-0 first:pt-0">
      <h2 className="subjudul text-tinta">{judul}</h2>
      {children}
    </section>
  )
}

const TAUTAN = 'underline decoration-garis underline-offset-2 hover:decoration-tinta'

export default function Metode() {
  const { status, meta, error, reload } = useData()

  useDocumentMeta({
    judul: 'Metode dan sumber | SETARA',
    deskripsi: 'Sumber data BPS, definisi indikator, rumus, asumsi, dan keterbatasan aplikasi SETARA.',
  })

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

  const indikator = meta?.indikator || []

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <KepalaHalaman
        judul="Metode dan sumber"
        konteks="Mengapa angka di SETARA bisa dipercaya: dari mana datanya, bagaimana dihitung, dan apa batasnya."
      />

      <div className="mt-8 md:grid md:grid-cols-[13rem_1fr] md:gap-10">
        <nav aria-label="Isi halaman" className="mb-6 md:sticky md:top-20 md:mb-0 md:self-start">
          <ul className="tanpa-scrollbar tepi-pudar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:gap-0 md:px-0 md:[mask-image:none]">
            {ISI.map((b) => (
              <li key={b.id} className="shrink-0">
                <a
                  href={`#${b.id}`}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-garis bg-putih px-4 text-base text-tinta hover:bg-kertas md:rounded-none md:border-0 md:bg-transparent md:px-0 md:text-[0.9375rem] md:text-tinta-redup md:hover:text-tinta"
                >
                  {b.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <Bagian id="sumber" judul="Sumber dan pembaruan">
            <dl className="mt-3 space-y-1 text-base text-tinta">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Sumber:</dt>
                <dd>{meta?.source || 'BPS WebAPI'}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Domain:</dt>
                <dd>{meta?.domain || '0000'}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Diperbarui:</dt>
                <dd>
                  {meta?.generatedAt
                    ? new Date(meta.generatedAt).toLocaleString('id-ID', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })
                    : '-'}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold">Catatan:</dt>
                <dd className="max-w-[68ch]">{meta?.catatan || '-'}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/data/indikator.json"
                className="tekan inline-flex min-h-11 items-center rounded-lg border border-garis bg-putih px-3 text-sm text-tinta hover:bg-kertas"
              >
                Buka JSON indikator
              </a>
              <a
                href="/data/meta.json"
                className="tekan inline-flex min-h-11 items-center rounded-lg border border-garis bg-putih px-3 text-sm text-tinta hover:bg-kertas"
              >
                Buka metadata
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    'setara-daftar-indikator.csv',
                    indikator.map((i) => ({
                      indikator: i.indikator,
                      var_id: i.var_id,
                      judul: i.judul,
                      satuan: i.satuan,
                      tahun: (i.tahun || []).join('; '),
                      baris: i.baris,
                    })),
                    [
                      { key: 'indikator', label: 'Indikator' },
                      { key: 'var_id', label: 'Var ID' },
                      { key: 'judul', label: 'Judul' },
                      { key: 'satuan', label: 'Satuan' },
                      { key: 'tahun', label: 'Tahun' },
                      { key: 'baris', label: 'Baris' },
                    ],
                  )
                }
                className="tekan inline-flex min-h-11 items-center rounded-lg border border-garis bg-putih px-3 text-sm text-tinta hover:bg-kertas"
              >
                Unduh daftar indikator (CSV)
              </button>
            </div>
          </Bagian>

          <Bagian id="indikator" judul="Indikator yang dipakai">
            <div
              className="mt-3 overflow-x-auto rounded-lg border border-garis bg-putih p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              tabIndex={0}
              role="region"
              aria-label="Tabel indikator"
            >
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-garis text-tinta-redup">
                    <th className="py-2 pr-4 font-medium">Indikator</th>
                    <th className="py-2 pr-4 font-medium">Var BPS</th>
                    <th className="py-2 pr-4 font-medium">Satuan</th>
                    <th className="py-2 pr-4 font-medium">Tahun</th>
                    <th className="py-2 font-medium">Baris</th>
                  </tr>
                </thead>
                <tbody>
                  {indikator.map((i, index) => (
                    <tr
                      key={`${i.indikator}-${i.var_id}-${index}`}
                      className="border-b border-garis last:border-0"
                    >
                      <td className="py-2 pr-4 text-tinta">{i.judul}</td>
                      <td className="py-2 pr-4 text-tinta">{i.var_id}</td>
                      <td className="py-2 pr-4 text-tinta">{i.satuan}</td>
                      <td className="py-2 pr-4 text-tinta">{(i.tahun || []).join(', ')}</td>
                      <td className="py-2 text-tinta">{i.baris}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Bagian>

          <Bagian id="istilah" judul="Istilah">
            <dl className="mt-3 max-w-[68ch] space-y-3 text-base leading-relaxed">
              {ISTILAH.map(([istilah, arti]) => (
                <div key={istilah}>
                  <dt className="font-semibold text-tinta">{istilah}</dt>
                  <dd className="text-tinta-redup">{arti}</dd>
                </div>
              ))}
            </dl>
          </Bagian>

          <Bagian id="rumus" judul="Rumus dan asumsi">
            <dl className="mt-3 max-w-[68ch] space-y-3 text-base leading-relaxed">
              {RUMUS.map((r) => (
                <div key={r.judul}>
                  <dt className="font-semibold text-tinta">{r.judul}</dt>
                  <dd className="text-tinta-redup">{r.teks}</dd>
                </div>
              ))}
            </dl>

            {/* Matematika indeks prioritas: bahasa awam dulu, notasi sesudahnya, lalu batasan yang diakui. */}
            <div className="mt-8 max-w-[68ch] rounded-lg bg-putih p-5">
              <h3 className="text-base font-semibold text-tinta">Indeks prioritas, langkah demi langkah</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-base leading-relaxed text-tinta">
                <li>Untuk setiap indikator, urutkan 38 provinsi.</li>
                <li>Beri skor 0–100 menurut posisinya; 100 berarti paling perlu didahulukan.</li>
                <li>Bila nilai tinggi berarti baik (misalnya IPM), urutannya dibalik.</li>
                <li>Skor indeks adalah rata-rata enam skor itu, dengan bobot sama.</li>
              </ol>
              <div className="mt-4 space-y-1 rounded-md border border-garis px-4 py-3 font-serif text-[1.0625rem] text-tinta">
                <p>
                  persentil = <i>r</i> ÷ (<i>n</i> − 1) × 100
                </p>
                <p>
                  skor indeks = (<i>P</i>
                  <sub>1</sub> + <i>P</i>
                  <sub>2</sub> + … + <i>P</i>
                  <sub>6</sub>) ÷ 6
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-tinta-redup">
                <i>r</i> = posisi provinsi dalam urutan, mulai dari 0; <i>n</i> = jumlah provinsi yang punya
                data (38).
              </p>
              <p className="mt-3 text-base leading-relaxed text-tinta">
                Contoh, Papua Pegunungan: (97,3 + 100 + 100 + 97,3 + 100 + 100) ÷ 6 = 99,1.{' '}
                <Link to="/provinsi/9700#perhitungan" className={TAUTAN}>
                  Lihat rinciannya
                </Link>
                .
              </p>
              <p className="mt-3 text-base leading-relaxed text-tinta">
                <span className="font-semibold">Kenapa persentil?</span> Persentil tahan terhadap nilai
                ekstrem: APK PAUD 3,10% di Papua Pegunungan tidak menekan skor provinsi lain seperti pada
                skala min–max. Kelemahannya, jarak antarnilai hilang; yang dipakai hanya urutan.
              </p>
              <p className="mt-3 text-base font-semibold text-tinta">Batasan yang diakui</p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-relaxed text-tinta">
                <li>
                  Bobot keenam indikator sama. Uji kepekaan menunjukkan tiga teratas tidak berubah walau salah
                  satu indikator dihapus, sedangkan peringkat 4–5 bergantung pada indikator yang dipakai.{' '}
                  <Link to="/provinsi#kepekaan" className={TAUTAN}>
                    Lihat uji kepekaan
                  </Link>
                  .
                </li>
                <li>
                  Ada 8 pasang provinsi dengan nilai indikator yang sama persis. Rumus ini tetap memberi
                  keduanya persentil berbeda menurut urutan data; pengaruhnya paling banyak sekitar 0,45 poin
                  indeks, dan lima teratas tidak berubah.
                </li>
                <li>Provinsi dengan skor indeks yang sama diberi peringkat berurutan.</li>
              </ul>
            </div>
          </Bagian>

          <Bagian id="keterbatasan" judul="Keterbatasan">
            <ul className="mt-3 max-w-[68ch] list-disc space-y-2 pl-5 text-base leading-relaxed text-tinta">
              {(meta?.keterbatasan || []).map((k) => (
                <li key={k}>{k}</li>
              ))}
              <li>
                Angka anak tidak sekolah (var 1984/1986/1988) tersedia sampai 2023. Indikator partisipasi yang
                lebih baru tidak dicampur dalam grafik yang sama.
              </li>
              <li>
                Estimasi jumlah anak memakai proyeksi populasi dan asumsi distribusi. Angka ini bukan hasil
                sensus dan tidak boleh dikutip sebagai angka resmi.
              </li>
              <li>
                Beberapa provinsi baru Papua memiliki data terbatas atau RSE tinggi pada indikator tertentu.
                Aplikasi menampilkan data yang tersedia dan tidak mengisi kekosongan dengan nol.
              </li>
              <li>
                Skor prioritas menunjukkan kebutuhan relatif, bukan penilaian resmi. Skor rendah tidak berarti
                tidak ada masalah, dan skor tinggi tidak berarti gagal.
              </li>
              <li>
                Partisipasi sekolah dan angka anak tidak sekolah adalah dua hal berbeda. Hubungan
                antarindikator tidak membuktikan sebab-akibat.
              </li>
              <li>
                Rekomendasi bersandar pada studi dengan kekuatan bukti yang berbeda: sebagian uji acak atau
                ulasan sistematis, sebagian hanya menunjukkan hubungan. Jenis studinya tertera pada setiap
                kutipan bukti.
              </li>
            </ul>
          </Bagian>

          <Bagian id="pustaka" judul="Daftar pustaka">
            <p className="teks-bantu mt-1 max-w-[68ch]">
              Rujukan yang mendasari solusi dan rekomendasi. Jurnal berlisensi terbuka dapat dibaca langsung
              di SETARA, dengan kalimat yang dikutip disorot. Jurnal lain dibuka di situs sumbernya.
            </p>
            <ol className="mt-3 max-w-[72ch] space-y-4">
              {REFERENSI.map((r) => {
                const sumber = SUMBER[r.id]
                const tampil = bisaDitampilkan(sumber)
                return (
                  <li key={r.id} className="text-base leading-relaxed">
                    <p className="break-words text-tinta">{r.referensi}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tinta-redup">
                      {sumber && (
                        <span className="rounded-full bg-putih px-2 py-0.5 text-tinta">{sumber.jenis}</span>
                      )}
                      {sumber?.lisensi && <span>Lisensi {sumber.lisensi.nama}</span>}
                      {tampil && (
                        <Link
                          to={`/rujukan/${r.id}`}
                          className={`${TAUTAN} inline-flex min-h-11 items-center md:min-h-0`}
                        >
                          Baca di SETARA
                        </Link>
                      )}
                      {sumber?.baca && (
                        <a
                          href={sumber.baca.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`${TAUTAN} inline-flex min-h-11 items-center md:min-h-0`}
                        >
                          {tampil ? 'Sumber asli' : `Baca di ${sumber.baca.label}`} ↗
                        </a>
                      )}
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`${TAUTAN} inline-flex min-h-11 items-center md:min-h-0`}
                        >
                          DOI ↗
                        </a>
                      )}
                    </p>
                  </li>
                )
              })}
            </ol>
          </Bagian>

          <Bagian id="sitasi" judul="Sitasi">
            <p className="mt-2 max-w-[68ch] break-words text-base leading-relaxed text-tinta">
              SETARA | Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses. (2026). Data BPS (Susenas).
              Diakses dari {typeof window !== 'undefined' ? window.location.origin : 'situs SETARA'}.
            </p>
            <p className="teks-bantu mt-2 max-w-[68ch]">
              Ganti tahun akses sesuai tanggal penggunaan. Untuk kutipan angka, cantumkan tabel BPS asli dan
              verifikasi satuan sebelum dipublikasikan.
            </p>
          </Bagian>
        </div>
      </div>
    </main>
  )
}
