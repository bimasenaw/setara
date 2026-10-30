import { describe, expect, it } from 'vitest'
import { toCsv } from './ekspor'

describe('ekspor', () => {
  it('membuat CSV dengan header dan escape koma/kutip', () => {
    const csv = toCsv(
      [
        { provinsi: 'Aceh', nilai: 10.5 },
        { provinsi: 'Papua, Barat', nilai: 20 },
      ],
      [
        { key: 'provinsi', label: 'Provinsi' },
        { key: 'nilai', label: 'Nilai' },
      ],
    )
    expect(csv.split('\r\n')[0]).toBe('Provinsi,Nilai')
    expect(csv).toContain('"Papua, Barat"')
  })
})
