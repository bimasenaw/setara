function escapeCsv(value) {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCsv(c.label)).join(',')
  const body = rows.map((row) => columns.map((c) => escapeCsv(row[c.key])).join(','))
  return [header, ...body].join('\r\n')
}

export function downloadText(filename, content, type = 'text/csv;charset=utf-8') {
  if (typeof document === 'undefined') return
  const blob = new Blob([`\ufeff${content}`], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCsv(filename, rows, columns) {
  downloadText(filename, toCsv(rows, columns))
}

export async function copyText(text) {
  if (typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export async function shareTeks({ title, text, url }) {
  if (typeof navigator === 'undefined') return false
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return true
    } catch {
      return false
    }
  }
  return copyText(`${text}\n${url}`)
}

export function buatSitasi({ judul, tahun, url }) {
  const lokasi = url || (typeof window !== 'undefined' ? window.location.href : '')
  return `${judul} (${tahun}). SETARA: Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses. BPS, Susenas. ${lokasi}`
}

export function downloadSvgPng(svg, filename, skala = 2) {
  if (!svg || typeof document === 'undefined') return
  const clone = svg.cloneNode(true)
  const box = svg.getBoundingClientRect()
  const width = Math.max(1, Math.round(box.width))
  const height = Math.max(1, Math.round(box.height))
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const xml = new XMLSerializer().serializeToString(clone)
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width * skala
    canvas.height = height * skala
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(url)
    canvas.toBlob((png) => {
      if (!png) return
      const pngUrl = URL.createObjectURL(png)
      const a = document.createElement('a')
      a.href = pngUrl
      a.download = filename
      a.click()
      URL.revokeObjectURL(pngUrl)
    }, 'image/png')
  }
  img.src = url
}

export function cetak() {
  if (typeof window !== 'undefined') window.print()
}
