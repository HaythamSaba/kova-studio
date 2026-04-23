// app/page.tsx
import Hero from "@/components/sections/Hero";
import WorkGrid from "@/components/sections/WorkGrid";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="bg-bg text-text">
        <Hero />
        <div id="hero-sentinel" />
        <WorkGrid />

        {/* Placeholder sections */}
        <div className="h-screen flex items-center justify-center border-t border-border">
          <p className="font-mono text-muted text-sm uppercase tracking-widest">
            Horizontal scroll — coming soon
          </p>
        </div>
      </main>
    </>
  );
}
