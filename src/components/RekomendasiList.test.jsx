import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import RekomendasiList from './RekomendasiList'

const items = [
  {
    prioritas: 'Tinggi',
    judul: 'Perluas layanan PAUD 3-6 tahun',
    solusi: 'Kalimat pertama. Kalimat kedua yang berisi rincian bukti.',
    dasar: 'APK PAUD 3,10%.',
    sumber: [],
  },
]

describe('RekomendasiList', () => {
  it('kalimat pertama tampil, rinciannya dilipat di balik Selengkapnya', () => {
    render(<RekomendasiList items={items} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Kalimat pertama.')).toBeVisible()
    const lipat = screen.getByText('Selengkapnya').closest('details')
    expect(lipat).not.toHaveAttribute('open')
    expect(lipat).toHaveTextContent('Kalimat kedua yang berisi rincian bukti.')
  })
})
