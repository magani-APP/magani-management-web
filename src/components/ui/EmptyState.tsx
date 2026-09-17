import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * Generic empty-state placeholder.
 * Use it anywhere a table/list/chart has no data yet so the user gets
 * a message tailored to that specific screen instead of a blank box.
 */
export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)] mb-4">
        <Icon size={22} className="text-brand-primary opacity-70" />
      </div>
      <h4 className="text-[12.5px] font-bold text-text-foreground mb-1">{title}</h4>
      <p className="text-[11px] font-medium text-text-muted max-w-[260px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
