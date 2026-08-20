import { mockPosProducts } from '../mocks/pos.mock';
import { Product } from '../types/pos.types';

export type { Product };

export const getProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPosProducts;
};
