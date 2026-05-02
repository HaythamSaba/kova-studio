import { Project } from "@/data/projects";
import { EXPO_OUT } from "@/lib/easings";
import { motion } from "framer-motion";
import Link from "next/link";
interface ProjectRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const rowVariants = {
  initial: {
    opacity: 1,
  },
  dimmed: {
    opacity: 0.3,
    transition: {
      duration: 0.3,
    },
  },
};

export default function ProjectRow({
  project,
  index,
  isActive,
  isDimmed,
  onEnter,
  onLeave,
}: ProjectRowProps) {
  return (
    <motion.li
      animate={isDimmed ? "dimmed" : "initial"}
      variants={rowVariants}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group "
      data-cursor="hover"
    >
      <Link
        href={`/work/${project.slug}`}
        className="flex items-center justify-between py-7 md:py-9 gap-4"
      >
        {/* Left: index + title */}
        <div className="flex items-baseline gap-6 md:gap-10">
          <span className="font-mono text-[10px] text-muted tracking-widest w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-serif text-[clamp(28px,4.5vw,72px)] leading-none text-text group-hover:text-accent transition-colors duration-500">
            {project.title}
          </span>
        </div>
        {/* Right: meta */}
        <div className="hidden: md:flex items-center gap-10 shrink-0">
          <span className="font-sans text-sm text-muted">
            {project.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted w-20 text-right">
            {project.location}
          </span>
          {/* Arrow - slides in on hover */}
          <motion.span
            animate={{ x: isActive ? 0 : -6, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EXPO_OUT }}
            className="font-mono text-sm text-accent"
          >
            →
          </motion.span>
        </div>
      </Link>
    </motion.li>
  );
}
