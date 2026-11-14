// Alur cerita SETARA: satu halaman, satu pertanyaan.
// Teks statis tanpa angka; angka selalu dihitung dari data di halaman masing-masing.

export const ALUR = [
  {
    langkah: 1,
    id: 'ringkasan',
    to: '/',
    pendek: 'Siapa tertinggal',
    halaman: 'Ringkasan',
    isi: 'Kelompok anak yang paling banyak tidak sekolah.',
    pertanyaan: 'Siapa yang paling tertinggal?',
    ajakan: 'Lihat kelompok yang paling tertinggal dari tiga sudut: wilayah, ekonomi, dan gender.',
  },
  {
    langkah: 2,
    id: 'kesenjangan',
    to: '/kesenjangan',
    pendek: 'Seberapa jauh',
    halaman: 'Kesenjangan',
    isi: 'Jarak desa dan kota, termiskin dan terkaya, laki-laki dan perempuan.',
    pertanyaan: 'Seberapa jauh jaraknya?',
    ajakan:
      'Lihat selisih desa dan kota, keluarga termiskin dan terkaya, serta laki-laki dan perempuan di setiap jenjang.',
  },
  {
    langkah: 3,
    id: 'provinsi',
    to: '/provinsi',
    pendek: 'Di mana dulu',
    halaman: 'Provinsi',
    isi: 'Provinsi yang perlu didahulukan menurut indeks prioritas.',
    pertanyaan: 'Di mana harus mulai lebih dahulu?',
    ajakan: 'Lihat indeks prioritas yang menggabungkan enam indikator untuk setiap provinsi.',
  },
  {
    langkah: 4,
    id: 'rekomendasi',
    to: '/rekomendasi',
    pendek: 'Apa tindakannya',
    halaman: 'Rekomendasi',
    isi: 'Lima langkah kebijakan berbasis studi.',
    pertanyaan: 'Apa yang harus dilakukan?',
    ajakan: 'Lihat lima rekomendasi berbasis studi dan provinsi yang perlu didahulukan.',
  },
]

export function langkahAlur(id) {
  return ALUR.find((a) => a.id === id) || null
}

// Langkah aktif dibaca dari URL, sehingga selalu sama dengan menu navbar yang dibuka.
// Metode adalah halaman rujukan, bukan bagian cerita: tidak punya langkah.
export function alurDariPath(pathname = '/') {
  const akar = pathname.split('/').filter(Boolean)[0] || ''
  if (akar === 'metode') return null
  return langkahAlur(akar) || ALUR[0]
}

// Filter yang ikut terbawa saat berpindah langkah. Setiap halaman memvalidasi ulang nilainya.
const FILTER_DIBAWA = ['tahun', 'jenjang']

export function tautanAlur(to, search = '') {
  const asal = new URLSearchParams(search)
  const params = new URLSearchParams()
  for (const key of FILTER_DIBAWA) {
    const v = asal.get(key)
    if (v) params.set(key, v)
  }
  const q = params.toString()
  return q ? `${to}?${q}` : to
}
