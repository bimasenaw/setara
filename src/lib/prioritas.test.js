import { describe, expect, it } from 'vitest'
import { hitungPrioritas, matriksPrioritas } from './prioritas'

const nama = { 1100: 'Aceh', 1200: 'Sumatera Utara', 1300: 'Sumatera Barat' }

function row(indikator, kode, nilai, extra = {}) {
  return {
    indikator,
    kode,
    provinsi: nama[kode],
    wilayah: 'provinsi',
    tahun: 2025,
    nilai,
    ...extra,
  }
}

const rows = []
for (const kode of Object.keys(nama)) {
  const buruk = kode === '1100'
  const baik = kode === '1300'
  const factor = buruk ? 0 : baik ? 2 : 1
  rows.push(
    row('aps', kode, 70 + factor * 5, { jenjang: 'SMA', kelompok: '16-18' }),
    row('apk_paud', kode, 30 + factor * 10, { kelompok: 'Total' }),
    row('lama_sekolah', kode, 7 + factor, { kelompok: '15+' }),
    row('kemiskinan', kode, 15 - factor * 3, { kelompok: 'Jumlah' }),
    row('ipm', kode, 65 + factor * 5, { kelompok: 'Total' }),
    row('ikg', kode, 0.5 - factor * 0.1, { kelompok: 'Total' }),
  )
  rows.push(
    row('aps', kode, buruk ? 65 : 75, { jenjang: 'SMA', kelompok: '16-18', tahun: 2019 }),
    row('aps', kode, 70 + factor * 5, { jenjang: 'SMA', kelompok: '16-18', tahun: 2025 }),
  )
}

describe('prioritas', () => {
  it('memberi skor prioritas lebih tinggi untuk provinsi yang lebih buruk', () => {
    const { daftar } = hitungPrioritas(rows)
    expect(daftar).toHaveLength(3)
    expect(daftar[0].kode).toBe('1100')
    expect(daftar[2].kode).toBe('1300')
    expect(daftar[0].skor).toBeGreaterThan(daftar[2].skor)
    expect(daftar[0].cakupan).toBe(6)
  })

  it('membuat kuadran prioritas dari level dan tren', () => {
    const { data } = matriksPrioritas(rows)
    const aceh = data.find((d) => d.kode === '1100')
    expect(aceh.level).toBe(70)
    expect(aceh.tren).toBe(5)
    expect(aceh.kategori).toBeDefined()
  })
})
