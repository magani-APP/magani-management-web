'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { inventoryErrorMessage } from '@/api/inventory.api';
import { InventoryProduct } from '@/types/inventory.types';

const overlayTransition = { duration: 0.2, ease: 'easeOut' as const };
const panelTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const };

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors';

interface RestockModalProps {
  product: InventoryProduct | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: { addQuantity: number; lotNumber?: string; expiryDate?: string }) => Promise<void>;
}

export function RestockModal({ product, isSubmitting, onClose, onSubmit }: RestockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      setQuantity('');
      setLotNumber('');
      setExpiryDate('');
      setError(null);
    }
  }, [product]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const addQuantity = Number(quantity);
    if (!Number.isFinite(addQuantity) || addQuantity <= 0) {
      setError('Indiquez une quantité à ajouter.');
      return;
    }

    try {
      await onSubmit({
        addQuantity: Math.round(addQuantity),
        lotNumber: lotNumber.trim() || undefined,
        expiryDate: expiryDate || undefined,
      });
    } catch (err) {
      setError(inventoryErrorMessage(err, "Impossible d'approvisionner ce produit."));
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="restock-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={isSubmitting ? undefined : onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
        >
          <motion.div
            className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={panelTransition}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-[16px] font-bold text-[#0F1A15]">Approvisionner</h2>
                <p className="text-[12px] font-medium text-[#9AAEA3] mt-1">
                  {product.name} · stock actuel {product.stock} {product.unit}
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
                <label
                  htmlFor="restock-qty"
                  className="block text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em] mb-1.5"
                >
                  Quantité à ajouter
                </label>
                <input
                  id="restock-qty"
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="20"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="restock-lot"
                    className="block text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em] mb-1.5"
                  >
                    N° de lot
                  </label>
                  <input
                    id="restock-lot"
                    type="text"
                    value={lotNumber}
                    onChange={(event) => setLotNumber(event.target.value)}
                    placeholder="Optionnel"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label
                    htmlFor="restock-expiry"
                    className="block text-[10px] font-bold text-[#9AAEA3] uppercase tracking-[0.06em] mb-1.5"
                  >
                    Expiration
                  </label>
                  <input
                    id="restock-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
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
                  className="px-3.5 py-2 rounded-2xl text-white text-[10px] font-bold hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'rgb(11, 143, 104)' }}
                >
                  {isSubmitting ? 'Ajout...' : 'Ajouter au stock'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
