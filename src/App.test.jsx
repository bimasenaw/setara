import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { resetDataCache } from './lib/data'

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
    expect(screen.getByText('Empat angka ringkasan · SMA 2023')).toBeInTheDocument()
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
    expect(screen.getByText(/Solusi berbasis studi/i)).toBeInTheDocument()
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
