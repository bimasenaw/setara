import { UKURAN_KEPALA } from './muatFoto'

// Kepala halaman v2: judul berupa kalimat temuan, satu kalimat konteks, foto opsional.
// Foto tampil apa adanya (tanpa lapisan gelap) di samping teks, atau di bawahnya pada HP.
// `kredit` (opsional) tampil di bawah foto: wajib untuk foto berlisensi CC BY / CC BY-SA.
export default function KepalaHalaman({ judul, konteks, gambar, srcSet, alt = '', kredit, children }) {
  const adaGambar = Boolean(gambar)
  const foto = (
    <img
      src={gambar}
      srcSet={srcSet}
      sizes={srcSet ? UKURAN_KEPALA : undefined}
      alt={alt}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className="aspect-video max-h-[11.25rem] w-full rounded-lg bg-garis object-cover md:aspect-[4/3] md:max-h-none"
    />
  )
  return (
    <header className={adaGambar ? 'grid gap-5 md:grid-cols-12 md:items-end md:gap-8' : ''}>
      <div className={adaGambar ? 'md:col-span-7' : ''}>
        <h1 className="judul-temuan max-w-[30ch] text-tinta">{judul}</h1>
        {konteks && <p className="mt-3 max-w-[64ch] text-base leading-relaxed text-tinta-redup">{konteks}</p>}
        {children}
      </div>
      {adaGambar &&
        (kredit ? (
          <figure className="md:col-span-5">
            {foto}
            <figcaption className="mt-1.5 text-xs leading-snug text-tinta-redup">{kredit}</figcaption>
          </figure>
        ) : (
          <div className="md:col-span-5">{foto}</div>
        ))}
    </header>
  )
}
