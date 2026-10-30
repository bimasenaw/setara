import { formatAngka, formatPersen, formatPoin, angkaBulat } from './format'
import { perbandingan, PAIRS } from './metrik'

export const KELOMPOK_AWAM = {
  Perdesaan: 'di desa',
  Perkotaan: 'di kota',
  'Kuintil 1': 'dari keluarga termiskin',
  'Kuintil 5': 'dari keluarga terkaya',
  'Laki-laki': 'laki-laki',
  Perempuan: 'perempuan',
}

export const DIMENSI_TEMUAN = ['wilayah', 'ekonomi', 'gender']

function fraseRasio(r) {
  if (r === null) return null
  if (r < 1.1) return 'hampir sama'
  const integer = Math.round(r)
  if (Math.abs(r - integer) < 0.12) {
    const kata = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam'][integer]
    return kata ? `${kata} kali lipat` : `${integer} kali lipat`
  }
  if (r < integer && integer - r < 0.3) {
    return `hampir ${integer} kali lipat`
  }
  return `sekitar ${r.toFixed(1).replace('.', ',')} kali`
}

export function tahunTerakhir(data) {
  if (!data.length) return null
  return data.reduce((m, d) => Math.max(m, d.tahun), -Infinity)
}

export function kalimatRingkasanUtama(data, jenjang = 'SMA', tahun = tahunTerakhir(data)) {
  const p = perbandingan(data, 'ekonomi', jenjang, tahun)
  if (p.tertinggal === null || p.pembanding === null) return null
  const a = formatPersen(p.tertinggal, 1)
  const r = fraseRasio(p.rasio)
  return `Di ${jenjang}, ${a} anak dari keluarga termiskin tidak sekolah, ${r} dibanding keluarga terkaya.`
}

export function kalimatDimensi(data, dimensi, jenjang, tahun) {
  const p = perbandingan(data, dimensi, jenjang, tahun)
  if (p.tertinggal === null || p.pembanding === null) return null
  const tertinggal = PAIRS[dimensi].tertinggal
  const pembanding = PAIRS[dimensi].pembanding
  const a = formatPersen(p.tertinggal, 1)
  const poin = formatPoin(p.selisih, 1)
  const t = KELOMPOK_AWAM[tertinggal]
  const b = KELOMPOK_AWAM[pembanding].replace(/^dari /, '').replace(/^di /, '')
  return `Di ${jenjang}, ${a} anak ${t} tidak sekolah, ${poin} lebih tinggi dibanding ${b}.`
}

export function temuanTigaDimensi(data, tahun, jenjang = null) {
  return DIMENSI_TEMUAN.map((dimensi) => {
    const kandidat = jenjang
      ? [jenjang]
      : ['SD', 'SMP', 'SMA']
    let terbaik = null
    for (const j of kandidat) {
      const p = perbandingan(data, dimensi, j, tahun)
      if (p.selisih === null) continue
      if (!terbaik || p.selisih > terbaik.selisih) {
        terbaik = { dimensi, jenjang: j, ...p }
      }
    }
    if (!terbaik) return null
    return {
      ...terbaik,
      kalimat: kalimatDimensi(data, dimensi, terbaik.jenjang, tahun),
    }
  }).filter(Boolean)
}

export function kalimatUmumKesenjangan(data, dimensi, tahun) {
  const hasil = ['SD', 'SMP', 'SMA']
    .map((jenjang) => ({ jenjang, ...perbandingan(data, dimensi, jenjang, tahun) }))
    .filter((item) => item.selisih !== null)
  if (!hasil.length) return null
  const terkecil = hasil.reduce((a, b) => (a.selisih < b.selisih ? a : b))
  const terbesar = hasil.reduce((a, b) => (a.selisih > b.selisih ? a : b))
  const nama = {
    wilayah: 'antarwilayah',
    ekonomi: 'ekonomi',
    gender: 'gender',
  }[dimensi] || dimensi
  return `Kesenjangan ${nama} muncul di semua jenjang, dengan selisih ${formatPoin(
    terkecil.selisih,
    1,
  )} sampai ${formatPoin(terbesar.selisih, 1)} pada ${tahun}.`
}

export function kalimatAwam(data, dimensi, kelompok, jenjang, tahun) {
  const n = cariUntukAwam(data, dimensi, kelompok, jenjang, tahun)
  if (n === null) return null
  const frase = KELOMPOK_AWAM[kelompok]
  const bulat = angkaBulat(n)
  return `Dari 100 anak usia ${jenjang} ${frase}, sekitar ${bulat} tidak sekolah.`
}

function cariUntukAwam(data, dimensi, kelompok, jenjang, tahun) {
  const row = data.find(
    (d) =>
      d.dimensi === dimensi &&
      d.kelompok === kelompok &&
      d.jenjang === jenjang &&
      d.tahun === tahun,
  )
  return row ? row.nilai : null
}

export function kalimatProvinsi(nama, nilai, nilaiNasional) {
  if (nilai === null || nilaiNasional === null) return null
  const selisih = nilai - nilaiNasional
  const s = formatAngka(Math.abs(selisih), 2)
  const arah = selisih >= 0 ? 'di atas' : 'di bawah'
  return `${nama} ${formatAngka(nilai, 2)}%, ${s} poin ${arah} rata-rata nasional (${formatAngka(nilaiNasional, 2)}%).`
}

export function kalimatApsProvinsi(nama, nilai, nilaiNasional, jenjang = 'SMA') {
  if (nilai === null || nilaiNasional === null) return null
  const selisih = nilai - nilaiNasional
  const arah = selisih >= 0 ? 'di atas' : 'di bawah'
  return `Partisipasi sekolah usia ${jenjang} di ${nama} ${formatAngka(nilai, 2)}%, ${formatPoin(
    Math.abs(selisih),
    2,
  )} ${arah} nasional (${formatAngka(nilaiNasional, 2)}%).`
}

export { fraseRasio }
