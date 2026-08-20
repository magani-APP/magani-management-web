import { TOKENS } from '@/src/constants/design-tokens.constants';
import { InventoryFilterLabel, StockStatus } from '@/src/types/inventory.types';
import { MovementType } from '../types/inventory.types';

export const INVENTORY_FILTERS: InventoryFilterLabel[] = [
  'Tous',
  'En stock',
  'Bas',
  'Critique',
  'Expiré',
];

// Seuils métier (cf. tableau Produits & Stock)
export const CRITICAL_STOCK_THRESHOLD = 15;
export const LOW_STOCK_THRESHOLD = 30;
export const MARGIN_LOW_THRESHOLD = 39; // < 39% => orange
export const MARGIN_HIGH_THRESHOLD = 46; // > 46% => lime

interface StatusVisual {
  label: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}

export const STATUS_CONFIG: Record<StockStatus, StatusVisual> = {
  'en-stock': {
    label: 'En stock',
    bg: TOKENS.successBg,
    border: TOKENS.successBorder,
    text: TOKENS.successText,
    dot: TOKENS.successText,
  },
  'stock-bas': {
    label: 'Stock bas',
    bg: TOKENS.warningBg,
    border: TOKENS.warningBorder,
    text: TOKENS.warningText,
    dot: TOKENS.warning,
  },
  critique: {
    label: 'Critique',
    bg: TOKENS.dangerBg,
    border: TOKENS.dangerBorder,
    text: TOKENS.dangerText,
    dot: TOKENS.danger,
  },
  expire: {
    label: 'Expiré',
    bg: TOKENS.neutralBg,
    border: TOKENS.neutralBorder,
    text: TOKENS.neutralText,
    dot: TOKENS.faintText,
  },
};

export const STOCK_TEXT_COLOR: Record<StockStatus, string> = {
  'en-stock': TOKENS.foreground,
  'stock-bas': TOKENS.warning,
  critique: TOKENS.danger,
  expire: TOKENS.faintText,
};

export const getMarginColor = (percent: number): string => {
  if (percent > MARGIN_HIGH_THRESHOLD) return TOKENS.lime;
  if (percent >= MARGIN_LOW_THRESHOLD) return TOKENS.primary;
  return TOKENS.orange;
};

export const MOVEMENT_LABELS: Record<MovementType, string> = {
  vente: 'Vente',
  reapprovisionnement: 'Réapprovisionnement',
};