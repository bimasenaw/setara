import { nilaiTerbaru } from './indikator'
import { formatAngka, formatPoin } from './format'

function ambil(rows, filter) {
  return nilaiTerbaru(rows, filter)
}

function selisih(provinsi, nasional) {
  if (provinsi === null || nasional === null) return null
  return provinsi - nasional
}

export function rekomendasiProvinsi(rows, kode) {
  const out = []

  const paud = ambil(rows, { indikator: 'apk_paud', kode, kelompok: 'Total' })
  const paudNasional = ambil(rows, { indikator: 'apk_paud', kode: '9999', kelompok: 'Total' })
  if (paud.nilai !== null && paudNasional.nilai !== null) {
    const gap = selisih(paud.nilai, paudNasional.nilai)
    if (gap !== null && gap < -2) {
      out.push({
        prioritas: 'Tinggi',
        judul: 'Perluas layanan PAUD 3-6 tahun',
        solusi:
          'Perluas akses PAUD di daerah tertinggal dan daerah dengan partisipasi rendah. Perluasan akses PAUD di perdesaan meningkatkan partisipasi dan perkembangan anak; pembelajaran jarak jauh dapat menjangkau daerah terpencil.',
        dasar: `APK PAUD ${formatAngka(paud.nilai, 2)}%, ${formatPoin(Math.abs(gap), 2)} di bawah nasional (${formatAngka(paudNasional.nilai, 2)}%).`,
        sumber: ['brinkman2017', 'pratiwi2021', 'setyadi2022'],
      })
    }
  }

  const miskin = ambil(rows, { indikator: 'kemiskinan', kode, kelompok: 'Jumlah' })
  const miskinNasional = ambil(rows, { indikator: 'kemiskinan', kode: '9999', kelompok: 'Jumlah' })
  if (miskin.nilai !== null && miskinNasional.nilai !== null && miskin.nilai > miskinNasional.nilai) {
    out.push({
      prioritas: 'Tinggi',
      judul: 'Perkuat bantuan tunai bersyarat dan beasiswa',
      solusi:
        'Perluas dan pertajam PKH serta beasiswa bagi rumah tangga termiskin. Uji acak menunjukkan efek kumulatif bantuan tunai bersyarat terhadap partisipasi sekolah.',
      dasar: `Kemiskinan ${formatAngka(miskin.nilai, 2)}%, lebih tinggi dari nasional (${formatAngka(miskinNasional.nilai, 2)}%).`,
      sumber: ['cahyadi2020', 'hudang2024', 'caniago2021'],
    })
  }

  const aps = ambil(rows, { indikator: 'aps', kode, jenjang: 'SMA' })
  const apsNasional = ambil(rows, { indikator: 'aps', kode: '9999', jenjang: 'SMA' })
  if (aps.nilai !== null && apsNasional.nilai !== null && aps.nilai < apsNasional.nilai) {
    out.push({
      prioritas: 'Tinggi',
      judul: 'Amankan transisi dan kelanjutan SMA',
      solusi:
        'Perkuat BOS dan bantuan biaya di jenjang SMA. BOS di tingkat sekolah menaikkan enrolmen rumah tangga, dan bantuan tunai pendidikan menaikkan angka masuk SMA.',
      dasar: `Partisipasi usia SMA ${formatAngka(aps.nilai, 2)}%, ${formatPoin(apsNasional.nilai - aps.nilai, 2)} di bawah nasional (${formatAngka(apsNasional.nilai, 2)}%).`,
      sumber: ['kartasasmita2021', 'caniago2021', 'sulistyaningrum2016'],
    })
  }

  const rasio = ambil(rows, { indikator: 'rasio_apm_gender', kode, jenjang: 'SMA' })
  if (rasio.nilai !== null && (rasio.nilai < 97 || rasio.nilai > 103)) {
    out.push({
      prioritas: 'Menengah',
      judul: 'Dukungan tertarget untuk celah gender',
      solusi:
        'Terapkan dukungan tertarget bagi kelompok gender yang tertinggal, kurangi stereotip gender dalam materi ajar, dan hindari segregasi pilihan sekolah berdasarkan gender.',
      dasar: `Rasio APM perempuan/laki-laki SMA ${formatAngka(rasio.nilai, 1)} (100 = paritas).`,
      sumber: ['himaz2021', 'islam2018', 'asadullah2018'],
    })
  }

  const lama = ambil(rows, { indikator: 'lama_sekolah', kode, kelompok: '15+' })
  const lamaNasional = ambil(rows, { indikator: 'lama_sekolah', kode: '9999', kelompok: '15+' })
  if (lama.nilai !== null && lamaNasional.nilai !== null && lama.nilai < lamaNasional.nilai) {
    out.push({
      prioritas: 'Menengah',
      judul: 'Perkuat literasi dan pendidikan kesetaraan',
      solusi:
        'Perluas program kejar paket dan literasi dewasa. Putus sekolah berdampak jangka panjang pada transisi menuju dewasa dan pendapatan.',
      dasar: `Rata-rata lama sekolah ${formatAngka(lama.nilai, 2)} tahun, di bawah nasional (${formatAngka(lamaNasional.nilai, 2)} tahun).`,
      sumber: ['utomo2014', 'purnastuti2015', 'petrosino2012'],
    })
  }

  if (!out.length) {
    out.push({
      prioritas: 'Rendah',
      judul: 'Pertahankan dan pantau capaian',
      solusi:
        'Tidak ada celah besar terhadap rata-rata nasional pada indikator yang tersedia. Fokus pada pemantauan tren dan kualitas layanan.',
      dasar: 'Indikator utama provinsi berada di sekitar atau di atas rata-rata nasional.',
      sumber: ['petrosino2012', 'setyadi2022'],
    })
  }

  return out
}
