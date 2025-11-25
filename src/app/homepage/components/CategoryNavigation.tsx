import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Category {
  id: number;
  name: {fr: string;ar: string;};
  description: {fr: string;ar: string;};
  image: string;
  alt: string;
  icon: string;
  productCount: number;
  href: string;
}

interface CategoryNavigationProps {
  currentLanguage: 'fr' | 'ar';
}

const CategoryNavigation = ({ currentLanguage }: CategoryNavigationProps) => {
  const categories: Category[] = [
    {
      id: 1,
      name: { fr: "Ordinateurs Portables", ar: "أجهزة الكمبيوتر المحمولة" },
      description: { fr: "MacBook, Dell, HP et plus", ar: "ماك بوك، ديل، إتش بي والمزيد" },
      image: "https://images.unsplash.com/photo-1639283758775-e7f0616aa156?auto=format&fit=crop&w=600&q=80",
      alt: "Modern silver laptop computer open displaying desktop interface",
      icon: "ComputerDesktopIcon",
      productCount: 156,
      href: "/product-catalog?category=laptops"
    },
    {
      id: 2,
      name: { fr: "Smartphones", ar: "الهواتف الذكية" },
      description: { fr: "iPhone, Samsung, Xiaomi", ar: "آيفون، سامسونج، شاومي" },
      image: "https://images.unsplash.com/photo-1659459425078-f3b924971893?auto=format&fit=crop&w=600&q=80",
      alt: "Collection of modern smartphones displaying colorful home screens",
      icon: "DevicePhoneMobileIcon",
      productCount: 89,
      href: "/product-catalog?category=smartphones"
    },
    {
      id: 3,
      name: { fr: "Tablettes", ar: "الأجهزة اللوحية" },
      description: { fr: "iPad, Samsung Galaxy Tab", ar: "آيباد، سامسونج جالاكسي تاب" },
      image: "https://images.unsplash.com/photo-1548874468-025d0edfdf8b?auto=format&fit=crop&w=600&q=80",
      alt: "White tablet device displaying colorful app interface with stylus pen",
      icon: "DeviceTabletIcon",
      productCount: 45,
      href: "/product-catalog?category=tablets"
    },
    {
      id: 4,
      name: { fr: "Accessoires", ar: "الإكسسوارات" },
      description: { fr: "Écouteurs, Claviers, Souris", ar: "سماعات، لوحات مفاتيح، فأرة" },
      image: "https://images.unsplash.com/photo-1722040456443-c644d014d43f?auto=format&fit=crop&w=600&q=80",
      alt: "White wireless earbuds and charging case on marble surface with tech accessories",
      icon: "SpeakerWaveIcon",
      productCount: 234,
      href: "/product-catalog?category=accessories"
    },
    {
      id: 5,
      name: { fr: "Gaming", ar: "الألعاب" },
      description: { fr: "PC Gaming, Consoles, Périphériques", ar: "كمبيوتر ألعاب، أجهزة، ملحقات" },
      image: "https://images.unsplash.com/photo-1630360828954-5d4d60f86e2f?auto=format&fit=crop&w=600&q=80",
      alt: "Gaming setup with RGB keyboard, mouse and colorful LED lighting",
      icon: "PuzzlePieceIcon",
      productCount: 78,
      href: "/product-catalog?category=gaming"
    },
    {
      id: 6,
      name: { fr: "Composants PC", ar: "مكونات الكمبيوتر" },
      description: { fr: "Processeurs, RAM, Cartes Graphiques", ar: "معالجات، ذاكرة، كروت الرسوميات" },
      image: "https://images.unsplash.com/photo-1591949150520-3d29b3cb62bf?auto=format&fit=crop&w=600&q=80",
      alt: "Computer motherboard with CPU, RAM modules and electronic components",
      icon: "CpuChipIcon",
      productCount: 167,
      href: "/product-catalog?category=components"
    }
  ];

  const content = {
    fr: {
      title: "Catégories Populaires",
      subtitle: "Explorez nos gammes de produits informatiques",
      products: "produits"
    },
    ar: {
      title: "الفئات الشائعة",
      subtitle: "استكشف مجموعات منتجاتنا التقنية",
      products: "منتج"
    }
  };

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            {content[currentLanguage].title}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {content[currentLanguage].subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevation-2 transition-smooth"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <AppImage
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Icon */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-3 bg-card/90 backdrop-blur-sm rounded-lg">
                  <Icon name={category.icon as any} size={24} className="text-primary" />
                </div>
                
                {/* Product Count */}
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full text-sm font-medium">
                  {category.productCount} {content[currentLanguage].products}
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-smooth">
                  {category.name[currentLanguage]}
                </h3>
                
                <p className="text-text-secondary mb-4">
                  {category.description[currentLanguage]}
                </p>
                
                <div className="flex items-center text-primary font-medium">
                  <span className="mr-2 rtl:mr-0 rtl:ml-2">
                    {currentLanguage === 'fr' ? 'Explorer' : 'استكشاف'}
                  </span>
                  <Icon
                    name="ArrowRightIcon"
                    size={16}
                    className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-smooth" 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <Link
            href="/product-catalog"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-blue-700 transition-smooth"
          >
            {currentLanguage === 'fr' ? 'Voir Toutes les Catégories' : 'عرض جميع الفئات'}
            <Icon name="ArrowRightIcon" size={20} className="ml-2 rtl:ml-0 rtl:mr-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryNavigation;