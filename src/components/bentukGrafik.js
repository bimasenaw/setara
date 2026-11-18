// Dua cara melihat perbandingan dua kelompok; tanpa parameter, tampilan bawaan tetap dumbbell.
export const BENTUK_GRAFIK = [
  { value: 'titik', label: 'Titik dan garis' },
  { value: 'batang', label: 'Batang' },
]

export const bentukDariParam = (params) => (params.get('grafik') === 'batang' ? 'batang' : 'titik')

// Nilai yang ditulis ke ?grafik=: bawaan dihapus dari alamat supaya tautan tetap bersih.
export const nilaiParamBentuk = (v) => (v === 'batang' ? v : null)
