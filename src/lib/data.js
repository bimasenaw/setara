import { useCallback, useEffect, useState } from 'react'

const URLS = {
  tidakSekolah: `${import.meta.env.BASE_URL}data/tidak_sekolah.json`,
  provinsi: `${import.meta.env.BASE_URL}data/provinsi.json`,
  indikator: `${import.meta.env.BASE_URL}data/indikator.json`,
  meta: `${import.meta.env.BASE_URL}data/meta.json`,
}

const EMPTY = {
  status: 'loading',
  tidakSekolah: [],
  provinsi: { nasional: [], provinsi: [] },
  indikator: [],
  meta: null,
  error: null,
}

let cache = null
let inflight = null

async function fetchJson(url, label) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Gagal memuat ${label}.`)
  return res.json()
}

async function loadAll() {
  if (cache) return cache
  if (inflight) return inflight
  inflight = Promise.all([
    fetchJson(URLS.tidakSekolah, 'data anak tidak sekolah'),
    fetchJson(URLS.provinsi, 'data provinsi'),
    fetchJson(URLS.indikator, 'data indikator'),
    fetchJson(URLS.meta, 'metadata'),
  ])
    .then(([ts, pv, indikator, meta]) => {
      cache = {
        status: 'ready',
        tidakSekolah: Array.isArray(ts) ? ts : [],
        provinsi: {
          nasional: Array.isArray(pv?.nasional) ? pv.nasional : [],
          provinsi: Array.isArray(pv?.provinsi) ? pv.provinsi : [],
        },
        indikator: Array.isArray(indikator) ? indikator : [],
        meta,
        error: null,
      }
      return cache
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function resetDataCache() {
  cache = null
  inflight = null
}

export function useData() {
  const [state, setState] = useState(cache || EMPTY)

  const load = useCallback(() => {
    let cancelled = false
    loadAll()
      .then((data) => {
        if (!cancelled) setState(data)
      })
      .catch((e) => {
        if (!cancelled) setState({ ...EMPTY, status: 'error', error: e.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => load(), [load])

  const reload = useCallback(() => {
    resetDataCache()
    setState({ ...EMPTY, status: 'loading' })
    load()
  }, [load])

  return { ...state, reload }
}
