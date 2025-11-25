'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import HeroBanner from './HeroBanner';
import ProductShowcase from './ProductShowcase';
import CategoryNavigation from './CategoryNavigation';
import TechNewsSection from './TechNewsSection';
import NewsletterSection from './NewsletterSection';
import CurrencyConverter from './CurrencyConverter';

const HomepageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [cartItemCount, setCartItemCount] = useState(3);

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
    console.log('Account menu clicked');
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
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick}
      />
      
      {/* Main Content */}
      <main className="pt-16">
        <HeroBanner currentLanguage={currentLanguage} />
        
        {/* 
           NOTE: I reordered these slightly for better UX flow:
           Hero -> Categories -> Featured Products -> News -> Newsletter 
        */}
        <CategoryNavigation currentLanguage={currentLanguage} />
        <ProductShowcase currentLanguage={currentLanguage} />
        <TechNewsSection currentLanguage={currentLanguage} />
        <NewsletterSection />  
        <CurrencyConverter currentLanguage={currentLanguage} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ABC Informatique</h3>
              <p className="text-slate-300 text-sm">
                {currentLanguage === 'fr' ? 'Votre partenaire de confiance pour tous vos besoins informatiques en Algérie.' : 'شريكك الموثوق لجميع احتياجاتك التقنية في الجزائر.'}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">
                {currentLanguage === 'fr' ? 'Liens Rapides' : 'روابط سريعة'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="/product-catalog" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Produits' : 'المنتجات'}
                </a></li>
                <li><a href="/order-details" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Mes Commandes' : 'طلباتي'}
                </a></li>
                <li><a href="#" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Support' : 'الدعم'}
                </a></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold">
                {currentLanguage === 'fr' ? 'Catégories' : 'الفئات'}
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="/product-catalog?category=laptops" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Ordinateurs' : 'أجهزة الكمبيوتر'}
                </a></li>
                <li><a href="/product-catalog?category=smartphones" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Smartphones' : 'الهواتف الذكية'}
                </a></li>
                <li><a href="/product-catalog?category=accessories" className="hover:text-white transition-smooth">
                  {currentLanguage === 'fr' ? 'Accessoires' : 'الإكسسوارات'}
                </a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold">
                {currentLanguage === 'fr' ? 'Contact' : 'اتصل بنا'}
              </h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>📧 contact@abc-informatique.dz</p>
                <p>📞 +213 21 XX XX XX</p>
                <p>📍 Alger, Algérie</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>
              © {new Date().getFullYear()} ABC Informatique. 
              {currentLanguage === 'fr' ? ' Tous droits réservés.' : ' جميع الحقوق محفوظة.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageInteractive;