export const DIMS = [
  { value: 'wilayah', label: 'Wilayah' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'gender', label: 'Gender' },
]

export const JENJANG = ['SD', 'SMP', 'SMA']

export function validDim(value) {
  return DIMS.some((d) => d.value === value) ? value : 'wilayah'
}

export function validJenjang(value, options = JENJANG, fallback = options[options.length - 1]) {
  return options.includes(value) ? value : fallback
}

export function validTahun(value, options, fallback) {
  const n = Number(value)
  return options.includes(n) ? n : fallback
}

export function bacaParam(params, key, valid, fallback) {
  const raw = params.get(key)
  return raw === null ? fallback : valid(raw)
}

export function tulisParam(params, setParams, key, value) {
  const next = new URLSearchParams(params)
  if (value === null || value === undefined || value === '') next.delete(key)
  else next.set(key, String(value))
  setParams(next, { replace: true })
}

export function tautanKesenjangan({ tab, tahun, jenjang }) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (tahun) params.set('tahun', String(tahun))
  if (jenjang) params.set('jenjang', jenjang)
  const q = params.toString()
  return q ? `/kesenjangan?${q}` : '/kesenjangan'
}

export function tautanProvinsi(kode, tahun) {
  const params = new URLSearchParams()
  if (tahun) params.set('tahun', String(tahun))
  const q = params.toString()
  return q ? `/provinsi/${kode}?${q}` : `/provinsi/${kode}`
}
