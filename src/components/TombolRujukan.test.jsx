import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TombolRujukan, { DaftarRujukan } from './TombolRujukan'
import { potongSorot } from '../content/kutipan'

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: {},
  getDocument: () => ({ promise: Promise.reject(new Error('tidak ada PDF di tes')), destroy() {} }),
}))
vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: '' }))

function tampilkan(isi, url = '/') {
  return render(<MemoryRouter initialEntries={[url]}>{isi}</MemoryRouter>)
}

const panel = (nama) => screen.findByRole('dialog', { name: nama }, { timeout: 3000 })

describe('Tombol rujukan dan panel bukti', () => {
  it('membuka kutipan asli dengan bagian yang disorot dan penjelasannya', async () => {
    tampilkan(<TombolRujukan refId="cahyadi2020" tempat="kesenjangan.ekonomi.Umum.1" />)
    const tombol = screen.getByRole('button', { name: 'Lihat bukti dari Cahyadi et al., 2020' })
    expect(tombol).toHaveAttribute('aria-haspopup', 'dialog')
    fireEvent.click(tombol)
    const d = await panel('Cahyadi et al., 2020')
    expect(within(d).getByText('under-15 children not in school fell by half').tagName).toBe('MARK')
    expect(within(d).getByText(/PKH memangkas separuh anak/)).toBeInTheDocument()
    expect(within(d).getByText('Uji acak')).toBeInTheDocument()
    expect(tombol).toHaveAttribute('aria-expanded', 'true')
  })

  it('jurnal tanpa lisensi terbuka: ada keterangan hak cipta dan tautan baca ke sumber gratis', async () => {
    tampilkan(<TombolRujukan refId="cahyadi2020" />)
    fireEvent.click(screen.getByRole('button', { name: /Cahyadi/ }))
    const d = await panel('Cahyadi et al., 2020')
    expect(within(d).getByText(/dilindungi hak cipta/)).toBeInTheDocument()
    const baca = within(d).getByRole('link', { name: /Baca selengkapnya di situs AEA/ })
    expect(baca).toHaveAttribute('href', expect.stringContaining('aeaweb.org'))
    expect(baca).toHaveAttribute('target', '_blank')
  })

  it('jurnal berlisensi terbuka: "Baca selengkapnya" membuka penampil SETARA', async () => {
    tampilkan(<TombolRujukan refId="islam2018" tempat="rekomendasi.gender" />)
    fireEvent.click(screen.getByRole('button', { name: /Islam & Asadullah/ }))
    const d = await panel('Islam & Asadullah, 2018')
    expect(within(d).queryByText(/dilindungi hak cipta/)).not.toBeInTheDocument()
    expect(within(d).getByRole('link', { name: /Baca selengkapnya/ })).toHaveAttribute(
      'href',
      '/rujukan/islam2018?k=utama',
    )
  })

  it('kutipan mengikuti solusi tempat rujukan diklik', async () => {
    tampilkan(<TombolRujukan refId="sugiharti2017" tempat="kesenjangan.gender.Umum.1" />)
    fireEvent.click(screen.getByRole('button', { name: /Sugiharti/ }))
    const d = await panel('Sugiharti, 2017')
    expect(within(d).getByText(/trade-off between schooling/)).toBeInTheDocument()
  })

  it('Esc menutup panel dan mengembalikan fokus ke tombol', async () => {
    tampilkan(<TombolRujukan refId="petrosino2012" />)
    const tombol = screen.getByRole('button', { name: /Petrosino/ })
    fireEvent.click(tombol)
    await panel('Petrosino et al., 2012')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 3000 })
    expect(tombol).toHaveFocus()
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
  })

  it('daftar rujukan menampilkan satu tombol per sumber', () => {
    tampilkan(<DaftarRujukan sumber={['cahyadi2020', 'hudang2024']} tempat="x" />)
    expect(screen.getAllByRole('button', { name: /Lihat bukti dari/ })).toHaveLength(2)
  })
})

describe('Sorotan kutipan', () => {
  it('memecah teks menjadi bagian biasa dan bagian yang disorot', () => {
    expect(potongSorot('a b c d', ['b', 'd'])).toEqual([
      { teks: 'a ', sorot: false },
      { teks: 'b', sorot: true },
      { teks: ' c ', sorot: false },
      { teks: 'd', sorot: true },
    ])
  })
})

describe('Penampil rujukan', () => {
  async function bukaPenampil(url) {
    const { default: BacaRujukan } = await import('../pages/BacaRujukan')
    return tampilkan(
      <Routes>
        <Route path="/rujukan/:id" element={<BacaRujukan />} />
      </Routes>,
      url,
    )
  }

  it('menampilkan kutipan, lisensi, dan pesan bila PDF gagal dimuat', async () => {
    await bukaPenampil('/rujukan/islam2018?k=utama')
    expect(screen.getByRole('heading', { name: 'Islam & Asadullah, 2018' })).toBeInTheDocument()
    expect(screen.getByText('a pro-male bias in textbooks').tagName).toBe('MARK')
    expect(screen.getByRole('link', { name: 'Lisensi CC BY 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by/4.0/',
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('PDF tidak bisa dimuat')
  })

  it('jurnal tanpa lisensi terbuka tidak ditampilkan PDF-nya', async () => {
    await bukaPenampil('/rujukan/cahyadi2020')
    expect(screen.getByText(/dilindungi hak cipta/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Buka PDF lengkapnya di situs AEA/ })).toBeInTheDocument()
  })
})
