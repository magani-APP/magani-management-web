'use client';

import { useMemo, useRef, useState } from 'react';
import { InventoryFilterLabel, InventoryProduct } from '../../types/inventory.types';

const FILTER_TO_STATUS: Record<InventoryFilterLabel, InventoryProduct['status'] | null> = {
  Tous: null,
  'En stock': 'en-stock',
  Bas: 'stock-bas',
  Critique: 'critique',
  Expiré: 'expire',
};

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function useInventoryCatalog(products: InventoryProduct[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<InventoryFilterLabel>('Tous');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    const targetStatus = FILTER_TO_STATUS[activeFilter];
    const query = normalizeString(searchQuery.trim());

    return products.filter((p) => {
      const matchesFilter = !targetStatus || p.status === targetStatus;
      if (!matchesFilter) return false;
      if (!query) return true;

      const nameNormalized = normalizeString(p.name);
      const codeNormalized = normalizeString(p.code);
      const categoryNormalized = normalizeString(p.category);

      const matchesSearch =
        nameNormalized.includes(query) ||
        codeNormalized.includes(query) ||
        categoryNormalized.includes(query);

      return matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredProducts,
    searchInputRef,
  };
}