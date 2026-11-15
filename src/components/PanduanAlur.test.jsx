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

const kartu = () => screen.findByRole('dialog', { name: 'Satu cerita, empat langkah' }, { timeout: 4000 })

describe('Panduan alur', () => {
  beforeEach(() => resetPanduan())
  afterEach(() => vi.restoreAllMocks())

  it('muncul pada kunjungan pertama dengan empat langkah', async () => {
    tampilkan('/')
    const d = await kartu()
    expect(within(d).getAllByRole('listitem')).toHaveLength(4)
    expect(within(d).getByText('Siapa yang paling tertinggal?')).toBeInTheDocument()
    expect(within(d).getByRole('button', { name: 'Mulai tur' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apa arti angka ini?' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('Esc menutup, menyimpan status, dan mengembalikan fokus ke tombol "?"', async () => {
    tampilkan('/')
    await kartu()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 })
    expect(sudahDilihat()).toBe(true)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Apa arti angka ini?' })).toHaveFocus(), {
      timeout: 3000,
    })
  })

  it('tidak muncul lagi setelah dilihat, tetapi bisa dibuka lewat tombol "?"', async () => {
    tandaiDilihat()
    tampilkan('/kesenjangan')
    await new Promise((r) => setTimeout(r, 800))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const tombol = screen.getByRole('button', { name: 'Apa arti angka ini?' })
    fireEvent.click(tombol)
    const d = await kartu()
    await waitFor(() => expect(within(d).getByRole('button', { name: 'Mulai tur' })).toHaveFocus(), {
      timeout: 3000,
    })
    fireEvent.click(tombol)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('?panduan=1 memaksa muncul dan dihapus dari URL saat ditutup', async () => {
    tandaiDilihat()
    tampilkan('/?panduan=1&tahun=2023')
    const d = await kartu()
    fireEvent.click(within(d).getByRole('button', { name: 'Nanti saja' }))
    await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent(/^\/\?tahun=2023$/))
  })

  it('menandai langkah sekarang dan "Mulai tur" membawa ke langkah 1 dengan filter', async () => {
    tampilkan('/provinsi/9400?tahun=2023&jenjang=SMA')
    const d = await kartu()
    const item = within(d).getAllByRole('listitem')
    expect(within(item[2]).getByText('Anda di sini')).toBeInTheDocument()
    fireEvent.click(within(d).getByRole('button', { name: 'Mulai tur' }))
    await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent('/?tahun=2023&jenjang=SMA'))
    expect(within(d).getByText('Siapa yang paling tertinggal?')).toBeInTheDocument()
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
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 })
    expect(sudahDilihat()).toBe(true)
  })
})

describe('Motto KUAT', () => {
  beforeEach(() => resetPanduan())

  it('kartu panduan memuat motto KUAT di ikhtisar dan tur', async () => {
    tampilkan('/')
    const d = await kartu()
    expect(within(d).getByText('Motto KUAT: Kenali, Ukur, Arahkan, Tindak.')).toBeInTheDocument()
    fireEvent.click(within(d).getByRole('button', { name: 'Mulai tur' }))
    expect(within(d).getByText('Motto KUAT: Kenali, Ukur, Arahkan, Tindak.')).toBeInTheDocument()
  })

  it('setiap angka di penanda alur menyimpan huruf dan kata motto untuk hover dan fokus', () => {
    tandaiDilihat()
    tampilkan('/')
    const tautan = within(screen.getByRole('navigation', { name: 'Alur cerita' })).getAllByRole('link')
    const harapan = ['K · Kenali', 'U · Ukur', 'A · Arahkan', 'T · Tindak']
    tautan.forEach((t, i) => expect(t).toHaveTextContent(harapan[i]))
    expect(tautan[0]).toHaveAccessibleName('Langkah 1 dari 4: Siapa tertinggal')
  })
})

describe('Tur panduan', () => {
  beforeEach(() => resetPanduan())

  it('Lanjut memindahkan halaman dan isi kartu ke langkah berikutnya sampai Selesai', async () => {
    tampilkan('/?tahun=2023')
    const d = await kartu()
    fireEvent.click(within(d).getByRole('button', { name: 'Mulai tur' }))
    expect(within(d).getByText('Siapa yang paling tertinggal?')).toBeInTheDocument()
    expect(screen.getByTestId('lokasi')).toHaveTextContent('/?tahun=2023')

    const harapan = [
      ['/kesenjangan?tahun=2023', 'Seberapa jauh jaraknya?'],
      ['/provinsi?tahun=2023', 'Di mana harus mulai lebih dahulu?'],
      ['/rekomendasi?tahun=2023', 'Apa yang harus dilakukan?'],
    ]
    for (const [url, pertanyaan] of harapan) {
      fireEvent.click(within(d).getByRole('button', { name: 'Lanjut' }))
      await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent(url))
      expect(within(d).getByText(pertanyaan)).toBeInTheDocument()
    }
    expect(within(d).queryByRole('button', { name: 'Lanjut' })).not.toBeInTheDocument()
    fireEvent.click(within(d).getByRole('button', { name: 'Selesai' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 })
    expect(sudahDilihat()).toBe(true)
  })

  it('Kembali mundur satu halaman, dan di langkah 1 kembali ke ikhtisar', async () => {
    tampilkan('/')
    const d = await kartu()
    fireEvent.click(within(d).getByRole('button', { name: 'Mulai tur' }))
    fireEvent.click(within(d).getByRole('button', { name: 'Lanjut' }))
    await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent('/kesenjangan'))
    fireEvent.click(within(d).getByRole('button', { name: 'Kembali' }))
    await waitFor(() => expect(screen.getByTestId('lokasi')).toHaveTextContent(/^\/$/))
    fireEvent.click(within(d).getByRole('button', { name: 'Kembali' }))
    expect(within(d).getAllByRole('listitem')).toHaveLength(4)
  })

  it('penanda alur tidak lagi punya tombol Lanjut', () => {
    tandaiDilihat()
    tampilkan('/kesenjangan')
    const alur = screen.getByRole('navigation', { name: 'Alur cerita' })
    expect(within(alur).queryByRole('link', { name: /Lanjut/ })).not.toBeInTheDocument()
  })
})
