export default function Footer() {
  return (
    <footer className="mt-12 border-t border-garis bg-putih">
      <div className="mx-auto w-full max-w-[1080px] px-4 py-8">
        <h2 className="text-base font-semibold text-tinta">Catatan keterbatasan</h2>
        <ul className="mt-2 max-w-[68ch] space-y-1 text-sm leading-relaxed text-tinta-redup">
          <li>Data terbaru yang tersedia di API BPS adalah tahun 2023.</li>
          <li>
            Angka partisipasi pendidikan usia dini mengukur hal yang berbeda dari angka anak tidak
            sekolah, sehingga keduanya tidak disajikan dalam satu grafik.
          </li>
          <li>
            Data berasal dari survei sampel (Susenas); selisih kecil antar provinsi perlu
            ditafsirkan dengan hati-hati.
          </li>
          <li>Korelasi bukan sebab-akibat; aplikasi ini tidak mengklaim hubungan sebab-akibat.</li>
        </ul>
        <p className="mt-4 text-sm text-tinta-redup">
          Sumber: BPS (Susenas). Satuan diasumsikan persen — verifikasi dengan tabel resmi BPS
          sebelum dikutip.
        </p>
      </div>
    </footer>
  )
}
