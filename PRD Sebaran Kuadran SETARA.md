# PRD: Batang sebaran kuadran prioritas

Status: selesai (17 November 2026), belum di-commit
Cabang: `v2-tampilan`
Terkait: `PRD SETARA v2.md` (bagian 18, halaman Provinsi)

## 1. Latar

Bagian "Tertinggal dan memburuk, atau tertinggal tetapi membaik?" di halaman Provinsi membagi 38 provinsi ke empat kuadran: Mendesak, Membaik, Pantau, dan Berhasil. Saat ini sebarannya hanya disampaikan lewat satu kalimat ("Dari 38 provinsi, X berada di kuadran mendesak") dan empat kotak daftar nama. Pembaca harus menghitung sendiri untuk melihat besar tiap kuadran.

Pengguna bertanya apakah ada narasi yang bisa dibuat pie chart. Dari semua angka di SETARA, hanya sebaran kuadran ini yang benar-benar satu keseluruhan yang dibagi habis (38 provinsi, 4 kelompok, tidak tumpang-tindih).

Angka lain sengaja tidak dibuat pie:
- Persentase anak tidak sekolah per jenjang tidak berjumlah 100%, karena tiap jenjang dihitung dari kelompok usia yang berbeda.
- Perbandingan dua kelompok (termiskin–terkaya, desa–kota, laki-laki–perempuan) sudah tepat dengan dumbbell.
- Perkiraan jumlah anak di Ringkasan berupa dua skenario yang bisa tumpang-tindih.

## 2. Tujuan

Sebaran 38 provinsi ke empat kuadran terbaca dalam sekali lihat, tanpa menghitung.

**Bukan tujuan:**
- Mengubah cara kuadran dihitung. Kuadran tetap ditentukan oleh `matriksPrioritas` di `src/lib/prioritas.js`, yang tidak disentuh.
- Pie atau donut di halaman lain.

## 3. Bentuk: batang tersegmen, bukan pie

Dipilih **satu batang tersegmen** horizontal selebar konten, bukan pie, karena:
- Panjang pada satu garis dasar lebih mudah dibandingkan dengan mata daripada sudut irisan.
- Muat di layar HP 360 px tanpa mengecilkan angka.
- Gaya grafik SETARA lain (dumbbell, batang prioritas) juga berbasis garis dan batang.

## 4. Rancangan

**Letak:** di bawah kalimat pembuka, di atas empat kotak kuadran.

**Batang:**
- Tinggi 40 px, sudut 4 px, jarak 2 px antarsegmen.
- Lebar tiap segmen sebanding dengan jumlah provinsinya. Kuadran berisi 0 provinsi tidak digambar.
- Jumlah provinsi tertulis di dalam segmen (tebal, 20 px). Bila segmen terlalu sempit, angka tetap ada di keterangan di bawahnya.
- Urutan sama dengan kotak: Mendesak, Membaik, Pantau, Berhasil.
- Setiap segmen adalah tautan ke kotak kuadrannya (`#kuadran-…`), dengan garis tepi saat diarahkan kursor atau difokus keyboard.

**Keterangan:** satu baris di bawah batang berisi kotak warna, nama kuadran, dan jumlahnya, misalnya "■ Perlu intervensi mendesak · 6". Setiap kotak kuadran di bawahnya juga diberi kotak warna di judulnya, sehingga warna tidak menjadi satu-satunya penanda.

**Warna** (diuji dengan validator palet dataviz):

| Kuadran | Warna | Teks di segmen | Alasan |
|---|---|---|---|
| Mendesak | `#c2372d` (merah SETARA) | putih, 5,41:1 | Sama dengan merah lima provinsi teratas di grafik prioritas |
| Membaik | `#2E5F9E` | putih, 6,47:1 | Masih di bawah nilai tengah, jadi biru paling gelap |
| Pantau | `#5C8DC9` | putih tebal 20 px, 3,44:1 | Teks besar, syarat 3:1 |
| Berhasil | `#A9C2E2` | tinta, 8,90:1 | Paling terang |

Hasil validator: pemisahan buta warna antar-segmen bersebelahan ΔE ≥ 15,1 (lolos), pemisahan penglihatan normal ≥ 15,1 (lolos). Biru terang `#A9C2E2` kontrasnya terhadap latar di bawah 3:1, jadi wajib ada label teks. Label sudah tersedia di dalam segmen dan di keterangan.

**Aksesibilitas:**
- Batang diberi `aria-label` yang merangkum seluruh sebaran, misalnya "Sebaran 38 provinsi: 6 perlu intervensi mendesak; 13 tertinggal tetapi membaik; 3 pantau, tren melemah; 16 berhasil, pertahankan." Pemisahnya titik koma, karena beberapa nama kuadran memuat koma.
- Setiap tautan segmen punya nama lengkap, misalnya "Perlu intervensi mendesak: 6 provinsi".
- Tidak ada animasi.

## 5. Batasan

- Angka, data, dan logika tidak berubah. `src/lib`, `public/data`, dan `scripts` tidak disentuh.
- Tanpa dependensi npm baru, tanpa Recharts (cukup `div`).
- axe 0 pelanggaran, tanpa gulir horizontal di 360–1280 px dengan huruf 14–22 px, CLS tetap di bawah 0,1.

## 6. Tes dan selesai bila

1. Tes komponen: jumlah semua segmen sama dengan jumlah provinsi, kuadran kosong tidak digambar, dan setiap segmen menaut ke kotaknya.
2. Tangkapan layar di HP 390 px dan desktop 1280 px.
3. axe, overflow, dan CLS diperiksa ulang di halaman Provinsi.
4. Lint, tes, dan build lolos. Commit atas nama pengguna saja, setelah pengguna setuju.

## 7. Hasil

Sebaran pada data saat ini (partisipasi SMA, perubahan sejak 2019):

| Kuadran | Jumlah provinsi |
|---|---|
| Perlu intervensi mendesak | 6 |
| Tertinggal tetapi membaik | 13 |
| Pantau, tren melemah | 3 |
| Berhasil, pertahankan | 16 |
| **Total** | **38** |

Pemeriksaan:
- Tes baru `src/components/PriorityMatrix.test.jsx` (2 tes): jumlah segmen sama dengan jumlah provinsi, kuadran kosong tidak digambar, nama aksesibel segmen, dan setiap segmen menaut ke kotaknya.
- Semua tes: 105 lolos, 1 dilewati. Lint bersih, build lolos.
- Halaman Provinsi di desktop 1280 px, HP 390 px, dan HP 360 px dengan huruf 22 px: axe 0 pelanggaran, tanpa gulir horizontal.
- CLS 0 di desktop dan HP 390 px. Di uji 360 px/22 px, ukuran huruf diubah lewat skrip setelah halaman dimuat, sehingga pergeseran yang tercatat berasal dari skrip uji itu sendiri, bukan dari batang.
- Segmen terkecil (Pantau, 3 provinsi) tetap memuat angkanya di HP 360 px dengan huruf 22 px.

Berkas yang berubah: `src/components/PriorityMatrix.jsx` dan tesnya. Data dan logika tidak disentuh.
