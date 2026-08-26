'use client';

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

const WILAYAS = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger' },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: "M'Sila" },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' },
  { code: '49', name: 'Timimoun' },
  { code: '50', name: 'Bordj Badji Mokhtar' },
  { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Béni Abbès' },
  { code: '53', name: 'In Salah' },
  { code: '54', name: 'In Guezzam' },
  { code: '55', name: 'Touggourt' },
  { code: '56', name: 'Djanet' },
  { code: '57', name: "El M'Ghair" },
  { code: '58', name: 'El Meniaa' },
  { code: '59', name: 'Aflou' },
  { code: '60', name: 'Barika' },
  { code: '61', name: 'Ksar Chellala' },
  { code: '62', name: 'Messaad' },
  { code: '63', name: 'Aïn Oussera' },
  { code: '64', name: 'Boussaâda' },
  { code: '65', name: 'El Abiodh Sidi Cheikh' },
  { code: '66', name: 'El Kantara' },
  { code: '67', name: 'Bir El Ater' },
  { code: '68', name: 'Ksar El Boukhari' },
  { code: '69', name: 'El Aricha' }
];

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {currentLanguage === 'fr' ? 'Informations de Livraison' : 'معلومات التوصيل'}
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          {currentLanguage === 'fr' ? 'Adresses Sauvegardées' : 'العناوين المحفوظة'}
        </h3>
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress === address.id
                  ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600'
                  : 'border-slate-200 hover:border-violet-300'
              }`}
              onClick={() => onAddressSelect(address.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 ${
                  selectedAddress === address.id ? 'border-violet-600' : 'border-slate-400'
                }`}>
                  {selectedAddress === address.id && <div className="w-3 h-3 bg-violet-600 rounded-full" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">{address.name}</p>
                    {address.isDefault && (
                      <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {currentLanguage === 'fr' ? 'Par défaut' : 'افتراضي'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{address.street}, {address.city}</p>
                  <p className="text-sm text-slate-600">{address.wilaya} {address.postalCode}</p>
                  <p className="text-sm text-slate-600">{address.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onToggleNewAddressForm}
          className="mt-4 flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          <Icon name="PlusIcon" size={20} />
          <span className="text-sm">
            {currentLanguage === 'fr' ? 'Ajouter une nouvelle adresse' : 'إضافة عنوان جديد'}
          </span>
        </button>
      </div>

      {showNewAddressForm && (
        <div className="mb-8 p-6 border border-slate-200 rounded-xl bg-slate-50 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-lg font-bold text-slate-900 mb-4">
            {currentLanguage === 'fr' ? 'Nouvelle Adresse' : 'عنوان جديد'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {currentLanguage === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
              </label>
              <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {currentLanguage === 'fr' ? 'Téléphone' : 'رقم الهاتف'}
              </label>
              <input type="tel" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {currentLanguage === 'fr' ? 'Wilaya' : 'الولاية'}
              </label>
              <select className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white">
                <option value="">{currentLanguage === 'fr' ? 'Sélectionner' : 'اختر'}</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {currentLanguage === 'fr' ? 'Commune' : 'البلدية'}
              </label>
              <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {currentLanguage === 'fr' ? 'Adresse exacte' : 'العنوان الدقيق'}
              </label>
              <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors">
              {currentLanguage === 'fr' ? 'Sauvegarder' : 'حفظ'}
            </button>
            <button onClick={onToggleNewAddressForm} className="text-slate-600 hover:text-slate-900 px-4 py-2 font-medium transition-colors">
              {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
            </button>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          {currentLanguage === 'fr' ? 'Mode de Livraison' : 'طريقة التوصيل'}
        </h3>
        <div className="space-y-3">
          {deliveryMethods.map((method) => (
            <div
              key={method.id}
              className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all ${
                selectedDeliveryMethod === method.id
                  ? 'border-violet-600 bg-violet-50 ring-1 ring-violet-600'
                  : 'border-slate-200 hover:border-violet-300'
              }`}
              onClick={() => onDeliveryMethodSelect(method.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedDeliveryMethod === method.id ? 'border-violet-600' : 'border-slate-400'
                }`}>
                  {selectedDeliveryMethod === method.id && <div className="w-3 h-3 bg-violet-600 rounded-full" />}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center">
                    <Icon name={method.icon as any} size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{method.name[currentLanguage]}</p>
                    <p className="text-sm text-slate-500">{method.duration[currentLanguage]}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-violet-700">
                  {method.price === 0
                    ? (currentLanguage === 'fr' ? 'Gratuit' : 'مجاني')
                    : `${method.price.toLocaleString()} DA`
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;
