# PRD: SETARA v2 — Penyusunan ulang alur dan tampilan

Dokumen ini melanjutkan `PRD SETARA.md`. Jika bertentangan, dokumen ini yang berlaku untuk tampilan, alur, dan struktur halaman. Ketentuan data, metrik, dan larangan mengarang angka di PRD lama tetap berlaku penuh.

## 1. Latar belakang

Esai sudah dikumpulkan dan lolos final. Babak final dipresentasikan dengan PowerPoint dan demo langsung website. Versi saat ini terasa tidak selaras karena:

1. **Setiap halaman bercerita dengan ukuran yang berbeda.** Ringkasan dan Kesenjangan memakai angka anak tidak sekolah 2019–2023. Provinsi pindah ke partisipasi PAUD 2023, indeks prioritas dari indikator 2025, dan tren partisipasi SMA, tanpa penjelasan peralihan.
2. **Halaman Provinsi tidak punya satu pesan utama.** Ada sembilan bagian yang setara bobotnya.
3. **Rekomendasi tersebar di empat tempat**, padahal di esai rekomendasi adalah puncak argumen (Bab 2.5).
4. **Sekitar 30 accordion "Apa makna…?"** yang isinya berulang.
5. **Gaya tidak konsisten.** Judul section ada yang serif dan ada yang sans. Hampir semua bagian dibungkus kotak putih yang sama. Banner gelap besar muncul di setiap halaman. Baris tombol aksi (salin, bagikan, CSV, sitasi, cetak, metode) muncul sebelum isi.

## 2. Tujuan

Setiap halaman menjawab **satu pertanyaan**, dan urutan halaman mengikuti alur argumen esai:

| Urutan | Halaman | Pertanyaan | Bab esai |
| --- | --- | --- | --- |
| 1 | Ringkasan | Siapa yang paling tertinggal? | 1.1, 2.3 |
| 2 | Kesenjangan | Seberapa jauh, dan di jenjang mana? | 2.3.1–2.3.4 |
| 3 | Provinsi | Di mana harus mulai lebih dahulu? | 2.1 (indeks), 2.3.5 |
| 4 | Rekomendasi (baru) | Apa yang harus dilakukan? | 2.5, 2.6 |
| 5 | Metode | Mengapa angka ini bisa dipercaya? | 2.4 |

Ukuran keberhasilan: juri bisa menjawab pertanyaan halaman dalam 5 detik pertama, dan demo 3 menit bisa berjalan dari halaman 1 ke 4 tanpa kembali ke atas atau mencari menu.

## 3. Batasan (wajib)

**3.1 Data tidak boleh berubah.** Berkas berikut dibekukan. `git diff` terhadap folder ini harus kosong di akhir pekerjaan:

- `public/data/*`
- `scripts/*`
- `src/lib/*` kecuali `src/lib/foto.js`. Fungsi di `src/lib` boleh **dipanggil** dari halaman baru, tetapi isinya tidak boleh diubah.
- Semua `*.test.js` di `src/lib`.

Teks statis baru (narasi rekomendasi, label alur) ditaruh di folder baru `src/content/`, bukan di `src/lib/`. Angka di teks statis **dilarang ditulis manual**. Angka selalu dihitung lewat fungsi yang sudah ada (`perbandingan`, `nasional`, `hitungPrioritas`, `nilaiTerbaru`, dan seterusnya).

**3.2 Tanpa dependensi baru.** Tailwind, Recharts, dan React Router sudah cukup. Tidak ada interaksi gestur (drag, swipe), jadi tidak perlu library spring. Transisi CSS cukup.

**3.3 Tautan lama tetap berfungsi.** Parameter URL (`tab`, `tahun`, `jenjang`) dan rute `/`, `/kesenjangan`, `/provinsi`, `/provinsi/:kode`, `/metode` tidak berubah. Rute baru hanya ditambah.

**3.4 Versi esai disimpan.** Sebelum perubahan pertama, beri tag commit terakhir sebagai `versi-esai` dan catat URL deployment Vercel-nya. Versi ini dipakai jika juri ingin membandingkan dengan Gambar 1–4 di esai.

**3.5 Pekerjaan bertahap.** Setiap fase (bagian 11) harus selesai dalam keadaan bisa di-deploy, sehingga jika waktu habis versi yang ada tetap utuh.

## 4. Prinsip desain

Diturunkan dari prinsip desain Apple (*Principles of Great Design*, *Designing Fluid Interfaces*) dan disesuaikan dengan konteks juri yang bukan ahli statistika dan sering membuka dari HP.

1. **Tujuan: putuskan apa yang tidak ditampilkan.** Setiap bagian harus menjawab pertanyaan halamannya. Bagian yang tidak menjawab dipindah ke halaman lain atau disimpan satu tingkat lebih dalam.
2. **Sederhana, bukan minimalis.** Jalur umum ditampilkan lebih dahulu dan analisis lanjutan satu klik lebih dalam. Hierarki dibangun dengan urutan, jarak, dan kontras, bukan dengan kotak.
3. **Konsisten (familiarity).** Komponen yang terlihat sama harus berperilaku sama dan berada di tempat yang sama di setiap halaman: judul temuan, grafik utama, kontrol, detail, satu "Cara membaca", sumber, lalu langkah berikutnya.
4. **Penunjuk arah (wayfinding).** Setiap layar menjawab empat hal: saya di mana, bisa ke mana, ada apa di sana, dan bagaimana kembali. Karena itu ada penanda alur 1–4 dan tautan "Langkah berikutnya" di akhir halaman cerita.
5. **Respons instan.** Umpan balik muncul saat ditekan (`:active`), bukan setelah dilepas. Tidak ada jeda buatan.
6. **Gerak yang tenang.** Gerak selalu redam kritis, tanpa pantulan. Animasi dimulai dari nilai yang sedang tampil, jalurnya simetris (muncul dan hilang dari arah yang sama), dan bisa diinterupsi. Animasi saat scroll tetap dilarang.
7. **Tipografi menurut ukuran.** Huruf besar memakai tracking negatif dan leading rapat. Teks badan memakai leading longgar. Semua ukuran memakai `rem` agar `FontSizeControl` tetap bekerja.
8. **Kerajinan (craft).** Setiap jarak dan ukuran dipilih dari skala yang ditentukan (bagian 7), tidak sembarang.

Daftar larangan di PRD lama (bagian 12) tetap berlaku.

## 5. Arsitektur informasi

### 5.1 Navigasi

- Urutan: **Ringkasan · Kesenjangan · Provinsi · Rekomendasi · Metode**. "Ringkasan" ditambahkan sebagai item tersendiri. Logo SETARA tetap menuju `/`.
- Header menempel di atas saat scroll (`position: sticky`). Lapisannya tembus pandang fungsional: `background: rgb(255 255 255 / 0.85)` dan `backdrop-filter: blur(12px)`. Saat konten mulai tertutup header, garis bawah 1px muncul. Ini **satu-satunya** permukaan tembus pandang di aplikasi dan bukan dekorasi.
  - Pada `prefers-reduced-transparency: reduce`, latar header putih solid tanpa blur.
- Di HP (lebar 360 px), deretan menu bisa digeser horizontal di dalam header (`overflow-x: auto`, tanpa scrollbar terlihat), dan item aktif otomatis tergulir ke area terlihat. `FontSizeControl` dipindah ke footer pada layar `< md`.
- Item aktif ditandai dengan teks tebal dan garis bawah 2px berwarna tinta. Area sentuh minimal 44 px.

### 5.2 Penanda alur (komponen `AlurCerita`)

Satu baris kecil di atas judul halaman 1–4:

```
1 Siapa tertinggal   2 Seberapa jauh   3 Di mana dulu   4 Apa tindakannya
```

- Langkah aktif bertinta penuh, langkah lain tinta redup. Setiap langkah adalah tautan.
- Tidak tampil di Metode dan profil provinsi, karena keduanya bukan bagian alur utama.
- Di HP cukup tampilkan langkah aktif dan jumlahnya, misalnya "Langkah 2 dari 4 · Seberapa jauh".
- Ini urutan yang sebenarnya, sehingga penomoran tidak melanggar larangan penomoran dekoratif.

### 5.3 Langkah berikutnya (komponen `LangkahBerikutnya`)

Di akhir halaman 1–3 ada satu blok tautan ke halaman berikutnya. Isinya berupa pertanyaan halaman tujuan beserta satu kalimat tentang isinya. Contoh: "Seberapa jauh jaraknya? Lihat selisih desa-kota, kaya-miskin, dan laki-laki-perempuan per jenjang." Filter yang aktif (`tahun`, `jenjang`) ikut terbawa di URL.

## 6. Template halaman dan komponen bersama

Semua halaman memakai urutan berikut. Bagian yang tidak relevan boleh dilewati, tetapi urutannya tidak boleh ditukar.

```
[AlurCerita]
[KepalaHalaman]   judul temuan (serif) + 1 kalimat konteks (+ foto opsional)
[Kontrol]         segmented control / tab / tahun
[Grafik utama]    satu-satunya permukaan putih yang menonjol
[CaraMembaca]     satu per halaman, terbuka/tertutup
[Detail]          tabel, metrik, daftar — di atas latar kertas, dipisah garis
[Lanjutan]        analisis tambahan dalam <details> "Analisis lanjutan"
[Sumber]          satuan, tahun, sumber BPS
[AksiData]        satu tombol menu "Bagikan dan unduh"
[LangkahBerikutnya]
```

### 6.1 `KepalaHalaman` (menggantikan `HeroBanner` kecuali di Ringkasan)

- Props: `judul` (kalimat temuan, dihitung dari data), `konteks` (1 kalimat), `gambar` dan `alt` (opsional).
- Tanpa gambar: hanya teks, rata kiri, lebar teks maksimal 30ch untuk judul dan 64ch untuk konteks.
- Dengan gambar (Kesenjangan per jenjang, profil provinsi termasuk foto Papua): di `md+` dua kolom (teks 7/12, foto 5/12), dan di HP foto ada di bawah teks dengan rasio 16:9 dan tinggi maksimal 180 px. Foto tidak diberi lapisan gelap, dan sudutnya membulat 8 px.
- `HeroBanner` hanya dipakai di Ringkasan, dengan tinggi 220 px di HP dan 300 px di desktop. Lapisan gelapnya diturunkan dari 75% ke 55% (`bg-tinta/55`) supaya foto terlihat. Kontras teks putih tetap minimal 4,5:1, dan nilai lapisan perlu diperiksa ulang jika foto diganti.

### 6.2 `CaraMembaca` (menggantikan `Accordion` "Apa makna…?")

- **Maksimal satu per halaman**, diletakkan langsung di bawah grafik utama.
- Judul tetap: "Cara membaca grafik ini". Isinya maksimal tiga kalimat:
  1. Apa yang diukur.
  2. Apa arti panjang/posisi.
  3. Satu peringatan (survei sampel, bukan sebab-akibat).
- Istilah teknis dijelaskan langsung di tempat dipakai sebagai teks kecil satu baris, misalnya "Kuintil 1 = 20% keluarga dengan pengeluaran terendah". Penjelasan istilah tidak disimpan di accordion.
- Semua accordion lain dihapus. Isinya dipadatkan ke kalimat bantu atau dipindah ke Metode (bagian 10).
- Tetap memakai `<details>`/`<summary>`. Ikon chevron berputar 0°→90° dalam 150 ms. Isi muncul dengan transisi opacity, bukan tinggi.

### 6.3 `AksiData` (menggantikan baris 5–6 tombol)

- Satu tombol "Bagikan dan unduh" di bawah bagian Sumber. Saat ditekan, muncul popover berisi: Salin temuan, Bagikan tautan, Unduh CSV, Salin sitasi, Cetak / PDF.
- Popover muncul dari tombolnya (`transform-origin` di tombol) dengan opacity 0→1 dan scale 0,96→1 dalam 150 ms. Saat ditutup, jalurnya sama tetapi terbalik.
- Popover tertutup dengan Esc, klik di luar, atau setelah aksi dipilih. Fokus kembali ke tombol. Pesan hasil ("Tautan disalin.") tampil di `aria-live="polite"` dan hilang setelah 3 detik.
- Fungsi aksi yang sudah ada (`downloadCsv`, `copyText`, `buatSitasi`, `cetak`) dipanggil apa adanya tanpa diubah.

### 6.4 `Sumber`

Satu baris teks 14 px tinta redup: "Satuan: persen. Selisih dalam poin persentase. Sumber: BPS, Susenas {tahun}." Komponen yang sama dipakai di semua grafik.

### 6.5 Permukaan dan pemisah

- Latar putih bergaris hanya untuk **grafik utama** dan **tabel utama**.
- Bagian lain ada langsung di atas latar kertas. Antarbagian dipisah dengan jarak 48 px (`mt-12`) dan satu garis 1px `garis` di atas judul section.
- Kartu bertumpuk seragam dilarang. Daftar temuan memakai baris dengan pemisah garis, bukan kartu-kartu.

## 7. Sistem visual

### 7.1 Warna

Token di `src/index.css` tidak berubah. Arti warna tetap: merah bata untuk kelompok tertinggal, biru kelabu untuk pembanding (hanya di grafik). Satu token baru: `--color-fokus: #18212c` untuk cincin fokus 2px dengan offset 2px.

### 7.2 Tipografi

| Peran | Font | Ukuran HP / desktop | Leading | Tracking | Berat |
| --- | --- | --- | --- | --- | --- |
| Judul temuan (h1) | Source Serif 4 | 1,75rem / 2,5rem | 1,15 | −0,015em | 600 |
| Judul section (h2) | Public Sans | 1,25rem | 1,3 | −0,01em | 600 |
| Subjudul (h3) | Public Sans | 1rem | 1,4 | 0 | 600 |
| Badan | Public Sans | 1rem | 1,6 | 0 | 400 |
| Bantu / sumber | Public Sans | 0,875rem | 1,5 | 0,005em | 400 |
| Label grafik | Public Sans | 0,8125rem | 1,3 | 0,01em | 500 |

- **Semua judul section memakai h2 sans** (saat ini campur serif dan sans). Serif hanya untuk h1 temuan dan kalimat temuan besar di Ringkasan.
- `text-xs` (12 px) tidak boleh dipakai untuk teks yang harus dibaca. Ukuran minimalnya 13 px untuk label grafik.
- `uppercase tracking-wide` dihapus di semua tempat, karena melanggar larangan PRD lama.
- Angka tetap memakai `tabular-nums`. Panjang baris teks badan maksimal 68ch.

### 7.3 Jarak

Skala: 4, 8, 12, 16, 24, 32, 48, 64 px. Jarak antarbagian 48 px, judul ke isi 12 px, kontrol ke grafik 16 px. Ukuran tinggi tetap dalam px (`min-h-[280px]`) diganti dengan `rem`.

### 7.4 Gerak

| Kejadian | Gerak | Durasi |
| --- | --- | --- |
| Tombol/tab ditekan | `scale(0.98)` saat `:active` | 100 ms, ease-out |
| Ganti filter (dumbbell, garis) | Nilai bergerak dari posisi yang sedang tampil | ≤ 300 ms, ease-out, tanpa overshoot |
| Popover `AksiData` | opacity dan scale dari tombol, keluar lewat jalur sama | 150 ms |
| `CaraMembaca` | chevron berputar, isi fade | 150 ms |
| Ganti halaman | tidak ada animasi | — |

- Jika filter diganti saat animasi masih berjalan, animasi baru dimulai dari posisi yang tampil saat itu, bukan dari posisi awal atau akhir. Perilaku ini perlu dicek di `Dumbbell.jsx` dan `DotPlotProvinsi.jsx`.
- Pada `prefers-reduced-motion`, aturan yang sudah ada di `index.css` dipertahankan: perpindahan posisi langsung, dan hanya opacity yang boleh berubah.

## 8. Spesifikasi per halaman

### 8.1 Ringkasan — "Siapa yang paling tertinggal?"

Urutan baru:

1. `HeroBanner` ramping: "SETARA" dan satu kalimat deskripsi beserta kepanjangan SETARA.
2. `AlurCerita` (langkah 1).
3. **Kalimat temuan utama** (serif besar), dihitung dari `kalimatRingkasanUtama`. Bagian ini dinaikkan ke atas tombol-tombol.
4. Kontrol: jenjang (segmented) dan tahun.
5. **Grafik utama: dumbbell tiga dimensi untuk jenjang terpilih**, berupa tiga baris (wilayah, ekonomi, gender), masing-masing dua titik dan selisihnya. Komponen `Dumbbell` yang sudah ada dipakai ulang. Bagian ini menggantikan "Empat angka ringkasan" sebagai visual. `StatRow` tetap ada sebagai tabel data di bawah grafik untuk aksesibilitas.
6. `CaraMembaca`.
7. **Tiga temuan utama** sebagai daftar baris (bukan kartu). Setiap baris berisi kalimat temuan dan tautan "Lihat di Kesenjangan" dengan parameter yang sesuai.
8. **Perkiraan jumlah anak**, dalam satu bagian ringkas. Label "Perkiraan, bukan sensus" ditaruh di dekat angka. Penjelasan metode cukup satu kalimat beserta tautan ke `/metode#rumus`.
9. `Sumber`, `AksiData`, dan `LangkahBerikutnya` menuju Kesenjangan.

Yang dihapus dari Ringkasan: dua tombol CTA di atas (diganti `LangkahBerikutnya`) dan tiga accordion.

### 8.2 Kesenjangan — "Seberapa jauh, dan di jenjang mana?"

1. `AlurCerita` (langkah 2).
2. `KepalaHalaman`: judul temuan dari data dan foto jenjang (opsional).
3. Kontrol dalam satu baris: tab dimensi (Wilayah, Ekonomi, Gender), segmented jenjang (Umum, SD, SMP, SMA), dan dropdown tahun. Di HP, kontrol menempel di bawah header saat menggulir melewati grafik, supaya pengguna bisa berganti tab tanpa kembali ke atas.
4. **Grafik utama: dumbbell per jenjang** di permukaan putih.
5. `CaraMembaca`, termasuk satu kalimat tentang perbedaan selisih dan rasio (contoh SD 3,5× vs SMA 1,4×, dihitung dari data).
6. **Tabel metrik** (selisih dan rasio per jenjang) di permukaan putih.
7. **Tren 2019–2023** di atas latar kertas, dengan judul kalimat yang menyebut arah tren.
8. **Analisis lanjutan** (`<details>`): `KonteksNasional`.
9. **Apa yang bisa dilakukan**: maksimal dua solusi teratas dari `SOLUSI_MATRIX` untuk dimensi dan jenjang terpilih, masing-masing satu kalimat, dengan tautan "Lihat semua rekomendasi" ke `/rekomendasi#{dimensi}`. Daftar solusi lengkap dan referensi dipindah ke Rekomendasi.
10. `Sumber`, `AksiData`, dan `LangkahBerikutnya` menuju Provinsi.

Yang dipindah: "Kaitan tujuan pembangunan berkelanjutan" ke Rekomendasi (8.4), accordion kategori jenjang ke kalimat bantu di bawah segmented control, dan baris tombol aksi ke `AksiData`.

### 8.3 Provinsi — "Di mana harus mulai lebih dahulu?"

Pesan utama halaman ini adalah **indeks prioritas**, bukan peringkat PAUD.

1. `AlurCerita` (langkah 3).
2. `KepalaHalaman`. Judulnya dihitung dari `hitungPrioritas`, misalnya "{Provinsi peringkat 1}, {2}, dan {3} paling perlu diprioritaskan". Konteksnya: "Indeks menggabungkan enam indikator: partisipasi SMA, PAUD, lama sekolah, kemiskinan, IPM, dan ketimpangan gender."
3. **Peralihan ukuran (wajib).** Satu kalimat di bawah kepala halaman: "Halaman sebelumnya memakai angka anak tidak sekolah. Halaman ini memakai indikator provinsi terbaru dari BPS (2023–2025), karena angka anak tidak sekolah tidak tersedia per provinsi." Kalimat ini menjawab penyebab utama kesan tidak selaras.
4. **Grafik utama: indeks prioritas**, berupa batang horizontal skor 0–100 untuk semua provinsi. Sepuluh teratas tampil, dan sisanya dibuka dengan "Tampilkan semua provinsi". Lima teratas berwarna merah bata, sisanya biru kelabu. Setiap baris menjadi tautan ke profil provinsi. Kolom kecil "tahun data per indikator" tampil di bawah grafik.
5. `CaraMembaca`: skor tinggi berarti lebih perlu diprioritaskan, bobot setiap indikator sama, dan skor ini bukan vonis kinerja.
6. **Matriks prioritas** (`PriorityMatrix`): judulnya "Tertinggal dan memburuk, atau tertinggal tetapi membaik?", disertai satu kalimat yang menyebut jumlah provinsi di kategori Mendesak.
7. **Peringkat per indikator** dengan segmented control:
   - "PAUD satu tahun sebelum SD": `DotPlotProvinsi` beserta filter tahun 2015–2023, kotak cari, tombol urut, dan tabel selisih dari nasional. Catatan sumbu yang mulai dari 50 tetap ditampilkan.
   - Indikator lain boleh ditambah nanti, bukan wajib.
8. **Analisis lanjutan** (`<details>`): `BandingProvinsi` dan "Provinsi paling berubah".
9. `Sumber`, `AksiData`, dan `LangkahBerikutnya` menuju Rekomendasi.

Yang dipindah: "Rekomendasi kontekstual" (provinsi terendah) dan "Rekomendasi keputusan" (`SolusiBlock` dan konstanta `REKOMENDASI`) ke halaman Rekomendasi. Filter tahun tidak lagi tampil di atas halaman, tetapi hanya di dalam tab PAUD, karena tahun hanya berlaku untuk indikator itu.

### 8.4 Rekomendasi (baru, `/rekomendasi`) — "Apa yang harus dilakukan?"

Halaman ini menjadi puncak alur dan cerminan Bab 2.5 serta Tabel 2 di esai.

1. `AlurCerita` (langkah 4).
2. `KepalaHalaman`: "Lima langkah untuk menutup kesenjangan, dimulai dari kelompok dan daerah yang paling tertinggal."
3. **Lima rekomendasi**. Setiap rekomendasi punya `id` jangkar (`#ekonomi`, `#transisi`, `#wilayah`, `#paud`, `#gender`) dan berisi:
   - **Sasaran** (satu kata).
   - **Temuan**: satu kalimat dengan angka yang **dihitung live** dari data lewat fungsi `src/lib` (tahun terbaru), bukan disalin dari esai.
   - **Intervensi**: satu sampai dua kalimat.
   - **Rujukan**: dari `refs()` di `solusi.js`, sebagai tautan DOI.
   - **Lihat datanya**: tautan ke halaman dan filter tempat temuan itu muncul.

   | id | Sasaran | Temuan (dihitung) | Intervensi | Rujukan |
   | --- | --- | --- | --- | --- |
   | ekonomi | Keluarga termiskin | K1 vs K5 di SMA | Perluas dan pertajam PKH di jenjang menengah | cahyadi2020, hudang2024, caniago2021 |
   | transisi | Transisi jenjang | Nasional SD → SMP → SMA | BOS dan beasiswa pada transisi SMP–SMA | petrosino2012, sugiharti2017, sulistyaningrum2016 |
   | wilayah | Anak di perdesaan | Desa vs kota di SMA | Perluas sekolah menengah di perdesaan | duflo2001, petrosino2012 |
   | paud | Daerah tertinggal | Provinsi PAUD terendah vs nasional | Perluas PAUD dan pembelajaran jarak jauh | brinkman2017, pratiwi2021 |
   | gender | Anak laki-laki jenjang menengah | L vs P di SMP dan SMA | Dukungan tertarget anak laki-laki | himaz2021, asadullah2018 |

   Untuk gender, jika data tahun terpilih menunjukkan perempuan yang lebih tertinggal, kalimat temuan dan sasaran ikut berubah mengikuti data.

4. **Mulai dari mana?**: lima provinsi teratas dari `hitungPrioritas`, masing-masing dengan rekomendasi kontekstual teratas dari `rekomendasiProvinsi` dan tautan ke profilnya. Bagian ini menggantikan "Rekomendasi kontekstual" yang sebelumnya ada di Provinsi.
5. **Kaitan dengan SDGs 4 dan 10**: dipindah dari Kesenjangan, berisi maksimal tiga poin. Catatannya tetap: "relevansi, bukan pengukuran resmi target SDG".
6. **Batas rekomendasi**: satu paragraf yang menyatakan bahwa rekomendasi ini bukan resep tunggal, bahwa urutan intervensi perlu disesuaikan per daerah, dan bahwa hubungan temuan dengan solusi bersifat indikatif.
7. `Sumber` dan `AksiData`. Tidak ada `LangkahBerikutnya`. Sebagai gantinya ada tautan "Lihat metode dan keterbatasan".

Teks naratif (sasaran, intervensi, urutan) ditaruh di `src/content/rekomendasi.js`. Teks ini tidak boleh memuat angka.

### 8.5 Profil provinsi (`/provinsi/:kode`)

- `KepalaHalaman` dengan nama provinsi dan foto (Papua memakai `foto-papua.jpg`, perubahan yang belum di-commit dimasukkan di Fase 0). Ditambah satu kalimat posisi: "Peringkat {n} dari {N} pada indeks prioritas."
- Tiga angka utama tetap ada, tetapi memakai gaya angka besar serif yang sama dengan Ringkasan, bukan kotak terpisah.
- Urutan: tren, perkiraan jumlah anak PAUD, konteks provinsi, rekomendasi kontekstual (tetap di sini karena khusus provinsi), lalu tautan "Kembali ke peringkat" dan "Provinsi lain".
- Bagian "Makna catatan" dihapus. Isinya dipindah ke Metode.
- Remah navigasi di atas: "Provinsi / {nama}".

### 8.6 Metode — "Mengapa angka ini bisa dipercaya?"

- `KepalaHalaman` tanpa foto.
- Daftar isi berupa tautan jangkar yang menempel di samping (desktop) atau di atas (HP).
- Urutan baru: **Sumber dan pembaruan, Indikator, Istilah, Rumus dan asumsi, Keterbatasan, Daftar pustaka, Sitasi.** Daftar pustaka dipindah dari urutan pertama ke hampir terakhir.
- Isi accordion yang dihapus dari halaman lain dikumpulkan di sini, di bawah "Istilah" dan "Keterbatasan".
- Di "Rumus dan asumsi" ditambahkan catatan untuk estimasi kuintil: "Asumsi 20% anak per kuintil kemungkinan membuat estimasi lebih rendah dari kenyataan (batas bawah), karena keluarga berpengeluaran rendah cenderung memiliki lebih banyak anak." Ini teks saja, rumusnya tidak berubah.

## 9. Aksesibilitas

- Kontras teks ≥ 4,5:1, termasuk teks putih di atas foto hero. Fokus keyboard memakai cincin 2px dengan offset.
- Bentuk dan label di grafik tetap ada: persegi untuk kelompok tertinggal dan lingkaran untuk pembanding.
- Setiap grafik punya `aria-label` berisi kalimat temuan, dan tabel data di bawahnya.
- Popover `AksiData` bisa dioperasikan dengan keyboard (Enter/Space membuka, panah berpindah, Esc menutup).
- `AlurCerita` memakai `<nav aria-label="Alur cerita">` dan `aria-current="step"`.
- Dukung `prefers-reduced-motion`, `prefers-reduced-transparency`, dan `prefers-contrast: more`. Pada pilihan kontras tinggi, garis `garis` menjadi tinta redup.
- Ukuran teks dari `FontSizeControl` (diperbesar sampai 125%) tidak boleh membuat tata letak rusak di 360 px.

## 10. Daftar pemindahan

| Elemen sekarang | Lokasi sekarang | Nasib |
| --- | --- | --- |
| `HeroBanner` | Semua halaman | Hanya Ringkasan, diperkecil. Halaman lain memakai `KepalaHalaman` |
| Baris tombol aksi | Kesenjangan, Provinsi | `AksiData` di bawah Sumber |
| Accordion "Apa makna…?" (±30) | Semua halaman | 1 `CaraMembaca` per halaman. Sisanya menjadi kalimat bantu atau dipindah ke Metode |
| Dua CTA di Ringkasan | Ringkasan atas | `LangkahBerikutnya` di bawah |
| Kartu "Tiga temuan utama" | Ringkasan | Daftar baris |
| Solusi berbasis studi lengkap | Kesenjangan | Rekomendasi. Kesenjangan menyisakan 2 butir dan tautan |
| Kaitan SDGs | Kesenjangan | Rekomendasi |
| `KonteksNasional` | Kesenjangan | "Analisis lanjutan" di Kesenjangan |
| Peringkat PAUD sebagai pembuka | Provinsi | Tab "Peringkat per indikator" |
| `BandingProvinsi`, provinsi paling berubah | Provinsi | "Analisis lanjutan" di Provinsi |
| Rekomendasi kontekstual dan Rekomendasi keputusan | Provinsi | Rekomendasi |
| "Makna catatan" | Profil provinsi | Metode |
| Daftar pustaka sebagai pembuka | Metode | Setelah Keterbatasan |

## 11. Urutan kerja

Setiap fase diakhiri dengan `npm run lint`, `npm test`, `npm run build`, dan pemeriksaan `git diff --stat -- src/lib public/data scripts` (harus kosong kecuali `src/lib/foto.js`).

- **Fase 0, persiapan.** Commit perubahan foto Papua. Beri tag `versi-esai` pada commit sebelum perubahan v2 dan catat URL deployment-nya. Ambil screenshot "sebelum" setiap halaman di lebar 390 px dan 1280 px untuk slide.
- **Fase 1, sistem.** Token tipografi dan jarak di `index.css`. Komponen `KepalaHalaman`, `AlurCerita`, `CaraMembaca`, `AksiData`, `Sumber`, `LangkahBerikutnya`. Nav sticky dengan item Ringkasan dan Rekomendasi. Rute `/rekomendasi` sementara berisi kerangka.
- **Fase 2, Ringkasan dan Kesenjangan.** Terapkan template dan daftar pemindahan.
- **Fase 3, Provinsi dan Rekomendasi.** Indeks sebagai grafik utama, kalimat peralihan ukuran, dan halaman Rekomendasi lengkap.
- **Fase 4, Profil provinsi dan Metode.**
- **Fase 5, QA dan rilis.** Uji di 360 px, 390 px, dan 1280 px. Uji keyboard. Uji reduced motion. Bandingkan angka di setiap halaman dengan versi `versi-esai` (harus identik untuk filter yang sama). Deploy, lalu ambil screenshot "sesudah" untuk slide.

Jika waktu terbatas, fase 0–3 adalah inti. Fase 4 boleh menyusul.

## 12. Pengujian

- Test di `src/lib` tidak diubah dan harus tetap lulus.
- `src/App.test.jsx` diperbarui:
  - Smoke test untuk `/rekomendasi`: menampilkan lima rekomendasi beserta angka yang berasal dari data.
  - Nav memuat lima item.
  - Ringkasan masih menampilkan kalimat temuan dan filter.
  - Provinsi menampilkan indeks prioritas sebagai judul utama dan kotak cari masih ada di tab PAUD.
- Test baru untuk `AksiData`: popover terbuka, Esc menutup, dan fokus kembali ke tombol.

## 13. Definisi selesai

- Lima halaman ditambah profil provinsi berjalan di URL publik. Tautan lama dengan parameter tetap berfungsi.
- Setiap halaman cerita punya `AlurCerita`, satu judul temuan, satu grafik utama, satu `CaraMembaca`, `Sumber`, dan `LangkahBerikutnya` (kecuali Rekomendasi).
- Tidak ada `HeroBanner` selain di Ringkasan, tidak ada `uppercase tracking-wide`, dan tidak ada teks badan 12 px.
- Folder data dan logika tidak berubah. Angka identik dengan `versi-esai`.
- Lint, test, dan build lulus.
- Tampilan terbaca di 360 px tanpa scroll horizontal halaman.

## 14. Untuk presentasi

- **Slide disclaimer (satu kalimat):** "Setelah esai dikumpulkan, tampilan SETARA disusun ulang agar setiap halaman menjawab satu pertanyaan: siapa tertinggal, seberapa jauh, di mana dulu, dan apa tindakannya. Data dan perhitungannya tidak berubah."
- Satu slide "sebelum dan sesudah" dari screenshot Fase 0 dan Fase 5.
- Urutan demo mengikuti `AlurCerita` 1 sampai 4, lalu Metode jika ada pertanyaan tentang keandalan data.
- Siapkan tautan versi `versi-esai` jika juri ingin mencocokkan dengan Gambar 1–4 di esai.

## 15. Pertanyaan terbuka

- Tanggal presentasi final, untuk menentukan apakah fase 4 ikut dikerjakan.
- Apakah URL utama langsung memakai v2, atau v2 di-deploy ke URL preview dulu sampai lolos QA.

## 16. Tambahan: Fase 2, fondasi visual bersama

Status: draf, menunggu persetujuan (15 November 2026)
Asal: penilaian UI/UX tanggal 14 November 2026. Nilai gambar 5,5/10, grafik 6,5/10.
Prinsip: Fase 2 hanya mengubah **komponen bersama dan aset gambar**. Susunan halaman tetap dikerjakan di Fase 3–5. Angka, data, dan logika tidak berubah.

### 16.1 Hero (`HeroBanner`)

Bagian ini menggantikan aturan "lapisan gelap rata 55%" di bagian 6.1.

- **Masalah:** lapisan `bg-tinta/75` rata menutupi seluruh foto, sehingga foto siswa terlihat kusam dan muram.
- **Perubahan:** pakai gradasi yang hanya menggelapkan area teks:
  - HP: dari bawah ke atas, `tinta/85` → `tinta/55` di tengah → `tinta/10` di atas.
  - Desktop: ditambah gradasi dari kiri, karena teks rata kiri.
  - Sisi kanan atas foto tetap hampir asli.
- **Syarat kontras:** teks putih di atas hero minimal 4,5:1 di titik terterang di belakang teks. Ini diukur otomatis lewat Playwright dengan mengambil sampel piksel di bawah kotak judul dan deskripsi.
- **Gambar:** atribut `width` dan `height` ditambahkan agar tata letak tidak bergeser, dengan `decoding="async"` dan `fetchpriority="high"`.

### 16.2 Gambar

| Tempat | Sekarang | Menjadi |
|---|---|---|
| Hero halaman Provinsi | `foto-provinsi.svg` (bentuk bulat abstrak, terlihat seperti placeholder) | Foto asli. Usulan: `foto-papua.jpg`, karena Papua adalah provinsi yang paling tertinggal di halaman ini. Bisa diganti kalau pengguna memberi foto lain |
| Profil provinsi selain Papua | `foto-provinsi.svg` | `foto-umum.jpeg` |
| Hero halaman Metode | `foto-data.svg` | `KepalaHalaman` tanpa foto, sesuai 8.6 (dimajukan dari Fase 5 karena hanya mengganti komponen kepala) |
| `foto-sd.png` | 1,3 MB | Dikompres menjadi JPEG berlebar maksimal 1600 px, sekitar 150–250 KB. Rujukan diperbarui di `src/lib/foto.js` (pengecualian yang diizinkan) |

Berkas SVG placeholder yang tidak dipakai lagi dihapus dari `public/images`.

### 16.3 Grafik

**a. Warna tren SD, SMP, SMA (`TrenMultiGaris` di Kesenjangan)**
- **Sekarang:** SD merah `#C2372D`, SMP `#6F8CAB`, SMA `#5A6676`.
  - Hasil validator: SMP dan SMA gagal batas beda warna untuk mata normal (ΔE 12,7, batasnya 15).
  - Merah untuk SD juga bentrok dengan arti merah di SETARA, yaitu kelompok tertinggal.
- **Menjadi:** satu warna biru dari terang ke gelap, karena jenjang punya urutan:
  - SD `#5C8DC9`, SMP `#2E5F9E`, SMA `#18324F`.
  - Validator: beda warna untuk buta warna ≥ 15,1 dan untuk mata normal ≥ 15,1, kontras ketiganya ≥ 3:1 di latar putih.
- **Penanda kedua**, supaya identitas garis tidak hanya bergantung pada warna:
  - pola garis berbeda: SD putus-putus `6 4`, SMP putus pendek `2 3`, SMA utuh
  - label langsung di ujung kanan setiap garis
  - legenda tetap ada
- Merah tetap khusus untuk kelompok tertinggal (dumbbell, peringkat provinsi).

**b. Angka sumbu bulat**
- Fungsi bersama `skalaRapi(maks)` di `src/components/skala.js` (`src/lib` tidak disentuh). Fungsi ini mengembalikan batas atas dan 4–6 angka sumbu dengan langkah 1, 2, 2,5, atau 5 × 10ⁿ.
- Contoh: maksimal 26,06 → 0, 10, 20, 30. Maksimal 15 → 0, 5, 10, 15. Maksimal 79 → 0, 20, 40, 60, 80.
- Dipakai di `Dumbbell`, `TrenGaris`, `TrenMultiGaris`, dan `ProvinsiTrend`.
  - Sekarang Dumbbell menampilkan 0, 8, 15, 23, 30, TrenMultiGaris 0, 4, 8, 12, 15, dan ProvinsiTrend berpuncak 85.

**c. Lapisan sorot di grafik garis**
- `TrenGaris`, `TrenMultiGaris`, dan `ProvinsiTrend` mendapat garis bantu vertikal dan tooltip saat disorot kursor atau disentuh.
- Isinya tahun dan nilai setiap garis, dengan teks berwarna tinta. Warna garis hanya dipakai pada penanda kecil di samping nama.
- Tabel data di bawah grafik tetap ada.

**d. Ketebalan:** garis 2 px dan penanda 8 px, sesuai spesifikasi grafik. Garis sekarang setebal 2,5 px.

### 16.4 Navigasi HP

- **Sekarang:** menu bisa digeser, tetapi tepi pudarnya selalu ada di kedua sisi, termasuk saat menu masih di ujung kiri. Akibatnya "Ringkasan" ikut pudar, dan "Rekomendasi" terpotong tanpa petunjuk yang jelas.
- **Menjadi:** tepi pudar hanya muncul di sisi yang masih punya menu tersembunyi. Polanya sama dengan efek tepi gulir (`data-kiri`, `data-kanan` diperbarui saat menu digeser). Item aktif tetap digulir ke tengah.

### 16.5 Footer di halaman pendek

Pada halaman yang isinya pendek, misalnya "Provinsi tidak ditemukan", footer melayang di tengah layar. Pembungkus aplikasi dibuat `flex min-h-dvh flex-col` dan footer `mt-auto`, supaya footer selalu menempel di bawah layar.

### 16.6 Di luar cakupan Fase 2

- Susunan isi tiap halaman: `KepalaHalaman` di semua halaman, `CaraMembaca`, `AksiData`, dan grafik utama baru. Ini dikerjakan di Fase 3–5.
- Foto untuk halaman Rekomendasi (Fase 4).

### 16.7 Tes dan selesai bila

1. Tes unit `skalaRapi`: contoh di 16.3b dan kasus 0, nilai sangat kecil, serta maksimal tepat bulat.
2. Tes `TrenMultiGaris`: setiap garis punya pola dan label langsung.
3. Pengukuran kontras hero di HP 390 px dan desktop 1280 px untuk Ringkasan, Kesenjangan, Provinsi, dan profil provinsi: semuanya ≥ 4,5:1.
4. Validator palet lolos untuk biru SD, SMP, SMA (beda warna dan kontras).
5. Screenshot sebelum dan sesudah di 390 px dan 1280 px.
6. Lint, tes, dan build lolos. `src/lib` (kecuali `foto.js`), `public/data`, dan `scripts` tidak berubah. Angka di semua halaman sama.

### 16.8 Pertanyaan terbuka

- Foto hero halaman Provinsi: pakai ulang `foto-papua.jpg`, atau pengguna memberi foto baru?
