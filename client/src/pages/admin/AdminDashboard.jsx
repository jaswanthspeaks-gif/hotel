import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import { Button } from '../../components/Button.jsx';
import { Spinner } from '../../components/Spinner.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [roomsRes, bookingsRes, usersRes] = await Promise.all([
          api.get('/api/rooms/admin/all'),
          api.get('/api/bookings/admin/all'),
          api.get('/api/users'),
        ]);
        if (!ignore) {
          setStats({
            rooms: roomsRes.data.rooms?.length || 0,
            bookings: bookingsRes.data.bookings?.length || 0,
            users: usersRes.data.users?.length || 0,
          });
        }
      } catch {
        if (!ignore) setStats({ rooms: 0, bookings: 0, users: 0 });
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const cards = [
    { label: 'Rooms live', value: stats.rooms, action: () => navigate('/admin/rooms') },
    { label: 'Bookings logged', value: stats.bookings, action: () => navigate('/admin/bookings') },
    { label: 'Registered guests', value: stats.users, action: () => navigate('/admin/users') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">OVERVIEW</p>
        <h1 className="font-serif text-4xl text-forest">Operations dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/70">
          Monitor inventory, confirmations, and guest records from a single console aligned with the public site
          experience.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <p className="text-xs uppercase tracking-wide text-ink/50">{c.label}</p>
              <p className="mt-3 font-serif text-4xl text-forest">{c.value}</p>
              <Button className="mt-6" variant="outline" onClick={c.action}>
                OPEN
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
