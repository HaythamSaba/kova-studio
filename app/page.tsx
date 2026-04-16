// app/page.tsx — temporary smoke test, we'll replace this soon
export default function Home() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 p-8">
      <p className="font-mono text-muted text-sm uppercase tracking-widest">
        Kova Studio — setup check
      </p>
      <h1 className="font-serif text-6xl text-text text-center leading-tight">
        We forge brands
        <br />
        <em>that hold their shape.</em>
      </h1>
      <p className="font-sans text-muted max-w-md text-center">
        Tailwind tokens ✓ · Fonts ✓ · Design system ✓
      </p>
      <div className="w-8 h-8 rounded-full bg-accent" />
    </main>
  );
}
  