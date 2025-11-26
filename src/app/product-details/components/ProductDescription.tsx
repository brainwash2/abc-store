import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductDescriptionProps {
  description: string;
  specifications?: any; // Changed to accept dynamic object
  currentLanguage?: 'fr' | 'ar';
}

const ProductDescription = ({ description, specifications, currentLanguage = 'fr' }: ProductDescriptionProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 space-y-8 shadow-sm">
      
      {/* Description Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {currentLanguage === 'fr' ? 'Description du produit' : 'وصف المنتج'}
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>

      {/* Specifications Section */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {currentLanguage === 'fr' ? 'Caractéristiques techniques' : 'المواصفات التقنية'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-slate-500 font-mono text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-violet-50 rounded-lg p-4 border border-violet-100">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={24} className="text-violet-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-violet-900">
              {currentLanguage === 'fr' ? 'Information importante' : 'معلومات مهمة'}
            </h4>
            <p className="text-sm text-violet-700">
              {currentLanguage === 'fr' 
                ? 'Ce produit est couvert par une garantie constructeur de 2 ans. Livraison gratuite dans toute l\'Algérie.' 
                : 'هذا المنتج مغطى بضمان الشركة المصنعة لمدة عامين. توصيل مجاني في جميع أنحاء الجزائر.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;