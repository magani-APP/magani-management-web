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
    <main className="auth-page flex h-screen max-h-screen overflow-hidden">
      <section className="auth-form-panel flex-1 h-full !overflow-y-auto pb-6 md:pb-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" aria-labelledby="auth-title">
        <div className="auth-form-inner flex flex-col h-full min-h-min">
          <AuthTopbar panelKey={panelKey} mobileImage={mobileImage} />
          <div className="auth-mode-stage">{children}</div>
          <div className={`auth-secure-note-wrap auth-secure-note-${panelKey}`}>
            <AuthSecureNote />
          </div>
        </div>
      </section>
      {visualPanel}
    </main>
  );
}
