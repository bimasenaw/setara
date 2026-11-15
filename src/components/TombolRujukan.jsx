import { useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { kutipanUntuk } from '../content/kutipan'
import { refById } from '../lib/solusi'
import PanelBukti from './PanelBukti'

// Satu rujukan di bawah solusi. Diklik → panel bukti berisi kutipan asli jurnalnya.
// `tempat` menentukan kutipan mana yang ditampilkan bila satu jurnal mendukung beberapa solusi.
export default function TombolRujukan({ refId, tempat = '' }) {
  const rujukan = refById(refId)
  const bukti = kutipanUntuk(refId, tempat)
  const [buka, setBuka] = useState(false)
  const [pernahBuka, setPernahBuka] = useState(false)
  const tombolRef = useRef(null)
  const idPanel = useId()

  if (!rujukan) return null
  const sitasi = rujukan.sitasi.replace(/^\(|\)$/g, '')

  // Tanpa kutipan: tetap tautan biasa ke halaman penerbit.
  if (!bukti?.kutipan) {
    return (
      <a
        href={rujukan.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center underline decoration-garis underline-offset-2 hover:text-tinta md:min-h-0"
      >
        {sitasi}
      </a>
    )
  }

  return (
    <>
      <button
        ref={tombolRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={buka}
        aria-controls={buka ? idPanel : undefined}
        aria-label={`Lihat bukti dari ${sitasi}`}
        onClick={() => {
          setPernahBuka(true)
          setBuka((b) => !b)
        }}
        className={`group inline-flex min-h-11 items-center gap-1 rounded-sm text-left underline decoration-dotted decoration-tinta-redup underline-offset-[3px] transition-colors duration-150 hover:text-tinta hover:decoration-tinta md:min-h-0 ${
          buka ? 'text-tinta decoration-tinta' : ''
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100"
          fill="currentColor"
        >
          <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h2A1.5 1.5 0 0 1 8 4.5v2A1.5 1.5 0 0 1 6.5 8H5.6c-.1 1.2-.7 2.2-1.9 3l-.7-.9c.7-.5 1.1-1.2 1.2-2.1A1.5 1.5 0 0 1 3 6.5v-2Zm6 0A1.5 1.5 0 0 1 10.5 3h2A1.5 1.5 0 0 1 14 4.5v2A1.5 1.5 0 0 1 12.5 8h-.9c-.1 1.2-.7 2.2-1.9 3l-.7-.9c.7-.5 1.1-1.2 1.2-2.1A1.5 1.5 0 0 1 9 6.5v-2Z" />
        </svg>
        {sitasi}
      </button>
      {pernahBuka &&
        createPortal(
          <PanelBukti
            id={idPanel}
            buka={buka}
            rujukan={rujukan}
            sumber={bukti.sumber}
            kutipan={bukti.kutipan}
            kunci={bukti.kunci}
            tombolRef={tombolRef}
            onTutup={() => setBuka(false)}
          />,
          document.body,
        )}
    </>
  )
}

// Daftar rujukan di bawah satu solusi.
export function DaftarRujukan({ sumber, tempat, label = 'Sumber:', className = '' }) {
  if (!sumber?.length) return null
  return (
    <div className={`text-xs leading-relaxed text-tinta-redup md:text-[0.8125rem] ${className}`}>
      {label && <span className="font-semibold">{label} </span>}
      <ul className="inline-flex flex-wrap gap-x-3 align-baseline">
        {sumber.map((id) => (
          <li key={id}>
            <TombolRujukan refId={id} tempat={tempat} />
          </li>
        ))}
      </ul>
    </div>
  )
}
