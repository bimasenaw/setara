const FOTO_JENJANG = {
  SD: { src: '/images/foto-sd.png', alt: 'Foto suasana sekolah dasar' },
  SMP: { src: '/images/foto-smp.jpg', alt: 'Foto suasana sekolah menengah pertama' },
  SMA: { src: '/images/foto-sma.jpeg', alt: 'Foto suasana sekolah menengah atas' },
  Umum: { src: '/images/foto-umum.jpeg', alt: 'Foto suasana pendidikan di Indonesia' },
}

export function fotoJenjang(jenjang) {
  return FOTO_JENJANG[jenjang] || FOTO_JENJANG.Umum
}
