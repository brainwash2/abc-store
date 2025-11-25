'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Gestion du Blog</h1>
        <Link href="/admin/blog/add">
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
            <Plus size={20} /> Écrire un article
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">Image</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Titre</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Catégorie</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Chargement...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center">Aucun article.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <img src={post.image_url} className="w-16 h-10 object-cover rounded" alt="" />
                  </td>
                  <td className="p-4 font-bold text-slate-900">{post.title}</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{post.category}</span></td>
                  <td className="p-4 text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye size={18} />
                    </Link>
                    <button onClick={() => deletePost(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
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