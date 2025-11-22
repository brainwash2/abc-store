'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  value: string;
  label: { fr: string; ar: string };
  icon: string;
}

interface SortControlsProps {
  currentLanguage: 'fr' | 'ar';
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
}

const SortControls = ({
  currentLanguage,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults
}: SortControlsProps) => {
  const sortOptions: SortOption[] = [
    {
      value: 'relevance',
      label: { fr: 'Pertinence', ar: 'الصلة' },
      icon: 'SparklesIcon'
    },
    {
      value: 'price_asc',
      label: { fr: 'Prix croissant', ar: 'السعر تصاعدي' },
      icon: 'ArrowUpIcon'
    },
    {
      value: 'price_desc',
      label: { fr: 'Prix décroissant', ar: 'السعر تنازلي' },
      icon: 'ArrowDownIcon'
    },
    {
      value: 'rating',
      label: { fr: 'Mieux notés', ar: 'الأعلى تقييماً' },
      icon: 'StarIcon'
    },
    {
      value: 'newest',
      label: { fr: 'Plus récents', ar: 'الأحدث' },
      icon: 'ClockIcon'
    },
    {
      value: 'name_asc',
      label: { fr: 'Nom A-Z', ar: 'الاسم أ-ي' },
      icon: 'Bars3BottomLeftIcon'
    }
  ];

  const formatResultsCount = (count: number) => {
    return new Intl.NumberFormat(currentLanguage === 'fr' ? 'fr-FR' : 'ar-DZ').format(count);
  };

  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.value === sortBy) || sortOptions[0];
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border rounded-lg p-4">
      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Icon name="CubeIcon" size={18} className="text-muted-foreground" />
        <span className="text-sm text-card-foreground">
          <span className="font-medium">{formatResultsCount(totalResults)}</span>
          <span className="ml-1 text-muted-foreground">
            {currentLanguage === 'fr' 
              ? (totalResults === 1 ? 'produit trouvé' : 'produits trouvés')
              : (totalResults === 1 ? 'منتج موجود' : 'منتج موجود')
            }
          </span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentLanguage === 'fr' ? 'Trier par:' : 'ترتيب حسب:'}
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-input border border-border rounded-md px-3 py-2 pr-8 rtl:pr-3 rtl:pl-8 text-sm text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-smooth cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[currentLanguage]}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded transition-smooth ${
              viewMode === 'grid' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-card-foreground hover:bg-background'
            }`}
            title={currentLanguage === 'fr' ? 'Vue grille' : 'عرض الشبكة'}
          >
            <Icon name="Squares2X2Icon" size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded transition-smooth ${
              viewMode === 'list' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-card-foreground hover:bg-background'
            }`}
            title={currentLanguage === 'fr' ? 'Vue liste' : 'عرض القائمة'}
          >
            <Icon name="ListBulletIcon" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;