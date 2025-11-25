'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface NewsArticle {
  id: number;
  title: {fr: string;ar: string;};
  excerpt: {fr: string;ar: string;};
  image: string;
  alt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: {fr: string;ar: string;};
  href: string;
}

interface TechNewsSectionProps {
  currentLanguage: 'fr' | 'ar';
}

const TechNewsSection = ({ currentLanguage }: TechNewsSectionProps) => {
  const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: {
      fr: "Apple dévoile ses nouveaux MacBook Pro avec puce M3",
      ar: "آبل تكشف عن أجهزة MacBook Pro الجديدة بمعالج M3"
    },
    excerpt: {
      fr: "Les nouveaux MacBook Pro offrent des performances exceptionnelles avec la puce M3 révolutionnaire d'Apple, redéfinissant l'informatique portable.",
      ar: "أجهزة MacBook Pro الجديدة تقدم أداءً استثنائياً مع معالج M3 الثوري من آبل، مما يعيد تعريف الحوسبة المحمولة."
    },
    image: "https://images.unsplash.com/photo-1610567177617-501bb5264cb1?auto=format&fit=crop&w=600&q=80",
    alt: "Silver MacBook Pro laptop displaying Apple logo on screen in modern office setting",
    author: "Sarah Johnson",
    publishedAt: "2025-11-15",
    readTime: 5,
    category: { fr: "Ordinateurs", ar: "أجهزة الكمبيوتر" },
    href: "/blog"
  },
  {
    id: 2,
    title: {
      fr: "Samsung Galaxy S24 Ultra : L'IA au service de la photographie",
      ar: "Samsung Galaxy S24 Ultra: الذكاء الاصطناعي في خدمة التصوير"
    },
    excerpt: {
      fr: "Samsung intègre l'intelligence artificielle avancée dans son flagship pour révolutionner l'expérience photographique mobile.",
      ar: "سامسونج تدمج الذكاء الاصطناعي المتقدم في هاتفها الرائد لثورة في تجربة التصوير المحمول."
    },
    image: "https://images.unsplash.com/photo-1611282104572-e0b0e9a707f7?auto=format&fit=crop&w=600&q=80",
    alt: "Black Samsung smartphone displaying camera interface with AI photography features",
    author: "Ahmed Benali",
    publishedAt: "2025-11-14",
    readTime: 4,
    category: { fr: "Smartphones", ar: "الهواتف الذكية" },
    href: "/blog"
  },
  {
    id: 3,
    title: {
      fr: "L'avenir du gaming : RTX 4090 vs RTX 5080",
      ar: "مستقبل الألعاب: RTX 4090 مقابل RTX 5080"
    },
    excerpt: {
      fr: "Comparaison détaillée des dernières cartes graphiques NVIDIA pour les passionnés de gaming et de création de contenu.",
      ar: "مقارنة مفصلة لأحدث كروت الرسوميات من NVIDIA لعشاق الألعاب وإنشاء المحتوى."
    },
    image: "https://images.unsplash.com/photo-1636036761875-b3fe95053f5b?auto=format&fit=crop&w=600&q=80",
    alt: "High-end gaming computer setup with RGB lighting and multiple monitors displaying game graphics",
    author: "Marc Dubois",
    publishedAt: "2025-11-13",
    readTime: 7,
    category: { fr: "Gaming", ar: "الألعاب" },
    href: "/blog"
  }];


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (currentLanguage === 'fr') {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('ar-DZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const content = {
    fr: {
      title: "Actualités Tech",
      subtitle: "Restez informé des dernières tendances technologiques",
      readMore: "Lire la suite",
      minRead: "min de lecture",
      viewAll: "Voir Toutes les Actualités"
    },
    ar: {
      title: "أخبار التقنية",
      subtitle: "ابق على اطلاع بأحدث الاتجاهات التقنية",
      readMore: "اقرأ المزيد",
      minRead: "دقيقة قراءة",
      viewAll: "عرض جميع الأخبار"
    }
  };

  return (
    <section className="py-16 bg-background">
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {newsArticles.map((article) =>
          <article key={article.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-elevation-2 transition-smooth group">
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <AppImage
                src={article.image}
                alt={article.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />

                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {article.category[currentLanguage]}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name="UserIcon" size={16} />
                    <span>{article.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Icon name="CalendarDaysIcon" size={16} />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Icon name="ClockIcon" size={16} />
                    <span>{article.readTime} {content[currentLanguage].minRead}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-smooth">
                  {article.title[currentLanguage]}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary mb-4 line-clamp-3">
                  {article.excerpt[currentLanguage]}
                </p>

                {/* Read More Link */}
                <Link
                href={article.href}
                className="inline-flex items-center text-primary font-medium hover:text-blue-700 transition-smooth">

                  {content[currentLanguage].readMore}
                  <Icon name="ArrowRightIcon" size={16} className="ml-1 rtl:ml-0 rtl:mr-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-smooth" />
                </Link>
              </div>
            </article>
          )}
        </div>

        {/* View All News Button - FIXED LINK */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-blue-700 transition-smooth">

            {content[currentLanguage].viewAll}
            <Icon name="ArrowRightIcon" size={20} className="ml-2 rtl:ml-0 rtl:mr-2" />
          </Link>
        </div>
      </div>
    </section>);

};

export default TechNewsSection;