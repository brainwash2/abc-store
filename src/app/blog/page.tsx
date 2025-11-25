'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/common/Header';

export default function PublicBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header cartItemCount={0} isAuthenticated={false} currentLanguage="fr" onLanguageChange={() => {}} onCartClick={() => {}} onAccountClick={() => {}} />

      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Le Blog Tech</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Actualités et guides officiels de ABC Informatique.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-xl text-slate-400">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
                <div className="h-48 overflow-hidden relative bg-slate-200">
                  <img 
                    src={post.image_url || 'https://via.placeholder.com/800x400'} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image')}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-violet-700">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-violet-600">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  
                  {/* Link to the Single Article Page (We will build this next if needed) */}
                  <button className="inline-flex items-center gap-2 text-violet-600 font-bold text-sm hover:gap-3 transition-all">
                    Lire l'article <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}