import { Wallet, Smartphone, Phone, CreditCard, Layers } from 'lucide-react';
import { TOKENS } from '../constants/design-tokens.constants';
import { PaymentMethod } from '../types/pos.types';

export const CATEGORIES = [
  'Tous',
  'Analgésiques',
  'Antibiotiques',
  'Anti-inflammatoires',
  'Antipaludéens',
  'Gastro-entérologie',
  'Vitamines',
  'Soins',
];

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: typeof Wallet;
  color: string;
}[] = [
  { id: 'espèces', label: 'Espèces', icon: Wallet, color: TOKENS.primary },
  { id: 'mtn', label: 'MTN', icon: Smartphone, color: TOKENS.mtn },
  { id: 'orange', label: 'Orange', icon: Phone, color: TOKENS.orange },
  { id: 'carte', label: 'Carte', icon: CreditCard, color: TOKENS.info },
  { id: 'mixte', label: 'Mixte', icon: Layers, color: TOKENS.purple },
];
