'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const deleteProduct = async (id: string | number) => {
    if (confirm('Delete?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button onClick={() => router.push('/seller/products/add')} className="bg-primary text-white px-4 py-2 rounded">Add Product</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
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
              <td className="p-2">
                <button onClick={() => deleteProduct(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
