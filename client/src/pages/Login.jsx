import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const u = await login(email, password);
      if (from) navigate(from, { replace: true });
      else navigate(u.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist bg-puzzle">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-28 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">WELCOME BACK</p>
          <h1 className="mt-2 font-serif text-4xl text-forest">Sign in</h1>
          <p className="mt-2 text-sm text-ink/70">
            Access your itineraries, manage bookings, and unlock member rates.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="rounded-sm bg-white p-8 shadow-sm ring-1 ring-black/5"
        >
          <label className="block text-sm">
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
            <span className="text-xs font-semibold uppercase text-ink/50">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-sm border border-ink/15 px-3 py-2 outline-none ring-forest focus:ring-2"
            />
          </label>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </Button>
          <p className="mt-4 text-center text-sm text-ink/70">
            New guest?{' '}
            <Link to="/register" className="font-semibold text-forest hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-6 rounded-sm bg-mist p-3 text-xs text-ink/60">
            Demo: <span className="font-semibold">guest@resort.lk</span> / Guest123! — Admin:{' '}
            <span className="font-semibold">admin@resort.lk</span> / Admin123!
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
