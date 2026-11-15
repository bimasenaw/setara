# PRD: Fase 7, perbaikan hasil audit SETARA

Status: selesai (15 November 2026)
Cabang: `v2-tampilan`
Terkait: `PRD SETARA v2.md` (bagian 16–20)

## 1. Latar

Audit tanggal 15 November 2026 dijalankan pada versi produksi (`npm run build`) di laptop, dengan tiga cara:
- Lighthouse 12 mode HP (simulasi 4G lambat) di Ringkasan, Provinsi, dan Rekomendasi.
- Pengukuran pergeseran tata letak (CLS) di enam halaman.
- Tangkapan layar semua halaman di HP dan desktop.

Nilai keseluruhan 8,2/10.

| Kategori Lighthouse (HP) | Nilai |
|---|---|
| Kinerja | 50–53 |
| Aksesibilitas | 100 |
| Praktik terbaik | 96 |
| SEO | 92 |

| Ukuran | Hasil | Batas baik |
|---|---|---|
| CLS, kunjungan pertama | 0,71–0,78 | < 0,1 |
| CLS, pengunjung lama | 0,18–0,35 | < 0,1 |
| Konten pertama tampil (FCP) | 3,2–3,7 detik | < 1,8 detik |
| Elemen terbesar tampil (LCP) | 4,7–5,1 detik | < 2,5 detik |
| Total Blocking Time | 0 ms | < 200 ms |

Kinerja rendah terutama karena pergeseran tata letak, bukan karena JavaScript yang berat.

## 2. Tujuan

1. CLS di bawah 0,1 di semua halaman, baik kunjungan pertama maupun pengunjung lama.
2. Kinerja Lighthouse HP minimal 75 di Ringkasan, Provinsi, dan Rekomendasi.
3. SEO Lighthouse 100, tanpa galat di console.
4. Teks dan foto yang masih janggal dirapikan.

**Bukan tujuan:**
- Foto baru atau foto per provinsi (menunggu foto dari pengguna).
- Memangkas halaman Metode dan grafik titik PAUD yang panjang.
- Merge ke `main` dan deploy. Keduanya dilakukan setelah fase ini, atas persetujuan pengguna.

## 3. Perbaikan

### A. Footer tidak melompat (prioritas tinggi)
- **Penyebab:** saat data masih dimuat, isi halaman pendek, jadi footer terlihat di layar pertama (y ≈ 609 px di HP). Begitu isi datang, footer terdorong keluar layar. CLS 0,28 di setiap halaman.
- **Perubahan:** area isi di `App.jsx` diberi tinggi minimal satu layar penuh (`min-h-dvh`), sehingga footer selalu mulai di bawah layar pertama, termasuk saat memuat.

### B. Kartu panduan tidak membesarkan wadah (prioritas tinggi)
- **Penyebab:** kartu panduan dirender di dalam wadah yang sama dengan penanda alur (`flex-col`). Saat kartu muncul, tepi atas wadah ikut naik. CLS 0,71 pada kunjungan pertama.
- **Perubahan:** kartu diposisikan `absolute` tepat di atas penanda alur, sehingga ukuran wadah tidak berubah. Animasi, asal tumbuh (`transform-origin`), usap, dan fokus tetap sama.

### C. Grafik dumbbell memesan tingginya (prioritas tinggi)
- **Penyebab:** `Dumbbell` baru menggambar SVG setelah lebarnya terukur, sehingga bagian di bawahnya turun. CLS 0,07 di Ringkasan.
- **Perubahan:** wadah grafik diberi tinggi minimal sebesar tinggi SVG (`baris × 60 + 28` px) sebelum lebar terukur.

### D. Ikon tab (prioritas tinggi)
- **Penyebab:** `favicon.svg` ada tetapi tidak ditautkan, sehingga browser meminta `favicon.ico` (404) dan tab menampilkan ikon kosong.
- **Perubahan:** tambah `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` di `index.html`.

### E. Teks dan label (prioritas tinggi)
- Judul tren di Kesenjangan tidak lagi memuat instruksi. Kalimat "Pilih SD, SMP, atau SMA untuk melihat arah perubahan tiap jenjang." pindah ke teks bantu di bawah judul.
- Lipatan "Lihat data dumbbell", "Lihat data tren", dan sejenisnya di `DataTable` menjadi **"Lihat angka dalam tabel"**, dengan gaya yang sama seperti "Cara membaca grafik ini" (garis tipis dan chevron, bukan kotak abu-abu).

### F. Hero Ringkasan di HP (prioritas tinggi)
- **Penyebab:** deskripsi hero lima baris menutupi hampir seluruh foto di HP.
- **Perubahan:** kepanjangan SETARA tetap tampil. Kalimat kedua ("Melihat siapa yang paling tertinggal…") hanya tampil di layar `md` ke atas, karena isinya sudah diwakili kalimat temuan tepat di bawah hero dan oleh tur panduan.
- **Syarat:** kontras teks putih tetap ≥ 4,5:1, diukur seperti Fase 2.

### G. Foto hero dimuat lebih awal (prioritas sedang)
- **Penyebab:** foto hero baru diminta setelah JavaScript berjalan. Lighthouse memperkirakan penghematan sekitar 1,5 detik.
- **Perubahan:** tambah `<link rel="preload" as="image">` untuk foto hero Ringkasan (`foto-sma.jpeg`) di `index.html`, karena itu halaman pertama yang dibuka. Halaman lain tidak di-preload supaya tidak membuang kuota.

### H. Font dari situs sendiri (prioritas sedang)
- **Penyebab:** stylesheet Google Fonts menahan tampilan pertama sekitar 0,8 detik. Font serif saja 120 KB, dan saat demo tanpa internet font akan jatuh ke font sistem.
- **Perubahan:** berkas `woff2` Public Sans (400, 500, 600, 700) dan Source Serif 4 (400, 600; subset Latin) disimpan di `public/fonts`, dideklarasikan dengan `@font-face` dan `font-display: swap`. Dua berkas yang terlihat di layar pertama di-preload. Tautan Google Fonts dihapus.
- **Lisensi:** kedua font berlisensi SIL Open Font License 1.1, yang membolehkan disebarkan ulang. Berkas `OFL.txt` disertakan di `public/fonts`.
- Tanpa dependensi npm baru.

### I. Gambar pratinjau tautan (prioritas sedang)
- **Penyebab:** `og:image` berformat SVG dengan alamat relatif (`/og.svg`). WhatsApp, Telegram, dan kebanyakan media sosial tidak menampilkannya.
- **Perubahan:**
  - `og.svg` yang sudah ada dirender menjadi `public/og.png` (1200×630).
  - `og:image` di `index.html` dan `useDocumentMeta` memakai alamat lengkap `https://setara-web.vercel.app/og.png`, ditambah `og:image:width`, `og:image:height`, dan `og:image:alt`.

### J. Halaman tidak ditemukan, robots.txt, judul tab (prioritas rendah)
- Rute `*` menampilkan halaman "Halaman tidak ditemukan" dengan tautan ke Ringkasan, bukan Ringkasan itu sendiri. Penanda alur tidak tampil di halaman ini.
- `public/robots.txt` mengizinkan semua halaman.
- Semua judul tab berformat "Halaman | SETARA", misalnya "Rekomendasi | SETARA".

## 4. Batasan

- Angka, data, dan logika tidak berubah: `src/lib` (kecuali `foto.js`), `public/data`, dan `scripts` tidak disentuh.
- Tidak ada dependensi npm baru.
- Aksesibilitas tidak boleh turun: axe 0 pelanggaran, keyboard, kurangi gerakan, dan tanpa gulir horizontal di 360–1280 px dengan huruf 14–22 px.

## 5. Tes dan selesai bila

1. CLS < 0,1 di enam halaman, diukur dengan `PerformanceObserver` di HP 390 px, untuk kunjungan pertama (`?panduan=1`) dan pengunjung lama.
2. Lighthouse HP pada build produksi: kinerja ≥ 75 di Ringkasan, Provinsi, dan Rekomendasi. SEO 100. Tidak ada galat di console.
3. Kontras hero Ringkasan di HP dan desktop ≥ 4,5:1.
4. Pemeriksaan Fase 6 diulang: axe, overflow di 3 lebar × 4 ukuran huruf, keyboard, dan kurangi gerakan.
5. Tes baru: rute tidak dikenal menampilkan "Halaman tidak ditemukan", dan `DataTable` memakai label "Lihat angka dalam tabel".
6. Lint, tes, dan build lolos. Commit atas nama pengguna saja.

Bila target kinerja 75 tidak tercapai setelah A–I, hasil sebenarnya dilaporkan apa adanya beserta penyebab yang tersisa. Angka tidak dibulatkan atau dipilih yang terbaik.

## 6. Urutan kerja

1. A, B, C (pergeseran tata letak), lalu D. Ukur ulang CLS.
2. E dan F (teks dan hero). Ukur kontras.
3. G dan H (muat awal), lalu Lighthouse.
4. I dan J.
5. Pemeriksaan penuh, catatan hasil di PRD ini, lalu commit.

Setiap langkah berakhir dalam keadaan siap deploy. Kalau waktu habis setelah langkah 2, perbaikan yang paling terlihat saat demo sudah selesai.

## 7. Setelah fase ini

- Merge `v2-tampilan` ke `main` dan deploy, atas persetujuan pengguna. Disarankan lewat URL preview Vercel dulu.
- Fase P: persiapan presentasi.

## 8. Hasil

Diukur pada build produksi dengan Lighthouse 12 mode HP (simulasi 4G lambat), satu kali run per halaman. Nilai Lighthouse bisa bergeser beberapa poin antar-run.

| Halaman | Kinerja (sebelum → sesudah) | LCP | FCP | TBT | CLS | Aksesibilitas | Praktik terbaik | SEO |
|---|---|---|---|---|---|---|---|---|
| Ringkasan | 50 → **89** | 3,5 s | 1,8 s | 70 ms | 0 | 100 | 100 | 100 |
| Rekomendasi | 53 → **84** | 3,7 s | 1,8 s | 240 ms | 0 | 100 | 100 | 100 |
| Kesenjangan | – → **82** | 4,5 s | 2,1 s | 70 ms | 0 | 100 | 100 | 100 |
| Provinsi | 51 → **77** | 3,8 s | 1,7 s | 450 ms | 0 | 100 | 100 | 100 |

**CLS dengan `PerformanceObserver`** (HP 390 px, enam halaman):
- Pengunjung lama: 0,18–0,35 → 0,001–0,010.
- Kunjungan pertama: 0,71–0,78 → 0,001–0,010.
- Semua lolos (< 0,1).

**Pemeriksaan Fase 6 diulang:**
- axe 0 pelanggaran.
- Tanpa gulir horizontal di 3 lebar × 4 ukuran huruf.
- Semua tab stop punya indikator fokus.
- Kurangi gerakan berjalan.
- Tidak ada galat di console.
- Kontras hero Ringkasan 9,69:1.

**Perubahan di luar daftar awal, ditemukan saat mengukur:**
- Data JSON di-preload di `index.html`, sehingga diunduh bersamaan dengan JavaScript, bukan setelahnya. Ini penyebab utama LCP sekitar 5 detik.
- Hero Ringkasan tampil selagi data dimuat.
- Kode halaman lain dimuat setelah interaksi pertama (atau paling lambat 6 detik), bukan saat browser senggang. Sebelumnya pustaka grafik ikut dijalankan di semua halaman dan menambah beban CPU.

**Yang masih tersisa:**
- `useDocumentMeta` (di `src/lib`, dibekukan) masih mengisi `og:image` dengan `/og.svg` saat halaman berjalan. Crawler pratinjau tautan membaca `index.html` tanpa menjalankan JavaScript, jadi pratinjau tetap memakai `og.png`. Perlu izin untuk menyelaraskannya.
- LCP Kesenjangan 4,5 s masih di atas 2,5 s pada simulasi 4G lambat, karena foto jenjang baru diminta setelah halaman dirender.
- Provinsi: TBT 450 ms, dari perhitungan indeks dan sekitar 1.160 elemen DOM.
