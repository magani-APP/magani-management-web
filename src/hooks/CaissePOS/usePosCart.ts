'use client';

import { useMemo, useState } from 'react';
import {
  CartItem,
  CompletedOrder,
  HeldSale,
  PaymentMethod,
  Product,
} from '@/types/pos.types';
import { generateReceiptHtml } from '@/lib/pdf/generateReceiptHtml';
import { downloadHtmlFile } from '@/lib/pdf/downloadHtmlFile';
import { createSale } from '@/api/pos.api';
import { ApiError } from '@/lib/api-client';

export function usePosCart(products: Product[], onSaleCompleted?: () => void) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('espèces');

  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] =
    useState<CompletedOrder | null>(null);

  // Nouveaux états liés à l'appel API
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [lastCartBackup, setLastCartBackup] = useState<{
    items: CartItem[];
    discount: number;
  } | null>(null);

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

  const handleHoldSale = () => {
    if (cart.length === 0) return;

    const nextSlotNum =
      heldSales.reduce((max, h) => {
        const match = h.label.match(/#(\d+)/);
        const num = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, num);
      }, 0) + 1;

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
  };

  const handleDeleteHoldSale = (holdId: string) => {
    setHeldSales((prev) => prev.filter((h) => h.id !== holdId));
  };

  // --- ENCAISSEMENT : appel réel à POST /pharmacy/pos/sales ---
  const handleCheckout = async () => {
    if (cart.length === 0 || isCheckingOut) return;

    setLastCartBackup({
      items: [...cart],
      discount: discountPercent,
    });

    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      const sale = await createSale({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPriceXaf: item.product.price,
        })),
        method: paymentMethod,
        amountXaf: finalTotal,
        discountXaf: discountAmount,
      });

      const orderSummary: CompletedOrder = {
        id: sale.receiptNumber,
        items: [...cart],
        subtotal,
        discountAmount,
        discountPercent,
        total: finalTotal,
        itemsCount: totalItemsCount,
        method: paymentMethod,
        date: new Date(sale.createdAt),
      };

      setCompletedOrderDetails(orderSummary);
      setShowCheckoutSuccess(true);
      handleClearCart();
      // Le stock vient de changer côté serveur : on rafraîchit le catalogue.
      onSaleCompleted?.();
    } catch (err) {
      setCheckoutError(
        err instanceof ApiError ? err.message : "La vente n'a pas pu être enregistrée."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCancelCheckout = () => {
    if (lastCartBackup) {
      setCart(lastCartBackup.items);
      setDiscountPercent(lastCartBackup.discount);
    }
    setShowCheckoutSuccess(false);
    setCompletedOrderDetails(null);
  };

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
  };
}