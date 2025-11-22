import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  wilaya: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface DeliveryMethod {
  id: string;
  name: { fr: string; ar: string };
  description: { fr: string; ar: string };
  price: number;
  duration: { fr: string; ar: string };
  icon: string;
}

interface DeliverySectionProps {
  currentLanguage: 'fr' | 'ar';
  selectedAddress: number | null;
  selectedDeliveryMethod: string | null;
  showNewAddressForm: boolean;
  onAddressSelect: (id: number) => void;
  onDeliveryMethodSelect: (id: string) => void;
  onToggleNewAddressForm: () => void;
}

const DeliverySection = ({
  currentLanguage,
  selectedAddress,
  selectedDeliveryMethod,
  showNewAddressForm,
  onAddressSelect,
  onDeliveryMethodSelect,
  onToggleNewAddressForm
}: DeliverySectionProps) => {
  const savedAddresses: Address[] = [
    {
      id: 1,
      name: "Adresse Domicile",
      street: "15 Rue Didouche Mourad",
      city: "Alger Centre",
      wilaya: "Alger",
      postalCode: "16000",
      phone: "+213 555 123 456",
      isDefault: true
    },
    {
      id: 2,
      name: "Bureau",
      street: "Zone Industrielle Rouiba",
      city: "Rouiba",
      wilaya: "Alger",
      postalCode: "16012",
      phone: "+213 555 789 012",
      isDefault: false
    }
  ];

  const deliveryMethods: DeliveryMethod[] = [
    {
      id: 'standard',
      name: { fr: 'Livraison Standard', ar: 'التوصيل العادي' },
      description: { fr: 'Livraison à domicile', ar: 'التوصيل للمنزل' },
      price: 500,
      duration: { fr: '3-5 jours ouvrables', ar: '3-5 أيام عمل' },
      icon: 'TruckIcon'
    },
    {
      id: 'express',
      name: { fr: 'Livraison Express', ar: 'التوصيل السريع' },
      description: { fr: 'Livraison rapide', ar: 'التوصيل السريع' },
      price: 1200,
      duration: { fr: '24-48 heures', ar: '24-48 ساعة' },
      icon: 'BoltIcon'
    },
    {
      id: 'pickup',
      name: { fr: 'Retrait en Magasin', ar: 'الاستلام من المتجر' },
      description: { fr: 'Gratuit - Magasin Alger', ar: 'مجاني - متجر الجزائر' },
      price: 0,
      duration: { fr: 'Disponible aujourd\'hui', ar: 'متاح اليوم' },
      icon: 'BuildingStorefrontIcon'
    }
  ];

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        {currentLanguage === 'fr' ? 'Informations de Livraison' : 'معلومات التوصيل'}
      </h2>

      {/* Saved Addresses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          {currentLanguage === 'fr' ? 'Adresses Sauvegardées' : 'العناوين المحفوظة'}
        </h3>
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
                selectedAddress === address.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => onAddressSelect(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                    selectedAddress === address.id
                      ? 'border-primary bg-primary' :'border-border'
                  }`}>
                    {selectedAddress === address.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <p className="font-medium text-text-primary">{address.name}</p>
                      {address.isDefault && (
                        <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                          {currentLanguage === 'fr' ? 'Par défaut' : 'افتراضي'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {address.street}, {address.city}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {address.wilaya} {address.postalCode}
                    </p>
                    <p className="text-sm text-text-secondary">{address.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onToggleNewAddressForm}
          className="mt-4 flex items-center space-x-2 rtl:space-x-reverse text-primary hover:text-primary/80 transition-smooth"
        >
          <Icon name="PlusIcon" size={16} />
          <span className="text-sm font-medium">
            {currentLanguage === 'fr' ? 'Ajouter une nouvelle adresse' : 'إضافة عنوان جديد'}
          </span>
        </button>
      </div>

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
          <h4 className="text-lg font-medium text-text-primary mb-4">
            {currentLanguage === 'fr' ? 'Nouvelle Adresse' : 'عنوان جديد'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Nom de l\'adresse' : 'اسم العنوان'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={currentLanguage === 'fr' ? 'Ex: Domicile, Bureau' : 'مثال: المنزل، المكتب'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Téléphone' : 'رقم الهاتف'}
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+213 555 123 456"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Adresse complète' : 'العنوان الكامل'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={currentLanguage === 'fr' ? 'Rue, numéro, quartier' : 'الشارع، الرقم، الحي'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Wilaya' : 'الولاية'}
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">
                  {currentLanguage === 'fr' ? 'Sélectionner une wilaya' : 'اختر الولاية'}
                </option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya} value={wilaya}>{wilaya}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Code postal' : 'الرمز البريدي'}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="16000"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-smooth">
              {currentLanguage === 'fr' ? 'Sauvegarder' : 'حفظ'}
            </button>
            <button
              onClick={onToggleNewAddressForm}
              className="text-text-secondary hover:text-text-primary transition-smooth"
            >
              {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
            </button>
          </div>
        </div>
      )}

      {/* Delivery Methods */}
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-4">
          {currentLanguage === 'fr' ? 'Mode de Livraison' : 'طريقة التوصيل'}
        </h3>
        <div className="space-y-3">
          {deliveryMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-smooth ${
                selectedDeliveryMethod === method.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => onDeliveryMethodSelect(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedDeliveryMethod === method.id
                      ? 'border-primary bg-primary' :'border-border'
                  }`}>
                    {selectedDeliveryMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={method.icon as any} size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{method.name[currentLanguage]}</p>
                      <p className="text-sm text-text-secondary">{method.description[currentLanguage]}</p>
                      <p className="text-sm text-text-secondary">{method.duration[currentLanguage]}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="font-semibold text-text-primary">
                    {method.price === 0 
                      ? (currentLanguage === 'fr' ? 'Gratuit' : 'مجاني')
                      : `${method.price.toLocaleString()} DA`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;