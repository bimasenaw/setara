export default function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-garis bg-putih p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-11 rounded-md px-3 py-1.5 text-base leading-snug transition-colors duration-200 ${
              active
                ? 'bg-tinta font-semibold text-putih'
                : 'text-tinta hover:bg-kertas'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
