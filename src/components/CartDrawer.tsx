'use client';

import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { siteConfig } from '@/config/site';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isCartOpen, toggleCart, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = siteConfig.freeShippingThreshold || 50; 
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    toggleCart();
    router.push('/checkout');
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-[100] transition-opacity"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[#0F172A] shadow-[0_0_30px_rgba(6,182,212,0.15)] border-l border-slate-800 z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Tu Carrito ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button 
            onClick={toggleCart} 
            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-cyan-900/20 px-6 py-4 border-b border-cyan-500/20 text-xs text-cyan-300 font-medium">
          {remaining > 0 ? (
            <p>
              ¡Agrega <span className="font-bold text-yellow-400">{siteConfig.currencySymbol}{remaining.toFixed(2)}</span> más para obtener envío gratis!
            </p>
          ) : (
            <p className="font-bold text-yellow-400">🎉 ¡Felicitaciones! Calificas para envío gratis.</p>
          )}
          <div className="w-full bg-[#1E293B] h-1.5 rounded-full mt-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-[#1E293B] border border-slate-700 rounded-full flex items-center justify-center text-slate-500 mb-4 shadow-lg">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-medium text-slate-300">Tu carrito está vacío</p>
              <p className="text-sm text-slate-500 mt-1">Explora el catálogo y descubre innovación.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-slate-800 pb-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#070b14] border border-slate-700 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1">{item.title}</p>
                      <p className="text-sm font-extrabold text-yellow-400 mt-0.5">
                        {siteConfig.currencySymbol}{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-[#1E293B]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-100 w-7 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 pb-8 sm:pb-6 bg-[#0F172A] border-t border-slate-800">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-200">{siteConfig.currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Envío</span>
              <span className="font-medium text-cyan-400">
                {remaining === 0 && items.length > 0 ? 'GRATIS' : 'Calculado en el checkout'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-base font-bold text-slate-100">
              <span>Total Final</span>
              <span className="text-yellow-400 text-xl">{siteConfig.currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full py-4 rounded-xl font-black bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer text-base uppercase tracking-wider"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </>
  );
}