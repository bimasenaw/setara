// Kredit foto berlisensi CC BY / CC BY-SA: judul foto, fotografer, lisensi, sumber, dan keterangan perubahan.
const TAUTAN = 'underline decoration-garis underline-offset-2 hover:text-tinta'

export default function KreditFoto({ foto }) {
  if (!foto?.artis) return null
  return (
    <>
      Foto: {foto.alt}.{' '}
      <a href={foto.sumber} target="_blank" rel="noreferrer" className={TAUTAN}>
        {foto.artis}
      </a>
      ,{' '}
      <a href={foto.lisensiUrl} target="_blank" rel="noreferrer" className={TAUTAN}>
        {foto.lisensi}
      </a>
      , via Wikimedia Commons. Diperkecil.
    </>
  )
}
