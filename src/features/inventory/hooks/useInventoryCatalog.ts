'use client';

import { useMemo, useState } from 'react';
import { InventoryFilterLabel, InventoryProduct } from '../types/inventory.types';

const FILTER_TO_STATUS: Record<InventoryFilterLabel, InventoryProduct['status'] | null> = {
  Tous: null,
  'En stock': 'en-stock',
  Bas: 'stock-bas',
  Critique: 'critique',
  Expiré: 'expire',
};

export function useInventoryCatalog(products: InventoryProduct[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<InventoryFilterLabel>('Tous');

  const filteredProducts = useMemo(() => {
    const targetStatus = FILTER_TO_STATUS[activeFilter];
    const query = searchQuery.trim().toLowerCase();

    return products.filter((p) => {
      const matchesFilter = !targetStatus || p.status === targetStatus;
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredProducts,
  };
}