import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = ['Product', 'Pricing', 'Customers']

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur border-b border-ink/5">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="font-display font-700 text-xl tracking-tight">
          Flow<span className="text-teal">Board</span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="hover:text-teal transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm font-medium hover:text-teal transition-colors">
            Log in
          </a>
          <a
            href="#cta"
            className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber hover:text-ink transition-colors"
          >
            Start free trial
          </a>
        </div>

        <button
          className="md:hidden p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 border-t border-ink/5">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="font-medium">
              {link}
            </a>
          ))}
          <a href="#" className="font-medium">
            Log in
          </a>
          <a
            href="#cta"
            className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center"
          >
            Start free trial
          </a>
        </div>
      )}
    </header>
  )
}
