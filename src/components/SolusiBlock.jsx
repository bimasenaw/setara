import { refs } from '../lib/solusi'

export default function SolusiBlock({ solusi, judul = 'Solusi' }) {
  if (!solusi) return null
  const sumber = refs(solusi.sumber)

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
      <div className="mt-1.5 text-xs leading-relaxed text-tinta-redup">
        <span className="font-semibold">Sumber:</span>
        <ul className="mt-0.5 space-y-0.5">
          {sumber.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-garis underline-offset-2 hover:text-tinta"
              >
                {s.referensi}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
