# PRD: Pangkas teks SETARA

Status: selesai (18 November 2026), disetujui pengguna ("setuju, pakai saran"), belum di-commit
Cabang: `v2-tampilan`
Terkait: `PRD SETARA v2.md`, `PRD Fase 8 SETARA.md`

## 1. Latar

Pengguna menilai SETARA terlalu banyak tulisan. Pada 18 November 2026, kata yang terlihat dihitung di HP 390 px. Bagian yang masih terlipat ("Cara membaca grafik ini", tabel) tidak ikut dihitung.

| Halaman | Kata | Panjang (layar HP) | Penilaian |
|---|---|---|---|
| Ringkasan | 272 | 3,8 | Pas |
| Kesenjangan | 342 | 4,8 | Pas, tidak diubah |
| Profil provinsi | 451 | 5,1 | Agak panjang |
| **Rekomendasi** | **770** | **7,1** | **Terlalu banyak** |
| **Provinsi** | **888** | **9,4** | **Terlalu banyak** |
| Metode | 1.914 | 13,9 | Wajar untuk halaman rujukan, tidak diubah |
| Kartu panduan | 90 (ikhtisar), sekitar 60 per langkah tur | – | Bisa dipangkas setengahnya |

Provinsi dan Rekomendasi adalah dua halaman terpenting saat demo, tetapi juri harus menggulir 7–9 layar. Sebagian besar teks di sana mengulang yang sudah ditunjukkan grafik.

## 2. Tujuan

1. Provinsi ≤ 600 kata dan Rekomendasi ≤ 500 kata terlihat (turun sekitar 30–35%).
2. Kartu panduan ≤ 35 kata per langkah tur dan ≤ 50 kata di ikhtisar.
3. Tidak ada angka yang diulang dalam satu kartu atau bagian.
4. Setiap bagian cukup satu kalimat pengantar. Penjelasan cara membaca dan cara menghitung dilipat, bukan dihapus.

**Bukan tujuan:**
- Mengubah angka, data, rumus, atau urutan halaman.
- Menghapus sumber, tahun data, atau catatan kejujuran ("perkiraan, bukan sensus", "bukan sebab-akibat", "bukan penilaian resmi"). Catatan ini boleh dipersingkat, tetapi isinya tetap.
- Halaman Kesenjangan dan Metode.

## 3. Prinsip

- **Lipat, jangan hapus.** Penjelasan metodologis pindah ke "Cara membaca grafik ini" atau lipatan "Cara menghitung".
- **Satu angka, satu tempat.** Bila angka sudah tampil besar atau di grafik, kalimat di dekatnya tidak menulisnya lagi.
- **Klaim rujukan tetap setia.** Kalimat solusi yang dipersingkat harus tetap didukung kutipan di `src/content/kutipan.js` (kolom `mendukung`). Setiap rujukan yang ditampilkan tetap punya klaim yang ia dukung.
- **`src/lib` tidak disentuh** kecuali disetujui pengguna (lihat bagian 6).

## 4. Perubahan per bagian

### A. Kartu panduan (`src/content/alur.js`, `PanduanAlur.jsx`)

Penjelasan tiap langkah tur menjadi satu kalimat:

| Langkah | Sekarang (kata) | Usulan |
|---|---|---|
| 1 Ringkasan | 29 | "Mulai dari tiga temuan utama: siapa yang paling banyak tidak sekolah." (11) |
| 2 Kesenjangan | 28 | "Pilih Wilayah, Ekonomi, atau Gender, lalu lihat di jenjang mana jaraknya paling lebar." (14) |
| 3 Provinsi | 25 | "Makin tinggi skor indeks, makin perlu didahulukan. Pilih provinsi untuk melihat profilnya." (13) |
| 4 Rekomendasi | 28 | "Lima langkah kebijakan; tombol Bukti membuka studi yang mendukungnya." (10) |

**Ikhtisar:**
- Kalimat pengantar "Empat pertanyaan yang dibaca berurutan…" dihapus. Judul "Satu cerita, empat langkah" sudah cukup.
- Setiap langkah cukup berisi pertanyaan dan nama halamannya. Baris keterangan kedua (`isi`) dihapus dari kartu, tetapi tetap dipakai di tempat lain bila ada.
- Hasil: sekitar 90 → 45 kata.

Catatan: kalimat langkah 4 yang sekarang menyebut tautan "Lihat datanya". Tautan itu memang ada, tetapi kalimat baru menunjuk tombol **Bukti**, karena itulah yang membedakan SETARA.

### B. Ringkasan (`src/pages/Ringkasan.jsx`)

**B1. Tiga temuan utama.** Angka besar (26,1%) langsung diulang di kalimat di bawahnya ("Di SMA, 26,1% anak di desa…"). Kalimat itu dibuat oleh `kalimatDimensi` di `src/lib/temuan.js`. Pilihan:

| Opsi | Tampilan | Perlu izin `src/lib` |
|---|---|---|
| **B1-a (disarankan)** | Angka besar tetap, kalimat diganti keterangan pendek yang disusun di halaman dari nilai yang sama: "anak di desa tidak sekolah · 7,6 poin di atas kota" | Tidak |
| B1-b | Angka besar dihapus, kalimat lengkap tetap | Tidak |
| B1-c | Angka besar tetap, kalimat di `temuan.js` dipersingkat | Ya |

Pada B1-a, nama kelompok memakai `labelKelompok` dan angka memakai `t.tertinggal` dan `t.selisih` yang sama. Arah "di atas/di bawah" mengikuti tanda selisih, sehingga tetap benar bila kelompok yang tertinggal berganti (misalnya gender di tahun lain).

**B2. Perkiraan jumlah anak.**
- Baris "Selisih 16,0 poin." dan "Selisih 4,44 poin." dihapus. Selisihnya sudah ada di grafik dan di temuan, dan desimalnya pun berbeda-beda.
- Kalimat "Perkiraan, bukan sensus" tetap ada.

### C. Provinsi (`src/pages/Provinsi.jsx`, `PriorityMatrix.jsx`, `GrafikPrioritas.jsx`)

| Bagian | Sekarang | Usulan | Hemat |
|---|---|---|---|
| Kotak "Ukurannya berganti" | 27 kata | "**Ukurannya berganti:** indikator provinsi BPS 2023–2025, karena angka anak tidak sekolah tidak tersedia per provinsi." (16) | ~11 |
| "Tahun data per indikator: …" di bawah grafik prioritas | 29 kata, selalu tampil | Pindah ke dalam "Cara membaca grafik ini" | ~29 |
| **Empat kotak kuadran berisi 38 nama provinsi** | sekitar 230 kata, selalu tampil | Setiap kotak menjadi lipatan berjudul nama kuadran dan jumlahnya ("Perlu intervensi mendesak · 6"). Kotak **Mendesak terbuka** secara bawaan, tiga lainnya tertutup. Batang sebaran di atasnya tetap memberi gambaran sekilas | ~170 |
| Catatan kuadran | 21 kata | "Kuadran: partisipasi SMA terbaru dan perubahannya sejak 2019. Alat bantu, bukan penilaian resmi." (13) | ~8 |
| Catatan grafik PAUD | 24 kata | "Garis putus-putus = rata-rata nasional; lima terendah berwarna merah. Empat provinsi baru Papua belum punya data." (16). Kalimat "Sumbu mulai dari 50%" pindah ke "Cara membaca" | ~8 |

**Perbaikan yang ditemukan saat mendata:** grafik PAUD menulis "Sumber: BPS, Susenas 2023", padahal datanya 2025, karena `Sumber` menerima `tahun` milik indikator lain. Diganti menjadi `tahunPaud`.

Perkiraan: 888 → sekitar 660 kata. Sisanya berasal dari daftar 10 provinsi teratas dan tabel, yang memang isi utama halaman ini. Kalau target 600 belum tercapai, daftar "Lima provinsi dengan APK PAUD terendah" (yang mengulang lima titik merah di grafik) dilipat juga.

### D. Rekomendasi (`src/content/rekomendasi.js`, `src/pages/Rekomendasi.jsx`)

**D1. Kalimat setiap langkah** dipersingkat menjadi ≤ 28 kata. Bukti lengkapnya ada di panel Bukti masing-masing rujukan.

| Langkah | Sekarang (kata) | Usulan | Rujukan yang tetap didukung |
|---|---|---|---|
| 1 Bantuan tunai | 26 | "Perluas dan pertajam PKH serta beasiswa bagi rumah tangga termiskin, terutama saat anak masuk SMP dan SMA, ketika biaya sekolah paling berat." (22) | Cahyadi, Hudang, Caniago |
| 2 Transisi | 22 | "Pakai BOS dan beasiswa untuk menahan anak tetap sekolah saat berpindah jenjang, titik ketika angka anak tidak sekolah melonjak." (19) | Petrosino, Sugiharti, Kartasasmita & Sulistyaningrum |
| 3 Perdesaan | 32 | "Dekatkan sekolah menengah ke desa dan tanggung juga biayanya: jarak menurunkan partisipasi SMP, tetapi sekolah baru saja berdampak kecil tanpa bantuan biaya." (23) | Sirait, Filmer |
| 4 PAUD | 49 | "Perluas PAUD di daerah tertinggal, mulai dari kelompok bermain berbasis desa, agar anak tidak masuk SD dengan bekal lebih sedikit; PAUD jarak jauh bisa menjangkau wilayah terpencil." (27) | Jung & Hasan, Brinkman, Pratiwi & Hasbullah |
| 5 Gender | 28 | "Arahkan dukungan ke kelompok gender yang lebih banyak tidak sekolah di daerahnya, karena arah kesenjangan dan pilihan jenis sekolah berbeda antardaerah dan gender." (23) | Surbakti, Himaz & Aturupane, Asadullah & Maliki |

Sebelum diterapkan, setiap kalimat baru dicocokkan sekali lagi dengan kolom `mendukung` di `kutipan.js`. Klaim yang sudah dilunakkan di Fase R2 (penyebab laki-laki tertinggal, dampak Paket A/B/C) tidak dikuatkan kembali.

**D2. Temuan langkah PAUD perlu menyebut indikatornya.** Sekarang tertulis "Temuan (2023): Papua 62,98%, 32,56 poin di bawah rata-rata nasional (95,54%)". Angka ini adalah **partisipasi pembelajaran satu tahun sebelum SD** (BPS var 1990, data 2023), bukan APK PAUD 3–6 tahun. Tanpa nama indikator, angka ini bisa tertukar dengan APK PAUD Papua 21,71% di halaman Provinsi. Usulan:
- "Temuan (2023): partisipasi pembelajaran setahun sebelum SD di Papua 62,98%, 32,56 poin di bawah rata-rata nasional (95,54%)."
- Awalan nama indikator ditambahkan di halaman, sedangkan angka dan kalimat dari `kalimatProvinsi` tetap.

**D3. "Mulai dari mana?"** Ada 5 provinsi × 2 kalimat, dan setiap kalimat mengulang nilai nasional (misalnya "(36,19%)" lima kali). Usulan:
- Nilai nasional ditulis sekali di kalimat pengantar: "Nasional: APK PAUD 36,19%, kemiskinan 8,07%, partisipasi usia SMA 77,86%."
- Setiap provinsi cukup menulis langkah dan nilainya: "Perluas layanan PAUD · APK 3,10%".
- Teks `dasar` dibuat di `src/lib/rekomendasi.js`. Kalau nilainya tersedia sebagai angka di objek rekomendasi, kalimat pendek disusun di halaman tanpa mengubah `src/lib`. Kalau tidak tersedia, bagian ini dibiarkan dan dilaporkan.
- Perkiraan: sekitar 140 → 80 kata.

**D4. Batas rekomendasi:** 44 → sekitar 28 kata. "Lima langkah ini bukan resep tunggal dan perlu disesuaikan dengan tiap daerah. Hanya sebagian studi pendukung yang menguji sebab-akibat; sisanya menunjukkan hubungan." Isinya sama.

**D5.** Kalimat konteks di bawah judul (16 kata) tetap ada.

Perkiraan: 770 → sekitar 520 kata.

### E. Profil provinsi (`src/pages/ProvinsiDetail.jsx`)

| Bagian | Usulan | Perlu izin `src/lib` |
|---|---|---|
| "Peringkat 17 dari 38" tampil dua kali (di bawah judul dan di bawah skor) | Di bawah skor diganti "dari 38 provinsi"; kalimat di bawah judul tetap | Tidak |
| Catatan perkiraan PAUD (34 kata) | Kalimat "Perkiraan, bukan sensus." tetap; rumus dan asumsi dilipat ke "Cara menghitung" | Tidak |
| Kalimat rekomendasi kontekstual (54 dan 36 kata, dari `src/lib/rekomendasi.js`) | Kalimat pertama tampil, sisanya di balik "Selengkapnya" | Tidak (cukup tampilan); mempersingkat teksnya sendiri perlu izin |

Perkiraan: 451 → sekitar 340 kata.

## 5. Batasan

- Angka, data, dan logika tidak berubah. `public/data` dan `scripts` tidak disentuh, dan `src/lib` hanya disentuh bila disetujui di bagian 6.
- Aksesibilitas tidak turun:
  - lipatan memakai `<details>` atau tombol dengan `aria-expanded`
  - axe 0 pelanggaran
  - tanpa gulir horizontal di 360–1280 px dengan huruf 14–22 px
- CLS tetap di bawah 0,1.

## 6. Keputusan dari pengguna

1. **Tiga temuan utama:** B1-a (disarankan), B1-b, atau B1-c?
2. **Teks baru** di bagian A (panduan) dan D1 (rekomendasi): setuju, atau ada yang ingin diubah?
3. **Kotak kuadran:** hanya Mendesak yang terbuka secara bawaan, setuju?
4. **`src/lib`:** usulan ini sengaja tidak memerlukan perubahan `src/lib`. Perlukah teks rekomendasi kontekstual di profil (E) dipersingkat langsung di `src/lib/rekomendasi.js`? Itu hanya perubahan teks, tanpa angka atau logika.

## 7. Tes dan selesai bila

1. Hitung ulang kata dengan skrip yang sama:
   - Provinsi ≤ 600 (atau dilaporkan apa adanya dengan alasannya)
   - Rekomendasi ≤ 500
   - Profil ≤ 360
   - kartu panduan ≤ 35 kata per langkah tur dan ≤ 50 di ikhtisar
2. Angka yang tampil sebelum dan sesudah dibandingkan otomatis: setiap angka di halaman lama masih ada di halaman baru, kecuali duplikat yang sengaja dihapus (dicatat di PRD ini).
3. Kalimat solusi baru dicek terhadap kolom `mendukung` di `kutipan.js`.
4. Tes yang ada diperbarui sesuai teks baru, dan ada tes baru untuk:
   - kotak kuadran terlipat, dengan Mendesak terbuka
   - nama indikator di temuan PAUD
   - tahun sumber grafik PAUD
5. axe, overflow (3 lebar × 4 ukuran huruf), CLS, dan tangkapan layar HP dan desktop.
6. Lint, tes, dan build lolos. Commit atas nama pengguna saja, setelah pengguna setuju.

## 8. Urutan kerja

1. A (panduan) dan perbaikan kecil (tahun sumber PAUD, nama indikator D2).
2. C (Provinsi), lalu hitung ulang.
3. D (Rekomendasi), lalu cek klaim.
4. B dan E.
5. Pemeriksaan penuh dan catatan hasil di PRD ini.

Setiap langkah berakhir dalam keadaan siap demo.

## 9. Hasil

**Keputusan pengguna:** semua saran dipakai.
- Opsi B1-a untuk tiga temuan utama.
- Teks baru di bagian A dan D1.
- Hanya kuadran Mendesak yang terbuka.
- `src/lib` tidak disentuh.

**Koreksi atas PRD ini, ditemukan saat mengerjakan:**
1. **Tahun sumber grafik PAUD (bagian C) ternyata benar.** Grafik titik di bagian PAUD memakai indikator *partisipasi pembelajaran setahun sebelum SD* (data 2015–2023), sehingga "Susenas 2023" tepat. Masalah sebenarnya sama dengan D2: dua indikator PAUD berbeda tampil di satu bagian tanpa nama. Yang diperbaiki adalah teks bantu, yang kini menyebut "Grafik: partisipasi pembelajaran setahun sebelum SD per provinsi". Tahunnya tidak diubah.
2. **Daftar "Lima provinsi dengan APK PAUD terendah" tidak dilipat.** PRD menganggapnya mengulang titik merah di grafik. Ternyata daftar itu memakai indikator lain (APK PAUD 3–6 tahun, 2025) dan menjadi bukti utama rekomendasi PAUD, jadi tetap tampil.
3. **Kalimat panduan langkah 4 dan catatan sumber Rekomendasi.** Rujukan tampil sebagai nama penulis (misalnya "Cahyadi et al., 2020") dengan label "Bukti:", bukan tombol bertuliskan "Bukti". Kalimatnya menjadi "ketuk nama studi di setiap langkah untuk membaca buktinya".
4. **Dua kalimat di D1 melebihi buktinya, dan diperbaiki sebelum dipasang:**
   - Perdesaan: "sekolah baru saja berdampak kecil" bertentangan dengan Petrosino (pembangunan sekolah memberi efek rata-rata terbesar). Kalimatnya kembali ke klaim Filmer: "di 21 negara miskin pengaruh jarak saja kecil".
   - PAUD: "PAUD jarak jauh bisa menjangkau wilayah terpencil" melebihi Pratiwi & Hasbullah, yang hanya menggambarkan bentuk layanan. Kalimatnya menjadi "bisa jadi contoh rancangan".
5. **Profil (E):** baris "Peringkat x dari 38" di bawah skor diganti "Makin tinggi, makin perlu didahulukan.", bukan "dari 38 provinsi", supaya tidak ada pengulangan sama sekali.

**Teks akhir lima langkah** (`src/content/rekomendasi.js`), dicocokkan dengan kolom `mendukung` di `kutipan.js`:

| Langkah | Kata | Kalimat |
|---|---|---|
| Bantuan tunai | 25 | Perluas dan pertajam PKH serta beasiswa bagi rumah tangga termiskin saat anak masuk SMP dan SMA, ketika biaya sekolah dan biaya kesempatan bekerja paling besar. |
| Transisi | 19 | Pakai BOS dan beasiswa untuk menahan anak tetap sekolah saat berpindah jenjang, titik ketika angka anak tidak sekolah melonjak. |
| Perdesaan | 23 | Dekatkan sekolah menengah ke desa dan bantu biayanya. Jarak menurunkan partisipasi SMP di Indonesia, tetapi di 21 negara miskin pengaruh jarak saja kecil. |
| PAUD | 28 | Perluas PAUD di daerah tertinggal lewat kelompok bermain desa, agar anak miskin tidak masuk SD dengan bekal lebih sedikit. PAUD jarak jauh di Jayapura bisa jadi contoh rancangan. |
| Gender | 24 | Arahkan dukungan ke kelompok gender yang lebih banyak tidak sekolah di daerahnya, karena arah kesenjangan berbeda antardaerah dan pilihan jenis sekolah berbeda menurut gender. |

**Jumlah kata terlihat** (HP 390 px, skrip yang sama dengan bagian 1):

| Halaman | Sebelum | Sesudah | Target | Status |
|---|---|---|---|---|
| Ringkasan | 272 | 263 | – | – |
| Provinsi | 888 | **620** (−30%) | ≤ 600 | 20 kata di atas target (lihat koreksi 2) |
| Rekomendasi | 770 | **672** (−13%) | ≤ 500 | **Tidak tercapai** |
| Profil provinsi | 451 | **346** (−23%) | ≤ 360 | Tercapai |
| Kartu panduan, ikhtisar | 90 | **44** | ≤ 50 | Tercapai |
| Kartu panduan, per langkah tur | 58–61 | **45–50** | ≤ 35 | Tidak tercapai |

Kenapa Rekomendasi tidak mencapai 500 kata: sisa teksnya adalah isi inti, yaitu lima langkah yang masing-masing memuat sasaran, judul, temuan, kalimat solusi, dan nama studi pendukung (sekitar 340 kata), ditambah blok SDG dan batas rekomendasi. Untuk mencapai 500 kata, perlu salah satu langkah berikut, yang belum dilakukan karena di luar usulan yang disetujui:
- blok SDG dilipat, atau
- "Mulai dari mana?" diperpendek menjadi tiga provinsi.

Kenapa kartu panduan per langkah belum mencapai 35: hitungan memasukkan baris KUAT (8 kata), label langkah, judul, tombol, dan teks pengumuman pembaca layar. Penjelasan langkahnya sendiri kini 10–14 kata, dari sebelumnya 25–29.

**Angka sebelum dan sesudah:** semua angka di Ringkasan, Provinsi, dan profil masih ada, termasuk yang kini terlipat. Di Rekomendasi, enam angka "x poin di bawah nasional" di "Mulai dari mana?" sengaja dihapus (D3): nilai provinsi dan nilai nasionalnya tetap tampil, jadi selisihnya masih bisa dihitung.

**Pemeriksaan:**
- **Tes:** 121 lolos, 1 dilewati. Tes baru:
  - kotak kuadran terlipat, dan segmen membuka kotaknya
  - panjang penjelasan panduan
  - lipatan "Selengkapnya"
  - keterangan temuan tanpa angka berulang
  - nama indikator di temuan PAUD
- **Browser** (Ringkasan, Provinsi, Rekomendasi, profil di HP 390 px, HP 360 px dengan huruf 22 px, dan desktop 1280 px): CLS ≤ 0,009, tanpa gulir horizontal, axe 0 pelanggaran.
- Lint dan build lolos.

**Temuan lain, belum diperbaiki (di luar lingkup):** pada grafik titik PAUD di halaman Provinsi, label sumbu saling bertumpuk di HP 390 px ("506070 80 90100"). Masalah ini sudah ada sebelum fase ini.
