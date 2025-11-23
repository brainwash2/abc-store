import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  specifications: string;
}

interface OrderSummaryProps {
  currentLanguage: 'fr' | 'ar';
  cartItems: CartItem[];
  deliveryPrice: number;
  subtotal: number;
  total: number;
}

const OrderSummary = ({
  currentLanguage,
  cartItems,
  deliveryPrice,
  subtotal,
  total
}: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1 sticky top-24">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Résumé de la Commande' : 'ملخص الطلب'}
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <AppImage
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-text-primary text-sm line-clamp-2">
                {item.name}
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                {item.specifications}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-text-secondary">
                  {currentLanguage === 'fr' ? 'Qté:' : 'الكمية:'} {item.quantity}
                </span>
                <span className="font-semibold text-text-primary text-sm">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            placeholder={currentLanguage === 'fr' ? 'Code promo' : 'كود الخصم'}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-smooth">
            {currentLanguage === 'fr' ? 'Appliquer' : 'تطبيق'}
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            {currentLanguage === 'fr' ? 'Sous-total' : 'المجموع الفرعي'}
          </span>
          <span className="font-medium text-text-primary">
            {formatPrice(subtotal)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            {currentLanguage === 'fr' ? 'Livraison' : 'التوصيل'}
          </span>
          <span className="font-medium text-text-primary">
            {deliveryPrice === 0 
              ? (currentLanguage === 'fr' ? 'Gratuit' : 'مجاني')
              : formatPrice(deliveryPrice)
            }
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            {currentLanguage === 'fr' ? 'TVA (19%)' : 'ضريبة القيمة المضافة (19%)'}
          </span>
          <span className="font-medium text-text-primary">
            {formatPrice(Math.round(subtotal * 0.19))}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-text-primary">
            {currentLanguage === 'fr' ? 'Total' : 'المجموع'}
          </span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          {currentLanguage === 'fr' ? 'TVA incluse' : 'شامل ضريبة القيمة المضافة'}
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="ShieldCheckIcon" size={16} className="text-success" />
            <span className="text-xs text-text-secondary">
              {currentLanguage === 'fr' ? 'Paiement 100% sécurisé' : 'دفع آمن 100%'}
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="TruckIcon" size={16} className="text-primary" />
            <span className="text-xs text-text-secondary">
              {currentLanguage === 'fr' ? 'Livraison rapide en Algérie' : 'توصيل سريع في الجزائر'}
            </span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="ArrowPathIcon" size={16} className="text-accent" />
            <span className="text-xs text-text-secondary">
              {currentLanguage === 'fr' ? 'Retour sous 14 jours' : 'إرجاع خلال 14 يوم'}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
          <Icon name="ChatBubbleLeftRightIcon" size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-primary">
            {currentLanguage === 'fr' ? 'Besoin d\'aide?' : 'تحتاج مساعدة؟'}
          </span>
        </div>
        <p className="text-xs text-text-secondary mb-2">
          {currentLanguage === 'fr' ?'Notre équipe est disponible pour vous aider' :'فريقنا متاح لمساعدتك'
          }
        </p>
        <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="PhoneIcon" size={12} className="text-primary" />
            <span className="text-text-secondary">+213 23 456 789</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Icon name="EnvelopeIcon" size={12} className="text-primary" />
            <span className="text-text-secondary">support@abc-info.dz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;