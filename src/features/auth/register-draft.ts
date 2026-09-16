import type { RegisterAccountDraft } from "@/types/auth.types";

const DRAFT_KEY = "magani_register_draft";

export function saveRegisterDraft(draft: RegisterAccountDraft): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function readRegisterDraft(): RegisterAccountDraft | null {
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as RegisterAccountDraft;
    if (!draft.fullName || !draft.email || !draft.password) return null;
    return draft;
  } catch {
    return null;
  }
}

export function clearRegisterDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}
