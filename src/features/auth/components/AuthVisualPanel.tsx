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
    <aside className="auth-visual-panel" aria-label="PharmaOS simplifie le quotidien de votre pharmacie">
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

      <div className="auth-trust-row">
        {TRUST_STATS.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <i />}
            <div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </aside>
  );
}