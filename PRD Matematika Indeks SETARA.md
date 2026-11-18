# PRD: Menampilkan matematika indeks prioritas

Status: selesai (19 November 2026), disetujui pengguna ("setuju, pakai saran"), belum di-commit
Cabang: `v2-tampilan`
Terkait: `indikator_penilaian_babak_final.md`, `PRD Pangkas Teks SETARA.md`

## 1. Latar

Tema babak final adalah *"Exploring Mathematics, Revealing The Unknowns"*. Kriteria terbesarnya **Penguasaan materi dan kemampuan menanggapi pertanyaan (25%)**, disusul Kreativitas (20%) dan Penyampaian (20%). Presentasi dan tanya jawab masing-masing 10 menit.

Matematika di balik indeks prioritas SETARA belum terlihat di website. Juri hanya melihat skor akhir, misalnya "99,1/100". Tidak ada contoh perhitungan, uji kepekaan, ataupun penjelasan tentang nilai kembar.

**Pengecekan data, 18 November 2026:**

*Rumus sekarang* (`src/lib/prioritas.js`, tidak diubah):
- Untuk setiap indikator, 38 provinsi diurutkan, lalu skor persentil = r ÷ (n − 1) × 100. r adalah posisi dalam urutan (0 untuk yang pertama), dan n = 38.
- Skor dibalik bila nilai tinggi berarti baik, sehingga 100 selalu berarti "paling perlu didahulukan".
- Skor indeks = rata-rata enam skor persentil, dengan bobot sama.

*Contoh: Papua Pegunungan, skor 99,1*

| Indikator | Nilai | Skor persentil |
|---|---|---|
| Partisipasi usia SMA | 50,79% | 97,3 |
| APK PAUD 3–6 | 3,10% | 100 |
| Rata-rata lama sekolah | 4,76 tahun | 100 |
| Penduduk miskin | 26,34% | 97,3 |
| IPM | 53,42 | 100 |
| Ketimpangan gender | 0,584 | 100 |

(97,3 + 100 + 100 + 97,3 + 100 + 100) ÷ 6 = 99,1.

*Uji kepekaan* (indeks dihitung ulang enam kali, setiap kali tanpa satu indikator):
- **Tiga teratas selalu sama, dengan urutan yang sama**: Papua Pegunungan, Papua Tengah, Papua Selatan. Berlaku di enam dari enam percobaan.
- Lima teratas hanya sama persis di 2 dari 6 percobaan (tanpa partisipasi SMA, atau tanpa IPM). Peringkat 4–5 bergantian antara Kalimantan Barat, Papua Barat, Sulawesi Barat, Papua Barat Daya, Sumatera Selatan, dan NTT.

*Nilai kembar:*
- Ada 8 pasang provinsi dengan nilai indikator yang sama persis: APK PAUD 1, lama sekolah 3, ketimpangan gender 4. Rumus sekarang tetap memberi keduanya persentil berbeda, berselisih 2,7 poin, dan urutannya mengikuti urutan data. Pengaruh ke skor indeks paling banyak sekitar 0,45 poin. Lima teratas tidak berubah, karena jarak peringkat 5 (73,0) ke 6 (66,7) adalah 6,3 poin.
- Ada lima kelompok skor akhir yang sama. Contohnya NTT dan Sumatera Selatan (66,7) yang tampil sebagai peringkat 6 dan 7.

## 2. Tujuan

1. Juri, dan pengguna mana pun, bisa melihat **bagaimana satu skor dihitung**, dari nilai mentah sampai skor akhir, di halaman profil provinsi.
2. SETARA menunjukkan **seberapa kokoh peringkatnya** dengan klaim yang jujur: tiga teratas kokoh, peringkat 4–5 peka.
3. Rumus, batasan, dan nilai kembar **tertulis terbuka di Metode**.
4. **UI/UX tetap nyaman**:
   - tidak menambah teks yang selalu tampil lebih dari satu kalimat per halaman
   - tidak menambah panjang halaman sebelum dibuka
   - nyaman di HP 360 px dengan huruf besar

**Bukan tujuan:**
- Mengubah rumus, bobot, atau cara menangani nilai kembar. Angka harus tetap sama dengan esai.
- Menambah fitur interaktif baru, seperti pengatur bobot. Waktunya terlalu dekat dengan presentasi dan rawan gagal saat demo.

## 3. Prinsip UI/UX

1. **Ringkasan dulu, rincian sesudahnya.** Setiap tambahan muncul sebagai satu baris ringkas yang bisa dibuka, dengan gaya lipatan yang sama seperti "Cara membaca grafik ini". Tertutup secara bawaan, sehingga halaman tidak bertambah panjang.
2. **Pola yang sudah dikenal pengguna.** Memakai komponen yang ada (`CaraMembaca`, gaya tabel `DataTable`, warna merah/biru SETARA), tanpa gaya baru.
3. **Angka dibaca sekali lihat.** Skor persentil ditampilkan sebagai batang kecil 0–100 dengan angka di ujungnya (pola *meter list*), bukan tabel padat. Di HP, batangnya turun ke bawah nama indikator.
4. **Bahasa awam dulu, notasi sesudahnya.** "100 berarti paling perlu didahulukan di antara 38 provinsi" ditulis sebelum rumus r ÷ (n − 1) × 100.
5. **Bisa dipakai saat tanya jawab.** Setiap rincian punya alamat yang bisa dibuka langsung (misalnya `/provinsi/9700#perhitungan`), sehingga saat juri bertanya, rincian langsung terbuka tanpa perlu menggulir.
6. **Aksesibilitas:** lipatan memakai `<details>`, batang punya teks angka di sebelahnya (bukan warna saja), tanpa gulir horizontal di 360–1280 px dengan huruf 14–22 px, CLS tetap 0.

## 4. Perubahan

### A. Rincian skor di profil provinsi (`src/pages/ProvinsiDetail.jsx` dan komponen baru `RincianSkor.jsx`)

**Letak:** tepat di bawah tiga angka besar (Indeks prioritas, Kuadran, Cakupan), sebagai lipatan berjudul **"Bagaimana skor 99,1 dihitung?"**. Angka di judul mengikuti provinsi yang dibuka.

**Isi saat dibuka:**
1. Satu kalimat: "Setiap indikator diberi skor 0–100 menurut posisi provinsi di antara 38 provinsi; 100 berarti paling perlu didahulukan. Skor indeks adalah rata-ratanya."
2. Enam baris, satu per indikator:
   ```
   Partisipasi usia SMA · 50,79% (2025)
   [██████████████████████████████░]  97,3
   ```
   - Nama indikator dan nilai mentahnya beserta tahun.
   - Batang 0–100 dengan angka skor di ujung kanan. Batang 80 ke atas berwarna merah (sangat perlu), selebihnya biru SETARA. Ambang ini dicek dengan validator palet dataviz dan memakai warna yang sudah ada.
   - Indikator yang nilainya tinggi berarti baik diberi keterangan kecil "makin rendah, makin perlu", supaya juri tidak bingung kenapa IPM 53,42 menghasilkan skor 100.
3. Baris jumlah: "Rata-rata 6 skor = **99,1**", sama dengan angka besar di atas.
4. Tautan kecil: "Rumus lengkap di Metode →".

**Data:** semuanya sudah tersedia di `hitungPrioritas(...).daftar[i].komponen` (nilai, skor, tahun, label). Rata-ratanya dihitung ulang di komponen hanya untuk ditampilkan, lalu dicek sama dengan `skor` dari `src/lib`.

**Alamat:** lipatan diberi `id="perhitungan"`, dan terbuka otomatis bila URL berakhiran `#perhitungan`.

### B. Uji kepekaan di halaman Provinsi (`src/pages/Provinsi.jsx` dan komponen baru `UjiKepekaan.jsx`)

**Letak:** di dalam kartu "Indeks prioritas SETARA", di bawah grafik, sebelum "Cara membaca grafik ini".

**Yang selalu tampil**, satu kalimat dengan ikon centang:
> ✓ **Tiga teratas tetap sama** walau salah satu dari enam indikator dihapus.

Kalimat ini **dihitung dari data saat halaman dibuka**, bukan teks tetap. Kalau suatu hari datanya berubah dan tiga teratas tidak lagi stabil, kalimatnya ikut berubah, misalnya menjadi "Dua teratas tetap sama…".

**Lipatan "Lihat uji kepekaan":**
- Satu kalimat: "Indeks dihitung ulang enam kali, setiap kali tanpa satu indikator. Peringkat 1–3 tidak berubah; peringkat 4–5 bergantung pada indikator yang dipakai."
- Daftar enam baris, satu per indikator yang dihapus, berisi lima teratas hasil hitung ulang sebagai label kecil. Provinsi yang juga ada di lima teratas asli tampil biasa, yang baru masuk ditandai garis tepi putus-putus dan teks "(baru)". Penandanya tidak bergantung pada warna saja.
- Di HP, label-label itu turun ke baris berikutnya.

**Alamat:** `/provinsi#kepekaan`.

**Perhitungan:** skor persentil setiap indikator tidak berubah saat indikator lain dihapus, jadi hitung ulangnya cukup merata-rata lima skor yang tersisa dari `komponen` yang sudah ada. Tidak ada rumus baru di `src/lib`. Tes memastikan hasilnya sama dengan perhitungan di bagian 1.

### C. Rumus terbuka di Metode (`src/pages/Metode.jsx`, bagian "Rumus dan asumsi")

Ditambahkan blok "Indeks prioritas":
1. **Langkah dalam bahasa awam:** urutkan 38 provinsi untuk setiap indikator, beri skor 0–100 menurut posisinya, balik bila nilai tinggi berarti baik, lalu rata-ratakan enam skor.
2. **Notasi:**
   - persentil = r ÷ (n − 1) × 100, dengan r = posisi dalam urutan (mulai dari 0) dan n = jumlah provinsi berdata
   - skor indeks = (P₁ + … + P₆) ÷ 6
   - Ditulis dengan teks dan simbol biasa, tanpa pustaka matematika baru.
3. **Contoh:** tautan ke `/provinsi/9700#perhitungan` (Papua Pegunungan).
4. **Kenapa persentil:** tahan terhadap nilai ekstrem (APK PAUD 3,10% tidak "menekan" provinsi lain seperti pada min–max). Kelemahannya, jarak antarnilai hilang dan yang dipakai hanya urutan.
5. **Batasan yang diakui terbuka:**
   - Bobot sama, dengan alasan dan hasil uji kepekaannya (tautan ke `/provinsi#kepekaan`).
   - **Nilai kembar:** 8 pasang nilai indikator sama persis tetap mendapat persentil berbeda menurut urutan data. Pengaruhnya paling banyak sekitar 0,45 poin indeks, dan lima teratas tidak berubah.
   - **Skor sama:** provinsi dengan skor yang sama diberi peringkat berurutan.

Blok ini masuk ke bagian "Rumus dan asumsi" yang sudah ada dan tercantum di daftar isi Metode. Tidak ada bagian baru di menu.

## 5. Batasan

- `src/lib`, `public/data`, dan `scripts` tidak diubah. Semua tambahan hanya membaca hasil `hitungPrioritas`.
- Tanpa dependensi npm baru.
- Teks yang selalu tampil bertambah paling banyak satu kalimat di Provinsi (B) dan satu baris lipatan di profil (A).
- Angka yang sudah tampil tidak berubah.

## 6. Keputusan dari pengguna

1. **Peringkat untuk skor yang sama.** Tetap seperti sekarang (NTT 6, Sumatera Selatan 7) dengan catatan di Metode **(disarankan, karena tidak mengubah apa pun yang sudah ada di esai)**, atau ditampilkan sebagai peringkat bersama (keduanya "6")?
2. **Ambang merah 80 di batang rincian skor.** Setuju, atau semua batang memakai satu warna (biru) saja?

## 7. Tes dan selesai bila

1. Tes komponen:
   - rincian skor menampilkan enam indikator dan rata-ratanya sama dengan skor indeks
   - lipatan terbuka lewat `#perhitungan`
   - uji kepekaan menghasilkan "tiga teratas tetap sama" pada data sekarang
   - kalimat kepekaan berubah bila data dibuat tidak stabil (data uji)
2. Angka contoh Papua Pegunungan di Metode sama dengan yang tampil di profilnya.
3. Pemeriksaan browser (HP 390 px, HP 360 px dengan huruf 22 px, desktop): axe 0, tanpa gulir horizontal, CLS 0, dan tangkapan layar dalam keadaan tertutup maupun terbuka.
4. Jumlah kata terlihat di Provinsi dan profil bertambah paling banyak 20 kata (dibandingkan hasil `PRD Pangkas Teks`).
5. Lint, tes, dan build lolos. Commit atas nama pengguna saja, setelah pengguna setuju.

## 8. Urutan kerja

1. A (rincian skor): paling berguna saat tanya jawab.
2. B (uji kepekaan).
3. C (Metode).
4. Pemeriksaan penuh dan catatan hasil di PRD ini.

Setiap langkah berakhir dalam keadaan siap demo.

## 9. Setelah fase ini

PRD Fase P:
- naskah 10 menit mengikuti KUAT
- bank tanya jawab untuk 10 menit, termasuk enam pertanyaan matematis
- urutan demo dengan tautan langsung (`#perhitungan`, `#kepekaan`)
- cadangan bila internet mati

## 10. Hasil

**Keputusan pengguna:**
- Peringkat untuk skor yang sama tetap berurutan, dengan catatan di Metode.
- Batang skor 80 ke atas berwarna merah, selebihnya biru.

**Yang dibuat:**
- `src/components/RincianSkor.jsx`: lipatan "Bagaimana skor … dihitung?" di profil provinsi. Isinya enam baris indikator (nilai, tahun, arah "makin rendah/tinggi, makin perlu", batang 0–100, skor), lalu "Rata-rata 6 skor: (97,3 + 100 + 100 + 97,3 + 100 + 100) ÷ 6 = 99,1".
  - Skor bulat ditulis tanpa ",0".
  - Tanda "=" berganti menjadi "≈" bila rata-rata dari angka yang dibulatkan berbeda tipis dari skor sebenarnya.
- `src/components/kepekaan.js` dan `UjiKepekaan.jsx`: satu kalimat yang selalu tampil ("✓ Uji kepekaan: Tiga teratas tetap sama walau salah satu dari 6 indikator dihapus."), plus lipatan berisi enam percobaan. Provinsi yang baru masuk lima teratas ditandai garis putus-putus dan teks "(baru)".
  - Kalimatnya dihitung dari data saat halaman dibuka.
- `src/components/bukaDariHash.js`: lipatan terbuka dan digulir ke layar lewat `#perhitungan` dan `#kepekaan`.
- `src/pages/Metode.jsx`: blok "Indeks prioritas, langkah demi langkah" berisi empat langkah, notasi, contoh dengan tautan ke rinciannya, alasan memakai persentil, dan tiga batasan yang diakui.

**Masalah yang ditemukan dan diperbaiki saat memeriksa:**
1. Angka "100,0" terpotong di tepi kanan HP. Kolom angka dilebarkan, dan skor bulat ditulis "100".
2. Membuka `/provinsi#kepekaan` langsung menghasilkan CLS 0,14–0,53, karena dua sebab:
   - Lipatan dibuka setelah halaman tergambar. Sekarang dibuka dengan `useLayoutEffect`.
   - Halaman tumbuh dan bergulir di bingkai yang sama. Sekarang guliran menunggu dua bingkai (`bingkai`).
   - Setelah kedua perbaikan, CLS 0 di build produksi dan mode pengembangan.

**Pemeriksaan:**
- **Tes:** 130 lolos, 1 dilewati. Tes baru:
  - rincian skor sama dengan skor indeks
  - lipatan tertutup secara bawaan dan terbuka lewat `#perhitungan`
  - kepekaan stabil = 3 pada data sekarang
  - kalimat kepekaan hilang pada data buatan yang tidak stabil
  - contoh angka dan "8 pasang" di Metode cocok dengan data
- **Browser** (HP 390 px, HP 360 px dengan huruf 22 px, desktop 1280 px) untuk `/provinsi`, `/provinsi/9700`, `/provinsi/9700#perhitungan`, `/provinsi#kepekaan`, dan `/metode`: CLS 0, tanpa gulir horizontal, axe 0 pelanggaran.
- **Tautan langsung** membuka lipatannya, yang tampil di bawah header.
- **Kata terlihat:** Provinsi 620 → 636 (+16) dan profil 346 → 350 (+4), keduanya dalam batas +20. Metode bertambah sekitar 200 kata di bagian rumus, sesuai rencana.
- Lint dan build lolos. `src/lib`, `public/data`, dan `scripts` tidak diubah.
