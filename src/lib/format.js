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

export function angkaBulat(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null
  return Math.round(n)
}
