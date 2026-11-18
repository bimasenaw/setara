# PRD: Pilihan tampilan batang berdampingan di Ringkasan

Status: selesai (18 November 2026)
Cabang: `v2-tampilan`
Terkait: `PRD SETARA v2.md` (bagian 17, Ringkasan)

## 1. Latar

Kartu "Tiga jarak antarkelompok" di Ringkasan memakai grafik dumbbell: lingkaran biru untuk kelompok pembanding, persegi merah untuk kelompok yang lebih tertinggal, dan garis di antaranya menunjukkan jarak. Dumbbell ringkas dan menonjolkan jarak, tetapi tidak semua orang terbiasa membacanya. Batang lebih akrab bagi juri dan pembaca umum.

Pengguna meminta pilihan kedua: batang kelompok tertinggal (merah) dan pembanding (biru) yang berdempetan, sehingga kesenjangannya tetap terlihat.

## 2. Tujuan

Pembaca bisa memilih antara dua cara melihat data yang sama:
1. **Titik dan garis** (dumbbell, bawaan): menonjolkan jarak.
2. **Batang**: menonjolkan besar masing-masing kelompok, dengan jarak terbaca dari beda panjang dua batang yang berdempetan.

**Bukan tujuan:**
- Mengubah angka, data, atau logika. `src/lib`, `public/data`, dan `scripts` tidak disentuh.
- Menambah pilihan ini di halaman Kesenjangan. Bisa menyusul bila diminta.

## 3. Rancangan

**Pemilih tampilan:**
- Kontrol bersegmen "Titik dan garis" | "Batang" di kanan judul kartu (di HP, di bawah judul). Gaya sama dengan pemilih jenjang.
- Pilihan disimpan di alamat (`?grafik=batang`), sehingga tautan dan demo bisa langsung membuka tampilan batang. Tanpa parameter, tampilan bawaan tetap dumbbell.

**Grafik batang:**
- Satu baris per dimensi: Wilayah, Ekonomi, Gender.
- Tiap baris berisi dua batang horizontal yang berdempetan (jarak 2 px): merah untuk kelompok tertinggal di atas, biru untuk pembanding di bawahnya. Keduanya berawal dari garis dasar yang sama, sehingga beda panjangnya langsung terlihat.
- Batang setebal 18 px. Hanya ujung data yang dibulatkan (4 px); ujung di garis dasar tetap lurus.
- Nilai persen tertulis di ujung kanan setiap batang.
- Di kolom kiri: nama dimensi, dan di bawahnya selisih dalam poin (misalnya "+18,3 poin"). Selisih dipindah ke kiri supaya grafik tetap lebar di HP 360 px.
- Sumbu sama dengan dumbbell (`skalaRapi`, 4 angka sumbu di layar sempit).
- Keterangan warna dan tabel angka ("Lihat angka dalam tabel") tetap ada, sama seperti dumbbell.

**Warna:** sama dengan dumbbell, yaitu merah `#C2372D` dan biru `#6F8CAB`. Validator palet dataviz: pemisahan buta warna ΔE 16,7 dan penglihatan normal ΔE 23,9 (lolos), kontras terhadap latar ≥ 3:1 (lolos). Biru SETARA tercatat agak keabu-abuan (di bawah batas kroma). Warna ini dipertahankan supaya kedua tampilan konsisten, dan identitas kelompok tidak bergantung pada warna saja karena urutan batang tetap (merah selalu di atas), ada keterangan, dan ada label nilai.

**Cara membaca:** teks "Cara membaca grafik ini" menyesuaikan tampilan yang dipilih.

**Aksesibilitas:** SVG punya `role="img"` dan `aria-label` berisi kalimat temuan utama, sama seperti dumbbell. Kontrol bersegmen bisa dipakai dengan keyboard.

## 4. Tes dan selesai bila

1. Tes komponen: tiga baris, masing-masing dua batang; batang merah lebih panjang bila nilainya lebih besar; label nilai dan selisih benar.
2. Tes halaman: pemilih mengubah `?grafik=batang` dan grafik berganti.
3. Tangkapan layar di HP 390 px, HP 360 px dengan huruf 22 px, dan desktop 1280 px.
4. axe 0 pelanggaran, tanpa gulir horizontal, CLS kunjungan awal tidak berubah.
5. Lint, tes, dan build lolos. Commit atas nama pengguna saja, setelah pengguna setuju.

## 5. Hasil

Sudah:
- Komponen baru `src/components/BatangBerdampingan.jsx`, dipasang di `src/pages/Ringkasan.jsx` dengan pemilih "Titik dan garis" | "Batang" (`?grafik=batang`).
- Tes baru: `src/components/BatangBerdampingan.test.jsx` (2 tes: dua batang per baris, merah di atas dan lebih panjang bila nilainya lebih besar, nilai kosong dilewati, label nilai dan selisih) dan satu tes halaman di `src/App.test.jsx` (pemilih mengganti grafik bolak-balik).
- Semua tes: 108 lolos, 1 dilewati. Lint bersih, build lolos.

Pemeriksaan browser (18 November 2026, build produksi): tampilan batang di Ringkasan dan Kesenjangan pada HP 360 px, HP 390 px, dan desktop 1280 px. CLS 0, tanpa gulir horizontal, axe 0 pelanggaran. Pilihan yang sama kemudian ditambahkan ke Kesenjangan (lihat `PRD Fase 8 SETARA.md`).
