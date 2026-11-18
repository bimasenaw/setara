import { useEffect } from 'react'

const GAMBAR_PRATINJAU = 'https://setara-web.vercel.app/og.png'

function setMeta(attr, key, value) {
  if (typeof document === 'undefined' || !value) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function useDocumentMeta({ judul, deskripsi }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (judul) document.title = judul
    if (deskripsi) {
      setMeta('name', 'description', deskripsi)
      setMeta('property', 'og:description', deskripsi)
    }
    if (judul) setMeta('property', 'og:title', judul)
    // Sama dengan index.html: PNG beralamat lengkap, karena SVG tidak ditampilkan WhatsApp dan media sosial.
    setMeta('property', 'og:image', GAMBAR_PRATINJAU)
    setMeta('name', 'twitter:image', GAMBAR_PRATINJAU)
  }, [judul, deskripsi])
}
