// data/projects.ts
export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  color: string; // keep as fallback while image loads
  tagline: string;
  images: {
    portrait: string; // used in hover grid — tall format
    landscape: string; // used in horizontal scroll + case study
  };
  copy: {
    brief: string;
    outcome: string;
  };
}

export const projects: Project[] = [
  {
    slug: "terrain",
    title: "Terrain",
    category: "Brand Identity + Web",
    location: "Vienna",
    year: "2024",
    color: "#3d4a3e",
    tagline: "Gear for people who take the long way home.",
    images: {
      portrait: "/images/projects/terrain-portrait.png",
      landscape: "/images/projects/terrain-landscape.png",
    },
    copy: {
      brief:
        "Terrain came to us with a positioning problem. They make sustainable outdoor gear for serious hikers — but their brand looked like every other outdoor company. Bold typefaces, conquest photography, aggressive colour. They wanted something different. A brand that felt like the landscape itself — patient, textured, enduring. We were brought in to build the full identity system and a Shopify-based e-commerce experience ahead of their Vienna flagship store opening.",
      outcome:
        "We built the identity around the contour line — the cartographic tool that makes terrain readable. It became the mark, the packaging system, the web grid. Every surface speaks the same quiet language. The e-commerce site launched to 28,000 email subscribers with a 3.4% conversion rate in the first month — above  the industry average for premium outdoor apparel. The Vienna store opened to a waiting list.",
    },
  },
  {
    slug: "norda",
    title: "Norda",
    category: "Web Experience",
    location: "Amsterdam",
    year: "2023",
    color: "#2e3a4a",
    tagline: "Architecture that speaks before you enter.",
    images: {
      portrait: "/images/projects/norda-portrait.png",
      landscape: "/images/projects/norda-landscape.png",
    },
    copy: {
      brief:
        "Norda is a Scandinavian architecture firm with offices in Amsterdam and Oslo. They had a body of work that deserved better than the static PDF portfolios their competitors were using. Their brief was direct: build something that feels like standing inside one of our buildings. Scroll-driven. Full-screen photography. No noise.",
      outcome:
        "We built a full-screen scroll experience where each project unfolds like a spatial sequence — photography that fills the viewport, typography that breathes, transitions that feel architectural rather than digital.The site won an Honorable Mention on Awwwards within three weeks of launch. Norda reported a 60% increase in inbound inquiries from clients citing the website as their first point of contact with the firm.",
    },
  },
  {
    slug: "veld",
    title: "Veld",
    category: "Brand Identity",
    location: "Berlin",
    year: "2023",
    color: "#3a2e22",
    tagline: "Single origin. Obsessively roasted.",
    images: {
      portrait: "/images/projects/veld-portrait.png",
      landscape: "/images/projects/veld-landscape.png",
    },
    copy: {
      brief:
        "Veld is a specialty coffee roaster operating out of Berlin's Neukölln district. They source single-origin beans from Ethiopia, Colombia, and Georgia, and roast in small batches for wholesale and direct-to-consumer. They needed an identity that matched the obsessive quality of the product — something that could live on a bag, a swing tag, an espresso cup, and a minimal web presence without losing integrity at any scale.",
      outcome:
        "The identity is built around provenance — the idea that every bean has a specific origin, a specific altitude, a specific farmer. The mark is a simplified topographic profile of the Ethiopian highlands where their flagship bean grows. Applied across kraft packaging, ceramic cups, and a minimal web presence that focuses entirely on the sourcing story. Veld's wholesale accounts tripled in the six months following the rebrand. The packaging now sits in 14 independent cafés across Berlin and Vienna.",
    },
  },
  {
    slug: "stav",
    title: "Stav",
    category: "Web + Strategy",
    location: "Ljubljana",
    year: "2024",
    color: "#1e2a3a",
    tagline: "Legal tech built for the market that matters.",
    images: {
      portrait: "/images/projects/stav-portrait.png",
      landscape: "/images/projects/stav-landscape.png",
    },
    copy: {
      brief:
        "Stav is a Ljubljana-based legal tech startup building contract automation tools for the EU market. They were preparing for a Series A round and needed an investor site that communicated traction, credibility, and European ambition — in that order. The challenge: legal tech is a credibility-first category. The site needed to feel like the product already existed and was already trusted, even before the public launch.",
      outcome:
        "We led both the digital strategy and the web build. The strategy work defined the positioning — not 'legal tech for SMEs' (crowded) but 'the contract layer for EU market entry' (specific, defensible,  timely given regulatory changes in 2024). The investor site launched two weeks before the  fundraising roadshow. Stav closed their Series A at €2.4M with participation from two Vienna-based  funds and one Amsterdam-based operator. The founding team credited the site as the strongest asset in their pitch deck.",
    },
  },
];

export const stats = [
  { value: 28, suffix: "+", label: "Projects delivered" },
  { value: 4, suffix: "", label: "Years in practice" },
  { value: 3, suffix: "", label: "People on the team" },
];
