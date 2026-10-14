'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const defaultOffers = [
  {
    id: 1,
    title: 'SÚPER OFERTA: 40% en Accesorios',
    description: 'Equipa tu taller o proyecto con componentes de alto rendimiento al mejor precio.',
    desktopImg: '/ofertas/oferta1.png',
    mobileImg: '/ofertas/oferta1-mobile.png',
    btnLink: '/catalogo',
    tag: 'Descuento Exclusivo',
  },
  {
    id: 2,
    title: 'PAQUETES ESPECIALES: 2x1',
    description: 'Duplica tu potencia. Compra equipos seleccionados y equipa tu inventario.',
    desktopImg: '/ofertas/oferta2.png',
    mobileImg: '/ofertas/oferta2-mobile.png',
    btnLink: '/catalogo',
    tag: 'Promoción Limitada',
  },
  {
    id: 3,
    title: 'ENVÍO GRATIS A TODO EL PAÍS',
    description: 'En todas tus compras mayores a $50 con embalaje protegido a nivel nacional.',
    desktopImg: '/ofertas/oferta3.png',
    mobileImg: '/ofertas/oferta3-mobile.png',
    btnLink: '/catalogo',
    tag: 'Beneficio Nacional',
  },
];

export function OffersCarousel() {
  const autoplayOptions = { delay: 6500, stopOnInteraction: false };
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay(autoplayOptions)]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [offers, setOffers] = useState<any[]>(defaultOffers);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_offers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOffers(parsed);
          }
        } catch (error) {
          console.error('Error al cargar ofertas:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    };

    emblaApi.on('init', onInit);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('init', onInit);
      emblaApi.off('reInit', onInit);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, offers]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <div className="w-full scroll-mt-28" id="ofertas">
      <div ref={emblaRef} className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A] shadow-[0_0_40px_rgba(6,182,212,0.08)]">
        <div className="flex">
          {offers.map((offer) => {
            const desktopImage = offer.desktopImg || offer.bgImageDesktop || '';
            const mobileImage = offer.mobileImg || offer.bgImageMobile || desktopImage;

            return (
              <div
                key={offer.id}
                className="flex-[0_0_100%] min-w-0 relative h-[420px] sm:h-[460px] md:h-[500px] lg:h-[540px] w-full flex items-center"
              >
                {/* Imagen para PC */}
                <div
                  className="hidden md:block absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url('${desktopImage}')` }}
                />

                {/* Imagen para Móvil */}
                <div
                  className="block md:hidden absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url('${mobileImage}')` }}
                />

                {/* Capa de protección para que las letras resalten con nitidez */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/75 to-transparent z-10" />

                {/* Enlace clickable en toda la tarjeta */}
                <Link href={offer.btnLink || '/catalogo'} className="absolute inset-0 z-20 cursor-pointer" />

                {/* Contenido textual respirado y limpio */}
                <div className="relative z-30 w-full max-w-2xl px-6 sm:px-10 md:px-16 lg:px-20 flex flex-col items-start text-left pointer-events-none">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    {offer.tag || 'Oportunidad BK'}
                  </span>

                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight drop-shadow-md">
                    {offer.title}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-6 max-w-lg">
                    {offer.description}
                  </p>

                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-auto cursor-pointer transition-transform hover:scale-105">
                    <span>Aprovechar Ahora</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Paginación */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0 flex items-center gap-2.5 z-30 pointer-events-auto">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        index === selectedIndex
                          ? 'bg-cyan-400 w-8 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                          : 'bg-slate-700 hover:bg-slate-500 w-2'
                      }`}
                      aria-label={`Ir a banner ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}