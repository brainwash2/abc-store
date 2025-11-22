import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductDetailsInteractive from './components/ProductDetailsInteractive';

export const metadata: Metadata = {
  title: 'Détails du produit',
  description: '...',
};

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailsInteractive />
    </Suspense>
  );
}