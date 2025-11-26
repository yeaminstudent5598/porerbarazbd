// app/(admin)/admin/products/page.tsx

import ProductListClient from "./ProductListClient";

// Server side metadata (SEO-r jonno valo)
export const metadata = {
  title: 'Manage Products | Admin Dashboard',
  description: 'View and manage all products in the store.',
};

export default function ManageProductsPage() {
  // Server Component, just Client component ke render korbe
  return (
    <>
      <ProductListClient />
    </>
  );
}