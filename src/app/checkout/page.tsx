'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { siteConfig } from '@/config/site';
import { ChevronLeft, CheckCircle2, MapPin, CreditCard, User, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  // Contacto
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  // Envío
  const [courier, setCourier] = useState('MRW');
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');

  // Pago
  const [metodoPago, setMetodoPago] = useState('Zelle');
  const [refCode, setRefCode] = useState('DIRECTO');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedRef = localStorage.getItem('todomax_ref');
    if (storedRef) {
      setRefCode(storedRef);
    }
  }, []);

  const subtotalPorItem = (price: number, quantity: number) => price * quantity;
  const total = items.reduce((acc, item) => acc + subtotalPorItem(item.price, item.quantity), 0);
  const envioGratis = total >= (siteConfig.freeShippingThreshold || 50);

  const enviarPedidoWhatsApp = () => {
    setIsSubmitting(true);
    
    const listaProductos = items
      .map(
        (item) =>
          `🔹 *${item.title}* (Cant: ${item.quantity}) - ${siteConfig.currencySymbol}${subtotalPorItem(item.price, item.quantity).toFixed(2)}`
      )
      .join('\n');

    const mensaje =
      `*NUEVA ORDEN - ${siteConfig.storeName.toUpperCase()}*\n` +
      `===========================\n\n` +
      `🛍️ *PRODUCTOS:*\n${listaProductos}\n\n` +
      `💰 *TOTAL A PAGAR:* ${siteConfig.currencySymbol}${total.toFixed(2)}\n` +
      `🚚 *ENVÍO:* ${envioGratis ? 'GRATIS' : 'Cobro en Destino'}\n\n` +
      `===========================\n\n` +
      `👤 *DATOS DEL CLIENTE:*\n` +
      `- Nombre: ${nombre} ${apellido}\n` +
      `- Teléfono: ${telefono}\n\n` +
      `📍 *DIRECCIÓN DE ENTREGA:*\n` +
      `- Agencia/Método: ${courier}\n` +
      `- Estado: ${estado}\n` +
      `- Ciudad: ${ciudad}\n` +
      `- Detalles: ${direccion}\n\n` +
      `💳 *MÉTODO DE PAGO:* ${metodoPago}` +
      (refCode !== 'DIRECTO' ? `\n\n🎟️ *CÓDIGO AFILIADO:* ${refCode}` : '');

    const rawWhatsApp = siteConfig.whatsapp?.number || siteConfig.whatsappNumber || '';
    const whatsappNum = String(rawWhatsApp).replace(/\D/g, '');
    const mensajeCodificado = encodeURIComponent(mensaje);

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push('/');
    }, 2000);

    window.open(`https://wa.me/${whatsappNum}?text=${mensajeCodificado}`, '_blank');
  };

  const handleConfirmarPedido = () => {
    if (!nombre.trim() || !apellido.trim() || !telefono.trim() || !estado.trim() || !ciudad.trim() || !direccion.trim()) {
      alert('Por favor, completa todos los campos obligatorios para procesar tu envío.');
      return;
    }
    if (items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    enviarPedidoWhatsApp();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center px-4 pt-20">
        <ShoppingBag className="w-20 h-20 text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">No hay productos por facturar</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">Vuelve al catálogo para agregar equipos a tu orden.</p>
        <button
          onClick={() => router.push('/catalogo')}
          className="bg-cyan-500 text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          Explorar Inventario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1120] min-h-screen pt-[100px] md:pt-[120px] pb-28 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 text-slate-200 w-full">
      <div className="w-full mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-medium transition-colors w-fit cursor-pointer"
          >
            <div className="p-2 bg-[#0F172A] rounded-full border border-slate-800 group-hover:border-cyan-500/50">
              <ChevronLeft className="w-5 h-5" />
            </div>
            Modificar Carrito
          </button>
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500" />
            <span className="text-sm font-bold tracking-widest uppercase text-cyan-500">Checkout Seguro • {siteConfig.storeName}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: FORMULARIOS (7 Columnas en PC) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="p-2.5 bg-[#1E293B] rounded-xl text-cyan-400"><User className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Datos Personales</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Ej. Carlos" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Apellido</label>
                  <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Ej. Rodríguez" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">WhatsApp / Teléfono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="+58 412 0000000" />
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="p-2.5 bg-[#1E293B] rounded-xl text-cyan-400"><MapPin className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Logística de Entrega</h2>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Agencia / Courier</label>
                  <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer">
                    <option value="MRW">Agencia MRW</option>
                    <option value="Zoom">Agencia Zoom</option>
                    <option value="Tealca">Agencia Tealca</option>
                    <option value="Delivery Local">Delivery Local (Solo Caracas)</option>
                    <option value="Retiro en Tienda">Retiro en Sede Física</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Estado</label>
                    <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Ej. Miranda" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Ciudad</label>
                    <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Ej. Los Teques" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Dirección Exacta</label>
                  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Nombre de agencia o dirección de entrega" />
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A]/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="p-2.5 bg-[#1E293B] rounded-xl text-cyan-400"><CreditCard className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Método de Pago</h2>
              </div>
              
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none font-bold cursor-pointer">
                <option value="Zelle">Zelle (USD)</option>
                <option value="Pago Móvil">Pago Móvil (Bs al cambio)</option>
                <option value="Binance Pay">Binance Pay (USDT)</option>
                <option value="Efectivo">Efectivo (Solo en Tienda)</option>
              </select>
              <p className="text-xs text-slate-500 mt-3 font-medium">Los datos de transferencia te serán proporcionados por nuestro equipo de ventas a través de WhatsApp para mayor seguridad.</p>
            </div>
            
          </div>

          {/* COLUMNA DERECHA: RESUMEN (5 Columnas en PC, Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#0F172A] border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl sticky top-[100px] md:top-[120px]">
              
              <h2 className="text-xl font-black text-white border-b border-slate-800 pb-4 mb-6 uppercase tracking-wider">Resumen de Orden</h2>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-[#0B1120] p-3 rounded-2xl border border-slate-800/80">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-[#070b14] flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-200 line-clamp-2 leading-tight">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Cant: <span className="font-bold text-slate-300">{item.quantity}</span></p>
                    </div>
                    <span className="font-black text-yellow-400">
                      {siteConfig.currencySymbol}{subtotalPorItem(item.price, item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0B1120] rounded-2xl p-5 border border-slate-800 space-y-3 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Subtotal de Equipos</span>
                  <span className="font-bold text-slate-200">{siteConfig.currencySymbol}{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Costo de Envío</span>
                  <span className={`font-bold ${envioGratis ? 'text-green-400' : 'text-slate-500'}`}>
                    {envioGratis ? 'GRATIS' : 'Cobro en Destino'}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
                  <span className="text-lg font-bold text-white uppercase tracking-wider">Total Final</span>
                  <span className="text-3xl font-black text-yellow-400">
                    {siteConfig.currencySymbol}{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmarPedido}
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-5 rounded-2xl font-black text-base md:text-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? 'Procesando...' : 'Facturar Vía WhatsApp'}
              </button>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}