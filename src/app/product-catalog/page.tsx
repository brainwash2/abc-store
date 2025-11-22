import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductCatalogInteractive from './components/ProductCatalogInteractive';

export const metadata: Metadata = {
  title: 'Catalogue de Produits - ABC Informatique',
  description: 'Découvrez notre large gamme de produits informatiques et électroniques.',
};

export default function ProductCatalogPage() {
  return (
    // This "Suspense" wrapper protects the page from crashing while reading URL params
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductCatalogInteractive />
    </Suspense>
  );
}