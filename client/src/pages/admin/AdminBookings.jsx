import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client.js';
import { Button } from '../../components/Button.jsx';
import { Spinner } from '../../components/Spinner.jsx';

function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addMonths(d, n) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

function eachDayInMonth(monthStart) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const last = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: last }, (_, i) => new Date(year, month, i + 1));
}

function MonthGrid({ monthDate, marks }) {
  const days = eachDayInMonth(monthDate);
  const label = monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const startWeekday = days[0].getDay();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  days.forEach((d) => cells.push(d));

  return (
    <div className="rounded-sm border border-ink/10 bg-white p-3">
      <p className="mb-2 text-center font-serif text-lg text-forest">{label}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-ink/40">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key = day.toDateString();
          const mark = marks[key];
          return (
            <div
              key={key}
              className={`rounded-sm py-2 ${
                mark === 'booked'
                  ? 'bg-forest text-white'
                  : mark === 'start'
                    ? 'bg-forest/80 text-white'
                    : 'bg-mist text-ink'
              }`}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminBookings() {
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState('');
  const [roomId, setRoomId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [availability, setAvailability] = useState([]);
  const [checking, setChecking] = useState(false);
  const [calMonth, setCalMonth] = useState(() => startOfMonth(new Date()));

  const load = async () => {
    setLoading(true);
    try {
      const [b, r] = await Promise.all([api.get('/api/bookings/admin/all'), api.get('/api/rooms/admin/all')]);
      setBookings(b.data.bookings || []);
      setRooms(r.data.rooms || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!hotel) return rooms;
    return rooms.filter((x) => (x.destination || '').toLowerCase() === hotel.toLowerCase());
  }, [rooms, hotel]);

  const marks = useMemo(() => {
    const map = {};
    const selected = roomId;
    if (!selected) return map;
    bookings
      .filter((b) => String(b.room?._id || b.room) === String(selected))
      .filter((b) => b.status !== 'cancelled')
      .forEach((b) => {
        const start = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        const cursor = new Date(start);
        while (cursor < end) {
          const key = new Date(cursor).toDateString();
          const sameDay = cursor.getTime() === start.getTime();
          map[key] = sameDay ? 'start' : 'booked';
          cursor.setDate(cursor.getDate() + 1);
        }
      });
    return map;
  }, [bookings, roomId]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/bookings/admin/${id}/status`, { status });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed');
    }
  };

  const removeBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      await api.delete(`/api/bookings/admin/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const runAvailability = async () => {
    if (!from || !to) {
      alert('Select from and to dates');
      return;
    }
    setChecking(true);
    try {
      const p = new URLSearchParams();
      if (hotel) p.set('destination', hotel);
      if (roomId) p.set('roomId', roomId);
      p.set('availableFrom', from);
      p.set('availableTo', to);
      const { data } = await api.get(`/api/rooms?${p.toString()}`);
      setAvailability(data.rooms || []);
    } catch (e) {
      alert(e.response?.data?.message || 'Availability check failed');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">RESERVATIONS</p>
          <h1 className="font-serif text-3xl text-forest">Bookings &amp; availability</h1>
        </div>
        <div className="inline-flex rounded-sm bg-white p-1 shadow-sm ring-1 ring-black/5">
          <button
            type="button"
            className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              tab === 'bookings' ? 'bg-forest text-white' : 'text-ink/70'
            }`}
            onClick={() => setTab('bookings')}
          >
            Bookings
          </button>
          <button
            type="button"
            className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              tab === 'availability' ? 'bg-forest text-white' : 'text-ink/70'
            }`}
            onClick={() => setTab('availability')}
          >
            Availability
          </button>
        </div>
      </div>

      {tab === 'bookings' ? (
        loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-10 w-10" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-sm bg-white shadow-sm ring-1 ring-black/5">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-forest text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Guest</th>
                  <th className="px-4 py-3 font-semibold">Room</th>
                  <th className="px-4 py-3 font-semibold">Dates</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-ink/10">
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.user?.name}</p>
                      <p className="text-xs text-ink/50">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">{b.room?.title}</td>
                    <td className="px-4 py-3 text-xs text-ink/70">
                      {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className="rounded-sm border border-ink/15 px-2 py-1 text-xs outline-none ring-forest focus:ring-2"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-red-700 underline" onClick={() => removeBooking(b._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-sm bg-white p-4 shadow-sm ring-1 ring-black/5 lg:grid-cols-4 lg:items-end">
            <label className="text-sm">
              <span className="text-xs font-semibold uppercase text-ink/50">Hotel (destination)</span>
              <select
                value={hotel}
                onChange={(e) => {
                  setHotel(e.target.value);
                  setRoomId('');
                }}
                className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
              >
                <option value="">All hotels</option>
                {[...new Set(rooms.map((r) => r.destination).filter(Boolean))].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm lg:col-span-2">
              <span className="text-xs font-semibold uppercase text-ink/50">Room</span>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
              >
                <option value="">All rooms in filter</option>
                {filteredRooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} · {r.roomNumber}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-xs text-ink/50 lg:col-span-1">
              Property filter is implicit through destination + room selection, matching the operational console in
              your mockups.
            </div>
            <label className="text-sm">
              <span className="text-xs font-semibold uppercase text-ink/50">From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
              />
            </label>
            <label className="text-sm">
              <span className="text-xs font-semibold uppercase text-ink/50">To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 text-sm outline-none ring-forest focus:ring-2"
              />
            </label>
            <div className="lg:col-span-2">
              <Button className="w-full" onClick={runAvailability} disabled={checking}>
                {checking ? 'CHECKING…' : 'CHECK AVAILABILITY'}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MonthGrid monthDate={calMonth} marks={marks} />
            <MonthGrid monthDate={addMonths(calMonth, 1)} marks={marks} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setCalMonth(addMonths(calMonth, -1))}>
              PREVIOUS MONTHS
            </Button>
            <Button variant="outline" onClick={() => setCalMonth(addMonths(calMonth, 1))}>
              NEXT MONTHS
            </Button>
            <Button variant="outline" onClick={() => setCalMonth(startOfMonth(new Date()))}>
              RESET TO TODAY
            </Button>
          </div>
          {!roomId && (
            <p className="text-xs text-ink/60">
              Select a room to highlight occupied nights in green on the calendar. Navigate months to inspect
              shoulder seasons.
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availability.map((room) => (
              <div key={room._id} className="overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5">
                <img
                  src={
                    room.imageUrl ||
                    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
                  }
                  alt=""
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-2 p-4">
                  <p className="font-serif text-lg text-forest">{room.title}</p>
                  <p className="text-xs text-ink/60">{room.destination}</p>
                  <p className="text-sm font-semibold text-forest">
                    from USD {room.pricePerNight}{' '}
                    <span className="text-xs font-normal text-ink/50">per night</span>
                  </p>
                  <p className="text-xs uppercase tracking-wide text-forest/80">
                    {room.availableForRange === false ? 'Unavailable' : 'Available'} for selected window
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
