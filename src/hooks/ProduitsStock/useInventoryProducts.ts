'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CreateInventoryProductInput,
  createInventoryProduct,
  deleteInventoryProduct,
  getInventoryProduct,
  getInventoryProducts,
  getInventoryStats,
  restockInventoryProduct,
  updateInventoryProduct,
} from '../../api/inventory.api';
import { InventoryProduct, InventoryStats } from '../../types/inventory.types';

function bumpStats(prev: InventoryStats | null, product: InventoryProduct): InventoryStats | null {
  if (!prev) return prev;

  const now = Date.now();
  const expiry = product.expirationDate ? new Date(product.expirationDate).getTime() : NaN;
  const isExpiringSoon =
    Number.isFinite(expiry) && expiry > now && expiry < now + 30 * 24 * 60 * 60 * 1000;
  const isCritical = product.status === 'critique' || product.status === 'stock-bas';

  return {
    ...prev,
    activeProducts: prev.activeProducts + 1,
    stockValue: prev.stockValue + product.salePrice * product.stock,
    criticalStock: isCritical ? prev.criticalStock + 1 : prev.criticalStock,
    expiringSoon: isExpiringSoon ? prev.expiringSoon + 1 : prev.expiringSoon,
  };
}

export function useInventoryProducts() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const replaceProduct = (product: InventoryProduct) => {
    setProducts((prev) => prev.map((item) => (item.id === product.id ? product : item)));
  };

  const addProduct = async (input: CreateInventoryProductInput) => {
    setIsAdding(true);
    try {
      const product = await createInventoryProduct(input);
      setProducts((prev) => [product, ...prev]);
      setStats((prev) => bumpStats(prev, product));
    } finally {
      setIsAdding(false);
    }
  };

  const editProduct = async (productId: string, input: CreateInventoryProductInput) => {
    setIsUpdating(true);
    try {
      const product = await updateInventoryProduct(productId, input);
      replaceProduct(product);
    } finally {
      setIsUpdating(false);
    }
  };

  const restockProduct = async (input: {
    productId: string;
    addQuantity: number;
    lotNumber?: string;
    expiryDate?: string;
  }) => {
    setIsRestocking(true);
    try {
      const product = await restockInventoryProduct(input);
      replaceProduct(product);
    } finally {
      setIsRestocking(false);
    }
  };

  const removeProduct = async (productId: string) => {
    setIsDeleting(true);
    try {
      await deleteInventoryProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              activeProducts: Math.max(0, prev.activeProducts - 1),
            }
          : prev,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const loadProductDetail = useCallback(async (productId: string) => {
    try {
      const product = await getInventoryProduct(productId);
      setProducts((prev) => prev.map((item) => (item.id === product.id ? product : item)));
    } catch {
      // Le panneau continue d'afficher les données déjà listées.
    }
  }, []);

  return {
    products,
    stats,
    addProduct,
    editProduct,
    restockProduct,
    removeProduct,
    loadProductDetail,
    isAdding,
    isUpdating,
    isRestocking,
    isDeleting,
  };
}
