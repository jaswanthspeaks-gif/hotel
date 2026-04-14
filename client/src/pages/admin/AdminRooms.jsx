import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client.js';
import { Button } from '../../components/Button.jsx';
import { Spinner } from '../../components/Spinner.jsx';

const emptyForm = {
  roomNumber: '',
  title: '',
  destination: '',
  location: '',
  type: '',
  pricePerNight: '',
  description: '',
  imageUrl: '',
  maxGuests: 2,
  isActive: true,
};

const demoPreset = {
  roomNumber: 'NE-120',
  title: 'Summit Glass Pavilion',
  destination: 'Nuwara Eliya',
  location: 'Pidurutalagala foothills',
  type: 'Suite',
  pricePerNight: 310,
  description:
    'Floor-to-ceiling glass walls, private butler, and sunrise tea service overlooking cloud forests.',
  imageUrl:
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
  maxGuests: 3,
  isActive: true,
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/rooms/admin/all');
      setRooms(data.rooms || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingId(room._id);
    setForm({
      roomNumber: room.roomNumber,
      title: room.title,
      destination: room.destination || '',
      location: room.location || '',
      type: room.type,
      pricePerNight: room.pricePerNight,
      description: room.description || '',
      imageUrl: room.imageUrl || '',
      maxGuests: room.maxGuests,
      isActive: room.isActive,
    });
    setError('');
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
      };
      if (editingId) {
        await api.put(`/api/rooms/${editingId}`, payload);
      } else {
        await api.post('/api/rooms', payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message;
      const details = err.response?.data?.errors;
      setError(details ? details.map((d) => d.msg).join(', ') : msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this room and its booking history?')) return;
    try {
      await api.delete(`/api/rooms/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const tableRows = useMemo(() => rooms, [rooms]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">INVENTORY</p>
          <h1 className="font-serif text-3xl text-forest">Room management</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={load}>
            REFRESH
          </Button>
          <Button onClick={openCreate}>ADD ROOM</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm bg-white shadow-sm ring-1 ring-black/5">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-forest text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Room</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r._id} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium text-forest">{r.roomNumber}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3 text-ink/70">{r.type}</td>
                  <td className="px-4 py-3">USD {r.pricePerNight}</td>
                  <td className="px-4 py-3">{r.isActive ? 'Active' : 'Hidden'}</td>
                  <td className="space-x-2 px-4 py-3">
                    <button type="button" className="text-forest underline" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <button type="button" className="text-red-700 underline" onClick={() => remove(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl text-forest">{editingId ? 'Edit room' : 'Add room'}</h2>
              <button type="button" className="text-sm text-ink/60 hover:text-ink" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Room number</span>
                <input
                  required
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Destination</span>
                <input
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Location</span>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Type</span>
                <input
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Price / night (USD)</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricePerNight}
                  onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Max guests</span>
                <input
                  type="number"
                  min="1"
                  value={form.maxGuests}
                  onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-xs font-semibold uppercase text-ink/50">Image URL</span>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active on public site
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="text-xs font-semibold uppercase text-ink/50">Description</span>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
                />
              </label>
              {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setForm({ ...emptyForm, ...demoPreset })}>
                  AUTOFILL DEMO DETAILS
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'SAVING…' : 'SAVE ROOM'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
