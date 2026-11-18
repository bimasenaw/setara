import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { bingkai } from './gerak'

// Lipatan <details> yang dituju alamat (mis. /provinsi/9700#perhitungan) terbuka dan digulir ke layar.
// Lipatan baru muncul setelah data dimuat, jadi ini dijalankan saat lipatannya terpasang, bukan saat rute berganti.
// - useLayoutEffect: lipatan sudah terbuka sebelum browser menggambar, sehingga isinya tidak mendorong
//   bagian di bawahnya setelah halaman digulir ke sana.
// - bingkai (dua requestAnimationFrame): guliran terjadi satu bingkai setelah halaman selesai tumbuh.
//   Bila tumbuh dan bergulir di bingkai yang sama, browser mencatatnya sebagai pergeseran tata letak.
export function useBukaDariHash(id, ref) {
  const { hash } = useLocation()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || decodeURIComponent(hash.slice(1)) !== id) return
    el.open = true
    return bingkai(() => el.scrollIntoView?.({ block: 'start' }))
  }, [hash, id, ref])
}
