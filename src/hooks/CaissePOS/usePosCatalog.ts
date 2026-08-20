'use client';

import { useMemo, useRef, useState } from 'react';
import { Product } from '../../types/pos.types';

function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function usePosCatalog(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    const query = normalizeString(searchQuery.trim());

    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Tous' || p.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const nameNormalized = normalizeString(p.name);
      const categoryNormalized = normalizeString(p.category);
      const dciNormalized = p.dci ? normalizeString(p.dci) : '';

      const matchesSearch =
        nameNormalized.includes(query) ||
        categoryNormalized.includes(query) ||
        dciNormalized.includes(query) ||
        p.barcode.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    searchInputRef,
  };
}