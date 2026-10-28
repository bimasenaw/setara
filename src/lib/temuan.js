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

export function kalimatRingkasanUtama(data) {
  const tahun = tahunTerakhir(data)
  const jenjang = 'SMA'
  const p = perbandingan(data, 'ekonomi', jenjang, tahun)
  if (p.tertinggal === null || p.pembanding === null) return null
  const a = formatPersen(p.tertinggal, 1)
  const r = fraseRasio(p.rasio)
  return `Di SMA, ${a} anak dari keluarga termiskin tidak sekolah, ${r} kuintil terkaya.`
}

export function kalimatDimensi(data, dimensi, jenjang, tahun) {
  const p = perbandingan(data, dimensi, jenjang, tahun)
  if (p.tertinggal === null || p.pembanding === null) return null
  const tertinggal = PAIRS[dimensi].tertinggal
  const pembanding = PAIRS[dimensi].pembanding
  const a = formatPersen(p.tertinggal, 1)
  const poin = formatPoin(p.selisih, 1)
  const t = KELOMPOK_AWAM[tertinggal]
  const b = KELOMPOK_AWAM[pembanding].replace(/^dari /, '')
  return `Di ${jenjang}, ${a} anak ${t} tidak sekolah, ${poin} lebih tinggi dari ${b}.`
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

export { fraseRasio }
