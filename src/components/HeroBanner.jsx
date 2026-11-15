// Hero berfoto. Lapisan gelap hanya ada di belakang teks dan mengikuti tingginya: pekat di area teks,
// lalu memudar dalam 4–5rem di atasnya. Bagian foto di atas teks tetap terang.
// Kontras teks putih dijaga minimal 4,5:1 di titik terterang (PRD v2, bagian 16.1).
export default function HeroBanner({ judul, deskripsi, gambar, alt = '', ramping = false }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-garis bg-tinta">
      <img
        src={gambar}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className={`relative flex flex-col justify-end p-5 md:p-8 ${
          ramping ? 'min-h-[220px] md:min-h-[300px]' : 'min-h-[280px] md:min-h-[340px]'
        }`}>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-x-5 -bottom-5 -top-16 bg-[linear-gradient(to_top,rgb(24_33_44/0.9),rgb(24_33_44/0.84)_calc(100%-4rem),rgb(24_33_44/0))] md:-inset-x-8 md:-bottom-8 md:-top-20 md:bg-[linear-gradient(to_top,rgb(24_33_44/0.9),rgb(24_33_44/0.84)_calc(100%-5rem),rgb(24_33_44/0))]"
          />
          <h1 className="relative max-w-[26ch] font-serif text-[1.75rem] font-semibold leading-snug text-putih md:text-[2.5rem]">
            {judul}
          </h1>
          {deskripsi && (
            <p className="relative mt-2 max-w-[64ch] text-sm leading-relaxed text-putih md:text-base">
              {deskripsi}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
