'use client';

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from '@/store/useCart';
import Link from "next/link";

export default function CartSheet() {
  const { items, removeItem, total } = useCartStore();

  const changeQuantity = (id: string, delta: number) => {
    useCartStore.setState({
      items: items.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      ),
    });
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Mon Panier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-slate-500">Votre panier est vide.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect fill=%22%23e2e8f0%22 width=%2264%22 height=%2264%22/%3E%3Ctext x=%2232%22 y=%2236%22 font-family=%22sans-serif%22 font-size=%2210%22 fill=%22%2394a3b8%22 text-anchor=%22middle%22%3ENo image%3C/text%3E%3C/svg%3E'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <p className="text-primary font-bold">{item.price.toLocaleString()} DZD</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className="p-1 text-slate-600 hover:bg-slate-50"
                        aria-label="Diminuer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-2 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        className="p-1 text-slate-600 hover:bg-slate-50"
                        aria-label="Augmenter"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{total().toLocaleString()} DZD</span>
            </div>
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-primary">Procéder au paiement</Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
