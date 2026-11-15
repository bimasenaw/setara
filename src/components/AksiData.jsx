import { useEffect, useId, useRef, useState } from 'react'
import { bingkai } from './gerak'

// Satu tombol "Bagikan dan unduh" yang membuka menu aksi.
// Menu muncul dari tombolnya dan menutup lewat jalur yang sama (opacity + scale, 150 ms).
// Keyboard: Enter/Space membuka, panah berpindah, Home/End, Esc menutup, Tab keluar.
// `aksi`: [{ label, jalankan: async () => string | void }]; string yang dikembalikan
// diumumkan sebagai pesan hasil.
export default function AksiData({ aksi, label = 'Bagikan dan unduh', className = '' }) {
  const [buka, setBuka] = useState(false)
  const [pesan, setPesan] = useState('')
  const tombolRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef([])
  const menuId = useId()

  const item = (aksi || []).filter(Boolean)

  useEffect(() => {
    if (!buka) return
    // Menu baru terlihat setelah bingkai pertama transisi (visibility), jadi fokus dipindah sesudahnya.
    const batalFokus = bingkai(() => itemRefs.current[0]?.focus())
    const tutupLuar = (e) => {
      if (!menuRef.current?.contains(e.target) && !tombolRef.current?.contains(e.target)) {
        setBuka(false)
      }
    }
    document.addEventListener('pointerdown', tutupLuar)
    return () => {
      batalFokus()
      document.removeEventListener('pointerdown', tutupLuar)
    }
  }, [buka])

  useEffect(() => {
    if (!pesan) return
    const t = setTimeout(() => setPesan(''), 3000)
    return () => clearTimeout(t)
  }, [pesan])

  const tutup = (kembalikanFokus = true) => {
    setBuka(false)
    if (kembalikanFokus) tombolRef.current?.focus()
  }

  const pindahFokus = (arah) => {
    const daftar = itemRefs.current.filter(Boolean)
    if (!daftar.length) return
    const i = daftar.indexOf(document.activeElement)
    let next = 0
    if (arah === 'awal') next = 0
    else if (arah === 'akhir') next = daftar.length - 1
    else next = (i + arah + daftar.length) % daftar.length
    daftar[next].focus()
  }

  const onKeyMenu = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      tutup()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      pindahFokus(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      pindahFokus(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      pindahFokus('awal')
    } else if (e.key === 'End') {
      e.preventDefault()
      pindahFokus('akhir')
    } else if (e.key === 'Tab') {
      tutup(false)
    }
  }

  const onKeyTombol = (e) => {
    if (e.key === 'ArrowDown' && !buka) {
      e.preventDefault()
      setBuka(true)
    }
  }

  const pilih = async (a) => {
    tutup()
    try {
      const hasil = await a.jalankan()
      if (typeof hasil === 'string' && hasil) setPesan(hasil)
    } catch {
      setPesan('Aksi gagal dijalankan.')
    }
  }

  if (!item.length) return null

  return (
    <div className={`relative mt-4 inline-block print:hidden ${className}`}>
      <button
        ref={tombolRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={buka}
        aria-controls={menuId}
        onClick={() => setBuka((v) => !v)}
        onKeyDown={onKeyTombol}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-garis bg-putih px-4 text-base text-tinta transition-colors duration-150 hover:bg-kertas"
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`h-4 w-4 transition-transform duration-150 ease-out ${buka ? 'rotate-180' : ''}`}
        >
          <path
            d="M3.5 6 8 10.5 12.5 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        onKeyDown={onKeyMenu}
        className={`absolute bottom-full left-0 z-20 mb-2 w-60 origin-bottom-left rounded-lg border border-garis bg-putih p-1 shadow-[0_8px_24px_rgb(24_33_44/0.12)] transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transform-none ${
          buka ? 'visible scale-100 opacity-100' : 'pointer-events-none invisible scale-[0.96] opacity-0'
        }`}
      >
        {item.map((a, i) => (
          <li key={a.label} role="none">
            <button
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={() => pilih(a)}
              className="flex min-h-11 w-full items-center rounded-md px-3 text-left text-base text-tinta hover:bg-kertas focus-visible:bg-kertas"
            >
              {a.label}
            </button>
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="teks-bantu mt-2 min-h-[1.3125rem]">
        {pesan}
      </p>
    </div>
  )
}
