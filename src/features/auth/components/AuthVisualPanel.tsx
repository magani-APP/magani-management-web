import { Fragment, ReactNode } from "react";
import Image from "next/image";

interface TrustStat {
  value: string;
  label: string;
}

interface AuthVisualPanelProps {
  panelKey: string;
  image: string;
  chapter: string;
  headline: ReactNode;
  description: string;
  floatCards?: ReactNode;
}

const TRUST_STATS: TrustStat[] = [
  { value: "8h", label: "gagnées / semaine" },
  { value: "24/7", label: "stocks sous contrôle" },
  { value: "1 espace", label: "pour toute l’équipe" },
];

export function AuthVisualPanel({ panelKey, image, chapter, headline, description, floatCards }: AuthVisualPanelProps) {
  return (
    <aside className="auth-visual-panel h-full sticky top-0" aria-label="PharmaOS simplifie le quotidien de votre pharmacie">
      <Image
        key={panelKey}
        src={image}
        alt=""
        fill
        priority
        sizes="60vw"
        style={{ objectFit: "cover", objectPosition: "60% center" }}
        className="auth-visual-background"
      />

      <div className="auth-visual-copy">
        <p>{headline}</p>
        <small>{description}</small>
      </div>

      <div className="auth-illustration-stage">{floatCards}</div>

      <div className="flex w-full items-center justify-evenly gap-4 rounded-full bg-[#052116]/80 backdrop-blur-md px-8 py-3.5 border border-white/10 shadow-lg">
        {TRUST_STATS.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <i className="h-6 w-[1px] bg-white/15 shrink-0" aria-hidden="true" />}
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <strong className="text-white text-base">{stat.value}</strong>
              <span className="text-[10px] font-semibold tracking-wider text-gray-300 uppercase opacity-85">
                {stat.label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </aside>
  );
}