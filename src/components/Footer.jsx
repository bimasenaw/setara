import { Link } from 'react-router-dom'

const TAHUN = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-garis bg-putih">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-tinta-redup">
        <p>SETARA · Data BPS (Susenas).</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/metode" className="hover:text-tinta">
            Metode dan sumber
          </Link>
          <span>© {TAHUN} SETARA</span>
        </div>
      </div>
    </footer>
  )
}
