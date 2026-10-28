import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Ringkasan' },
  { to: '/kesenjangan', label: 'Kesenjangan' },
  { to: '/provinsi', label: 'Provinsi' },
]

export default function Nav() {
  return (
    <header className="border-b border-garis bg-putih">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-baseline gap-x-8 gap-y-2 px-4 py-4">
        <NavLink to="/" className="font-serif text-[20px] font-semibold leading-none text-tinta">
          SETARA
        </NavLink>
        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `min-h-11 rounded-md px-3 py-2 text-base leading-snug ${
                  isActive ? 'font-semibold text-tinta underline underline-offset-4' : 'text-tinta-redup hover:text-tinta'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
