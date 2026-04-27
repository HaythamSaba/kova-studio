// app/work/[slug]/page.tsx
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import CaseStudy from "@/components/sections/CaseStudy";

// ── Static params ─────────────────────────────────────
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// ── Metadata ──────────────────────────────────────────
// params is now Promise<{ slug: string }> in Next.js 16
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Must await before accessing .slug
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — Kova Studio`,
    description: project.tagline,
  };
}

// ── Page ──────────────────────────────────────────────
export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Must await before accessing .slug
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return <CaseStudy project={project} />;
}
