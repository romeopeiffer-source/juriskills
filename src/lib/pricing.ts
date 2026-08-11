type DiscountableProduct = {
  price: number;
  discountPercent?: number | null;
  discountAmount?: number | null;
  discountStart?: Date | null;
  discountEnd?: Date | null;
};

export type EffectivePrice = {
  finalPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  discountLabel: string | null;
};

/** Prices are stored in cents. Returns the price to charge and display metadata for the discount badge. */
export function getEffectivePrice(product: DiscountableProduct): EffectivePrice {
  const now = new Date();
  const startOk = !product.discountStart || product.discountStart <= now;
  const endOk = !product.discountEnd || product.discountEnd >= now;
  const isActive = startOk && endOk && (!!product.discountPercent || !!product.discountAmount);

  if (!isActive) {
    return {
      finalPrice: product.price,
      originalPrice: product.price,
      hasDiscount: false,
      discountLabel: null,
    };
  }

  let finalPrice = product.price;
  let label = "";

  if (product.discountPercent) {
    finalPrice = Math.round(product.price * (1 - product.discountPercent / 100));
    label = `-${product.discountPercent}%`;
  } else if (product.discountAmount) {
    finalPrice = Math.max(0, product.price - product.discountAmount);
    label = `-${formatPrice(product.discountAmount)}`;
  }

  return {
    finalPrice,
    originalPrice: product.price,
    hasDiscount: finalPrice < product.price,
    discountLabel: label,
  };
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}
