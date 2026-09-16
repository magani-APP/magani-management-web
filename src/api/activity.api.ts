import { ActivityDayGroup } from "@/types/activity.types";
import { apiRequest } from "@/lib/api-client";

export const getActivityLog = async (): Promise<ActivityDayGroup[]> => {
  return apiRequest<ActivityDayGroup[]>("/pharmacy/activity");
};
