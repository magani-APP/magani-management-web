'use client';

import { useEffect, useState } from 'react';
import { getInventoryProducts, getInventoryStats } from '../../api/inventory.api';
import { InventoryProduct, InventoryStats } from '../../types/inventory.types';

export function useInventoryProducts() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getInventoryProducts(), getInventoryStats()]).then(
      ([productsData, statsData]) => {
        if (isMounted) {
          setProducts(productsData);
          setStats(statsData);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, stats };
}