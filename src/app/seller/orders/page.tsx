'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: items } = await supabase
        .from('order_items')
        .select('order_id, quantity, price_at_purchase, seller_id, orders(*)')
        .eq('seller_id', user.id);

      if (items) {
        const grouped = items.reduce((acc: any, item: any) => {
          const orderId = item.order_id;
          if (!acc[orderId]) acc[orderId] = { ...item.orders, items: [] };
          acc[orderId].items.push(item);
          return acc;
        }, {});
        const sorted = Object.values(grouped).sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sorted);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map((order: any) => (
        <div key={order.id} className="border p-4 mb-2 rounded">
          <p>Order #{order.id.slice(0,8)}</p>
          <p>Total: {order.total_amount} DZD</p>
          <p>Status: {order.status}</p>
          <ul>
            {order.items.map((item: any, idx: number) => (
              <li key={idx}>Product {item.product_id} x {item.quantity} = {item.price_at_purchase * item.quantity} DZD</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
