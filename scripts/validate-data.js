import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA = join(ROOT, 'public', 'data')

function baca(nama) {
  return JSON.parse(readFileSync(join(DATA, nama), 'utf8'))
}

function validRows(rows, nama, required) {
  const errors = []
  rows.forEach((row, index) => {
    for (const key of required) {
      if (row[key] === undefined || row[key] === null || row[key] === '') {
        errors.push(`${nama}[${index}] field ${key} kosong`)
      }
    }
    if (typeof row.nilai !== 'number' || Number.isNaN(row.nilai)) {
      errors.push(`${nama}[${index}] nilai tidak valid: ${row.nilai}`)
    }
  })
  return errors
}

function duplikat(rows, keyFn, nama) {
  const seen = new Set()
  const dup = []
  for (const row of rows) {
    const key = keyFn(row)
    if (seen.has(key)) dup.push(key)
    seen.add(key)
  }
  return dup.slice(0, 10).map((k) => `${nama} duplikat: ${k}`)
}

const indikator = baca('indikator.json')
const meta = baca('meta.json')
const tidakSekolah = baca('tidak_sekolah.json')
const provinsi = baca('provinsi.json')

const errors = [
  ...validRows(indikator, 'indikator', ['indikator', 'tahun', 'nilai', 'provinsi', 'wilayah']),
  ...validRows(tidakSekolah, 'tidak_sekolah', ['dimensi', 'kelompok', 'jenjang', 'tahun', 'nilai']),
  ...validRows(provinsi.provinsi, 'provinsi', ['kode', 'provinsi', 'tahun', 'nilai']),
  ...duplikat(
    indikator,
    (r) =>
      `${r.indikator}|${r.wilayah}|${r.kode || r.provinsi}|${r.tahun}|${r.kelompok}|${r.jenjang || ''}|${r.gender || ''}`,
    'indikator',
  ),
]

if (!meta.generatedAt || !Array.isArray(meta.indikator)) {
  errors.push('meta.json tidak lengkap')
}

const ringkasan = {}
for (const row of indikator) {
  ringkasan[row.indikator] = ringkasan[row.indikator] || { baris: 0, tahun: new Set() }
  ringkasan[row.indikator].baris += 1
  ringkasan[row.indikator].tahun.add(row.tahun)
}

console.log(`indikator.json : ${indikator.length} baris`)
console.log(`tidak_sekolah  : ${tidakSekolah.length} baris`)
console.log(`provinsi       : ${provinsi.provinsi.length} baris, ${provinsi.nasional.length} nasional`)
console.log('')
for (const [nama, info] of Object.entries(ringkasan).sort()) {
  console.log(
    `${nama.padEnd(22)} ${String(info.baris).padStart(5)} baris  tahun ${[...info.tahun]
      .sort()
      .join(',')}`,
  )
}

if (errors.length) {
  console.error(`\n${errors.length} masalah ditemukan:`)
  for (const e of errors) console.error(`- ${e}`)
  process.exit(1)
}

console.log('\nValidasi data lulus.')
