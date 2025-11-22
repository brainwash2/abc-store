'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SpecificationCategory {
  id: string;
  name: { fr: string; ar: string };
  specs: {
    label: { fr: string; ar: string };
    value: string;
  }[];
}

interface ProductSpecificationsProps {
  specifications: SpecificationCategory[];
  currentLanguage: 'fr' | 'ar';
}

const ProductSpecifications = ({ specifications, currentLanguage }: ProductSpecificationsProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([specifications[0]?.id || '']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-text-primary">
          {currentLanguage === 'fr' ? 'Spécifications techniques' : 'المواصفات التقنية'}
        </h2>
      </div>

      <div className="divide-y divide-border">
        {specifications.map((category) => (
          <div key={category.id} className="overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
            >
              <h3 className="text-lg font-semibold text-text-primary text-left rtl:text-right">
                {category.name[currentLanguage]}
              </h3>
              <Icon
                name="ChevronDownIcon"
                size={20}
                className={`text-text-secondary transition-transform ${
                  expandedCategories.includes(category.id) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedCategories.includes(category.id) && (
              <div className="px-6 pb-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.specs.map((spec, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <dt className="text-sm font-medium text-text-secondary">
                        {spec.label[currentLanguage]}
                      </dt>
                      <dd className="text-sm text-text-primary font-medium">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;