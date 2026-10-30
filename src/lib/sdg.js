export const SDG = [
  {
    id: '4.1',
    judul: 'SDG 4.1',
    teks: 'Memastikan semua anak menyelesaikan pendidikan dasar dan menengah yang berkualitas.',
    indikator: ['aps', 'tidak_sekolah'],
  },
  {
    id: '4.2',
    judul: 'SDG 4.2',
    teks: 'Memastikan semua anak memiliki akses ke pendidikan anak usia dini yang berkualitas.',
    indikator: ['apk_paud', 'provinsi'],
  },
  {
    id: '4.5',
    judul: 'SDG 4.5',
    teks: 'Menghapus kesenjangan gender dan disparitas antar kelompok sosial-ekonomi dalam pendidikan.',
    indikator: ['gender', 'ekonomi', 'wilayah'],
  },
  {
    id: '10.1',
    judul: 'SDG 10.1',
    teks: 'Meningkatkan pendapatan kelompok terbawah dan mengurangi ketimpangan.',
    indikator: ['kemiskinan', 'ikg'],
  },
]

export function sdgUntuk(indikator) {
  return SDG.filter((s) => s.indikator.includes(indikator))
}
