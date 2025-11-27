'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    brand: '', // Added Brand
    stock: 0,
    image_url: '',
    description: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', params.id).single();
      if (data) {
        setFormData({
          name: data.name || '',
          price: data.price || 0,
          category: data.category || 'Laptops',
          brand: data.brand || '', // Load Brand
          stock: data.stock || 0,
          image_url: data.image_url || '',
          description: data.description || ''
        });
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('products').update(formData).eq('id', params.id);
    if (!error) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert(error.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 hover:bg-slate-100 rounded-lg"><ArrowLeft /></Link>
        <h1 className="text-2xl font-bold">Modifier le Produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du produit</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          {/* 👇 ADDED BRAND FIELD */}
          <div>
            <label className="block text-sm font-medium mb-1">Marque</label>
            <input name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Ex: HP" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prix (DA)</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
              <option value="Laptops">Laptops</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Gaming">Gaming</option>
              <option value="Accessoires">Accessoires</option>
              <option value="Components">Composants</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={saving} className="w-full bg-primary text-white py-3 rounded-lg font-bold flex justify-center gap-2">
          {saving ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer
        </button>
      </form>
    </div>
  );
}