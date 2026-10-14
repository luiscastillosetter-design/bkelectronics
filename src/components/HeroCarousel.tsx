'use client';

import Link from 'next/link';
import InteractiveGlobe from './InteractiveGlobe';

export function HeroCarousel() {
  return (
    <div className="relative w-full min-h-[calc(100dvh-4rem-2.5rem)] md:min-h-[85vh] lg:min-h-[88vh] flex flex-col md:flex-row md:items-center justify-between md:justify-center overflow-hidden bg-[#0B1120] border-b border-slate-800/80">
      
      {/* Fondo interactivo del Globo (limpio y centrado en la vista móvil) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end lg:translate-x-[10%] xl:translate-x-[15%] opacity-45 md:opacity-75 pointer-events-none">
        <InteractiveGlobe className="w-[390px] sm:w-[480px] md:w-[650px] lg:w-[820px] xl:w-[950px] h-auto" />
      </div>

      {/* Degradado para fundir los bordes con el fondo espacial */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/75 to-[#0B1120] z-10 pointer-events-none"></div>

      {/* CONTENEDOR EXCLUSIVO MÓVIL: TÍTULO ARRIBA, GLOBO LIMPIO AL CENTRO, BOTONES Y MÉTRICAS ABAJO */}
      <div className="relative z-20 w-full px-4 sm:px-6 flex flex-col justify-between flex-1 pt-4 pb-10 md:hidden">
        
        {/* 1. BLOQUE SUPERIOR: Badge + Título de Alto Impacto + Subtítulo */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[11px] font-black text-cyan-300 uppercase tracking-widest">
              Distribución Nacional Directa
            </span>
          </div>
          
          <h1 className="text-[2.6rem] sm:text-5xl font-black mb-2.5 tracking-tight leading-[1.05]">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent italic pr-1">
              BK
            </span>
            <span className="text-white">ELECTRONICS</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-sm px-2">
            El epicentro de la tecnología, energía solar, audio profesional y repuestos. Despachos blindados a toda Venezuela.
          </p>
        </div>

        {/* 2. ESPACIO CENTRAL LIBRE PARA QUE EL GLOBO GIRE LIMPIO */}
        <div className="my-auto py-12 pointer-events-none"></div>

        {/* 3. BLOQUE INFERIOR: Botones CTA ubicados justo encima de las métricas */}
        <div className="flex flex-col items-center w-full space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
            <Link
              href="/catalogo"
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-2xl text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.45)] text-center flex items-center justify-center transition-all active:scale-95"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/afiliados"
              className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-cyan-400 border border-cyan-500/50 font-black rounded-2xl text-xs uppercase tracking-wider text-center flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-cyan-950/40"
            >
              Ser Embajador
            </Link>
          </div>

          {/* Tarjeta de métricas al fondo */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm p-3 rounded-2xl bg-[#0F172A]/90 border border-slate-700/80 backdrop-blur-xl shadow-xl text-center">
            <div className="border-r border-slate-800 pr-1">
              <h4 className="text-lg font-black text-white">2.6K+</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Equipos</p>
            </div>
            <div className="border-r border-slate-800 pr-1">
              <h4 className="text-lg font-black text-cyan-400">24/7</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Soporte</p>
            </div>
            <div>
              <h4 className="text-lg font-black text-yellow-400">100%</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">Garantía</p>
            </div>
          </div>
        </div>

      </div>

      {/* CONTENEDOR EXCLUSIVO ORDENADOR / PC */}
      <div className="relative z-20 hidden md:flex flex-col w-full px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 items-start text-left py-12">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-black text-cyan-300 uppercase tracking-widest">
            Red de distribución e importación nacional
          </span>
        </div>
        
        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black mb-6 tracking-tight leading-[1.02] drop-shadow-2xl">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent italic pr-3">
            BK
          </span>
          <span className="text-white">ELECTRONICS</span>
        </h1>

        <p className="text-slate-300 text-lg lg:text-xl max-w-2xl font-medium mb-10 leading-relaxed text-balance">
          El epicentro de la tecnología, energía solar, herramientas y repuestos técnicos. Innovación con despacho directo y seguro a todo el país.
        </p>

        <div className="flex items-center gap-5 mb-14">
          <Link
            href="/catalogo"
            className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-1 text-sm uppercase tracking-widest cursor-pointer"
          >
            Explorar Catálogo
          </Link>
          <Link
            href="/afiliados"
            className="px-10 py-5 bg-[#0F172A]/90 hover:bg-[#1E293B] text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 font-black rounded-2xl transition-all hover:-translate-y-1 text-sm uppercase tracking-widest backdrop-blur-md cursor-pointer"
          >
            Programa de Embajadores
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6 rounded-3xl bg-[#0F172A]/80 border border-slate-800 backdrop-blur-xl w-full max-w-xl shadow-2xl">
          <div className="border-r border-slate-800/80 pr-4">
            <h3 className="text-3xl font-black text-white tracking-tight">2.6K+</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Productos Activos</p>
          </div>
          <div className="border-r border-slate-800/80 pr-4">
            <h3 className="text-3xl font-black text-cyan-400 tracking-tight">24 Horas</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Atención Técnica</p>
          </div>
          <div>
            <h3 className="text-3xl font-black text-yellow-400 tracking-tight">100%</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Garantía Directa</p>
          </div>
        </div>
      </div>

    </div>
  );
}