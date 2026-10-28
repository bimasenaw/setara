# PRD: SETARA

SETARA (Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses) adalah aplikasi web analisis ketimpangan pendidikan Indonesia untuk School Essay Competition (SDGs 4 dan 10). Data dari BPS WebAPI. Dirancang untuk dibangun dengan opencode dalam 2 hari.

## 1. Tujuan

SETARA menunjukkan siapa yang paling tertinggal dari pendidikan lewat empat sudut: wilayah (kota vs desa), ekonomi (kuintil pengeluaran), gender, dan peringkat partisipasi pendidikan usia dini per provinsi. Setiap grafik harus menghasilkan temuan yang bisa dikutip di esai dan mengarah ke rekomendasi keputusan.

## 2. Batasan (wajib dipatuhi)

- Waktu pengerjaan 2 hari. Selalu pilih solusi yang paling sederhana.
- Tanpa backend dan database. Data dibaca dari file JSON statis di `public/data`.
- API key BPS hanya dipakai di script pengambil data yang dijalankan lokal. Key tidak boleh ada di kode front-end, repo, atau log.
- Jangan mengarang angka. Semua angka berasal dari respons API BPS.
- Hanya 3 halaman. Jangan menambah fitur di luar dokumen ini.

## 3. Tech stack

Vite + React + Recharts + Tailwind CSS. Script data: Node.js (fetch bawaan), tanpa library tambahan. Deploy: Vercel (static). Bahasa antarmuka: Indonesia. Angka memakai titik di file data dan koma desimal di tampilan.

## 4. Sumber data

Base URL: `https://webapi.bps.go.id/v1/api`, domain `0000` (nasional). Sumber survei: Susenas BPS. Satuan di API tertulis Tidak Ada Satuan; diasumsikan persen, verifikasi dengan tabel di bps.go.id sebelum dikutip di esai.

| Var | Isi | Dimensi | Tahun | th\_id |
| --- | --- | --- | --- | --- |
| 1984 | Angka anak tidak sekolah per jenjang | Perkotaan, Perdesaan, Total | 2019-2023 | 119-123 |
| 1986 | Angka anak tidak sekolah per jenjang | Laki-laki, Perempuan, Total | 2019-2023 | 119-123 |
| 1988 | Angka anak tidak sekolah per jenjang | Kuintil pengeluaran 1-5 | 2019-2023 | 119-123 |
| 1990 | Partisipasi pembelajaran terorganisir satu tahun sebelum SD | Provinsi (+ Indonesia) | 2015-2023 | 115-123 |

th\_id 123 = 2023 dan turun satu per tahun. Verifikasi lewat endpoint daftar tahun.

Endpoint:

- Daftar tahun: `/list/model/th/domain/0000/key/KEY?var=VAR`
- Data: `/list/model/data/domain/0000/var/VAR/th/TH_ID/key/KEY`

### Cara membaca respons data

Respons berisi `vervar` (kategori baris), `turvar` (kategori kolom, di sini jenjang), `tahun`, dan `datacontent`. Key di `datacontent` adalah gabungan tanpa pemisah: vervar + var + turvar + th\_id + turtahun.

Contoh: `1198416721230` = 1 (Perkotaan) + 1984 + 1672 (SD) + 123 + 0.

Jangan memecah key berdasarkan posisi karakter. Bangun key dari semua kombinasi vervar × turvar, lalu cari di `datacontent`. Jika key tidak ada, lewati tanpa error. Untuk var 1990, turvar = 0.

Kode jenjang (turvar): 1672 = SD, 1673 = SMP, 1674 = SMA.

Kode vervar: var 1984: 1 Perkotaan, 2 Perdesaan, 3 Total. var 1986: 1 Laki-laki, 2 Perempuan, 3 Total. var 1988: 1-5 = Kuintil 1-5 (tanpa total). var 1990: kode provinsi 4 digit (mis. 1100 Aceh), 9999 = Indonesia.

## 5. Script pengambil data

Dijalankan lokal sekali: `node scripts/fetch.js`. Membaca `BPS_API_KEY` dari file `.env` (masuk `.gitignore`). Untuk tiap var dan tiap th\_id, ambil data, decode, lalu tulis:

1. `public/data/tidak_sekolah.json`: array berisi `{dimensi, kelompok, jenjang, tahun, nilai}`. dimensi: 1984 = wilayah, 1988 = ekonomi, 1986 = gender. vervar total diberi kelompok `Total`.
2. `public/data/provinsi.json`: array berisi `{kode, provinsi, tahun, nilai}`. Baris 9999 disimpan terpisah sebagai nilai nasional per tahun, bukan sebagai provinsi. Nama provinsi dirapikan ke Title Case.

Tahun diambil dari label tahun di respons. Beri jeda 300 ms antar request dan cetak ringkasan jumlah baris di akhir.

Catatan: pada 2023, empat provinsi baru Papua (Papua Barat Daya, Papua Selatan, Papua Tengah, Papua Pegunungan) tidak punya nilai di var 1990. App menampilkan Data belum tersedia, bukan 0.

## 6. Halaman dan fitur

### Halaman 1: Ringkasan

- Judul SETARA dengan tagline Melihat kesenjangan pendidikan lewat data BPS, deskripsi satu paragraf, dan sumber data. Kepanjangan SETARA ditulis satu kali di deskripsi ini.
- Filter global: tahun (2019-2023) dan jenjang (SD, SMP, SMA).
- 4 kartu angka untuk filter terpilih: nasional, selisih kota-desa, selisih kuintil 1 vs 5, selisih laki-laki vs perempuan.
- 3 kotak Temuan utama berisi teks otomatis yang dihitung dari data, bukan hardcode.

### Halaman 2: Kesenjangan

- Tab: Wilayah, Ekonomi, Gender.
- Grafik batang berkelompok per jenjang untuk tahun terpilih.
- Grafik garis tren 2019-2023 untuk jenjang terpilih.
- Tabel metrik per jenjang: selisih absolut dan rasio.
- Satu kalimat catatan di bawah grafik tentang arti angkanya.

### Halaman 3: Provinsi dan Prioritas

- Grafik batang horizontal peringkat partisipasi pendidikan usia dini per provinsi, dengan garis referensi nilai nasional dan tombol urut naik/turun.
- Tabel sortable: provinsi, nilai, selisih dari nasional. Filter tahun 2015-2023.
- Highlight 5 provinsi terendah sebagai Prioritas intervensi, dengan catatan bahwa Papua jauh di bawah yang lain.
- Panel Rekomendasi keputusan: 3 poin statis, teks disediakan pembuat.

## 7. Metrik

- Selisih absolut = nilai kelompok tertinggi dikurangi terendah (poin persentase).
- Rasio = nilai tertinggi dibagi terendah.
- Selisih dari nasional (provinsi) = nilai provinsi dikurangi nilai Indonesia.
- Aplikasi bersifat deskriptif. Jangan menambah model statistik lain.

## 8. Data sampel 2023 (untuk membangun UI sebelum script jalan)

Angka anak tidak sekolah, jenjang × wilayah dan gender:

| Jenjang | Perkotaan | Perdesaan | Total | Laki-laki | Perempuan |
| --- | --- | --- | --- | --- | --- |
| SD | 0.32 | 1.12 | 0.67 | 0.68 | 0.66 |
| SMP | 5.82 | 8.45 | 6.93 | 7.97 | 5.86 |
| SMA | 18.50 | 26.06 | 21.61 | 23.78 | 19.34 |

Jenjang × kuintil pengeluaran:

| Jenjang | K1 | K2 | K3 | K4 | K5 |
| --- | --- | --- | --- | --- | --- |
| SD | 1.15 | 0.58 | 0.58 | 0.46 | 0.38 |
| SMP | 10.11 | 7.33 | 6.14 | 5.37 | 5.05 |
| SMA | 30.66 | 23.21 | 19.65 | 19.31 | 14.67 |

Partisipasi pembelajaran usia dini 2023 (sebagian): Indonesia 95.54, DI Yogyakarta 99.86, Papua 62.98, Kalimantan Barat 91.85, DKI Jakarta 92.36, Papua Barat 93.14, Kalimantan Timur 93.30.

## 9. Temuan awal 2023 (untuk validasi tampilan, hitung ulang di app)

- Anak tidak sekolah naik tajam per jenjang: sekitar 0.67% (SD), 6.93% (SMP), 21.61% (SMA).
- Wilayah: selisih desa-kota 0.80 poin (SD), 2.63 (SMP), 7.56 (SMA). Selisih absolut melebar di jenjang atas, sedangkan rasio justru terbesar di SD (sekitar 3.5 kali) dan sekitar 1.4 kali di SMA.
- Ekonomi: kuintil 1 vs 5 di SMA 30.66 vs 14.67 (selisih 15.99 poin, rasio sekitar 2.1). Di SMP selisih 5.06 poin (rasio 2.0). Di SD selisih 0.77 poin (rasio sekitar 3.0).
- Gender: laki-laki lebih banyak tidak sekolah daripada perempuan di SMP (7.97 vs 5.86) dan SMA (23.78 vs 19.34); di SD hampir sama.
- Provinsi: Papua 62.98 jauh di bawah nasional 95.54 (selisih 32.56 poin). Lima terendah berikutnya mulai dari Kalimantan Barat 91.85, DKI Jakarta 92.36, Papua Barat 93.14, dan Kalimantan Timur 93.30. Tertinggi: DI Yogyakarta 99.86.

## 10. Catatan keterbatasan (tampilkan di footer app)

- Data terbaru yang tersedia di API: 2023.
- Var 1990 mengukur partisipasi pendidikan usia dini, bukan anak tidak sekolah. Jangan dicampur dalam satu grafik.
- Data berasal dari survei sampel (Susenas); selisih kecil antar provinsi perlu ditafsirkan hati-hati.
- Korelasi bukan sebab-akibat; app tidak mengklaim penyebab.
- Sumber: BPS (Susenas). Wajib dicantumkan di footer.

## 11. Urutan kerja dan definisi selesai

- Hari 1: scaffold project dan Tailwind; script data dan verifikasi 2-3 angka dengan tabel di bps.go.id; halaman Kesenjangan.
- Hari 2: halaman Provinsi, halaman Ringkasan, deploy ke Vercel, cek tampilan di HP, lalu tulis esai.
- Selesai jika: tiga halaman jalan di URL publik; angka sama dengan BPS; tidak ada API key di repo; setiap grafik punya judul, satuan, dan sumber.

## 12. Arahan desain dan UX

Bagian ini lebih utama daripada bagian 6 jika ada yang bertentangan.

### Siapa yang melihat dan apa yang mereka cari

Pembaca utama adalah juri dan pembaca esai: kebanyakan bukan ahli statistika, melihat sebentar, dan sering membuka dari HP. Mereka datang dengan tiga pertanyaan: siapa yang tertinggal, seberapa jauh, dan apa yang harus dilakukan. Setiap layar harus menjawab satu pertanyaan itu dalam 5 detik pertama.

### Prinsip

1. **Temuan dulu, grafik kemudian.** Judul tiap halaman dan tiap grafik adalah kalimat temuan yang dihitung dari data, misalnya: Di SMA, 30,7% anak dari keluarga termiskin tidak sekolah, hampir dua kali lipat kuintil terkaya. Angka di kalimat harus berasal dari data yang sama dengan grafiknya.
2. **Satu grafik, satu pesan.** Maksimal dua seri bermakna per grafik.
3. **Warna membawa arti.** Merah bata = kelompok yang kondisinya lebih buruk menurut indikator di halaman itu (desa, kuintil 1, laki-laki, 5 provinsi terendah). Biru kelabu = pembanding. Warna yang sama berarti hal yang sama di semua halaman.
4. **Kesenjangan adalah tokoh utama.** Grafik utama halaman Kesenjangan adalah dumbbell: dua titik per jenjang (pembanding dan kelompok tertinggal) dihubungkan garis tebal; panjang garis = selisih, dan nilainya ditulis di ujung garis (mis. +7,6 poin). Buat sebagai komponen SVG sederhana dengan skala linear, bukan dengan Recharts. Jika terlalu rumit, cadangan: batang horizontal berkelompok dengan label langsung.
5. **Terjemahkan angka ke bahasa awam.** Tampilkan padanan kalimat, misalnya: Dari 100 anak usia SMA di desa, sekitar 26 tidak bersekolah. Pakai kalimat ini hanya setelah satuan persen terverifikasi. Istilah poin persentase dijelaskan satu kali di teks bantuan.
6. **Kurangi beban baca.** Tanpa legend terpisah (label langsung pada titik atau garis), nilai selalu terlihat tanpa hover (HP tidak punya hover), tanpa grid padat, tanpa 3D, tanpa pie chart.
7. **Jujur secara visual.** Batang selalu mulai dari 0. Peringkat provinsi memakai dot plot dengan sumbu 50-100, karena batang dari 0 akan menyembunyikan selisih; sumbu diberi catatan jelas bahwa dimulai dari 50.

### Token desain

| Peran | Nama | Hex |
| --- | --- | --- |
| Latar halaman | Kertas | #F5F6F8 |
| Permukaan | Putih | #FFFFFF |
| Teks utama | Tinta | #18212C |
| Teks sekunder | Tinta redup | #5A6676 |
| Garis pemisah | Garis | #DCE1E7 |
| Pembanding (hanya grafik) | Biru kelabu | #6F8CAB |
| Kelompok tertinggal | Merah bata | #C2372D |

**Tipografi.** Public Sans untuk antarmuka, label, dan angka (aktifkan font-variant-numeric: tabular-nums). Source Serif 4 hanya untuk kalimat temuan dan judul halaman, dengan line-height lebih longgar. Skala: 16 (teks), 20, 28, 40; kalimat temuan 28 di HP dan 40 di desktop. Lebar teks maksimal 68 karakter. Fallback: system-ui dan Georgia. Gunakan sentence case, tanpa huruf kapital semua.

**Tata letak.** Rata kiri, lebar konten maksimal 1080 px, satu kolom di HP. Urutan setiap halaman: kalimat temuan, grafik utama, kontrol filter, tabel atau detail, catatan sumber. Tanpa hero bergambar, tanpa gradien, tanpa deretan kartu seragam. Pemisah memakai ruang kosong dan satu garis tipis, bukan kotak berbayang.

```
Di SMA, anak dari keluarga termiskin hampir dua kali
lebih mungkin tidak sekolah            (kalimat temuan, serif)

[Wilayah] [Ekonomi] [Gender]                 Tahun: 2023

SD   o----o  +0,8 poin    (label langsung: Perkotaan, Perdesaan)
SMP  o--------o  +2,6 poin
SMA  o------------------o  +7,6 poin
     0%      10%      20%      30%

Catatan satu kalimat.   Sumber: BPS, Susenas 2023
```

**Menimpa Halaman 1.** Halaman Ringkasan dibuka dengan satu kalimat temuan terbesar (ekonomi di SMA) dan grafik dumbbell kuintil. Empat angka ringkasan tampil sebagai daftar perbandingan satu baris (nama perbandingan, dua nilai, selisih), bukan empat kartu angka besar.

### Interaksi dan UX

- Filter memakai segmented control untuk jenjang dan dimensi; dropdown hanya untuk tahun. Status filter disimpan di URL (mis. `?tab=ekonomi&tahun=2023&jenjang=SMA`) agar halaman bisa dibagikan dan tombol kembali berfungsi.
- Area sentuh minimal 44 px. Grafik harus terbaca di lebar 360 px. Tabel panjang scroll horizontal di dalam wadahnya, bukan di halaman.
- Saat filter berubah, grafik bergerak halus dari nilai lama ke baru (maksimal 300 ms). Tidak ada animasi masuk saat scroll dan tidak ada efek hover pada kartu.
- Tiga status wajib: memuat (kerangka abu), data belum tersedia (jelaskan alasannya, mis. provinsi baru), dan gagal memuat (jelaskan dan beri tombol Muat ulang).
- Istilah dijelaskan di tempat dipakai: Kuintil 1 = 20% keluarga dengan pengeluaran terendah.
- Setiap grafik punya judul kalimat, satuan, tahun, dan sumber. Tombol Unduh data (CSV) bersifat opsional jika waktu cukup.

### Aksesibilitas

- Kontras teks minimal 4,5:1. Warna biru kelabu hanya untuk elemen grafik, bukan teks.
- Arti tidak bergantung pada warna saja: titik kelompok tertinggal berbentuk persegi, pembanding berbentuk lingkaran, dan keduanya berlabel.
- Fokus keyboard terlihat. Tiap grafik punya aria-label berisi ringkasan temuan dan tabel data di bawahnya.
- Hormati prefers-reduced-motion.

### Bahasa antarmuka

Bahasa Indonesia sederhana, kalimat aktif, sentence case. Pakai istilah yang dikenal pembaca: anak tidak sekolah, bukan singkatan teknis. Tombol menyebut aksi: Lihat peringkat provinsi, Muat ulang. Istilah sama di semua halaman. Tanpa slogan pemasaran dan tanpa kalimat basa-basi. Nama halaman: Ringkasan, Kesenjangan, Provinsi (bukan Dashboard atau Analytics).

### Daftar larangan (ciri tampilan buatan AI)

- Gradien dekoratif, glassmorphism, bayangan halus di semua kartu, dan deretan kartu yang seragam.
- Ikon atau emoji di setiap judul dan kartu.
- Label huruf kapital berjarak di atas judul, penomoran 01, 02, 03 untuk hal yang bukan urutan, dan tanda panah di akhir setiap tombol.
- Animasi masuk fade dan slide-up pada setiap seksi.
- Palet ungu-biru bawaan, atau latar krem dengan aksen oranye tanah.
- Teks pengisi seperti Lorem ipsum atau slogan generik.
