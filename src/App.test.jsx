import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { resetDataCache } from './lib/data'
import { tandaiDilihat } from './components/statusPanduan'

const dataDir = join(process.cwd(), 'public', 'data')
const files = {
  'tidak_sekolah.json': JSON.parse(readFileSync(join(dataDir, 'tidak_sekolah.json'), 'utf8')),
  'provinsi.json': JSON.parse(readFileSync(join(dataDir, 'provinsi.json'), 'utf8')),
  'indikator.json': JSON.parse(readFileSync(join(dataDir, 'indikator.json'), 'utf8')),
  'meta.json': JSON.parse(readFileSync(join(dataDir, 'meta.json'), 'utf8')),
}

function mockFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      const nama = String(url).split('/').pop()
      if (files[nama]) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(files[nama]) })
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
    }),
  )
}

describe('App', () => {
  beforeEach(() => {
    resetDataCache()
    tandaiDilihat()
    mockFetch()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('menampilkan ringkasan dengan temuan dan filter', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByText('Tiga temuan utama (2023)')).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'SETARA' })).toBeInTheDocument()
    expect(screen.getByText('Lihat angka lengkap · SMA 2023')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Langkah berikutnya' })).toBeInTheDocument()
  })

  it('Ringkasan bisa berganti antara dumbbell dan batang berdampingan', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    const pilih = await screen.findByRole('tablist', { name: 'Bentuk grafik' }, { timeout: 5000 })
    expect(within(pilih).getByRole('tab', { name: 'Titik dan garis' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.queryByText(/batang atas/)).not.toBeInTheDocument()
    fireEvent.click(within(pilih).getByRole('tab', { name: 'Batang' }))
    expect(within(pilih).getByRole('tab', { name: 'Batang' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/batang atas/)).toBeInTheDocument()
    fireEvent.click(within(pilih).getByRole('tab', { name: 'Titik dan garis' }))
    expect(screen.queryByText(/batang atas/)).not.toBeInTheDocument()
  })

  it('Kesenjangan juga bisa berganti ke batang berdampingan, dan pilihannya tersimpan di alamat', async () => {
    render(
      <MemoryRouter initialEntries={['/kesenjangan?grafik=batang']}>
        <App />
      </MemoryRouter>,
    )
    const pilih = await screen.findByRole('tablist', { name: 'Bentuk grafik' }, { timeout: 5000 })
    expect(within(pilih).getByRole('tab', { name: 'Batang' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/batang atas/)).toBeInTheDocument()
  })

  it('temuan utama tidak mengulang angka besar di keterangannya', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      await screen.findByText('anak di desa tidak sekolah · 7,6 poin di atas kota', {}, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^Di SMA, 26,1% anak di desa/)).not.toBeInTheDocument()
  })

  it('temuan PAUD di Rekomendasi menyebut nama indikatornya', async () => {
    render(
      <MemoryRouter initialEntries={['/rekomendasi']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      await screen.findByText(
        /partisipasi pembelajaran setahun sebelum SD di Papua 62,98%/,
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument()
  })

  it('menampilkan halaman provinsi dengan pencarian', async () => {
    render(
      <MemoryRouter initialEntries={['/provinsi']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(
      () => {
        expect(screen.getByText('Indeks prioritas SETARA')).toBeInTheDocument()
      },
      { timeout: 10000 },
    )
    expect(screen.getByLabelText(/Cari provinsi/i)).toBeInTheDocument()
  })

  it('menampilkan halaman kesenjangan dengan metrik', async () => {
    render(
      <MemoryRouter initialEntries={['/kesenjangan?tab=ekonomi&tahun=2023&jenjang=SMA']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(
      () => {
        expect(screen.getByText('Metrik kesenjangan per jenjang')).toBeInTheDocument()
      },
      { timeout: 10000 },
    )
    expect(screen.getByText('Apa yang bisa dilakukan')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bagikan dan unduh' })).toBeInTheDocument()
  })

  it('provinsi: judul dari indeks prioritas, 10 teratas, lalu semua provinsi', async () => {
    render(
      <MemoryRouter initialEntries={['/provinsi']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/paling perlu diprioritaskan/)
      },
      { timeout: 10000 },
    )
    // Isi di bawah kepala halaman digambar sebagai render latar, jadi ditunggu.
    const daftar = await screen.findByRole(
      'list',
      { name: /Indeks prioritas per provinsi/ },
      { timeout: 5000 },
    )
    expect(within(daftar).getAllByRole('listitem')).toHaveLength(10)
    fireEvent.click(screen.getByRole('button', { name: /Tampilkan semua provinsi/ }))
    expect(within(daftar).getAllByRole('listitem').length).toBeGreaterThan(30)
    expect(screen.getByText(/Ukurannya berganti/)).toBeInTheDocument()
  })

  it('metode: daftar isi menaut ke bagian dan daftar pustaka memuat tautan baca', async () => {
    render(
      <MemoryRouter initialEntries={['/metode']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Indikator yang dipakai' })).toBeInTheDocument()
    })
    const isi = screen.getByRole('navigation', { name: 'Isi halaman' })
    const label = within(isi)
      .getAllByRole('link')
      .map((a) => a.textContent)
    expect(label).toEqual([
      'Sumber dan pembaruan',
      'Indikator',
      'Istilah',
      'Rumus dan asumsi',
      'Keterbatasan',
      'Daftar pustaka',
      'Sitasi',
    ])
    expect(screen.getByRole('heading', { name: 'Daftar pustaka' })).toBeInTheDocument()
    // Jurnal berlisensi terbuka bisa dibaca di SETARA; yang lain ke situs sumbernya.
    expect(screen.getAllByRole('link', { name: 'Baca di SETARA' }).length).toBeGreaterThanOrEqual(10)
    expect(screen.getAllByText('Lisensi CC BY 4.0').length).toBeGreaterThan(0)
  })

  it('profil provinsi: remah navigasi, peringkat di kepala, dan tanpa lipatan', async () => {
    render(
      <MemoryRouter initialEntries={['/provinsi/1100']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Aceh')
    })
    const remah = screen.getByRole('navigation', { name: 'Remah navigasi' })
    expect(within(remah).getByRole('link', { name: 'Provinsi' })).toBeInTheDocument()
    expect(screen.getByText(/Peringkat \d+ dari \d+ pada indeks prioritas/)).toBeInTheDocument()
    expect(screen.queryByText('Makna catatan')).not.toBeInTheDocument()
  })

  it('alamat tidak dikenal menampilkan halaman tidak ditemukan tanpa penanda alur', async () => {
    render(
      <MemoryRouter initialEntries={['/tidak-ada']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Halaman tidak ditemukan' })).toBeInTheDocument()
    })
    expect(screen.getByRole('link', { name: 'Kembali ke Ringkasan' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('navigation', { name: 'Alur cerita' })).not.toBeInTheDocument()
  })

  it('menampilkan detail provinsi', async () => {
    render(
      <MemoryRouter initialEntries={['/provinsi/1100']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Aceh' })).toBeInTheDocument()
    })
    expect(screen.getByText('Indeks prioritas')).toBeInTheDocument()
  })

  it('navigasi utama memuat lima halaman', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    const nav = screen.getByRole('navigation', { name: 'Navigasi utama' })
    const label = within(nav)
      .getAllByRole('link')
      .map((a) => a.textContent)
    expect(label).toEqual(['Ringkasan', 'Kesenjangan', 'Provinsi', 'Rekomendasi', 'Metode'])
    await waitFor(() => {
      expect(screen.getByText('Tiga temuan utama (2023)')).toBeInTheDocument()
    })
  })

  it('menampilkan halaman rekomendasi dengan alur langkah 4', async () => {
    render(
      <MemoryRouter initialEntries={['/rekomendasi?tahun=2023&jenjang=SMA']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Lima langkah/)
    })
    // Lima rekomendasi, ditambah "Mulai dari mana?", kaitan SDGs, dan batas rekomendasi.
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8)
    expect(screen.getByRole('heading', { name: 'Mulai dari mana?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Batas rekomendasi' })).toBeInTheDocument()
    // Temuan dihitung dari data, bukan disalin.
    await waitFor(() => {
      expect(screen.getAllByText(/^Temuan \(\d{4}\):/).length).toBe(5)
    })
    expect(screen.getByRole('heading', { name: /tujuan pembangunan berkelanjutan/ })).toBeInTheDocument()
    const alur = screen.getByRole('navigation', { name: 'Alur cerita' })
    const aktif = within(alur).getByRole('link', { current: 'step' })
    expect(aktif).toHaveTextContent('4')
    expect(aktif).toHaveAccessibleName('Langkah 4 dari 4: Apa tindakannya')
    expect(within(alur).getByRole('link', { name: /Seberapa jauh/ })).toHaveAttribute(
      'href',
      '/kesenjangan?tahun=2023&jenjang=SMA',
    )
  })

  it('penanda alur mengikuti halaman navbar dan tersembunyi di metode', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/provinsi/1100']}>
        <App />
      </MemoryRouter>,
    )
    const alur = screen.getByRole('navigation', { name: 'Alur cerita' })
    expect(within(alur).getByRole('link', { current: 'step' })).toHaveTextContent('3')
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Aceh' })).toBeInTheDocument()
    })
    unmount()

    render(
      <MemoryRouter initialEntries={['/metode']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('navigation', { name: 'Alur cerita' })).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Metode dan sumber' })).toBeInTheDocument()
    })
  })

  it('menampilkan halaman metode', async () => {
    render(
      <MemoryRouter initialEntries={['/metode']}>
        <App />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Metode dan sumber' })).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Indikator yang dipakai' })).toBeInTheDocument()
  })
})
