// CSV untuk Excel berbahasa Indonesia: kolom dipisah titik koma dan desimal memakai koma,
// sehingga file langsung terbuka rapi per kolom. Berkas diberi BOM UTF-8 (lihat downloadText).
// Izin pengguna 18 November 2026: hanya format CSV yang diubah, bukan angka atau logika.
const PEMISAH = ';'

function escapeCsv(s) {
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// Teks angka hasil format tampilan, mis. "+7,56 poin", "−2,4 poin", "26,10", "62,98%".
// Hanya koma yang dianggap desimal, supaya angka ribuan seperti "424.000" tidak salah dibaca.
const ANGKA_TEKS = /^([+\-−]?)(\d+(?:,\d+)?)\s?(poin|%|tahun)?$/

// Satu sel menjadi angka yang bisa dihitung Excel bila memang angka; teks lain dibiarkan.
// Angka hasil hitungan dibulatkan ke 4 desimal untuk membuang ekor floating point
// (mis. 7.559999999999999 → 7,56); data sumber paling banyak 3 desimal.
function rapikanSel(value) {
  if (value === null || value === undefined) return { teks: '' }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return { teks: '' }
    return { teks: String(Math.round(value * 1e4) / 1e4).replace('.', ',') }
  }
  const s = String(value).trim()
  const m = s.match(ANGKA_TEKS)
  if (!m) return { teks: s }
  const negatif = m[1] === '-' || m[1] === '−'
  return { teks: `${negatif ? '-' : ''}${m[2]}`, satuan: m[3] }
}

export function toCsv(rows, columns) {
  const sel = rows.map((row) => columns.map((c) => rapikanSel(row[c.key])))
  // Satuan yang dilepas dari sel ("poin", "%") pindah ke judul kolom, bila belum tertulis di sana.
  const judul = columns.map((c, i) => {
    const satuan = new Set(sel.map((r) => r[i].satuan).filter(Boolean))
    const label = String(c.label ?? '')
    if (satuan.size !== 1) return label
    const [u] = satuan
    return label.includes(`(${u})`) ? label : `${label} (${u})`
  })
  const header = judul.map(escapeCsv).join(PEMISAH)
  const body = sel.map((r) => r.map((x) => escapeCsv(x.teks)).join(PEMISAH))
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
