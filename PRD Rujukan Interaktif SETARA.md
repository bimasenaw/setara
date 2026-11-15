# PRD: Rujukan Interaktif SETARA

Status: draf, menunggu persetujuan
Cabang: `v2-tampilan`
Terkait:
- `Verifikasi Rujukan SETARA.md` (hasil pemeriksaan klaim)
- `PRD SETARA v2.md`

## 1. Masalah

Setiap solusi di SETARA mencantumkan rujukan, tetapi rujukan itu hanya berupa tautan DOI. Saat juri bertanya "bukti apa yang mendukung kalimat ini?", jawabannya ada di luar situs. Biasanya hanya halaman abstrak, sering berbayar, dan tidak menunjukkan paragraf mana yang mendukung solusinya.

Kita sudah memeriksa semua rujukan, tetapi hasil pemeriksaan itu belum terlihat di situs.

## 2. Tujuan

1. Setiap rujukan di bawah solusi bisa diklik dan membuka **panel bukti**. Panel menampilkan kutipan asli dari jurnal, dengan kalimat kunci disorot dan nomor halamannya.
2. Panel punya tombol **"Baca selengkapnya"**:
   - **Jurnal berlisensi terbuka:** PDF terbuka di dalam SETARA, langsung di halaman yang dikutip, dengan paragrafnya disorot.
   - **Jurnal lain:** muncul keterangan bahwa jurnal tidak bisa ditampilkan di SETARA, beserta tautan ke tempat jurnal itu bisa dibaca.
3. Fitur tetap berjalan tanpa internet untuk semua kutipan dan PDF berlisensi terbuka, sehingga aman saat demo.
4. Tidak ada kutipan yang dikarang. Setiap kutipan diuji otomatis terhadap teks PDF-nya.

**Bukan tujuan:**
- Menampilkan PDF jurnal yang tidak berlisensi terbuka, walaupun berkasnya kita punya.
- Mengubah angka, logika, atau teks klaim. Klaim sudah disesuaikan dalam commit `3d2a2b7`.
- Penampil PDF lengkap dengan anotasi, unduhan, atau pencarian bebas.

## 3. Pembagian rujukan

Dasarnya pemeriksaan lisensi tanggal 15 November 2026 lewat Crossref, OpenAlex, teks PDF, dan halaman artikel.

| Kelompok | Rujukan | Tombol "Baca selengkapnya" |
|---|---|---|
| **A. Ditampilkan dan disorot** (lisensi CC terkonfirmasi) | harahap2020, hudang2024, islam2018, karimah2022, petrosino2012, pratiwi2021, samosir2021, setyadi2022, siddique2021, utomo2014 | Membuka penampil PDF SETARA di halaman yang dikutip, dengan paragrafnya disorot |
| **B. Menunggu konfirmasi lisensi** | caniago2021, kartasasmita2021, purnastuti2012, sulistyaningrum2016 | Diperlakukan seperti kelompok C sampai pengguna mengonfirmasi logo CC di halaman jurnalnya. Setelah dikonfirmasi, cukup ubah satu nilai (`lisensi`) agar pindah ke kelompok A |
| **C. Tautan saja** | asadullah2018, behrman1991, brinkman2017, cahyadi2020, duflo2001, himaz2021, purnastuti2015, sugiharti2017 | Menampilkan keterangan hak cipta, lalu membuka PDF lengkap gratis yang sah di situs aslinya (tabel 3.1) |

Keterangan untuk kelompok B dan C:
> Jurnal ini dilindungi hak cipta, jadi isinya tidak bisa ditampilkan di SETARA. Kutipan di atas ada di halaman {n}. Buka PDF lengkapnya di {nama sumber}.

### 3.1 Versi lengkap gratis untuk kelompok C

Setiap jurnal kelompok C punya versi lengkap yang bisa dibaca gratis dan sah. Isinya diunggah oleh penerbit, penulis, atau lembaga penulis.

ResearchGate **tidak dipakai**. Alasannya:
- Status hukum unggahannya tidak jelas.
- Sering meminta login.
- Tautannya bisa berubah.

| Rujukan | Versi | Tautan |
|---|---|---|
| asadullah2018 | IZA Discussion Paper 11362 (versi kertas kerja artikel yang sama) | https://www.iza.org/publications/dp11362 |
| behrman1991 | PDF gratis dari penerbit (Wiley) | https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/j.1468-0084.1991.mp53004007.x |
| brinkman2017 | Repositori VU Amsterdam (versi terbit) | https://research.vu.nl/en/publications/d4b84b15-354d-471c-b25e-ea6513f37dfc |
| cahyadi2020 | PDF gratis dari penerbit (AEA) | https://www.aeaweb.org/articles/pdf/doi/10.1257/pol.20190245 |
| duflo2001 | NBER Working Paper 7860 | https://www.nber.org/papers/w7860 |
| himaz2021 | Repositori UCL (naskah diterima) | https://discovery.ucl.ac.uk/10134887/3/Himaz_ms_final.pdf |
| purnastuti2015 | Repositori Curtin University | https://espace.curtin.edu.au/bitstream/20.500.11937/13858/2/229418_163254_JDA_PAPER2.pdf |
| sugiharti2017 | PDF dari situs jurnal GATR | http://gatrenterprise.com/GATRJournals/pdf_files/GJBSSR%20Vol%205(3)%202017/5.CIMSSR-00313-Lilik-Sugiharti-GJBSSR-Vol5(3).pdf |

Untuk kelompok B, tautan bacanya adalah PDF di situs jurnal masing-masing, sampai lisensinya dikonfirmasi.

**Versi yang dikutip.** Nomor halaman di panel mengikuti PDF yang dibuka tombol "Baca selengkapnya". Jika versi itu berbeda dari versi terbit (Duflo NBER, Himaz naskah diterima, Asadullah IZA), panel menyebutnya, misalnya "hlm. 12 (versi NBER)".

## 4. Pengalaman pengguna

### 4.1 Rujukan yang bisa diklik

- Rujukan tetap tampil di tempat yang sama:
  - solusi di Kesenjangan
  - lima rekomendasi di Rekomendasi
  - rekomendasi kontekstual di profil provinsi
  - blok solusi PAUD
- Bentuknya berubah dari tautan biasa menjadi **tombol** dengan sitasi pendek, misalnya "Cahyadi et al., 2020", ditambah ikon kecil berbentuk kutipan.
- Tombol mendapat `aria-haspopup="dialog"`. Label aksesibelnya: "Lihat bukti dari Cahyadi et al., 2020".

### 4.2 Panel bukti

```
┌──────────────────────────────────────────────────────┐
│ Cahyadi et al. (2020)                              ✕ │
│ American Economic Journal: Economic Policy · hlm. 88 │
│ [Uji acak]  [Indonesia]                              │
│                                                      │
│  "…We find static effects on many targeted           │
│   indicators: childbirth using trained professionals │
│   increased dramatically, and ▌under-15 children not │
│   in school fell by half.▐"                          │
│                                                      │
│ Mendukung: PKH memangkas separuh anak di bawah       │
│ 15 tahun yang tidak sekolah.                         │
│                                                      │
│ ⓘ Jurnal ini dilindungi hak cipta … (kelompok B/C)   │
│                                                      │
│ [ Baca selengkapnya ↗ ]                              │
└──────────────────────────────────────────────────────┘
```

**Isi panel, dari atas ke bawah:**
1. Sitasi lengkap, nama jurnal, dan nomor halaman tercetak.
2. Label jenis studi: Uji acak, Ulasan sistematis, Kuasi-eksperimen, Survei/regresi, Kualitatif, Analisis isi, atau Data makro. Label ini membantu juri menilai kekuatan bukti.
3. **Kutipan asli** dalam bahasa jurnalnya, 1–3 kalimat, dengan kalimat kunci disorot memakai `<mark>`.
4. **"Mendukung:"** satu kalimat Bahasa Indonesia yang menjelaskan bagian solusi mana yang didukung kutipan itu.
5. Keterangan hak cipta (hanya kelompok B dan C).
6. Tombol **"Baca selengkapnya"**.

**Kutipan mengikuti solusinya.** Satu jurnal bisa mendukung beberapa solusi dengan paragraf berbeda. Contohnya Sugiharti (2017): soal lokasi desa, soal kemiskinan, dan soal anak laki-laki yang bekerja. Panel menampilkan kutipan yang sesuai dengan solusi tempat rujukan itu diklik.

**Tata letak:**
- **Desktop (md+):** popover muncul dari tombol rujukan (`transform-origin` di tombol), lebar maksimal 28rem.
- **HP:** lembar dari bawah, dengan pola dan gerak yang sama seperti kartu panduan (bisa diusap ke bawah untuk ditutup).
- Tanpa latar gelap. Panel bersifat informatif dan tidak memblokir halaman.

**Gerak:** sama dengan kartu panduan. Muncul 250 ms dengan kurva `cubic-bezier(0.2,0,0,1)`, tutup 150 ms, bisa diinterupsi, dan hanya memudar saat pengaturan "kurangi gerakan" aktif.

**Aksesibilitas:**
- `role="dialog"` dengan `aria-labelledby` yang menunjuk sitasi.
- Fokus pindah ke judul panel saat dibuka.
- Esc, klik di luar, dan ✕ menutup panel, lalu fokus kembali ke tombol rujukan.

### 4.3 Penampil PDF (kelompok A)

- **Rute baru `/rujukan/:id?k={kutipan}`.** Rute ini bisa dibagikan dan tombol Kembali di browser berfungsi.
- Halaman yang dikutip dimuat lebih dulu, lalu layar langsung menggulir ke paragraf yang disorot. Halaman lain dimuat saat digulir mendekat.
- **Sorotan:** kotak kuning lembut di belakang teks kutipan, dibuat di lapisan teks PDF.js. Berkas PDF tidak diubah, karena lisensi ND melarang perubahan berkas.
- **Bilah atas:**
  - "← Kembali"
  - sitasi
  - "Halaman 5 dari 12"
  - tombol "Ke kutipan"
  - lisensi beserta tautannya, misalnya "CC BY 4.0", yang wajib untuk atribusi
  - tautan "Sumber asli ↗"
- **HP:** halaman PDF menyesuaikan lebar layar, bisa digeser dan dicubit untuk zoom.
- Kalau PDF gagal dimuat, kutipan tetap ditampilkan beserta tautan ke sumber asli.

### 4.4 Kelompok B dan C

Tombol "Baca selengkapnya" membuka PDF lengkap gratis dari tabel 3.1 di tab baru (`rel="noreferrer"`). Labelnya menyebut tujuannya, misalnya "Baca PDF lengkap di situs AEA ↗".

Di bawahnya ada tautan kecil "Halaman penerbit (DOI)" untuk sitasi resmi.

## 5. Data

### 5.1 Berkas baru `src/content/kutipan.js`

Berkas ini berisi teks naratif tanpa angka hasil hitungan. `src/lib` tidak disentuh.

```js
export const SUMBER = {
  cahyadi2020: {
    jenis: 'Uji acak',
    lisensi: null,                    // null → kelompok B/C
    pdf: null,                        // diisi hanya untuk kelompok A
    baca: { label: 'situs AEA', url: 'https://www.aeaweb.org/articles/pdf/doi/10.1257/pol.20190245' },
    kutipan: {
      utama: {
        halaman: '88', halamanPdf: 1,
        teks: 'We find static effects on many targeted indicators: …',
        sorot: 'under-15 children not in school fell by half',
        mendukung: 'PKH memangkas separuh anak di bawah 15 tahun yang tidak sekolah.',
      },
    },
  },
  islam2018: {
    jenis: 'Analisis isi',
    lisensi: { nama: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    pdf: '/rujukan/islam2018.pdf',
    // …
  },
}

// Solusi yang memakai kutipan selain "utama".
// Kunci tempat: 'kesenjangan.wilayah.Umum.1', 'rekomendasi.transisi', 'provinsi.paud', dst.
export const KUTIPAN_KHUSUS = {
  'kesenjangan.wilayah.Umum.1': { sugiharti2017: 'desa' },
}
```

- `teks`: kutipan **persis** dari PDF, boleh dipotong dengan "…" di awal atau akhir.
- `sorot`: bagian dari `teks` yang disorot di panel dan di penampil PDF.
- `halaman`: nomor halaman tercetak di jurnal. `halamanPdf`: indeks halaman di berkas PDF, dipakai penampil.

### 5.2 Berkas PDF

- Hanya kelompok A, disalin dari `rujukan/` ke `public/rujukan/{id}.pdf`. Totalnya sekitar 7 MB.
- `public/data` tidak berubah. Folder `public/rujukan` adalah folder baru.
- PDF yang disalin harus versi resmi penerbit yang memuat pernyataan lisensinya.

## 6. Teknis

| Bagian | Berkas |
|---|---|
| Data kutipan, lisensi, tautan baca | `src/content/kutipan.js` (baru) |
| Tombol rujukan dan panel bukti | `src/components/TombolRujukan.jsx`, `src/components/PanelBukti.jsx` (baru) |
| Penampil PDF | `src/pages/BacaRujukan.jsx` (baru, dimuat lazy) dan rute `/rujukan/:id` di `App.jsx` |
| Pemakaian | `Kesenjangan.jsx`, `Rekomendasi.jsx`, `RekomendasiList.jsx`, `SolusiBlock.jsx` |
| Berkas PDF | `public/rujukan/*.pdf` (baru) |

- **Dependensi baru: `pdfjs-dist`** dengan versi dikunci. Pustaka ini dan worker-nya hanya dimuat di rute `/rujukan/:id`, jadi halaman lain tidak bertambah berat. Penampil merender kanvas ditambah lapisan teks. Sorotan dicari di lapisan teks dengan pencocokan yang mengabaikan spasi, tanda hubung di akhir baris, dan ligatur (fi, fl).
- **Pola panel:** mengikuti `PanduanAlur` (fase masuk, buka, keluar; interupsi; usap di HP). Logika gerak yang sama dipindah ke hook bersama supaya tidak ditulis dua kali.
- **Tombol rujukan** menggantikan empat cara render tautan sumber yang sekarang berbeda-beda, sehingga semuanya menjadi satu komponen.
- Halaman Metode (daftar pustaka) mendapat kolom kecil "Lisensi" dan tautan "Baca". Bagian ini opsional dan boleh menyusul.

## 7. Tes

1. **Kutipan jujur:** untuk setiap kutipan, `teks` dan `sorot` ditemukan di teks PDF sumbernya setelah dinormalisasi (spasi, tanda hubung, ligatur). Tes berjalan di lingkungan Node memakai `pdfjs-dist`. PDF kelompok B dan C tidak ikut di-deploy, jadi tesnya membaca dari `rujukan/` kalau folder itu ada, dan dilewati di CI kalau tidak ada.
2. Setiap id di semua daftar `sumber` (di `solusi.js`, `rekomendasi.js`, dan `content/rekomendasi.js`) punya entri di `SUMBER`.
3. Setiap rujukan kelompok A punya `pdf` dan `lisensi`. Kelompok B dan C tidak punya `pdf`.
4. Klik tombol rujukan membuka panel berisi kutipan dan "Mendukung". Esc menutup panel dan mengembalikan fokus.
5. Untuk kelompok C, panel menampilkan keterangan hak cipta, dan "Baca selengkapnya" mengarah ke tautan bacaan.
6. Untuk kelompok A, "Baca selengkapnya" mengarah ke `/rujukan/{id}?k={kutipan}`.
7. Penampil PDF menampilkan sorotan di halaman yang benar. Ini dicek manual lewat Playwright di HP 390 px dan desktop 1280 px.
8. Tes lama tetap lolos.

## 8. Urutan kerja

1. Ekstrak kutipan dari PDF untuk setiap pasangan solusi dan rujukan, lalu isi `kutipan.js` dan tes kejujurannya.
2. Buat `TombolRujukan` dan `PanelBukti`, lalu pasang di empat tempat.
3. Buat penampil PDF (`pdfjs-dist`), salin PDF kelompok A, dan tambah rute.
4. Cek di HP dan desktop dengan Playwright, lalu jalankan lint, tes, dan build.
5. Commit atas nama pengguna saja.

Setiap langkah berakhir dalam keadaan siap deploy. Kalau waktu habis setelah langkah 2, panel kutipan sudah bisa dipakai walaupun penampil PDF belum ada.

## 9. Selesai bila

- Semua rujukan di semua solusi membuka panel dengan kutipan yang lolos tes kejujuran.
- Kelompok A membuka PDF dengan sorotan di halaman yang benar. Kelompok B dan C menampilkan keterangan dan tautan yang bisa dibuka.
- Panel berfungsi dengan keyboard, pembaca layar, mode kurangi gerakan, serta di HP dan desktop.
- Lint, tes, dan build lolos. `src/lib`, `public/data`, dan `scripts` tidak berubah.

## 10. Pertanyaan terbuka

- Konfirmasi lisensi empat jurnal di kelompok B (Caniago, Kartasasmita, Purnastuti 2012, Sulistyaningrum).
