import { cn } from "@/lib/utils";

type StatusLevel = "green" | "yellow" | "red";

const labels: Record<StatusLevel, string> = {
  green: "Nizko",
  yellow: "Srednje",
  red: "Visoko",
};

interface StatusBadgeProps {
  level: StatusLevel;
  label?: string;
  className?: string;
}

export function StatusBadge({ level, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        level === "green" && "bg-status-green-bg text-status-green",
        level === "yellow" && "bg-status-yellow-bg text-status-yellow",
        level === "red" && "bg-status-red-bg text-status-red",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          level === "green" && "bg-status-green",
          level === "yellow" && "bg-status-yellow",
          level === "red" && "bg-status-red"
        )}
      />
      {label ?? labels[level]}
    </span>
  );
}
