import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
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

const ProductCard = ({ 
  product, 
  currentLanguage, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist 
}: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`full-${i}`} name="StarIcon" variant="solid" size={16} className="text-accent" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarIcon" size={16} className="text-accent opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="StarIcon" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-smooth overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/product-details?id=${product.id}`}>
          <AppImage
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth cursor-pointer"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded">
              {currentLanguage === 'fr' ? 'Nouveau' : 'جديد'}
            </span>
          )}
          {product.discount && (
            <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-smooth"
        >
          <Icon 
            name="HeartIcon" 
            variant={isInWishlist ? "solid" : "outline"}
            size={18} 
            className={isInWishlist ? "text-error" : "text-muted-foreground hover:text-error"} 
          />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
          <Link
            href={`/product-details?id=${product.id}`}
            className="w-full bg-primary text-primary-foreground text-sm font-medium py-2 px-4 rounded-md hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
          >
            <Icon name="EyeIcon" size={16} />
            {currentLanguage === 'fr' ? 'Voir détails' : 'عرض التفاصيل'}
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <Link href={`/product-details?id=${product.id}`}>
          <h3 className="font-medium text-card-foreground hover:text-primary transition-smooth line-clamp-2 mb-2 cursor-pointer">
            {product.name[currentLanguage]}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-card-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-error'}`} />
          <span className={`text-xs font-medium ${product.inStock ? 'text-success' : 'text-error'}`}>
            {product.inStock 
              ? (currentLanguage === 'fr' ? 'En stock' : 'متوفر')
              : (currentLanguage === 'fr' ? 'Rupture de stock' : 'غير متوفر')
            }
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={!product.inStock}
          className="w-full bg-primary text-primary-foreground text-sm font-medium py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2"
        >
          <Icon name="ShoppingCartIcon" size={16} />
          {currentLanguage === 'fr' ? 'Ajouter au panier' : 'أضف إلى السلة'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;