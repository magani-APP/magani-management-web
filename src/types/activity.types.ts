export type ActivityActionType =
  | "vente"
  | "prix"
  | "stock"
  | "annulation"
  | "appro"
  | "admin"
  | "systeme";

export type ActivityFilterId =
  | "tout"
  | "ventes"
  | "prix"
  | "stock"
  | "annulations"
  | "appro"
  | "admin";

export interface ActivityEntry {
  id: string;
  time: string; // ex. "18:43"
  actionType: ActivityActionType;
  employeeName: string;
  employeeInitials: string;
  actionLabel: string; // ex. "a modifié le prix de"
  targetLabel: string; // ex. "Doliprane 1000mg" ou "#V-004291"
  detail: string; // ligne secondaire, ex. "1 300 → 1 500 FCFA"
}

export interface ActivityDayGroup {
  id: string;
  dayLabel: string; // "AUJOURD'HUI" | "HIER" | "VENDREDI 7 AOÛT"...
  dateLabel: string; // "Dimanche 9 août 2026"
  entries: ActivityEntry[];
}
