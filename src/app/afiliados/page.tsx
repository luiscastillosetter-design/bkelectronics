'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function Afiliados() {
  const [formData, setFormData] = useState({ nombre: '', email: '', codigo: '' });
  const [submitted, setSubmitted] = useState(false);
  const [waLink, setWaLink] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mensaje = `Hola Sofía 🤖, quiero unirme al programa de embajadores de BK Electronics.\n\n*Mis datos:*\n👤 Nombre: ${formData.nombre}\n📧 Email: ${formData.email}\n🎟️ Código deseado: ${formData.codigo.toUpperCase()}\n\n¡Estoy listo para vender!`;
    const whatsappNum = String(siteConfig.whatsapp?.number || siteConfig.whatsappNumber || '').replace(/\D/g, '');
    const link = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(mensaje)}`;
    setWaLink(link);
    setSubmitted(true);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] pt-28 pb-20 text-slate-200">
      <div className="max-w-2xl mx-auto px-4 text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs font-black rounded-full uppercase tracking-widest mb-4">
          Programa de Embajadores
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Únete al equipo</h1>
        <p className="text-slate-400 font-medium">Comparte tu código y gana comisiones por cada compra.</p>
      </div>

      <div className="max-w-md mx-auto px-4">
        {!submitted ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre completo</label>
                <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Correo</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Código Personalizado</label>
                <input type="text" required value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toLowerCase().replace(/\s+/g, '') })} className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-cyan-400 font-black uppercase focus:border-cyan-500 outline-none" placeholder="EJ: CARLOS2024" />
              </div>
              <button type="submit" className="w-full py-4 rounded-xl font-black text-slate-900 bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider">
                Continuar en WhatsApp <MessageCircle className="w-5 h-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">¡Petición Generada!</h2>
            <p className="text-slate-400 mb-8">Sofía te espera en WhatsApp para darte acceso al sistema.</p>
            <a href={waLink} target="_blank" className="w-full py-4 rounded-xl font-black text-slate-900 bg-[#25D366] hover:bg-[#20BD5A] transition-all flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5" /> Abrir WhatsApp
            </a>
            <button onClick={() => setSubmitted(false)} className="text-sm font-bold text-slate-500 hover:text-white">Modificar datos</button>
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-400"><ArrowRight className="w-4 h-4 rotate-180" /> Volver al catálogo</Link>
        </div>
      </div>
    </div>
  );
}