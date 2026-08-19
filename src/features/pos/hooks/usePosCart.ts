'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CartItem,
  CompletedOrder,
  HeldSale,
  PaymentMethod,
  Product,
} from '../types/pos.types';
import { generateReceiptHtml } from '../../../lib/pdf/generateReceiptHtml';
import { downloadHtmlFile } from '../../../lib/pdf/downloadHtmlFile';

export function usePosCart(products: Product[]) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('espèces');

  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] =
    useState<CompletedOrder | null>(null);

  // Sauvegarde pour restaurer le panier en cas d'annulation
  const [lastCartBackup, setLastCartBackup] = useState<{
    items: CartItem[];
    discount: number;
  } | null>(null);

  // NOTE (adaptation obligatoire) : dans la version d'origine, le panier était
  // initialisé de façon synchrone avec INITIAL_PRODUCTS[11]. Depuis que les
  // produits transitent obligatoirement par la couche API/mock (MOCK_DATA_STRATEGY.md
  // §2), ils ne sont plus disponibles de façon synchrone au montage. On reproduit
  // donc le même état de démonstration dès que les produits arrivent, une seule fois.
  const hasSeededDemoCart = useRef(false);
  useEffect(() => {
    if (!hasSeededDemoCart.current && products.length > 11) {
      setCart([{ product: products[11], quantity: 1 }]);
      hasSeededDemoCart.current = true;
    }
  }, [products]);

  // --- CALCULS PANIER ---
  const totalItemsCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountPercent <= 0) return 0;
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // --- ACTIONS PANIER ---
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountPercent(0);
  };

  // --- VENTES EN ATTENTE ---
  const handleHoldSale = () => {
    if (cart.length === 0) return;
    const nextSlotNum = heldSales.length + 1;
    const newHold: HeldSale = {
      id: `hold-${Date.now()}`,
      label: `Attente #${nextSlotNum}`,
      items: [...cart],
      discount: discountPercent,
      createdAt: new Date(),
    };
    setHeldSales((prev) => [...prev, newHold]);
    handleClearCart();
  };

  const handleRestoreHoldSale = (holdId: string) => {
    const targetHold = heldSales.find((h) => h.id === holdId);
    if (!targetHold) return;

    setCart(targetHold.items);
    setDiscountPercent(targetHold.discount);
    setHeldSales((prev) => prev.filter((h) => h.id !== holdId));
  };

  const handleDeleteHoldSale = (holdId: string) => {
    setHeldSales((prev) => prev.filter((h) => h.id !== holdId));
  };

  // --- ENCAISSEMENT ---
  const handleCheckout = () => {
    if (cart.length === 0) return;

    setLastCartBackup({
      items: [...cart],
      discount: discountPercent,
    });

    const orderSummary: CompletedOrder = {
      id: `CMD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      discountAmount,
      discountPercent,
      total: finalTotal,
      itemsCount: totalItemsCount,
      method: paymentMethod,
      date: new Date(),
    };

    setCompletedOrderDetails(orderSummary);
    setShowCheckoutSuccess(true);
    handleClearCart();
  };

  // --- ANNULATION ET RESTAURATION DU PANIER ---
  const handleCancelCheckout = () => {
    if (lastCartBackup) {
      setCart(lastCartBackup.items);
      setDiscountPercent(lastCartBackup.discount);
    }
    setShowCheckoutSuccess(false);
    setCompletedOrderDetails(null);
  };

  // --- TÉLÉCHARGEMENT AUTOMATIQUE DU REÇU PDF ---
  const handleDownloadPDF = () => {
    if (!completedOrderDetails) return;

    const htmlContent = generateReceiptHtml(completedOrderDetails);
    downloadHtmlFile(`Recu_${completedOrderDetails.id}.pdf.html`, htmlContent);
  };

  const closeSuccessModal = () => {
    setShowCheckoutSuccess(false);
    setCompletedOrderDetails(null);
  };

  return {
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
  };
}
