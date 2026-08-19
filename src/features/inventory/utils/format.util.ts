export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

export const formatDate = (isoDate: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
};

export const formatCompactCFA = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace('.', ',');
};

export const formatShortDate = (isoDate: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(isoDate));
};