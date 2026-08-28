import { ReactNode } from "react";
import { AuthTopbar } from "./AuthTopbar";
import { AuthSecureNote } from "./AuthHeading";

interface AuthPageShellProps {
  panelKey: string; // nouveau
  mobileImage: string;
  children: ReactNode;
  visualPanel: ReactNode;
}

export function AuthPageShell({ panelKey, mobileImage, children, visualPanel }: AuthPageShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-form-panel" aria-labelledby="auth-title">
        <div className="auth-form-inner">
          <AuthTopbar panelKey={panelKey} mobileImage={mobileImage} />
          <div className="auth-mode-stage">{children}</div>
          <AuthSecureNote />
        </div>
      </section>
      {visualPanel}
    </main>
  );
}
