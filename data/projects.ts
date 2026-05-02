// data/projects.ts
export interface Project {
  slug:      string;
  title:     string;
  category:  string;
  location:  string;
  year:      string;
  color:     string;  // keep as fallback while image loads
  tagline:   string;
  images: {
    portrait:  string;  // used in hover grid — tall format
    landscape: string;  // used in horizontal scroll + case study
  };
}

export const projects: Project[] = [
  {
    slug:     "terrain",
    title:    "Terrain",
    category: "Brand Identity + Web",
    location: "Vienna",
    year:     "2024",
    color:    "#3d4a3e",
    tagline:  "Sustainable gear for the long trail.",
    images: {
      portrait:  "/images/projects/terrain-portrait.png",
      landscape: "/images/projects/terrain-landscape.png",
    },
  },
  {
    slug:     "norda",
    title:    "Norda",
    category: "Web Experience",
    location: "Amsterdam",
    year:     "2023",
    color:    "#2e3a4a",
    tagline:  "Architecture that speaks before you enter.",
    images: {
      portrait:  "/images/projects/norda-portrait.png",
      landscape: "/images/projects/norda-landscape.png",
    },
  },
  {
    slug:     "veld",
    title:    "Veld",
    category: "Brand Identity",
    location: "Berlin",
    year:     "2023",
    color:    "#3a2e22",
    tagline:  "Single origin. Obsessively roasted.",
    images: {
      portrait:  "/images/projects/veld-portrait.png",
      landscape: "/images/projects/veld-landscape.png",
    },
  },
  {
    slug:     "stav",
    title:    "Stav",
    category: "Web + Strategy",
    location: "Ljubljana",
    year:     "2024",
    color:    "#1e2a3a",
    tagline:  "Legal tech built for the EU market.",
    images: {
      portrait:  "/images/projects/stav-portrait.png",
      landscape: "/images/projects/stav-landscape.png",
    },
  },
];