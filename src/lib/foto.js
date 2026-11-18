// Foto hero per jenjang, dari Wikimedia Commons (CC BY-SA). Setiap foto tersedia dalam lebar 640, 800,
// 1200, dan 1600 px; browser memilih yang sesuai layar. Kredit fotografer dan lisensi wajib ditampilkan.
const LEBAR = [640, 800, 1200, 1600]

function buat(nama, data) {
  const jalur = (w) => `/images/jenjang/${nama}-${w}.jpg`
  return {
    src: jalur(800),
    srcSet: LEBAR.map((w) => `${jalur(w)} ${w}w`).join(', '),
    ...data,
  }
}

const FOTO_JENJANG = {
  SD: buat('sd', {
    alt: 'Murid SD di Siberut Selatan, Kepulauan Mentawai, pulang sekolah melewati jembatan bambu',
    artis: 'Mentawairereiket',
    lisensi: 'CC BY-SA 4.0',
    lisensiUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sumber:
      'https://commons.wikimedia.org/wiki/File:Siswa_SDN_Dusun_Kulukubuk_Desa_Madobag_Kecamatan_Siberut_Selatan_Kabupaten_Kepulauan_Mentawai_baru_saja_pulang_sekolah_berjalan_dengan_melewati_jembatan_bambu.jpg',
  }),
  SMP: buat('smp', {
    alt: 'Murid SMP Negeri Satu Atap Oebelo, Timor Tengah Selatan, berkegiatan di halaman sekolah',
    artis: 'Dianadola',
    lisensi: 'CC BY-SA 4.0',
    lisensiUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Kegiatan_P5_oleh_Siswa_SMP_Negeri_Satu_Atap_Oebelo.jpg',
  }),
  SMA: buat('sma', {
    alt: 'Murid SMA Negeri 1 Ceper bermusyawarah di halaman sekolah sebelum bermain sepak bola',
    artis: 'Dani Safa Adi Nugraha',
    lisensi: 'CC BY-SA 3.0',
    lisensiUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    sumber:
      'https://commons.wikimedia.org/wiki/File:Para_siswa_kelas_XIB_sedang_mengadakan_musyawarah_untuk_pembagian_tim_sebelum_permainan_Sepak_Bola_di_SMA_Negeri_1_Ceper_18_November_2026.jpg',
  }),
  Umum: buat('umum', {
    alt: 'Upacara bendera di halaman sekolah, dilihat dari atas',
    artis: 'Arifinulburhan',
    lisensi: 'CC BY-SA 4.0',
    lisensiUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    sumber: 'https://commons.wikimedia.org/wiki/File:Upacara_bendera_di_sekolah.jpg',
  }),
}

export function fotoJenjang(jenjang) {
  return FOTO_JENJANG[jenjang] || FOTO_JENJANG.Umum
}

export const SEMUA_FOTO_JENJANG = FOTO_JENJANG
