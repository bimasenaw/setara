// Baris satuan dan sumber yang sama untuk semua grafik.
export default function Sumber({
  tahun,
  satuan = 'persen',
  selisih = false,
  sumber = 'BPS, Susenas',
  catatan,
  className = '',
}) {
  const bagian = []
  if (satuan) bagian.push(`Satuan: ${satuan}.`)
  if (selisih) bagian.push('Selisih dalam poin persentase.')
  if (catatan) bagian.push(catatan)
  bagian.push(`Sumber: ${sumber}${tahun ? ` ${tahun}` : ''}.`)
  return <p className={`teks-bantu mt-3 ${className}`}>{bagian.join(' ')}</p>
}
