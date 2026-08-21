import { ACTIVITY_TYPE_STYLES } from "@/constants/activity.constants";
import { ActivityEntry } from "@/types/activity.types";

interface ActivityLogRowProps {
  entry: ActivityEntry;
}

export function ActivityLogRow({ entry }: ActivityLogRowProps) {
  const style = ACTIVITY_TYPE_STYLES[entry.actionType];

  return (
    <div className="flex items-start gap-4 py-3.5 px-5 hover:bg-[#F9FBFA] transition-colors border-t border-[#F0F5F2]">
      {/* Heure */}
      <span className="text-[10px] font-mono text-[#9AAEA3] w-12 pt-0.5 shrink-0">
        {entry.time}
      </span>

      {/* Point de couleur */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full" style={{ background: style.color }} />
      </div>

      {/* Avatar */}
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
        style={{ background: style.color }}
      >
        {entry.employeeInitials}
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#0F1A15] leading-snug">
          <span className="font-bold">{entry.employeeName}</span>{" "}
          <span className="text-[#6B7A6F]">{entry.actionLabel}</span>
          {entry.targetLabel && (
            <>
              {" "}
              <span className="font-semibold text-[#0F1A15]">{entry.targetLabel}</span>
            </>
          )}
        </p>
        <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">{entry.detail}</p>
      </div>

      {/* Badge de type */}
      <span
        className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border"
        style={{
          background: style.badgeBg,
          color: style.color,
          borderColor: style.badgeBorder,
        }}
      >
        {style.badgeLabel}
      </span>
    </div>
  );
}
