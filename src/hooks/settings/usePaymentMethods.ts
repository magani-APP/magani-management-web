"use client";

import { useEffect, useState } from "react";
import { PaymentMethod } from "@/types/settings";
import { getPaymentMethods, updatePaymentMethodStatus } from "@/api/settings.api";

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPaymentMethods().then((data) => {
      if (isMounted) {
        setMethods(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggle = async (id: string) => {
    const target = methods.find((method) => method.id === id);
    if (!target || target.isFixed) return;

    const nextEnabled = !target.enabled;

    // Mise à jour optimiste
    setMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, enabled: nextEnabled } : method))
    );

    try {
      await updatePaymentMethodStatus(id, nextEnabled);
    } catch {
      // En cas d'échec, on restaure l'état précédent
      setMethods((prev) =>
        prev.map((method) => (method.id === id ? { ...method, enabled: target.enabled } : method))
      );
    }
  };

  return { methods, isLoading, toggle };
}
