import { buatSitasi, cetak, copyText, downloadCsv, shareTeks } from '../lib/ekspor'

// Susun daftar aksi standar untuk <AksiData>. Bagian yang tidak diisi tidak ditampilkan.
// Semua fungsi ekspor dipanggil apa adanya dari src/lib/ekspor.js.
export function aksiStandar({ temuan, judulBagikan, csv, sitasi, bisaCetak = false }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  return [
    temuan && {
      label: 'Salin temuan',
      jalankan: async () => ((await copyText(temuan)) ? 'Temuan disalin.' : 'Gagal menyalin.'),
    },
    temuan && {
      label: 'Bagikan tautan',
      jalankan: async () => {
        const ok = await shareTeks({ title: judulBagikan || 'SETARA', text: temuan, url })
        return ok ? 'Tautan siap dibagikan.' : 'Gagal membagikan tautan.'
      },
    },
    csv && {
      label: 'Unduh CSV',
      jalankan: () => {
        downloadCsv(csv.nama, csv.baris, csv.kolom)
        return 'CSV diunduh.'
      },
    },
    sitasi && {
      label: 'Salin sitasi',
      jalankan: async () =>
        (await copyText(buatSitasi(sitasi))) ? 'Sitasi disalin.' : 'Gagal menyalin sitasi.',
    },
    bisaCetak && {
      label: 'Cetak / PDF',
      jalankan: () => {
        cetak()
      },
    },
  ].filter(Boolean)
}
