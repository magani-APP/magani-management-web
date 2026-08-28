import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface ShowcaseBadge {
  icon: LucideIcon;
  label: string;
  value: string;
  status?: string;
}

interface ShowcaseStat {
  value: string;
  label: string;
}

interface AuthShowcasePanelProps {
  imageSrc: string;
  step: number;
  totalSteps?: number;
  titleLines: string[];
  subtitle: string;
  badge: ShowcaseBadge;
  secondaryBadge?: ShowcaseBadge;
  stats: ShowcaseStat[];
}

export function AuthShowcasePanel({
  imageSrc,
  step,
  totalSteps = 2,
  titleLines,
  subtitle,
  badge,
  secondaryBadge,
  stats,
}: AuthShowcasePanelProps) {
  const BadgeIcon = badge.icon;
  const SecondaryIcon = secondaryBadge?.icon;

  return (
    <div className="relative min-h-[420px] w-full overflow-hidden bg-brand-darkest lg:h-full lg:min-h-0">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-brand-darkest/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-darkest/70 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col p-8 xl:p-10">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
          </span>
          <span>Système opérationnel</span>
          <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-normal text-white/60">
            {String(step).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </span>
          <strong className="text-[13px] font-bold text-white">99,9%</strong>
        </div>

        <div className="mt-14 max-w-md xl:mt-20">
          <h2 className="text-[38px] font-extrabold leading-[1.12] text-white xl:text-[44px]">
            {titleLines.map((line, i) => (
              <span
                key={line}
                className={i === titleLines.length - 1 ? "block text-brand-accent" : "block"}
              >
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-[380px] text-[13px] leading-relaxed text-white/65">
            {subtitle}
          </p>
        </div>

        <div className="relative flex-1">
          <div className="absolute left-[6%] top-[46%] flex items-center gap-3 rounded-2xl bg-surface-alt/95 py-2.5 pl-3 pr-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
              <BadgeIcon className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {badge.label}
              </span>
              <span className="text-[13px] font-bold text-text-primary">
                {badge.value}
              </span>
            </div>
            {badge.status && (
              <span className="ml-1 flex items-center gap-1 self-start rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary">
                {badge.status}
              </span>
            )}
          </div>

          {secondaryBadge && SecondaryIcon && (
            <div className="absolute bottom-[6%] right-[4%] flex items-center gap-3 rounded-2xl bg-surface-alt/95 py-2.5 pl-3 pr-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <span className="flex h-9 w-9 shrink-0 animate-pulse items-center justify-center rounded-full bg-brand-primary text-white">
                <SecondaryIcon className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  {secondaryBadge.label}
                </span>
                <span className="text-[13px] font-bold text-text-primary">
                  {secondaryBadge.value}
                </span>
              </div>
              {secondaryBadge.status && (
                <span className="ml-1 flex items-center gap-1 self-start rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary">
                  {secondaryBadge.status}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-6 py-4 backdrop-blur-sm">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && <span className="mx-6 h-6 w-px bg-white/15" />}
              <div className="flex flex-col leading-tight">
                <strong className="text-[15px] font-bold text-white">
                  {stat.value}
                </strong>
                <span className="text-[10px] font-medium uppercase tracking-wide text-white/50">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}