import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';

const heroImage =
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2000&q=80';

const collage = [
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
];

export default function Home() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [promo, setPromo] = useState('');

  const searchParams = useMemo(() => {
    const p = new URLSearchParams();
    if (destination) p.set('destination', destination);
    if (checkIn) p.set('from', checkIn);
    if (checkOut) p.set('to', checkOut);
    if (guests) p.set('guests', guests);
    if (promo) p.set('promo', promo);
    return p.toString();
  }, [destination, checkIn, checkOut, guests, promo]);

  const runSearch = () => {
    const qs = searchParams ? `?${searchParams}` : '';
    navigate(`/rooms${qs}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative min-h-[88vh] pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/45 to-black/20" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-36 pt-10 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:pt-16">
          <div className="max-w-xl space-y-4 text-white">
            <p className="text-xs font-semibold tracking-[0.35em] text-white/70">ISLAND COLLECTION</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              <span className="block">WILPATTU</span>
              <span className="block">KANDY</span>
              <span className="block">NUWARA ELIYA</span>
            </h1>
            <p className="max-w-md text-sm text-white/80">
              Private reserves, misted hills, and tea-country manors — each stay composed like a signature suite.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => document.getElementById('search-bar')?.scrollIntoView({ behavior: 'smooth' })}>
                PLAN YOUR STAY
              </Button>
              <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-forest" onClick={() => navigate('/rooms')}>
                VIEW COLLECTION
              </Button>
            </div>
          </div>
        </div>

        <div
          id="search-bar"
          className="relative z-10 mx-auto -mb-16 max-w-6xl px-4 lg:px-8"
        >
          <div className="rounded-sm bg-white p-4 shadow-2xl ring-1 ring-black/5 lg:p-6">
            <div className="grid gap-4 lg:grid-cols-6 lg:items-end">
              <label className="lg:col-span-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Destination</span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none ring-forest focus:ring-2"
                >
                  <option value="">Anywhere</option>
                  <option value="Wilpattu">Wilpattu</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                </select>
              </label>
              <label className="lg:col-span-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Check-in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="lg:col-span-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Check-out</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="lg:col-span-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm outline-none ring-forest focus:ring-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>
                      {g} guest{g > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="lg:col-span-1">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Promo</span>
                <input
                  type="text"
                  placeholder="Code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm outline-none ring-forest focus:ring-2"
                />
              </label>
              <div className="lg:col-span-1">
                <Button className="w-full py-3" onClick={runSearch}>
                  SEARCH
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="bg-mist bg-puzzle pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-forest/70">OUR PHILOSOPHY</p>
            <h2 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">We are the heart of the island.</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink/80">
              From leopard country mornings to highland mists, every itinerary is composed with local hosts,
              seasonal cuisine, and architecture that defers to the landscape. This is slow luxury — intentional,
              warm, and quietly spectacular.
            </p>
            <Button variant="outline" className="mt-8" onClick={() => navigate('/rooms')}>
              DISCOVER MORE
            </Button>
          </div>
          <div className="relative h-[420px]">
            <img
              src={collage[0]}
              alt="Kayaking"
              className="absolute left-0 top-8 h-56 w-44 rounded-sm object-cover shadow-xl ring-1 ring-black/5 lg:h-64 lg:w-52"
            />
            <img
              src={collage[1]}
              alt="Resort pool"
              className="absolute left-28 top-0 h-64 w-52 rounded-sm object-cover shadow-2xl ring-1 ring-black/5 lg:left-36 lg:h-72 lg:w-60"
            />
            <img
              src={collage[2]}
              alt="Landscape"
              className="absolute bottom-0 right-6 h-52 w-64 rounded-sm object-cover shadow-xl ring-1 ring-black/5 lg:right-10 lg:h-60 lg:w-72"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-forest/70">CURATED FOR YOU</p>
          <h3 className="mt-3 font-serif text-3xl text-forest sm:text-4xl">Best Rate Guaranteed</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink/70">
            Reserve directly for complimentary upgrades when available, flexible changes, and dedicated concierge
            routing.
          </p>
          <div className="mt-10 flex justify-center">
            <Button onClick={() => navigate('/rooms')}>BROWSE ROOMS</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
