'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/common/Header';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProductGrid from './ProductGrid';
import { useCartStore } from '@/store/useCart';
import { supabase } from '@/lib/supabase';

// --- TYPES ---
interface Product {
  id: number;
  name: {fr: string;ar: string;};
  price: number;
  originalPrice?: number;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  isNew?: boolean;
  discount?: number;
  specifications: {
    ram?: string;
    storage?: string;
    processor?: string;
  };
}

interface SearchSuggestion {
  id: string;
  text: {fr: string;ar: string;};
  type: 'product' | 'category' | 'brand';
  count?: number;
}

interface FilterOptions {
  categories: Array<{id: string;name: {fr: string;ar: string;};count: number;}>;
  brands: Array<{id: string;name: string;count: number;}>;
  priceRange: {min: number;max: number;};
  specifications: {
    ram: Array<{value: string;count: number;}>;
    storage: Array<{value: string;count: number;}>;
    processor: Array<{value: string;count: number;}>;
  };
}

interface ActiveFilters {
  categories: string[];
  brands: string[];
  priceRange: {min: number;max: number;};
  ram: string[];
  storage: string[];
  processor: string[];
}

// --- STATIC DATA ---
const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: { fr: 'Ordinateur', ar: 'كمبيوتر' }, type: 'category', count: 45 },
];

const FILTER_OPTIONS = {
  categories: [
    { id: 'Laptops', name: { fr: 'Ordinateurs', ar: 'كمبيوتر' }, count: 0 },
    { id: 'Smartphones', name: { fr: 'Smartphones', ar: 'هواتف' }, count: 0 },
    { id: 'Gaming', name: { fr: 'Gaming', ar: 'ألعاب' }, count: 0 },
    { id: 'Accessoires', name: { fr: 'Accessoires', ar: 'إكسسوارات' }, count: 0 }
  ],
  brands: [
    { id: 'HP', name: 'HP', count: 0 },
    { id: 'Apple', name: 'Apple', count: 0 },
    { id: 'Samsung', name: 'Samsung', count: 0 },
    { id: 'Dell', name: 'Dell', count: 0 }
  ],
  priceRange: { min: 0, max: 500000 },
  specifications: { ram: [], storage: [], processor: [] }
};

const ProductCatalogInteractive = () => {
  // --- STATE ---
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  
  // Added missing search states
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  
  // --- REAL DATA STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: { min: 0, max: 500000 },
    ram: [] as string[],
    storage: [] as string[],
    processor: [] as string[]
  });

  // 1. INITIALIZE & FETCH DATA
  useEffect(() => {
    setIsHydrated(true);
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar';
    if (savedLanguage) setCurrentLanguage(savedLanguage);

    fetchRealProducts();
  }, []);

  // 2. SUPABASE FETCH FUNCTION
  const fetchRealProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
      return;
    }

    if (data) {
      // Transform Database format to UI format
      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item.id, 
        name: { fr: item.name_fr, ar: item.name_ar },
        price: item.price,
        originalPrice: item.original_price,
        image: item.image_url,
        alt: item.name_fr,
        rating: 4.5, // Default
        reviewCount: 10, // Default
        category: item.category,
        brand: item.brand,
        inStock: item.stock > 0,
        isNew: item.is_new,
        specifications: item.specs || {}
      }));
      setProducts(formattedProducts);
    }
    setIsLoading(false);
  };

  // 3. FILTERING LOGIC
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.fr.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((product) => activeFilters.categories.includes(product.category));
    }

    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter((product) => activeFilters.brands.includes(product.brand));
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name_asc': filtered.sort((a, b) => a.name[currentLanguage].localeCompare(b.name[currentLanguage])); break;
    }

    return filtered;
  }, [products, searchQuery, activeFilters, sortBy, currentLanguage]);

  // HANDLERS
  const handleAddToCart = (productId: any) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id.toString(),
        title: currentLanguage === 'fr' ? product.name.fr : product.name.ar,
        price: product.price,
        image: product.image,
        category: product.category,
        brand: product.brand
      });
    }
  };

  const handleLanguageChange = (lang: 'fr' | 'ar') => setCurrentLanguage(lang);

  if (!isHydrated) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              {currentLanguage === 'fr' ? 'Catalogue' : 'الكتالوج'}
            </h1>
            <SearchBar
              currentLanguage={currentLanguage}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={() => {}}
              suggestions={MOCK_SUGGESTIONS}
              isLoading={isSearchLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block">
              <FilterPanel
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                currentLanguage={currentLanguage}
                onFiltersChange={setActiveFilters}
                onClearFilters={() => {}}
                isOpen={false}
                onClose={() => {}}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button onClick={() => setIsFilterPanelOpen(true)} className="lg:hidden bg-primary text-white px-4 py-2 rounded">
                  Filtres
                </button>
                <div className="flex-1">
                  <SortControls
                    currentLanguage={currentLanguage}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={filteredAndSortedProducts.length}
                  />
                </div>
              </div>

              <ProductGrid
                products={filteredAndSortedProducts}
                currentLanguage={currentLanguage}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                onToggleWishlist={() => {}}
                wishlistItems={wishlistItems}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {isFilterPanelOpen && (
             <div className="lg:hidden fixed inset-0 z-50 bg-white p-4">
                <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4 text-red-500 font-bold">Fermer</button>
                <FilterPanel
                  filterOptions={FILTER_OPTIONS}
                  activeFilters={activeFilters}
                  currentLanguage={currentLanguage}
                  onFiltersChange={setActiveFilters}
                  onClearFilters={() => {}}
                  isOpen={true}
                  onClose={() => setIsFilterPanelOpen(false)}
                />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductCatalogInteractive;