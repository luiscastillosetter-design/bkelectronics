'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { productService } from '@/services/productService';
import type { Product } from '@/data/products';
import { Zap, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

const realCategories = [
  { id: 'Todos', name: 'Catálogo Completo' },
  { id: 'ENERGIA', name: 'Energía y Solar' },
  { id: 'HERRAMIENTAS', name: 'Herramientas' },
  { id: 'FERRETERIA', name: 'Ferretería' },
  { id: 'SONIDO', name: 'Audio y Sonido' },
  { id: 'COMPUTACIONYCONECTIVIDAD', name: 'Computación y Redes' },
  { id: 'AUTOMOTRIZ', name: 'Automotriz' },
  { id: 'HOGARYOFICINA', name: 'Hogar y Oficina' },
  { id: 'SERVICIOTECNICO', name: 'Servicio Técnico' },
  { id: 'CREADORDECONTENIDO', name: 'Creador de Contenido' },
];

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    if (products.length > 0) {
      if (!categoryParam || categoryParam.toLowerCase() === 'todos') {
        setActiveCategory('Todos');
        setFilteredProducts(products);
      } else {
        setActiveCategory(categoryParam);
        const filtered = products.filter((p) => {
          const prodCat = (p.category || '').toUpperCase();
          const targetCat = categoryParam.toUpperCase();
          return prodCat.includes(targetCat) || targetCat.includes(prodCat);
        });
        setFilteredProducts(filtered);
      }
    }
  }, [searchParams, products]);

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'Todos') {
      router.push('/catalogo');
    } else {
      router.push(`/catalogo?category=${categoryId}`);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-[#0B1120] min-h-screen pb-28 md:pb-16 pt-[100px] md:pt-[120px] text-slate-100">
      
      {/* Banner Superior Estilo BK Electronics */}
      <div className="w-full px-4 md:px-8 xl:px-12 mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-800 p-6 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Inventario Oficial en Vivo
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">
              Catálogo <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">BK Electronics</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
              Explora más de 2.600 equipos técnicos, energía solar, audio profesional y repuestos con despacho a nivel nacional.
            </p>
          </div>
        </div>
      </div>

      {/* Navegador de Categorías */}
      <div className="w-full px-4 md:px-8 xl:px-12 mb-8">
        <div className="relative flex items-center group">
          <button 
            onClick={() => scrollCategories('left')}
            className="absolute -left-3 md:-left-4 z-10 bg-[#0F172A] border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] p-2 md:p-3 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div 
            ref={categoryScrollRef}
            className="flex overflow-x-auto gap-2.5 pb-3 pt-1 px-1 scrollbar-hide w-full scroll-smooth"
          >
            {realCategories.map((cat) => (
              <button
                key={`pill-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeCategory.toUpperCase() === cat.id.toUpperCase()
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400'
                    : 'bg-[#0F172A] text-slate-300 border border-slate-800 hover:border-cyan-500/50 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollCategories('right')}
            className="absolute -right-3 md:-right-4 z-10 bg-[#0F172A] border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] p-2 md:p-3 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Grilla de Productos */}
      <div className="w-full px-4 md:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
          <p className="text-xs md:text-sm font-medium text-slate-400">
            Mostrando <span className="font-bold text-cyan-400">{filteredProducts.length}</span> productos
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Sincronizando inventario...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#0F172A]/50 rounded-3xl border border-slate-800 text-center px-4 w-full max-w-4xl mx-auto">
            <Layers className="w-14 h-14 text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">No hay productos en esta categoría</h3>
            <button
              onClick={() => handleCategoryClick('Todos')}
              className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl mt-4 cursor-pointer"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 md:gap-5">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group h-full block">
                <div className="bg-[#0F172A]/90 border border-slate-800/90 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:-translate-y-1 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  
                  {/* Ícono pequeño, centrado y con padding (object-contain p-8) */}
                  <div className="relative w-full aspect-[4/5] bg-[#070b14] overflow-hidden flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    
                    {product.badge && (
                      <div className={`absolute top-2.5 left-2.5 text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-2.5 rounded-md shadow-sm uppercase tracking-wider ${
                        product.badge === 'Agotado'
                          ? 'bg-red-500/90 text-white'
                          : 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50'
                      }`}>
                        {product.badge}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-3">
                    <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-wider mb-1 line-clamp-1">
                      {product.category}
                    </span>
                    <h3 className="text-[11px] md:text-xs font-semibold text-slate-200 mb-2 line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                      {product.title}
                    </h3>
                    <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-800/60">
                      <p className="text-sm md:text-base font-black text-yellow-400">
                        {siteConfig.currencySymbol}{product.price.toFixed(2)}
                      </p>
                      <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300">
                        #{product.id}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#0B1120] text-slate-400">Cargando Catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}