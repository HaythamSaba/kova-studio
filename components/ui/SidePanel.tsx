import SectionTitle from "./SectionTitle";

interface SidePanelProps {
  label: string;
  titleLeft: Array<string>;
  titleMiddle: string;
  titleRight?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function SidePanel({
  label,
  titleLeft,
  titleMiddle,
  titleRight,
  children,
  className = "",
}: SidePanelProps) {
  return (
    <div
      className={`shrink-0 flex flex-col justify-between h-[65vh] w-[30vw] max-w-90 pl-8 border-l border-border ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
        {label}
      </p>

      <SectionTitle
        as="h3"
        Left={titleLeft}
        ColoredMiddle={titleMiddle}
        Right={titleRight}
      />

      {children}
    </div>
  );
}
