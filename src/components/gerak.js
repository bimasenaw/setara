// Alat gerak bersama untuk permukaan yang bisa diusap: kartu panduan dan panel bukti.

// Hambatan lembut saat ditarik melewati batas: makin jauh, makin berat.
export function karet(lebih, dimensi, c = 0.55) {
  return (lebih * dimensi * c) / (dimensi + c * Math.abs(lebih))
}

// Proyeksi titik berhenti dari kecepatan lepas (px/s), seperti perlambatan gulir.
export function proyeksi(v, d = 0.99) {
  return ((v / 1000) * d) / (1 - d)
}

// Kurva yang kemiringan awalnya sama dengan kecepatan jari, agar tidak ada sambungan
// yang terasa antara menyeret dan animasi.
export function kurvaLanjutan(v, jarak, durasi) {
  const kemiringan = jarak > 0 ? (Math.max(0, v) * durasi) / jarak : 0
  const x1 = 0.25
  const y1 = Math.min(1, x1 * kemiringan)
  return `cubic-bezier(${x1}, ${y1.toFixed(3)}, 0.4, 1)`
}

export function ySekarang(el) {
  try {
    const t = getComputedStyle(el).transform
    return t && t !== 'none' ? new DOMMatrixReadOnly(t).m42 : 0
  } catch {
    return 0
  }
}

// Menjalankan fn dua bingkai lagi. Pembatalan berlaku untuk kedua bingkai, supaya permukaan yang
// ditutup tepat saat mulai membuka tidak kembali ke fase "buka".
export function bingkai(fn) {
  if (typeof requestAnimationFrame === 'function') {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(fn)
    })
    return () => cancelAnimationFrame(id)
  }
  const id = setTimeout(fn, 16)
  return () => clearTimeout(id)
}

export const FOKUSABEL = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
