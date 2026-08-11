import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Ajouter un produit</h1>
      <p className="mt-2 text-sm text-slate-500">
        Les exemples de résultats ("Aperçu des résultats") pourront être ajoutés une fois le produit enregistré.
      </p>
      <div className="mt-8 max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
