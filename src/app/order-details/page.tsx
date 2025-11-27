'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckCircle, Clock, Package, Truck, Home, ArrowRight } from 'lucide-react';
import Header from '@/components/common/Header';

// Component to read URL params safely
const OrderContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (data) setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Commande introuvable</h1>
      <p className="text-slate-500 mb-6">Le numéro de commande est invalide.</p>
      <Link href="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
        Retour à l'accueil
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header cartItemCount={0} isAuthenticated={true} />
      
      <main className="pt-24 max-w-3xl mx-auto px-4">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6 border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Merci pour votre commande !</h1>
          <p className="text-slate-500 text-lg">
            Votre commande <span className="font-mono font-bold text-slate-700">#{order.id.slice(0, 8)}</span> a été confirmée.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Détails de la commande</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {order.status}
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Client</p>
                <p className="font-medium text-slate-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="font-medium text-slate-900">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 my-4"></div>

            {/* Items List */}
            <div>
              <p className="text-sm text-slate-500 mb-4">Articles</p>
              <div className="space-y-4">
                {order.items && Array.isArray(order.items) ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 line-clamp-1">{item.name || item.title}</p>
                          <p className="text-xs text-slate-500">Qté: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-700">
                        {(item.price * item.quantity).toLocaleString()} DA
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">Détails des articles non disponibles.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 my-4"></div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-slate-600">Total Payé</span>
              <span className="text-2xl font-bold text-primary">
                {order.total_amount.toLocaleString()} DZD
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/product-catalog" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium">
            <ArrowRight size={20} className="rotate-180" /> Continuer vos achats
          </Link>
        </div>
      </main>
    </div>
  );
};

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OrderContent />
    </Suspense>
  );
}