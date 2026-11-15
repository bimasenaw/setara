import { DaftarRujukan } from './TombolRujukan'

export default function SolusiBlock({ solusi, judul = 'Solusi' }) {
  if (!solusi) return null

  return (
    <div className="mt-3 rounded-lg border border-garis bg-kertas p-3">
      {solusi.temuan && (
        <p className="text-sm leading-relaxed text-tinta">
          <span className="font-semibold">Temuan utama:</span> {solusi.temuan}
        </p>
      )}
      <p className={`${solusi.temuan ? 'mt-1.5' : ''} text-sm leading-relaxed text-tinta`}>
        <span className="font-semibold">{judul}:</span> {solusi.solusi}
      </p>
      <DaftarRujukan sumber={solusi.sumber} tempat={`solusi.${solusi.id}`} className="mt-1.5" />
    </div>
  )
}
