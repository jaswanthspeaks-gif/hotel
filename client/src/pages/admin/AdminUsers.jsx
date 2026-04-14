import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import { Button } from '../../components/Button.jsx';
import { Spinner } from '../../components/Spinner.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Could not update role');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Could not delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">DIRECTORY</p>
          <h1 className="font-serif text-3xl text-forest">User management</h1>
        </div>
        <Button variant="outline" onClick={load}>
          REFRESH
        </Button>
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
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-sm border border-ink/15 px-2 py-1 text-xs outline-none ring-forest focus:ring-2"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="text-red-700 underline" onClick={() => remove(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
