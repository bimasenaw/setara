import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, PAIRS, perbandingan } from '../lib/metrik'
import { kalimatDimensi, kalimatAwam, kalimatUmumKesenjangan } from '../lib/temuan'
import { DIMS, validDim, validJenjang, validTahun, tulisParam, labelKelompok } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { fotoJenjang } from '../lib/foto'
import { sdgUntuk } from '../lib/sdg'
import { buatSitasi, copyText, downloadCsv, shareTeks } from '../lib/ekspor'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import { SOLUSI_MATRIX, JENJANG_KATEGORI, refs } from '../lib/solusi'
import TabBar from '../components/TabBar'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import Dumbbell from '../components/Dumbbell'
import TrenMultiGaris from '../components/TrenMultiGaris'
import KonteksNasional from '../components/KonteksNasional'
import Accordion from '../components/Accordion'
import HeroBanner from '../components/HeroBanner'
import { Muat, Gagal, BelumTersedia } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

const WARNA_JENJANG = {
  SD: '#C2372D',
  SMP: '#6F8CAB',
  SMA: '#5A6676',
}

function Sumber({ tahun }) {
  return (
    <p className="mt-2 text-xs text-tinta-redup">
      Satuan: persen. Sumber: BPS, Susenas {tahun}.
    </p>
  )
}

export default function Kesenjangan() {
  const { status, tidakSekolah, indikator, error, reload } = useData()
  const [params, setParams] = useSearchParams()
  const [salinan, setSalinan] = useState('')

  const dim = validDim(params.get('tab'))
  const kategori = validJenjang(params.get('jenjang'), JENJANG_KATEGORI, 'Umum')
  const jenjang = kategori === 'Umum' ? null : kategori
  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(
    params.get('tahun'),
    tahunTersedia,
    tahunTersedia[tahunTersedia.length - 1],
  )

  useDocumentMeta({
    judul: `Kesenjangan ${DIMS.find((d) => d.value === dim)?.label || ''} | SETARA`,
    deskripsi:
      'Kesenjangan pendidikan Indonesia menurut wilayah, ekonomi, dan gender. Data BPS Susenas, dengan tabel, tren, dan solusi berbasis studi.',
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

  const pair = PAIRS[dim]
  const dimLabel = DIMS.find((d) => d.value === dim)?.label

  const perJenjang = JENJANG.map((j) => ({
    jenjang: j,
    ...perbandingan(tidakSekolah, dim, j, tahun),
  }))
  const validPerJenjang = perJenjang.filter((p) => p.selisih !== null)
  const terbesar = validPerJenjang.reduce(
    (m, p) => (p.selisih > (m ? m.selisih : -1) ? p : m),
    null,
  )
  const terkecil = validPerJenjang.reduce(
    (m, p) => (p.selisih < (m ? m.selisih : Infinity) ? p : m),
    null,
  )

  const pairLabel = {
    pembanding: labelKelompok(pair.pembanding),
    tertinggal: labelKelompok(pair.tertinggal),
  }

  const judulUtama =
    kategori === 'Umum'
      ? kalimatUmumKesenjangan(tidakSekolah, dim, tahun)
      : jenjang
        ? kalimatDimensi(tidakSekolah, dim, jenjang, tahun)
        : null
  const catatanAwam =
    kategori === 'Umum' || !jenjang
      ? null
      : kalimatAwam(tidakSekolah, dim, pair.tertinggal, jenjang, tahun)

  const items = perJenjang.map((p) => ({
    label: p.jenjang,
    pembanding: p.pembanding,
    tertinggal: p.tertinggal,
  }))

  const trendUmum = tahunTersedia
    .map((t) => {
      const row = { tahun: t }
      for (const j of JENJANG) {
        row[j] = perbandingan(tidakSekolah, dim, j, t).selisih
      }
      return row
    })
    .filter((d) => JENJANG.some((j) => d[j] !== null))

  const trendSpesifik = jenjang
    ? tahunTersedia
        .map((t) => {
          const p = perbandingan(tidakSekolah, dim, jenjang, t)
          return { tahun: t, pembanding: p.pembanding, tertinggal: p.tertinggal }
        })
        .filter((d) => d.pembanding !== null || d.tertinggal !== null)
    : []

  const trendData = jenjang ? trendSpesifik : trendUmum
  const trendTitle = jenjang
    ? `Tren ${pairLabel.pembanding} dan ${pairLabel.tertinggal} · ${kategori}`
    : 'Tren selisih antarkelompok per jenjang'
  const trendLines = jenjang
    ? [
        { key: 'pembanding', label: pairLabel.pembanding, color: '#6F8CAB' },
        { key: 'tertinggal', label: pairLabel.tertinggal, color: '#C2372D' },
      ]
    : JENJANG.map((j) => ({ key: j, label: j, color: WARNA_JENJANG[j] }))

  const trendInsight = (() => {
    if (jenjang) {
      if (trendSpesifik.length < 2) return null
      const a = trendSpesifik[0]
      const b = trendSpesifik[trendSpesifik.length - 1]
      const gapA = a.pembanding !== null && a.tertinggal !== null ? a.tertinggal - a.pembanding : null
      const gapB = b.pembanding !== null && b.tertinggal !== null ? b.tertinggal - b.pembanding : null
      if (gapA === null || gapB === null) return null
      const arah = gapB > gapA ? 'melebar' : gapB < gapA ? 'menyempit' : 'stabil'
      return `Selisih antara ${pairLabel.tertinggal} dan ${pairLabel.pembanding} di jenjang ${jenjang} ${arah}: ${formatPoin(
        Math.abs(gapA),
        1,
      )} (${a.tahun}) menjadi ${formatPoin(Math.abs(gapB), 1)} (${b.tahun}).`
    }

    if (trendUmum.length < 2) return null
    const akhir = trendUmum[trendUmum.length - 1]
    const nilaiAkhir = JENJANG.map((j) => akhir[j]).filter((n) => typeof n === 'number')
    if (nilaiAkhir.length < 2) return null
    const terkecil = Math.min(...nilaiAkhir)
    const terbesar = Math.max(...nilaiAkhir)
    return `Pada ${akhir.tahun}, selisih antarkelompok berkisar ${formatPoin(
      terkecil,
      1,
    )} sampai ${formatPoin(terbesar, 1)}. Pilih SD, SMP, atau SMA untuk melihat arah perubahan tiap jenjang.`
  })()

  const dampak =
    kategori === 'Umum'
      ? null
      : dim === 'ekonomi'
        ? dampakEkonomi(tidakSekolah, indikator, jenjang, tahun)
        : dim === 'gender'
          ? dampakGender(tidakSekolah, indikator, jenjang, tahun)
          : null

  const solusiList = SOLUSI_MATRIX[dim]?.[kategori] || []
  const sdg = sdgUntuk(dim)
  const foto = fotoJenjang(kategori)

  const salin = async () => {
    const teks = `${judulUtama || `Kesenjangan ${dimLabel}`} Sumber: BPS, Susenas ${tahun}.`
    const ok = await copyText(teks)
    setSalinan(ok ? 'Temuan disalin.' : 'Gagal menyalin; blok teks dan salin manual.')
  }

  const bagikan = async () => {
    const ok = await shareTeks({
      title: 'SETARA | Kesenjangan pendidikan',
      text: judulUtama || `Kesenjangan ${dimLabel}`,
      url: window.location.href,
    })
    if (!ok) setSalinan('Share tidak tersedia; tautan disalin.')
  }

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <HeroBanner
        judul={judulUtama || `Kesenjangan ${dimLabel}`}
        deskripsi={
          kategori === 'Umum'
            ? 'Halaman ini menunjukkan siapa yang tertinggal di semua jenjang, seberapa besar selisihnya, dan apa yang bisa dilakukan.'
            : `Halaman ini menunjukkan kesenjangan pada jenjang ${kategori}, seberapa besar selisihnya, dan apa yang bisa dilakukan.`
        }
        gambar={foto.src}
        alt={foto.alt}
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <TabBar
          options={DIMS}
          value={dim}
          onChange={(v) => tulisParam(params, setParams, 'tab', v)}
          label="Dimensi kesenjangan"
        />
        <TahunSelect
          options={tahunTersedia}
          value={tahun}
          onChange={(v) => tulisParam(params, setParams, 'tahun', v)}
        />
        <SegmentedControl
          options={JENJANG_KATEGORI.map((j) => ({ value: j, label: j }))}
          value={kategori}
          onChange={(v) => tulisParam(params, setParams, 'jenjang', v)}
          label="Kategori jenjang"
        />
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
          onClick={() =>
            downloadCsv(
              `setara-${dim}-${kategori}-${tahun}.csv`,
              perJenjang.map((r) => ({
                jenjang: r.jenjang,
                pembanding: r.pembanding,
                tertinggal: r.tertinggal,
                selisih: r.selisih,
                rasio: r.rasio,
              })),
              [
                { key: 'jenjang', label: 'Jenjang' },
                { key: 'pembanding', label: pairLabel.pembanding },
                { key: 'tertinggal', label: pairLabel.tertinggal },
                { key: 'selisih', label: 'Selisih (poin)' },
                { key: 'rasio', label: 'Rasio' },
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
            copyText(
              buatSitasi({
                judul: judulUtama || `Kesenjangan ${dimLabel}`,
                tahun,
              }),
            ).then((ok) => setSalinan(ok ? 'Sitasi disalin.' : 'Gagal menyalin sitasi.'))
          }
          className="min-h-11 rounded-lg border border-garis bg-putih px-3 text-tinta hover:bg-kertas"
        >
          Salin sitasi
        </button>
        <Link
          to="/metode"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-garis bg-putih px-3 text-center text-tinta hover:bg-kertas"
        >
          Metode
        </Link>
      </div>
      {salinan && <p className="mt-2 text-sm text-tinta-redup">{salinan}</p>}

      <Accordion judul="Apa makna kategori Umum, SD, SMP, dan SMA?">
        <p>
          Kategori Umum menunjukkan pola keseluruhan, bukan hanya satu jenjang. Jika memilih SD, SMP,
          atau SMA, grafik dan solusi akan fokus pada jenjang tersebut.
        </p>
        <p>
          Perbedaan ini penting karena kesenjangan bisa sudah muncul sejak SD atau baru melebar di
          jenjang yang lebih tinggi. Pilih kategori untuk melihat di mana masalahnya paling kuat.
        </p>
      </Accordion>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="font-serif text-[1.25rem] leading-snug text-tinta">
          {judulUtama || 'Angka anak tidak sekolah per jenjang'}
        </h2>
        {items.some((it) => it.pembanding !== null || it.tertinggal !== null) ? (
          <>
            <div className="mt-4">
              <Dumbbell
                items={items}
                pembandingNama={pairLabel.pembanding}
                tertinggalNama={pairLabel.tertinggal}
                ringkasan={judulUtama || undefined}
              />
            </div>
            {catatanAwam && <p className="mt-3 text-sm text-tinta-redup">{catatanAwam}</p>}
          </>
        ) : (
          <div className="mt-4">
            <BelumTersedia alasan={`tidak ada data untuk tahun ${tahun}`} />
          </div>
        )}
        <Sumber tahun={tahun} />
        <Accordion judul="Apa makna grafik ini?">
          {terbesar && terkecil && (
            <p>
              Pada {tahun}, selisih terkecil ada di {terkecil.jenjang} sebesar{' '}
              {formatPoin(terkecil.selisih, 1)}. Selisih terbesar ada di {terbesar.jenjang} sebesar{' '}
              {formatPoin(terbesar.selisih, 1)}. Artinya, ketidaksetaraan paling lebar terjadi di
              jenjang {terbesar.jenjang}.
            </p>
          )}
          <p>
            Garis yang lebih panjang menunjukkan jarak yang lebih jauh antara {pairLabel.tertinggal}{' '}
            dan {pairLabel.pembanding}. Semakin panjang, semakin besar peluang anak dari kelompok
            tertinggal untuk tidak sekolah.
          </p>
          <p>
            Kategori Umum menunjukkan pola semua jenjang. Pilih SD, SMP, atau SMA untuk melihat
            jenjang yang disorot di tabel.
          </p>
        </Accordion>
      </section>

      {dampak && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">
            Skala dampak · {jenjang} {tahun}
          </h2>
          <p className="mt-1 text-sm font-semibold text-tinta">
            Sekitar {formatJumlahOrang(dampak.estimasi)} anak usia {jenjang} berpotensi kembali
            bersekolah jika kelompok tertinggal setara kelompok pembanding.
          </p>
          <Accordion judul="Apa makna angka ini?">
            <p>
              Angka ini menunjukkan skala anak yang mungkin terkena dampak jika kesenjangan ditutup.
              Artinya, masalahnya bukan hanya persentase kecil, tetapi menyangkut banyak anak.
            </p>
            <p>{dampak.metode}</p>
            <p>Asumsi: {dampak.asumsi}</p>
            <p>
              Angka ini adalah perkiraan, bukan hasil sensus. Gunakan sebagai gambaran skala, bukan
              angka resmi.
            </p>
          </Accordion>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-tinta">{trendTitle} (2019–2023)</h2>
          <span className="text-sm text-tinta-redup">Kategori mengikuti filter di atas.</span>
        </div>
        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {trendData.length > 0 ? (
            <>
              {trendInsight && <p className="text-sm text-tinta">{trendInsight}</p>}
              <div className="mt-3">
                <TrenMultiGaris
                  data={trendData}
                  lines={trendLines}
                  satuan={jenjang ? 'persen' : 'poin persentase'}
                  ringkasan={trendInsight || undefined}
                  namaFile={`setara-tren-${dim}-${kategori}.csv`}
                />
              </div>
            </>
          ) : (
            <BelumTersedia alasan="tidak ada data tren" />
          )}
          <Sumber tahun="2019–2023" />
          <Accordion judul="Apa makna tren ini?">
            {kategori === 'Umum' ? (
              <>
                <p>
                  Garis merah adalah SD, garis biru adalah SMP, dan garis abu-abu adalah SMA. Garis
                  yang naik berarti kesenjangan makin lebar, sedangkan garis yang turun berarti
                  kesenjangan menyempit.
                </p>
                <p>
                  Artinya, keberhasilan menurunkan angka rata-rata belum tentu berarti kesenjangan
                  ikut mengecil. Perhatikan arah setiap garis, bukan hanya posisinya.
                </p>
              </>
            ) : (
              <>
                <p>
                  Garis biru menunjukkan {pairLabel.pembanding}. Garis merah menunjukkan{' '}
                  {pairLabel.tertinggal}. Jika garis merah bergerak menjauh, kelompok tertinggal makin
                  tertinggal.
                </p>
                <p>
                  Sebaliknya, jika kedua garis mendekat, kesenjangan menyempit. Angka pada tabel di
                  bawah grafik menunjukkan nilai aslinya.
                </p>
              </>
            )}
          </Accordion>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
        <h2 className="text-base font-semibold text-tinta">Metrik kesenjangan per jenjang</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-tinta-redup">
                <th className="py-2 pr-4 font-medium">Jenjang</th>
                <th className="py-2 pr-4 font-medium">{pairLabel.pembanding}</th>
                <th className="py-2 pr-4 font-medium">{pairLabel.tertinggal}</th>
                <th className="py-2 pr-4 font-medium">Selisih (poin)</th>
                <th className="py-2 font-medium">Rasio</th>
              </tr>
            </thead>
            <tbody>
              {perJenjang.map((r) => (
                <tr
                  key={r.jenjang}
                  className={`border-b border-garis last:border-0 ${
                    r.jenjang === jenjang ? 'bg-kertas' : ''
                  }`}
                >
                  <td className="py-2 pr-4 font-semibold text-tinta">{r.jenjang}</td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.pembanding !== null ? formatAngka(r.pembanding, 2) : '-'}
                  </td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.tertinggal !== null ? formatAngka(r.tertinggal, 2) : '-'}
                  </td>
                  <td className="py-2 pr-4 text-tinta">
                    {r.selisih !== null ? `+${formatAngka(r.selisih, 2)}` : '-'}
                  </td>
                  <td className="py-2 text-tinta">
                    {r.rasio !== null ? `${formatAngka(r.rasio, 1)}×` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-tinta-redup">
          {kategori === 'Umum'
            ? 'Kategori Umum menampilkan semua jenjang.'
            : `Baris disorot: ${kategori}.`}{' '}
          Satuan nilai: persen. Sumber: BPS, Susenas {tahun}.
        </p>
        <Accordion judul="Apa makna selisih dan rasio?">
          <p>
            Selisih menunjukkan jarak absolut antara dua kelompok. Rasio menunjukkan berapa kali
            lipat satu kelompok dibanding kelompok lain. Keduanya menjawab pertanyaan berbeda.
          </p>
          <p>
            Contoh: selisih 15 poin berarti jaraknya 15 poin. Rasio 2 berarti kelompok tertinggal dua
            kali lipat kelompok pembanding.
          </p>
          <p>
            Selisih besar dengan rasio kecil menunjukkan masalah yang sudah menyebar. Selisih kecil
            dengan rasio besar menunjukkan masalah yang sangat terpusat pada kelompok tertentu.
          </p>
        </Accordion>
      </section>

      <KonteksNasional rows={indikator} dimensi={dim} />

      {sdg.length > 0 && (
        <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
          <h2 className="text-base font-semibold text-tinta">Kaitan tujuan pembangunan berkelanjutan</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-tinta">
            {sdg.map((s) => (
              <li key={s.id}>
                <span className="font-semibold">{s.judul}:</span> {s.teks}
              </li>
            ))}
          </ul>
          <Accordion judul="Apa makna temuan ini bagi SDGs?">
            <p>
              Temuan ini menunjukkan bahwa tujuan pendidikan yang merata belum tercapai untuk semua
              kelompok. Kesenjangan yang lebar berarti masih ada kelompok yang tertinggal dalam akses
              pendidikan.
            </p>
            <p>
              Pemetaan ini menunjukkan relevansi temuan, bukan klaim bahwa aplikasi mengukur target
              SDG secara resmi.
            </p>
          </Accordion>
        </section>
      )}

      <section className="mt-8">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-base font-semibold text-tinta">Solusi berbasis studi</h2>
          <span className="text-sm text-tinta-redup">
            Kategori {kategori} mengikuti filter di atas.
          </span>
        </div>
        {solusiList.length > 0 ? (
          <ol className="mt-3 space-y-2">
            {solusiList.map((s, i) => (
              <li key={i} className="rounded-lg border border-garis bg-putih p-4">
                <p className="text-sm font-semibold leading-relaxed text-tinta">
                  <span className="font-serif text-[1.25rem] font-semibold">{i + 1}.</span> {s.temuan}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-tinta">
                  <span className="font-semibold">Solusi:</span> {s.solusi}
                </p>
                <div className="mt-1.5 text-xs leading-relaxed text-tinta-redup">
                  <span className="font-semibold">Sumber:</span>
                  <ul className="mt-0.5 space-y-0.5">
                    {refs(s.sumber).map((r) => (
                      <li key={r.id}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-garis underline-offset-2 hover:text-tinta"
                        >
                          {r.referensi}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-tinta-redup">Belum ada solusi untuk kombinasi ini.</p>
        )}
        <Accordion judul="Apa makna solusi ini?">
          <p>
            Solusi ini menunjukkan langkah yang paling relevan untuk kelompok yang tertinggal pada
            data di atas. Fokusnya adalah memperkecil jarak, bukan hanya menaikkan rata-rata.
          </p>
          <p>
            Solusi diambil dari studi dan artikel yang sumbernya bisa dibuka pada tiap poin. Hubungan
            antara temuan dan solusi bersifat indikatif, bukan jaminan hasil.
          </p>
        </Accordion>
      </section>
    </main>
  )
}
