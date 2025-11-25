'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image_url: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (data) {
        setFormData(data);
        setLoading(false);
      } else {
        alert("Article introuvable");
        router.push('/admin/blog');
      }
    };
    fetchPost();
  }, [params.id, router]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('posts')
      .update(formData)
      .eq('id', params.id);

    if (error) {
      alert('Erreur: ' + error.message);
    } else {
      router.push('/admin/blog');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 bg-white rounded-lg border hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Modifier l'article</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
              <option>Review Hardware</option>
              <option>Guide d'achat</option>
              <option>Tutoriel</option>
              <option>Actualité Tech</option>
              <option>News</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
          <input required name="image_url" value={formData.image_url} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Extrait</label>
          <textarea required name="excerpt" rows={2} value={formData.excerpt} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Contenu</label>
          <textarea required name="content" rows={12} value={formData.content} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm" />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-violet-700 transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}