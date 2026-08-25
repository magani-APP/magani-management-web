'use client';

import React, { useState } from 'react';
import {
  Search,
  Package2,
  Wallet,
  TriangleAlert,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Download,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Pill,
} from 'lucide-react';
import { TOKENS } from '@/constants/design-tokens.constants';
import { INVENTORY_FILTERS, STATUS_CONFIG } from '@/constants/inventory.constants';
import { formatPrice, formatDate, formatCompactCFA } from '@/utils/format.util';
import { useInventoryProducts } from '@/hooks/ProduitsStock/useInventoryProducts';
import { useInventoryCatalog } from '@/hooks/ProduitsStock/useInventoryCatalog';
import { ProductDetailDrawer } from '@/features/inventory/components/ProductDetailDrawer';

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#9AAEA3]">
        —
      </span>
    );
  }
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? 'text-emerald-600' : 'text-red-500';
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${colorClass}`}>
      <Icon size={11} />
      {Math.abs(value)}%
    </span>
  );
}

/**
 * Styles de badge de statut — couleurs EXACTES relevées sur la capture d'écran.
 * Indexé par libellé affiché (et non par la clé technique product.status) pour
 * garantir le bon rendu quel que soit le nommage des clés côté STATUS_CONFIG.
 */
const STATUS_STYLES_BY_LABEL: Record<string, { badge: string; dot: string }> = {
  'En stock': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'Stock bas': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
  },
  Critique: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  Expiré: {
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
  },
};

function getStatusStyle(label: string) {
  return STATUS_STYLES_BY_LABEL[label] ?? STATUS_STYLES_BY_LABEL['En stock'];
}

function getStockTextClass(status: string) {
  switch (status) {
    case 'critical':
      return 'text-red-600';
    case 'low':
      return 'text-amber-600';
    case 'expired':
      return 'text-gray-400';
    default:
      return 'text-[#0F1A15]';
  }
}

function getMarginBarColor(percent: number) {
  if (percent >= 50) return 'rgb(168,242,74)';
  if (percent >= 40) return 'rgb(11,143,104)';
  return 'rgb(249,115,22)';
}

const TABLE_HEADERS = ['Produit', 'Catégorie', 'Prix vente', 'Stock', 'Expiration', 'Marge', 'Statut'];

export function InventoryView() {
  const { products, stats } = useInventoryProducts();
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, filteredProducts } =
    useInventoryCatalog(products);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;

  const toggleProductDetail = (productId: string) => {
    setSelectedProductId((prev) => (prev === productId ? null : productId));
  };

  const statCards = stats
    ? [
      {
        icon: Package2,
        iconColor: 'rgb(11, 143, 104)',
        iconBg: 'rgba(11, 143, 104, 0.08)',
        value: new Intl.NumberFormat('fr-FR').format(stats.activeProducts),
        label: 'Produits actifs',
        trend: stats.activeProductsTrend,
      },
      {
        icon: Wallet,
        iconColor: 'rgb(7, 99, 75)',
        iconBg: 'rgba(7, 99, 75, 0.08)',
        value: `${formatCompactCFA(stats.stockValue)} FCFA`,
        label: 'Valeur du stock',
        trend: stats.stockValueTrend,
      },
      {
        icon: TriangleAlert,
        iconColor: 'rgb(239, 68, 68)',
        iconBg: 'rgba(239, 68, 68, 0.08)',
        value: String(stats.criticalStock),
        label: 'Stock critique',
        trend: stats.criticalStockTrend,
      },
      {
        icon: Clock,
        iconColor: 'rgb(249, 115, 22)',
        iconBg: 'rgba(249, 115, 22, 0.08)',
        value: String(stats.expiringSoon),
        label: 'Expirent < 60j',
        trend: stats.expiringSoonTrend,
      },
      {
        icon: TrendingUp,
        iconColor: 'rgb(59, 130, 246)',
        iconBg: 'rgba(59, 130, 246, 0.08)',
        value: `${String(stats.averageMargin).replace('.', ',')}%`,
        label: 'Marge moyenne',
        trend: stats.averageMarginTrend,
      },
    ]
    : [];

  return (
    <div
      className="w-full min-h-screen bg-[#F3F5F4] flex flex-col"
      style={{
        fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');
        .font-tabular { font-family: 'Geist Mono', ui-monospace, monospace; font-feature-settings: "tnum" 1; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex-1 flex gap-5 items-start p-6 min-w-0">
        {/* COLONNE PRINCIPALE */}
        <div className="flex-1 min-w-0">
          {/* CARTES KPI */}
          <div className="px-0 pt-0 pb-3 flex-shrink-0">
            <div className="flex gap-3 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="flex-shrink-0 flex items-center gap-3 bg-white rounded-2xl border border-[#E8EDEA] px-4 py-3 min-w-[176px] hover:shadow-sm transition-shadow cursor-default group"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: card.iconBg }}
                    >
                      <Icon size={14} style={{ color: card.iconColor }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-bold text-[#0F1A15] leading-none">
                        {card.value}
                      </div>
                      <div className="text-[9px] text-[#9AAEA3] mt-1 font-medium">
                        {card.label}
                      </div>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <TrendBadge value={card.trend} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BARRE OUTILS */}
          <div className="px-0 pb-3 flex items-center gap-2 flex-shrink-0">
            {/* RECHERCHE */}
            <div className="relative" style={{ width: 240 }}>
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
              <input
                placeholder="Rechercher…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-2xl text-xs font-medium outline-none bg-white border border-[#E8EDEA] placeholder:text-[#9AAEA3] text-[#0F1A15] focus:border-[#0B8F68]/40 transition-colors"
              />
            </div>

            {/* FILTRES */}
            <div className="flex gap-0.5 p-1 bg-white rounded-2xl border border-[#E8EDEA]">
              {INVENTORY_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1.5 rounded-2xl text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-[#9AAEA3] hover:text-[#0F1A15]'
                      }`}
                    style={isActive ? { background: 'rgb(11, 143, 104)' } : undefined}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#E8EDEA] bg-white text-[10px] font-semibold text-[#6B7A6F] hover:text-[#0B8F68] hover:border-[#0B8F68]/30 transition-colors"
              >
                <Upload size={11} /> Importer
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#E8EDEA] bg-white text-[10px] font-semibold text-[#6B7A6F] hover:text-[#0B8F68] hover:border-[#0B8F68]/30 transition-colors"
              >
                <Download size={11} /> Exporter
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-white text-[10px] font-bold hover:opacity-90"
                style={{ background: 'rgb(11, 143, 104)' }}
              >
                <Plus size={12} /> Ajouter un produit
              </button>
            </div>
          </div>

          {/* TABLEAU */}
          <div className="products-table-scroll flex-1 overflow-y-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden">
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ background: 'rgb(245, 247, 245)' }}>
                  <tr>
                    {TABLE_HEADERS.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-[9px] font-bold text-[#9AAEA3] uppercase tracking-[0.08em] cursor-pointer hover:text-[#0B8F68] transition-colors select-none whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          {header}
                          {header === 'Produit' && <ChevronDown size={10} className="transition-transform" />}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 w-8" />
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={24} style={{ color: TOKENS.hairline }} className="mb-2" />
                          <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
                            Aucun produit trouvé
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => {
                      const status = STATUS_CONFIG[product.status];
                      const statusStyle = getStatusStyle(status.label);
                      const isSelected = product.id === selectedProductId;
                      const zebra = index % 2 === 1 ? 'bg-[#FDFEFE]' : '';

                      return (
                        <tr
                          key={product.id}
                          onClick={() => toggleProductDetail(product.id)}
                          className={`border-t border-[#F0F5F2] cursor-pointer transition-colors text-xs hover:bg-[#F9FBFA] ${zebra} ${isSelected ? 'bg-[#F0FAF6]' : ''
                            }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#F0FAF6] border border-emerald-100 flex-shrink-0">
                                <Pill size={12} className="text-[#0B8F68]" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-[#0F1A15] whitespace-nowrap">
                                  {product.name}
                                </p>
                                <p className="text-[9px] text-[#9AAEA3] font-mono mt-0.5">{product.code}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-[11px] text-[#6B7A6F] font-medium whitespace-nowrap">
                            {product.category}
                          </td>

                          <td className="px-4 py-3 text-[11px] font-bold text-[#0F1A15] font-mono whitespace-nowrap">
                            {formatPrice(product.salePrice)} F
                          </td>

                          <td className="px-4 py-3">
                            <span className={`text-[11px] font-bold font-mono ${getStockTextClass(product.status)}`}>
                              {product.stock} {product.unit}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-[10px] text-[#6B7A6F] font-mono whitespace-nowrap">
                            {formatDate(product.expirationDate)}
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1 rounded-full bg-[#E8EDEA] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(product.marginPercent, 100)}%`,
                                    background: getMarginBarColor(product.marginPercent),
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-[#6B7A6F] font-mono w-8">
                                {product.marginPercent}%
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {status.label}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProductDetail(product.id);
                              }}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#E8EDEA] transition-colors opacity-30 hover:opacity-100"
                              aria-label={`Actions pour ${product.name}`}
                            >
                              <MoreHorizontal size={11} className="text-[#9AAEA3]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PANNEAU DÉTAIL */}
        {selectedProduct && (
          <ProductDetailDrawer product={selectedProduct} onClose={() => setSelectedProductId(null)} />
        )}
      </div>
    </div>
  );
}