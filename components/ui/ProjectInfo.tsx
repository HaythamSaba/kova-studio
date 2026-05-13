import { Project } from "@/data/projects";

export default function ProjectInfo({ project }: { project: Project }) {
  return (
    <div className="flex items-end justify-between shrink-0">
      <div>
        <p className="font-serif text-2xl text-text group-hover:text-accent transition-colors duration-300 mb-1">
          {project.title}
        </p>
        <p className="font-sans text-xs text-muted">{project.tagline}</p>
      </div>
      <div className="text-right shrink-0 ml-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
          {project.location}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
          {project.year}
        </p>
      </div>
    </div>
  );
}
