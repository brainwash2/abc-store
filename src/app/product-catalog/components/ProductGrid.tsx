import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: { fr: string; ar: string };
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  currentLanguage: 'fr' | 'ar';
  viewMode: 'grid' | 'list';
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number) => void;
  wishlistItems: number[];
  isLoading: boolean;
}

const ProductGrid = ({
  products,
  currentLanguage,
  viewMode,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
  isLoading
}: ProductGridProps) => {
  const LoadingSkeleton = () => (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded" />
          ))}
        </div>
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="h-9 bg-muted rounded" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
      }`}>
        {[...Array(12)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875v-8.25"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {currentLanguage === 'fr' ? 'Aucun produit trouvé' : 'لم يتم العثور على منتجات'}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {currentLanguage === 'fr' ?'Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.' :'حاول تعديل المرشحات أو البحث للعثور على ما تبحث عنه.'
          }
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-smooth"
        >
          {currentLanguage === 'fr' ? 'Réinitialiser les filtres' : 'إعادة تعيين المرشحات'}
        </button>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
    }`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currentLanguage={currentLanguage}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={wishlistItems.includes(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;