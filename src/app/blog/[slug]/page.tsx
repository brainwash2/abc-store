'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Header isAuthenticated={false} />
      
      <article className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Retour aux articles
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          Pourquoi la RTX 4060 est la reine du 1080p
        </h1>

        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <User size={16} /> Par Mohamed Benali
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} /> 22 Nov 2025
          </div>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs">Hardware</span>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1591488320449-011701bb6704" 
          alt="Cover" 
          className="w-full h-[400px] object-cover rounded-2xl mb-10 shadow-lg"
        />

        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-slate-600 mb-6">
            Avec l'arrivée des nouvelles générations de jeux, la demande pour des cartes graphiques abordables mais puissantes n'a jamais été aussi forte. Nous avons testé la RTX 4060.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Performance brute</h2>
          <p className="text-slate-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">DLSS 3.0 : Le game changer</h2>
          <p className="text-slate-600 mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>

        {/* AFFILIATE / SHOP LINK SECTION */}
        <div className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/10 text-center">
          <h3 className="text-xl font-bold text-primary mb-2">Ce produit vous intéresse ?</h3>
          <p className="text-slate-600 mb-6">Obtenez le meilleur prix sur notre boutique.</p>
          <Link href="/product-catalog">
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform hover:scale-105">
              Acheter la RTX 4060
            </button>
          </Link>
        </div>
      </article>
    </div>
  );
}