'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Pencil, X, Lock, ArrowLeft, CheckCircle, 
  Image as ImageIcon, Video, Settings, ShoppingBag, Layers, 
  Sliders, Zap, Search 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

const defaultCategories = [
  { id: 'Todos', name: 'Catálogo Completo', image: '/categories/todos.png' },
  { id: 'ENERGIA', name: 'Energía y Solar', image: '/categories/smarthome.png' },
  { id: 'HERRAMIENTAS', name: 'Herramientas', image: '/categories/gadgets.png' },
  { id: 'FERRETERIA', name: 'Ferretería', image: '/categories/gadgets.png' },
  { id: 'SONIDO', name: 'Audio y Sonido', image: '/categories/sonido.png' },
  { id: 'COMPUTACIONYCONECTIVIDAD', name: 'Computación y Redes', image: '/categories/phone.png' },
  { id: 'AUTOMOTRIZ', name: 'Automotriz', image: '/categories/gaming.png' },
  { id: 'HOGARYOFICINA', name: 'Hogar y Oficina', image: '/categories/smarthome.png' },
  { id: 'SERVICIOTECNICO', name: 'Servicio Técnico', image: '/categories/gadgets.png' },
  { id: 'CREADORDECONTENIDO', name: 'Creador de Contenido', image: '/categories/sonido.png' },
];

const defaultHeroSlides = [
  {
    id: 1,
    title: 'Catálogo Completo BK',
    btnLink: '/catalogo',
    desktopImg: '/hero/hero1catalogo.png',
    mobileImg: '/hero/hero1catalogo-mobile.png',
  },
  {
    id: 2,
    title: 'Programa de Embajadores',
    btnLink: '/afiliados',
    desktopImg: '/hero/hero2afiliados.png',
    mobileImg: '/hero/hero2afiliados-mobile.png',
  },
  {
    id: 3,
    title: 'Crea tu Cuenta / Registro',
    btnLink: '?auth=register',
    desktopImg: '/hero/hero3registro.png',
    mobileImg: '/hero/hero3registro-mobile.png',
  },
];

const defaultOffers = [
  {
    id: 1,
    title: 'SÚPER OFERTA: 40% en Accesorios',
    description: 'Equipa tu taller o proyecto con componentes de alto rendimiento al mejor precio.',
    btnLink: '/catalogo',
    desktopImg: '/ofertas/oferta1.png',
    mobileImg: '/ofertas/oferta1-mobile.png',
  },
  {
    id: 2,
    title: 'PAQUETES ESPECIALES: 2x1',
    description: 'Duplica tu potencia. Compra equipos seleccionados y equipa tu inventario.',
    btnLink: '/catalogo',
    desktopImg: '/ofertas/oferta2.png',
    mobileImg: '/ofertas/oferta2-mobile.png',
  },
  {
    id: 3,
    title: 'ENVÍO GRATIS A TODO EL PAÍS',
    description: 'En todas tus compras mayores a $50 con embalaje protegido a nivel nacional.',
    btnLink: '/catalogo',
    desktopImg: '/ofertas/oferta3.png',
    mobileImg: '/ofertas/oferta3-mobile.png',
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'hero' | 'ofertas' | 'categories' | 'branding'>('products');
  const [successMsg, setSuccessMsg] = useState('');

  // Branding
  const [storeName, setStoreName] = useState(siteConfig.storeName || 'BK Electronics');
  const [logoUrl, setLogoUrl] = useState('/logo-bk.png');

  // 1. Productos
  const [products, setProducts] = useState<any[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    stock: '100',
    category: 'ENERGIA',
    description: '',
    features: '',
    images: ['', '', '', '']
  });

  // 2. Carrusel Hero
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [editingHeroId, setEditingHeroId] = useState<any>(null);
  const [heroForm, setHeroForm] = useState({ title: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' });

  // 3. Carrusel Ofertas
  const [offers, setOffers] = useState<any[]>([]);
  const [editingOfferId, setEditingOfferId] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' });

  // 4. Categorías
  const [categories, setCategories] = useState<any[]>(defaultCategories);
  const [editingCategoryId, setEditingCategoryId] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', image: '' });

  const ADMIN_PIN = 'Admin1234.';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      showNotification('Contraseña incorrecta. Verifique sus credenciales.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }

    const loadProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (!error && data) {
        setProducts(data);
      }
    };
    loadProducts();

    const savedHero = localStorage.getItem('store_hero_slides');
    if (savedHero) {
      try {
        setHeroSlides(JSON.parse(savedHero));
      } catch {
        setHeroSlides(defaultHeroSlides);
      }
    } else {
      setHeroSlides(defaultHeroSlides);
      localStorage.setItem('store_hero_slides', JSON.stringify(defaultHeroSlides));
    }

    const savedOffers = localStorage.getItem('store_offers');
    if (savedOffers) {
      try {
        setOffers(JSON.parse(savedOffers));
      } catch {
        setOffers(defaultOffers);
      }
    } else {
      setOffers(defaultOffers);
      localStorage.setItem('store_offers', JSON.stringify(defaultOffers));
    }

    const savedCategories = localStorage.getItem('store_categories_bk');
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch {
        setCategories(defaultCategories);
      }
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('store_categories_bk', JSON.stringify(defaultCategories));
    }
  }, []);

  const filteredInventory = useMemo(() => {
    if (!adminSearch.trim()) return products;
    const q = adminSearch.toLowerCase();
    return products.filter((p) =>
      String(p.title || '').toLowerCase().includes(q) ||
      String(p.category || '').toLowerCase().includes(q) ||
      String(p.id || '').toLowerCase().includes(q)
    );
  }, [products, adminSearch]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isVideoSource = (url: string) => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.includes('.mp4?') || url.startsWith('data:video');
  };

  // --- CRUD PRODUCTOS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    const parsedFeatures = productForm.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const cleanImages = productForm.images.filter((img) => img.trim() !== '');
    const numericPrice = Number(productForm.price) || 0;
    const numericStock = Number(productForm.stock ?? 100);

    if (editingProductId) {
      const updatedProduct = {
        title: productForm.title,
        price: numericPrice,
        stock: numericStock,
        category: productForm.category,
        description: productForm.description,
        features: parsedFeatures,
        images: cleanImages
      };
      
      const { error } = await supabase.from('products').update(updatedProduct).eq('id', editingProductId);
      if (!error) {
        const updated = products.map((p) => p.id === editingProductId ? { ...p, ...updatedProduct } : p);
        setProducts(updated);
        setEditingProductId(null);
        showNotification('¡Equipo actualizado exitosamente en Supabase!');
      } else {
        showNotification('Error al actualizar en Supabase.');
      }
    } else {
      const newItem = {
        id: String(Date.now()),
        title: productForm.title,
        price: numericPrice,
        stock: numericStock,
        category: productForm.category,
        description: productForm.description,
        features: parsedFeatures,
        images: cleanImages,
      };
      
      const { error } = await supabase.from('products').insert([newItem]);
      if (!error) {
        setProducts([newItem, ...products]);
        showNotification('¡Nuevo equipo agregado a Supabase!');
      } else {
        showNotification('Error al agregar a Supabase.');
      }
    }

    setProductForm({
      title: '',
      price: '',
      stock: '100',
      category: 'ENERGIA',
      description: '',
      features: '',
      images: ['', '', '', ''],
    });
  };

  const startEditProduct = (product: any) => {
    setEditingProductId(product.id);
    const existingImgs = Array.isArray(product.images) ? [...product.images] : [];
    while (existingImgs.length < 4) existingImgs.push('');

    let feats = '';
    if (Array.isArray(product.features)) {
      feats = product.features.join('\n');
    } else if (typeof product.features === 'string') {
      feats = product.features;
    }

    setProductForm({
      title: product.title || '',
      price: product.price?.toString() || '',
      stock: (product.stock ?? 100).toString(),
      category: product.category || 'ENERGIA',
      description: product.description || '',
      features: feats,
      images: existingImgs.slice(0, 4),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: any) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
      showNotification('Equipo eliminado de Supabase');
      if (editingProductId === id) {
        setEditingProductId(null);
        setProductForm({
          title: '',
          price: '',
          stock: '100',
          category: 'ENERGIA',
          description: '',
          features: '',
          images: ['', '', '', ''],
        });
      }
    } else {
      showNotification('Error al eliminar de Supabase');
    }
  };

  // --- CRUD HERO ---
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.desktopImg) {
      showNotification('Debes asignar la imagen para ordenador');
      return;
    }
    if (editingHeroId) {
      const updated = heroSlides.map((s) =>
        s.id === editingHeroId
          ? { ...s, title: heroForm.title, btnLink: heroForm.btnLink, desktopImg: heroForm.desktopImg, mobileImg: heroForm.mobileImg || heroForm.desktopImg }
          : s
      );
      setHeroSlides(updated);
      localStorage.setItem('store_hero_slides', JSON.stringify(updated));
      setEditingHeroId(null);
      showNotification('¡Banner de Hero actualizado!');
    } else {
      const newItem = {
        id: Date.now(),
        title: heroForm.title || `Banner ${heroSlides.length + 1}`,
        btnLink: heroForm.btnLink || '/catalogo',
        desktopImg: heroForm.desktopImg,
        mobileImg: heroForm.mobileImg || heroForm.desktopImg,
      };
      const updated = [...heroSlides, newItem];
      setHeroSlides(updated);
      localStorage.setItem('store_hero_slides', JSON.stringify(updated));
      showNotification('¡Banner agregado al Hero!');
    }
    setHeroForm({ title: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' });
  };

  const startEditHero = (slide: any) => {
    setEditingHeroId(slide.id);
    setHeroForm({
      title: slide.title || '',
      btnLink: slide.btnLink || '/catalogo',
      desktopImg: slide.desktopImg || '',
      mobileImg: slide.mobileImg || '',
    });
  };

  const handleDeleteHero = (id: any) => {
    const updated = heroSlides.filter((s) => s.id !== id);
    setHeroSlides(updated);
    localStorage.setItem('store_hero_slides', JSON.stringify(updated));
    if (editingHeroId === id) setEditingHeroId(null);
  };

  // --- CRUD OFERTAS ---
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.desktopImg) {
      showNotification('Debes asignar la imagen para ordenador');
      return;
    }
    if (editingOfferId) {
      const updated = offers.map((o) =>
        o.id === editingOfferId
          ? { ...o, title: offerForm.title, description: offerForm.description, btnLink: offerForm.btnLink, desktopImg: offerForm.desktopImg, mobileImg: offerForm.mobileImg || offerForm.desktopImg }
          : o
      );
      setOffers(updated);
      localStorage.setItem('store_offers', JSON.stringify(updated));
      setEditingOfferId(null);
      showNotification('¡Tarjeta de oferta actualizada!');
    } else {
      const newItem = {
        id: Date.now(),
        title: offerForm.title || `Oferta ${offers.length + 1}`,
        description: offerForm.description,
        btnLink: offerForm.btnLink || '/catalogo',
        desktopImg: offerForm.desktopImg,
        mobileImg: offerForm.mobileImg || offerForm.desktopImg,
      };
      const updated = [...offers, newItem];
      setOffers(updated);
      localStorage.setItem('store_offers', JSON.stringify(updated));
      showNotification('¡Tarjeta de oferta agregada!');
    }
    setOfferForm({ title: '', description: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' });
  };

  const startEditOffer = (offer: any) => {
    setEditingOfferId(offer.id);
    setOfferForm({
      title: offer.title || '',
      description: offer.description || '',
      btnLink: offer.btnLink || '/catalogo',
      desktopImg: offer.desktopImg || '',
      mobileImg: offer.mobileImg || '',
    });
  };

  const handleDeleteOffer = (id: any) => {
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    localStorage.setItem('store_offers', JSON.stringify(updated));
    if (editingOfferId === id) setEditingOfferId(null);
  };

  // --- CRUD CATEGORÍAS ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.image) {
      showNotification('Ingresa nombre y sube la imagen');
      return;
    }
    if (editingCategoryId) {
      const updated = categories.map((c) =>
        c.id === editingCategoryId
          ? { ...c, name: categoryForm.name, image: categoryForm.image }
          : c
      );
      setCategories(updated);
      localStorage.setItem('store_categories_bk', JSON.stringify(updated));
      setEditingCategoryId(null);
      showNotification('¡Categoría actualizada!');
    } else {
      const newItem = {
        id: (categoryForm.id || categoryForm.name).toUpperCase().replace(/\s+/g, ''),
        name: categoryForm.name,
        image: categoryForm.image,
      };
      const updated = [...categories, newItem];
      setCategories(updated);
      localStorage.setItem('store_categories_bk', JSON.stringify(updated));
      showNotification('¡Categoría agregada!');
    }
    setCategoryForm({ id: '', name: '', image: '' });
  };

  const startEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: cat.id || '',
      name: cat.name || '',
      image: cat.image || '',
    });
  };

  const handleDeleteCategory = (id: any) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('store_categories_bk', JSON.stringify(updated));
    if (editingCategoryId === id) setEditingCategoryId(null);
  };

  const productCategoryOptions = categories.filter((c) => c.id !== 'Todos');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <div className="bg-[#0F172A] border border-slate-800 p-8 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.15)] max-w-md w-full">
          <div className="w-16 h-16 bg-cyan-950/60 border border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-cyan-400">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-center text-white mb-1 uppercase tracking-wider">
            Panel Admin <span className="text-cyan-400">BK</span>
          </h1>
          <p className="text-xs text-slate-400 text-center mb-6 font-medium">
            Ingresa tu credencial maestra para administrar el inventario.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña de Administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl focus:outline-none focus:border-cyan-500 font-semibold text-sm"
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider text-xs cursor-pointer"
            >
              Desbloquear Consola
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1.5 font-bold">
              <ArrowLeft size={14} /> Volver a {siteConfig.storeName}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B1120] text-slate-200 pb-24 w-full">
      {/* BARRA SUPERIOR A ANCHO COMPLETO */}
      <header className="bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 py-4 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic">
            BK
          </span>
          <h1 className="text-base md:text-lg font-black text-white uppercase tracking-wider">
            Consola Admin • {storeName}
          </h1>
          <span className="hidden sm:inline-block bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Conectado a Supabase
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-colors"
          >
            Ver Tienda en Vivo
          </Link>
          <button
            onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthenticated(false); }}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* PESTAÑAS DE NAVEGACIÓN A ANCHO COMPLETO */}
      <div className="bg-[#0F172A]/60 border-b border-slate-800/80">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 flex gap-2.5 overflow-x-auto py-3.5 scrollbar-hide">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-[#0F172A] text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <ShoppingBag size={16} /> Inventario ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('ofertas')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ofertas'
                ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-[#0F172A] text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Zap size={16} /> Carrusel Ofertas ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-[#0F172A] text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Layers size={16} /> Departamentos ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-[#0F172A] text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Sliders size={16} /> Banners Hero ({heroSlides.length})
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-[#0F172A] text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Settings size={16} /> Marca y Logo
          </button>
        </div>
      </div>

      {/* CONTENEDOR EXPANSIVO A PANTALLA COMPLETA */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-28 py-8">
        {successMsg && (
          <div className="mb-6 bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <CheckCircle className="text-cyan-400 flex-shrink-0" />
            <span className="font-bold text-sm">{successMsg}</span>
          </div>
        )}

        {/* 1. SECCIÓN PRODUCTOS */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario Lateral (5 columnas en PC) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-[#0F172A] p-6 rounded-3xl shadow-xl border border-slate-800">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  {editingProductId ? <Pencil size={18} className="text-yellow-400" /> : <Plus size={18} className="text-cyan-400" />}
                  {editingProductId ? 'Editar Equipo' : 'Nuevo Equipo'}
                </h2>
                {editingProductId && (
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({ title: '', price: '', stock: '100', category: 'ENERGIA', description: '', features: '', images: ['', '', '', ''] });
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <X size={14} /> Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Título del Equipo</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-500 font-semibold"
                    placeholder="Ej. Inversor Solar Híbrido 3KW..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-yellow-400 rounded-xl text-sm focus:outline-none focus:border-cyan-500 font-black"
                      placeholder="35.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Stock Disponible</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-500 font-bold"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Departamento Oficial</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-cyan-400 rounded-xl text-sm focus:outline-none focus:border-cyan-500 font-bold cursor-pointer"
                  >
                    {productCategoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Descripción Técnica / Comercial</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe las ventajas y aplicaciones del equipo..."
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
                    Especificaciones (1 por línea)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.features}
                    onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                    placeholder="Garantía directa BK Electronics&#10;Despacho nacional protegido&#10;Alta eficiencia energética"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase">
                    Multimedia (Hasta 4 Fotos o Videos MP4)
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((index) => {
                      const media = productForm.images[index];
                      const isVideo = isVideoSource(media);

                      return (
                        <div key={index} className="border border-dashed border-slate-700 p-2 rounded-2xl text-center relative bg-[#0B1120] hover:border-cyan-500/50 transition-colors">
                          {media ? (
                            <div className="relative h-24 w-full rounded-xl overflow-hidden bg-[#070b14] flex items-center justify-center">
                              {isVideo ? (
                                <video src={media} className="h-full w-full object-contain" muted autoPlay loop playsInline />
                              ) : (
                                <img src={media} alt={`Preview ${index}`} className="h-full w-full object-contain p-1" />
                              )}
                              
                              <span className="absolute bottom-1 left-1 bg-slate-900/90 text-cyan-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                                {isVideo ? 'Video' : 'Foto'}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...productForm.images];
                                  updated[index] = '';
                                  setProductForm({ ...productForm, images: updated });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10 cursor-pointer"
                                title="Eliminar"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-24 space-y-1.5 px-1">
                              <label className="cursor-pointer flex flex-col items-center">
                                <div className="flex items-center gap-1.5 text-cyan-400">
                                  <ImageIcon size={16} />
                                  <Video size={16} />
                                </div>
                                <span className="text-[10px] text-slate-300 font-bold mt-1">Subir Archivo</span>
                                <input
                                  type="file"
                                  accept="image/*,video/mp4"
                                  className="hidden"
                                  onChange={(e) => handleMediaUpload(e, (url) => {
                                    const updated = [...productForm.images];
                                    updated[index] = url;
                                    setProductForm({ ...productForm, images: updated });
                                  })}
                                />
                              </label>
                              <input
                                type="text"
                                placeholder="o pegar URL / ruta..."
                                onBlur={(e) => {
                                  if (e.target.value.trim() !== '') {
                                    const updated = [...productForm.images];
                                    updated[index] = e.target.value.trim();
                                    setProductForm({ ...productForm, images: updated });
                                    e.target.value = '';
                                  }
                                }}
                                className="w-full text-[10px] px-2 py-1 border border-slate-800 rounded-lg bg-[#0F172A] text-slate-200 text-center focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-lg cursor-pointer ${
                    editingProductId
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-900'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {editingProductId ? 'Guardar Cambios en Supabase' : 'Publicar Equipo en Catálogo'}
                </button>
              </form>
            </div>

            {/* Listado de Inventario con Buscador en Vivo (7 u 8 columnas en PC) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-[#0F172A] p-6 rounded-3xl shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">
                    Inventario Activo ({filteredInventory.length})
                  </h2>
                  <p className="text-xs text-slate-400">Sincronizado en tiempo real con la base de datos de {siteConfig.storeName}.</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    placeholder="Filtrar por nombre, ID o categoría..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[680px] overflow-y-auto pr-2 scrollbar-hide">
                {filteredInventory.map((product) => {
                  const firstMedia = Array.isArray(product.images) ? product.images[0] : '';
                  const isFirstVideo = isVideoSource(firstMedia);

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3.5 bg-[#0B1120] rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {firstMedia ? (
                          isFirstVideo ? (
                            <div className="w-14 h-14 rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800 flex-shrink-0">
                              <video src={firstMedia} className="w-full h-full object-cover" muted />
                            </div>
                          ) : (
                            <img
                              src={firstMedia}
                              alt={product.title}
                              className="w-14 h-14 object-contain p-1 rounded-xl border border-slate-800 bg-[#070b14] flex-shrink-0"
                            />
                          )
                        ) : (
                          <div className="w-14 h-14 bg-[#0F172A] border border-slate-800 rounded-xl flex items-center justify-center text-cyan-500 text-[10px] font-bold flex-shrink-0">
                            Auto SVG
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm truncate">{product.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            <span className="text-yellow-400 font-black">{siteConfig.currencySymbol}{Number(product.price || 0).toFixed(2)}</span>
                            {' • '}
                            <span className="text-cyan-400 font-bold uppercase">{product.category}</span>
                            {' • '}
                            <span className="text-slate-500">Cód: #{product.id}</span>
                          </p>
                          <span className="inline-block mt-1 text-[10px] bg-[#1E293B] text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                            Stock: {product.stock ?? 100} uds
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEditProduct(product)}
                          className="p-2.5 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 bg-[#0F172A] border border-slate-800 rounded-xl transition-colors cursor-pointer"
                          title="Editar equipo"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2.5 text-red-400 hover:bg-red-500 hover:text-white bg-[#0F172A] border border-slate-800 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar equipo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. CARRUSEL HERO */}
        {activeTab === 'hero' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-[#0F172A] p-6 rounded-3xl border border-slate-800 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                  {editingHeroId ? <Pencil size={18} className="text-yellow-400" /> : <Plus size={18} className="text-cyan-400" />}
                  {editingHeroId ? 'Editar Banner Hero' : 'Nuevo Banner Hero'}
                </h2>
                {editingHeroId && (
                  <button
                    onClick={() => { setEditingHeroId(null); setHeroForm({ title: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' }); }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <X size={14} /> Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveHero} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Título / Referencia</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Enlace al hacer clic</label>
                  <input
                    type="text"
                    value={heroForm.btnLink}
                    onChange={(e) => setHeroForm({ ...heroForm, btnLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Imagen Ordenador (PC)</label>
                  {heroForm.desktopImg && <img src={heroForm.desktopImg} alt="Desktop Preview" className="h-20 w-full object-cover rounded-xl border border-slate-700 mb-1" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setHeroForm({ ...heroForm, desktopImg: url }))}
                    className="text-xs w-full text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Imagen Móvil (Celular)</label>
                  {heroForm.mobileImg && <img src={heroForm.mobileImg} alt="Mobile Preview" className="h-20 w-24 object-cover rounded-xl border border-slate-700 mb-1" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setHeroForm({ ...heroForm, mobileImg: url }))}
                    className="text-xs w-full text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full font-black py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer"
                >
                  {editingHeroId ? 'Actualizar Banner Hero' : 'Agregar Banner Hero'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
              <h2 className="text-base font-black text-white uppercase mb-4">Banners Configurados ({heroSlides.length})</h2>
              <div className="space-y-3">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="p-4 bg-[#0B1120] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={slide.desktopImg} alt="Desktop" className="w-24 h-14 object-cover rounded-lg border border-slate-700" />
                        <span className="absolute bottom-1 right-1 bg-slate-900 text-cyan-400 text-[9px] font-bold px-1.5 rounded">PC</span>
                      </div>
                      <div className="relative">
                        <img src={slide.mobileImg || slide.desktopImg} alt="Mobile" className="w-12 h-14 object-cover rounded-lg border border-slate-700" />
                        <span className="absolute bottom-1 right-1 bg-cyan-500 text-slate-900 text-[9px] font-bold px-1 rounded">Móvil</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{slide.title}</h4>
                        <p className="text-xs text-cyan-400">{slide.btnLink}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditHero(slide)} className="text-cyan-400 hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteHero(slide.id)} className="text-red-400 hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. CARRUSEL OFERTAS */}
        {activeTab === 'ofertas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-[#0F172A] p-6 rounded-3xl border border-slate-800 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                  {editingOfferId ? <Pencil size={18} className="text-yellow-400" /> : <Plus size={18} className="text-cyan-400" />}
                  {editingOfferId ? 'Editar Oferta' : 'Nueva Tarjeta de Oferta'}
                </h2>
                {editingOfferId && (
                  <button
                    onClick={() => { setEditingOfferId(null); setOfferForm({ title: '', description: '', btnLink: '/catalogo', desktopImg: '', mobileImg: '' }); }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <X size={14} /> Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveOffer} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Título de la Oferta</label>
                  <input
                    type="text"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Descripción / Subtítulo</label>
                  <input
                    type="text"
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Enlace destino</label>
                  <input
                    type="text"
                    value={offerForm.btnLink}
                    onChange={(e) => setOfferForm({ ...offerForm, btnLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Imagen Ordenador (PC)</label>
                  {offerForm.desktopImg && <img src={offerForm.desktopImg} alt="Desktop Preview" className="h-20 w-full object-cover rounded-xl border border-slate-700 mb-1" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setOfferForm({ ...offerForm, desktopImg: url }))}
                    className="text-xs w-full text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">Imagen Móvil (Celular)</label>
                  {offerForm.mobileImg && <img src={offerForm.mobileImg} alt="Mobile Preview" className="h-20 w-24 object-cover rounded-xl border border-slate-700 mb-1" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setOfferForm({ ...offerForm, mobileImg: url }))}
                    className="text-xs w-full text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full font-black py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer"
                >
                  {editingOfferId ? 'Actualizar Oferta' : 'Publicar Oferta'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
              <h2 className="text-base font-black text-white uppercase mb-4">Ofertas Activas en Portada ({offers.length})</h2>
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-4 bg-[#0B1120] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img src={offer.desktopImg} alt="Desktop" className="w-24 h-14 object-cover rounded-lg border border-slate-700" />
                        <span className="absolute bottom-1 right-1 bg-slate-900 text-cyan-400 text-[9px] font-bold px-1.5 rounded">PC</span>
                      </div>
                      <div className="relative flex-shrink-0">
                        <img src={offer.mobileImg || offer.desktopImg} alt="Mobile" className="w-12 h-14 object-cover rounded-lg border border-slate-700" />
                        <span className="absolute bottom-1 right-1 bg-cyan-500 text-slate-900 text-[9px] font-bold px-1 rounded">Móvil</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{offer.title}</h4>
                        <p className="text-xs text-slate-400">{offer.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditOffer(offer)} className="text-cyan-400 hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteOffer(offer.id)} className="text-red-400 hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. CATEGORÍAS / DEPARTAMENTOS */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-[#0F172A] p-6 rounded-3xl border border-slate-800 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                  {editingCategoryId ? <Pencil size={18} className="text-yellow-400" /> : <Plus size={18} className="text-cyan-400" />}
                  {editingCategoryId ? 'Editar Departamento' : 'Nuevo Departamento'}
                </h2>
                {editingCategoryId && (
                  <button
                    onClick={() => { setEditingCategoryId(null); setCategoryForm({ id: '', name: '', image: '' }); }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                  >
                    <X size={14} /> Cancelar
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Código en Base de Datos (ID)</label>
                  <input
                    type="text"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    disabled={!!editingCategoryId}
                    placeholder="Ej. ENERGIA"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-cyan-400 font-bold rounded-xl text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase">Nombre Visible</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Ej. Energía y Solar"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Imagen de Referencia</label>
                  {categoryForm.image && <img src={categoryForm.image} alt="Cat Preview" className="h-16 w-full object-cover rounded-xl border border-slate-700 mb-1" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setCategoryForm({ ...categoryForm, image: url }))}
                    className="text-xs w-full text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full font-black py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer"
                >
                  {editingCategoryId ? 'Actualizar Departamento' : 'Guardar Departamento'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-[#0F172A] p-6 rounded-3xl border border-slate-800">
              <h2 className="text-base font-black text-white uppercase mb-4">Departamentos Oficiales ({categories.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3.5 bg-[#0B1120] border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl border border-slate-700 bg-[#070b14] flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{cat.name}</h4>
                        <span className="text-[10px] text-cyan-400 uppercase font-black">ID: {cat.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => startEditCategory(cat)} className="text-cyan-400 hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-[#0F172A] p-8 rounded-3xl border border-slate-800 max-w-2xl">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-6">Identidad Corporativa</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Nombre Oficial de la Tienda</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-slate-700 text-white rounded-xl text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase">Logotipo Oficial</label>
                <div className="flex items-center gap-4">
                  <img src={logoUrl} alt="Logo" className="w-24 h-16 object-contain border border-slate-700 rounded-xl p-2 bg-[#0B1120]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, (url) => setLogoUrl(url))}
                    className="text-xs text-slate-400"
                  />
                </div>
              </div>
              <button
                onClick={() => showNotification('¡Parámetros de marca actualizados con éxito!')}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}