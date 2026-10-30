export function formatAngka(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return null
  return n.toFixed(digits).replace('.', ',')
}

export function formatPersen(n, digits = 1) {
  const s = formatAngka(n, digits)
  return s === null ? null : `${s}%`
}

export function formatPoin(n, digits = 1) {
  const s = formatAngka(n, digits)
  return s === null ? null : `${s} poin`
}

export function formatIndeks(n, digits = 2) {
  return formatAngka(n, digits)
}

export function angkaBulat(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null
  return Math.round(n)
}

export function formatJumlah(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${formatAngka(n / 1_000_000, 1)} juta`
  if (abs >= 1_000) return `${formatAngka(n / 1_000, 0)} ribu`
  return formatAngka(n, 0)
}

export function formatJumlahOrang(n) {
  const s = formatJumlah(n)
  return s === null ? null : `${s} anak`
}
