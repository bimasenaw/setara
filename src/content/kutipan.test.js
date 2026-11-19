// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { REFERENSI, SOLUSI, SOLUSI_MATRIX } from '../lib/solusi'
import { REKOMENDASI_UTAMA } from './rekomendasi'
import { KUTIPAN_KHUSUS, SUMBER, bisaDitampilkan, kutipanUntuk } from './kutipan'

// Bandingkan hanya huruf dan angka: spasi, tanda hubung di akhir baris, tanda kutip, dan ligatur diabaikan.
const norm = (s) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const semuaKutipan = Object.entries(SUMBER).flatMap(([id, s]) =>
  Object.entries(s.kutipan).map(([kunci, k]) => ({ id, kunci, k, s })),
)

describe('Data kutipan', () => {
  it('setiap rujukan punya entri sumber', () => {
    for (const r of REFERENSI) expect(SUMBER[r.id], r.id).toBeTruthy()
  })

  it('setiap rujukan yang dipakai solusi punya kutipan', () => {
    const dipakai = new Set([
      ...SOLUSI.flatMap((s) => s.sumber),
      ...Object.values(SOLUSI_MATRIX).flatMap((perJenjang) =>
        Object.values(perJenjang).flatMap((daftar) => daftar.flatMap((s) => s.sumber)),
      ),
      ...REKOMENDASI_UTAMA.flatMap((r) => r.sumber),
    ])
    for (const id of dipakai) expect(kutipanUntuk(id, '')?.kutipan, id).toBeTruthy()
  })

  it('setiap bagian yang disorot ada di dalam teks kutipan', () => {
    for (const { id, kunci, k } of semuaKutipan) {
      expect(k.sorot.length, `${id}.${kunci}`).toBeGreaterThan(0)
      for (const s of k.sorot) expect(k.teks, `${id}.${kunci}`).toContain(s)
    }
  })

  it('kutipan khusus menunjuk kutipan yang ada', () => {
    for (const [tempat, peta] of Object.entries(KUTIPAN_KHUSUS)) {
      for (const [id, kunci] of Object.entries(peta)) {
        expect(SUMBER[id]?.kutipan[kunci], `${tempat} → ${id}.${kunci}`).toBeTruthy()
      }
    }
  })

  it('hanya rujukan berlisensi terbuka yang PDF-nya ditampilkan, dan berkasnya ada', () => {
    for (const [id, s] of Object.entries(SUMBER)) {
      expect(Boolean(s.pdf), id).toBe(Boolean(s.lisensi))
      expect(s.baca?.url, id).toMatch(/^https?:\/\//)
      if (bisaDitampilkan(s)) {
        expect(s.pdf).toBe(`/rujukan/${id}.pdf`)
        expect(existsSync(join('public', s.pdf)), s.pdf).toBe(true)
      }
    }
  })
})

// Berkas asli ada di folder rujukan/ (tidak ikut di-commit). Tanpa folder itu, tes ini dilewati.
const BERKAS = {
  filmer2004: 'Filmer, D.',
  jung2014: 'Jung, H.',
  sirait2019: 'Sirait, R. A.',
  surbakti2020: 'Surbakti, S.',
  asadullah2018: 'Madrasah for girls',
  brinkman2017: 'brinkman_et_al',
  cahyadi2020: 'cahyadi-et-al',
  caniago2021: 'Caniago',
  duflo2001: 'Duflo, E. (2000)',
  harahap2020: 'Harahap',
  himaz2021: 'Himaz',
  hudang2024: 'Hudang',
  islam2018: 'Islam, K',
  karimah2022: 'Karimah',
  kartasasmita2021: 'Kartasasmita',
  petrosino2012: 'Petrosino',
  pratiwi2021: 'Pratiwi',
  purnastuti2012: 'Purnastuti, L. (2012)',
  purnastuti2015: 'Purnastuti, L., Salim',
  roodman2022: 'Roodman',
  samosir2021: 'Samosir',
  setyadi2022: 'anzaralfat',
  siddique2021: 'Siddique',
  sugiharti2017: 'Sugiharti',
  sulistyaningrum2016: 'Sulistyaningrum, E. (2016)',
  utomo2014: 'Utomo',
}
const ADA = existsSync('rujukan')

describe.skipIf(!ADA)('Kutipan persis seperti di jurnal', () => {
  const cache = new Map()

  async function teksHalaman(id, halaman) {
    const nama = readdirSync('rujukan').find((f) => f.startsWith(BERKAS[id]))
    if (!nama) throw new Error(`Berkas ${id} tidak ada di rujukan/`)
    const jalur = join('rujukan', nama)
    if (nama.endsWith('.html')) {
      return readFileSync(jalur, 'utf8').replace(/<[^>]+>/g, ' ')
    }
    if (!cache.has(id)) {
      const require = createRequire(join(process.cwd(), 'package.json'))
      const pdfjs = await import(pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')).href)
      const data = new Uint8Array(readFileSync(jalur))
      cache.set(id, await pdfjs.getDocument({ data, verbosity: 0 }).promise)
    }
    const doc = cache.get(id)
    let teks = ''
    // Halaman kutipan dan halaman sesudahnya (untuk kalimat yang melewati pergantian halaman).
    for (const h of [halaman, halaman + 1]) {
      if (h < 1 || h > doc.numPages) continue
      const isi = await (await doc.getPage(h)).getTextContent()
      teks += isi.items.map((i) => i.str).join(' ') + ' '
    }
    return teks
  }

  for (const { id, kunci, k } of semuaKutipan) {
    const uji = k.manual ? it.skip : it
    uji(
      `${id}.${kunci}`,
      async () => {
        const sumber = norm(await teksHalaman(id, k.halamanPdf ?? 1))
        for (const potong of k.cek ?? [k.teks]) {
          expect(sumber.includes(norm(potong)), `"${potong.slice(0, 60)}…" tidak ditemukan`).toBe(true)
        }
      },
      30000,
    )
  }

  it('kutipan yang dicek manual menyebut alasannya', () => {
    for (const { id, kunci, k } of semuaKutipan) {
      if (k.manual) expect(k.manual.length, `${id}.${kunci}`).toBeGreaterThan(20)
    }
  })
})
