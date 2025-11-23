import React from 'react';
import AppImage from '@/components/ui/AppImage';

interface Product {
  id: string;
  name: string;
  image: string;
  alt: string;
  quantity: number;
  price: number;
  specifications: string[];
  category: string;
}

interface ProductListProps {
  products: Product[];
  currentLanguage: 'fr' | 'ar';
}

const ProductList = ({ products, currentLanguage }: ProductListProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Produits commandés' : 'المنتجات المطلوبة'}
      </h2>
      
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-muted/30">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface">
                <AppImage
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-medium text-text-primary line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {currentLanguage === 'fr' ? 'Catégorie:' : 'الفئة:'} {product.category}
                  </p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-lg font-semibold text-text-primary">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {currentLanguage === 'fr' ? 'Quantité:' : 'الكمية:'} {product.quantity}
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-secondary">
                  {currentLanguage === 'fr' ? 'Spécifications:' : 'المواصفات:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.specifications.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-surface border border-border rounded text-text-secondary"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtotal */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">
                    {currentLanguage === 'fr' ? 'Sous-total:' : 'المجموع الفرعي:'}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {formatPrice(product.price * product.quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;