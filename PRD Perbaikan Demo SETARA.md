# PRD: perbaikan dua temuan sebelum demo final

Status: disetujui pengguna (19 November 2026, "iya betulin aja keduanya").
Terkait: `PRD Fase P Presentasi SETARA.md` bagian 9, `Presentasi/Narasi Lengkap SETARA.docx` (tempat temuan ini pertama dicatat).

## Latar

Dua temuan ini ditemukan saat menulis dokumen narasi dan belum diperbaiki. Akibatnya, naskah demo harus menghindari dua bagian situs. Keduanya **tidak disebut di esai** (sudah dicek di `Proposal/SEC0081_BimasenaWidiyanto_Esai.pdf`), jadi memperbaikinya tidak membuat situs berbeda dari esai.

## 1. Perkiraan anak PAUD per provinsi terhitung setengahnya

- **Lokasi:** `populasiUsiaProvinsi` di `src/lib/dampak.js`. Fungsi ini dipakai oleh `dampakPaud`, lalu `dampakTerbaru`, lalu dua tempat di situs:
  - `/provinsi`, bagian "Peringkat per indikator · PAUD"
  - profil provinsi, bagian "Perkiraan jumlah anak PAUD"
- **Penyebab:** `total2020` menjumlahkan semua baris `populasi_umur`. Data SP2020 per provinsi berisi kelompok umur (`00-04` … `95+`) **ditambah** baris `kelompok: "Jumlah"` untuk laki-laki dan perempuan. Akibatnya total penduduk 2020 terhitung dua kali, faktor skala 2025 ÷ 2020 hanya separuh, dan perkiraan anak usia 3–6 tahun juga hanya separuh.
- **Perbaikan:** `total2020` tidak lagi menjumlahkan baris `Jumlah`. Rumus lain, data, dan perkiraan nasional (`populasiUsiaNasional`, termasuk 424 ribu) tidak berubah.
- **Tes:** tambah satu kasus di `src/lib/dampak.test.js`, yaitu data provinsi dengan baris `Jumlah`, untuk memastikan baris itu tidak ikut dihitung.

## 2. Teks kuadran di Metode tidak sesuai dengan cara hitung

- **Lokasi:** `src/pages/Metode.jsx`, kartu "Kuadran prioritas".
- **Isi sekarang:** "Garis pembagi memakai median provinsi." Kalimat ini terbaca seolah kedua sumbu dibagi di median.
- **Kenyataan:** fungsi `matriksPrioritas` di `src/lib/prioritas.js` membagi **level** di median 38 provinsi, sedangkan **tren** dibagi di 0 (`tren <= 0` berarti tidak naik). Grafik kuadran tidak menggambar garis median tren.
- **Perbaikan:** hanya teks. Logika dan angka kuadran (6 / 13 / 3 / 16) tidak berubah.

## Setelah perbaikan

- Jalankan `npm test`, lalu `npm run build`, lalu `npm run preview`. Cek kedua bagian di browser.
- Hapus kotak "HINDARI" dari naskah (`buat-naskah.js`) dan dari catatan demo di deck (`buat-demo.js`). Buat ulang `.docx`, `.pdf`, dan `.pptx`.
- Perbarui PRD Fase P bagian 9.

## Audit kedua (19 November 2026)

Disetujui pengguna ("iya lanjut kerjain semua"). Audit memeriksa logika `src/lib`, kecocokan teks dengan hitungan, data JSON, serta angka di deck dan naskah.

**Aman:**
- Angka utama sama dengan esai, deck, dan naskah: 21,6%; 30,7 vs 14,7; 0,8 poin dan 3,5×; 99,1; kepekaan stabil 3; kuadran 6/13/3/16; 424 ribu.
- Semua 6 indikator indeks lengkap untuk 38 provinsi.
- Tidak ada selisih dengan arah terbalik.
- 26 rujukan, 14 PDF.

**Diperbaiki (hanya teks dan keterangan, tidak ada angka yang berubah):**
1. **Pemekaran Papua.** BPS baru memisahkan data provinsi baru mulai 2024. Akibatnya:
   - Tren empat provinsi baru hanya 2024–2025.
   - Tren Papua (+18,3) dan Papua Barat sejak 2019 tidak sebanding karena wilayahnya berubah.
   - Hal yang sama memengaruhi "Provinsi paling berubah": Papua menempati urutan teratas "Paling membaik".

   Perbaikannya ada di `src/components/pemekaran.js` (beserta tesnya), dipakai di tiga tempat:
   - `PriorityMatrix.jsx`: rentang tahun dan tanda * untuk provinsi terdampak, ditambah catatan umum. Kalimat "sejak 2019" kini memakai tahun awal terbanyak, bukan baris pertama.
   - `ProvinsiDetail.jsx`: "tren … (2024–2025)" plus catatan, di kartu kuadran dan di bagian tren.
   - `Provinsi.jsx` ("Provinsi paling berubah"): tanda * dan catatan.

   Metode juga diberi satu kalimat penjelasan. Kategori kuadran tidak berubah.
2. **`solusi.js`:** "0,80% (SD) menjadi 7,56% (SMA)" diganti menjadi "0,80 poin … 7,56 poin".
3. **`public/data/meta.json` dan `scripts/fetch-v2.js`:** catatan tahun kini berbunyi "anak tidak sekolah 2019-2023, PAUD setahun sebelum SD 2015-2023". Hanya teks catatan, angka data tidak disentuh.
4. **`App.test.jsx`:** satu tes Ringkasan kadang gagal karena hanya menunggu 1 detik. Waktu tunggunya disamakan menjadi 5 detik seperti tes lain di berkas itu. Seluruh rangkaian tes lolos tiga kali berturut-turut.

**Pertanyaan pengguna soal 424 ribu (poin dikali seperti persen):** rumusnya benar. Bukti dua cara:
- 2.651.174 × 0,1599 ≈ 423.923.
- 2.651.174 × 0,3066 − 2.651.174 × 0,1467 = 812.850 − 388.927 = 423.923.

Penjelasan ini dimasukkan ke naskah (Lampiran 3 dan 4).

**Rujukan yang tidak dipakai, dikeluarkan (disetujui pengguna):** Behrman & Deolalikar (1991) ada di esai, tetapi tidak mendukung klaim mana pun. Entri ini dihapus dari `REFERENSI` di `src/lib/solusi.js` dan dari `src/content/kutipan.js`. Situs kini memuat 25 rujukan (22 + 4 − 1), dan 14 di antaranya bisa dibaca langsung. Deck slide 4, naskah, dan *Narasi Lengkap* sudah disesuaikan menjadi 25, dan naskah mendapat jawaban untuk pertanyaan "kenapa 25?".
