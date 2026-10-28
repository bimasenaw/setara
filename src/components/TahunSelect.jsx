export default function TahunSelect({ options, value, onChange, label = 'Tahun' }) {
  return (
    <label className="inline-flex items-center gap-2 text-tinta">
      <span className="text-sm text-tinta-redup">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-11 rounded-lg border border-garis bg-putih px-3 py-1.5 text-base text-tinta focus:outline-none focus:ring-2 focus:ring-biru"
      >
        {options.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  )
}
