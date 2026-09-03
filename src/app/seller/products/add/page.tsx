'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Laptops',
    brand: '',
    stock: '1',
    image_url: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let image_url = form.image_url;
    if (imageFile) {
      const uploadForm = new FormData();
      uploadForm.append('file', imageFile);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });
      if (!res.ok) {
        alert('Image upload failed');
        setSaving(false);
        return;
      }
      const data = await res.json();
      image_url = data.url;
    }

    const { error } = await supabase.from('products').insert({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url,
      seller_id: user.id,
    });

    if (error) alert(error.message);
    else router.push('/seller/products');
    setSaving(false);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-2" />
        <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full border p-2" />
        <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full border p-2" />
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full border p-2">
          <option>Laptops</option>
          <option>Smartphones</option>
          <option>Gaming</option>
          <option>Accessoires</option>
          <option>Components</option>
        </select>
        <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} className="w-full border p-2" />
        <div>
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2" />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border p-2" />
        <button disabled={saving} className="bg-primary text-white px-4 py-2 rounded">{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}
