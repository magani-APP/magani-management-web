import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = "Actif", inactiveLabel = "Inactif" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-[9px] font-bold px-2 py-0.5 rounded-full border",
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
