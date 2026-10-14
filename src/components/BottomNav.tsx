'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid3x3, ShoppingBag, Zap, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import AuthModal from './AuthModal';

export default function BottomNav() {
  const { items, toggleCart, isCartOpen } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleMenuState = (e: CustomEvent) => {
      setIsMenuOpen(e.detail.isOpen);
    };
    window.addEventListener('bk-menu-toggle' as any, handleMenuState);
    return () => window.removeEventListener('bk-menu-toggle' as any, handleMenuState);
  }, []);

  // Ocultar en el panel Admin o cuando el menú lateral o el carrito están abiertos
  if (pathname?.startsWith('/admin') || isMenuOpen || isCartOpen) return null;

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800 py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl mx-auto flex items-center justify-around">
          
          <button
            onClick={handleHomeClick}
            className={`flex flex-col items-center gap-1 p-2 transition-colors active:scale-95 cursor-pointer bg-transparent border-none ${
              pathname === '/' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Inicio</span>
          </button>

          <Link
            href="/catalogo"
            className={`flex flex-col items-center gap-1 p-2 transition-colors active:scale-95 cursor-pointer ${
              pathname === '/catalogo' ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
            <span className="text-[10px] font-bold">Catálogo</span>
          </Link>

          <button
            onClick={() => toggleCart()}
            className="flex flex-col items-center justify-center -mt-6 mb-1 relative cursor-pointer"
            aria-label="Abrir carrito"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-[#0F172A] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#0F172A]">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </div>
          </button>

          <Link
            href="/#ofertas"
            className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-cyan-400 transition-colors active:scale-95 cursor-pointer"
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-bold">Ofertas</span>
          </Link>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-cyan-400 transition-colors active:scale-95 relative cursor-pointer bg-transparent border-none"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Cuenta</span>
          </button>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}