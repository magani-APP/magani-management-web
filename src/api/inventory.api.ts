import { mockInventoryProducts, mockInventoryStats } from '../mocks/inventory.mock';
import { InventoryProduct, InventoryStats } from '@/types/inventory.types';

export type { InventoryProduct, InventoryStats };

export const getInventoryProducts = async (): Promise<InventoryProduct[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockInventoryProducts;
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockInventoryStats;
};