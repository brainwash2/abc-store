import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface EmptyCartProps {
  currentLanguage: 'fr' | 'ar';
}

const EmptyCart = ({ currentLanguage }: EmptyCartProps) => {
  const suggestedProducts = [
  {
    id: 1,
    name: "Ordinateur Portable HP Pavilion 15",
    nameAr: "لابتوب HP Pavilion 15",
    image: "https://images.unsplash.com/photo-1637329336542-10af4a6ca083",
    alt: "Modern silver HP Pavilion laptop open on white desk showing colorful desktop wallpaper",
    price: 89999,
    originalPrice: 99999
  },
  {
    id: 2,
    name: "Souris Gaming Logitech G502",
    nameAr: "فأرة الألعاب Logitech G502",
    image: "https://images.unsplash.com/photo-1598569666598-49f7bbde8cba",
    alt: "Black Logitech gaming mouse with RGB lighting on dark surface",
    price: 8999,
    originalPrice: null
  },
  {
    id: 3,
    name: "Clavier Mécanique Corsair K95",
    nameAr: "لوحة مفاتيح ميكانيكية Corsair K95",
    image: "https://images.unsplash.com/photo-1643295054171-faf3f2491ecb",
    alt: "Black mechanical gaming keyboard with RGB backlighting on wooden desk",
    price: 15999,
    originalPrice: 17999
  }];


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="text-center py-12">
      {/* Empty Cart Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="ShoppingCartIcon" size={64} className="text-text-secondary" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {currentLanguage === 'fr' ? 'Votre panier est vide' : 'سلة التسوق فارغة'}
        </h2>
        
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          {currentLanguage === 'fr' ? 'Découvrez nos produits informatiques et ajoutez vos articles préférés à votre panier.' : 'اكتشف منتجاتنا التقنية وأضف العناصر المفضلة لديك إلى السلة.'
          }
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/product-catalog"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth">

            <Icon name="CubeIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
            {currentLanguage === 'fr' ? 'Parcourir les produits' : 'تصفح المنتجات'}
          </Link>
          
          <Link
            href="/homepage"
            className="inline-flex items-center justify-center px-6 py-3 border border-border text-text-primary font-medium rounded-lg hover:bg-muted transition-smooth">

            <Icon name="HomeIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
            {currentLanguage === 'fr' ? 'Retour à l\'accueil' : 'العودة للرئيسية'}
          </Link>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-text-primary mb-6">
          {currentLanguage === 'fr' ? 'Produits recommandés' : 'منتجات مقترحة'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedProducts.map((product) =>
          <Link
            key={product.id}
            href={`/product-details?id=${product.id}`}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth group">

              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <AppImage
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />

              </div>
              
              <h4 className="font-medium text-text-primary mb-2 line-clamp-2">
                {currentLanguage === 'fr' ? product.name : product.nameAr}
              </h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice &&
                <span className="text-sm text-text-secondary line-through ml-2 rtl:ml-0 rtl:mr-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                }
                </div>
                
                <Icon
                name="PlusCircleIcon"
                size={20}
                className="text-primary group-hover:scale-110 transition-smooth" />

              </div>
            </Link>
          )}
        </div>
      </div>
    </div>);

};

export default EmptyCart;