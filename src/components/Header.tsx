'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  SearchIcon, ShoppingCart, User, X, Menu, Home as HomeIcon,
  Zap, Wrench, Speaker, Monitor, Hammer, 
  Car, Home, PenTool, Camera, Award, Grid3x3
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { productService } from '@/services/productService';
import type { Product } from '@/data/products';
import { siteConfig } from '@/config/site';
import AuthModal from './AuthModal';

function HeaderContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggleCart, items } = useCartStore();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await productService.getProducts();
      setAllProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      ).slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const outsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(target);
      const outsideDesktop = !desktopSearchRef.current || !desktopSearchRef.current.contains(target);
      if (outsideMobile && outsideDesktop) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
    window.dispatchEvent(new CustomEvent('bk-menu-toggle', { detail: { isOpen } }));
  };

  useEffect(() => {
    if (searchParams?.get('auth') === 'register') {
      setIsAuthOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  if (pathname?.startsWith('/admin')) return null;

  const categories = [
    { id: 'ENERGIA', name: 'Energía y Solar', icon: Zap },
    { id: 'HERRAMIENTAS', name: 'Herramientas', icon: Wrench },
    { id: 'FERRETERIA', name: 'Ferretería', icon: Hammer },
    { id: 'SONIDO', name: 'Audio y Sonido', icon: Speaker },
    { id: 'COMPUTACIONYCONECTIVIDAD', name: 'Computación y Redes', icon: Monitor },
    { id: 'AUTOMOTRIZ', name: 'Automotriz', icon: Car },
    { id: 'HOGARYOFICINA', name: 'Hogar y Oficina', icon: Home },
    { id: 'SERVICIOTECNICO', name: 'Servicio Técnico', icon: PenTool },
    { id: 'CREADORDECONTENIDO', name: 'Creador de Contenido', icon: Camera },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800">
        <div className="flex h-16 md:h-20 items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 w-full gap-4">
          
          {/* LOGO IZQUIERDA */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic pr-0.5">
                BK
              </span>
              <span className="hidden sm:inline-block text-xs md:text-sm font-bold text-slate-200 tracking-widest mt-0.5">
                ELECTRONICS
              </span>
            </Link>

            {/* Buscador Móvil */}
            <div className="relative flex-1 sm:hidden" ref={mobileSearchRef}>
              <input
                type="search"
                placeholder="Buscar equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim()) setIsSearching(true); }}
                className="w-full h-10 pl-9 pr-3 bg-[#0F172A] border border-slate-700 rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                      className="flex items-center gap-2.5 p-2.5 hover:bg-[#1E293B]"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#070b14] overflow-hidden flex-shrink-0 border border-slate-700 flex items-center justify-center">
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-white truncate">{product.title}</h4>
                        <span className="text-[9px] text-cyan-400 uppercase">{product.category}</span>
                      </div>
                      <span className="text-xs font-black text-yellow-400">
                        {siteConfig.currencySymbol}{product.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* NAVEGACIÓN Y BUSCADOR CENTRO (PC) - DISTRIBUIDOS A ANCHO COMPLETO */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12 flex-1 justify-center px-6" ref={desktopSearchRef}>
            <nav className="flex items-center gap-6 text-xs xl:text-sm font-bold uppercase tracking-wider text-slate-300 flex-shrink-0">
              <Link href="/" className={`hover:text-cyan-400 transition-colors ${pathname === '/' ? 'text-cyan-400' : ''}`}>
                Inicio
              </Link>
              <Link href="/catalogo" className={`hover:text-cyan-400 transition-colors ${pathname === '/catalogo' ? 'text-cyan-400' : ''}`}>
                Catálogo
              </Link>
              <Link href="/afiliados" className={`hover:text-cyan-400 transition-colors ${pathname === '/afiliados' ? 'text-cyan-400' : ''}`}>
                Embajadores
              </Link>
            </nav>

            <div className="relative w-full max-w-lg xl:max-w-xl">
              <input
                type="search"
                placeholder="Buscar equipos, repuestos, herramientas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim()) setIsSearching(true); }}
                className="w-full h-11 pl-11 pr-4 bg-[#0F172A] border border-slate-700 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 p-3 hover:bg-[#1E293B] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#070b14] overflow-hidden flex-shrink-0 border border-slate-700 flex items-center justify-center">
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
                        <span className="text-[10px] text-cyan-400 uppercase">{product.category}</span>
                      </div>
                      <span className="text-xs font-black text-yellow-400">
                        {siteConfig.currencySymbol}{product.price.toFixed(2)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACCESOS DERECHA */}
          <div className="flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-cyan-400"
              title="Mi Cuenta"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-bold">Cuenta</span>
            </button>

            <button
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors relative cursor-pointer shadow-md"
              aria-label="Abrir carrito"
            >
              <span className="hidden sm:block text-xs font-bold text-cyan-400">Carrito</span>
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleMenuToggle(true)}
              className="p-2.5 text-slate-300 hover:text-cyan-400 transition-colors bg-[#0F172A] rounded-xl border border-slate-700 shadow-md cursor-pointer flex items-center justify-center"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] backdrop-blur-sm transition-opacity"
          onClick={() => handleMenuToggle(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-80 max-w-[85vw] h-screen bg-[#0F172A] border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-[110] shadow-2xl flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0B1120]">
          <span className="text-xs font-black text-cyan-400 tracking-widest uppercase">
            Menú {siteConfig.storeName}
          </span>
          <button
            onClick={() => handleMenuToggle(false)}
            className="p-2 bg-slate-800 hover:bg-red-500/20 rounded-full text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-hide">
          <div className="space-y-3 border-b border-slate-800 pb-6">
            <Link
              href="/"
              onClick={() => handleMenuToggle(false)}
              className="flex items-center gap-3 w-full text-base font-bold text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <HomeIcon className="w-5 h-5 text-cyan-500" /> Inicio
            </Link>
            <Link
              href="/catalogo"
              onClick={() => handleMenuToggle(false)}
              className="flex items-center gap-3 w-full text-base font-bold text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Grid3x3 className="w-5 h-5 text-cyan-500" /> Catálogo Completo
            </Link>
            <Link
              href="/afiliados"
              onClick={() => handleMenuToggle(false)}
              className="flex items-center gap-3 w-full text-base font-bold text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-cyan-500" /> Ser Embajador
            </Link>
            <button
              onClick={() => { setIsAuthOpen(true); handleMenuToggle(false); }}
              className="flex items-center gap-3 w-full text-base font-bold text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer text-left"
            >
              <User className="w-5 h-5 text-cyan-500" /> Mi Cuenta / Registro
            </button>
          </div>
          
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Departamentos
            </p>
            <div className="grid grid-cols-1 gap-2.5 pb-12">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={idx}
                    href={`/catalogo?category=${cat.id}`}
                    onClick={() => handleMenuToggle(false)}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-300 hover:text-cyan-400 bg-[#0B1120] p-3 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all"
                  >
                    <Icon className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-16 md:h-20 w-full bg-[#0B1120] border-b border-slate-800" />}>
      <HeaderContent />
    </Suspense>
  );
}