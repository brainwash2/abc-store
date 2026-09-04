'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/ui/ImageUploader';

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Laptops',
    brand: '',
    stock: '1',
    description: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    async function loadDuplicate() {
      if (!duplicateId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('products')
        .select('name, price, category, brand, stock, description, image_url')
        .eq('id', duplicateId)
        .eq('seller_id', user.id)
        .single();

      if (data) {
        setForm({
          name: `${data.name} (copie)`,
          price: String(data.price),
          category: data.category || 'Laptops',
          brand: data.brand || '',
          stock: String(data.stock),
          description: data.description || '',
          image_url: data.image_url || '',
        });
        if (data.image_url) setImagePreview(data.image_url);
      }
    }
    loadDuplicate();
  }, [duplicateId]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Prix invalide';
    if (!form.stock || Number(form.stock) < 0) newErrors.stock = 'Stock invalide';
    if (!imageFile && !form.image_url) newErrors.image = "Ajoutez une image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrors({ general: 'Utilisateur non connecté' });
      setSaving(false);
      return;
    }

    let image_url = form.image_url;
    if (imageFile) {
      const uploadForm = new FormData();
      uploadForm.append('file', imageFile);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      if (!res.ok) {
        const err = await res.json();
        setErrors({ general: err.error || "Échec de l'envoi de l'image" });
        setSaving(false);
        return;
      }
      const data = await res.json();
      image_url = data.url;
    }

    const { error } = await supabase.from('products').insert({
      name: form.name,
      price: Number(form.price),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      description: form.description,
      image_url,
      seller_id: user.id,
    });

    if (error) {
      setErrors({ general: error.message });
    } else {
      router.push('/seller/products');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold mb-6">Ajouter un produit</h1>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du produit *</label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              clearError('name');
            }}
            className={`w-full border p-2 rounded-lg ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
            placeholder="Ex: PC Portable Dell XPS 15"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prix (DZD) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => {
                setForm({ ...form, price: e.target.value });
                clearError('price');
              }}
              className={`w-full border p-2 rounded-lg ${errors.price ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="0"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => {
                setForm({ ...form, stock: e.target.value });
                clearError('stock');
              }}
              className={`w-full border p-2 rounded-lg ${errors.stock ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 rounded-lg border-slate-300"
            >
              <option>Laptops</option>
              <option>Smartphones</option>
              <option>Gaming</option>
              <option>Accessoires</option>
              <option>Components</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marque</label>
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full border p-2 rounded-lg border-slate-300"
              placeholder="Ex: HP, Dell, Apple"
            />
          </div>
        </div>

        <ImageUploader
          onFileSelect={(file) => {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            clearError('image');
          }}
          onClear={() => {
            setImageFile(null);
            setImagePreview(null);
            setForm((prev) => ({ ...prev, image_url: '' }));
          }}
          previewUrl={imagePreview}
          error={errors.image}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border p-2 rounded-lg border-slate-300"
            placeholder="Décrivez le produit en quelques phrases"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer le produit'}
        </button>
      </form>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProductForm />
    </Suspense>
  );
}
