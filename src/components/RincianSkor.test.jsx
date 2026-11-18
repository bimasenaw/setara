import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { hitungPrioritas } from '../lib/prioritas'
import RincianSkor from './RincianSkor'

const prioritas = hitungPrioritas(JSON.parse(readFileSync('public/data/indikator.json', 'utf8')))
const papuaPegunungan = prioritas.daftar.find((p) => p.kode === '9700')

function tampilkan(url = '/provinsi/9700') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <RincianSkor provinsi={papuaPegunungan} komponen={prioritas.komponen} jumlahProvinsi={38} />
    </MemoryRouter>,
  )
}

describe('Rincian skor indeks', () => {
  it('menampilkan enam indikator dan rata-ratanya sama dengan skor indeks', () => {
    const { container } = tampilkan()
    expect(container.querySelectorAll('[data-indikator]')).toHaveLength(6)
    expect(screen.getByText('Bagaimana skor 99,1 dihitung?')).toBeInTheDocument()
    expect(container.querySelector('p.border-t')).toHaveTextContent(
      'Rata-rata 6 skor: (97,3 + 100 + 100 + 97,3 + 100 + 100) ÷ 6 = 99,1',
    )
    const rata = Object.values(papuaPegunungan.komponen).reduce((s, k) => s + k.skor, 0) / 6
    expect(rata).toBeCloseTo(papuaPegunungan.skor, 10)
  })

  it('tertutup secara bawaan dan terbuka lewat #perhitungan', () => {
    const { container, unmount } = tampilkan()
    expect(container.querySelector('#perhitungan')).not.toHaveAttribute('open')
    unmount()
    const kedua = tampilkan('/provinsi/9700#perhitungan')
    expect(kedua.container.querySelector('#perhitungan')).toHaveAttribute('open')
  })
})
