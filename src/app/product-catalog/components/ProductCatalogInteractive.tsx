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

const ProductCatalogInteractive = () => {
  // --- STATE ---
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  
  // --- REAL DATA STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicFilters, setDynamicFilters] = useState<any>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000000 },
    specifications: { ram: [], storage: [], processor: [] }
  });

  const addItem = useCartStore((state) => state.addItem);

  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    priceRange: { min: 0, max: 1000000 },
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
        // Fallback if name_fr/ar columns don't exist yet
        name: { fr: item.name, ar: item.name }, 
        price: item.price,
        originalPrice: item.price * 1.1, // Fake original price for demo
        image: item.image_url,
        alt: item.name,
        rating: 4.5,
        reviewCount: 10,
        category: item.category,
        brand: item.brand || 'Generic',
        inStock: item.stock > 0,
        isNew: true,
        specifications: item.specifications || {}
      }));
      
      setProducts(formattedProducts);
      calculateDynamicFilters(formattedProducts);
    }
    setIsLoading(false);
  };

  // 3. CALCULATE FILTERS DYNAMICALLY
  const calculateDynamicFilters = (items: Product[]) => {
    const brands: Record<string, number> = {};
    const categories: Record<string, number> = {};
    let maxPrice = 0;

    items.forEach(p => {
      // Count Brands
      brands[p.brand] = (brands[p.brand] || 0) + 1;
      // Count Categories
      categories[p.category] = (categories[p.category] || 0) + 1;
      // Find Max Price
      if (p.price > maxPrice) maxPrice = p.price;
    });

    setDynamicFilters({
      categories: Object.keys(categories).map(cat => ({
        id: cat,
        name: { fr: cat, ar: cat }, // You can map translations here if needed
        count: categories[cat]
      })),
      brands: Object.keys(brands).map(b => ({
        id: b,
        name: b,
        count: brands[b]
      })),
      priceRange: { min: 0, max: maxPrice },
      specifications: { ram: [], storage: [], processor: [] } // Can extend this later
    });
  };

  // 4. GENERATE SEARCH SUGGESTIONS DYNAMICALLY
  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    
    // Find matching products
    const productMatches = products
      .filter(p => p.name.fr.toLowerCase().includes(query))
      .slice(0, 3)
      .map(p => ({
        id: p.id.toString(),
        text: p.name,
        type: 'product' as const
      }));

    return productMatches;
  }, [searchQuery, products]);

  // 5. FILTERING LOGIC
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.fr.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((product) => activeFilters.categories.includes(product.category));
    }

    // Brand Filter
    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter((product) => activeFilters.brands.includes(product.brand));
    }

    // Price Filter
    filtered = filtered.filter(p => 
      p.price >= activeFilters.priceRange.min && 
      p.price <= activeFilters.priceRange.max
    );

    // Sorting
    switch (sortBy) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name_asc': filtered.sort((a, b) => a.name[currentLanguage].localeCompare(b.name[currentLanguage])); break;
    }

    return filtered;
  }, [products, searchQuery, activeFilters, sortBy, currentLanguage]);

  // HANDLERS
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id.toString(),
        name: currentLanguage === 'fr' ? product.name.fr : product.name.ar,
        price: product.price,
        image: product.image,
        quantity: 1
      } as any);
      alert("Ajouté au panier !");
    }
  };

  const handleLanguageChange = (lang: 'fr' | 'ar') => setCurrentLanguage(lang);

  if (!isHydrated) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className="pt-24">
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
              suggestions={searchSuggestions}
              isLoading={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block">
              <FilterPanel
                filterOptions={dynamicFilters}
                activeFilters={activeFilters}
                currentLanguage={currentLanguage}
                onFiltersChange={setActiveFilters}
                onClearFilters={() => setActiveFilters({
                  categories: [], brands: [], priceRange: { min: 0, max: 1000000 },
                  ram: [], storage: [], processor: []
                })}
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
             <div className="lg:hidden fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
                <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4 text-red-500 font-bold">Fermer</button>
                <FilterPanel
                  filterOptions={dynamicFilters}
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