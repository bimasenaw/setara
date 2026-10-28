import { useEffect, useState } from 'react'

const URLS = {
  tidakSekolah: `${import.meta.env.BASE_URL}data/tidak_sekolah.json`,
  provinsi: `${import.meta.env.BASE_URL}data/provinsi.json`,
}

const EMPTY = {
  status: 'loading',
  tidakSekolah: [],
  provinsi: { nasional: [], provinsi: [] },
  error: null,
}

export function useData() {
  const [state, setState] = useState(EMPTY)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [ts, pv] = await Promise.all([
          fetch(URLS.tidakSekolah).then((r) => {
            if (!r.ok) throw new Error('Gagal memuat data anak tidak sekolah.')
            return r.json()
          }),
          fetch(URLS.provinsi).then((r) => {
            if (!r.ok) throw new Error('Gagal memuat data provinsi.')
            return r.json()
          }),
        ])
        if (!cancelled) {
          setState({
            status: 'ready',
            tidakSekolah: ts,
            provinsi: { nasional: pv.nasional || [], provinsi: pv.provinsi || [] },
            error: null,
          })
        }
      } catch (e) {
        if (!cancelled) {
          setState({ ...EMPTY, status: 'error', error: e.message })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
