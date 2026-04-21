// app/page.tsx
export default function Home() {
  return (
    <main className="bg-bg text-text">
      {/* Hero section */}
      <div className="h-screen flex flex-col items-center justify-center bg-[url('/bg.png')] bg-center bg-cover">
        <p className="font-mono text-muted text-sm uppercase tracking-widest mb-6">
          Scroll down to see navbar change
        </p>
        <h1 className="font-serif text-6xl text-center">
          We forge brands
          <br />
          <em>that hold their shape.</em>
        </h1>
      </div>

      {/* Sentinel — zero height, marks end of hero */}
      {/* Navbar watches this element with IntersectionObserver */}
      <div id="hero-sentinel" />

      {/* Content below hero */}
      <div className="h-screen flex items-center justify-center border-t border-border">
        <p className="font-sans text-muted text-lg">
          Navbar should now be frosted ✓
        </p>
      </div>

      <div className="h-screen flex items-center justify-center border-t border-border">
        <p className="font-mono text-accent text-sm uppercase tracking-widest">
          Scroll back up — should go transparent again ✓
        </p>
      </div>
    </main>
  );
}
