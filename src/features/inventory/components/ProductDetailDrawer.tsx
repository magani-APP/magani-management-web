'use client';

import React from 'react';
import { X, Pen, Plus, Archive, Activity } from 'lucide-react';
import { TOKENS } from '@/constants/design-tokens.constants';
import { InventoryProduct } from '@/types/inventory.types';
import { STATUS_CONFIG, MOVEMENT_LABELS } from '@/constants/inventory.constants';
import { formatPrice, formatDate, formatShortDate } from '@/utils/format.util';
import { ProductAvatar } from '@/features/inventory/components/ProductAvatar';

interface ProductDetailDrawerProps {
  product: InventoryProduct;
  onClose: () => void;
  onEdit?: (product: InventoryProduct) => void;
  onRestock?: (product: InventoryProduct) => void;
}

/** Styles de badge de statut — classes exactes relevées dans l'inspecteur */
const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  in_stock: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  low: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  critical: { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  expired: { badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
};

/** Carte stat — fond gris clair, coins rounded-xl, valeur en text-xs, conforme à l'inspecteur */
function StatCard({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="p-3 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]">
      <div className="text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.07em] mb-1.5">{label}</div>
      <div className="text-xs font-bold leading-snug" style={{ color: valueColor ?? 'rgb(15, 26, 21)' }}>
        {value}
      </div>
    </div>
  );
}

export function ProductDetailDrawer({ product, onClose, onEdit, onRestock }: ProductDetailDrawerProps) {
  const status = STATUS_CONFIG[product.status];
  const statusStyle = STATUS_STYLES[product.status] ?? STATUS_STYLES.in_stock;

  return (
    <aside
      className="w-[360px] flex-shrink-0 bg-white rounded-2xl border overflow-y-auto no-scrollbar flex flex-col"
      style={{ borderColor: TOKENS.borderCard }}
    >
      {/* EN-TÊTE */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: TOKENS.divider }}>
        <div className="flex items-center gap-3 min-w-0">
          <ProductAvatar name={product.name} imageUrl={product.imageUrl} size={44} />
          <div className="min-w-0">
            <h3 className="text-base font-bold truncate" style={{ color: TOKENS.foreground }}>
              {product.name}
            </h3>
            <p className="text-xs font-medium truncate" style={{ color: TOKENS.faintText }}>
              {product.code} · {product.category}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#F0F5F2] transition-colors flex-shrink-0"
          style={{ color: TOKENS.faintText }}
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>

      {/* CONTENU SCROLLABLE — structure conforme à l'inspecteur */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {/* STATUT + ACTIONS */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {status.label}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(product)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E8EDEA] text-[10px] font-bold text-[#6B7A6F] hover:border-[#0B8F68]/30 transition-colors"
            >
              <Pen size={10} /> Modifier
            </button>
            <button
              type="button"
              onClick={() => onRestock?.(product)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-white text-[10px] font-bold hover:opacity-90"
              style={{ background: 'rgb(11, 143, 104)' }}
            >
              <Plus size={10} /> Approvisionner
            </button>
          </div>
        </div>

        {/* CARTES INFO */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Prix de vente" value={`${formatPrice(product.salePrice)} FCFA`} />
          <StatCard
            label="Marge brute"
            value={`${product.marginPercent}%`}
            valueColor="rgb(11, 143, 104)"
          />
          <StatCard label="Stock actuel" value={`${product.stock} unités`} />
          <StatCard label="Expiration lot" value={formatDate(product.expirationDate)} />
        </div>

        {/* LOTS EN STOCK */}
        <div>
          <h4 className="text-[10px] font-bold text-[#0F1A15] uppercase tracking-[0.07em] mb-2 flex items-center gap-2">
            <Archive size={11} className="text-[#9AAEA3]" /> Lots en stock
          </h4>

          <div className="space-y-1.5">
            {(product.lots ?? []).map((lot) => (
              <div
                key={lot.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F5F7F5] border border-[#E8EDEA]"
              >
                <span className="text-[10px] font-mono text-[#6B7A6F] flex-1">{lot.code}</span>
                <span className="text-[10px] font-bold text-[#0F1A15]">{lot.quantity} u.</span>
                <span className="text-[9px] text-[#9AAEA3]">exp. {formatShortDate(lot.expirationDate)}</span>
              </div>
            ))}
            {(product.lots ?? []).length === 0 && (
              <p className="text-xs" style={{ color: TOKENS.faintText }}>
                Aucun lot enregistré.
              </p>
            )}
          </div>
        </div>

        {/* MOUVEMENTS RÉCENTS */}
        <div>
          <h4 className="text-[10px] font-bold text-[#0F1A15] uppercase tracking-[0.07em] mb-2 flex items-center gap-2">
            <Activity size={11} className="text-[#9AAEA3]" /> Mouvements récents
          </h4>

          <div className="space-y-0.5">
            {(product.movements ?? []).map((movement) => {
              const isPositive = movement.quantity > 0;
              return (
                <div
                  key={movement.id}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F5F7F5] transition-colors"
                >
                  <span
                    className={`text-[10px] font-bold font-mono w-8 text-right flex-shrink-0 ${isPositive ? 'text-emerald-600' : 'text-red-500'
                      }`}
                  >
                    {isPositive ? '+' : ''}
                    {movement.quantity}
                  </span>
                  <span className="text-[10px] text-[#6B7A6F] flex-1 font-medium">
                    {MOVEMENT_LABELS[movement.type]}
                  </span>
                  <span className="text-[9px] text-[#9AAEA3] font-mono">{formatShortDate(movement.date)}</span>
                  <span className="text-[9px] text-[#C8D5CC]">{movement.user}</span>
                </div>
              );
            })}
            {(product.movements ?? []).length === 0 && (
              <p className="text-xs" style={{ color: TOKENS.faintText }}>
                Aucun mouvement récent.
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}