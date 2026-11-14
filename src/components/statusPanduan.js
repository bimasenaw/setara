// Status kartu panduan alur: sekali dilihat, tidak muncul lagi di perangkat ini.
// Jika penyimpanan tidak tersedia (mode privat, diblokir), cukup diingat selama sesi.
const KUNCI = 'setara-panduan-v1'
let dilihatSesiIni = false

export function sudahDilihat() {
  if (dilihatSesiIni) return true
  try {
    return window.localStorage.getItem(KUNCI) === '1'
  } catch {
    return false
  }
}

export function tandaiDilihat() {
  dilihatSesiIni = true
  try {
    window.localStorage.setItem(KUNCI, '1')
  } catch {
    // Penyimpanan tidak tersedia; status sesi sudah cukup.
  }
}

export function resetPanduan() {
  dilihatSesiIni = false
  try {
    window.localStorage.removeItem(KUNCI)
  } catch {
    // abaikan
  }
}
