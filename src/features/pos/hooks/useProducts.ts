'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../../../api/pos.api';
import { Product } from '../types/pos.types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    getProducts().then((data) => {
      if (isMounted) setProducts(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products };
}
