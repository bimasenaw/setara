export default function Accordion({ judul = 'Apa maknanya?', children, className = '' }) {
  return (
    <details className={`mt-3 rounded-lg border border-garis bg-kertas p-3 ${className}`}>
      <summary className="cursor-pointer text-sm font-semibold text-tinta">{judul}</summary>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-tinta-redup">{children}</div>
    </details>
  )
}
