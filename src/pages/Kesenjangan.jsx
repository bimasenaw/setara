import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, PAIRS, perbandingan } from '../lib/metrik'
import { kalimatDimensi, kalimatAwam, kalimatUmumKesenjangan } from '../lib/temuan'
import { DIMS, validDim, validJenjang, validTahun, tulisParam, labelKelompok } from '../lib/params'
import { dampakEkonomi, dampakGender } from '../lib/dampak'
import { fotoJenjang } from '../lib/foto'
import { formatAngka, formatJumlahOrang, formatPoin } from '../lib/format'
import { SOLUSI_MATRIX, JENJANG_KATEGORI } from '../lib/solusi'
import { DaftarRujukan } from '../components/TombolRujukan'
import TabBar from '../components/TabBar'
import TahunSelect from '../components/TahunSelect'
import SegmentedControl from '../components/SegmentedControl'
import Dumbbell from '../components/Dumbbell'
import TrenMultiGaris from '../components/TrenMultiGaris'
import KonteksNasional from '../components/KonteksNasional'
import KepalaHalaman from '../components/KepalaHalaman'
import CaraMembaca from '../components/CaraMembaca'
import AksiData from '../components/AksiData'
import { aksiStandar } from '../components/aksiStandar'
import Sumber from '../components/Sumber'
import LangkahBerikutnya from '../components/LangkahBerikutnya'
import AnalisisLanjutan from '../components/AnalisisLanjutan'
import { Muat, Gagal, BelumTersedia } from '../components/StatusBox'
import useDocumentMeta from '../lib/useDocumentMeta'

// Jenjang berurutan: satu warna biru dari terang ke gelap, ditambah pola garis sebagai penanda kedua.
// Merah tidak dipakai di sini karena merah berarti kelompok tertinggal. Lolos validator palet (ΔE ≥ 15, kontras ≥ 3:1).
const WARNA_JENJANG = {
  SD: '#5C8DC9',
  SMP: '#2E5F9E',
  SMA: '#18324F',
}
const POLA_JENJANG = { SD: '6 4', SMP: '2 3', SMA: undefined }

export default function Kesenjangan() {
  const { status, tidakSekolah, indikator, error, reload } = useData()
  const [params, setParams] = useSearchParams()

  const dim = validDim(params.get('tab'))
  const kategori = validJenjang(params.get('jenjang'), JENJANG_KATEGORI, 'Umum')
  const jenjang = kategori === 'Umum' ? null : kategori
  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahun = validTahun(params.get('tahun'), tahunTersedia, tahunTersedia[tahunTersedia.length - 1])

  useDocumentMeta({
    judul: `Kesenjangan ${DIMS.find((d) => d.value === dim)?.label || ''} | SETARA`,
    deskripsi:
      'Kesenjangan pendidikan Indonesia menurut wilayah, ekonomi, dan gender. Data BPS Susenas, dengan tabel, tren, dan solusi berbasis studi.',
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

  const pair = PAIRS[dim]
  const dimLabel = DIMS.find((d) => d.value === dim)?.label

  const perJenjang = JENJANG.map((j) => ({
    jenjang: j,
    ...perbandingan(tidakSekolah, dim, j, tahun),
  }))
  const validPerJenjang = perJenjang.filter((p) => p.selisih !== null)
  const terbesar = validPerJenjang.reduce((m, p) => (p.selisih > (m ? m.selisih : -1) ? p : m), null)

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
    kategori === 'Umum' || !jenjang ? null : kalimatAwam(tidakSekolah, dim, pair.tertinggal, jenjang, tahun)

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
    : JENJANG.map((j) => ({ key: j, label: j, color: WARNA_JENJANG[j], pola: POLA_JENJANG[j] }))

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

  const solusiList = (SOLUSI_MATRIX[dim]?.[kategori] || []).slice(0, 2)
  const foto = fotoJenjang(kategori)

  // Rasio terbesar bisa ada di jenjang yang berbeda dari selisih terbesar: itu inti perbedaan keduanya.
  const rasioMaks = perJenjang
    .filter((p) => p.rasio !== null)
    .reduce((m, p) => (p.rasio > (m ? m.rasio : -1) ? p : m), null)

  const konteks =
    kategori === 'Umum'
      ? 'Siapa yang tertinggal di semua jenjang, seberapa besar selisihnya, dan apa yang bisa dilakukan.'
      : `Kesenjangan pada jenjang ${kategori}: seberapa besar selisihnya dan apa yang bisa dilakukan.`

  return (
    <main id="konten" className="mx-auto w-full max-w-[1080px] px-4 pb-8 pt-6 md:pt-8">
      <KepalaHalaman
        judul={judulUtama || `Kesenjangan ${dimLabel}`}
        konteks={konteks}
        gambar={foto.src}
        alt={foto.alt}
      />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
      <p className="teks-bantu mt-2">
        {kategori === 'Umum'
          ? 'Umum menampilkan semua jenjang. Pilih SD, SMP, atau SMA untuk memusatkan grafik dan solusi pada satu jenjang.'
          : `Grafik dan solusi dipusatkan pada jenjang ${kategori}.`}
      </p>

      <section className="mt-6 rounded-lg border border-garis bg-putih p-5">
        <h2 className="subjudul text-tinta">
          {pairLabel.tertinggal} dan {pairLabel.pembanding.toLowerCase()} per jenjang · {tahun}
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
            {catatanAwam && <p className="teks-bantu mt-3">{catatanAwam}</p>}
          </>
        ) : (
          <div className="mt-4">
            <BelumTersedia alasan={`tidak ada data untuk tahun ${tahun}`} />
          </div>
        )}
        <Sumber tahun={tahun} selisih />
        <CaraMembaca>
          <p>
            Setiap baris membandingkan {pairLabel.tertinggal} dengan {pairLabel.pembanding} pada satu jenjang:
            persen anak yang tidak sekolah.
          </p>
          <p>
            {terbesar && rasioMaks
              ? `Garis yang lebih panjang berarti jarak yang lebih jauh; pada ${tahun} jarak terbesar ada di ${terbesar.jenjang} (${formatPoin(terbesar.selisih, 1)}). Rasio menunjukkan berapa kali lipat: ${
                  rasioMaks.jenjang === terbesar.jenjang
                    ? `${rasioMaks.jenjang} juga paling timpang menurut rasio, ${formatAngka(rasioMaks.rasio, 1)}×.`
                    : `selisih di ${rasioMaks.jenjang} lebih kecil tetapi rasionya terbesar, ${formatAngka(rasioMaks.rasio, 1)}×, sehingga kelompok tertinggal berlipat-lipat lebih banyak.`
                }`
              : 'Garis yang lebih panjang berarti jarak yang lebih jauh.'}
          </p>
          <p>Angka berasal dari survei sampel dan menunjukkan perbedaan, bukan sebab-akibat.</p>
        </CaraMembaca>
      </section>

      {dampak && (
        <section className="mt-10">
          <h2 className="subjudul text-tinta">
            Skala dampak · {jenjang} {tahun}
          </h2>
          <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-tinta">
            Sekitar {formatJumlahOrang(dampak.estimasi)} usia {jenjang} berpotensi kembali bersekolah jika
            kelompok tertinggal setara kelompok pembanding.
          </p>
          <p className="teks-bantu mt-1 max-w-[68ch]">
            Perkiraan, bukan sensus. {dampak.metode} Asumsi: {dampak.asumsi}
          </p>
        </section>
      )}

      <section className="mt-12 border-t border-garis pt-6">
        <h2 className="subjudul text-tinta">{trendInsight || `${trendTitle} (2019–2023)`}</h2>
        {trendInsight && (
          <p className="teks-bantu mt-1">{trendTitle} (2019–2023). Kategori mengikuti filter di atas.</p>
        )}
        <div className="mt-4">
          {trendData.length > 0 ? (
            <TrenMultiGaris
              data={trendData}
              lines={trendLines}
              satuan={jenjang ? 'persen' : 'poin persentase'}
              ringkasan={trendInsight || undefined}
              namaFile={`setara-tren-${dim}-${kategori}.csv`}
            />
          ) : (
            <BelumTersedia alasan="tidak ada data tren" />
          )}
        </div>
        <Sumber tahun="2019–2023" satuan={jenjang ? 'persen' : 'poin persentase'} />
      </section>

      <section className="mt-12 rounded-lg border border-garis bg-putih p-5">
        <h2 className="subjudul text-tinta">Metrik kesenjangan per jenjang</h2>
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
                  className={`border-b border-garis last:border-0 ${r.jenjang === jenjang ? 'bg-kertas' : ''}`}
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
        <Sumber
          tahun={tahun}
          catatan={kategori === 'Umum' ? 'Umum menampilkan semua jenjang.' : `Baris disorot: ${kategori}.`}
        />
      </section>

      <AnalisisLanjutan keterangan="Konteks nasional">
        <KonteksNasional rows={indikator} dimensi={dim} />
      </AnalisisLanjutan>

      <section className="mt-12 border-t border-garis pt-6">
        <h2 className="subjudul text-tinta">Apa yang bisa dilakukan</h2>
        <p className="teks-bantu mt-1">Solusi berbasis studi untuk kategori {kategori}.</p>
        {solusiList.length > 0 ? (
          <ol className="mt-2">
            {solusiList.map((s, i) => (
              <li key={i} className="border-b border-garis py-4 last:border-0">
                <p className="text-base font-semibold leading-relaxed text-tinta">
                  <span className="font-serif text-[1.25rem]">{i + 1}.</span> {s.temuan}
                </p>
                <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-tinta">{s.solusi}</p>
                <DaftarRujukan
                  sumber={s.sumber}
                  tempat={`kesenjangan.${dim}.${kategori}.${i + 1}`}
                  label="Bukti:"
                  className="mt-2"
                />
              </li>
            ))}
          </ol>
        ) : (
          <p className="teks-bantu mt-3">Belum ada solusi untuk kombinasi ini.</p>
        )}
        <Link
          to={`/rekomendasi#${dim}`}
          className="tekan mt-2 inline-flex min-h-11 items-center text-base text-tinta underline decoration-garis underline-offset-4 hover:decoration-tinta"
        >
          Lihat semua rekomendasi
        </Link>
      </section>

      <AksiData
        aksi={aksiStandar({
          temuan: judulUtama || `Kesenjangan ${dimLabel}`,
          judulBagikan: 'SETARA | Kesenjangan pendidikan',
          csv: {
            nama: `setara-${dim}-${kategori}-${tahun}.csv`,
            baris: perJenjang.map((r) => ({
              jenjang: r.jenjang,
              pembanding: r.pembanding,
              tertinggal: r.tertinggal,
              selisih: r.selisih,
              rasio: r.rasio,
            })),
            kolom: [
              { key: 'jenjang', label: 'Jenjang' },
              { key: 'pembanding', label: pairLabel.pembanding },
              { key: 'tertinggal', label: pairLabel.tertinggal },
              { key: 'selisih', label: 'Selisih (poin)' },
              { key: 'rasio', label: 'Rasio' },
            ],
          },
          sitasi: { judul: judulUtama || `Kesenjangan ${dimLabel}`, tahun },
          bisaCetak: true,
        })}
      />

      <LangkahBerikutnya ke="provinsi" />
    </main>
  )
}
