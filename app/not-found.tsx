// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-8 px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        404
      </p>
      <h1 className="font-serif text-[clamp(36px,6vw,96px)] text-text text-center leading-[0.9]">
        Page not found.
      </h1>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest text-accent hover:text-text transition-colors duration-300"
      >
        ← Back home
      </Link>
    </div>
  );
}