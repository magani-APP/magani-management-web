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

export function useInventoryCatalog(products: any[] = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<InventoryFilterLabel>('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  
  // Référence pour le raccourci F2 / focus recherche
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProducts = useMemo(() => {
    const targetStatus = FILTER_TO_STATUS[activeFilter];
    const query = normalizeString(searchQuery.trim());

    return products.filter((p) => {
      // Filtre par statut
      const matchesStatus = !targetStatus || p.status === targetStatus;
      if (!matchesStatus) return false;

      // Filtre par catégorie (POS)
      const matchesCategory =
        selectedCategory === 'Tous' || p.category === selectedCategory;
      if (!matchesCategory) return false;

      // Recherche textuelle (nom, code, catégorie, DCI)
      if (!query) return true;

      const nameNormalized = normalizeString(p.name || '');
      const codeNormalized = normalizeString(p.code || p.barcode || '');
      const categoryNormalized = normalizeString(p.category || '');
      const dciNormalized = normalizeString(p.dci || '');

      return (
        nameNormalized.includes(query) ||
        codeNormalized.includes(query) ||
        categoryNormalized.includes(query) ||
        dciNormalized.includes(query)
      );
    });
  }, [products, activeFilter, selectedCategory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    searchInputRef,
  };
}