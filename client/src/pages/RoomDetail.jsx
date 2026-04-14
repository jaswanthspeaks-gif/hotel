import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { Spinner } from '../components/Spinner.jsx';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get(`/api/rooms/${id}`);
        if (!ignore) setRoom(data.room);
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
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error || !room ? (
          <div className="py-20 text-center">
            <p className="text-sm text-red-700">{error || 'Not found'}</p>
            <Button className="mt-6" onClick={() => navigate('/rooms')}>
              BACK TO ROOMS
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs font-semibold uppercase tracking-wide text-forest hover:underline"
            >
              ← Back
            </button>
            <div className="mt-6 grid gap-10 lg:grid-cols-2">
              <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black/5">
                <img
                  src={
                    room.imageUrl ||
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={room.title}
                  className="h-full max-h-[480px] w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">{room.destination}</p>
                <h1 className="mt-2 font-serif text-4xl text-forest">{room.title}</h1>
                <p className="mt-2 text-sm text-ink/60">{room.location}</p>
                <p className="mt-6 text-sm leading-relaxed text-ink/80">{room.description}</p>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-sm bg-mist p-4">
                    <dt className="text-xs uppercase text-ink/50">Room</dt>
                    <dd className="font-semibold text-forest">{room.roomNumber}</dd>
                  </div>
                  <div className="rounded-sm bg-mist p-4">
                    <dt className="text-xs uppercase text-ink/50">Type</dt>
                    <dd className="font-semibold text-forest">{room.type}</dd>
                  </div>
                  <div className="rounded-sm bg-mist p-4">
                    <dt className="text-xs uppercase text-ink/50">Guests</dt>
                    <dd className="font-semibold text-forest">Up to {room.maxGuests}</dd>
                  </div>
                  <div className="rounded-sm bg-mist p-4">
                    <dt className="text-xs uppercase text-ink/50">From</dt>
                    <dd className="font-semibold text-forest">USD {room.pricePerNight} / night</dd>
                  </div>
                </dl>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Button onClick={() => navigate(`/book/${room._id}`)}>BOOK THIS ROOM</Button>
                  <Button variant="outline" onClick={() => navigate('/rooms')}>
                    VIEW OTHER ROOMS
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
