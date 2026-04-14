import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { Spinner } from '../components/Spinner.jsx';

export default function Rooms() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = useMemo(
    () => ({
      destination: searchParams.get('destination') || '',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      type: searchParams.get('type') || '',
      availableOnly: searchParams.get('availableOnly') === 'true',
    }),
    [searchParams]
  );

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const p = new URLSearchParams();
        if (filters.destination) p.set('destination', filters.destination);
        if (filters.minPrice) p.set('minPrice', filters.minPrice);
        if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
        if (filters.type) p.set('type', filters.type);
        if (filters.from && filters.to) {
          p.set('availableFrom', filters.from);
          p.set('availableTo', filters.to);
          if (filters.availableOnly) p.set('availableOnly', 'true');
        }
        const { data } = await api.get(`/api/rooms?${p.toString()}`);
        if (!ignore) setRooms(data.rooms || []);
      } catch (e) {
        if (!ignore) setError(e.response?.data?.message || 'Could not load rooms');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [filters]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === false) next.delete(key);
    else next.set(key, String(value));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-mist bg-puzzle">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-forest/70">COLLECTION</p>
            <h1 className="font-serif text-4xl text-forest">Rooms &amp; Residences</h1>
            <p className="mt-2 max-w-xl text-sm text-ink/70">
              Filter by destination, budget, and stay dates. Availability updates in real time against live
              reservations.
            </p>
          </div>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>REFINE SEARCH</Button>
        </div>

        <div className="mt-10 grid gap-4 rounded-sm bg-white p-4 shadow-sm ring-1 ring-black/5 md:grid-cols-2 lg:grid-cols-6 lg:items-end">
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">Destination</span>
            <select
              value={filters.destination}
              onChange={(e) => updateParam('destination', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            >
              <option value="">All</option>
              <option>Wilpattu</option>
              <option>Kandy</option>
              <option>Nuwara Eliya</option>
            </select>
          </label>
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">From</span>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => updateParam('from', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">To</span>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => updateParam('to', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">Type</span>
            <input
              type="text"
              placeholder="Suite, Deluxe..."
              value={filters.type}
              onChange={(e) => updateParam('type', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">Min USD</span>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="lg:col-span-1">
            <span className="text-xs font-semibold uppercase text-ink/50">Max USD</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/80 lg:col-span-2">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              disabled={!filters.from || !filters.to}
              onChange={(e) => updateParam('availableOnly', e.target.checked ? 'true' : '')}
            />
            Only show available rooms for selected dates
          </label>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <p className="mt-10 text-center text-sm text-red-700">{error}</p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const available =
                room.availableForRange === undefined ? true : Boolean(room.availableForRange);
              return (
                <article
                  key={room._id}
                  className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        room.imageUrl ||
                        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt={room.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {!available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold uppercase tracking-wide text-white">
                        Unavailable for dates
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs uppercase tracking-wide text-forest/70">{room.destination}</p>
                    <h2 className="mt-1 font-serif text-xl text-forest">{room.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">{room.description}</p>
                    <p className="mt-4 text-sm font-semibold text-forest">
                      from USD {room.pricePerNight}{' '}
                      <span className="text-xs font-normal text-ink/60">per night</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <Link to={`/rooms/${room._id}`} className="text-sm font-semibold text-forest underline-offset-4 hover:underline">
                        View details
                      </Link>
                      <Button
                        disabled={!available && filters.from && filters.to}
                        onClick={() => navigate(`/book/${room._id}`)}
                      >
                        BOOK
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <p className="mt-16 text-center text-sm text-ink/60">No rooms match your filters.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
