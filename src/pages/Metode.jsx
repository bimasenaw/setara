import { Link } from 'react-router-dom'
import { useData } from '../lib/data'
import { downloadCsv } from '../lib/ekspor'
import Accordion from '../components/Accordion'
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
    teks: 'Persentase selisih dikalikan populasi usia sekolah. Untuk kelompok pengeluaran, dipakai asumsi 20% anak per kelompok pengeluaran. Populasi provinsi memakai distribusi umur SP2020 yang diskalakan ke total penduduk 2025. Angka ini indikatif, bukan sensus.',
  },
  {
    judul: 'Kuadran prioritas',
    teks: 'Membandingkan level partisipasi terbaru dengan perubahan sejak 2019. Garis pembagi memakai median provinsi. Kuadran adalah alat bantu, bukan penilaian kinerja resmi.',
  },
]

export default function Metode() {
  const { status, meta, error, reload } = useData()

  useDocumentMeta({
    judul: 'Metode dan sumber | SETARA',
    deskripsi:
      'Sumber data BPS, definisi indikator, rumus, asumsi, dan keterbatasan aplikasi SETARA.',
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

  const indikator = meta?.indikator || []

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <p className="text-sm text-tinta-redup">
        <Link to="/" className="underline decoration-garis underline-offset-2">
          ← Kembali ke ringkasan
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-[1.75rem] leading-snug text-tinta md:text-[2.5rem]">
        Metode dan sumber
      </h1>
      <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-tinta">
        SETARA memakai data BPS yang diambil lewat WebAPI dan disimpan sebagai berkas statis. Aplikasi
        ini menunjukkan siapa yang tertinggal dan seberapa jauh, bukan mengklaim penyebab.
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-garis">
        <img
          src="/images/foto-data.svg"
          alt="Ilustrasi data pendidikan"
          className="h-40 w-full object-cover md:h-52"
          loading="lazy"
        />
      </div>

      <nav
        aria-label="Daftar isi"
        className="mt-6 rounded-lg border border-garis bg-putih p-5"
      >
        <h2 className="text-base font-semibold text-tinta">Daftar isi</h2>
        <ol className="mt-3 grid gap-2 text-sm text-tinta sm:grid-cols-2">
          <li>
            <Link to="/" className="hover:text-tinta-redup">
              Ringkasan
            </Link>
          </li>
          <li>
            <Link to="/kesenjangan" className="hover:text-tinta-redup">
              Kesenjangan: wilayah, ekonomi, gender
            </Link>
          </li>
          <li>
            <Link to="/provinsi" className="hover:text-tinta-redup">
              Peringkat provinsi
            </Link>
          </li>
          <li>
            <Link to="/provinsi/1100" className="hover:text-tinta-redup">
              Contoh profil provinsi
            </Link>
          </li>
          <li>
            <a href="#sumber" className="hover:text-tinta-redup">
              Sumber dan pembaruan
            </a>
          </li>
          <li>
            <a href="#indikator" className="hover:text-tinta-redup">
              Indikator yang dipakai
            </a>
          </li>
          <li>
            <a href="#istilah" className="hover:text-tinta-redup">
              Istilah mudah
            </a>
          </li>
          <li>
            <a href="#rumus" className="hover:text-tinta-redup">
              Rumus dan asumsi
            </a>
          </li>
          <li>
            <a href="#keterbatasan" className="hover:text-tinta-redup">
              Keterbatasan
            </a>
          </li>
          <li>
            <a href="#sitasi" className="hover:text-tinta-redup">
              Sitasi
            </a>
          </li>
        </ol>
      </nav>

      <section id="sumber" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Sumber dan pembaruan</h2>
        <dl className="mt-3 space-y-1 text-sm text-tinta">
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
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 py-2 text-sm text-tinta hover:bg-kertas"
          >
            Buka JSON indikator
          </a>
          <a
            href="/data/meta.json"
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 py-2 text-sm text-tinta hover:bg-kertas"
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
            className="min-h-11 rounded-lg border border-garis bg-putih px-3 py-2 text-sm text-tinta hover:bg-kertas"
          >
            Unduh daftar indikator (CSV)
          </button>
        </div>
      </section>

      <section id="indikator" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Indikator yang dipakai</h2>
        <div className="mt-3 overflow-x-auto">
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
                <tr key={`${i.indikator}-${i.var_id}-${index}`} className="border-b border-garis last:border-0">
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
      </section>

      <section id="istilah" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Istilah mudah</h2>
        <Accordion judul="Buka daftar istilah">
          <dl className="space-y-2">
            <div>
              <dt className="font-semibold text-tinta">Anak tidak sekolah</dt>
              <dd>Anak usia sekolah yang tidak sedang mengikuti pendidikan formal atau nonformal.</dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">Poin</dt>
              <dd>Satuan untuk selisih antara dua persentase. Selisih 10 poin berbeda dengan 10%.</dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">Kelompok termiskin dan terkaya</dt>
              <dd>
                Penduduk dibagi menjadi lima kelompok berdasarkan pengeluaran. Kelompok termiskin
                adalah 20% dengan pengeluaran terendah.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">APK dan APS</dt>
              <dd>
                APK adalah angka partisipasi kasar. APS adalah angka partisipasi sekolah. Keduanya
                mengukur partisipasi, bukan angka anak tidak sekolah.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">PAUD</dt>
              <dd>Pendidikan anak usia dini untuk anak usia 3-6 tahun.</dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">IPM</dt>
              <dd>
                Indeks Pembangunan Manusia, ringkasan kesehatan, pendidikan, dan pendapatan. Semakin
                tinggi, semakin baik.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-tinta">Estimasi</dt>
              <dd>Perkiraan yang dihitung dari data, bukan angka sensus atau angka resmi.</dd>
            </div>
          </dl>
        </Accordion>
      </section>

      <section id="rumus" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Rumus dan asumsi</h2>
        <div className="mt-3">
          {RUMUS.map((r) => (
            <Accordion key={r.judul} judul={r.judul}>
              <p>{r.teks}</p>
            </Accordion>
          ))}
        </div>
      </section>

      <section id="keterbatasan" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Keterbatasan</h2>
        <Accordion judul="Baca keterbatasan data">
          <ul className="list-disc space-y-1 pl-5">
            {(meta?.keterbatasan || []).map((k) => (
              <li key={k}>{k}</li>
            ))}
            <li>
              Angka anak tidak sekolah (var 1984/1986/1988) tersedia sampai 2023. Indikator
              partisipasi yang lebih baru tidak dicampur dalam grafik yang sama.
            </li>
            <li>
              Estimasi jumlah anak memakai proyeksi populasi dan asumsi distribusi. Angka ini bukan
              hasil sensus dan tidak boleh dikutip sebagai angka resmi.
            </li>
            <li>
              Beberapa provinsi baru Papua memiliki data terbatas atau RSE tinggi pada indikator
              tertentu. Aplikasi menampilkan data yang tersedia dan tidak mengisi kekosongan dengan
              nol.
            </li>
          </ul>
        </Accordion>
      </section>

      <section id="sitasi" className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Sitasi</h2>
        <p className="mt-2 max-w-[68ch] break-words text-sm leading-relaxed text-tinta">
          SETARA | Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses. (2026). Data BPS
          (Susenas). Diakses dari {typeof window !== 'undefined' ? window.location.origin : 'situs SETARA'}.
        </p>
        <p className="mt-2 text-xs text-tinta-redup">
          Ganti tahun akses sesuai tanggal penggunaan. Untuk kutipan angka, cantumkan tabel BPS asli
          dan verifikasi satuan sebelum dipublikasikan.
        </p>
      </section>
    </main>
  )
}
