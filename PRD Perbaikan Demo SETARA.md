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
- **Kenyataan:** fungsi `kuadranPrioritas` di `src/lib/prioritas.js` membagi **level** di median 38 provinsi, sedangkan **tren** dibagi di 0 (`tren <= 0` berarti tidak naik). Grafik kuadran tidak menggambar garis median tren.
- **Perbaikan:** hanya teks. Logika dan angka kuadran (6 / 13 / 3 / 16) tidak berubah.

## Setelah perbaikan

- Jalankan `npm test`, lalu `npm run build`, lalu `npm run preview`. Cek kedua bagian di browser.
- Hapus kotak "HINDARI" dari naskah (`buat-naskah.js`) dan dari catatan demo di deck (`buat-demo.js`). Buat ulang `.docx`, `.pdf`, dan `.pptx`.
- Perbarui PRD Fase P bagian 9.
