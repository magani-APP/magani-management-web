export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price);
};
