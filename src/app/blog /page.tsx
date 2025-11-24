import React from 'react';
import Header from '@/components/common/Header';
import Link from 'next/link';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Pourquoi la RTX 4060 est la reine du 1080p",
      category: "Review Hardware",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
      excerpt: "Nous avons testé la dernière carte de NVIDIA sur 20 jeux...",
      slug: "review-rtx-4060"
    },
    {
      id: 2,
      title: "Top 5 des Cryptos à surveiller en 2025",
      category: "Crypto & Web3",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
      excerpt: "Le marché bouge. Voici les projets qui construisent le futur...",
      slug: "top-crypto-2025"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header isAuthenticated={false} />
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2">ABC Tech Blog 🚀</h1>
        <p className="text-slate-500 mb-12">Actualités, Reviews et Web3.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                 <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                 <span className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                   {article.category}
                 </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{article.title}</h2>
                <p className="text-slate-500 text-sm mb-4">{article.excerpt}</p>
                <span className="text-primary font-bold text-sm flex items-center gap-2">
                  Lire l'article <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* GOOGLE ADSENSE PLACEHOLDER */}
        <div className="mt-12 w-full h-32 bg-slate-200 flex items-center justify-center text-slate-400 rounded-xl border-2 border-dashed border-slate-300">
          Espace Publicitaire (Google Adsense)
        </div>
      </main>
    </div>
  );
}