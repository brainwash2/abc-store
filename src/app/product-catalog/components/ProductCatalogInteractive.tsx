'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/common/Header';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProductGrid from './ProductGrid';
import Icon from '@/components/ui/AppIcon';

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

const ProductCatalogInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Mock data
  const mockProducts: Product[] = [
  {
    id: 1,
    name: {
      fr: "Ordinateur portable HP Pavilion 15.6\" Intel Core i5",
      ar: "حاسوب محمول HP Pavilion 15.6 بوصة Intel Core i5"
    },
    price: 89000,
    originalPrice: 95000,
    image: "https://images.unsplash.com/photo-1680688364322-d3f7c8dd7f2a",
    alt: "Silver HP Pavilion laptop with 15.6 inch screen displaying desktop interface on white background",
    rating: 4.5,
    reviewCount: 128,
    category: "laptops",
    brand: "HP",
    inStock: true,
    isNew: true,
    discount: 6,
    specifications: {
      ram: "8GB",
      storage: "512GB SSD",
      processor: "Intel Core i5"
    }
  },
  {
    id: 2,
    name: {
      fr: "Smartphone Samsung Galaxy A54 128GB",
      ar: "هاتف ذكي Samsung Galaxy A54 128GB"
    },
    price: 45000,
    image: "https://images.unsplash.com/photo-1729410036447-c25903db59e3",
    alt: "Black Samsung Galaxy smartphone showing home screen with colorful app icons",
    rating: 4.3,
    reviewCount: 89,
    category: "smartphones",
    brand: "Samsung",
    inStock: true,
    specifications: {
      storage: "128GB",
      processor: "Exynos 1380"
    }
  },
  {
    id: 3,
    name: {
      fr: "Écran Dell UltraSharp 27\" 4K USB-C",
      ar: "شاشة Dell UltraSharp 27 بوصة 4K USB-C"
    },
    price: 65000,
    originalPrice: 72000,
    image: "https://images.unsplash.com/photo-1615750260764-643b0f01a0af",
    alt: "Modern Dell UltraSharp 27-inch monitor displaying colorful desktop wallpaper on adjustable stand",
    rating: 4.7,
    reviewCount: 156,
    category: "monitors",
    brand: "Dell",
    inStock: true,
    discount: 10,
    specifications: {}
  },
  {
    id: 4,
    name: {
      fr: "Clavier mécanique Logitech MX Keys",
      ar: "لوحة مفاتيح ميكانيكية Logitech MX Keys"
    },
    price: 12000,
    image: "https://images.unsplash.com/photo-1616836417940-8898b8ef794d",
    alt: "Black Logitech MX Keys mechanical keyboard with backlit keys on dark surface",
    rating: 4.6,
    reviewCount: 203,
    category: "accessories",
    brand: "Logitech",
    inStock: false,
    specifications: {}
  },
  {
    id: 5,
    name: {
      fr: "Souris gaming Razer DeathAdder V3",
      ar: "فأرة ألعاب Razer DeathAdder V3"
    },
    price: 8500,
    image: "https://images.unsplash.com/photo-1727417453138-7d8efdd70fb3",
    alt: "Black Razer gaming mouse with RGB lighting and ergonomic design on gaming mousepad",
    rating: 4.4,
    reviewCount: 167,
    category: "accessories",
    brand: "Razer",
    inStock: true,
    specifications: {}
  },
  {
    id: 6,
    name: {
      fr: "Tablette iPad Air 10.9\" 256GB Wi-Fi",
      ar: "جهاز لوحي iPad Air 10.9 بوصة 256GB Wi-Fi"
    },
    price: 75000,
    image: "https://images.unsplash.com/photo-1697193440168-9607275e6a0f",
    alt: "Silver iPad Air tablet displaying colorful home screen with various app icons",
    rating: 4.8,
    reviewCount: 245,
    category: "tablets",
    brand: "Apple",
    inStock: true,
    isNew: true,
    specifications: {
      storage: "256GB"
    }
  },
  {
    id: 7,
    name: {
      fr: "Casque audio Sony WH-1000XM5 sans fil",
      ar: "سماعات Sony WH-1000XM5 لاسلكية"
    },
    price: 32000,
    originalPrice: 38000,
    image: "https://images.unsplash.com/photo-1583305727488-61f82c7eae4b",
    alt: "Black Sony wireless headphones with noise cancellation technology on white background",
    rating: 4.9,
    reviewCount: 312,
    category: "audio",
    brand: "Sony",
    inStock: true,
    discount: 16,
    specifications: {}
  },
  {
    id: 8,
    name: {
      fr: "PC de bureau ASUS ROG Strix GT15",
      ar: "حاسوب مكتبي ASUS ROG Strix GT15"
    },
    price: 125000,
    image: "https://images.unsplash.com/photo-1653972826383-8502fa09d679",
    alt: "Black ASUS ROG gaming desktop computer with RGB lighting and transparent side panel",
    rating: 4.6,
    reviewCount: 89,
    category: "desktops",
    brand: "ASUS",
    inStock: true,
    specifications: {
      ram: "16GB",
      storage: "1TB SSD",
      processor: "Intel Core i7"
    }
  }];


  const mockSearchSuggestions: SearchSuggestion[] = [
  { id: '1', text: { fr: 'Ordinateur portable', ar: 'حاسوب محمول' }, type: 'category', count: 45 },
  { id: '2', text: { fr: 'HP Pavilion', ar: 'HP Pavilion' }, type: 'product', count: 12 },
  { id: '3', text: { fr: 'Samsung', ar: 'Samsung' }, type: 'brand', count: 23 },
  { id: '4', text: { fr: 'Écran 4K', ar: 'شاشة 4K' }, type: 'category', count: 18 },
  { id: '5', text: { fr: 'Clavier mécanique', ar: 'لوحة مفاتيح ميكانيكية' }, type: 'category', count: 31 }];


  const filterOptions: FilterOptions = {
    categories: [
    { id: 'laptops', name: { fr: 'Ordinateurs portables', ar: 'حواسيب محمولة' }, count: 45 },
    { id: 'desktops', name: { fr: 'Ordinateurs de bureau', ar: 'حواسيب مكتبية' }, count: 23 },
    { id: 'smartphones', name: { fr: 'Smartphones', ar: 'هواتف ذكية' }, count: 67 },
    { id: 'tablets', name: { fr: 'Tablettes', ar: 'أجهزة لوحية' }, count: 34 },
    { id: 'monitors', name: { fr: 'Écrans', ar: 'شاشات' }, count: 56 },
    { id: 'accessories', name: { fr: 'Accessoires', ar: 'إكسسوارات' }, count: 89 },
    { id: 'audio', name: { fr: 'Audio', ar: 'صوتيات' }, count: 42 }],

    brands: [
    { id: 'hp', name: 'HP', count: 34 },
    { id: 'dell', name: 'Dell', count: 28 },
    { id: 'samsung', name: 'Samsung', count: 45 },
    { id: 'apple', name: 'Apple', count: 23 },
    { id: 'asus', name: 'ASUS', count: 31 },
    { id: 'logitech', name: 'Logitech', count: 19 },
    { id: 'razer', name: 'Razer', count: 15 },
    { id: 'sony', name: 'Sony', count: 22 }],

    priceRange: { min: 0, max: 200000 },
    specifications: {
      ram: [
      { value: '4GB', count: 23 },
      { value: '8GB', count: 45 },
      { value: '16GB', count: 34 },
      { value: '32GB', count: 12 }],

      storage: [
      { value: '128GB', count: 34 },
      { value: '256GB', count: 45 },
      { value: '512GB SSD', count: 38 },
      { value: '1TB SSD', count: 28 },
      { value: '2TB', count: 15 }],

      processor: [
      { value: 'Intel Core i3', count: 23 },
      { value: 'Intel Core i5', count: 45 },
      { value: 'Intel Core i7', count: 34 },
      { value: 'AMD Ryzen 5', count: 28 },
      { value: 'AMD Ryzen 7', count: 19 }]

    }
  };

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    priceRange: { min: filterOptions.priceRange.min, max: filterOptions.priceRange.max },
    ram: [],
    storage: [],
    processor: []
  });

  useEffect(() => {
    setIsHydrated(true);

    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar' | null;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }

    // Load saved cart and wishlist
    const savedCart = localStorage.getItem('cartItems');
    const savedWishlist = localStorage.getItem('wishlistItems');

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
      product.name.fr.toLowerCase().includes(query) ||
      product.name.ar.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
      activeFilters.categories.includes(product.category)
      );
    }

    // Apply brand filter
    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter((product) =>
      activeFilters.brands.includes(product.brand.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter((product) =>
    product.price >= activeFilters.priceRange.min &&
    product.price <= activeFilters.priceRange.max
    );

    // Apply specification filters
    if (activeFilters.ram.length > 0) {
      filtered = filtered.filter((product) =>
      product.specifications.ram && activeFilters.ram.includes(product.specifications.ram)
      );
    }

    if (activeFilters.storage.length > 0) {
      filtered = filtered.filter((product) =>
      product.specifications.storage && activeFilters.storage.includes(product.specifications.storage)
      );
    }

    if (activeFilters.processor.length > 0) {
      filtered = filtered.filter((product) =>
      product.specifications.processor && activeFilters.processor.includes(product.specifications.processor)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name[currentLanguage].localeCompare(b.name[currentLanguage]));
        break;
      default: // relevance
        break;
    }

    return filtered;
  }, [mockProducts, searchQuery, activeFilters, sortBy, currentLanguage]);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setIsSearchLoading(query.length > 0);

    // Simulate search delay
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 300);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);

    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleAddToCart = (productId: number) => {
    const newCartItems = [...cartItems, productId];
    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  };

  const handleToggleWishlist = (productId: number) => {
    const newWishlistItems = wishlistItems.includes(productId) ?
    wishlistItems.filter((id) => id !== productId) :
    [...wishlistItems, productId];

    setWishlistItems(newWishlistItems);
    localStorage.setItem('wishlistItems', JSON.stringify(newWishlistItems));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      priceRange: { min: filterOptions.priceRange.min, max: filterOptions.priceRange.max },
      ram: [],
      storage: [],
      processor: []
    });
    setSearchQuery('');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted" />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-12 bg-muted rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="h-96 bg-muted rounded" />
              <div className="lg:col-span-3 space-y-6">
                <div className="h-16 bg-muted rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) =>
                  <div key={i} className="h-80 bg-muted rounded" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItems.length}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={() => window.location.href = '/shopping-cart'}
        onAccountClick={() => {}} />


      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              {currentLanguage === 'fr' ? 'Catalogue de Produits' : 'كتالوج المنتجات'}
            </h1>
            
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                currentLanguage={currentLanguage}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
                suggestions={mockSearchSuggestions}
                isLoading={isSearchLoading} />

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block">
              <FilterPanel
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                currentLanguage={currentLanguage}
                onFiltersChange={setActiveFilters}
                onClearFilters={handleClearFilters}
                isOpen={false}
                onClose={() => {}} />

            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <button
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-smooth">

                  <Icon name="FunnelIcon" size={18} />
                  {currentLanguage === 'fr' ? 'Filtres' : 'المرشحات'}
                  {activeFilters.categories.length + activeFilters.brands.length + activeFilters.ram.length + activeFilters.storage.length + activeFilters.processor.length > 0 &&
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                      {activeFilters.categories.length + activeFilters.brands.length + activeFilters.ram.length + activeFilters.storage.length + activeFilters.processor.length}
                    </span>
                  }
                </button>

                <div className="flex-1">
                  <SortControls
                    currentLanguage={currentLanguage}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={filteredAndSortedProducts.length} />

                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={filteredAndSortedProducts}
                currentLanguage={currentLanguage}
                viewMode={viewMode}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistItems={wishlistItems}
                isLoading={isLoading} />

            </div>
          </div>

          {/* Mobile Filter Panel */}
          <FilterPanel
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            currentLanguage={currentLanguage}
            onFiltersChange={setActiveFilters}
            onClearFilters={handleClearFilters}
            isOpen={isFilterPanelOpen}
            onClose={() => setIsFilterPanelOpen(false)} />

        </div>
      </main>
    </div>);

};

export default ProductCatalogInteractive;