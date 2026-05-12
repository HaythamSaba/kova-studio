// app/page.tsx
import Hero from "@/components/sections/Hero";
import WorkGrid from "@/components/sections/WorkGrid";
import HorizontalScroll from "@/components/sections/HorizontalScroll";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";
import Marquee from "@/components/ui/Marquee";
import Preloader from "@/components/ui/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <main id="main-content" className="bg-bg text-text">
        <Hero />
        <div id="hero-sentinel" />
        <Marquee />
        <WorkGrid />
        <HorizontalScroll />
        <About />
        <Capabilities />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
