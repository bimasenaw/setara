// Angka sumbu yang bulat: langkah 1, 2, 2,5, atau 5 × 10ⁿ, dengan 4–6 angka mulai dari 0.
// Contoh: 26,06 → 0, 10, 20, 30. 15 → 0, 5, 10, 15. 79 → 0, 20, 40, 60, 80.
const KELIPATAN = [1, 2, 2.5, 5]

export function skalaRapi(maks, jumlahMaks = 6) {
  if (!(maks > 0) || !Number.isFinite(maks)) return { maks: 10, ticks: [0, 5, 10], desimal: 0 }
  const dasar = 10 ** (Math.floor(Math.log10(maks)) - 1)
  for (const p of [dasar, dasar * 10, dasar * 100]) {
    for (const k of KELIPATAN) {
      const langkah = k * p
      const n = Math.ceil(maks / langkah - 1e-9)
      if (n + 1 <= jumlahMaks) {
        const desimal = Math.max(0, -Math.floor(Math.log10(langkah)) + (k === 2.5 ? 1 : 0))
        const bulat = (v) => Number(v.toFixed(desimal))
        const ticks = Array.from({ length: n + 1 }, (_, i) => bulat(i * langkah))
        return { maks: ticks[ticks.length - 1], ticks, desimal }
      }
    }
  }
  return { maks, ticks: [0, maks], desimal: 0 }
}
