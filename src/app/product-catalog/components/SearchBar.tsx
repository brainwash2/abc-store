'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchSuggestion {
  id: string;
  text: { fr: string; ar: string };
  type: 'product' | 'category' | 'brand';
  count?: number;
}

interface SearchBarProps {
  currentLanguage: 'fr' | 'ar';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
}

const SearchBar = ({
  currentLanguage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  suggestions,
  isLoading
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const showSuggestions = isFocused && searchQuery.length > 0 && suggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          onSearchSubmit(selectedSuggestion.text[currentLanguage]);
          setIsFocused(false);
          setSelectedSuggestionIndex(-1);
        } else {
          onSearchSubmit(searchQuery);
          setIsFocused(false);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchSubmit(suggestion.text[currentLanguage]);
    setIsFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
    setIsFocused(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'product':
        return 'CubeIcon';
      case 'category':
        return 'TagIcon';
      case 'brand':
        return 'BuildingStorefrontIcon';
      default:
        return 'MagnifyingGlassIcon';
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return currentLanguage === 'fr' ? 'Produit' : 'منتج';
      case 'category':
        return currentLanguage === 'fr' ? 'Catégorie' : 'فئة';
      case 'brand':
        return currentLanguage === 'fr' ? 'Marque' : 'علامة تجارية';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentLanguage === 'fr' ?'Rechercher des produits, marques, catégories...' :'البحث عن المنتجات والعلامات التجارية والفئات...'
            }
            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-12 rtl:pr-12 rtl:pl-4 py-3 text-sm border border-border rounded-lg bg-input focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
          />
          {isLoading && (
            <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            </div>
          )}
          {!isLoading && searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setIsFocused(false);
                searchRef.current?.focus();
              }}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-smooth"
            >
              <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 max-h-80 overflow-y-auto"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-smooth ${
                  index === selectedSuggestionIndex ? 'bg-muted' : ''
                }`}
              >
                <Icon 
                  name={getSuggestionIcon(suggestion.type) as any} 
                  size={16} 
                  className="text-muted-foreground flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-popover-foreground truncate">
                    {suggestion.text[currentLanguage]}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {getSuggestionTypeLabel(suggestion.type)}
                    </span>
                    {suggestion.count && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count} {currentLanguage === 'fr' ? 'résultats' : 'نتيجة'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Icon 
                  name="ArrowUpRightIcon" 
                  size={14} 
                  className="text-muted-foreground flex-shrink-0" 
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;