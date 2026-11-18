import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { validTahun, tulisParam, tautanProvinsi } from '../lib/params'
import { dampakTerbaru } from '../lib/dampak'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import { hitungPrioritas, matriksPrioritas } from '../lib/prioritas'
import { provinsiPalingBerubah } from '../lib/tren'
import { tahunTerbaru, urutkanProvinsi } from '../lib/indikator'
import TahunSelect from '../components/TahunSelect'
import DotPlotProvinsi from '../components/DotPlotProvinsi'
import PriorityMatrix from '../components/PriorityMatrix'
import BandingProvinsi from '../components/BandingProvinsi'
import GrafikPrioritas from '../components/GrafikPrioritas'
import KepalaHalaman from '../components/KepalaHalaman'
import KreditFoto from '../components/KreditFoto'
import { muatAwalFoto } from '../components/muatFoto'
import { fotoProvinsi } from '../content/fotoProvinsi'
import CaraMembaca from '../components/CaraMembaca'
import AksiData from '../components/AksiData'
import { aksiStandar } from '../components/aksiStandar'
import Sumber from '../components/Sumber'
import LangkahBerikutnya from '../components/LangkahBerikutnya'
import AnalisisLanjutan from '../components/AnalisisLanjutan'
import { Muat, Gagal } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

// Kepala halaman: Lembah Baliem, Papua Pegunungan (dari set foto provinsi, berlisensi bebas).
const fotoKepala = fotoProvinsi('9700')

function selisihNasional(nilai, nasional) {
  if (nilai === null || nasional === null) return null
  return nilai - nasional
}

function daftarNama(nama) {
  if (nama.length <= 1) return nama[0] || ''
  if (nama.length === 2) return `${nama[0]} dan ${nama[1]}`
  return `${nama.slice(0, -1).join(', ')}, dan ${nama[nama.length - 1]}`
}

export default function Provinsi() {
  const { status, provinsi, indikator, error, reload } = useData()
  muatAwalFoto(fotoKepala)
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState({ key: 'nilai', dir: 'asc' })
  const [cari, setCari] = useState('')
  // Kepala halaman tampil lebih dulu; sisa halaman (sekitar 1.100 elemen) digambar sebagai render latar
  // yang dicicil React, sehingga browser tidak terkunci satu tugas panjang saat data datang.
  const tampilSemua = useDeferredValue(status === 'ready', false)

  const tahunTersedia = [...new Set(provinsi.provinsi.map((p) => p.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(params.get('tahun'), tahunTersedia, tahunTersedia[tahunTersedia.length - 1])

  useDocumentMeta({
    judul: 'Provinsi dan prioritas | SETARA',
    deskripsi:
      'Indeks prioritas provinsi, peringkat partisipasi pendidikan usia dini, dan profil tiap provinsi dari data BPS.',
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

  const prioritas = useMemo(() => hitungPrioritas(indikator), [indikator])
  const tahunPaud = useMemo(() => tahunTerbaru(indikator, { indikator: 'apk_paud' }), [indikator])
  const apkPaud = useMemo(
    () => (tahunPaud ? urutkanProvinsi(indikator, 'apk_paud', tahunPaud, { kelompok: 'Total' }) : []),
    [indikator, tahunPaud],
  )
  const terendahPaud = apkPaud.slice(0, 5)
  const dampak = terendahPaud[0] ? dampakTerbaru(indikator, terendahPaud[0].kode) : null

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

  const teratas = prioritas.daftar.slice(0, 3)
  const judul = teratas.length
    ? `${daftarNama(teratas.map((p) => p.provinsi))} paling perlu diprioritaskan.`
    : 'Provinsi mana yang perlu didahulukan.'

  const headerSort = (key) => {
    if (sort.key === key) setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' })
    else setSort({ key, dir: 'asc' })
  }
  const panah = (key) => (sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '')

  const labelKomponen = prioritas.komponen.map((k) => k.label.toLowerCase())

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <KepalaHalaman
        judul={judul}
        konteks="Indeks menggabungkan enam indikator: partisipasi SMA, PAUD, lama sekolah, kemiskinan, IPM, dan ketimpangan gender."
        gambar={fotoKepala.src}
        srcSet={fotoKepala.srcSet}
        alt={fotoKepala.alt}
        kredit={<KreditFoto foto={fotoKepala} />}
      />

      <p className="mt-6 max-w-[68ch] rounded-lg bg-putih p-4 text-base leading-relaxed text-tinta">
        <span className="font-semibold">Ukurannya berganti.</span> Halaman sebelumnya memakai angka anak tidak
        sekolah. Halaman ini memakai indikator provinsi terbaru dari BPS (2023–2025), karena angka anak tidak
        sekolah tidak tersedia per provinsi.
      </p>

      {tampilSemua ? (
        <>
          <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
            <h2 className="subjudul text-tinta">Indeks prioritas SETARA</h2>
            <p className="teks-bantu mt-1">
              Skor 0–100. Makin tinggi, makin perlu didahulukan. Pilih provinsi untuk melihat profilnya.
            </p>
            <div className="mt-4">
              <GrafikPrioritas daftar={prioritas.daftar} tahun={tahun} komponen={prioritas.komponen} />
            </div>
            <Sumber
              tahun="2023–2025"
              satuan="skor 0–100"
              catatan="Indeks ini bukan penilaian resmi."
              sumber="BPS (Susenas dan indikator provinsi)"
            />
            <CaraMembaca>
              <p>Skor menggabungkan {daftarNama(labelKomponen)}; setiap indikator diberi bobot sama.</p>
              <p>
                {prioritas.daftar[0]
                  ? `Skor tertinggi dimiliki ${prioritas.daftar[0].provinsi} (${formatAngka(prioritas.daftar[0].skor, 1)}/100), yang berarti kombinasi kebutuhannya paling besar. Lima teratas berwarna merah.`
                  : 'Makin tinggi skor, makin perlu didahulukan.'}
              </p>
              <p>Skor adalah alat bantu menentukan prioritas, bukan vonis terhadap kinerja provinsi.</p>
            </CaraMembaca>
          </section>

          <MatriksPrioritas indikator={indikator} />

          <section className="mt-12 border-t border-garis pt-6">
            <h2 className="subjudul text-tinta">Peringkat per indikator · PAUD</h2>
            <p className="teks-bantu mt-1">
              Partisipasi pendidikan usia dini per provinsi. Tahun hanya berlaku untuk indikator ini.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TahunSelect
                options={tahunTersedia}
                value={tahun}
                onChange={(v) => tulisParam(params, setParams, 'tahun', v)}
              />
              <button
                type="button"
                onClick={() => setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' })}
                className="tekan min-h-11 rounded-lg border border-garis bg-putih px-4 text-base text-tinta hover:bg-kertas"
              >
                Urut {sort.dir === 'asc' ? 'naik' : 'turun'}
              </button>
              <label className="flex w-full flex-wrap items-center gap-2 text-sm text-tinta sm:w-auto">
                <span className="text-tinta-redup">Cari provinsi</span>
                <input
                  type="search"
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  placeholder="mis. Papua"
                  className="min-h-11 min-w-0 flex-1 rounded-lg border border-garis bg-putih px-3 text-base text-tinta focus:outline-none focus:ring-2 focus:ring-biru sm:flex-none"
                />
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
              <DotPlotProvinsi provinsi={baris} nilaiNasional={nasional} />
              <p className="teks-bantu mt-3">
                Garis putus-putus adalah rata-rata nasional, dan lima provinsi terendah berwarna merah. Sumbu
                mulai dari 50%. Empat provinsi baru Papua belum memiliki data indikator ini.
              </p>
              <Sumber tahun={tahun} />
            </div>

            {terendahPaud.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold text-tinta">
                  Lima provinsi dengan APK PAUD 3–6 tahun terendah ({tahunPaud})
                </h3>
                <p className="teks-bantu mt-1">
                  APK mengukur partisipasi kasar, bukan angka anak tidak sekolah.
                </p>
                <ol className="mt-2">
                  {terendahPaud.map((p, i) => (
                    <li
                      key={p.kode}
                      className="flex items-baseline justify-between gap-4 border-b border-garis py-2 last:border-0"
                    >
                      <span className="text-base text-tinta">
                        <span className="font-semibold">{i + 1}.</span>{' '}
                        <Link
                          to={tautanProvinsi(p.kode, tahunPaud)}
                          className="underline decoration-garis underline-offset-2 hover:decoration-tinta"
                        >
                          {p.provinsi}
                        </Link>
                      </span>
                      <span className="font-semibold tabular-nums text-tinta">
                        {formatAngka(p.nilai, 2)}%
                      </span>
                    </li>
                  ))}
                </ol>
                {dampak && (
                  <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-tinta">
                    Jika provinsi terendah menyamai APK PAUD nasional, sekitar{' '}
                    <span className="font-semibold">{formatJumlahOrang(dampak.estimasi)}</span> usia 3–6 tahun
                    berpotensi mendapat layanan PAUD tambahan.{' '}
                    <span className="teks-bantu">
                      Perkiraan, bukan sensus. {dampak.metode} Asumsi: {dampak.asumsi}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 rounded-lg border border-garis bg-putih p-5">
              <h3 className="text-base font-semibold text-tinta">Selisih dari nilai nasional</h3>
              <div
                className="mt-3 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
                tabIndex={0}
                role="region"
                aria-label="Tabel selisih dari nasional"
              >
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
                            className="underline decoration-garis underline-offset-2 hover:decoration-tinta"
                          >
                            Lihat
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="teks-bantu mt-2">
                Selisih negatif berarti provinsi tertinggal dari nasional. Selisih kecil pada survei sampel
                perlu dibaca dengan hati-hati.
              </p>
            </div>
          </section>

          <AnalisisLanjutan keterangan="Banding dua provinsi dan provinsi paling berubah">
            <BandingProvinsi
              rows={indikator}
              provinsiList={prioritas.daftar.map((p) => ({ kode: p.kode, provinsi: p.provinsi }))}
              defaultA={prioritas.daftar[0]?.kode}
              defaultB={prioritas.daftar[prioritas.daftar.length - 1]?.kode}
            />

            <PalingBerubah indikator={indikator} />
          </AnalisisLanjutan>

          <AksiData
            aksi={aksiStandar({
              temuan: judul,
              judulBagikan: 'SETARA | Prioritas provinsi',
              csv: {
                nama: `setara-provinsi-${tahun}.csv`,
                baris: semuaBaris.map((p) => ({ provinsi: p.provinsi, nilai: p.nilai, selisih: p.selisih })),
                kolom: [
                  { key: 'provinsi', label: 'Provinsi' },
                  { key: 'nilai', label: 'Nilai (%)' },
                  { key: 'selisih', label: 'Selisih dari nasional (poin)' },
                ],
              },
              sitasi: { judul, tahun },
              bisaCetak: true,
            })}
          />

          <LangkahBerikutnya ke="rekomendasi" />
        </>
      ) : (
        <div aria-hidden="true" className="min-h-dvh" />
      )}
    </main>
  )
}

// Perhitungan berat dipanggil di dalam bagiannya sendiri, bukan di atas halaman: React bisa menjeda
// di antara bagian saat render latar, sehingga tidak ada satu tugas panjang. Angkanya tidak berubah.
function MatriksPrioritas({ indikator }) {
  const matriks = useMemo(() => matriksPrioritas(indikator), [indikator])
  return <PriorityMatrix data={matriks.data} tahun={2025} />
}

function PalingBerubah({ indikator }) {
  const berubah = useMemo(() => provinsiPalingBerubah(indikator, 'aps', { jenjang: 'SMA' }), [indikator])
  if (!berubah.membaik.length) return null
  return (
    <section className="mt-8">
      <h2 className="subjudul text-tinta">Provinsi paling berubah · partisipasi SMA</h2>
      <p className="teks-bantu mt-1">
        Perubahan poin dari tahun awal yang tersedia sampai tahun terakhir. Bukan proyeksi, dan hanya
        menunjukkan arah.
      </p>
      <div className="mt-3 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-tinta">Paling membaik</h3>
          <ul className="mt-1 space-y-1 text-base text-tinta">
            {berubah.membaik.map((p) => (
              <li key={p.kode}>
                {p.provinsi}: {formatPoin(p.delta, 2)} ({p.awal.tahun}–{p.akhir.tahun})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-tinta">Paling melemah</h3>
          <ul className="mt-1 space-y-1 text-base text-tinta">
            {berubah.memburuk.map((p) => (
              <li key={p.kode}>
                {p.provinsi}: {formatPoin(p.delta, 2)} ({p.awal.tahun}–{p.akhir.tahun})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
