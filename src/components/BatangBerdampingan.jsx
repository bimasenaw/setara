import { useMeasure } from '../lib/useMeasure'
import { formatAngka } from '../lib/format'
import DataTable from './DataTable'
import { skalaRapi } from './skala'

// Warna sama dengan Dumbbell, supaya kedua tampilan terbaca sebagai data yang sama.
const BIRU = '#6F8CAB'
const MERAH = '#C2372D'
const TINTA = '#18212C'
const TINTA_REDUP = '#5A6676'
const GARIS = '#DCE1E7'

const TEBAL = 18 // tebal satu batang
const CELAH = 2 // jarak antara dua batang yang berdempetan
const SUDUT = 4 // pembulatan di ujung data saja

// Batang horizontal dari garis dasar: ujung kiri lurus, ujung kanan dibulatkan.
function jalurBatang(x0, y, panjang, tebal) {
  if (panjang <= 0) return ''
  const r = Math.min(SUDUT, panjang / 2, tebal / 2)
  const x1 = x0 + panjang
  return `M${x0},${y}H${x1 - r}A${r},${r} 0 0 1 ${x1},${y + r}V${y + tebal - r}A${r},${r} 0 0 1 ${x1 - r},${y + tebal}H${x0}Z`
}

const formatSelisih = (gap, desimal = 1) =>
  `${gap >= 0 ? '+' : '−'}${formatAngka(Math.abs(gap), desimal)} poin`

// Tampilan kedua untuk data dumbbell: dua batang berdempetan per baris,
// merah (kelompok tertinggal) di atas, biru (pembanding) di bawah, dari garis dasar yang sama.
// `items`: [{ label, pembanding, tertinggal }].
export default function BatangBerdampingan({
  items,
  pembandingNama,
  tertinggalNama,
  satuan = '%',
  ringkasan,
  baris = 'dimensi',
  labelLebar = 92,
}) {
  const [ref, width] = useMeasure()

  const nilai = items.flatMap((it) => [it.pembanding, it.tertinggal]).filter((n) => n !== null)
  const skala = skalaRapi(Math.max(0, ...nilai), width > 0 && width < 460 ? 4 : 6)
  const max = skala.maks || 1

  const rowH = 64
  const axisH = 28
  const plotLeft = labelLebar
  const ruangLabelNilai = 48 // label persen di ujung batang terpanjang
  const height = items.length * rowH + axisH

  const plotRight = Math.max(plotLeft + 60, width - ruangLabelNilai)
  const plotWidth = plotRight - plotLeft
  const x = (v) => plotLeft + (v / max) * plotWidth
  const dasar = items.length * rowH

  return (
    <div ref={ref} className="w-full">
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={
            ringkasan ||
            `Grafik batang ${tertinggalNama} dan ${pembandingNama}. Angka di bawah nama ${baris} adalah selisih dalam poin persentase.`
          }
        >
          {/* Garis bantu tipis di belakang batang. */}
          {skala.ticks.map((t) => (
            <line
              key={`g${t}`}
              x1={x(t)}
              y1={0}
              x2={x(t)}
              y2={dasar}
              stroke={GARIS}
              strokeWidth={1}
              strokeDasharray={t === 0 ? undefined : '2 4'}
            />
          ))}

          {items.map((it, i) => {
            const tengah = i * rowH + rowH / 2
            const yAtas = tengah - TEBAL - CELAH / 2
            const yBawah = tengah + CELAH / 2
            const gap =
              it.tertinggal !== null && it.pembanding !== null ? it.tertinggal - it.pembanding : null
            const batang = [
              { kunci: 'tertinggal', v: it.tertinggal, y: yAtas, warna: MERAH },
              { kunci: 'pembanding', v: it.pembanding, y: yBawah, warna: BIRU },
            ]
            return (
              <g key={it.label} data-baris={it.label}>
                <text
                  x={plotLeft - 12}
                  y={gap !== null ? tengah - 9 : tengah}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="0.9375rem"
                  fontWeight={600}
                  fill={TINTA}
                >
                  {it.label}
                </text>
                {gap !== null && (
                  <text
                    x={plotLeft - 12}
                    y={tengah + 11}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="0.8125rem"
                    fontWeight={700}
                    fill={TINTA}
                    data-selisih
                  >
                    {formatSelisih(gap)}
                  </text>
                )}
                {batang.map(
                  (b) =>
                    b.v !== null && (
                      <g key={b.kunci}>
                        <path
                          d={jalurBatang(plotLeft, b.y, x(b.v) - plotLeft, TEBAL)}
                          fill={b.warna}
                          data-kelompok={b.kunci}
                          data-nilai={b.v}
                        />
                        <text
                          x={x(b.v) + 6}
                          y={b.y + TEBAL / 2}
                          dominantBaseline="middle"
                          fontSize="0.75rem"
                          fontWeight={b.kunci === 'tertinggal' ? 600 : 400}
                          fill={b.kunci === 'tertinggal' ? TINTA : TINTA_REDUP}
                        >
                          {`${formatAngka(b.v, 1)}${satuan}`}
                        </text>
                      </g>
                    ),
                )}
              </g>
            )
          })}

          <line x1={plotLeft} y1={dasar} x2={plotRight} y2={dasar} stroke={GARIS} strokeWidth={1} />
          {skala.ticks.map((t) => {
            const tx = x(t)
            return (
              <text
                key={t}
                x={tx}
                y={dasar + 16}
                textAnchor={t === max ? 'end' : t === 0 ? 'start' : 'middle'}
                fontSize="0.75rem"
                fill={TINTA_REDUP}
              >
                {`${formatAngka(t, skala.desimal)}${satuan}`}
              </text>
            )
          })}
        </svg>
      ) : (
        // Memesan tinggi grafik sebelum lebar terukur, supaya isi di bawahnya tidak bergeser.
        <div aria-hidden="true" style={{ height }} />
      )}
      <div className="mt-2 space-y-1 text-sm leading-relaxed text-tinta-redup">
        <p>Angka di bawah nama tiap {baris} adalah selisih antara kedua kelompok dalam poin persentase.</p>
        <p className="flex items-start gap-2">
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-[3px] bg-merah" aria-hidden="true" />
          <span>{tertinggalNama} (kelompok yang lebih tertinggal, batang atas).</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-[3px] bg-biru" aria-hidden="true" />
          <span>{pembandingNama} (pembanding, batang bawah).</span>
        </p>
      </div>
      <DataTable
        namaFile="setara-batang.csv"
        baris={items.map((it) => ({
          label: it.label,
          pembanding: it.pembanding,
          tertinggal: it.tertinggal,
          selisih:
            it.pembanding !== null && it.tertinggal !== null
              ? formatSelisih(it.tertinggal - it.pembanding, 2)
              : null,
        }))}
        kolom={[
          { key: 'label', label: baris === 'jenjang' ? 'Jenjang' : 'Dimensi' },
          { key: 'tertinggal', label: tertinggalNama },
          { key: 'pembanding', label: pembandingNama },
          { key: 'selisih', label: 'Selisih' },
        ]}
      />
    </div>
  )
}
