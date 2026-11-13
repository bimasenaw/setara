import { Link } from 'react-router-dom'
import FontSizeControl from './FontSizeControl'
import { useKlikGeser } from './geserHalaman'

const TAHUN = new Date().getFullYear()

export default function Footer({ ruangAlur = false }) {
  const klikGeser = useKlikGeser()
  return (
    <footer className={`mt-16 border-t border-garis bg-putih ${ruangAlur ? 'pb-20' : ''}`}>
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-tinta-redup">
        <p>SETARA · Data BPS (Susenas).</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/metode" onClick={klikGeser('/metode')} className="inline-flex min-h-11 items-center hover:text-tinta">
            Metode dan sumber
          </Link>
          <span>© {TAHUN} SETARA</span>
        </div>
        <div className="w-full md:hidden">
          <FontSizeControl />
        </div>
      </div>
    </footer>
  )
}
