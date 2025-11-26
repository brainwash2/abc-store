'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_fr: '',
    price: '',
    category: 'Laptops',
    brand: '', // Added Brand
    stock: '1',
    image_url: '',
    description_fr: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('products').insert([
      {
        name: formData.name_fr, // Map name_fr to name
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand, // Save Brand
        stock: Number(formData.stock),
        image_url: formData.image_url,
        description: formData.description_fr,
        is_new: true
      }
    ]);

    setLoading(false);

    if (error) {
      alert('Erreur: ' + error.message);
    } else {
      router.push('/admin/products');
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white rounded-lg border hover:bg-slate-50 text-slate-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Ajouter un nouveau produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nom du produit</label>
            <input required name="name_fr" onChange={handleChange} placeholder="Ex: HP Pavilion 15" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {/* 👇 ADDED BRAND FIELD */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Marque (Brand)</label>
            <input required name="brand" onChange={handleChange} placeholder="Ex: HP, Dell, Apple" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Prix (DZD)</label>
            <input required type="number" name="price" onChange={handleChange} placeholder="120000" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
            <input required type="number" name="stock" onChange={handleChange} placeholder="10" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
            <select name="category" onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Gaming">Gaming</option>
              <option value="Accessoires">Accessoires</option>
              <option value="Components">Composants</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
          <input required name="image_url" onChange={handleChange} placeholder="https://..." className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea name="description_fr" onChange={handleChange} rows={4} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <hr className="border-slate-100" />

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}