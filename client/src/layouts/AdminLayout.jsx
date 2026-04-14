import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';

const navClass = ({ isActive }) =>
  `block rounded-sm px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'
  }`;

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mist">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="hidden flex-col bg-forest text-white lg:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 font-serif text-lg">
              J
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/60">Admin Suite</p>
            <p className="text-sm font-semibold">{user?.name}</p>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            <NavLink to="/admin" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/rooms" className={navClass}>
              Room management
            </NavLink>
            <NavLink to="/admin/bookings" className={navClass}>
              Bookings &amp; availability
            </NavLink>
            <NavLink to="/admin/users" className={navClass}>
              User management
            </NavLink>
          </nav>
          <div className="space-y-2 border-t border-white/10 p-4">
            <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
              VIEW SITE
            </Button>
            <Button
              className="w-full !border-white/30 !text-white hover:!bg-white/10"
              variant="outline"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              LOG OUT
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-4 lg:hidden">
            <p className="font-serif text-lg text-forest">Admin</p>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              MENU
            </Button>
          </header>
          <div className="border-b border-ink/10 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
              <NavLink to="/admin" end className="rounded-sm bg-mist px-2 py-1 text-forest">
                Home
              </NavLink>
              <NavLink to="/admin/rooms" className="rounded-sm bg-mist px-2 py-1 text-forest">
                Rooms
              </NavLink>
              <NavLink to="/admin/bookings" className="rounded-sm bg-mist px-2 py-1 text-forest">
                Bookings
              </NavLink>
              <NavLink to="/admin/users" className="rounded-sm bg-mist px-2 py-1 text-forest">
                Users
              </NavLink>
            </div>
          </div>
          <main className="flex-1 bg-mist bg-puzzle p-4 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
