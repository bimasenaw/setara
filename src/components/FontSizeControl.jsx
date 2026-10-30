import { useEffect, useState } from 'react'

const KEY = 'setara-font-size'
const MIN = 14
const MAX = 22
const DEFAULT = 16

function readStored() {
  if (typeof window === 'undefined') return DEFAULT
  const v = Number(window.localStorage.getItem(KEY))
  return Number.isFinite(v) && v >= MIN && v <= MAX ? v : DEFAULT
}

export default function FontSizeControl() {
  const [size, setSize] = useState(readStored)

  useEffect(() => {
    document.documentElement.style.fontSize = `${size}px`
  }, [size])

  const onChange = (e) => {
    const v = Number(e.target.value)
    setSize(v)
    window.localStorage.setItem(KEY, String(v))
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm leading-none text-tinta-redup" aria-hidden="true">
        A
      </span>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={size}
        onChange={onChange}
        aria-label="Ukuran huruf"
        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-garis accent-tinta"
      />
      <span className="text-lg leading-none text-tinta-redup" aria-hidden="true">
        A
      </span>
    </div>
  )
}
