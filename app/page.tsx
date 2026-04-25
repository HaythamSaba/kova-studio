// app/page.tsx
// import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";
import WorkGrid from "@/components/sections/WorkGrid";
import HorizontalScroll from "@/components/sections/HorizontalScroll";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      {/* <Preloader /> */}
      <main className="bg-bg text-text">
        <Hero />
        <div id="hero-sentinel" />
        <WorkGrid />
        <HorizontalScroll />
        <About />

        {/* Placeholder */}
        <div className="h-screen flex items-center justify-center border-t border-border">
          <p className="font-mono text-muted text-sm uppercase tracking-widest">
            Capabilities — coming Day 9
          </p>
        </div>
      </main>
    </>
  );
}
