import { useSearchParams } from 'react-router-dom'
import { useData } from '../lib/data'
import { JENJANG, nasional, perbandingan } from '../lib/metrik'
import { kalimatRingkasanUtama, tahunTerakhir } from '../lib/temuan'
import SegmentedControl from '../components/SegmentedControl'
import TahunSelect from '../components/TahunSelect'
import Dumbbell from '../components/Dumbbell'
import { Muat, Gagal } from '../components/StatusBox'
import { formatAngka } from '../lib/format'

const PERBANDINGAN_NAMA = {
  wilayah: 'Kota vs desa',
  ekonomi: 'Kuintil 5 vs kuintil 1',
  gender: 'Perempuan vs laki-laki',
}

export default function Ringkasan() {
  const { status, tidakSekolah, error } = useData()
  const [params, setParams] = useSearchParams()

  const tahunTersedia = [...new Set(tidakSekolah.map((d) => d.tahun))].sort((a, b) => a - b)
  const tahunParam = Number(params.get('tahun'))
  const tahun = tahunTersedia.includes(tahunParam)
    ? tahunParam
    : tahunTersedia[tahunTersedia.length - 1]

  const jenjang = params.get('jenjang') || 'SMA'

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

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
        <Gagal message={error} onReload={() => window.location.reload()} />
      </main>
    )
  }

  const tahunHero = tahunTerakhir(tidakSekolah)
  const kalimatUtama = kalimatRingkasanUtama(tidakSekolah)

  const itemsKuintil = JENJANG.map((j) => {
    const p = perbandingan(tidakSekolah, 'ekonomi', j, tahunHero)
    return { label: j, pembanding: p.pembanding, tertinggal: p.tertinggal }
  })

  const nas = nasional(tidakSekolah, jenjang, tahun)

  const perbandinganRows = ['wilayah', 'ekonomi', 'gender'].map((d) => {
    const p = perbandingan(tidakSekolah, d, jenjang, tahun)
    return { dimensi: d, ...p }
  })

  const temuan = (() => {
    const a = nasional(tidakSekolah, 'SD', tahunHero)
    const b = nasional(tidakSekolah, 'SMP', tahunHero)
    const c = nasional(tidakSekolah, 'SMA', tahunHero)
    const wSD = perbandingan(tidakSekolah, 'wilayah', 'SD', tahunHero)
    const wSMA = perbandingan(tidakSekolah, 'wilayah', 'SMA', tahunHero)
    const eSMA = perbandingan(tidakSekolah, 'ekonomi', 'SMA', tahunHero)
    return [
      a !== null && b !== null && c !== null
        ? `Anak tidak sekolah naik tajam seiring jenjang: ${formatAngka(a, 1)}% (SD), ${formatAngka(b, 1)}% (SMP), ${formatAngka(c, 1)}% (SMA).`
        : null,
      wSD?.selisih !== null && wSMA?.selisih !== null
        ? `Kesenjangan desa-kota melebar di jenjang atas: dari ${formatAngka(wSD.selisih, 1)} poin di SD menjadi ${formatAngka(wSMA.selisih, 1)} poin di SMA.`
        : null,
      eSMA?.tertinggal !== null && eSMA?.pembanding !== null
        ? `Ekonomi paling menentukan: di SMA, ${formatAngka(eSMA.tertinggal, 1)}% anak kuintil termiskin tidak sekolah, melawan ${formatAngka(eSMA.pembanding, 1)}% kuintil terkaya.`
        : null,
    ].filter(Boolean)
  })()

  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <h1 className="font-serif text-[28px] font-semibold leading-tight text-tinta md:text-[40px]">
        SETARA
      </h1>
      <p className="mt-1 text-base text-tinta-redup">
        Melihat kesenjangan pendidikan lewat data BPS.
      </p>
      <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-tinta">
        SETARA — Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses — menunjukkan siapa yang
        paling tertinggal dalam pendidikan Indonesia: dari sudut wilayah, ekonomi, gender, dan
        peringkat partisipasi pendidikan usia dini per provinsi. Sumber: BPS (Susenas).
      </p>

      <section className="mt-10">
        <p className="max-w-[26ch] font-serif text-[28px] leading-snug text-tinta md:text-[40px]">
          {kalimatUtama || 'Kesenjangan pendidikan paling tajam terlihat di tingkat ekonomi.'}
        </p>
        <div className="mt-6 rounded-lg border border-garis bg-putih p-5">
          <h2 className="font-serif text-[20px] leading-snug text-tinta">
            Kesenjangan ekonomi antar jenjang
          </h2>
          <div className="mt-4">
            <Dumbbell
              items={itemsKuintil}
              pembandingNama="Kuintil 5"
              tertinggalNama="Kuintil 1"
            />
          </div>
          <p className="mt-3 text-sm text-tinta-redup">
            Kuintil 1 = 20% keluarga dengan pengeluaran terendah; kuintil 5 = 20% dengan pengeluaran
            tertinggi.
          </p>
          <p className="mt-2 text-xs text-tinta-redup">
            Satuan: persen. Sumber: BPS, Susenas {tahunHero}.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-tinta">Angka ringkasan</h2>
          <SegmentedControl
            options={JENJANG.map((j) => ({ value: j, label: j }))}
            value={jenjang}
            onChange={(v) => setParam('jenjang', v)}
            label="Jenjang"
          />
          <TahunSelect
            options={tahunTersedia}
            value={tahun}
            onChange={(v) => setParam('tahun', v)}
          />
        </div>

        <div className="mt-4 rounded-lg border border-garis bg-putih p-5">
          {nas !== null ? (
            <p className="text-tinta">
              <span className="font-serif text-[28px] font-semibold leading-none text-tinta">
                {formatAngka(nas, 1)}%
              </span>{' '}
              <span className="text-tinta-redup">
                anak {jenjang} tidak sekolah di Indonesia pada {tahun}.
              </span>
            </p>
          ) : (
            <p className="text-tinta-redup">Data nasional belum tersedia untuk pilihan ini.</p>
          )}

          <ul className="mt-4 space-y-2 border-t border-garis pt-4">
            {perbandinganRows.map((r) => (
              <li key={r.dimensi} className="text-sm text-tinta">
                <span className="font-semibold">{PERBANDINGAN_NAMA[r.dimensi]}:</span>{' '}
                {r.pembanding !== null && r.tertinggal !== null ? (
                  <>
                    {formatAngka(r.pembanding, 1)}% vs {formatAngka(r.tertinggal, 1)}% — selisih{' '}
                    <span className="font-semibold">+{formatAngka(r.selisih, 1)} poin</span>
                  </>
                ) : (
                  <span className="text-tinta-redup">data belum tersedia</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-tinta">Temuan utama</h2>
        <ol className="mt-3 space-y-2">
          {temuan.map((t, i) => (
            <li key={i} className="rounded-lg border border-garis bg-putih p-4 text-base leading-relaxed text-tinta">
              <span className="font-serif text-[20px] font-semibold">{i + 1}.</span> {t}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
