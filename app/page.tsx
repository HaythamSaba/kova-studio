// app/page.tsx — temporary scroll test
export default function Home() {
  return (
    <main className="bg-bg text-text">
      {/* Tall section to enable scrolling */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-muted text-sm uppercase tracking-widest mb-4">
            Scroll down
          </p>
          <h1 className="font-serif text-6xl">
            We forge brands
            <br />
            <em>that hold their shape.</em>
          </h1>
        </div>
      </div>

      {/* Middle section */}
      <div className="h-screen flex items-center justify-center border-t border-border">
        <p className="font-sans text-muted text-lg">Lenis is running ✓</p>
      </div>

      {/* Bottom section */}
      <div className="h-screen flex items-center justify-center border-t border-border">
        <p className="font-mono text-accent text-sm uppercase tracking-widest">
          GSAP ScrollTrigger wired ✓
        </p>
      </div>
    </main>
  );
}
