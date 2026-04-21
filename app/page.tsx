// app/page.tsx — cursor test
export default function Home() {
  return (
    <main className="bg-bg text-text">
      <div className="h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="font-serif text-6xl">Move your cursor around</h1>

        {/* Test hover state */}
        <a
          href="#"
          className="font-sans text-accent text-sm uppercase tracking-widest"
        >
          Hover me — cursor should expand
        </a>

        {/* Test custom data attribute */}
        <div
          data-cursor="hover"
          className="px-6 py-3 border border-border text-muted font-sans text-sm"
        >
          I&apos;m a div — cursor should still expand
        </div>

        {/* Test click state */}
        <button className="font-sans text-muted text-sm">
          Click me — cursor should shrink
        </button>
      </div>

      <div className="h-screen flex items-center justify-center border-t border-border">
        <p className="font-mono text-accent text-sm uppercase tracking-widest">
          Custom cursor ✓
        </p>
      </div>
    </main>
  );
}
