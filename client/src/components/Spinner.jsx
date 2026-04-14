export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div
      className={`${className} animate-spin rounded-full border-2 border-forest/20 border-t-forest`}
      role="status"
      aria-label="Loading"
    />
  );
}
