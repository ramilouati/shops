const tndFormatter = new Intl.NumberFormat("fr-TN", {
  style: "currency",
  currency: "TND",
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});

export const formatPrice = (amount) => tndFormatter.format(Number(amount) || 0);
