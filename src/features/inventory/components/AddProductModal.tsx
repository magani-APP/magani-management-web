'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  CreateInventoryProductInput,
  ProductCategoryOption,
  inventoryErrorMessage,
  listProductCategories,
} from '@/api/inventory.api';
import { PRODUCT_UNIT_OPTIONS } from '@/constants/inventory.constants';
import { InventoryProduct } from '@/types/inventory.types';

const overlayTransition = { duration: 0.2, ease: 'easeOut' as const };
const panelTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

interface AddProductModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  product?: InventoryProduct | null;
  onClose: () => void;
  onSubmit: (input: CreateInventoryProductInput) => Promise<void>;
}

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em] mb-1.5"
    >
      {children}
    </label>
  );
}

export function AddProductModal({ isOpen, isSubmitting, product, onClose, onSubmit }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState<string>(PRODUCT_UNIT_OPTIONS[0]);
  const [expirationDate, setExpirationDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setSalePrice('');
    setStock('');
    setUnit(PRODUCT_UNIT_OPTIONS[0]);
    setExpirationDate('');
    setBarcode('');
    setError(null);
  };

  const isEditing = Boolean(product);

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId ?? '');
      setSalePrice(String(product.salePrice));
      setStock(String(product.stock));
      setUnit(
        PRODUCT_UNIT_OPTIONS.includes(product.unit as (typeof PRODUCT_UNIT_OPTIONS)[number])
          ? product.unit
          : PRODUCT_UNIT_OPTIONS[0],
      );
      setExpirationDate(product.expirationDate ? product.expirationDate.slice(0, 10) : '');
      const looksLikeGeneratedCode = product.code === product.id.slice(0, 8).toUpperCase();
      setBarcode(looksLikeGeneratedCode ? '' : product.code);
      setError(null);
    }

    let cancelled = false;
    listProductCategories()
      .then((options) => {
        if (cancelled) return;
        setCategories(options);
        if (product) {
          const match = options.find(
            (category) => category.id === product.categoryId || category.name === product.category,
          );
          if (match) setCategoryId(match.id);
        }
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, product]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const price = Number(salePrice);
    const quantity = Number(stock);

    if (!trimmedName) {
      setError('Le nom du produit est requis.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Indiquez un prix de vente valide.');
      return;
    }
    if (!isEditing && (!Number.isFinite(quantity) || quantity < 0)) {
      setError('Indiquez une quantité en stock valide.');
      return;
    }

    const selectedCategory = categories.find((category) => category.id === categoryId);

    try {
      await onSubmit({
        name: trimmedName,
        categoryId: categoryId || undefined,
        categoryName: selectedCategory?.name,
        salePrice: Math.round(price),
        stock: isEditing ? product?.stock ?? 0 : Math.round(quantity),
        unit,
        expirationDate: expirationDate || undefined,
        barcode: barcode.trim() || undefined,
      });
    } catch (err) {
      setError(inventoryErrorMessage(err, isEditing ? 'Impossible de modifier le produit.' : "Impossible d'ajouter le produit."));
    }
  };

  return (
    <AnimatePresence onExitComplete={resetForm}>
      {isOpen && (
        <motion.div
          key="add-product-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={isSubmitting ? undefined : onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
        >
          <motion.div
            className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={panelTransition}
          >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[16px] font-bold text-[#0F1A15]">
              {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <p className="text-[12px] font-medium text-[#9AAEA3] mt-1">
              {isEditing
                ? 'Mettez à jour les informations du produit.'
                : 'Le produit sera ajouté à votre stock.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full text-[#9AAEA3] hover:bg-[#F0F5F2] transition-colors"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
              {error}
            </p>
          )}

          <div>
            <FieldLabel htmlFor="product-name">Nom du produit</FieldLabel>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex : Paracétamol 500 mg"
              required
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <FieldLabel htmlFor="product-category">Catégorie</FieldLabel>
            <select
              id="product-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">Aucune</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`grid gap-3 ${isEditing ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div>
              <FieldLabel htmlFor="product-price">Prix vente (FCFA)</FieldLabel>
              <input
                id="product-price"
                type="number"
                min={0}
                step={1}
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
                placeholder="1500"
                required
                className={INPUT_CLASS}
              />
            </div>
            {!isEditing && (
            <div>
              <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
              <input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                placeholder="50"
                required
                className={INPUT_CLASS}
              />
            </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="product-unit">Unité</FieldLabel>
              <select
                id="product-unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className={INPUT_CLASS}
              >
                {PRODUCT_UNIT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="product-expiry">Expiration</FieldLabel>
              <input
                id="product-expiry"
                type="date"
                value={expirationDate}
                onChange={(event) => setExpirationDate(event.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="product-barcode">Code-barres</FieldLabel>
            <input
              id="product-barcode"
              type="text"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="Optionnel"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-2 rounded-2xl border border-[#E8EDEA] bg-white text-[10px] font-semibold text-[#6B7A6F] hover:text-[#0B8F68] hover:border-[#0B8F68]/30 transition-colors disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-white text-[10px] font-bold hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60"
              style={{ background: 'rgb(11, 143, 104)' }}
            >
              {isSubmitting
                ? isEditing
                  ? 'Enregistrement...'
                  : 'Ajout...'
                : isEditing
                  ? 'Enregistrer'
                  : 'Ajouter le produit'}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
