import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import Link from "next/link";
import { EXPO_OUT } from "@/lib/easings";

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="hover"
      className="group shrink-0 flex flex-col h-[65vh] w-[38vw] max-w-130 min-w-75"
    >
      {/* Image */}
      <div
        className="relative flex-1 overflow-hidden mb-5"
        style={{ backgroundColor: project.color }}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/20 transition-colors duration-500" />
        <span className="absolute top-5 right-5 font-mono text-[10px] text-white/40 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* View label - slides up on hover */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: EXPO_OUT }}
          className="absolute bottom-5 left-5 flex items-center gap-2"
        >
          <span className="w-4 h-px bg-white/60" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
            View case
          </span>
        </motion.div>
      </div>
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
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted/50">
            {project.year}
          </p>
        </div>
      </div>
    </Link>
  );
}
