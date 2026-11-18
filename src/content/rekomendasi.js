// Lima rekomendasi SETARA, mengikuti Bab 2.5 dan Tabel 2 esai.
// Hanya teks naratif. Dilarang menulis angka di sini: kalimat temuan dihitung
// dari data di halaman Rekomendasi (Fase 3) memakai fungsi di src/lib.

export const REKOMENDASI_UTAMA = [
  {
    id: 'ekonomi',
    sasaran: 'Keluarga termiskin',
    judul: 'Perkuat bantuan tunai bersyarat di jenjang menengah',
    intervensi:
      'Perluas dan pertajam PKH serta beasiswa bagi rumah tangga termiskin saat anak masuk SMP dan SMA, ketika biaya sekolah dan biaya kesempatan bekerja paling besar.',
    sumber: ['cahyadi2020', 'hudang2024', 'caniago2021'],
    data: { to: '/kesenjangan', tab: 'ekonomi', jenjang: 'SMA' },
  },
  {
    id: 'transisi',
    sasaran: 'Transisi antarjenjang',
    judul: 'Amankan perpindahan dari SD ke SMP dan dari SMP ke SMA',
    intervensi:
      'Pakai BOS dan beasiswa untuk menahan anak tetap sekolah saat berpindah jenjang, titik ketika angka anak tidak sekolah melonjak.',
    sumber: ['petrosino2012', 'sugiharti2017', 'kartasasmita2021'],
    data: { to: '/kesenjangan', tab: 'wilayah', jenjang: 'Umum' },
  },
  {
    id: 'wilayah',
    sasaran: 'Anak di perdesaan',
    judul: 'Dekatkan sekolah menengah ke perdesaan, disertai bantuan biaya',
    intervensi:
      'Dekatkan sekolah menengah ke desa dan bantu biayanya. Jarak menurunkan partisipasi SMP di Indonesia, tetapi di 21 negara miskin pengaruh jarak saja kecil.',
    sumber: ['sirait2019', 'filmer2004', 'petrosino2012', 'sugiharti2017'],
    data: { to: '/kesenjangan', tab: 'wilayah', jenjang: 'SMA' },
  },
  {
    id: 'paud',
    sasaran: 'Daerah tertinggal',
    judul: 'Perluas PAUD di daerah dengan partisipasi terendah',
    intervensi:
      'Perluas PAUD di daerah tertinggal lewat kelompok bermain desa, agar anak miskin tidak masuk SD dengan bekal lebih sedikit. PAUD jarak jauh di Jayapura bisa jadi contoh rancangan.',
    sumber: ['jung2014', 'brinkman2017', 'pratiwi2021'],
    data: { to: '/provinsi' },
  },
  {
    id: 'gender',
    sasaran: 'Kelompok gender yang tertinggal',
    judul: 'Beri dukungan tertarget berdasarkan data gender, bukan stereotip',
    intervensi:
      'Arahkan dukungan ke kelompok gender yang lebih banyak tidak sekolah di daerahnya, karena arah kesenjangan berbeda antardaerah dan pilihan jenis sekolah berbeda menurut gender.',
    sumber: ['surbakti2020', 'himaz2021', 'asadullah2018'],
    data: { to: '/kesenjangan', tab: 'gender', jenjang: 'SMA' },
  },
]

export function tautanDataRekomendasi({ to, tab, jenjang }) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (jenjang) params.set('jenjang', jenjang)
  const q = params.toString()
  return q ? `${to}?${q}` : to
}
