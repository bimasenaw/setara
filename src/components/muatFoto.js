import { preload } from 'react-dom'

// Ukuran tampil foto, sama dengan atribut `sizes` di HeroBanner dan KepalaHalaman.
export const UKURAN_HERO = '(min-width: 1080px) 1048px, 100vw'
export const UKURAN_KEPALA = '(min-width: 1080px) 420px, (min-width: 768px) 40vw, 100vw'

// Minta foto kepala halaman sejak render pertama, bersamaan dengan data JSON,
// bukan setelah data selesai dimuat. React menggabungkan panggilan yang sama.
export function muatAwalFoto(foto, ukuran = UKURAN_KEPALA) {
  if (!foto?.src) return
  preload(foto.src, {
    as: 'image',
    fetchPriority: 'high',
    ...(foto.srcSet ? { imageSrcSet: foto.srcSet, imageSizes: ukuran } : {}),
  })
}
