// app/error.tsx
"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-8 px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        Error
      </p>
      <h1 className="font-serif text-[clamp(36px,6vw,96px)] text-text text-center leading-[0.9]">
        Something went wrong.
      </h1>
      <button
        onClick={reset}
        className="font-mono text-xs uppercase tracking-widest text-accent hover:text-text transition-colors duration-300 cursor-pointer"
      >
        ← Try again
      </button>
    </div>
  );
}
