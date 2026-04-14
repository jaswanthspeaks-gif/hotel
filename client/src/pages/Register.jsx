import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message;
      const details = err.response?.data?.errors;
      setError(details ? details.map((d) => d.msg).join(', ') : msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist bg-puzzle">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-28 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">JOIN THE COLLECTION</p>
          <h1 className="mt-2 font-serif text-4xl text-forest">Create your profile</h1>
          <p className="mt-2 text-sm text-ink/70">Save preferences, track journeys, and book in fewer steps.</p>
        </div>
        <form
          onSubmit={submit}
          className="rounded-sm bg-white p-8 shadow-sm ring-1 ring-black/5"
        >
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase text-ink/50">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="mt-4 block text-sm">
            <span className="text-xs font-semibold uppercase text-ink/50">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
            />
          </label>
          <label className="mt-4 block text-sm">
            <span className="text-xs font-semibold uppercase text-ink/50">Password (min 6)</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
          </Button>
          <p className="mt-4 text-center text-sm text-ink/70">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-forest hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
