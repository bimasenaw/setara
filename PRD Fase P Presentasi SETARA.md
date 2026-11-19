# PRD: Fase P, persiapan presentasi final

Status: draf pertama (19 November 2026). File rencana awal: `Presentasi/SETARA-Final-Rencana.pptx`
Terkait: `indikator_penilaian_babak_final.md`, `Verifikasi Rujukan SETARA.md`, `PRD Matematika Indeks SETARA.md`

## 1. Format dan penilaian

- Presentasi **10 menit**, lalu tanya jawab **10 menit**.
- Tema babak final: *"Exploring Mathematics, Revealing The Unknowns"*.

| Kriteria | Bobot | Cara SETARA memenuhinya |
|---|---|---|
| Penguasaan materi dan tanya jawab | 25% | Bank tanya jawab (bagian 5), tautan langsung `#perhitungan` dan `#kepekaan`, laporan verifikasi rujukan |
| Kreativitas dan orisinalitas | 20% | Indeks persentil 6 indikator, uji kepekaan, alur KUAT, bukti studi yang bisa dibuka dan disorot |
| Cara penyampaian | 20% | Satu cerita 4 babak (K–U–A–T), satu pesan per slide, dibuka dengan "1 dari 5 anak" |
| Aktualisasi gagasan | 15% | Website hidup dengan data BPS, rekomendasi per provinsi, unduhan CSV yang rapi di Excel |
| Manajemen waktu | 10% | Waktu per slide (bagian 3), latihan dengan pengatur waktu |
| Kerapihan PPT | 10% | Warna dan huruf SETARA, satu pesan per slide, tangkapan layar asli |

## 2. Pesan utama

**Satu kalimat:** SETARA memakai matematika sederhana yang bisa diperiksa (selisih, rasio, persentil, rata-rata) untuk mengungkap anak yang paling tertinggal dari data BPS, lalu menunjukkan di mana harus mulai dan apa tindakannya, dengan bukti yang bisa dibuka.

**"Yang tersembunyi" yang diungkap** (semua dari data, Susenas 2023 dan indikator provinsi BPS):

| Temuan | Angka |
|---|---|
| Sekitar 1 dari 5 anak usia SMA tidak bersekolah | 21,6% |
| Anak dari keluarga termiskin dua kali lebih sering tidak sekolah di SMA | 30,7% vs 14,7% (rasio 2,1×) |
| Di SD selisih desa–kota kecil, tetapi rasionya terbesar | 1,12% vs 0,32%: selisih 0,8 poin, rasio 3,5× |
| Lonjakan di setiap perpindahan jenjang | SD 0,7% → SMP 6,9% → SMA 21,6% |
| Anak laki-laki, bukan perempuan, yang lebih banyak tidak sekolah di SMA | 23,8% vs 19,3% |
| Papua Pegunungan: APK PAUD hanya 3,10% | skor indeks 99,1, peringkat 1 |
| Tiga provinsi teratas tetap sama walau satu indikator dihapus | 6 dari 6 uji |

## 3. Alur 10 menit

| Waktu | Slide | Babak | Pesan |
|---|---|---|---|
| 0:00–0:20 | 1 | Judul | SETARA, nama, nomor peserta |
| 0:20–1:00 | 2 | Pembuka | Sekitar 1 dari 5 anak usia SMA tidak bersekolah |
| 1:00–1:50 | 3 | Gagasan | Data BPS → empat pertanyaan KUAT → website yang bisa diperiksa |
| 1:50–3:00 | 4 | **K**enali | Termiskin dua kali lebih sering tidak sekolah; laki-laki lebih tertinggal |
| 3:00–4:10 | 5 | **U**kur | Selisih vs rasio: di SD selisihnya kecil tetapi rasionya 3,5×; lonjakan antarjenjang |
| 4:10–5:30 | 6 | **A**rahkan (1) | Indeks persentil, dengan contoh Papua Pegunungan = 99,1 |
| 5:30–6:30 | 7 | **A**rahkan (2) | Uji kepekaan: tiga teratas kokoh; 38 provinsi dalam 4 kuadran |
| 6:30–8:00 | 8 | **T**indak | Lima langkah kebijakan, buktinya bisa dibuka dan disorot di PDF |
| 8:00–9:00 | 9 | Kejujuran | 22 rujukan diperiksa, 1 DOI esai salah ketik, klaim dilunakkan, batasan indeks |
| 9:00–10:00 | 10 | Penutup | Sekitar 424 ribu anak berpotensi kembali sekolah bila termiskin setara terkaya |
| (cadangan) | 11–12 | Tanya jawab | Jawaban singkat 6 pertanyaan matematis, tautan demo |

Patokan: sekitar 1 menit per slide. Kalau waktu menipis, slide 7 dipersingkat menjadi satu kalimat (kuadran dilewati).

## 4. Demo

**Utama: tangkapan layar di slide.** Ini tidak bergantung pada internet. Semua tangkapan layar diambil dari situs versi terbaru dan disimpan di `Presentasi/Tangkapan/`.

**Demo langsung, opsional, paling lama 60 detik.** Dilakukan di slide 6 atau 8, hanya bila internet stabil:
1. `setara-web.vercel.app/provinsi/9700#perhitungan`: perhitungan skor langsung terbuka.
2. Rekomendasi → ketuk nama studi → PDF terbuka dengan kalimat yang disorot.

**Cadangan bila internet mati:**
- Jalankan `npm run build` lalu `npm run preview` di laptop. Semua data dan PDF ada di dalam folder proyek, jadi tidak perlu internet.
- Bila laptop bermasalah, slide sudah memuat tangkapan layar dari setiap langkah.

**Syarat sebelum hari H:** cabang `v2-tampilan` di-push, preview Vercel dicek di HP, lalu di-merge ke `main` dan dideploy, paling lambat H-2. Ini masih menunggu pengguna.

## 5. Bank tanya jawab

**Matematika (paling mungkin ditanyakan):**
1. **Kenapa persentil, bukan min–max atau z-score?** Persentil tahan terhadap nilai ekstrem. APK PAUD 3,10% di Papua Pegunungan tidak menekan skor provinsi lain. Kelemahannya, jarak antarnilai hilang dan hanya urutan yang dipakai.
2. **Kenapa bobotnya sama?** Tidak ada dasar teori yang lebih kuat untuk bobot lain, dan bobot sama mudah diperiksa. Uji kepekaan: tiga teratas tetap sama walau indikator mana pun dihapus; peringkat 4–5 memang peka. Tunjukkan `/provinsi#kepekaan`.
3. **Bagaimana dengan nilai kembar?** Ada 8 pasang nilai kembar. Rumus memberi persentil berbeda menurut urutan data, dengan pengaruh paling banyak sekitar 0,45 poin indeks (100 ÷ 37 ÷ 6). Lima teratas tidak berubah. Ini sudah tertulis terbuka di Metode.
4. **Dari mana angka 424 ribu anak?** Populasi usia SMA × 20% (satu kuintil) × selisih 16,0 poin. Asumsinya anak tersebar rata di setiap kuintil. Keluarga miskin cenderung punya lebih banyak anak, jadi angka ini kemungkinan di bawah angka sebenarnya. Ini perkiraan, bukan sensus.
5. **Selisih atau rasio, mana yang benar?** Keduanya, untuk pertanyaan yang berbeda. Selisih menjawab "berapa banyak anak", rasio menjawab "berapa kali lipat peluangnya". Di SD selisihnya 0,8 poin tetapi rasionya 3,5×.
6. **Kuadran ditentukan bagaimana?** Ada dua garis pembagi. Untuk tingkat partisipasi SMA terbaru, garisnya adalah median 38 provinsi, supaya tidak terpengaruh nilai ekstrem. Untuk tren sejak 2019, garisnya 0: naik atau turun. Hasilnya: di bawah median dan tidak naik = mendesak (6 provinsi); di bawah median tetapi naik = membaik (13); di atas median tetapi turun = pantau (3); di atas median dan naik = berhasil (16). Catatan: empat provinsi hasil pemekaran Papua baru punya data sejak 2024, jadi trennya hanya 2024–2025; tren Papua dan Papua Barat sejak 2019 tidak sebanding karena wilayahnya berubah. Keduanya ditandai di situs.

**Data:**
7. **Apakah selisih kecil itu signifikan?** Data berasal dari survei sampel (Susenas), dan SETARA belum menampilkan galat baku. Selisih kecil dibaca hati-hati; ini tertulis di setiap grafik.
8. **Kenapa data anak tidak sekolah sampai 2023, sedangkan indikator provinsi sampai 2025?** Variabel anak tidak sekolah di API BPS tersedia sampai 2023. Indikator provinsi memakai tahun terbaru yang tersedia, dan keduanya tidak dicampur dalam satu grafik.
9. **Kenapa ada dua angka PAUD Papua (62,98% dan 21,71%)?** Indikatornya berbeda: partisipasi pembelajaran setahun sebelum SD (2023) dan APK PAUD 3–6 tahun (2025). Kini keduanya disebut namanya di situs.

**Rujukan dan klaim:**
10. **Hudang (2024) bilang PKH tidak berpengaruh. Kenapa tetap direkomendasikan?** Bukti terkuat adalah uji acak Cahyadi et al. (2020): anak tidak sekolah turun separuh. Hudang menjadi alasan kata "pertajam": sasarannya harus dipantau.
11. **DOI Setyadi di esai tidak bisa dibuka?** Ada salah ketik awalan (`20884` seharusnya `32424`). Sudah diperbaiki di situs. Akui sejak awal di slide 9.
12. **Apakah rekomendasi ini sebab-akibat?** Tidak semuanya. Uji acak (Cahyadi) dan ulasan sistematis (Petrosino) adalah bukti terkuat; sisanya korelasional. Jenis studinya tertera di setiap kutipan.
13. **Kenapa anak laki-laki lebih tertinggal?** Datanya menunjukkan begitu di tingkat nasional. Penyebabnya di Indonesia belum dibuktikan kuat, jadi SETARA tidak mengklaim penyebabnya. Bank Dunia (2020) menunjukkan arahnya berbeda antardaerah, maka dukungan diarahkan menurut daerah.

**Gagasan dan dampak:**
14. **Apa bedanya SETARA dengan dashboard BPS?** BPS menyajikan angka. SETARA menyusunnya menjadi empat pertanyaan berurutan, menggabungkannya menjadi indeks prioritas yang bisa diperiksa, dan mengaitkannya dengan studi yang bisa dibaca langsung.
15. **Siapa penggunanya?** Pemerintah daerah dan dinas pendidikan untuk menentukan prioritas, guru dan siswa untuk belajar membaca data, dan siapa pun yang ingin memeriksa klaim kebijakan.
16. **Kenapa tampilan situs berbeda dari gambar di esai?** Setelah esai dikirim, tampilannya disusun ulang agar tujuannya lebih jelas. Datanya tidak berubah, dan angkanya tetap sama dengan esai.

## 6. Isi PPTX rencana awal

`Presentasi/SETARA-Final-Rencana.pptx`:
- 10 slide inti dan 2 slide cadangan, rasio 16:9.
- Warna dan huruf mengikuti SETARA: tinta `18212C`, merah `C2372D`, biru `6F8CAB`, kertas `F5F6F8`. Huruf Cambria untuk judul dan Calibri untuk isi, yang tersedia di Office.
- Setiap slide punya **catatan pembicara**: naskah, waktu, dan transisi ke slide berikutnya.
- Grafik dibuat dengan grafik bawaan PowerPoint, sehingga bisa diedit.
- Tangkapan layar diambil dari situs versi terbaru.

Ini **rencana awal**, belum desain akhir. Yang perlu ditinjau pengguna:
1. Urutan dan pesan tiap slide.
2. Naskah di catatan pembicara, disesuaikan dengan gaya bicara sendiri.
3. Apakah demo langsung dipakai atau cukup tangkapan layar.

## 7. Latihan dan cek hari H

- **H-3:** baca naskah dengan pengatur waktu dua kali. Target 9:30, menyisakan 30 detik cadangan.
- **H-2:**
  - merge dan deploy
  - cek `setara-web.vercel.app` di HP dan laptop
  - latihan tanya jawab: orang lain memilih acak dari bagian 5
- **H-1:** siapkan cadangan offline (`npm run preview`) dan isi baterai.
- **Hari H:**
  - buka tab `/provinsi/9700#perhitungan`, `/provinsi#kepekaan`, dan `/rekomendasi` lebih dulu
  - matikan notifikasi
  - atur zoom browser 125% supaya terbaca dari belakang ruangan

## 8. Belum dikerjakan

- Push, cek preview Vercel, merge ke `main`, dan deploy (menunggu pengguna).
- Commit perubahan Fase "Matematika Indeks" (menunggu pengguna).
- ~~Video demo cadangan~~ **selesai (2026-11-19):** `Presentasi/Video/demo-cadangan.webm`, 59 detik, 1280×720, tanpa suara. Urutannya: Ringkasan (tiga temuan), Kesenjangan (batang desa-kota), Provinsi (uji kepekaan, kuadran), profil Papua Pegunungan (#perhitungan), Rekomendasi, lalu kutipan Caniago yang disorot. Bisa diputar di Edge atau disisipkan ke slide 12. Rekam ulang dari situs lokal: `Presentasi/sumber-deck/rekam-demo.cjs`. Saat pindah ke profil ada kerangka muat sekitar 1 detik (dari server dev).

## 9. Deck fokus demo (19 November 2026)

Pengguna memilih demo langsung sebagai inti presentasi. File: `Presentasi/SETARA-Final-Demo.pptx`, dibuat oleh `Presentasi/sumber-deck/buat-demo.js` (jalankan `npm install` lalu `NODE_PATH=./node_modules node buat-demo.js` dari folder itu). Deck lama `SETARA-Final-Rencana.pptx` tetap disimpan sebagai cadangan.

| Waktu | Bagian | Isi |
|---|---|---|
| 0:00–4:00 | Slide 1–7 | Judul; 21,6% (1 dari 5); tiga hal tersembunyi (2,1×, lonjakan jenjang, laki-laki); KUAT = 4 halaman; tiga alat matematika (selisih/rasio, persentil, uji kepekaan); "Mari kita buka SETARA" + pratinjau situs (demo dibuka sendiri oleh presenter); **slide 7 "Demo langsung: empat perhentian"** (tangkapan layar + waktu tiap halaman, naskah demo di catatannya) |
| 4:00–9:00 | Demo langsung, satu blok | Ringkasan → Kesenjangan → `/provinsi#kepekaan` → `/provinsi/9700#perhitungan` → Rekomendasi (Caniago tersorot) |
| 9:00–10:00 | Slide 8–9 | ≈424 ribu anak + tiga hal yang dijaga; terima kasih + QR |
| Cadangan | Slide 10–12 | Video demo (`Presentasi/Video/demo-cadangan.mp4`, tertanam); jawaban matematika; urutan tab dan rencana darurat |

**Bagian situs yang dulu dihindari saat demo** sudah diperbaiki (19 November 2026, lihat `PRD Perbaikan Demo SETARA.md`): perkiraan anak PAUD per provinsi tidak lagi separuh, dan teks kuadran di Metode sudah sesuai cara hitung. Naskah dan catatan deck tidak lagi memuat peringatan "HINDARI".
