import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BatangBerdampingan from './BatangBerdampingan'

// jsdom tidak mengukur lebar; grafik digambar dengan lebar tetap.
vi.mock('../lib/useMeasure', () => ({ useMeasure: () => [{ current: null }, 600] }))

const items = [
  { label: 'Wilayah', pembanding: 10, tertinggal: 14.5 },
  { label: 'Ekonomi', pembanding: 5, tertinggal: 25 },
  { label: 'Gender', pembanding: 12, tertinggal: null },
]

function panjang(path) {
  // M x0,y H x1 ... : panjang batang = H pertama dikurangi x awal (sebelum sudut).
  const [, x0, , h] = path.getAttribute('d').match(/^M([\d.]+),([\d.]+)H([\d.]+)/)
  return Number(h) - Number(x0)
}

describe('BatangBerdampingan', () => {
  it('menggambar dua batang per baris, merah di atas biru, dan melewati nilai kosong', () => {
    const { container } = render(
      <BatangBerdampingan items={items} pembandingNama="kota" tertinggalNama="desa" ringkasan="Ringkas." />,
    )
    expect(screen.getByRole('img', { name: 'Ringkas.' })).toBeInTheDocument()
    const baris = (l) => container.querySelector(`[data-baris="${l}"]`)
    const eko = baris('Ekonomi')
    const merah = eko.querySelector('[data-kelompok="tertinggal"]')
    const biru = eko.querySelector('[data-kelompok="pembanding"]')
    expect(merah.getAttribute('fill')).toBe('#C2372D')
    expect(biru.getAttribute('fill')).toBe('#6F8CAB')
    expect(panjang(merah)).toBeGreaterThan(panjang(biru))
    // Merah di atas: y batang merah lebih kecil.
    const y = (p) => Number(p.getAttribute('d').match(/^M[\d.]+,([\d.]+)/)[1])
    expect(y(merah)).toBeLessThan(y(biru))
    expect(baris('Gender').querySelectorAll('path')).toHaveLength(1)
    expect(baris('Gender').querySelector('[data-selisih]')).toBeNull()
  })

  it('menulis nilai di ujung batang dan selisih di bawah nama baris', () => {
    const { container } = render(
      <BatangBerdampingan items={items} pembandingNama="kota" tertinggalNama="desa" />,
    )
    const eko = container.querySelector('[data-baris="Ekonomi"]')
    expect(eko).toHaveTextContent('25,0%')
    expect(eko).toHaveTextContent('5,0%')
    expect(eko.querySelector('[data-selisih]')).toHaveTextContent('+20,0 poin')
    expect(container.querySelector('[data-baris="Wilayah"] [data-selisih]')).toHaveTextContent('+4,5 poin')
  })
})
