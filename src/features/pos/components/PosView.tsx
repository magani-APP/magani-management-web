'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  ScanLine,
  Pill,
  ShoppingCart,
  Tag,
  Minus,
  Plus,
  CheckCircle2,
  X,
  RotateCcw,
  QrCode,
  Undo2,
  Download,
} from 'lucide-react';
import { TOKENS } from '../../../constants/design-tokens.constants';
import { CATEGORIES, PAYMENT_METHODS } from '../../../constants/pos.constants';
import { formatPrice } from '../../../utils/formatPrice.util';
import { useProducts } from '../../../hooks/ProduitsStock/useProducts';
import { useInventoryCatalog } from '../../../hooks/CaissePOS/usePosCatalog';
import { usePosCart } from '../../../hooks/CaissePOS/usePosCart';

export function PosView() {
  const { products, refetch } = useProducts();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    searchInputRef,
  } = useInventoryCatalog(products);

  const {
    cart,
    discountPercent,
    setDiscountPercent,
    paymentMethod,
    setPaymentMethod,
    heldSales,
    showCheckoutSuccess,
    completedOrderDetails,
    totalItemsCount,
    subtotal,
    discountAmount,
    finalTotal,
    isCheckingOut,
    checkoutError,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveCartItem,
    handleClearCart,
    handleHoldSale,
    handleRestoreHoldSale,
    handleDeleteHoldSale,
    handleCheckout,
    handleCancelCheckout,
    handleDownloadPDF,
    closeSuccessModal,
  } = usePosCart(products, refetch);

  // --- RACCOURCIS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && showCheckoutSuccess) {
        handleCancelCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCheckoutSuccess, handleCancelCheckout, searchInputRef]);

  // --- BLOCAGE DU SCROLL DE LA PAGE (html/body) ---
  // On verrouille le scroll global le temps que ce composant soit monté,
  // sans toucher aux zones internes qui ont leur propre overflow-y-auto.
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevHtmlHeight = htmlEl.style.height;
    const prevBodyHeight = bodyEl.style.height;
    const prevBodyOverscroll = bodyEl.style.overscrollBehavior;

    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';
    htmlEl.style.height = '100%';
    bodyEl.style.height = '100%';
    bodyEl.style.overscrollBehavior = 'none';

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      htmlEl.style.height = prevHtmlHeight;
      bodyEl.style.height = prevBodyHeight;
      bodyEl.style.overscrollBehavior = prevBodyOverscroll;
    };
  }, []);

  // --- VENTES EN ATTENTE : molette verticale -> scroll horizontal ---
  const heldSalesScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = heldSalesScrollRef.current;
    if (!el) return;

    const updateScrollShadows = () => {
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return; // rien à scroller
      if (e.deltaY === 0) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    updateScrollShadows();
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', updateScrollShadows);
    window.addEventListener('resize', updateScrollShadows);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', updateScrollShadows);
      window.removeEventListener('resize', updateScrollShadows);
    };
  }, [heldSales.length]);

  return (
    <div
      className="flex w-full text-[#0F1A15] overflow-hidden min-h-0"
      style={{
        height: '100dvh',
        backgroundColor: TOKENS.bg,
        fontFamily:
          "'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overscrollBehavior: 'none',
      }}
    >
      {/* Police Geist / Geist Mono + utilitaire numérique tabulaire */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        html, body {
          overflow: hidden;
          overscroll-behavior: none;
          height: 100%;
        }

        .font-tabular { font-family: 'Geist Mono', ui-monospace, monospace; font-feature-settings: "tnum" 1; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .pos-catalog::-webkit-scrollbar { display: none; }
        .held-sales-scroll::-webkit-scrollbar { height: 4px; }
        .held-sales-scroll::-webkit-scrollbar-track { background: transparent; }
        .held-sales-scroll::-webkit-scrollbar-thumb {
          background-color: ${TOKENS.warning}66;
          border-radius: 9999px;
        }
        .held-sales-scroll::-webkit-scrollbar-thumb:hover {
          background-color: ${TOKENS.warning};
        }
        .mobile-sheet-close { display: none; }
        @media (max-width: 768px) {
          .mobile-sheet-close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            color: #9AAEA3;
          }
        }
      `}</style>

      {/* SECTION GAUCHE : CATÉGORIES, RECHERCHE & PRODUITS */}
      <div className="pos-catalog flex-1 flex flex-col min-w-0 overflow-hidden p-5 pr-3 gap-3">
        {/* RECHERCHE — Input POS (large) */}
        <div className="relative flex-shrink-0">
          <ScanLine
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B8F68] pointer-events-none"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Scanner ou rechercher un médicament… (nom, DCI, code-barres)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-20 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all bg-white placeholder:text-[#9AAEA3] text-[#0F1A15] border-2 border-[#E8EDEA] focus:border-[#0B8F68] focus:shadow-[0_0_0_4px_rgba(11,143,104,0.08)]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <QrCode size={14} className="text-[#9AAEA3]" />
            <span className="text-[9px] font-mono text-[#9AAEA3] bg-[#F0F5F2] px-1.5 py-0.5 rounded border border-[#E2EDE8]">
              F2
            </span>
          </div>
        </div>

        {/* CATÉGORIES */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 flex-shrink-0"
          style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-white text-[#6B7A6F] border-[#E8EDEA] hover:border-[#0B8F68]/30 hover:text-[#0B8F68]'
                }`}
                style={isActive ? { background: TOKENS.primary } : undefined}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* GRILLE PRODUITS */}
        <div
          className="flex-1 overflow-y-auto no-scrollbar min-h-0"
          style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
        >
          {filteredProducts.length === 0 ? (
            <div
              className="h-64 flex flex-col items-center justify-center"
              style={{ color: TOKENS.hairline }}
            >
              <Search className="w-7 h-7 mb-2 stroke-1" />
              <p className="text-sm font-bold" style={{ color: TOKENS.mutedText }}>
                Aucun médicament trouvé
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 pb-12">
              {filteredProducts.map((product) => {
                const cartItem = cart.find((i) => i.product.id === product.id);
                const quantityInCart = cartItem ? cartItem.quantity : 0;
                const isSelected = quantityInCart > 0;
                const isLowStock = product.stock <= 15;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`relative bg-white rounded-2xl border p-4 text-left transition-all duration-150 group cursor-pointer hover:shadow-md hover:border-[#0B8F68]/40 ${
                      isSelected ? 'border-[#0B8F68] shadow-sm' : 'border-[#E8EDEA]'
                    }`}
                  >
                    {isSelected && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                        style={{
                          backgroundColor: TOKENS.primary,
                        }}
                      >
                        {quantityInCart}
                      </div>
                    )}

                    <div
                      className="w-9 h-9 rounded-full mb-3 flex items-center justify-center"
                      style={
                        product.iconVariant === 'amber' || isLowStock
                          ? { backgroundColor: 'rgba(245,158,11,0.08)', color: TOKENS.warning }
                          : { backgroundColor: 'rgba(11,143,104,0.08)', color: TOKENS.primary }
                      }
                    >
                      <Pill className="w-4 h-4" />
                    </div>

                    <p className="text-xs font-bold text-[#0F1A15] leading-snug mb-1 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-[#9AAEA3] mb-2.5">
                      {product.category}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F1A15]">
                        {formatPrice(product.price)}
                        <span className="text-[9px] font-medium text-[#9AAEA3] ml-0.5">
                          F
                        </span>
                      </span>

                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: isLowStock ? TOKENS.warning : TOKENS.primary }}
                      >
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION DROITE : PANIER */}
      <div className="pos-cart w-[340px] flex-shrink-0 flex flex-col bg-white border-l border-[#E8EDEA] overflow-hidden min-h-0">
        {/* EN-TÊTE PANIER — toujours visible et statique (non scrollable) */}
        <div className="px-5 pt-4 pb-3 border-b border-[#F0F5F2] flex-shrink-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <h2 className="text-sm font-bold text-[#0F1A15]">Nouvelle vente</h2>
              {totalItemsCount > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-white"
                  style={{ background: TOKENS.primary }}
                >
                  {totalItemsCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              {heldSales.length > 0 && (
                <div className="relative min-w-0 max-w-[160px] sm:max-w-[200px]">
                  {canScrollLeft && (
                    <div
                      className="pointer-events-none absolute left-0 top-0 bottom-1.5 w-4 z-10"
                      style={{
                        background: 'linear-gradient(to right, white, transparent)',
                      }}
                    />
                  )}
                  {canScrollRight && (
                    <div
                      className="pointer-events-none absolute right-0 top-0 bottom-1.5 w-4 z-10"
                      style={{
                        background: 'linear-gradient(to left, white, transparent)',
                      }}
                    />
                  )}

                  <div
                    ref={heldSalesScrollRef}
                    className="held-sales-scroll flex items-center gap-1.5 overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:bg-[#E8EDEA] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-amber-500"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${TOKENS.warning} #E8EDEA`,
                      overscrollBehavior: 'contain',
                    }}
                  >
                    {heldSales.map((hold) => (
                      <div
                        key={hold.id}
                        className="group flex-shrink-0 flex items-center gap-1 pl-2 pr-1 py-1 rounded-lg bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors"
                      >
                        <button
                          onClick={() => handleRestoreHoldSale(hold.id)}
                          className="text-amber-700 text-[9px] font-bold whitespace-nowrap"
                        >
                          {hold.label}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHoldSale(hold.id);
                          }}
                          aria-label={`Supprimer ${hold.label}`}
                          className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0 text-amber-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X className="w-2.5 h-2.5" strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="mobile-sheet-close flex-shrink-0" aria-label="Fermer le panier">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ARTICLES DU PANIER */}
        <div
          className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-4 py-3 space-y-1.5"
          style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
        >
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: TOKENS.bg }}
              >
                <ShoppingCart className="w-7 h-7 stroke-[1.5]" style={{ color: TOKENS.hairline }} />
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: TOKENS.mutedText }}>
                Panier vide
              </h3>
              <p className="text-xs" style={{ color: TOKENS.faintText }}>
                Cliquez sur un produit ou scannez
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F9FBFA] border border-[#E8EDEA] group"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F0FAF6] flex-shrink-0">
                  <Pill className="w-3 h-3 text-[#0B8F68]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#0F1A15] truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[9px] text-[#9AAEA3] font-medium">
                    {formatPrice(item.product.price)} F / u.
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.product.id, -1)}
                    className="w-5 h-5 rounded-lg border border-[#E8EDEA] bg-white flex items-center justify-center hover:border-[#0B8F68]/40"
                  >
                    <Minus className="w-[9px] h-[9px] text-[#6B7A6F]" />
                  </button>

                  <span className="text-xs font-bold text-[#0F1A15] w-5 text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.product.id, 1)}
                    className="w-5 h-5 rounded-lg border border-[#E8EDEA] bg-white flex items-center justify-center hover:border-[#0B8F68]/40"
                  >
                    <Plus className="w-[9px] h-[9px] text-[#6B7A6F]" />
                  </button>
                </div>

                <span className="text-xs font-bold text-[#0F1A15] w-14 text-right">
                  {formatPrice(item.product.price * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveCartItem(item.product.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Retirer du panier"
                >
                  <X className="w-[11px] h-[11px] text-[#C8D5CC] hover:text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* BAS DU PANIER */}
        <div className="flex-shrink-0 border-t border-[#F0F5F2] pb-14">
          {/* REMISE + TOTAUX — masqué tant que le panier est vide */}
          {cart.length > 0 && (
          <div className="px-4 pt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-[11px] h-[11px] text-[#9AAEA3]" />
              <span className="text-[10px] text-[#9AAEA3] font-medium flex-1">Remise</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setDiscountPercent(0)}
                  className={`w-8 h-6 rounded-xl text-[9px] font-bold transition-all ${
                    discountPercent === 0
                      ? 'text-white'
                      : 'bg-[#F5F7F5] text-[#6B7A6F] hover:bg-[#E8EDEA]'
                  }`}
                  style={discountPercent === 0 ? { background: TOKENS.primary } : undefined}
                >
                  —
                </button>

                {[5, 10, 15, 20].map((pct) => {
                  const isSelected = discountPercent === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercent(pct)}
                      className={`w-8 h-6 rounded-xl text-[9px] font-bold transition-all ${
                        isSelected
                          ? 'text-white'
                          : 'bg-[#F5F7F5] text-[#6B7A6F] hover:bg-[#E8EDEA]'
                      }`}
                      style={isSelected ? { background: TOKENS.primary } : undefined}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 bg-[#F5F7F5] rounded-xl p-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#6B7A6F] font-medium">
                  Sous-total · {totalItemsCount} articles
                </span>
                <span className="font-bold text-[#0F1A15]">{formatPrice(subtotal)} FCFA</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600 font-medium">Remise {discountPercent}%</span>
                  <span className="font-bold text-emerald-600">
                    - {formatPrice(discountAmount)} FCFA
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-[#0F1A15] pt-1.5 border-t border-[#E8EDEA]">
                <span>Total TTC</span>
                <span>{formatPrice(finalTotal)} FCFA</span>
              </div>
            </div>
          </div>
          )}

          {/* MODE DE PAIEMENT */}
          <div className="px-4 pt-2 pb-2">
            <div className="grid grid-cols-5 gap-1">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-2xl border text-[8px] font-bold transition-all ${
                      isSelected
                        ? 'text-white border-transparent'
                        : 'bg-[#F5F7F5] text-[#9AAEA3] border-[#E8EDEA] hover:border-[#0B8F68]/30'
                    }`}
                    style={
                      isSelected
                        ? { background: method.color, boxShadow: `0 2px 8px ${method.color}44` }
                        : undefined
                    }
                  >
                    <Icon className="w-[13px] h-[13px]" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOUTON ENCAISSER */}
          <div className="px-4 pb-4">
            {checkoutError && (
              <p className="text-[11px] text-red-600 font-medium mb-2 text-center">
                {checkoutError}
              </p>
            )}
            <button
              disabled={cart.length === 0 || isCheckingOut}
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-tight transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #0B8F68 0%, #07634B 100%)',
                boxShadow: '0 4px 20px rgba(11,143,104,0.40)',
              }}
            >
              {isCheckingOut
                ? 'Encaissement…'
                : cart.length > 0
                ? `Encaisser · ${formatPrice(finalTotal)} FCFA`
                : 'Encaisser'}
            </button>

            <div className="flex gap-3 justify-center mt-2.5">
              <button
                disabled={cart.length === 0}
                onClick={handleHoldSale}
                className="text-[10px] text-[#9AAEA3] hover:text-amber-600 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mettre en attente
              </button>
              <span className="text-[10px] text-[#E8EDEA]">·</span>
              <button
                disabled={cart.length === 0}
                onClick={handleClearCart}
                className="text-[10px] text-[#9AAEA3] hover:text-red-600 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SUCCÈS / CONFIRMATION */}
      {showCheckoutSuccess && completedOrderDetails && (
        <div
          onClick={handleCancelCheckout}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 transition-all animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95 duration-200 cursor-default"
            style={{ border: `1px solid ${TOKENS.borderCard}`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
          >
            <button
              onClick={handleCancelCheckout}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors duration-150 cursor-pointer"
              style={{ color: TOKENS.faintText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.mutedText;
                e.currentTarget.style.backgroundColor = TOKENS.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.faintText;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Annuler et restaurer le panier"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: '#D8F3E5', color: TOKENS.primary }}
            >
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>

            <div>
              <h3 className="text-lg font-bold" style={{ color: TOKENS.foreground }}>
                Vente enregistrée !
              </h3>
              <p className="text-xs mt-0.5 font-tabular" style={{ color: TOKENS.faintText }}>
                Réf: {completedOrderDetails.id}
              </p>
            </div>

            <div
              className="p-4 rounded-xl space-y-2 text-left"
              style={{ backgroundColor: TOKENS.surfaceAlt, border: `1px solid ${TOKENS.borderCard}` }}
            >
              <div className="flex justify-between text-xs" style={{ color: TOKENS.mutedText }}>
                <span>Articles payés</span>
                <span className="font-bold font-tabular" style={{ color: TOKENS.foreground }}>
                  {completedOrderDetails.itemsCount}
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: TOKENS.mutedText }}>
                <span>Mode de règlement</span>
                <span className="font-bold uppercase" style={{ color: TOKENS.foreground }}>
                  {completedOrderDetails.method}
                </span>
              </div>
              <div
                className="flex justify-between text-sm font-bold pt-2"
                style={{ color: TOKENS.foreground, borderTop: `1px solid ${TOKENS.divider}` }}
              >
                <span>Montant encaissé</span>
                <span className="font-extrabold font-tabular" style={{ color: TOKENS.primary }}>
                  {formatPrice(completedOrderDetails.total)} FCFA
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleDownloadPDF}
                className="py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                style={{ backgroundColor: TOKENS.mutedSurface, color: TOKENS.foreground }}
              >
                <Download className="w-4 h-4" style={{ color: TOKENS.mutedText }} />
                Imprimer
              </button>

              <button
                onClick={closeSuccessModal}
                className="py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer"
                style={{ backgroundColor: TOKENS.primary, boxShadow: '0 2px 8px rgba(11,143,104,0.28)' }}
              >
                <RotateCcw className="w-4 h-4" />
                Nouvelle vente
              </button>
            </div>

            <button
              onClick={handleCancelCheckout}
              className="w-full py-2.5 text-xs font-semibold rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5"
              style={{ color: TOKENS.danger }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Undo2 className="w-3.5 h-3.5" />
              Annuler l'encaissement (restaurer le panier)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}