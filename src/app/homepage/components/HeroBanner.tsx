import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface HeroBannerProps {
  currentLanguage: 'fr' | 'ar';
}

const HeroBanner = ({ currentLanguage }: HeroBannerProps) => {
  const content = {
    fr: {
      title: "Découvrez les Dernières Technologies",
      subtitle: "Ordinateurs, smartphones et accessoires de qualité professionnelle",
      cta: "Voir les Produits",
      badge: "Nouveau"
    },
    ar: {
      title: "اكتشف أحدث التقنيات",
      subtitle: "أجهزة كمبيوتر وهواتف ذكية وإكسسوارات بجودة احترافية",
      cta: "عرض المنتجات",
      badge: "جديد"
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
              <Icon name="SparklesIcon" size={16} className="mr-2 rtl:mr-0 rtl:ml-2" />
              {content[currentLanguage].badge}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {content[currentLanguage].title}
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed">
              {content[currentLanguage].subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/product-catalog"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-amber-400 transition-smooth">

                {content[currentLanguage].cta}
                <Icon name="ArrowRightIcon" size={20} className="ml-2 rtl:ml-0 rtl:mr-2" />
              </Link>
              
              <Link
                href="/product-catalog"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-smooth">

                <Icon name="PlayIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
                {currentLanguage === 'fr' ? 'Voir Démo' : 'مشاهدة العرض'}
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-elevation-3 p-8">
              <AppImage
                src="https://images.unsplash.com/photo-1713470812508-c276021f1b93"
                alt="Modern laptop computer with colorful screen display showing technology interface"
                className="w-full h-64 object-cover rounded-lg" />

              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-elevation-2">
                <div className="text-sm font-medium">
                  {currentLanguage === 'fr' ? 'Livraison Gratuite' : 'توصيل مجاني'}
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-elevation-2">
                <div className="text-sm font-medium text-primary">
                  {currentLanguage === 'fr' ? 'Garantie 2 ans' : 'ضمان سنتين'}
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-amber-400 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroBanner;