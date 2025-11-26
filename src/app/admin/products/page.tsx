'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit, Eye, Search, Package, Minus } from 'lucide-react';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  // NEW: Quick Price Update Function
  const updatePrice = async (id: number, currentPrice: number, increment: boolean) => {
    const newPrice = increment ? currentPrice + 1000 : currentPrice - 1000;
    if (newPrice < 0) return;

    // Optimistic Update (Update UI immediately)
    setProducts(products.map(p => p.id === id ? { ...p, price: newPrice } : p));

    // Update DB
    await supabase.from('products').update({ price: newPrice }).eq('id', id);
  };

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Produits</h1>
          <p className="text-slate-500">Gérez votre catalogue ({products.length} produits)</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/admin/products/add">
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 whitespace-nowrap">
              <Plus size={20} /> Ajouter
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Produit</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Catégorie</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Prix (Rapide)</th>
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center">Chargement...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Aucun produit trouvé.</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Err')}
                        />
                      ) : (
                        <Package className="text-slate-400" />
                      )}
                    </div>
                    <span className="font-medium text-slate-900">{product.name || "Sans Nom"}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  
                  {/* 👇 NEW: Quick Price Controls */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updatePrice(product.id, product.price, false)}
                        className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                        title="-1000 DA"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-primary w-24 text-center">
                        {product.price ? product.price.toLocaleString() : 0} DZD
                      </span>
                      <button 
                        onClick={() => updatePrice(product.id, product.price, true)}
                        className="p-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                        title="+1000 DA"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/product-details/${product.id}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
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