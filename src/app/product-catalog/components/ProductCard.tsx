import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

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

interface ProductCardProps {
  product: Product;
  currentLanguage: 'fr' | 'ar';
  onAddToCart: (productId: number) => void;
  onToggleWishlist: (productId: number) => void;
  isInWishlist: boolean;
}

const FALLBACK_IMG =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect fill=%22%23f1f5f9%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%22100%22 y=%22105%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22%3EImage indisponible%3C/text%3E%3C/svg%3E';

const ProductCard = ({
  product,
  currentLanguage,
  onAddToCart,
}: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="StarIcon"
          variant="solid"
          size={16}
          className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col">
      {/* Product Image — fixed aspect box, contained image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link
          href={`/product-details/${product.id}`}
          className="block w-full h-full p-4"
        >
          <img
            src={product.image || FALLBACK_IMG}
            alt={product.alt}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
              {currentLanguage === 'fr' ? 'Nouveau' : 'جديد'}
            </span>
          )}
        </div>

        {/* Hover action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm">
          <Link
            href={`/product-details/${product.id}`}
            className="w-full bg-violet-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2"
          >
            <Icon name="EyeIcon" size={16} />
            {currentLanguage === 'fr' ? 'Voir détails' : 'عرض التفاصيل'}
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.brand}
        </p>

        <Link href={`/product-details/${product.id}`}>
          <h3 className="font-medium text-slate-900 hover:text-violet-600 transition-colors line-clamp-2 mb-2 h-10">
            {product.name[currentLanguage]}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-lg font-bold text-violet-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product.id)}
            className="p-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-violet-600 hover:text-white transition-colors"
            aria-label="Ajouter au panier"
          >
            <Icon name="ShoppingCartIcon" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
