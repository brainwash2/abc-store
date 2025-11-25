'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AddBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Review Hardware',
    image_url: '',
    excerpt: '',
    content: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-generate slug
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { error } = await supabase.from('posts').insert([{
      ...formData,
      slug: `${slug}-${Date.now()}` // Ensure uniqueness
    }]);

    if (error) {
      alert('Erreur: ' + error.message);
    } else {
      router.push('/admin/blog');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 bg-white rounded-lg border hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouvel Article</h1>
          <p className="text-slate-500 text-sm">Rédigez du contenu pour attirer des clients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Titre de l'article</label>
            <input required name="title" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Ex: Les meilleurs PC Portables 2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
            <select name="category" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none">
              <option>Review Hardware</option>
              <option>Guide d'achat</option>
              <option>Tutoriel</option>
              <option>Actualité Tech</option>
              <option>Offres Spéciales</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image de couverture (URL)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3 text-slate-400" size={20} />
            <input required name="image_url" onChange={handleChange} className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="https://images.unsplash.com/..." />
          </div>
          <p className="text-xs text-slate-500 mt-1">Utilisez Unsplash pour des images gratuites.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Extrait (Résumé SEO)</label>
          <textarea required name="excerpt" rows={2} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Une courte description qui apparaîtra sur Google..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Contenu de l'article</label>
          <textarea required name="content" rows={12} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Écrivez votre contenu ici..." />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
            Publier l'article
          </button>
        </div>

      </form>
    </div>
  );
}