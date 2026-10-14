'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { productService } from '@/services/productService';
import type { Product } from '@/data/products';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel';
import { OffersCarousel } from '@/components/OffersCarousel';
import { CategoryDock } from '@/components/CategoryDock';

const categoryDbNames = ['ENERGIA', 'HERRAMIENTAS', 'SONIDO', 'COMPUTACIONYCONECTIVIDAD', 'AUTOMOTRIZ'];

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const trendsRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await productService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Todos') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => (p.category || '').toUpperCase().includes(selectedCategory));
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) localStorage.setItem('todomax_ref', ref);
  }, [searchParams]);

  const getProductsByCategory = (dbCategoryName: string) => {
    return products.filter(p => (p.category || '').toUpperCase().includes(dbCategoryName)).slice(0, 3);
  };

  const getCatalogProducts = () => {
    return products.slice(0, 18);
  };

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: -450, behavior: 'smooth' });
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) ref.current.scrollBy({ left: 450, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pb-24 w-full overflow-x-hidden">
      
      {/* SECCIÓN HERO A ANCHO TOTAL */}
      <section className="w-full relative pt-16 md:pt-20">
        <HeroCarousel />
        
        {/* CategoryDock acoplado sin encimarse ni tapar información */}
        <div className="relative -mt-8 md:-mt-10 z-30 px-3 md:px-8">
           <CategoryDock onSelect={(id) => setSelectedCategory(id)} selectedCategory={selectedCategory} />
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL A PANTALLA ANCHA COMPLETA (Sin márgenes muertos) */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 mt-12 md:mt-20">
        
        {/* SECCIÓN: NOVEDADES Y TENDENCIAS */}
        <main className="w-full mb-16 md:mb-24">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
                {selectedCategory === 'Todos' ? 'Últimas Tendencias' : `Novedades en ${selectedCategory}`}
              </h2>
            </div>
            <Link
              href={`/catalogo${selectedCategory !== 'Todos' ? `?category=${selectedCategory}` : ''}`}
              className="text-xs md:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Ver catálogo completo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#0F172A]/50 border border-slate-800 rounded-3xl w-full">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm md:text-base text-slate-400 font-medium">Sincronizando inventario oficial...</p>
            </div>
          ) : (
            <div className="relative group w-full">
              <button
                onClick={() => scrollLeft(trendsRef)}
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-3.5 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                ref={trendsRef}
                className="flex overflow-x-auto gap-4 md:gap-6 snap-x pb-6 scrollbar-hide px-1 scroll-smooth w-full"
              >
                {(selectedCategory === 'Todos' ? categoryDbNames : [selectedCategory]).map((cat) => {
                  const catProducts = getProductsByCategory(cat);
                  return catProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group flex-shrink-0 snap-start block"
                    >
                      <div className="bg-[#0F172A]/90 rounded-2xl md:rounded-3xl shadow-lg border border-slate-800/90 transition-all duration-300 h-full flex flex-col w-[190px] sm:w-[220px] md:w-[270px] hover:-translate-y-1.5 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                        <div className="relative w-full aspect-[4/5] bg-[#070b14] overflow-hidden rounded-t-2xl md:rounded-t-3xl flex items-center justify-center">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                          />
                          {product.badge && (
                            <div className={`absolute top-3 left-3 text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${
                              product.badge === 'Agotado'
                                ? 'bg-red-500/90 text-white'
                                : 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50'
                            }`}>
                              {product.badge}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-3.5 md:p-5">
                          <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-wider mb-1 line-clamp-1">
                            {product.category}
                          </span>
                          <h3 className="text-xs md:text-sm font-semibold text-slate-200 mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug">
                            {product.title}
                          </h3>
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/60">
                            <span className="text-base md:text-xl font-black text-yellow-400">
                              {siteConfig.currencySymbol}{product.price.toFixed(2)}
                            </span>
                            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#1E293B] border border-slate-700 text-cyan-400 text-[10px] md:text-xs font-bold rounded-xl group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">
                              Ver
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ));
                })}
              </div>

              <button
                onClick={() => scrollRight(trendsRef)}
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-3.5 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </main>

        {/* SECCIÓN: CARRUSEL DE OFERTAS */}
        <section className="w-full mb-16 md:mb-24">
          <OffersCarousel />
        </section>

        {/* SECCIÓN: CATÁLOGO GENERAL EXPANSIVO */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase">
              Catálogo General
            </h2>
            <Link
              href="/catalogo"
              className="text-xs md:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Ver los 2.600+ equipos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative group w-full">
            <button
              onClick={() => scrollLeft(catalogRef)}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-3.5 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              ref={catalogRef}
              className="flex overflow-x-auto gap-4 md:gap-6 snap-x pb-6 scrollbar-hide px-1 scroll-smooth w-full"
            >
              {getCatalogProducts().map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group flex-shrink-0 snap-start block"
                >
                  <div className="bg-[#0F172A]/90 rounded-2xl md:rounded-3xl shadow-lg border border-slate-800/90 transition-all duration-300 h-full flex flex-col w-[190px] sm:w-[220px] md:w-[270px] hover:-translate-y-1.5 hover:border-cyan-500/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                    <div className="relative w-full aspect-[4/5] bg-[#070b14] overflow-hidden rounded-t-2xl md:rounded-t-3xl flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                      />
                      {product.badge && (
                        <div className={`absolute top-3 left-3 text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${
                          product.badge === 'Agotado'
                            ? 'bg-red-500/90 text-white'
                            : 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50'
                        }`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-3.5 md:p-5">
                      <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-wider mb-1 line-clamp-1">
                        {product.category}
                      </span>
                      <h3 className="text-xs md:text-sm font-semibold text-slate-200 mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/60">
                        <span className="text-base md:text-xl font-black text-yellow-400">
                          {siteConfig.currencySymbol}{product.price.toFixed(2)}
                        </span>
                        <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#1E293B] border border-slate-700 text-cyan-400 text-[10px] md:text-xs font-bold rounded-xl group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">
                          Ver
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => scrollRight(catalogRef)}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-[#0F172A] border border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-3.5 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#0B1120] text-slate-400">Cargando plataforma...</div>}>
      <HomeContent />
    </Suspense>
  );
}