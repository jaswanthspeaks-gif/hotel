import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from './Button.jsx';

const linkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide hover:text-white/90 ${isActive ? 'text-white' : 'text-white/80'}`;

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-forest/95 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <button
          type="button"
          className="text-white lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/rooms" className={linkClass}>
            Find Hotels
          </NavLink>
          <a href="/#story" className="text-sm font-medium tracking-wide text-white/80 hover:text-white">
            Our Story
          </a>
          <a href="/#contact" className="text-sm font-medium tracking-wide text-white/80 hover:text-white">
            Contact
          </a>
        </nav>

        <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-lg font-serif font-semibold text-white">
            J
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="hidden !text-white sm:inline-flex"
                onClick={() => navigate('/my-bookings')}
              >
                MY BOOKINGS
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  className="hidden !text-white md:inline-flex"
                  onClick={() => navigate('/admin')}
                >
                  ADMIN
                </Button>
              )}
              <Button variant="ghost" className="!text-white hidden sm:inline-flex" onClick={() => logout()}>
                LOG OUT
              </Button>
            </>
          ) : (
            <Button variant="ghost" className="!text-white hidden sm:inline-flex" onClick={() => navigate('/login')}>
              SIGN IN
            </Button>
          )}
          <Button onClick={() => navigate('/rooms')}>BOOK NOW</Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-forest px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/rooms" className="text-white" onClick={() => setOpen(false)}>
              Find Hotels
            </NavLink>
            <a href="/#story" className="text-white/90" onClick={() => setOpen(false)}>
              Our Story
            </a>
            <a href="/#contact" className="text-white/90" onClick={() => setOpen(false)}>
              Contact
            </a>
            {user ? (
              <>
                <button type="button" className="text-left text-white" onClick={() => { setOpen(false); navigate('/my-bookings'); }}>
                  My Bookings
                </button>
                {isAdmin && (
                  <button type="button" className="text-left text-white" onClick={() => { setOpen(false); navigate('/admin'); }}>
                    Admin
                  </button>
                )}
                <button type="button" className="text-left text-white" onClick={() => { setOpen(false); logout(); }}>
                  Log out
                </button>
              </>
            ) : (
              <button type="button" className="text-left text-white" onClick={() => { setOpen(false); navigate('/login'); }}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
