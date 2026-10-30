export default function TabBar({ options, value, onChange, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-4 border-b border-garis">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-11 border-b-2 px-1 text-base leading-snug transition-colors duration-200 ${
              active
                ? 'border-tinta font-semibold text-tinta'
                : 'border-transparent text-tinta-redup hover:text-tinta'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
