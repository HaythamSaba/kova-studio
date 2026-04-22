// app/page.tsx
import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Preloader />

      <main className="bg-bg text-text ">
        <Hero />

        {/* Sentinel — marks end of hero for navbar */}
        <div id="hero-sentinel" />

        {/* Placeholder sections — we'll build these next */}
        <div className="h-screen flex items-center justify-center border-t border-border">
          <p className="font-mono text-muted text-sm uppercase tracking-widest">
            Work section — coming soon
          </p>
        </div>

        <div className="h-screen flex items-center justify-center border-t border-border">
          <p className="font-mono text-accent text-sm uppercase tracking-widest">
            Navbar should be frosted here ✓
          </p>
        </div>
      </main>
    </>
  );
}
