# PRD: Fase 8, lisensi rujukan, foto hero HD, dan pekerjaan opsional

Status: selesai (18 November 2026), belum di-commit
Cabang: `v2-tampilan`
Terkait: `PRD Fase 7 Audit SETARA.md`, `PRD Rujukan Interaktif SETARA.md`, `PRD Batang Berdampingan SETARA.md`

## 1. Permintaan

Dari pengguna, 18 November 2026:
1. Empat rujukan yang menunggu konfirmasi lisensi dimasukkan ke kelompok yang bisa dibaca langsung di SETARA.
2. Foto hero diganti dengan versi yang lebih tajam.
3. Semua pekerjaan opsional dikerjakan:
   - `og:image` saat halaman berjalan
   - kecepatan Kesenjangan dan Provinsi
   - pilihan batang di Kesenjangan
   - gambar "1 dari 5 anak" untuk slide

Pekerjaan wajib sebelum presentasi (push, merge, Fase P) menyusul setelah fase ini.

## 2. Lisensi rujukan

Setiap jurnal dicek di situs penerbitnya. PDF-nya sendiri tidak mencantumkan lisensi.

| Rujukan | Jurnal | Lisensi | Bukti | Hasil |
|---|---|---|---|---|
| sulistyaningrum2016 | Journal of Indonesian Economy and Business (UGM) | CC BY-SA 4.0 | Kaki halaman artikel: "licensed under a Creative Commons Attribution-ShareAlike 4.0 International License" | Dibaca langsung di SETARA |
| purnastuti2012 | Jurnal Ekonomi dan Pendidikan (UNY) | CC BY-SA 4.0 | Halaman Copyright Notice: "Articles are published under a Creative Commons Attribution-ShareAlike 4.0 International Licence" | Dibaca langsung di SETARA |
| caniago2021 | Economics Development Analysis Journal (Unnes) | CC BY 3.0 | Halaman About jurnal: "licensed under a Creative Commons Attribution 3.0 License". Situs sedang tidak bisa diakses, teks terbaca dari indeks pencarian | Dibaca langsung di SETARA |
| kartasasmita2021 | Economics and Finance in Indonesia (UI) | **Tidak ditemukan** | Halaman kebijakan hanya menyebut akses terbuka (gratis dibaca), tanpa lisensi CC | **Tetap tautan**: menaruh PDF-nya di SETARA tanpa izin melanggar hak cipta |

Perubahan:
- Mengisi `lisensi` dan `pdf` di `src/content/kutipan.js`.
- Menyalin PDF ke `public/rujukan/`.

Kutipan dan sorotannya sudah ada sejak Fase R dan sudah diuji terhadap PDF. Di browser, ketiga PDF terbuka dengan sorotan di halaman yang benar.

## 3. Foto hero HD

Foto lama berukuran 578–1000 px dan asal-usulnya tidak tercatat. Penggantinya dari Wikimedia Commons, semuanya CC BY-SA, dengan kredit fotografer dan lisensi di bawah foto (`src/components/KreditFoto.jsx`).

| Jenjang | Foto | Fotografer | Lisensi |
|---|---|---|---|
| SD | Murid SD di Siberut Selatan, Mentawai, pulang sekolah melewati jembatan bambu | Mentawairereiket | CC BY-SA 4.0 |
| SMP | Murid SMP Negeri Satu Atap Oebelo, Timor Tengah Selatan | Dianadola | CC BY-SA 4.0 |
| SMA | Murid SMA Negeri 1 Ceper bermusyawarah di halaman sekolah | Dani Safa Adi Nugraha | CC BY-SA 3.0 |
| Umum | Upacara bendera di halaman sekolah, dari atas | Arifinulburhan | CC BY-SA 4.0 |

- Tiap foto tersedia dalam lebar 640, 800, 1200, dan 1600 px (`public/images/jenjang/`), dan browser memilih lewat `srcset`/`sizes`. HP mengunduh 640 px (53–83 KB); desktop mengunduh 1200 px untuk hero.
- WebP dicoba, tetapi untuk foto sedetail ini tidak lebih kecil dari JPEG, jadi tetap JPEG.
- **Kepala halaman Provinsi:** tidak ada foto sekolah Papua (Indonesia) berlisensi bebas yang cukup tajam di Commons. Hasil pencarian "Papua" ternyata foto Papua Nugini. Kepala halaman Provinsi kini memakai foto Lembah Baliem dari set foto provinsi.
- Foto provinsi kini juga punya versi 640 px.
- Lima berkas foto lama dihapus dari `public/images/`. Salinan aslinya tetap ada di folder `Foto/` milik pengguna.

## 4. Pekerjaan opsional

**7. Gambar pratinjau tautan.** `useDocumentMeta` (izin pengguna, 18 November 2026) sekarang mengisi `og:image` dan `twitter:image` dengan `https://setara-web.vercel.app/og.png`, sama dengan `index.html`. Sebelumnya `/og.svg`.

**8. Kecepatan.** Perubahan:
- Preload foto hero SMA hanya di Ringkasan (skrip kecil di `index.html`). Sebelumnya halaman lain ikut mengunduh 91 KB yang tidak dipakai.
- Foto kepala halaman diminta sejak render pertama lewat `preload()` React 19 (`src/components/muatFoto.js`), dengan `fetchpriority="high"`.
- Kesenjangan: grafik tren (pustaka grafik sekitar 340 KB) dimuat terpisah dengan tempat yang sudah dipesan, sehingga kepala halaman tidak menunggunya.
- Provinsi: isi di bawah kepala halaman dirender sebagai render latar (`useDeferredValue`). Perhitungan matriks dan provinsi paling berubah dipanggil di dalam bagiannya sendiri, sehingga React bisa menjeda di antaranya. Fungsi di `src/lib` tidak diubah.

**9. Pilihan batang di Kesenjangan.** Pemilih "Titik dan garis" | "Batang" yang sama dengan Ringkasan, memakai `?grafik=batang`. Opsi dan pembaca parameternya dipindah ke `src/components/bentukGrafik.js`.

**10. Gambar untuk slide** (`Presentasi/Grafik/`, 1920×1080, tidak di-commit):
- `slide-1-dari-5.png`: "Sekitar 1 dari 5 anak usia SMA tidak bersekolah" (21,61%, Susenas 2023), lima ikon dengan satu ikon merah.
- `slide-termiskin-terkaya.png`: dua kisi 10×10, keluarga termiskin 30,7% (31 kotak) dan terkaya 14,7% (15 kotak). Setiap kotak = 1%, dibulatkan.
- Angka diambil langsung dari `public/data/tidak_sekolah.json`.

**Tambahan yang ditemukan saat mengukur:** halaman baca rujukan (penampil PDF) punya CLS 0,184, termasuk untuk rujukan lama. Penampil menggulir ke kutipan sebelum halaman PDF mendapat tingginya, sehingga footer sempat terlihat. Daftar halaman PDF kini diberi tinggi minimal sejak awal, dan CLS menjadi 0.

## 5. Hasil

**Lighthouse mode HP** (build produksi, satu run per halaman kecuali Provinsi dua run; nilai bisa bergeser beberapa poin):

| Halaman | Fase 7 | Setelah foto HD, sebelum perbaikan | Sesudah perbaikan | LCP | TBT |
|---|---|---|---|---|---|
| Ringkasan | 89 | 88 | 86 | 3,8 s | 150 ms |
| Kesenjangan | 82 | 78 | **83** | 4,2 s | 150 ms |
| Provinsi | 77 | 69 | **74–77** | 4,6 s | 280–330 ms (sebelumnya 470) |
| Rekomendasi | 84 | 78 | **83** | 4,1 s | 170 ms |

Aksesibilitas, praktik terbaik, dan SEO tetap 100 di keempat halaman.

Foto HD memang lebih berat dari foto lama, dan LCP Ringkasan naik sekitar 0,3 detik dibanding Fase 7. Bagian terbesar LCP tetap waktu menjalankan JavaScript utama pada simulasi CPU lambat, bukan foto.

**Pemeriksaan di browser** (HP 390 px, HP 360 px, desktop 1280 px):
- Ringkasan dan Kesenjangan dalam dua tampilan, Provinsi, Rekomendasi, profil provinsi, dan penampil rujukan: CLS 0, tanpa gulir horizontal, axe 0 pelanggaran.
- Tampilan batang diperiksa di HP 360 px dan desktop. Ini sekaligus menutup langkah 3–4 di `PRD Batang Berdampingan SETARA.md`.

**Tes:**
- 112 lolos, 1 dilewati. Lint bersih, build lolos.
- Tes baru: `src/lib/foto.test.js` (berkas srcset ada, lisensi, kredit), pemeriksaan versi 640 px foto provinsi, tes pemilih batang di Kesenjangan.
- Beberapa batas tunggu tes dinaikkan (3 → 6 detik di tes panduan, 5 detik untuk pemilih bentuk grafik), karena tes sempat gagal saat seluruh rangkaian berjalan bersamaan. Lolos tiga kali berturut-turut setelahnya.

## 6. Sisa

- Kartasasmita 2021 tetap tautan, sampai ada bukti lisensi CC dari penerbit (EFI UI).
- LCP di simulasi 4G lambat masih 3,8–4,6 detik. Pada Wi-Fi saat demo, ini tidak terasa.
