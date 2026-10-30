export default function HeroBanner({ judul, deskripsi, gambar, alt = '' }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-garis bg-tinta">
      <img
        src={gambar}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-tinta/75" aria-hidden="true" />
      <div className="relative flex min-h-[280px] flex-col justify-end p-5 md:min-h-[340px] md:p-8">
        <h1 className="max-w-[26ch] font-serif text-[1.75rem] font-semibold leading-snug text-putih md:text-[2.5rem]">
          {judul}
        </h1>
        {deskripsi && (
          <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-putih/90 md:text-base">
            {deskripsi}
          </p>
        )}
      </div>
    </section>
  )
}
