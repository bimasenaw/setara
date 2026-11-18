// Uji kepekaan indeks prioritas: hitung ulang tanpa satu indikator, untuk setiap indikator.
// Skor persentil setiap indikator tidak bergantung pada indikator lain, jadi hitung ulang cukup
// merata-rata skor yang tersisa dari hitungPrioritas().daftar[i].komponen. Tidak ada rumus baru.

const rata = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length

export function ujiKepekaan(daftar, komponen, jumlahTeratas = 5) {
  const asli = daftar.slice(0, jumlahTeratas)
  const hasil = komponen.map((k) => {
    const ulang = daftar
      .map((p) => {
        const sisa = komponen
          .filter((x) => x.id !== k.id)
          .map((x) => p.komponen[x.id]?.skor)
          .filter((v) => v !== null && v !== undefined)
        return { kode: p.kode, provinsi: p.provinsi, skor: sisa.length ? rata(sisa) : null }
      })
      .filter((p) => p.skor !== null)
      .sort((a, b) => b.skor - a.skor)
    return { tanpa: k, teratas: ulang.slice(0, jumlahTeratas) }
  })
  // Berapa peringkat teratas yang sama persis (provinsi dan urutannya) di semua percobaan.
  let stabil = 0
  for (let i = 0; i < asli.length; i += 1) {
    if (hasil.every((h) => h.teratas[i]?.kode === asli[i].kode)) stabil = i + 1
    else break
  }
  return { asli, hasil, stabil }
}

const ANGKA = ['', 'Peringkat pertama', 'Dua teratas', 'Tiga teratas', 'Empat teratas', 'Lima teratas']

export function kalimatKepekaan(stabil, jumlahIndikator) {
  if (stabil < 1) return null
  return `${ANGKA[stabil] || `${stabil} teratas`} tetap sama walau salah satu dari ${jumlahIndikator} indikator dihapus.`
}
