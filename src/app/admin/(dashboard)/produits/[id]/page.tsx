import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductResultsManager } from "@/components/admin/ProductResultsManager";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { results: { orderBy: { order: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Modifier {product.name}</h1>
      <div className="mt-8 max-w-3xl space-y-8">
        <ProductForm product={product} />
        <ProductResultsManager productId={product.id} results={product.results} />
      </div>
    </div>
  );
}
