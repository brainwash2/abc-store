import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface DeliveryInfoProps {
  address: DeliveryAddress;
  deliveryMethod: string;
  trackingNumber: string;
  carrier: string;
  trackingStatus: string;
  currentLanguage: 'fr' | 'ar';
}

const DeliveryInfo = ({
  address,
  deliveryMethod,
  trackingNumber,
  carrier,
  trackingStatus,
  currentLanguage
}: DeliveryInfoProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Informations de livraison' : 'معلومات التسليم'}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="MapPinIcon" size={20} className="text-primary" />
            <h3 className="font-medium text-text-primary">
              {currentLanguage === 'fr' ? 'Adresse de livraison' : 'عنوان التسليم'}
            </h3>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <p className="font-medium text-text-primary">{address.name}</p>
              <p className="text-text-secondary">{address.street}</p>
              <p className="text-text-secondary">
                {address.city} {address.postalCode}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Icon name="PhoneIcon" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">{address.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {currentLanguage === 'fr' ? 'Méthode de livraison:' : 'طريقة التسليم:'}
              </span>
              <span className="font-medium text-text-primary">{deliveryMethod}</span>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="TruckIcon" size={20} className="text-primary" />
            <h3 className="font-medium text-text-primary">
              {currentLanguage === 'fr' ? 'Suivi de colis' : 'تتبع الطرد'}
            </h3>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-text-secondary">
                  {currentLanguage === 'fr' ? 'Numéro de suivi:' : 'رقم التتبع:'}
                </span>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-text-primary">
                    {trackingNumber}
                  </p>
                  <button className="text-xs text-primary hover:text-primary/80 transition-smooth">
                    {currentLanguage === 'fr' ? 'Copier' : 'نسخ'}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-secondary">
                  {currentLanguage === 'fr' ? 'Transporteur:' : 'شركة النقل:'}
                </span>
                <span className="font-medium text-text-primary">{carrier}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-text-secondary">
                  {currentLanguage === 'fr' ? 'Statut actuel:' : 'الحالة الحالية:'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="font-medium text-success">{trackingStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
            <Icon name="MagnifyingGlassIcon" size={16} />
            {currentLanguage === 'fr' ? 'Suivre le colis' : 'تتبع الطرد'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;