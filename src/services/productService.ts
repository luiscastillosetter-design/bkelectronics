import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/products';

const ICONS = {
  energia: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4z"/></svg>',
  herramientas: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  ferreteria: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>',
  sonido: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 6h.01"/><circle cx="12" cy="14" r="4"/><path d="M12 14h.01"/></svg>',
  computacion: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  automotriz: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/><path d="M5 7l2-3h10l2 3"/></svg>',
  hogar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  servicio: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  creador: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
  default: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2322d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
};

const getCategoryFallbackIcon = (category: string) => {
  const cat = (category || '').toUpperCase();
  if (cat.includes('ENERGIA') || cat.includes('SOLAR')) return ICONS.energia;
  if (cat.includes('HERRAMIENTA')) return ICONS.herramientas;
  if (cat.includes('FERRETERIA')) return ICONS.ferreteria;
  if (cat.includes('SONIDO') || cat.includes('AUDIO')) return ICONS.sonido;
  if (cat.includes('COMPUTACION') || cat.includes('REDES') || cat.includes('CONECTIVIDAD')) return ICONS.computacion;
  if (cat.includes('AUTOMOTRIZ')) return ICONS.automotriz;
  if (cat.includes('HOGAR') || cat.includes('OFICINA')) return ICONS.hogar;
  if (cat.includes('SERVICIO') || cat.includes('TECNICO')) return ICONS.servicio;
  if (cat.includes('CREADOR') || cat.includes('CONTENIDO')) return ICONS.creador;
  return ICONS.default;
};

const formatProduct = (item: any): Product => {
  const stockQty = Number(item.stock ?? 100);
  
  // Extraer imágenes reales de Supabase (puede venir como array o como JSON stringificado)
  let parsedImages: string[] = [];
  if (Array.isArray(item.images)) {
    parsedImages = item.images.filter(Boolean);
  } else if (typeof item.images === 'string' && item.images.trim() !== '') {
    try {
      const jsonParsed = JSON.parse(item.images);
      if (Array.isArray(jsonParsed)) parsedImages = jsonParsed.filter(Boolean);
    } catch {
      parsedImages = [item.images];
    }
  }

  // Si Supabase no tiene fotos registradas para este producto, usamos el icono de respaldo de su categoría
  if (parsedImages.length === 0) {
    const fallback = getCategoryFallbackIcon(item.category);
    parsedImages = [fallback];
  }

  return {
    id: String(item.id),
    title: String(item.title || ''),
    price: Number(item.price) || 0,
    category: String(item.category || 'General'),
    stock: stockQty,
    badge: stockQty <= 0 ? 'Agotado' : (Number(item.price) >= 50 ? 'Envío Gratis' : 'Oferta'),
    images: parsedImages,
    description: item.description || `${item.title}. Equipo con garantía oficial de BK Electronics. Ideal para integraciones profesionales.`,
    features: Array.isArray(item.features) && item.features.length > 0 
      ? item.features 
      : ['Garantía directa de tienda', 'Envíos a nivel nacional', 'Zelle, Pago Móvil, Efectivo y Binance'],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  };
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (error || !data) return [];
      return data.map(formatProduct);
    } catch (err) {
      console.error("Error cargando productos:", err);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (error || !data) return undefined;
      return formatProduct(data);
    } catch (err) {
      console.error(`Error cargando producto ${id}:`, err);
      return undefined;
    }
  },

  async getRelatedProducts(category: string, currentProductId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', currentProductId)
        .limit(10);
        
      if (error || !data) return [];
      return data.map(formatProduct);
    } catch (err) {
      console.error("Error cargando productos relacionados:", err);
      return [];
    }
  }
};