import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer id="contact" className="bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 font-serif text-lg">
            J
          </div>
          <p className="text-sm text-white/80">
            Curated island escapes across Wilpattu, Kandy, and Nuwara Eliya — crafted for slow travel and
            unforgettable horizons.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg">Concierge</h4>
          <p className="mt-3 text-sm text-white/80">reservations@resortlk.example</p>
          <p className="text-sm text-white/80">+94 11 555 0142</p>
        </div>
        <div>
          <h4 className="font-serif text-lg">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/rooms" className="hover:text-white">
                Rooms &amp; Suites
              </Link>
            </li>
            <li>
              <a href="/#story" className="hover:text-white">
                Our Story
              </a>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Member Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Resort LK. Demo MERN application.
      </div>
    </footer>
  );
}
