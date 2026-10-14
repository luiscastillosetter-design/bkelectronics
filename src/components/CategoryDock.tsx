'use client';

import { Zap, Wrench, Speaker, Monitor, Car, LayoutGrid, Hammer } from 'lucide-react';

interface CategoryDockProps {
  onSelect: (id: string) => void;
  selectedCategory?: string;
}

const categoriesData = [
  { title: 'Todos', dbName: 'Todos', icon: LayoutGrid },
  { title: 'Energía', dbName: 'ENERGIA', icon: Zap },
  { title: 'Herramientas', dbName: 'HERRAMIENTAS', icon: Wrench },
  { title: 'Ferretería', dbName: 'FERRETERIA', icon: Hammer },
  { title: 'Sonido', dbName: 'SONIDO', icon: Speaker },
  { title: 'Redes', dbName: 'COMPUTACIONYCONECTIVIDAD', icon: Monitor },
  { title: 'Autos', dbName: 'AUTOMOTRIZ', icon: Car },
];

export function CategoryDock({ onSelect, selectedCategory = 'Todos' }: CategoryDockProps) {
  return (
    <div className="w-full">
      {/* VISTA MÓVIL: Scroll horizontal táctil sin aplastamiento, con ícono + nombre visible */}
      <div className="md:hidden w-full overflow-x-auto scrollbar-hide py-2 px-1">
        <div className="flex items-center gap-2.5 w-max mx-auto px-2">
          {categoriesData.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory.toUpperCase() === item.dbName.toUpperCase();

            return (
              <button
                key={`mobile-cat-${item.dbName}`}
                onClick={() => onSelect(item.dbName)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-900 border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-[#0F172A]/90 text-slate-300 border border-slate-700/80 hover:border-cyan-500/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-cyan-400'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VISTA ORDENADOR / PC: Dock de cristal interactivo ancho y respirado */}
      <div className="hidden md:flex justify-center w-full">
        <div className="flex items-center gap-3 bg-[#0F172A]/90 border border-slate-700/80 backdrop-blur-2xl rounded-full p-2.5 px-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          {categoriesData.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory.toUpperCase() === item.dbName.toUpperCase();

            return (
              <button
                key={`desktop-cat-${item.dbName}`}
                onClick={() => onSelect(item.dbName)}
                className={`group relative flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)] font-black'
                    : 'bg-[#0B1120] text-slate-300 border border-slate-800 hover:border-cyan-400 hover:text-white hover:bg-[#1E293B] font-bold'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isSelected ? 'text-slate-900' : 'text-cyan-400'}`} />
                <span className="text-xs tracking-wider uppercase">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}