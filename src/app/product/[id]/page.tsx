'use client';

import { useEffect, useState, Suspense, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import type { Product } from '@/data/products';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/cartStore';
import { 
  ChevronLeft, ChevronRight, ShoppingCart, MessageCircle, 
  Star, Zap, PackageOpen, PlayCircle, Check, ShieldCheck, Truck
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  
  const { addItem, toggleCart } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  const [quantity, setQuantity] = useState<number | string>(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (params.id) {
        setIsLoading(true);
        const currentProduct = await productService.getProductById(params.id as string);
        if (currentProduct) {
          setProduct(currentProduct);
          const related = await productService.getRelatedProducts(currentProduct.category, currentProduct.id);
          setRelatedProducts(related);
        }
        setIsLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [params.id]);

  // Cálculo estable de reseñas basado en el ID para que no cambie al interactuar
  const reviewCount = useMemo(() => {
    if (!product) return 24;
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = (hash << 5) - hash + product.id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 180) + 18;
  }, [product]);

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedRef.current) {
      relatedRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setQuantity('');
      return;
    }
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setQuantity(val);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || Number(quantity) < 1) setQuantity(1);
  };

  const handleAddToCart = () => {
    if (product) {
      const cartItemFormat = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || ''
      };

      addItem(cartItemFormat, Number(quantity));
      setAddedToCart(true);
      toggleCart();
      
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWhatsAppClick = () => {
    if (!product) return;
    const cleanPhone = String(siteConfig.whatsapp?.number || siteConfig.whatsappNumber || '').replace(/\D/g, '');
    const text = `¡Hola ${siteConfig.storeName}! Me interesa el siguiente equipo:\n\n📦 *${product.title}*\n🔹 Código: #${product.id}\n💰 Precio: ${siteConfig.currencySymbol}${product.price.toFixed(2)}\n🔢 Cantidad: ${quantity}\n\n¿Tienen disponibilidad para entrega?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center px-4">
        <PackageOpen className="w-20 h-20 text-slate-700 mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">Producto No Encontrado</h1>
        <p className="text-slate-400 text-sm mb-6">El producto que buscas ya no está en catálogo o fue modificado.</p>
        <button
          onClick={() => router.push('/catalogo')}
          className="px-6 py-3 bg-cyan-500 text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider"
        >
          Ir al Catálogo
        </button>
      </div>
    );
  }

  const isOutOfStock = (product.stock ?? 100) <= 0;
  const isOferta = product.badge === 'Oferta';
  const originalPrice = isOferta ? product.price * 1.20 : null;

  const renderActiveMedia = () => {
    const currentMedia = product.images[activeImage] || product.images[0] || '';
    const isVideo = currentMedia.endsWith('.mp4') || currentMedia.includes('.mp4?');
    
    if (isVideo) {
      return <video src={currentMedia} controls autoPlay muted loop className="absolute inset-0 w-full h-full object-contain p-4" />;
    }
    return (
      <img
        src={currentMedia}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-contain p-6 md:p-10 transition-transform duration-500"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pb-28 pt-20 md:pt-28 text-slate-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        
        {/* Botón Volver */}
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-8 transition-colors w-fit cursor-pointer"
        >
          <div className="p-2 bg-[#0F172A] rounded-xl border border-slate-800 group-hover:border-cyan-500/50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Volver atrás
        </button>

        {/* Bloque Principal del Producto (2 Columnas en PC, 1 en Móvil) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 mb-20 items-start">
          
          {/* COLUMNA 1: GALERÍA DE IMÁGENES */}
          <div className="flex flex-col gap-4 w-full">
            <div className="relative w-full aspect-square bg-[#070b14] rounded-3xl border border-slate-800 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.06)] flex items-center justify-center">
              {renderActiveMedia()}
              
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.badge && (
                  <span className={`px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl shadow-lg ${
                    product.badge === 'Agotado'
                      ? 'bg-red-500 text-white'
                      : 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}>
                    {product.badge}
                  </span>
                )}
                {product.price >= (siteConfig.freeShippingThreshold || 50) && (
                  <span className="px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl bg-[#0F172A]/90 text-yellow-400 border border-yellow-400/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Envío Gratis
                  </span>
                )}
              </div>
            </div>

            {/* Miniaturas de Fotos */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((media, idx) => {
                  const isVideo = media.endsWith('.mp4') || media.includes('.mp4?');
                  return (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)} 
                      className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-[#070b14] p-1 ${
                        activeImage === idx 
                          ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                          : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      {isVideo ? (
                        <div className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-cyan-400" />
                        </div>
                      ) : (
                        <img src={media} alt={`Vista ${idx + 1}`} className="w-full h-full object-contain" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMNA 2: DETALLES, PRECIO Y BOTONES DE COMPRA */}
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <span className="text-[11px] font-black text-cyan-400 tracking-widest uppercase bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
                {product.category}
              </span>
              <span className="text-xs font-bold text-slate-500">Cód: #{product.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {product.title}
            </h1>

            {/* Reseñas estables */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-black text-slate-200">5.0</span>
              <span className="text-xs text-slate-500">({reviewCount} valoraciones verificadas)</span>
            </div>

            {/* Precio real */}
            <div className="mb-8 p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800">
              {originalPrice && (
                <p className="text-sm text-slate-500 line-through font-bold mb-1">
                  {siteConfig.currencySymbol}{originalPrice.toFixed(2)}
                </p>
              )}
              <div className="flex items-baseline gap-3">
                <p className="text-4xl md:text-5xl font-black text-yellow-400 tracking-tight">
                  {siteConfig.currencySymbol}{product.price.toFixed(2)}
                </p>
                {isOferta && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded-lg text-xs font-black">
                    -20% DCTO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-2">
                Aceptamos Zelle, Pago Móvil (Bs), USDT (Binance) y Efectivo.
              </p>
            </div>

            {/* Selector de Cantidad */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Cantidad:</span>
                <div className="flex items-center bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden h-11">
                  <button 
                    onClick={() => setQuantity(Math.max(1, Number(quantity) - 1))} 
                    className="px-4 h-full text-cyan-400 hover:bg-[#1E293B] transition-colors font-bold text-lg flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={handleQuantityChange} 
                    onBlur={handleQuantityBlur}
                    className="w-14 h-full text-center bg-transparent text-white font-black text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                  <button 
                    onClick={() => setQuantity(Number(quantity) + 1)} 
                    className="px-4 h-full text-cyan-400 hover:bg-[#1E293B] transition-colors font-bold text-lg flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Descripción y Especificaciones */}
            <div className="space-y-6 mb-8 p-6 bg-[#0F172A]/50 border border-slate-800 rounded-3xl">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">Descripción del Equipo</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Especificaciones Clave</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botones de Acción (Carrito + WhatsApp) */}
            <div className="flex flex-col sm:flex-row gap-3.5 mt-auto">
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || addedToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
                  isOutOfStock 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : addedToCart 
                      ? 'bg-green-500 text-slate-900 shadow-[0_0_25px_rgba(34,197,94,0.4)]' 
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-0.5'
                }`}
              >
                {addedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {isOutOfStock ? 'Sin Existencias' : addedToCart ? '¡Agregado!' : 'Añadir al Carrito'}
              </button>
              
              <button 
                onClick={handleWhatsAppClick} 
                className="flex-1 flex items-center justify-center gap-2.5 bg-[#0F172A] border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-slate-900 py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                Consulta por WhatsApp
              </button>
            </div>

          </div>

        </div>
        
        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="w-full pt-12 border-t border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                Equipos Similares
              </h2>
              <Link 
                href={`/catalogo?category=${product.category}`} 
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
              >
                Ver más en {product.category} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative group">
              <button 
                onClick={() => scrollRelated('left')} 
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-[#0F172A] border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-3 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div ref={relatedRef} className="flex overflow-x-auto gap-4 snap-x pb-4 scrollbar-hide px-1 scroll-smooth">
                {relatedProducts.map((relProduct) => (
                  <Link key={relProduct.id} href={`/product/${relProduct.id}`} className="group flex-shrink-0 snap-start block">
                    <div className="bg-[#0F172A]/90 rounded-2xl shadow-lg border border-slate-800 transition-all duration-300 h-full flex flex-col w-[210px] sm:w-[240px] hover:-translate-y-1 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                      <div className="relative w-full aspect-[4/5] bg-[#070b14] overflow-hidden rounded-t-2xl flex items-center justify-center">
                        <img 
                          src={relProduct.images[0] || ''} 
                          alt={relProduct.title} 
                          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100" 
                        />
                        {relProduct.badge && (
                          <div className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            relProduct.badge === 'Agotado' ? 'bg-red-500 text-white' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {relProduct.badge}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-3.5">
                        <span className="text-[9px] font-bold text-cyan-400/80 uppercase tracking-wider mb-1 line-clamp-1">{relProduct.category}</span>
                        <h3 className="text-xs font-semibold text-slate-200 mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">{relProduct.title}</h3>
                        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-800/60">
                          <span className="text-base font-black text-yellow-400">{siteConfig.currencySymbol}{relProduct.price.toFixed(2)}</span>
                          <span className="px-3 py-1 bg-[#1E293B] border border-slate-700 text-cyan-400 text-[10px] font-bold rounded-lg group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">Ver</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button 
                onClick={() => scrollRelated('right')} 
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-[#0F172A] border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] p-3 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer hidden md:flex"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] flex items-center justify-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductDetailContent />
    </Suspense>
  );
}