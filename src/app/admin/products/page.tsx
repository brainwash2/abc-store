'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts(); // Refresh list
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Gestion des Produits</h1>
        <Link href="/admin/products/add">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={20} /> Ajouter un Produit
          </button>
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Image</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Nom</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Catégorie</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Prix</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Stock</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center">Aucun produit trouvé.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  </td>
                  <td className="p-4 font-medium text-slate-900">{product.name_fr}</td>
                  <td className="p-4 text-slate-500">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{product.price.toLocaleString()} DZD</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} en stock
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}