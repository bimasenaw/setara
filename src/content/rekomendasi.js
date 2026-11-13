// Lima rekomendasi SETARA, mengikuti Bab 2.5 dan Tabel 2 esai.
// Hanya teks naratif. Dilarang menulis angka di sini: kalimat temuan dihitung
// dari data di halaman Rekomendasi (Fase 3) memakai fungsi di src/lib.

export const REKOMENDASI_UTAMA = [
  {
    id: 'ekonomi',
    sasaran: 'Keluarga termiskin',
    judul: 'Perkuat bantuan tunai bersyarat di jenjang menengah',
    intervensi:
      'Perluas dan pertajam PKH serta beasiswa bagi rumah tangga termiskin, terutama saat anak memasuki SMP dan SMA, ketika biaya sekolah dan biaya kesempatan bekerja paling besar.',
    sumber: ['cahyadi2020', 'hudang2024', 'caniago2021'],
    data: { to: '/kesenjangan', tab: 'ekonomi', jenjang: 'SMA' },
  },
  {
    id: 'transisi',
    sasaran: 'Transisi antarjenjang',
    judul: 'Amankan perpindahan dari SD ke SMP dan dari SMP ke SMA',
    intervensi:
      'Gunakan BOS dan beasiswa untuk menahan anak tetap bersekolah pada titik transisi, karena lonjakan anak tidak sekolah terjadi saat anak berpindah jenjang.',
    sumber: ['petrosino2012', 'sugiharti2017', 'sulistyaningrum2016'],
    data: { to: '/kesenjangan', tab: 'wilayah', jenjang: 'Umum' },
  },
  {
    id: 'wilayah',
    sasaran: 'Anak di perdesaan',
    judul: 'Dekatkan sekolah menengah ke perdesaan',
    intervensi:
      'Perluas ketersediaan sekolah menengah di perdesaan agar jarak dan ongkos perjalanan tidak lagi menjadi penghalang untuk melanjutkan sekolah.',
    sumber: ['duflo2001', 'petrosino2012'],
    data: { to: '/kesenjangan', tab: 'wilayah', jenjang: 'SMA' },
  },
  {
    id: 'paud',
    sasaran: 'Daerah tertinggal',
    judul: 'Perluas PAUD di daerah dengan partisipasi terendah',
    intervensi:
      'Perluas layanan PAUD di daerah tertinggal dan gunakan pembelajaran jarak jauh untuk menjangkau wilayah terpencil, agar anak tidak memulai SD dengan bekal yang lebih sedikit.',
    sumber: ['brinkman2017', 'pratiwi2021'],
    data: { to: '/provinsi' },
  },
  {
    id: 'gender',
    sasaran: 'Kelompok gender yang tertinggal',
    judul: 'Beri dukungan tertarget berdasarkan data gender, bukan stereotip',
    intervensi:
      'Arahkan dukungan pada kelompok gender yang lebih banyak tidak sekolah di jenjang menengah, dan perhatikan bahwa pilihan jenis sekolah juga berbeda menurut gender.',
    sumber: ['himaz2021', 'asadullah2018'],
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
