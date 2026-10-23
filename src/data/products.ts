// src/data/products.ts
export interface Product {
  id: string;
  title: string;
  price: number;
  badge?: string;
  images: string[];
  description: string;
  features: string[];
  paymentMethods: string[];
  category: string;
  stock?: number;
}

export const products: Product[] = [
  {
    id: 'bk-1001',
    title: 'Mini UPS Smart 12V para Router y Módem',
    price: 35.00,
    badge: 'Oferta',
    category: 'ENERGIA',
    stock: 120,
    images: ['/products/minupssmart12vpararouterymodem-smarthome.jpg'],
    description: 'Mini UPS Smart 12V de última generación diseñado para mantener operativo tu router, módem y fibra óptica durante cortes eléctricos.',
    features: [
      'Voltaje: 12V DC estabilizado',
      'Autonomía de 4 a 6 horas continuas',
      'Protección contra sobrecarga y cortocircuito',
      'Transición en 0 ms sin reinicio de equipos',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1002',
    title: 'Mini UPS de Litio Alta Capacidad 10000mAh con Salida USB/DC',
    price: 60.00,
    badge: 'Envío Gratis',
    category: 'ENERGIA',
    stock: 85,
    images: ['/products/miniupsdelitiodealtacapacidadconsalidausb-smarthome.jpg'],
    description: 'Sistema de respaldo de litio de alta densidad para routers duales, antenas y equipos de telecomunicaciones.',
    features: [
      'Batería de Litio de 10.000mAh',
      'Salidas simultáneas 5V USB / 9V / 12V DC',
      'Pantalla LED indicadora de carga',
      'Hasta 15 horas de respaldo continuo',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1003',
    title: 'Protector de Voltaje Inteligente con Batería Interna',
    price: 28.00,
    badge: 'Oferta',
    category: 'ENERGIA',
    stock: 200,
    images: ['/products/protectordevoltajeinteligenteconbateria-smarthome.jpg'],
    description: 'Protector electrónico inteligente contra fluctuaciones de tensión con respaldo integrado para equipos sensibles.',
    features: [
      'Rango de operación 90V - 250V AC',
      'Batería interna de 3000mAh',
      'Supresor de picos de grado industrial',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1004',
    title: 'Respaldo de Energía DC Multi-Voltaje para Cámaras y Herramientas',
    price: 45.00,
    badge: 'Oferta',
    category: 'HERRAMIENTAS',
    stock: 64,
    images: ['/products/respaldodeenergiadcparacamaras-gadgets.jpg'],
    description: 'Fuente de poder ininterrumpida para sistemas CCTV, bancos de trabajo e instrumentación técnica.',
    features: [
      'Salidas múltiples 5V, 9V y 12V',
      'Batería LiFePO4 de larga vida útil',
      'Gestión térmica inteligente para uso 24/7',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1005',
    title: 'Kit Industrial de Precisión y Diagnóstico Electrónico Pro',
    price: 55.00,
    badge: 'Envío Gratis',
    category: 'FERRETERIA',
    stock: 90,
    images: ['/products/respaldodeenergiadcparacamaras-gadgets.jpg'],
    description: 'Equipamiento de ferretería técnica e industrial de alto torque y aislamiento certificado.',
    features: [
      'Aleación cromo-vanadio de alta resistencia',
      'Aislamiento dieléctrico certificado',
      'Estuche rígido organizador de impacto',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1006',
    title: 'AirPods Pro (2ª Generación) Cancelación Activa de Ruido',
    price: 249.00,
    badge: 'Envío Gratis',
    category: 'SONIDO',
    stock: 40,
    images: ['/products/airpodspro2dageneracion-audio.jpg'],
    description: 'Auriculares inalámbricos profesionales con cancelación activa de ruido y audio espacial adaptativo.',
    features: [
      'Cancelación activa de ruido 2x',
      'Modo ambiente adaptativo',
      'Hasta 30 horas de autonomía con estuche MagSafe',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1007',
    title: 'iPhone 15 Pro Max Titanio 256GB Conectividad 5G / Wi-Fi 6E',
    price: 1200.00,
    badge: 'Envío Gratis',
    category: 'COMPUTACIONYCONECTIVIDAD',
    stock: 15,
    images: ['/products/iphone15promaxtitanio256gb-phones.jpg'],
    description: 'Terminal de alto rendimiento con chasis de titanio, chip A17 Pro y conectividad de alta velocidad.',
    features: [
      'Pantalla Super Retina XDR OLED 6.7"',
      'Puerto USB-C 3 con transferencia de 10Gb/s',
      'Conectividad Wi-Fi 6E y 5G de banda ancha',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1008',
    title: 'Arrancador Portátil y Banco de Energía Automotriz 12V',
    price: 78.00,
    badge: 'Envío Gratis',
    category: 'AUTOMOTRIZ',
    stock: 50,
    images: ['/products/miniupsdelitiodealtacapacidadconsalidausb-smarthome.jpg'],
    description: 'Auxiliar de arranque portátil de alto amperaje con linterna de emergencia y puertos de carga rápida.',
    features: [
      'Corriente pico para motores a gasolina y diésel',
      'Pinzas inteligentes con protección de polaridad inversa',
      'Salidas USB Quick Charge 3.0',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1009',
    title: 'Consola PlayStation 5 Edición de Disco 1TB Ultra HD',
    price: 499.00,
    badge: 'Envío Gratis',
    category: 'HOGARYOFICINA',
    stock: 22,
    images: ['/products/playstation5ediciondedisco1tb-gaming.jpg'],
    description: 'Centro de entretenimiento de última generación con almacenamiento SSD ultrarrápido y gráficos 4K 120Hz.',
    features: [
      'Almacenamiento 1TB SSD NVMe personalizado',
      'Salida HDMI 2.1 hasta 4K 120fps',
      'Control inalámbrico DualSense con respuesta háptica',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1010',
    title: 'Estación de Diagnóstico y Alimentación Regulada para Laboratorio',
    price: 68.00,
    badge: 'Envío Gratis',
    category: 'SERVICIOTECNICO',
    stock: 35,
    images: ['/products/protectordevoltajeinteligenteconbateria-smarthome.jpg'],
    description: 'Equipo estabilizado para laboratorios de microelectrónica y servicio técnico especializado.',
    features: [
      'Regulación electrónica de alta precisión',
      'Protección automática contra cortocircuitos',
      'Lectura digital de voltaje y amperaje',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
  {
    id: 'bk-1011',
    title: 'Apple Watch Ultra 2 Titanio GPS + Monitoreo Pro',
    price: 799.00,
    badge: 'Envío Gratis',
    category: 'CREADORDECONTENIDO',
    stock: 18,
    images: ['/products/applewatchultra2titanio-gadgets.jpg'],
    description: 'Wearable profesional con caja de titanio de 49mm, pantalla de 3000 nits y micrófonos con aislamiento de viento.',
    features: [
      'Pantalla Retina siempre activa de 3000 nits',
      'Matriz de tres micrófonos con reducción de ruido',
      'Batería de hasta 72 horas en modo de bajo consumo',
    ],
    paymentMethods: ['Pago Móvil', 'Zelle', 'Efectivo', 'Binance Pay'],
  },
];