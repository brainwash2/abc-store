'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import HeroBanner from './HeroBanner';
import ProductShowcase from './ProductShowcase';
import CategoryNavigation from './CategoryNavigation';
import TechNewsSection from './TechNewsSection';
import NewsletterSection from './NewsletterSection';
import CurrencyConverter from './CurrencyConverter';
import { useCartStore } from '@/store/useCart'; // <--- Added Real Cart

const HomepageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  
  // Use Real Cart Count
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.length;

  useEffect(() => {
    setIsHydrated(true);
    
    // Load saved language preference
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar';
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
      }
    }
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    if (!isHydrated) return;
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  const handleCartClick = () => {
    window.location.href = '/shopping-cart';
  };

  const handleAccountClick = () => {
    window.location.href = '/user/dashboard';
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted"></div>
          <div className="h-96 bg-muted"></div>
          <div className="h-64 bg-background"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        cartItemCount={cartItemCount} // Now Real
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
      />
      
      {/* Main Content */}
      <main className="pt-16 flex-grow">
        <HeroBanner currentLanguage={currentLanguage} />
        
        <CategoryNavigation currentLanguage={currentLanguage} />
        <ProductShowcase currentLanguage={currentLanguage} />
        <TechNewsSection currentLanguage={currentLanguage} />
        <NewsletterSection />  
        <CurrencyConverter currentLanguage={currentLanguage} />
      </main>

      {/* 
          ❌ FOOTER REMOVED 
          It is now handled globally by src/app/layout.tsx 
      */}
    </div>
  );
};

export default HomepageInteractive;