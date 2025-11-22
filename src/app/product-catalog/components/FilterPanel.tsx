'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  categories: Array<{ id: string; name: { fr: string; ar: string }; count: number }>;
  brands: Array<{ id: string; name: string; count: number }>;
  priceRange: { min: number; max: number };
  specifications: {
    ram: Array<{ value: string; count: number }>;
    storage: Array<{ value: string; count: number }>;
    processor: Array<{ value: string; count: number }>;
  };
}

interface ActiveFilters {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  ram: string[];
  storage: string[];
  processor: string[];
}

interface FilterPanelProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  currentLanguage: 'fr' | 'ar';
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel = ({
  filterOptions,
  activeFilters,
  currentLanguage,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onClose
}: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
    specifications: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(id => id !== categoryId)
      : [...activeFilters.categories, categoryId];
    
    onFiltersChange({
      ...activeFilters,
      categories: newCategories
    });
  };

  const handleBrandChange = (brandId: string) => {
    const newBrands = activeFilters.brands.includes(brandId)
      ? activeFilters.brands.filter(id => id !== brandId)
      : [...activeFilters.brands, brandId];
    
    onFiltersChange({
      ...activeFilters,
      brands: newBrands
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...activeFilters,
      priceRange: {
        ...activeFilters.priceRange,
        [type]: value
      }
    });
  };

  const handleSpecificationChange = (type: 'ram' | 'storage' | 'processor', value: string) => {
    const currentValues = activeFilters[type];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...activeFilters,
      [type]: newValues
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    return activeFilters.categories.length + 
           activeFilters.brands.length + 
           activeFilters.ram.length + 
           activeFilters.storage.length + 
           activeFilters.processor.length +
           (activeFilters.priceRange.min > filterOptions.priceRange.min || 
            activeFilters.priceRange.max < filterOptions.priceRange.max ? 1 : 0);
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode; 
  }) => (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-card-foreground hover:text-primary transition-smooth mb-3"
      >
        <span>{title}</span>
        <Icon 
          name="ChevronDownIcon" 
          size={16} 
          className={`transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} 
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <div className={`
        fixed lg:static top-0 right-0 h-full lg:h-auto w-80 lg:w-full bg-card border-l lg:border-l-0 lg:border border-border z-50 lg:z-auto
        transform transition-transform lg:transform-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">
            {currentLanguage === 'fr' ? 'Filtres' : 'المرشحات'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="p-4 lg:p-0 h-full lg:h-auto overflow-y-auto">
          {/* Filter Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">
              {currentLanguage === 'fr' ? 'Filtres' : 'المرشحات'}
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </h2>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-error hover:text-error/80 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Effacer tout' : 'مسح الكل'}
              </button>
            )}
          </div>

          {/* Categories */}
          <FilterSection 
            title={currentLanguage === 'fr' ? 'Catégories' : 'الفئات'} 
            sectionKey="categories"
          >
            {filterOptions.categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-smooth">
                <input
                  type="checkbox"
                  checked={activeFilters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="flex-1 text-sm text-card-foreground">
                  {category.name[currentLanguage]}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              </label>
            ))}
          </FilterSection>

          {/* Brands */}
          <FilterSection 
            title={currentLanguage === 'fr' ? 'Marques' : 'العلامات التجارية'} 
            sectionKey="brands"
          >
            {filterOptions.brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-smooth">
                <input
                  type="checkbox"
                  checked={activeFilters.brands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="flex-1 text-sm text-card-foreground">
                  {brand.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({brand.count})
                </span>
              </label>
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection 
            title={currentLanguage === 'fr' ? 'Prix' : 'السعر'} 
            sectionKey="price"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    {currentLanguage === 'fr' ? 'Min' : 'الحد الأدنى'}
                  </label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    {currentLanguage === 'fr' ? 'Max' : 'الحد الأقصى'}
                  </label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || filterOptions.priceRange.max)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={filterOptions.priceRange.max.toString()}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatPrice(activeFilters.priceRange.min)} - {formatPrice(activeFilters.priceRange.max)}
              </div>
            </div>
          </FilterSection>

          {/* Specifications */}
          <FilterSection 
            title={currentLanguage === 'fr' ? 'Spécifications' : 'المواصفات'} 
            sectionKey="specifications"
          >
            <div className="space-y-4">
              {/* RAM */}
              <div>
                <h4 className="text-sm font-medium text-card-foreground mb-2">
                  {currentLanguage === 'fr' ? 'Mémoire RAM' : 'ذاكرة الوصول العشوائي'}
                </h4>
                <div className="space-y-1">
                  {filterOptions.specifications.ram.map((ram) => (
                    <label key={ram.value} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-smooth">
                      <input
                        type="checkbox"
                        checked={activeFilters.ram.includes(ram.value)}
                        onChange={() => handleSpecificationChange('ram', ram.value)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="flex-1 text-sm text-card-foreground">
                        {ram.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({ram.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div>
                <h4 className="text-sm font-medium text-card-foreground mb-2">
                  {currentLanguage === 'fr' ? 'Stockage' : 'التخزين'}
                </h4>
                <div className="space-y-1">
                  {filterOptions.specifications.storage.map((storage) => (
                    <label key={storage.value} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-smooth">
                      <input
                        type="checkbox"
                        checked={activeFilters.storage.includes(storage.value)}
                        onChange={() => handleSpecificationChange('storage', storage.value)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="flex-1 text-sm text-card-foreground">
                        {storage.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({storage.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Processor */}
              <div>
                <h4 className="text-sm font-medium text-card-foreground mb-2">
                  {currentLanguage === 'fr' ? 'Processeur' : 'المعالج'}
                </h4>
                <div className="space-y-1">
                  {filterOptions.specifications.processor.map((processor) => (
                    <label key={processor.value} className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-smooth">
                      <input
                        type="checkbox"
                        checked={activeFilters.processor.includes(processor.value)}
                        onChange={() => handleSpecificationChange('processor', processor.value)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="flex-1 text-sm text-card-foreground">
                        {processor.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({processor.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Mobile Clear Filters */}
          <div className="lg:hidden mt-6 pt-4 border-t border-border">
            <button
              onClick={onClearFilters}
              className="w-full bg-error text-error-foreground py-3 px-4 rounded-md font-medium transition-smooth hover:bg-error/90"
            >
              {currentLanguage === 'fr' ? 'Effacer tous les filtres' : 'مسح جميع المرشحات'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;