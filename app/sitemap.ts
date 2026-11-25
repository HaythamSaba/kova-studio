import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/work` },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
    })),
  ];
}
