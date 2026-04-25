
export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  color: string;
  tagline: string; // ← add this
}

export const projects: Project[] = [
  {
    slug: "terrain",
    title: "Terrain",
    category: "Brand Identity + Web",
    location: "Vienna",
    year: "2024",
    color: "#3d4a3e",
    tagline: "Sustainable gear for the long trail.",
  },
  {
    slug: "norda",
    title: "Norda",
    category: "Web Experience",
    location: "Amsterdam",
    year: "2023",
    color: "#2e3a4a",
    tagline: "Architecture that speaks before you enter.",
  },
  {
    slug: "veld",
    title: "Veld",
    category: "Brand Identity",
    location: "Berlin",
    year: "2023",
    color: "#3a2e22",
    tagline: "Single origin. Obsessively roasted.",
  },
  {
    slug: "stav",
    title: "Stav",
    category: "Web + Strategy",
    location: "Ljubljana",
    year: "2024",
    color: "#1e2a3a",
    tagline: "Legal tech built for the EU market.",
  },
];
