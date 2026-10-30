import { formatAngka, formatPoin } from '../lib/format'
import { tahunTerbaru } from '../lib/indikator'
import Accordion from './Accordion'

const MAP = {
  wilayah: {
    label: 'Wilayah',
    sma: 'apk_sma_wilayah',
    paud: 'apk_paud_wilayah',
    urutan: ['perkotaan', 'perdesaan', 'perkotaanperdesaan'],
  },
  ekonomi: {
    label: 'Ekonomi',
    sma: 'apk_sma_ekonomi',
    paud: 'apk_paud_ekonomi',
    urutan: ['kuintil1', 'kuintil2', 'kuintil3', 'kuintil4', 'kuintil5'],
  },
  gender: {
    label: 'Gender',
    sma: 'apk_sma_gender',
    paud: 'apk_paud_gender',
    urutan: ['lakilaki', 'perempuan', 'lakilakiperempuan'],
  },
}

function normalisasi(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function urutKelompok(urutan) {
  return (a, b) => {
    const ia = urutan.indexOf(normalisasi(a.kelompok))
    const ib = urutan.indexOf(normalisasi(b.kelompok))
    if (ia === -1 && ib === -1) return String(a.kelompok).localeCompare(String(b.kelompok))
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  }
}

export default function KonteksNasional({ rows, dimensi }) {
  const conf = MAP[dimensi]
  if (!conf) return null

  const blok = [
    {
      id: conf.sma,
      judul: 'Partisipasi SMA (APK)',
      catatan: 'APK bukan angka anak tidak sekolah.',
    },
    {
      id: conf.paud,
      judul: 'Partisipasi PAUD 3–6 tahun (APK)',
      catatan: 'Angka partisipasi kasar, bukan angka tidak sekolah.',
    },
  ]

  return (
    <section className="mt-8 rounded-lg border border-garis bg-putih p-5">
      <h2 className="text-base font-semibold text-tinta">Konteks nasional · {conf.label}</h2>
      <div className="mt-4 space-y-4">
        {blok.map((b) => {
          const tahun = tahunTerbaru(rows, { indikator: b.id })
          if (!tahun) return null
          const map = new Map()
          for (const r of rows) {
            if (r.indikator !== b.id || r.tahun !== tahun || r.wilayah !== 'nasional') continue
            const key = normalisasi(r.kelompok)
            if (!map.has(key)) map.set(key, { kelompok: r.kelompok, nilai: r.nilai })
          }
          const nilai = [...map.values()].sort(urutKelompok(conf.urutan))
          if (!nilai.length) return null
          const pertama = nilai[0]
          const terakhir = dimensi === 'ekonomi' ? nilai[nilai.length - 1] : nilai[1] || nilai[0]
          return (
            <div key={b.id} className="border-b border-garis pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-tinta">
                {b.judul} ({tahun})
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-tinta-redup">
                {nilai.map((d) => (
                  <span key={d.kelompok}>
                    {d.kelompok}:{' '}
                    <span className="font-medium text-tinta">{formatAngka(d.nilai, 2)}%</span>
                  </span>
                ))}
              </div>
              {nilai.length > 1 && (
                <p className="mt-1 text-xs text-tinta-redup">
                  Selisih {pertama.kelompok}–{terakhir.kelompok}:{' '}
                  {formatPoin(Math.abs(terakhir.nilai - pertama.nilai), 2)}. {b.catatan}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <Accordion judul="Apa arti angka partisipasi ini?">
        <p>
          APK adalah angka partisipasi kasar. Angka ini membandingkan jumlah anak yang mengikuti
          pendidikan dengan jumlah anak usia sekolah.
        </p>
        <p>
          APK bisa di atas 100% jika ada anak di luar usia resmi yang ikut sekolah. Karena itu, APK
          tidak sama dengan angka anak tidak sekolah dan tidak dicampur dalam grafik utama.
        </p>
        <p>
          Gunakan bagian ini sebagai konteks tambahan, bukan sebagai pengganti angka anak tidak
          sekolah.
        </p>
      </Accordion>
    </section>
  )
}
