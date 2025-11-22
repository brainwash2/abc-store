import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductDescriptionProps {
  description: { fr: string; ar: string };
  features: { fr: string[]; ar: string[] };
  currentLanguage: 'fr' | 'ar';
}

const ProductDescription = ({ description, features, currentLanguage }: ProductDescriptionProps) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">
        {currentLanguage === 'fr' ? 'Description du produit' : 'وصف المنتج'}
      </h2>

      <div className="prose prose-slate max-w-none">
        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
          {description[currentLanguage]}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {currentLanguage === 'fr' ? 'Caractéristiques principales' : 'الخصائص الرئيسية'}
        </h3>
        <ul className="space-y-3">
          {features[currentLanguage].map((feature, index) => (
            <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
              <Icon name="CheckCircleIcon" size={20} className="text-success mt-0.5 flex-shrink-0" />
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-medium text-text-primary">
              {currentLanguage === 'fr' ? 'Information importante' : 'معلومات مهمة'}
            </h4>
            <p className="text-sm text-text-secondary">
              {currentLanguage === 'fr' ?'Ce produit est couvert par une garantie constructeur de 2 ans. Livraison gratuite dans toute l\'Algérie pour les commandes supérieures à 50 000 DZD.' :'هذا المنتج مغطى بضمان الشركة المصنعة لمدة عامين. توصيل مجاني في جميع أنحاء الجزائر للطلبات التي تزيد عن 50,000 دج.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;