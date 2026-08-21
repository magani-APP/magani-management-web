import { mockActivityGroups } from "@/mocks/activity.mock";
import { ActivityDayGroup } from "@/types/activity.types";

export const getActivityLog = async (): Promise<ActivityDayGroup[]> => {
  // Simule la latence réseau, comme le reste des endpoints mockés du projet
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockActivityGroups;
};
