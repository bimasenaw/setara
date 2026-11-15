// Analisis tambahan yang tidak perlu dibaca untuk memahami halaman: tertutup secara bawaan.
export default function AnalisisLanjutan({
  judul = 'Analisis lanjutan',
  keterangan,
  children,
  className = '',
}) {
  return (
    <details className={`group mt-12 border-t border-garis pt-2 ${className}`}>
      <summary className="tekan flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-base font-semibold text-tinta [&::-webkit-details-marker]:hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out group-open:rotate-90"
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {judul}
        {keterangan && <span className="teks-bantu ml-1 font-normal">{keterangan}</span>}
      </summary>
      <div className="pt-2 group-open:animate-[muncul_150ms_ease-out]">{children}</div>
    </details>
  )
}
