'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Eye, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.")) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', id);
    
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      fetchPosts(); // Refresh the list
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Blog & Actualités</h1>
          <p className="text-slate-500">Gérez vos articles pour le SEO et l'engagement client</p>
        </div>
        <Link href="/admin/blog/add">
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Plus size={20} /> Nouvel Article
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
              <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin" /> Chargement des articles...
                  </div>
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">
                  Aucun article trouvé. Commencez à écrire !
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-10 rounded overflow-hidden bg-slate-200 border border-slate-200">
                      <img 
                        src={post.image_url || 'https://via.placeholder.com/150'} 
                        className="w-full h-full object-cover" 
                        alt=""
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Img')}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-900 max-w-xs truncate" title={post.title}>
                    {post.title}
                  </td>
                  <td className="p-4">
                    <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded text-xs font-medium border border-violet-200">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      {/* View Button (Public Link) */}
                      <Link href={`/blog`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Voir sur le site">
                        <Eye size={18} />
                      </Link>

                      {/* Edit Button */}
                      <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Modifier">
                        <Edit size={18} />
                      </Link>

                      {/* Delete Button */}
                      <button onClick={() => deletePost(post.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Supprimer">
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