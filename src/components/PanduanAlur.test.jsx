import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import AlurCerita from './AlurCerita'
import { resetPanduan, sudahDilihat, tandaiDilihat } from './statusPanduan'

function Lokasi() {
  const { pathname, search } = useLocation()
  return <output data-testid="lokasi">{pathname + search}</output>
}

function tampilkan(url) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <AlurCerita />
      <Lokasi />
    </MemoryRouter>,
  )
}

const kartu = () => screen.findByRole('dialog', { name: 'Satu cerita, empat langkah' }, { timeout: 2000 })

describe('Panduan alur', () => {
  beforeEach(() => resetPanduan())
  afterEach(() => vi.restoreAllMocks())

  it('muncul pada kunjungan pertama dengan empat langkah', async () => {
    tampilkan('/')
    const d = await kartu()
    expect(within(d).getAllByRole('listitem')).toHaveLength(4)
    expect(within(d).getByText('Siapa yang paling tertinggal?')).toBeInTheDocument()
    expect(within(d).getByRole('button', { name: 'Mulai membaca' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apa arti angka ini?' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('Esc menutup, menyimpan status, dan mengembalikan fokus ke tombol "?"', async () => {
    tampilkan('/')
    await kartu()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(sudahDilihat()).toBe(true)
    expect(screen.getByRole('button', { name: 'Apa arti angka ini?' })).toHaveFocus()
  })

  it('tidak muncul lagi setelah dilihat, tetapi bisa dibuka lewat tombol "?"', async () => {
    tandaiDilihat()
    tampilkan('/kesenjangan')
    await new Promise((r) => setTimeout(r, 800))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const tombol = screen.getByRole('button', { name: 'Apa arti angka ini?' })
    fireEvent.click(tombol)
    const d = await kartu()
    expect(within(d).getByRole('button', { name: 'Mulai dari langkah 1' })).toHaveFocus()
    fireEvent.click(tombol)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('?panduan=1 memaksa muncul dan dihapus dari URL saat ditutup', async () => {
    tandaiDilihat()
    tampilkan('/?panduan=1&tahun=2023')
    const d = await kartu()
    fireEvent.click(within(d).getByRole('button', { name: 'Nanti saja' }))
    await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent(/^\/\?tahun=2023$/))
  })

  it('menandai langkah sekarang dan "Mulai dari langkah 1" membawa ke ringkasan dengan filter', async () => {
    tampilkan('/provinsi/9400?tahun=2023&jenjang=SMA')
    const d = await kartu()
    const item = within(d).getAllByRole('listitem')
    expect(within(item[2]).getByText('Anda di sini')).toBeInTheDocument()
    fireEvent.click(within(d).getByRole('button', { name: 'Mulai dari langkah 1' }))
    await waitFor(() =>
      expect(screen.getByTestId('lokasi')).toHaveTextContent('/?tahun=2023&jenjang=SMA'),
    )
  })

  it('tidak muncul di halaman metode', async () => {
    tampilkan('/metode')
    await new Promise((r) => setTimeout(r, 800))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Alur cerita' })).not.toBeInTheDocument()
  })

  it('tetap berjalan bila penyimpanan diblokir', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('diblokir')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('diblokir')
    })
    tampilkan('/')
    await kartu()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(sudahDilihat()).toBe(true)
  })
})
