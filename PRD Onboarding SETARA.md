# PRD: Onboarding Alur Cerita SETARA

Status: draf, menunggu persetujuan
Cabang: `v2-tampilan`
Terkait: `PRD SETARA v2.md` (alur 4 langkah, penanda alur melayang)

## 1. Masalah

Penanda alur ① ② ③ ④ di bawah layar hanya berisi angka. Pengunjung baru tidak tahu:

- bahwa angka itu urutan membaca, bukan nomor halaman biasa;
- pertanyaan apa yang dijawab setiap langkah;
- bahwa ceritanya sebaiknya dibaca dari 1 sampai 4.

Juri melihat website ini pertama kali saat demo. Dalam beberapa detik pertama mereka harus paham alurnya tanpa dijelaskan lisan.

## 2. Tujuan

1. Dalam satu layar, pengunjung baru memahami bahwa SETARA adalah satu cerita dalam empat langkah dan tahu pertanyaan setiap langkah.
2. Onboarding tidak menghalangi. Bisa ditutup dalam satu ketukan dan tidak muncul lagi setelah ditutup.
3. Penjelasan bisa dibuka lagi kapan saja dari penanda alur.

**Bukan tujuan:**
- tur bertahap per halaman (tooltip berantai);
- video atau animasi intro;
- menjelaskan istilah statistik. Itu tugas "Cara membaca grafik ini" dan halaman Metode.

## 3. Prinsip desain

| Prinsip | Penerapan |
|---|---|
| Purpose | Satu kartu, satu pesan: "satu cerita, empat langkah". Tidak ada slide kedua. |
| Agency | Tidak memaksa. Ada tombol tutup, tombol Esc, dan klik di luar untuk menutup. Bisa dibuka lagi lewat tombol "?". |
| Spatial consistency | Kartu tumbuh dari penanda alur, yaitu elemen yang dijelaskannya. Saat ditutup, kartu kembali mengecil ke sana. |
| Simplicity | Empat baris, masing-masing angka ditambah pertanyaan pendek, lalu satu tombol utama. |
| Familiarity | Angka di kartu memakai gaya lingkaran yang sama persis dengan penanda alur, supaya hubungannya langsung terbaca. |
| Respons | Tombol mengecil sedikit saat ditekan. Animasi bisa diinterupsi: menutup saat sedang membuka langsung berbalik arah. |

## 4. Pengalaman pengguna

### 4.1 Kapan muncul

- **Kunjungan pertama** ke halaman cerita (Ringkasan, Kesenjangan, Provinsi, profil provinsi, Rekomendasi). Kartu muncul sekitar 0,6 detik setelah halaman tampil, agar pengunjung sempat melihat halamannya dulu.
- **Halaman Metode:** tidak muncul, karena Metode tidak punya penanda alur. Kartu muncul saat pengunjung pertama kali masuk ke halaman cerita.
- **Setelah ditutup:** tidak muncul lagi di perangkat itu. Disimpan di `localStorage` dengan kunci `setara-panduan-v1`.
- **Mode demo:** `?panduan=1` di URL selalu memunculkan kartu. Berguna untuk presentasi final, karena laptop yang sama mungkin sudah pernah menutupnya.
- **Penyimpanan tidak tersedia** (mode privat atau diblokir): kartu muncul sekali per sesi dan website tetap berjalan normal.

### 4.2 Isi kartu

```
┌──────────────────────────────────────────┐
│ Satu cerita, empat langkah            ✕  │
│ Ikuti angka di bawah layar dari 1 ke 4.  │
│                                          │
│  ①  Siapa yang paling tertinggal?        │
│      Ringkasan · kelompok paling banyak   │
│      tidak sekolah                        │
│  ②  Seberapa jauh jaraknya?    Anda di sini
│      Kesenjangan · desa–kota, miskin–kaya,│
│      laki-laki–perempuan per jenjang      │
│  ③  Di mana harus mulai dulu?             │
│      Provinsi · indeks prioritas          │
│  ④  Apa yang harus dilakukan?             │
│      Rekomendasi · lima langkah berbasis  │
│      studi                                │
│                                          │
│  Sumber dan rumus ada di menu Metode.     │
│                                          │
│  [ Mulai dari langkah 1 ]   Nanti saja    │
└──────────────────────────────────────────┘
              ( ① ② ③ ④  ? )   ← penanda alur
```

- Teks pertanyaan diambil dari `src/content/alur.js` (`pertanyaan`), sehingga satu sumber dipakai bersama penanda dan "Langkah berikutnya". Keterangan singkat ditambahkan sebagai field baru `isi`.
- **"Anda di sini"** menandai langkah halaman yang sedang dibuka. Lingkaran angkanya terisi gelap, sama seperti di penanda.
- **Tombol utama:**
  - Jika pengunjung bukan di langkah 1, labelnya "Mulai dari langkah 1". Tombol ini menutup kartu, lalu pindah ke Ringkasan dengan transisi geser. Filter tahun dan jenjang ikut terbawa.
  - Jika sudah di langkah 1, labelnya "Mulai membaca" dan tombol hanya menutup kartu.
- **Tombol kedua "Nanti saja"** dan ikon ✕ hanya menutup kartu.
- Tidak ada angka statistik di kartu. Data tetap dihitung di halaman masing-masing.

### 4.3 Tombol "?" di penanda alur

- Penanda alur mendapat tombol kelima di ujung kanan, bertanda "?" dengan label aksesibel "Apa arti angka ini?".
- Menekan tombol ini membuka atau menutup kartu yang sama, dengan `aria-expanded`.
- Lingkaran "?" bergaris putus-putus tipis agar terbaca sebagai bantuan, bukan langkah kelima.

### 4.4 Tata letak

- **Posisi:** kartu menempel di atas penanda alur, rata tengah, dengan jarak 0,75 rem.
- **Lebar:** `min(24rem, 100vw − 2rem)`. Di HP hampir selebar layar dengan jarak tepi 16 px.
- **Tinggi:** jika tidak muat (layar pendek atau huruf diperbesar lewat pengatur ukuran huruf), isi kartu bisa digulir. Tombol tetap terlihat di bagian bawah kartu.
- **Permukaan:** putih solid dengan bayangan sedang. Kartu tidak memakai kaca, agar tidak ada lapisan kaca di atas kaca (penanda alur).
- **Tanpa latar gelap (scrim):** kartu bersifat informatif dan tidak memblokir. Halaman di belakang tetap terlihat dan bisa digulir.

### 4.5 Gerak

| Momen | Gerak | Durasi |
|---|---|---|
| Muncul | opacity 0→1, scale 0.96→1, `transform-origin` di tengah bawah (penanda) | 250 ms, kurva critically damped `cubic-bezier(0.2,0,0,1)` |
| Tutup | jalur yang sama, terbalik | 150 ms |
| Interupsi | transisi CSS berbalik dari nilai saat ini | – |
| Penanda alur saat kartu terbuka | kembali ke ukuran penuh walau halaman sudah digulir | 300 ms |
| Kurangi gerakan | tanpa scale, hanya memudar | 150 ms |

### 4.6 Aksesibilitas

- Kartu memakai `role="dialog"`, `aria-modal="false"`, dan `aria-labelledby` yang menunjuk judul kartu.
- **Saat kartu muncul otomatis:** fokus pindah ke judul kartu (`tabIndex=-1`), agar pembaca layar mengumumkannya.
- **Saat dibuka lewat tombol "?":** fokus pindah ke tombol utama.
- **Esc menutup kartu.** Fokus kembali ke tombol "?". Jika kartu muncul otomatis, fokus kembali ke `main`.
- **Tab** berputar di dalam kartu hanya saat kartu dibuka lewat tombol "?". Saat muncul otomatis, Tab boleh keluar, dan kartu tertutup saat fokus meninggalkannya.
- Daftar langkah memakai `<ol>`. Angka lingkaran disembunyikan dari pembaca layar karena nomor sudah dibacakan dari daftarnya.
- **Kontras tinggi:** batas kartu memakai `--color-garis` yang sudah dipertegas.
- **Cetak:** kartu disembunyikan.

## 5. Teknis

| Bagian | Berkas |
|---|---|
| Teks keterangan langkah (`isi`) | `src/content/alur.js` (tambah field, tanpa angka) |
| Kartu panduan | `src/components/PanduanAlur.jsx` (baru) |
| Status muncul/tutup + penyimpanan | `src/components/panduanAlur.js` (baru): `sudahDilihat()`, `tandaiDilihat()`, dengan try/catch untuk `localStorage` |
| Tombol "?" dan ukuran penuh saat kartu terbuka | `src/components/AlurCerita.jsx` |
| Gaya gerak | `src/index.css` |

- **Tanpa dependensi baru.** Tidak menyentuh `src/lib`, `public/data`, atau `scripts`.
- Kartu dirender di dalam `AlurCerita`, sehingga posisi dan sumber kebenarannya ikut penanda dan otomatis tidak ada di halaman Metode.
- Navigasi "Mulai dari langkah 1" memakai `useKlikGeser`, sehingga transisi geser konsisten.
- Saat kartu ditutup, `?panduan=1` dihapus dari URL dengan `replace`, supaya tidak muncul lagi saat halaman dimuat ulang.

## 6. Tes

1. Kunjungan pertama ke `/` menampilkan dialog "Satu cerita, empat langkah" berisi empat langkah.
2. Menutup kartu lewat ✕, "Nanti saja", atau Esc menyimpan status. Render ulang tidak menampilkannya lagi.
3. `?panduan=1` menampilkan kartu walau statusnya sudah tersimpan.
4. Tombol "?" membuka dan menutup kartu; `aria-expanded` ikut berubah.
5. Di `/provinsi`, langkah 3 ditandai "Anda di sini", dan tombol "Mulai dari langkah 1" berpindah ke `/` dengan filter terbawa.
6. Di `/metode`, kartu tidak muncul.
7. Jika `localStorage` melempar error, aplikasi tidak rusak.
8. Tes lama tetap lolos. Tes yang memeriksa Ringkasan tidak boleh terganggu oleh kartu, karena kartu tidak menutupi heading dan teks temuan.

## 7. Selesai bila

- Semua tes lolos, lint bersih, dan build berhasil.
- Dicek di HP 390 px dan desktop 1280 px, dengan ukuran huruf terkecil dan terbesar.
- Dicek dengan pengaturan kurangi gerakan menyala.
- Di-commit atas nama pengguna saja, tanpa atribusi lain.

## 8. Catatan untuk presentasi

- Buka `setara-web.vercel.app/?panduan=1` di awal demo. Kartu menjelaskan alurnya sendiri, lalu klik "Mulai membaca".
- Kalimat untuk juri: "Setiap angka di bawah adalah satu pertanyaan. Kita baca dari 1 sampai 4."
