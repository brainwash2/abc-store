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
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('products').insert({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
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
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} className="w-full border p-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full border p-2" />
        <button disabled={saving} className="bg-primary text-white px-4 py-2 rounded">{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}
