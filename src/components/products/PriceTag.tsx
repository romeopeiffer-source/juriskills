import { formatPrice, getEffectivePrice } from "@/lib/pricing";
import { PromoCountdown } from "@/components/products/PromoCountdown";

type Props = {
  price: number;
  discountPercent?: number | null;
  discountAmount?: number | null;
  discountStart?: Date | null;
  discountEnd?: Date | null;
  size?: "sm" | "lg";
};

export function PriceTag({ size = "sm", ...product }: Props) {
  const { finalPrice, originalPrice, hasDiscount, discountLabel } = getEffectivePrice(product);
  const showCountdown = hasDiscount && product.discountEnd && product.discountEnd.getTime() > Date.now();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className={size === "lg" ? "font-display text-3xl font-bold text-white" : "font-display text-lg font-bold text-white"}>
          {formatPrice(finalPrice)} <span className="text-sm font-normal text-slate-500">TTC</span>
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-slate-500 line-through">{formatPrice(originalPrice)}</span>
            <span className="badge-discount">{discountLabel}</span>
          </>
        )}
      </div>
      {showCountdown && <PromoCountdown endsAt={product.discountEnd!.toISOString()} size={size} />}
    </div>
  );
}
