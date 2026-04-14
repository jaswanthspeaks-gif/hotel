import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { Spinner } from '../components/Spinner.jsx';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/bookings/mine');
      setBookings(data.bookings || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/api/bookings/mine/${id}/cancel`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Could not cancel');
    }
  };

  return (
    <div className="min-h-screen bg-mist bg-puzzle">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">JOURNEYS</p>
            <h1 className="font-serif text-4xl text-forest">My bookings</h1>
            <p className="mt-2 text-sm text-ink/70">Review upcoming stays, request changes, or cancel when plans shift.</p>
          </div>
          <Button onClick={() => navigate('/rooms')}>BOOK ANOTHER STAY</Button>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <p className="mt-10 text-sm text-red-700">{error}</p>
        ) : (
          <div className="mt-10 space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="grid gap-4 rounded-sm bg-white p-5 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-serif text-xl text-forest">{b.room?.title}</p>
                  <p className="text-sm text-ink/60">
                    {formatDate(b.checkIn)} — {formatDate(b.checkOut)} · {b.guests} guest{b.guests > 1 ? 's' : ''}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-forest/70">
                    Status: <span className="font-semibold">{b.status}</span> · USD {b.totalPrice}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button variant="outline" onClick={() => navigate(`/rooms/${b.room?._id}`)}>
                    VIEW ROOM
                  </Button>
                  {b.status !== 'cancelled' && (
                    <Button variant="danger" onClick={() => cancel(b._id)}>
                      CANCEL
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-sm text-ink/60">You have no bookings yet.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
