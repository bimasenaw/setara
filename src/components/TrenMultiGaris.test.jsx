import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import TrenMultiGaris from './TrenMultiGaris'

const DATA = [
  { tahun: 2019, SD: 0.8, SMP: 3.1, SMA: 9.5 },
  { tahun: 2023, SD: 0.8, SMP: 2.6, SMA: 7.6 },
]
const LINES = [
  { key: 'SD', label: 'SD', color: '#5C8DC9', pola: '6 4' },
  { key: 'SMP', label: 'SMP', color: '#2E5F9E', pola: '2 3' },
  { key: 'SMA', label: 'SMA', color: '#18324F' },
]

describe('TrenMultiGaris', () => {
  it('legenda membedakan jenjang dengan warna dan pola garis, bukan warna saja', () => {
    const { container } = render(<TrenMultiGaris data={DATA} lines={LINES} satuan="poin persentase" />)
    const garis = (key) => container.querySelector(`[data-garis="${key}"] line`)
    expect(garis('SD')).toHaveAttribute('stroke-dasharray', '6 4')
    expect(garis('SMP')).toHaveAttribute('stroke-dasharray', '2 3')
    expect(garis('SMA')).not.toHaveAttribute('stroke-dasharray')
    expect(garis('SD')).toHaveAttribute('stroke', '#5C8DC9')
    expect(container.querySelector('[data-garis="SMA"]')).toHaveTextContent('SMA')
  })
})
