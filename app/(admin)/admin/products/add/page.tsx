// app/(admin)/admin/products/add/page.tsx

import { ProductForm } from "../product-form";

export default function AddProductPage() {
  return (
    <div className="p-6">
      <ProductForm isEditMode={false} />
    </div>
  );
}