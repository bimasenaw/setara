// Bukti di balik setiap rujukan: kutipan asli dari jurnal, halaman, lisensi, dan tempat membacanya.
// Lihat "PRD Rujukan Interaktif SETARA.md" dan "Verifikasi Rujukan SETARA.md".
//
// Aturan:
// - `teks` disalin persis dari PDF. Boleh dipotong di awal/akhir. Tes kutipan.test.js memeriksanya.
// - `sorot` adalah bagian dari `teks` yang disorot.
// - `cek` hanya dipakai bila `teks` melewati pergantian halaman (nomor halaman di tengah kalimat).
// - `halaman` = nomor halaman tercetak; `halamanPdf` = urutan halaman di berkas PDF yang dikutip.
// - `lisensi` diisi hanya bila lisensi terbuka sudah dipastikan. Hanya rujukan berlisensi yang PDF-nya
//   ditampilkan di SETARA (`pdf`). Rujukan lain dibaca lewat `baca` di situs aslinya.

const CC_BY_4 = { nama: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' }
const CC_BY_SA_4 = { nama: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' }
const CC_BY_3 = { nama: 'CC BY 3.0', url: 'https://creativecommons.org/licenses/by/3.0/' }
const CC_BY_NC_2 = { nama: 'CC BY-NC 2.0', url: 'https://creativecommons.org/licenses/by-nc/2.0/' }
const CC_BY_NC_SA_4 = { nama: 'CC BY-NC-SA 4.0', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' }

export const SUMBER = {
  filmer2004: {
    jenis: 'Survei lintas negara',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Bank Dunia (Working Paper 3340)',
      url: 'http://documents.worldbank.org/curated/en/208311468779412280/pdf/wps3340.pdf#page=2',
    },
    kutipan: {
      utama: {
        halaman: 'ii (abstrak)',
        halamanPdf: 2,
        teks: 'Although increasing school availability by decreasing the average distance to schools can be a tool for increasing enrollments, it cannot be expected to have a substantial effect. Other interventions, such as those geared toward increasing the demand for schooling or increasing the quality of schooling should be prioritized.',
        sorot: ['it cannot be expected to have a substantial effect', 'increasing the demand for schooling'],
        mendukung:
          'Studi di 21 daerah perdesaan di negara miskin (bukan khusus Indonesia): jarak ke sekolah berkaitan dengan partisipasi, tetapi pengaruhnya kecil. Pembangunan sekolah perlu disertai upaya menaikkan permintaan, misalnya bantuan biaya.',
      },
    },
  },
  jung2014: {
    jenis: 'Kuasi-eksperimen',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Bank Dunia (Working Paper 6794)',
      url: 'http://documents.worldbank.org/curated/en/317381468038953682/pdf/WPS6794.pdf#page=2',
    },
    kutipan: {
      utama: {
        halaman: 'abstrak',
        halamanPdf: 2,
        // Urutan teks PDF menyisipkan catatan kaki di tengah kalimat, jadi dicocokkan per potongan.
        cek: [
          'There is clear evidence that in project villages, the achievement gap',
          'between richer and poorer children decreased on many dimensions. By contrast, in non-project villages, this gap either increased or stayed constant.',
        ],
        teks: 'There is clear evidence that in project villages, the achievement gap between richer and poorer children decreased on many dimensions. By contrast, in non-project villages, this gap either increased or stayed constant.',
        sorot: ['the achievement gap between richer and poorer children decreased on many dimensions'],
        mendukung:
          'Proyek PAUD berbasis desa (310 desa, sekitar 3.000 anak) mempersempit kesenjangan capaian antara anak kaya dan miskin. Di desa tanpa proyek, kesenjangan itu tetap atau melebar.',
      },
    },
  },
  sirait2019: {
    jenis: 'Data panel',
    lisensi: CC_BY_NC_SA_4,
    pdf: '/rujukan/sirait2019.pdf',
    baca: { label: 'Jurnal Budget', url: 'https://doi.org/10.22212/jbudget.v4i1.24' },
    kutipan: {
      utama: {
        halaman: '37',
        halamanPdf: 14,
        teks: 'jarak ke sekolah berpengaruh negatif dan signifikan secara statistik terhadap Angka Partisipasi Murni (APM). Artinya, jarak dari tempat tinggal ke sekolah yang semakin jauh akan mendorong penurunan angka partisipasi sekolah.',
        sorot: [
          'jarak ke sekolah berpengaruh negatif dan signifikan secara statistik terhadap Angka Partisipasi Murni',
        ],
        mendukung:
          'Data 33 provinsi (2010–2017): makin jauh jarak ke sekolah, makin rendah partisipasi SMP. Pengaruhnya pada angka putus sekolah searah, tetapi tidak signifikan.',
      },
    },
  },
  surbakti2020: {
    jenis: 'Tinjauan subnasional',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Bank Dunia (Policy Research Working Paper 9282)',
      url: 'http://documents.worldbank.org/curated/en/603641592335430591/pdf/Inclusion-in-Indonesias-Education-Sector-A-Subnational-Review-of-Gender-Gaps-and-Children-with-Disabilities.pdf#page=10',
    },
    kutipan: {
      utama: {
        halaman: '8',
        halamanPdf: 10,
        teks: 'At the national level, the GPI in school participation conveys that there is no gender disparity in favor of males, but sub-nationally there is considerable variation in gender disparity, with girls at a disadvantage in many districts and boys at a disadvantage in others. This condition holds across all education levels.',
        sorot: ['girls at a disadvantage in many districts and boys at a disadvantage in others'],
        mendukung:
          'Secara nasional tidak ada kesenjangan gender yang merugikan perempuan. Di tingkat kabupaten/kota, sebagian daerah merugikan perempuan dan sebagian lain merugikan laki-laki.',
      },
    },
  },
  asadullah2018: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: { label: 'IZA (versi kertas kerja)', url: 'https://www.iza.org/publications/dp11362' },
    kutipan: {
      utama: {
        halaman: '96 (abstrak)',
        teks: 'Moreover, girls are significantly more likely to be in madrasahs, irrespective of their locations, while boys enjoy a higher probability of enrolment in non-madrasah schools, particularly in urban areas.',
        sorot: [
          'girls are significantly more likely to be in madrasahs',
          'boys enjoy a higher probability of enrolment in non-madrasah schools',
        ],
        mendukung:
          'Di Indonesia, pilihan jenis sekolah berbeda menurut gender: anak perempuan lebih banyak di madrasah, anak laki-laki di sekolah umum.',
      },
    },
  },
  behrman1991: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Wiley (PDF gratis)',
      url: 'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/j.1468-0084.1991.mp53004007.x',
    },
    kutipan: {},
  },
  brinkman2017: {
    jenis: 'Kuasi-eksperimen',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'VU Research Portal',
      url: 'https://research.vu.nl/en/publications/d4b84b15-354d-471c-b25e-ea6513f37dfc',
    },
    kutipan: {
      utama: {
        halaman: 'S305',
        halamanPdf: 2,
        teks: 'Instrumental variables and difference-in-differences models indicate that while the intervention raised enrollment rates and durations of enrollment for everyone, on average, there was little impact on child development. The two models correspond to different durations of project exposure. The difference-in-differences model captures greater exposure and shows that there are modest and sustained impacts on child development—especially for children from more disadvantaged backgrounds.',
        sorot: [
          'the intervention raised enrollment rates and durations of enrollment for everyone',
          'modest and sustained impacts on child development—especially for children from more disadvantaged backgrounds',
        ],
        mendukung:
          'Kelompok bermain di desa menaikkan partisipasi PAUD. Dampaknya pada perkembangan anak kecil secara rata-rata, tetapi bertahan pada anak dari keluarga kurang mampu.',
      },
    },
  },
  cahyadi2020: {
    jenis: 'Uji acak',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'situs AEA (PDF gratis)',
      url: 'https://www.aeaweb.org/articles/pdf/doi/10.1257/pol.20190245',
    },
    kutipan: {
      utama: {
        halaman: '88',
        halamanPdf: 1,
        teks: 'We find static effects on many targeted indicators: childbirth using trained professionals increased dramatically, and under-15 children not in school fell by half.',
        sorot: ['under-15 children not in school fell by half'],
        mendukung: 'Uji acak enam tahun: PKH memangkas separuh anak di bawah 15 tahun yang tidak sekolah.',
      },
    },
  },
  caniago2021: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Economics Development Analysis Journal',
      url: 'https://journal.unnes.ac.id/sju/index.php/edaj/article/download/43922/19041',
    },
    kutipan: {
      utama: {
        halaman: '184 (abstrak)',
        halamanPdf: 1,
        teks: 'Administration of PIP to 16-18 years old children from the 40% lowest expenditure group will increase their chance to participate in senior high school/equivalent by 15-25 percent.',
        sorot: [
          'will increase their chance to participate in senior high school/equivalent by 15-25 percent',
        ],
        mendukung:
          'Bantuan PIP menaikkan peluang anak 16–18 tahun dari 40% rumah tangga termiskin untuk bersekolah di SMA sebesar 15–25%.',
      },
    },
  },
  duflo2001: {
    jenis: 'Kuasi-eksperimen',
    lisensi: null,
    pdf: null,
    baca: { label: 'NBER (Working Paper 7860)', url: 'https://www.nber.org/papers/w7860' },
    kutipan: {
      utama: {
        halaman: 'abstrak (versi NBER)',
        halamanPdf: 2,
        teks: 'The estimates suggest that the construction of primary schools led to an increase in education and earnings.',
        sorot: ['the construction of primary schools led to an increase in education'],
        mendukung:
          'Pembangunan SD INPRES menaikkan pendidikan anak. Tinjauan ulang Roodman (2022) menilai kenaikan jumlah anak yang menamatkan SD sebagai temuan yang paling kokoh, sedangkan efeknya pada upah masih diperdebatkan.',
        // Teks PDF NBER memakai font tanpa peta Unicode, jadi tidak bisa dicocokkan otomatis.
        // Kalimat ini dicocokkan manual dengan abstrak di halaman 2 PDF NBER dan abstrak AER.
        manual: 'Font PDF NBER tidak terbaca mesin; dicocokkan manual dengan abstrak.',
      },
    },
  },
  harahap2020: {
    jenis: 'Data panel',
    lisensi: CC_BY_SA_4,
    pdf: '/rujukan/harahap2020.pdf',
    baca: { label: 'BIRCI-Journal', url: 'https://doi.org/10.33258/birci.v3i2.937' },
    kutipan: {
      utama: {
        halaman: '1067 (abstrak)',
        halamanPdf: 1,
        teks: 'Estimation results show that partially income inequality, poverty and gender gap in education have a positive and significant effect on educational inequality in Indonesia',
        sorot: [
          'income inequality, poverty and gender gap in education have a positive and significant effect on educational inequality',
        ],
        mendukung:
          'Ketimpangan pendapatan, kemiskinan, dan celah gender berhubungan dengan ketimpangan pendidikan antarprovinsi.',
      },
    },
  },
  himaz2021: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'UCL Discovery (naskah diterima)',
      url: 'https://discovery.ucl.ac.uk/10134887/3/Himaz_ms_final.pdf#page=30',
    },
    kutipan: {
      utama: {
        halaman: '30 (naskah diterima)',
        halamanPdf: 30,
        teks: 'for men, particularly those who have not completed secondary education who comprise over 80 per cent of our sample, the opportunity cost of education has a higher significant negative bearing on the decision to pursue an extra year of education compared to women.',
        sorot: [
          'the opportunity cost of education has a higher significant negative bearing on the decision to pursue an extra year of education',
        ],
        mendukung:
          'Di Sri Lanka, biaya kesempatan bersekolah lebih berat bagi laki-laki, terutama yang belum menamatkan sekolah menengah.',
        // Kalimat melewati pergantian halaman 30 ke 31.
        cek: [
          'for men, particularly those who have not completed secondary education who comprise over 80 per cent of our sample, the opportunity cost of education has a higher significant',
          'negative bearing on the decision to pursue an extra year of education compared to women.',
        ],
      },
    },
  },
  hudang2024: {
    jenis: 'Kuasi-eksperimen',
    lisensi: CC_BY_4,
    pdf: '/rujukan/hudang2024.pdf',
    baca: { label: 'Business: Theory and Practice', url: 'https://doi.org/10.3846/btp.2024.13865' },
    kutipan: {
      utama: {
        halaman: '447 (abstrak)',
        halamanPdf: 1,
        teks: "The results demonstrate that PKH has a significantly positive effect on food consumption expenditure. However, PKH has insignificantly negative effects on children's educational attainment and prenatal visits.",
        sorot: ["PKH has insignificantly negative effects on children's educational attainment"],
        mendukung:
          'Catatan pembanding: studi ini tidak menemukan efek PKH yang signifikan pada capaian pendidikan anak, sehingga ketepatan sasaran PKH perlu dipantau.',
      },
    },
  },
  islam2018: {
    jenis: 'Analisis isi',
    lisensi: CC_BY_4,
    pdf: '/rujukan/islam2018.pdf',
    baca: { label: 'PLOS ONE', url: 'https://doi.org/10.1371/journal.pone.0190807' },
    kutipan: {
      utama: {
        halaman: '1 (abstrak)',
        halamanPdf: 1,
        teks: 'Our analysis confirms a pro-male bias in textbooks: the aggregate female share is 40.4% in textual and pictorial indicators combined.',
        sorot: ['a pro-male bias in textbooks'],
        mendukung:
          'Buku teks bahasa Inggris SMP dan SMA di empat negara, termasuk Indonesia, masih bias laki-laki. Tokoh perempuan hanya 40,4%.',
      },
    },
  },
  karimah2022: {
    jenis: 'Data panel',
    lisensi: CC_BY_4,
    pdf: '/rujukan/karimah2022.pdf',
    baca: { label: 'Jurnal Ekonomi Pembangunan', url: 'https://doi.org/10.29259/jep.v20i1.17841' },
    kutipan: {
      utama: {
        halaman: '12',
        halamanPdf: 12,
        teks: "Gender inequality, as assessed by the ratio of women's years of schooling to men, has a positive and substantial link with GRDP growth, according to this study.",
        sorot: ['has a positive and substantial link with GRDP growth'],
        mendukung:
          'Makin setara lama sekolah perempuan dan laki-laki, makin tinggi pertumbuhan PDRB kabupaten/kota.',
      },
    },
  },
  kartasasmita2021: {
    jenis: 'Kuasi-eksperimen',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Economics and Finance in Indonesia',
      url: 'https://scholarhub.ui.ac.id/efi/vol67/iss2/1/',
    },
    kutipan: {
      utama: {
        halaman: '163 (abstrak)',
        halamanPdf: 2,
        teks: 'By using Propensity Score Matching (PSM), it was found that students whose schools received BOS during their primary education years were more likely to continue their education to senior secondary education than those whose schools did not receive BOS.',
        sorot: [
          'students whose schools received BOS during their primary education years were more likely to continue their education to senior secondary education',
        ],
        mendukung: 'Siswa yang sekolahnya menerima BOS saat SD lebih mungkin melanjutkan ke SMA.',
      },
    },
  },
  petrosino2012: {
    jenis: 'Ulasan sistematis',
    lisensi: CC_BY_3,
    pdf: '/rujukan/petrosino2012.pdf',
    baca: { label: 'Campbell Systematic Reviews', url: 'https://doi.org/10.4073/csr.2012.19' },
    kutipan: {
      utama: {
        halaman: '7',
        halamanPdf: 8,
        teks: 'Examining only outcomes of enrollment and attendance (n=59), studies that focused on new schools and other infrastructure interventions (d=.44, 95% CI [.40-.47]) reported the largest average effects.',
        sorot: [
          'studies that focused on new schools and other infrastructure interventions (d=.44, 95% CI [.40-.47]) reported the largest average effects',
        ],
        mendukung:
          'Dari studi-studi tentang partisipasi dan kehadiran, pembangunan sekolah baru dan infrastruktur memberi efek rata-rata terbesar.',
      },
      rata: {
        halaman: '7',
        halamanPdf: 8,
        teks: 'Based on the evidence presented in this report, interventions that address getting children into school and keeping them there have, on average, positive effects.',
        sorot: [
          'interventions that address getting children into school and keeping them there have, on average, positive effects',
        ],
        mendukung:
          'Dari 73 studi di negara berkembang, program yang membawa anak ke sekolah dan menahannya di sana rata-rata berdampak positif.',
      },
    },
  },
  pratiwi2021: {
    jenis: 'Kualitatif',
    lisensi: CC_BY_SA_4,
    pdf: '/rujukan/pratiwi2021.pdf',
    baca: {
      label: 'Journal of Early Childhood Care and Education',
      url: 'https://doi.org/10.26555/jecce.v4i1.3613',
    },
    kutipan: {
      utama: {
        halaman: '1 (abstrak)',
        halamanPdf: 1,
        teks: "The results of this study indicate that the form of distance learning in early childhood education in Jayapura is by submitting children's worksheets every week, using the Zoom meeting application, using the Whatsapp application, and home visits.",
        sorot: [
          "submitting children's worksheets every week, using the Zoom meeting application, using the Whatsapp application, and home visits",
        ],
        mendukung:
          'Enam lembaga PAUD di Jayapura menjalankan belajar jarak jauh lewat lembar kerja, Zoom, WhatsApp, dan kunjungan rumah. Studi ini menggambarkan bentuknya, belum mengukur jangkauan atau dampaknya.',
      },
    },
  },
  purnastuti2012: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: { label: 'Jurnal Economia', url: 'https://doi.org/10.21831/jep.v3i1.636' },
    kutipan: {
      utama: {
        halaman: '63 (abstrak)',
        halamanPdf: 1,
        teks: 'Household income matters only for girls; it implies that girls belonging to poor families are less likely to go to school, and education is a luxury good for these girls.',
        sorot: ['girls belonging to poor families are less likely to go to school'],
        mendukung:
          'Kondisi ekonomi rumah tangga menentukan sekolah anak: anak perempuan dari keluarga miskin lebih kecil peluangnya bersekolah (data 1993).',
      },
    },
  },
  purnastuti2015: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'Curtin University (repositori)',
      url: 'https://espace.curtin.edu.au/bitstream/20.500.11937/13858/2/229418_163254_JDA_PAPER2.pdf',
    },
    kutipan: {
      utama: {
        halaman: '183 (abstrak, versi terbit)',
        halamanPdf: 2,
        teks: 'The empirical results show that the returns to schooling in Indonesia are 4.72 per cent for the combined sample, 4.36 per cent for males, and 5.26 per cent for females. However, the relationship between years of schooling and earnings is not statistically significant in any of the IV estimations.',
        sorot: ['the returns to schooling in Indonesia are 4.72 per cent for the combined sample'],
        mendukung:
          'Setiap tambahan tahun sekolah dikaitkan dengan upah sekitar 4,7% lebih tinggi. Estimasi IV-nya tidak signifikan, jadi angka ini bukan bukti sebab-akibat.',
      },
    },
  },
  samosir2021: {
    jenis: 'Data makro',
    lisensi: CC_BY_4,
    pdf: '/rujukan/samosir2021.pdf',
    baca: { label: 'E3S Web of Conferences', url: 'https://doi.org/10.1051/e3sconf/202124411023' },
    kutipan: {
      utama: {
        halaman: '7',
        halamanPdf: 7,
        teks: 'The findings from this study also suggests that a higher population growth rate can lead to a larger number of school-age population and with limited education facilities and investment, in particular competent teachers, might cause a larger number of repeaters in Indonesia.',
        sorot: [
          'with limited education facilities and investment, in particular competent teachers, might cause a larger number of repeaters',
        ],
        mendukung:
          'Secara nasional, pertumbuhan penduduk yang tidak diimbangi fasilitas dan guru berkaitan dengan lebih banyak murid mengulang kelas.',
      },
    },
  },
  setyadi2022: {
    jenis: 'Data panel',
    lisensi: CC_BY_4,
    pdf: '/rujukan/setyadi2022.pdf',
    baca: { label: 'Eko-Regional', url: 'https://doi.org/10.32424/1.erjpe.2022.17.1.2895' },
    kutipan: {
      utama: {
        halaman: '27 (abstrak)',
        halamanPdf: 1,
        teks: 'The results show that gender inequality and education budgets can reduce educational inequality.',
        sorot: ['gender inequality and education budgets can reduce educational inequality'],
        mendukung:
          'Variabel kesenjangan gender dan anggaran pendidikan berpengaruh pada ketimpangan pendidikan di Indonesia (data 2019–2020).',
      },
    },
  },
  siddique2021: {
    jenis: 'Survei dan regresi',
    lisensi: CC_BY_4,
    pdf: '/rujukan/siddique2021.pdf',
    baca: { label: 'MediaTrend', url: 'https://doi.org/10.21107/mediatrend.v16i2.10083' },
    kutipan: {
      utama: {
        halaman: '174 (abstrak)',
        halamanPdf: 1,
        teks: 'The results of this study indicate that the education of the head of the household, the level of welfare and gender have a significant effect on school participation of children aged 7-18 years.',
        sorot: [
          'the education of the head of the household, the level of welfare and gender have a significant effect on school participation',
        ],
        mendukung:
          'Di Riau, pendidikan kepala rumah tangga dan tingkat kesejahteraan memengaruhi partisipasi sekolah anak usia 7–18 tahun.',
      },
    },
  },
  sugiharti2017: {
    jenis: 'Survei dan regresi',
    lisensi: null,
    pdf: null,
    baca: {
      label: 'situs jurnal GATR',
      url: 'http://gatrenterprise.com/GATRJournals/pdf_files/GJBSSR%20Vol%205(3)%202017/5.CIMSSR-00313-Lilik-Sugiharti-GJBSSR-Vol5(3).pdf#page=8',
    },
    kutipan: {
      utama: {
        halaman: '40',
        halamanPdf: 8,
        teks: 'The more educated parents the more probability of children to attend of school, in both education levels. If the household is categorized as nonpoor, the probability of children to attend of school was greater than the poor in both education levels, and vice versa. Household location also had a significant effect on secondary school enrollment, the probability of urban household location was greater to attend of school than the rural one.',
        sorot: [
          'If the household is categorized as nonpoor, the probability of children to attend of school was greater than the poor',
          'Household location also had a significant effect on secondary school enrollment',
        ],
        mendukung:
          'Anak dari keluarga miskin, di perdesaan, dan dengan orang tua berpendidikan rendah lebih kecil peluangnya bersekolah di SMP dan SMA.',
      },
      laki: {
        halaman: '40',
        halamanPdf: 8,
        teks: 'Probability of male to attend the school was less than female in both junior school and senior school. It indicated that there was a trade-off between schooling and other activities such as working particularly for boys.',
        sorot: ['a trade-off between schooling and other activities such as working particularly for boys'],
        mendukung:
          'Di Indonesia, peluang anak laki-laki bersekolah di SMP dan SMA lebih kecil, karena mereka menghadapi tarik-menarik antara sekolah dan bekerja.',
      },
    },
  },
  sulistyaningrum2016: {
    jenis: 'Kuasi-eksperimen',
    lisensi: null,
    pdf: null,
    baca: { label: 'Journal of Indonesian Economy and Business', url: 'https://doi.org/10.22146/jieb.10319' },
    kutipan: {
      utama: {
        halaman: '33 (abstrak)',
        halamanPdf: 1,
        teks: 'the recent school subsidy program is only sufficient for school fees or even only enough for tuition fees if the students live in urban areas. The remainder of the education expenditures must be covered by the household.',
        sorot: [
          'only sufficient for school fees',
          'The remainder of the education expenditures must be covered by the household',
        ],
        mendukung:
          'Subsidi BOS baru menutup biaya sekolah. Biaya pendidikan lainnya, seperti transportasi, buku, dan seragam, masih ditanggung rumah tangga.',
      },
    },
  },
  utomo2014: {
    jenis: 'Survei',
    lisensi: CC_BY_NC_2,
    pdf: '/rujukan/utomo2014.pdf',
    baca: { label: 'Demographic Research', url: 'https://doi.org/10.4054/demres.2014.30.41' },
    kutipan: {
      utama: {
        halaman: '1191',
        halamanPdf: 3,
        teks: 'Less than a quarter of early school-leavers worked in the immediate year following school exit. Instead about 30% neither worked nor studied between the ages of 12-18.',
        sorot: ['about 30% neither worked nor studied between the ages of 12-18'],
        mendukung:
          'Di Jabodetabek, sekitar 30% remaja yang putus sekolah sebelum usia 16 tidak bekerja maupun belajar pada usia 12–18.',
      },
    },
  },
}

// Tempat yang memakai kutipan selain "utama".
// Kunci tempat: 'kesenjangan.{dimensi}.{jenjang}.{urutan}', 'rekomendasi.{id}', 'profil.{judul}', 'solusi.{id}'.
export const KUTIPAN_KHUSUS = {
  'kesenjangan.wilayah.SMP.1': { petrosino2012: 'rata' },
  'kesenjangan.ekonomi.SD.2': { petrosino2012: 'rata' },
  'kesenjangan.gender.Umum.1': { sugiharti2017: 'laki' },
  'rekomendasi.transisi': { petrosino2012: 'rata' },
  'profil.Pertahankan dan pantau capaian': { petrosino2012: 'rata' },
}

export function kunciKutipan(refId, tempat) {
  return KUTIPAN_KHUSUS[tempat]?.[refId] || 'utama'
}

export function kutipanUntuk(refId, tempat) {
  const sumber = SUMBER[refId]
  if (!sumber) return null
  const kunci = kunciKutipan(refId, tempat)
  return { sumber, kunci, kutipan: sumber.kutipan[kunci] || sumber.kutipan.utama || null }
}

// PDF bisa ditampilkan di SETARA hanya bila lisensi terbukanya sudah dipastikan.
export function bisaDitampilkan(sumber) {
  return Boolean(sumber?.lisensi && sumber?.pdf)
}

// Pecah teks kutipan menjadi bagian biasa dan bagian yang disorot.
export function potongSorot(teks, sorot = []) {
  const rentang = sorot
    .map((s) => {
      const i = teks.indexOf(s)
      return i < 0 ? null : [i, i + s.length]
    })
    .filter(Boolean)
    .sort((a, b) => a[0] - b[0])
  const hasil = []
  let posisi = 0
  for (const [a, b] of rentang) {
    if (a < posisi) continue
    if (a > posisi) hasil.push({ teks: teks.slice(posisi, a), sorot: false })
    hasil.push({ teks: teks.slice(a, b), sorot: true })
    posisi = b
  }
  if (posisi < teks.length) hasil.push({ teks: teks.slice(posisi), sorot: false })
  return hasil
}
