export interface Product {
  id: string;
  name: string;
  category: string;
  dci?: string;
  barcode: string;
  price: number;
  stock: number;
  unit: string;
  iconVariant?: 'emerald' | 'amber';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'espèces' | 'mtn' | 'orange' | 'carte' | 'mixte';

export interface HeldSale {
  id: string;
  label: string;
  items: CartItem[];
  discount: number;
  createdAt: Date;
}

export interface CompletedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  total: number;
  itemsCount: number;
  method: PaymentMethod;
  date: Date;
}
