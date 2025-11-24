'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Link from 'next/link';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Pourquoi la RTX 4060 est la reine du 1080p",
      category: "Review Hardware",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
      excerpt: "Nous avons testé la dernière carte de NVIDIA sur 20 jeux. Voici les résultats surprenants...",
      slug: "review-rtx-4060",
      date: "22 Nov 2025"
    },
    {
      id: 2,
      title: "Top 5 des Cryptos à surveiller en 2025",
      category: "Crypto & Web3",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800&auto=format&fit=crop",
      excerpt: "Le marché bouge. Voici les projets qui construisent le futur de la finance décentralisée.",
      slug: "top-crypto-2025",
      date: "20 Nov 2025"
    },
    {
      id: 3,
      title: "Guide: Comment monter son PC Gamer",
      category: "Tutoriel",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
      excerpt: "Pas à pas : du choix des composants à l'installation de Windows. Un guide complet.",
      slug: "guide-pc-gamer",
      date: "18 Nov 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header isAuthenticated={false} />
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Actualités Tech & Crypto 🚀</h1>
          <p className="text-slate-500 text-lg">Les dernières nouvelles du monde technologique.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                 <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                 <span className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                   {article.category}
                 </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-slate-400 mb-2">{article.date}</div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h2>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{article.excerpt}</p>
                <span className="text-primary font-bold text-sm flex items-center gap-2 mt-auto">
                  Lire l'article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}