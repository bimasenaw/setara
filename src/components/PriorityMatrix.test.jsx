import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import PriorityMatrix from './PriorityMatrix'

const prov = (kode, kategori) => ({
  kode,
  provinsi: `Provinsi ${kode}`,
  kategori,
  level: 80,
  tren: 1,
  tahunAwal: 2019,
})
const data = [
  ...['1', '2', '3'].map((k) => prov(k, 'Mendesak')),
  ...['4', '5'].map((k) => prov(k, 'Membaik')),
  ...['6', '7', '8', '9'].map((k) => prov(k, 'Berhasil')),
]

describe('Batang sebaran kuadran', () => {
  it('jumlah segmen sama dengan jumlah provinsi, kuadran kosong tidak digambar', () => {
    render(<PriorityMatrix data={data} tahun={2025} />, { wrapper: MemoryRouter })
    const batang = screen.getByRole('group', { name: /^Sebaran 9 provinsi/ })
    const segmen = within(batang).getAllByRole('link')
    expect(segmen.map((s) => s.dataset.kuadran)).toEqual(['Mendesak', 'Membaik', 'Berhasil'])
    expect(segmen.reduce((n, s) => n + Number(s.dataset.jumlah), 0)).toBe(data.length)
    expect(segmen[0]).toHaveAccessibleName('Perlu intervensi mendesak: 3 provinsi')
  })

  it('setiap segmen menaut ke kotak kuadrannya', () => {
    const { container } = render(<PriorityMatrix data={data} tahun={2025} />, { wrapper: MemoryRouter })
    const batang = screen.getByRole('group', { name: /^Sebaran/ })
    for (const s of within(batang).getAllByRole('link')) {
      const id = s.getAttribute('href').slice(1)
      expect(container.querySelector(`#${id}`)).toBeTruthy()
    }
  })

  it('daftar nama dilipat: hanya kuadran mendesak terbuka, dan segmen membuka kotaknya', () => {
    const { container } = render(<PriorityMatrix data={data} tahun={2025} />, { wrapper: MemoryRouter })
    expect(container.querySelector('#kuadran-mendesak')).toHaveAttribute('open')
    const berhasil = container.querySelector('#kuadran-berhasil')
    expect(berhasil).not.toHaveAttribute('open')
    expect(within(berhasil.querySelector('summary')).getByText('4')).toBeInTheDocument()
    const batang = screen.getByRole('group', { name: /^Sebaran/ })
    within(batang)
      .getByRole('link', { name: /Berhasil, pertahankan/ })
      .click()
    expect(berhasil).toHaveAttribute('open')
  })
})
