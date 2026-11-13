// Kepala halaman v2: judul berupa kalimat temuan, satu kalimat konteks, foto opsional.
// Foto tampil apa adanya (tanpa lapisan gelap) di samping teks, atau di bawahnya pada HP.
export default function KepalaHalaman({ judul, konteks, gambar, alt = '', children }) {
  const adaGambar = Boolean(gambar)
  return (
    <header className={adaGambar ? 'grid gap-5 md:grid-cols-12 md:items-end md:gap-8' : ''}>
      <div className={adaGambar ? 'md:col-span-7' : ''}>
        <h1 className="judul-temuan max-w-[30ch] text-tinta">{judul}</h1>
        {konteks && (
          <p className="mt-3 max-w-[64ch] text-base leading-relaxed text-tinta-redup">{konteks}</p>
        )}
        {children}
      </div>
      {adaGambar && (
        <img
          src={gambar}
          alt={alt}
          loading="eager"
          className="aspect-video max-h-[11.25rem] w-full rounded-lg object-cover md:col-span-5 md:aspect-[4/3] md:max-h-none"
        />
      )}
    </header>
  )
}
