import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import AksiData from './AksiData'

function setup() {
  const salin = vi.fn(() => 'Temuan disalin.')
  const unduh = vi.fn()
  render(
    <AksiData
      aksi={[
        { label: 'Salin temuan', jalankan: salin },
        { label: 'Unduh CSV', jalankan: unduh },
        null,
      ]}
    />,
  )
  const tombol = screen.getByRole('button', { name: 'Bagikan dan unduh' })
  return { tombol, salin, unduh }
}

describe('AksiData', () => {
  it('membuka menu dan memfokuskan item pertama', () => {
    const { tombol } = setup()
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(tombol)
    expect(tombol).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitem', { name: 'Salin temuan' })).toHaveFocus()
  })

  it('panah berpindah item dan Esc menutup serta mengembalikan fokus', () => {
    const { tombol } = setup()
    fireEvent.click(tombol)
    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Unduh CSV' })).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Salin temuan' })).toHaveFocus()
    fireEvent.keyDown(menu, { key: 'Escape' })
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
    expect(tombol).toHaveFocus()
  })

  it('menjalankan aksi, menutup menu, dan mengumumkan hasil', async () => {
    const { tombol, salin } = setup()
    fireEvent.click(tombol)
    await act(async () => {
      fireEvent.click(screen.getByRole('menuitem', { name: 'Salin temuan' }))
    })
    expect(salin).toHaveBeenCalledOnce()
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Temuan disalin.')).toBeInTheDocument()
  })

  it('menutup menu saat klik di luar', () => {
    const { tombol } = setup()
    fireEvent.click(tombol)
    fireEvent.pointerDown(document.body)
    expect(tombol).toHaveAttribute('aria-expanded', 'false')
  })
})
