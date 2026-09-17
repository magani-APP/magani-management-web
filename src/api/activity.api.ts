import { ActivityDayGroup } from "@/types/activity.types";
import { apiRequest } from "@/lib/api-client";
import { mockActivityGroups } from "@/mocks/activity.mock";

export const getActivityLog = async (): Promise<ActivityDayGroup[]> => {
  try {
    return await apiRequest<ActivityDayGroup[]>("/pharmacy/activity");
  } catch {
    // Route indisponible côté backend : on retombe sur des données de
    // démonstration pour ne pas bloquer l'affichage de la page.
    return mockActivityGroups;
  }
};
