# SETARA

SETARA (Statistik Edukasi Terbuka untuk Analisis Rekomendasi Akses) adalah aplikasi web analisis kesenjangan pendidikan Indonesia. Data berasal dari BPS WebAPI, disimpan sebagai berkas JSON statis, dan disajikan dengan React + Vite + Tailwind CSS + Recharts.

## Halaman

- `/`: Ringkasan: tiga temuan utama, empat perbandingan, dumbbell ekonomi, dan estimasi skala dampak.
- `/kesenjangan`: Wilayah, ekonomi, gender: dumbbell, tren 2019–2023, metrik, konteks, solusi berbasis studi.
- `/provinsi`: Peringkat partisipasi usia dini, indeks prioritas, matriks prioritas, tren provinsi.
- `/provinsi/:kode`: Profil provinsi: tren, konteks, estimasi dampak PAUD, rekomendasi kontekstual.
- `/metode`: Sumber, indikator, rumus, asumsi, keterbatasan, dan sitasi.

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Data BPS

Salin `.env.example` menjadi `.env`, lalu isi `BPS_API_KEY`. Jangan commit `.env`.

```bash
npm run fetch:all   # ambil indikator baru (APS, APK PAUD, APK SMA, konteks, populasi)
npm run fetch       # ambil data anak tidak sekolah dan partisipasi usia dini (2015-2023)
npm run validate:data
```

Berkas utama:

- `public/data/tidak_sekolah.json`: angka anak tidak sekolah.
- `public/data/provinsi.json`: partisipasi pembelajaran satu tahun sebelum SD.
- `public/data/indikator.json`: indikator baru yang dinormalisasi.
- `public/data/meta.json`: sumber, tahun, jumlah baris, dan keterbatasan.

Catatan: var `1984/1986/1988/1990` tersedia sampai 2023. Indikator partisipasi yang lebih baru (`2211`, `1439`, `1429`, `192`, `413`, `2196`, dan lain-lain) tidak dicampur dalam grafik yang sama dengan angka anak tidak sekolah.

## Test dan kualitas

```bash
npm run lint
npm test
npm run build
```

Test mencakup fungsi metrik, temuan otomatis, estimasi dampak, indeks prioritas, rekomendasi, ekspor CSV, dan smoke test halaman utama.

## Metode singkat

- Selisih: nilai tertinggi dikurangi terendah, dalam poin persentase.
- Rasio: nilai tertinggi dibagi terendah.
- Indeks prioritas: rata-rata skor persentil enam indikator (partisipasi SMA, APK PAUD, lama sekolah, kemiskinan, IPM, ketimpangan gender), bobot sama.
- Estimasi jumlah anak: persentase selisih × populasi usia sekolah. Populasi provinsi memakai distribusi umur SP2020 yang diskalakan ke total penduduk 2025.
- Rekomendasi: aturan if–then berbasis indikator, bukan model prediktif.

Aplikasi bersifat deskriptif. Korelasi tidak diklaim sebagai sebab-akibat. Angka estimasi diberi label dan asumsi; verifikasi tabel BPS sebelum dikutip.

## Deploy

Deploy statis ke Vercel. `vercel.json` sudah mengarahkan semua rute ke `index.html` agar React Router bekerja.
