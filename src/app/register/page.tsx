'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Loader2, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName } // Save name in metadata
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // 2. Success! Redirect to login
      alert("Compte créé avec succès ! Connectez-vous.");
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">Créer un compte</h1>
          <p className="text-slate-500">Rejoignez ABC Informatique</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Mohamed Benali"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="nom@exemple.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}