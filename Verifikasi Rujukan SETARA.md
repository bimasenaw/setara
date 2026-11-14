# Verifikasi Rujukan SETARA

Diperiksa: 14 November 2026
Bahan: 22 rujukan di `src/lib/solusi.js`, ditambah komentar Roodman (2022) terhadap Duflo (2001). PDF disimpan di folder `rujukan/`.
Cara: setiap kalimat di situs yang mengutip rujukan dicocokkan dengan abstrak, hasil, dan kesimpulan jurnalnya. Data rujukan (penulis, tahun, jurnal, DOI) dicek ke Crossref dan doi.org.

## 1. Ringkasan

| Hasil | Jumlah | Rujukan |
|---|---|---|
| Didukung | 9 | Cahyadi, Caniago, Kartasasmita, Sugiharti, Harahap, Karimah, Asadullah, Himaz, Purnastuti 2012 |
| Didukung sebagian, kalimat dihaluskan | 6 | Duflo, Utomo, Petrosino, Setyadi, Brinkman, Purnastuti 2015 |
| Tidak didukung, kalimat diperbaiki | 6 | Hudang, Sulistyaningrum, Samosir, Siddique, Islam, Pratiwi |
| Tidak dipakai di klaim mana pun | 1 | Behrman & Deolalikar (1991) |

**Data rujukan:**
- Satu DOI rusak, yaitu Setyadi (2022). Situs memakai `10.20884/…`, padahal yang terdaftar `10.32424/1.erjpe.2022.17.1.2895`. Sudah diperbaiki di situs. **Esai memuat DOI salah yang sama.**
- Siddique & Heriqbaldi (2021): kepala PDF menulis volume 17, tetapi Crossref mencatat volume 16 nomor 2. Situs sudah benar.

## 2. Klaim yang diperbaiki

| Rujukan | Klaim lama | Isi jurnal | Kalimat baru |
|---|---|---|---|
| Hudang et al. (2024) | PKH menaikkan partisipasi sekolah, dan bantuan tunai "terbukti" menyalurkan bantuan pendidikan | PKH berpengaruh signifikan pada konsumsi pangan, tetapi pengaruhnya pada capaian pendidikan anak negatif dan tidak signifikan (IFLS 2007–2014, DID) | Dipakai sebagai catatan: "studi lain tidak menemukan efek signifikan pada capaian pendidikan, sehingga ketepatan sasaran perlu dipantau". Tidak lagi dipakai sebagai bukti bahwa PKH menaikkan partisipasi. |
| Sulistyaningrum (2016) | BOS "terbukti menaikkan partisipasi sekolah" | Yang diukur nilai tes. BOS menaikkan nilai tes, dan subsidinya baru menutup biaya sekolah | Klaim partisipasi memakai Kartasasmita (2021). Sulistyaningrum dipakai untuk beban biaya di luar uang sekolah. |
| Samosir (2021) | Usia dan jumlah anak menentukan risiko mengulang kelas | Data makro 1971–2018: angka mengulang dikaitkan dengan pertumbuhan penduduk dan jumlah sambungan telepon | "Angka mengulang kelas lebih tinggi ketika pertumbuhan penduduk tidak diimbangi fasilitas dan guru." |
| Siddique & Heriqbaldi (2021) | Determinan partisipasi berbeda antara desa dan kota | Hanya Riau, tanpa variabel desa/kota. Faktornya pendidikan kepala rumah tangga, kesejahteraan, dan gender | Klaim desa-kota memakai Sugiharti (2017), yang menguji lokasi. |
| Islam & Asadullah (2018) | Stereotip di buku teks memengaruhi partisipasi sekolah | Analisis isi buku teks, tanpa mengukur partisipasi. Biasnya merugikan perempuan, dan buku Indonesia termasuk yang paling setara | "Buku teks sekolah menengah di kawasan ini masih memuat stereotip gender." |
| Pratiwi & Hasbullah (2021) | Pembelajaran jarak jauh PAUD dapat menjangkau daerah terpencil di Papua | Studi deskriptif di 6 lembaga PAUD di Jayapura selama pandemi | "Pengalaman PAUD jarak jauh di Jayapura dapat menjadi bahan rancangan layanan untuk wilayah yang sulit dijangkau." |
| Duflo (2001) | Pembangunan sekolah menaikkan partisipasi dan pendapatan, termasuk untuk SMA | Studi pembangunan **SD** INPRES. Roodman (2022) menyimpulkan efek pada lama sekolah total dan upah belum jelas, sedangkan kenaikan tamat SD paling kuat | "Pembangunan SD INPRES menaikkan jumlah anak yang menamatkan SD." Tidak lagi dipakai untuk SMA. |
| Utomo et al. (2014) | Putus SMA berdampak pada pendapatan | Anak yang putus sebelum usia 16 di Jabodetabek. Sekitar 30% tidak bekerja maupun belajar pada usia 12–18 | "Remaja yang putus sekolah lebih awal banyak yang tidak bekerja maupun belajar." |
| Petrosino et al. (2012) | Juga dipakai untuk literasi orang dewasa | Ulasan sistematis 73 studi tentang partisipasi sekolah anak. Sekolah baru dan infrastruktur memberi efek terbesar (d = 0,44) | Dihapus dari rekomendasi literasi dewasa. |
| Setyadi (2022) | Dipakai untuk perluasan PAUD | Belanja pendidikan dan celah gender terhadap ketimpangan pendidikan (2019–2020) | Dihapus dari klaim PAUD. Tetap dipakai untuk belanja pemerintah dan celah gender. |
| Brinkman et al. (2017) | PAUD menaikkan partisipasi dan perkembangan anak | Partisipasi naik 7–9 poin. Dampak rata-rata pada perkembangan kecil, dan lebih terasa pada anak dari keluarga kurang mampu | "Menaikkan partisipasi PAUD, dengan manfaat perkembangan terbesar bagi anak dari keluarga kurang mampu." |

Angka di situs tidak ada yang berubah. Yang berubah hanya teks klaim dan daftar sumbernya, di `src/lib/solusi.js`, `src/lib/rekomendasi.js`, dan `src/content/rekomendasi.js`.

## 3. Rujukan yang didukung

| Rujukan | Temuan yang dipakai |
|---|---|
| Cahyadi et al. (2020) | Uji acak 6 tahun: anak di bawah 15 tahun yang tidak sekolah turun separuh. Stunting turun 23%. |
| Caniago et al. (2021) | PIP menaikkan peluang masuk SMA sebesar 15–25% pada 40% rumah tangga termiskin, dengan efek lebih besar di desa dan pada anak perempuan. |
| Kartasasmita & Sulistyaningrum (2021) | Siswa yang sekolahnya menerima BOS saat SD lebih mungkin melanjutkan ke SMA. |
| Sugiharti (2017) | Kemiskinan, pendidikan orang tua, dan lokasi desa menurunkan peluang bersekolah di jenjang menengah. Ketimpangan pendidikan tertinggi di Papua. Anak laki-laki menghadapi tarik-menarik antara sekolah dan bekerja. |
| Harahap et al. (2020) | Ketimpangan pendapatan, kemiskinan, dan celah gender berhubungan positif dengan ketimpangan pendidikan. |
| Karimah & Susanti (2022) | Kesetaraan lama sekolah perempuan dan laki-laki berkaitan positif dengan pertumbuhan PDRB. |
| Asadullah & Maliki (2018) | Pilihan jenis sekolah berbeda menurut gender. |
| Himaz & Aturupane (2021) | Biaya kesempatan bersekolah lebih berat bagi laki-laki. Sebagian besar celah tetap tidak terjelaskan. |
| Purnastuti (2012) | Pendidikan orang tua dan pendapatan rumah tangga menentukan partisipasi sekolah (data IFLS 1993). |

## 4. Persiapan tanya-jawab

**"Studi Hudang (2024) bilang PKH tidak berpengaruh pada pendidikan. Kenapa tetap direkomendasikan?"**
- Bukti terkuat datang dari uji acak Cahyadi et al. (2020): setelah 6 tahun, jumlah anak di bawah 15 tahun yang tidak sekolah turun separuh.
- Hudang memakai data survei dan metode DID, dan menyimpulkan bahwa penyaluran perlu dipantau.
- Karena itu rekomendasi SETARA berbunyi "perluas **dan pertajam**": selain diperluas, sasarannya diperbaiki.

**"Duflo (2001) sudah dikritik Roodman. Masih valid?"**
- Roodman (2022) mempertanyakan efek pada lama sekolah total dan upah.
- Roodman juga menyatakan bahwa kenaikan anak yang menamatkan SD tetap masuk akal di semua tindak lanjut.
- SETARA hanya memakai klaim yang paling kuat itu. Untuk sekolah menengah, SETARA bersandar pada ulasan sistematis Petrosino et al. (2012) dan data Sugiharti (2017).

**"Kenapa DOI Setyadi di esai tidak bisa dibuka?"**
- Ada salah ketik di awalan DOI (`20884` seharusnya `32424`). Di situs sudah diperbaiki.

**"Apakah rekomendasi ini sebab-akibat?"**
- Tidak semuanya. Uji acak (Cahyadi) dan ulasan sistematis (Petrosino) adalah bukti terkuat.
- Studi lain bersifat korelasional. Hubungan antara temuan data dan rekomendasi bersifat indikatif, seperti yang dijelaskan di halaman Metode.

## 5. Tindak lanjut

- Ganti nama PDF `Duflo, E. (2001)….pdf` menjadi Roodman (2022), karena isinya komentar Roodman.
- Hapus PDF Setyadi yang lama dari `rujukan/`. Isinya makalah lain di Gorontalo Development Review.
- Perbaiki DOI Setyadi dan klaim Hudang di slide presentasi kalau keduanya dikutip.
