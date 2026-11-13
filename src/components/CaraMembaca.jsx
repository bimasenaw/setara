// Satu penjelasan per halaman, diletakkan langsung di bawah grafik utama.
// Isi maksimal tiga kalimat: apa yang diukur, arti panjang/posisi, satu peringatan.
export default function CaraMembaca({ judul = 'Cara membaca grafik ini', children, className = '' }) {
  return (
    <details className={`group mt-4 border-t border-garis pt-1 ${className}`}>
      <summary className="tekan inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md text-sm font-semibold text-tinta [&::-webkit-details-marker]:hidden">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 transition-transform duration-150 ease-out group-open:rotate-90"
        >
          <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {judul}
      </summary>
      <div className="max-w-[68ch] space-y-2 pb-1 pl-6 text-sm leading-relaxed text-tinta-redup group-open:animate-[muncul_150ms_ease-out]">
        {children}
      </div>
    </details>
  )
}
