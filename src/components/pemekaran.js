// Pemekaran Papua 2022: BPS baru memisahkan data provinsi baru mulai 2024.
// - Provinsi baru (Papua Barat Daya, Papua Selatan, Papua Tengah, Papua Pegunungan): datanya baru ada
//   sejak 2024, jadi "perubahan" untuk provinsi ini hanya mencakup beberapa tahun terakhir.
// - Provinsi induk (Papua Barat, Papua): angka sebelum 2024 masih mencakup wilayah provinsi baru,
//   jadi perubahan dari tahun sebelum 2024 tidak sebanding (wilayahnya berubah, bukan hanya angkanya).
// Hanya menambah keterangan; tidak mengubah angka atau kategori apa pun.

export const PROVINSI_BARU = new Set(['9200', '9500', '9600', '9700'])
export const PROVINSI_INDUK = new Set(['9100', '9400'])
export const TAHUN_DATA_PISAH = 2024

export function jenisPemekaran(kode, tahunAwal) {
  if (PROVINSI_BARU.has(kode)) return 'baru'
  if (PROVINSI_INDUK.has(kode) && tahunAwal < TAHUN_DATA_PISAH) return 'induk'
  return null
}

export function catatanPemekaran(nama, kode, tahunAwal, tahunAkhir) {
  const jenis = jenisPemekaran(kode, tahunAwal)
  if (jenis === 'baru') {
    const lama = tahunAkhir - tahunAwal
    return `${nama} adalah provinsi hasil pemekaran 2022. Datanya baru tersedia sejak ${tahunAwal}, jadi perubahan ini hanya mencakup ${lama} tahun.`
  }
  if (jenis === 'induk') {
    return `Angka ${nama} sebelum ${TAHUN_DATA_PISAH} masih mencakup wilayah provinsi hasil pemekaran 2022, jadi perubahan sejak ${tahunAwal} tidak sebanding.`
  }
  return null
}

export const CATATAN_PEMEKARAN_UMUM =
  'Pemekaran Papua 2022: data Papua Barat Daya, Papua Selatan, Papua Tengah, dan Papua Pegunungan baru tersedia sejak 2024, jadi perubahannya hanya satu tahun. Angka Papua dan Papua Barat sebelum 2024 masih mencakup wilayah provinsi baru itu, jadi perubahannya tidak sebanding.'

// Tahun awal yang paling sering dipakai (bukan sekadar baris pertama).
export function tahunAwalUmum(data) {
  const hitung = new Map()
  for (const d of data) hitung.set(d.tahunAwal, (hitung.get(d.tahunAwal) || 0) + 1)
  let terbanyak = null
  for (const [tahun, n] of hitung) if (terbanyak === null || n > hitung.get(terbanyak)) terbanyak = tahun
  return terbanyak
}
