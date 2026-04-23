// data/projects.ts

export interface Project {
  slug:     string;
  title:    string;
  category: string;
  location: string;
  year:     string;
  // We'll use placeholder colours until you add real images
  color:    string;
}

export const projects: Project[] = [
  {
    slug:     "terrain",
    title:    "Terrain",
    category: "Brand Identity + Web",
    location: "Vienna",
    year:     "2024",
    color:    "#3d4a3e", // muted forest green
  },
  {
    slug:     "norda",
    title:    "Norda",
    category: "Web Experience",
    location: "Amsterdam",
    year:     "2023",
    color:    "#2e3a4a", // nordic slate blue
  },
  {
    slug:     "veld",
    title:    "Veld",
    category: "Brand Identity",
    location: "Berlin",
    year:     "2023",
    color:    "#3a2e22", // warm coffee brown
  },
  {
    slug:     "stav",
    title:    "Stav",
    category: "Web + Strategy",
    location: "Ljubljana",
    year:     "2024",
    color:    "#1e2a3a", // deep legal blue
  },
];