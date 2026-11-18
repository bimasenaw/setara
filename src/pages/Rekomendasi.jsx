import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DaftarRujukan } from '../components/TombolRujukan'
import { REKOMENDASI_UTAMA, tautanDataRekomendasi } from '../content/rekomendasi'
import KepalaHalaman from '../components/KepalaHalaman'
import KreditFoto from '../components/KreditFoto'
import AksiData from '../components/AksiData'
import { aksiStandar } from '../components/aksiStandar'
import Sumber from '../components/Sumber'
import { Muat, Gagal } from '../components/StatusBox'
import { useData } from '../lib/data'
import { nasional, perbandingan } from '../lib/metrik'
import { kalimatDimensi, kalimatProvinsi, tahunTerakhir } from '../lib/temuan'
import { formatAngka, formatPersen, formatPoin } from '../lib/format'
import { fotoJenjang } from '../lib/foto'
import { hitungPrioritas } from '../lib/prioritas'
import { rekomendasiProvinsi } from '../lib/rekomendasi'
import { tautanProvinsi } from '../lib/params'
import { SDG } from '../lib/sdg'
import useDocumentMeta from '../lib/useDocumentMeta'

const JUDUL =
  'Lima langkah untuk menutup kesenjangan, dimulai dari kelompok dan daerah yang paling tertinggal.'

// Temuan setiap rekomendasi dihitung dari data tahun terbaru, bukan disalin dari esai.
// Bila perempuan yang lebih banyak tidak sekolah, kalimat dan sasaran mengikuti data.
function temuanGender(data, tahun) {
  let perempuanTertinggal = false
  const bagian = ['SMP', 'SMA'].map((j) => {
    const p = perbandingan(data, 'gender', j, tahun)
    if (p.pembanding === null || p.tertinggal === null) return null
    if (p.selisih >= 0) return kalimatDimensi(data, 'gender', j, tahun)
    perempuanTertinggal = true
    return `Di ${j}, ${formatPersen(p.pembanding, 1)} anak perempuan tidak sekolah, ${formatPoin(Math.abs(p.selisih), 1)} lebih tinggi dibanding laki-laki.`
  })
  const ada = bagian.filter(Boolean)
  return { teks: ada.length ? ada.join(' ') : null, perempuanTertinggal }
}

export default function Rekomendasi() {
  const { status, tidakSekolah, provinsi, indikator, error, reload } = useData()
  const siap = status === 'ready'

  useDocumentMeta({
    judul: 'Rekomendasi | SETARA',
    deskripsi:
      'Lima rekomendasi berbasis studi untuk menutup kesenjangan pendidikan Indonesia, dimulai dari kelompok dan daerah yang paling tertinggal.',
  })

  const tahun = siap ? tahunTerakhir(tidakSekolah) : null

  const temuan = useMemo(() => {
    if (!siap || !tahun) return {}
    const [sd, smp, sma] = ['SD', 'SMP', 'SMA'].map((j) => nasional(tidakSekolah, j, tahun))
    const tahunProv = [...new Set(provinsi.provinsi.map((p) => p.tahun))].sort((a, b) => a - b).pop()
    const nasProv = provinsi.nasional.find((n) => n.tahun === tahunProv)?.nilai ?? null
    const terendah = provinsi.provinsi
      .filter((p) => p.tahun === tahunProv && p.nilai !== null)
      .sort((a, b) => a.nilai - b.nilai)[0]
    const gender = temuanGender(tidakSekolah, tahun)
    return {
      ekonomi: kalimatDimensi(tidakSekolah, 'ekonomi', 'SMA', tahun),
      transisi:
        sd !== null && smp !== null && sma !== null
          ? `Secara nasional, anak tidak sekolah naik dari ${formatPersen(sd, 1)} di SD menjadi ${formatPersen(smp, 1)} di SMP dan ${formatPersen(sma, 1)} di SMA.`
          : null,
      wilayah: kalimatDimensi(tidakSekolah, 'wilayah', 'SMA', tahun),
      paud: terendah ? kalimatProvinsi(terendah.provinsi, terendah.nilai, nasProv) : null,
      gender: gender.teks,
      perempuanTertinggal: gender.perempuanTertinggal,
    }
  }, [siap, tahun, tidakSekolah, provinsi])

  const mulai = useMemo(() => {
    if (!siap) return []
    return hitungPrioritas(indikator)
      .daftar.slice(0, 5)
      .map((p) => ({ ...p, rekomendasi: rekomendasiProvinsi(indikator, p.kode).slice(0, 2) }))
  }, [siap, indikator])

  const foto = fotoJenjang('SMP')

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <KepalaHalaman
        judul={JUDUL}
        konteks="Setiap langkah berangkat dari temuan di halaman sebelumnya dan didukung studi yang dapat diperiksa lewat DOI."
        gambar={foto.src}
        srcSet={foto.srcSet}
        alt={foto.alt}
        kredit={<KreditFoto foto={foto} />}
      />

      {status === 'error' && (
        <div className="mt-6">
          <Gagal message={error} onReload={reload} />
        </div>
      )}

      <ol className="mt-10 border-t border-garis">
        {REKOMENDASI_UTAMA.map((r, i) => {
          const kalimat = temuan[r.id]
          const sasaran =
            r.id === 'gender' && temuan.perempuanTertinggal ? 'Anak perempuan di jenjang menengah' : r.sasaran
          return (
            <li key={r.id} id={r.id} className="border-b border-garis py-6">
              <p className="teks-bantu">
                {i + 1}. Sasaran: <span className="font-semibold text-tinta">{sasaran}</span>
              </p>
              <h2 className="judul-bagian mt-1 max-w-[48ch] text-tinta">{r.judul}</h2>
              {kalimat ? (
                <p className="mt-2 max-w-[68ch] text-base font-semibold leading-relaxed text-tinta">
                  Temuan{tahun ? ` (${tahun})` : ''}: {kalimat}
                </p>
              ) : status === 'loading' ? (
                <div className="mt-2">
                  <Muat />
                </div>
              ) : null}
              <p className="mt-2 max-w-[68ch] text-base leading-relaxed text-tinta">{r.intervensi}</p>
              <DaftarRujukan
                sumber={r.sumber}
                tempat={`rekomendasi.${r.id}`}
                label="Bukti:"
                className="mt-3"
              />
              <Link
                to={tautanDataRekomendasi(r.data)}
                className="tekan mt-3 inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
              >
                Lihat datanya
              </Link>
            </li>
          )
        })}
      </ol>

      <section className="mt-12">
        <h2 className="subjudul text-tinta">Mulai dari mana?</h2>
        <p className="teks-bantu mt-1 max-w-[68ch]">
          Lima provinsi dengan indeks prioritas tertinggi, masing-masing dengan langkah yang paling relevan
          menurut datanya.
        </p>
        {status === 'loading' ? (
          <div className="mt-3">
            <Muat />
          </div>
        ) : (
          <ol className="mt-2 border-t border-garis">
            {mulai.map((p) => (
              <li key={p.kode} className="border-b border-garis py-4">
                <p className="text-base text-tinta">
                  <span className="font-semibold">{p.peringkat}.</span>{' '}
                  <Link
                    to={tautanProvinsi(p.kode, tahun)}
                    className="font-semibold underline decoration-garis underline-offset-2 hover:decoration-tinta"
                  >
                    {p.provinsi}
                  </Link>{' '}
                  <span className="text-tinta-redup">· skor {formatAngka(p.skor, 1)}/100</span>
                </p>
                {p.rekomendasi.length > 0 && (
                  <ul className="mt-1 max-w-[68ch] space-y-1">
                    {p.rekomendasi.map((r) => (
                      <li key={r.judul} className="text-base leading-relaxed text-tinta">
                        <span className="font-semibold">{r.judul}.</span> {r.dasar}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-12">
        <h2 className="subjudul text-tinta">Kaitan dengan tujuan pembangunan berkelanjutan</h2>
        <ul className="mt-2 max-w-[68ch] space-y-2 text-base leading-relaxed text-tinta">
          {SDG.filter((s) => ['4.1', '4.5', '10.1'].includes(s.id)).map((s) => (
            <li key={s.id}>
              <span className="font-semibold">{s.judul}:</span> {s.teks}
            </li>
          ))}
        </ul>
        <p className="teks-bantu mt-2">
          Pemetaan ini menunjukkan relevansi, bukan pengukuran resmi target SDG.
        </p>
      </section>

      <section className="mt-12 rounded-lg bg-putih p-5">
        <h2 className="subjudul text-tinta">Batas rekomendasi</h2>
        <p className="mt-2 max-w-[68ch] text-base leading-relaxed text-tinta">
          Lima langkah ini bukan resep tunggal. Urutan intervensi perlu disesuaikan dengan kondisi tiap
          daerah. Hubungan antara temuan dan solusi bersifat indikatif, bukan jaminan hasil. Dari studi
          pendukung, hanya sebagian yang menguji sebab-akibat, seperti uji acak dan ulasan sistematis; sisanya
          menunjukkan hubungan atau menggambarkan pengalaman.
        </p>
      </section>

      <Sumber
        tahun={tahun}
        satuan="persen"
        catatan="Rujukan setiap langkah dapat dibuka dari tombol Bukti."
      />

      <AksiData
        aksi={aksiStandar({
          temuan: JUDUL,
          judulBagikan: 'SETARA | Rekomendasi',
          csv: {
            nama: 'setara-rekomendasi.csv',
            baris: REKOMENDASI_UTAMA.map((r) => ({
              sasaran: r.sasaran,
              langkah: r.judul,
              intervensi: r.intervensi,
              temuan: temuan[r.id] || '',
            })),
            kolom: [
              { key: 'sasaran', label: 'Sasaran' },
              { key: 'langkah', label: 'Langkah' },
              { key: 'intervensi', label: 'Intervensi' },
              { key: 'temuan', label: 'Temuan' },
            ],
          },
          sitasi: { judul: 'Rekomendasi kesenjangan pendidikan', tahun: tahun || '' },
          bisaCetak: true,
        })}
      />

      <p className="mt-10 border-t border-garis pt-6">
        <Link
          to="/metode"
          className="tekan inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
        >
          Lihat metode dan keterbatasan
        </Link>
      </p>
    </main>
  )
}
