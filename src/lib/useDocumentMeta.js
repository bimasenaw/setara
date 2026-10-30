import { useEffect } from 'react'

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
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    setMeta('property', 'og:image', `${origin}/og.svg`)
  }, [judul, deskripsi])
}
