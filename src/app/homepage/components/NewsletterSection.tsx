'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase.from('subscribers').insert([{ email }]);
      if (error) {
        if (error.code === '23505') throw new Error("Vous êtes déjà inscrit !");
        throw error;
      }
      setStatus('success');
      setEmail('');
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'inscription");
      setStatus('error');
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-violet-900 shadow-2xl">
        
        {/* Decorative Background Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative z-10 p-12 md:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Rejoignez +5000 passionnés de Tech
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Ne manquez aucune <br/> nouveauté Tech & Crypto
          </h2>
          
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir nos guides exclusifs, 
            nos tests de matériel et nos meilleures offres directement dans votre boîte mail.
          </p>

          {status === 'success' ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl max-w-md mx-auto animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Inscription confirmée !</h3>
              <p className="text-blue-100 mb-6">Merci de rejoindre l'élite. Visitez notre blog en attendant.</p>
              <Link href="/blog">
                <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 mx-auto">
                  Voir les articles <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-white text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-white/30 shadow-xl"
                />
              </div>
              <button 
                disabled={status === 'loading'}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl disabled:opacity-80 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : "S'abonner"}
              </button>
            </form>
          )}
          
          <p className="mt-6 text-sm text-blue-200/60">
            Pas de spam. Désabonnement en un clic.
          </p>
        </div>
      </div>
    </section>
  );
}