import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get(`/api/rooms/${roomId}`);
        if (!ignore) {
          setRoom(data.room);
          setGuests(Math.min(2, data.room.maxGuests));
        }
      } catch (e) {
        if (!ignore) setError(e.response?.data?.message || 'Room not found');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [roomId]);

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
        )
      : 0;

  const estimated = room && nights ? nights * room.pricePerNight : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/book/${roomId}` } } });
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/bookings', {
        roomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
        promoCode: promo,
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist bg-puzzle">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error && !room ? (
          <div className="py-16 text-center text-sm text-red-700">{error}</div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-5">
            <section className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5 lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">Availability</p>
              <h1 className="mt-2 font-serif text-3xl text-forest">Reserve {room?.title}</h1>
              <p className="mt-2 text-sm text-ink/70">
                Choose your stay window. Conflicts with existing reservations are blocked automatically.
              </p>

              <form className="mt-8 space-y-5" onSubmit={submit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block text-xs font-semibold uppercase text-ink/50">Check-in</span>
                    <input
                      required
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-xs font-semibold uppercase text-ink/50">Check-out</span>
                    <input
                      required
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                    />
                  </label>
                </div>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase text-ink/50">Guests</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                  >
                    {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={g}>
                        {g} guest{g > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase text-ink/50">Promo code</span>
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                  />
                </label>
                {error && <p className="text-sm text-red-700">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'BOOKING…' : 'CONFIRM REQUEST'}
                </Button>
              </form>
            </section>

            <aside className="space-y-4 lg:col-span-2">
              <div className="overflow-hidden rounded-sm bg-forest text-white shadow-lg">
                <img
                  src={
                    room.imageUrl ||
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt=""
                  className="h-44 w-full object-cover opacity-90"
                />
                <div className="space-y-2 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">Summary</p>
                  <p className="font-serif text-2xl">{room.title}</p>
                  <p className="text-sm text-white/80">{room.destination}</p>
                  <div className="mt-4 border-t border-white/15 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Nights</span>
                      <span>{nights || '—'}</span>
                    </div>
                    <div className="mt-2 flex justify-between font-semibold">
                      <span className="text-white/80">Estimated</span>
                      <span>USD {estimated || '—'}</span>
                    </div>
                    <p className="mt-3 text-xs text-white/60">
                      Final taxes appear at confirmation. Promo codes are stored with your booking for concierge
                      review.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
