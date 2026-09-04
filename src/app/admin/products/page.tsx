'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Produits</h1>
        <button
          onClick={() => router.push('/admin/products/add')}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Ajouter un produit
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">Nom</th>
            <th className="p-2">Prix</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => router.push(`/admin/products/add?duplicate=${p.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Dupliquer
                </button>
                <button
                  onClick={() => router.push(`/admin/products/edit/${p.id}`)}
                  className="text-orange-500 hover:underline"
                >
                  Modifier
                </button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
