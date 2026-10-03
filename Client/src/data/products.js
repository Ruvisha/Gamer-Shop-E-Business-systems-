export const categories = [
  { id: 'all', name: 'All Products', icon: 'LayoutGrid', count: 24 },
  { id: 'gpu', name: 'Graphics Cards', icon: 'Cpu', count: 6 },
  { id: 'cpu', name: 'Processors', icon: 'Zap', count: 5 },
  { id: 'ram', name: 'RAM & Memory', icon: 'MemoryStick', count: 3 },
  { id: 'mb', name: 'Motherboards', icon: 'CircuitBoard', count: 4 },
  { id: 'storage', name: 'SSDs & Storage', icon: 'HardDrive', count: 3 },
  { id: 'cooling', name: 'Liquid Cooling', icon: 'Fan', count: 3 },
  { id: 'psu', name: 'Power Supplies', icon: 'BatteryCharging', count: 2 },
  { id: 'case', name: 'PC Cases', icon: 'Box', count: 3 },
];

export const products = [
  // GPUs
  {
    id: 'gpu-1',
    name: 'ROG Strix GeForce RTX 4090 OC Edition 24GB',
    category: 'gpu',
    brand: 'ASUS',
    price: 1999.99,
    originalPrice: 2199.99,
    rating: 4.9,
    reviewsCount: 142,
    stock: 5,
    wattage: 450,
    isFlashSale: true,
    isFeatured: true,
    tag: 'ULTRA HIGH',
    specs: {
      memory: '24GB GDDR6X',
      clockSpeed: '2640 MHz',
      cudaCores: '16384',
      interface: 'PCIe 4.0 x16',
      recommendedPsu: '850W'
    },
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'The ROG Strix GeForce RTX 4090 brings a whole new meaning to going with the flow. Inside and out, every element of the card gives the monstrous GPU leeway to breathe freely and achieve ultimate performance.'
  },
  {
    id: 'gpu-2',
    name: 'MSI Gaming X Slim GeForce RTX 4080 SUPER 16GB',
    category: 'gpu',
    brand: 'MSI',
    price: 1049.99,
    originalPrice: 1149.99,
    rating: 4.8,
    reviewsCount: 98,
    stock: 12,
    wattage: 320,
    isFlashSale: true,
    isFeatured: true,
    tag: 'POPULAR',
    specs: {
      memory: '16GB GDDR6X',
      clockSpeed: '2610 MHz',
      cudaCores: '10240',
      interface: 'PCIe 4.0 x16',
      recommendedPsu: '750W'
    },
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'GAMING Slim is a thinner variant of the GAMING series while maintaining high performance capabilities and aggressive aesthetic looks with TRI FROZR 3 thermal design.'
  },
  {
    id: 'gpu-3',
    name: 'Gigabyte Radeon RX 7900 XTX Gaming OC 24GB',
    category: 'gpu',
    brand: 'GIGABYTE',
    price: 929.99,
    originalPrice: 999.99,
    rating: 4.7,
    reviewsCount: 76,
    stock: 8,
    wattage: 355,
    isFlashSale: false,
    isFeatured: false,
    tag: 'AMD FLAGSHIP',
    specs: {
      memory: '24GB GDDR6',
      clockSpeed: '2525 MHz',
      streamProcessors: '6144',
      interface: 'PCIe 4.0 x16',
      recommendedPsu: '800W'
    },
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    description: 'Powered by AMD RDNA 3 architecture featuring 24GB GDDR6 384-bit memory interface, WINDFORCE cooling system, RGB Fusion, and dual BIOS.'
  },
  {
    id: 'gpu-4',
    name: 'ZOTAC Gaming GeForce RTX 4070 Ti SUPER Trinity 16GB',
    category: 'gpu',
    brand: 'ZOTAC',
    price: 799.99,
    originalPrice: 849.99,
    rating: 4.6,
    reviewsCount: 54,
    stock: 15,
    wattage: 285,
    isFlashSale: false,
    isFeatured: true,
    tag: 'BEST VALUE 1440P',
    specs: {
      memory: '16GB GDDR6X',
      clockSpeed: '2610 MHz',
      cudaCores: '8448',
      interface: 'PCIe 4.0 x16',
      recommendedPsu: '700W'
    },
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    description: 'A balanced aerodynamic-inspired design, the ZOTAC GAMING GeForce RTX 4070 Ti SUPER Trinity 16GB utilizes the world-class NVIDIA Ada Lovelace architecture.'
  },

  // CPUs
  {
    id: 'cpu-1',
    name: 'AMD Ryzen 9 7950X3D 16-Core 32-Thread Processor',
    category: 'cpu',
    brand: 'AMD',
    price: 629.99,
    originalPrice: 699.99,
    rating: 4.9,
    reviewsCount: 115,
    stock: 7,
    wattage: 120,
    isFlashSale: true,
    isFeatured: true,
    tag: 'BEST GAMING CPU',
    specs: {
      coresThreads: '16 Cores / 32 Threads',
      boostClock: '5.7 GHz',
      cache: '144MB L3 3D V-Cache',
      socket: 'AM5',
      pcieVersion: 'PCIe 5.0'
    },
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    description: 'The ultimate gaming processor featuring revolutionary AMD 3D V-Cache technology for massive gaming performance boosts in demanding esports & AAA titles.'
  },
  {
    id: 'cpu-2',
    name: 'Intel Core i9-14900KS 24-Core Desktop Processor',
    category: 'cpu',
    brand: 'Intel',
    price: 689.99,
    originalPrice: 749.99,
    rating: 4.8,
    reviewsCount: 84,
    stock: 4,
    wattage: 253,
    isFlashSale: false,
    isFeatured: true,
    tag: '6.2 GHz FREQUENCY',
    specs: {
      coresThreads: '24 Cores (8P+16E) / 32 Threads',
      boostClock: '6.2 GHz Max',
      cache: '36MB Smart Cache',
      socket: 'LGA 1700',
      pcieVersion: 'PCIe 5.0'
    },
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    description: 'Push your limits with unprecedented clock speeds up to 6.2 GHz out of the box. Engineered for enthusiasts, overclockers, and hardcore gamers.'
  },
  {
    id: 'cpu-3',
    name: 'AMD Ryzen 7 7800X3D 8-Core 16-Thread Processor',
    category: 'cpu',
    brand: 'AMD',
    price: 369.99,
    originalPrice: 449.99,
    rating: 5.0,
    reviewsCount: 310,
    stock: 22,
    wattage: 120,
    isFlashSale: true,
    isFeatured: true,
    tag: '#1 SELLER',
    specs: {
      coresThreads: '8 Cores / 16 Threads',
      boostClock: '5.0 GHz',
      cache: '104MB Cache',
      socket: 'AM5',
      pcieVersion: 'PCIe 5.0'
    },
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    description: 'The world\'s undisputed favorite gaming CPU. High FPS gaming, low power draw, and incredible efficiency packed into AMD AM5 socket.'
  },
  {
    id: 'cpu-4',
    name: 'Intel Core i7-14700K 20-Core Desktop Processor',
    category: 'cpu',
    brand: 'Intel',
    price: 389.99,
    originalPrice: 419.99,
    rating: 4.7,
    reviewsCount: 92,
    stock: 14,
    wattage: 225,
    isFlashSale: false,
    isFeatured: false,
    tag: 'SWEET SPOT',
    specs: {
      coresThreads: '20 Cores (8P+12E) / 28 Threads',
      boostClock: '5.6 GHz',
      cache: '33MB Cache',
      socket: 'LGA 1700',
      pcieVersion: 'PCIe 5.0'
    },
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    description: 'Dynamic architecture pairing performance cores with efficient cores for seamless multi-tasking, streaming, and high frame rate gaming.'
  },

  // RAM
  {
    id: 'ram-1',
    name: 'Corsair Dominator Titanium RGB DDR5 64GB (2x32GB) 6000MHz',
    category: 'ram',
    brand: 'Corsair',
    price: 299.99,
    originalPrice: 339.99,
    rating: 4.9,
    reviewsCount: 63,
    stock: 10,
    wattage: 15,
    isFlashSale: false,
    isFeatured: true,
    tag: 'PREMIUM RGB',
    specs: {
      capacity: '64GB (2 x 32GB)',
      speed: 'DDR5-6000 MHz',
      latency: 'CL30',
      voltage: '1.4V',
      rgb: 'Dynamic 11-Zone Capellix RGB'
    },
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    description: 'Clean elegant styling meets forged aluminum construction and custom top bars. Advanced IC tuning ensures extreme overclocking headroom.'
  },
  {
    id: 'ram-2',
    name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 7200MHz',
    category: 'ram',
    brand: 'G.SKILL',
    price: 169.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewsCount: 145,
    stock: 18,
    wattage: 12,
    isFlashSale: true,
    isFeatured: false,
    tag: 'ULTRA FAST',
    specs: {
      capacity: '32GB (2 x 16GB)',
      speed: 'DDR5-7200 MHz',
      latency: 'CL34',
      voltage: '1.4V',
      rgb: 'Customizable Streamlined Light Bar'
    },
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    description: 'Designed for hyper performance on modern DDR5 platforms. Features sleek aluminum heatspreaders with hyper translucent RGB illumination.'
  },

  // Motherboards
  {
    id: 'mb-1',
    name: 'ASUS ROG Maximus Z790 Dark Hero Wi-Fi 7',
    category: 'mb',
    brand: 'ASUS',
    price: 649.99,
    originalPrice: 699.99,
    rating: 4.9,
    reviewsCount: 42,
    stock: 6,
    wattage: 50,
    isFlashSale: false,
    isFeatured: true,
    tag: 'FLAGSHIP Z790',
    specs: {
      socket: 'LGA 1700',
      chipset: 'Intel Z790',
      formFactor: 'ATX',
      memorySlots: '4x DDR5 (Up to 8000+ MT/s)',
      wireless: 'Wi-Fi 7 + 2.5G LAN'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Stealthy dark aesthetic, robust power delivery, ultra-fast PCIe 5.0 M.2 slots, Wi-Fi 7 networking, and ROG Polymo lighting shroud.'
  },
  {
    id: 'mb-2',
    name: 'MSI MAG X670E Tomahawk WiFi AM5 Motherboard',
    category: 'mb',
    brand: 'MSI',
    price: 279.99,
    originalPrice: 319.99,
    rating: 4.7,
    reviewsCount: 88,
    stock: 14,
    wattage: 45,
    isFlashSale: true,
    isFeatured: false,
    tag: 'AM5 VALUE KING',
    specs: {
      socket: 'AM5',
      chipset: 'AMD X670E',
      formFactor: 'ATX',
      memorySlots: '4x DDR5 (Up to 7800+ OC)',
      wireless: 'Wi-Fi 6E + 2.5G LAN'
    },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Built for high performance AMD Ryzen 7000 & 8000 processors. Features heavy plated heat spreaders and PCIe 5.0 expansion.'
  },

  // Storage
  {
    id: 'storage-1',
    name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD with Heatsink',
    category: 'storage',
    brand: 'Samsung',
    price: 179.99,
    originalPrice: 229.99,
    rating: 4.9,
    reviewsCount: 420,
    stock: 35,
    wattage: 10,
    isFlashSale: true,
    isFeatured: true,
    tag: '7450 MB/s READ',
    specs: {
      capacity: '2TB',
      interface: 'PCIe Gen 4.0 x4, NVMe 2.0',
      readSpeed: '7,450 MB/s',
      writeSpeed: '6,900 MB/s',
      formFactor: 'M.2 2280'
    },
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    description: 'Blistering sequential speed and thermal control thanks to custom nickel-coated controller and built-in smart heatsink.'
  },
  {
    id: 'storage-2',
    name: 'Crucial T700 2TB PCIe 5.0 NVMe M.2 SSD',
    category: 'storage',
    brand: 'Crucial',
    price: 269.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewsCount: 71,
    stock: 9,
    wattage: 12,
    isFlashSale: false,
    isFeatured: false,
    tag: 'GEN5 12400 MB/s',
    specs: {
      capacity: '2TB',
      interface: 'PCIe Gen 5.0 x4',
      readSpeed: '12,400 MB/s',
      writeSpeed: '11,800 MB/s',
      formFactor: 'M.2 2280'
    },
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    description: 'Next generation speeds over twice as fast as PCIe 4.0 drives. Perfect for fast DirectStorage gaming loading screens.'
  },

  // Cooling
  {
    id: 'cooling-1',
    name: 'NZXT Kraken Elite 360 RGB LCD Liquid Cooler',
    category: 'cooling',
    brand: 'NZXT',
    price: 289.99,
    originalPrice: 319.99,
    rating: 4.9,
    reviewsCount: 165,
    stock: 8,
    wattage: 20,
    isFlashSale: false,
    isFeatured: true,
    tag: 'CUSTOM LCD DISPLAY',
    specs: {
      radiatorSize: '360mm',
      fans: '3x 120mm F120 RGB Core Fans',
      screen: '2.36" Wide-Angle IPS LCD',
      compatibility: 'Intel LGA 1700 / AMD AM5, AM4',
      pumpSpeed: '800 - 2,800 RPM'
    },
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    description: 'Display favorite GIFs, system stats, or custom images on a crisp high-res 60Hz display while cooling high TDP CPUs efficiently.'
  },
  {
    id: 'cooling-2',
    name: 'CORSAIR iCUE LINK H150i LCD Liquid CPU Cooler',
    category: 'cooling',
    brand: 'Corsair',
    price: 274.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewsCount: 94,
    stock: 11,
    wattage: 22,
    isFlashSale: true,
    isFeatured: false,
    tag: 'SINGLE CABLE LINK',
    specs: {
      radiatorSize: '360mm',
      fans: '3x QX120 RGB Magnetic Dome Fans',
      screen: '2.1" IPS LCD Display',
      compatibility: 'LGA 1700, 1200, AM5, AM4',
      noiseLevel: '10 - 37 dBA'
    },
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    description: 'Revolutionary single cable system reduces cable clutter down to zero. High static pressure magnetic levitation fans.'
  },

  // PSUs
  {
    id: 'psu-1',
    name: 'Corsair RM1000x SHIFT Fully Modular ATX 3.0 Power Supply',
    category: 'psu',
    brand: 'Corsair',
    price: 189.99,
    originalPrice: 209.99,
    rating: 4.9,
    reviewsCount: 180,
    stock: 20,
    wattage: 0,
    isFlashSale: false,
    isFeatured: true,
    tag: 'ATX 3.0 / PCIe 5.0',
    specs: {
      wattage: '1000W',
      efficiency: '80 PLUS Gold Certified',
      modular: 'Fully Modular Side Cable Interface',
      fanSize: '140mm Fluid Dynamic Bearing',
      warranty: '10 Years'
    },
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Innovative side-mounted cable connection panel makes plugging in modular cables quick and convenient.'
  },

  // Cases
  {
    id: 'case-1',
    name: 'LIAN LI O11 Dynamic EVO RGB Mid-Tower Case',
    category: 'case',
    brand: 'LIAN LI',
    price: 169.99,
    originalPrice: 189.99,
    rating: 5.0,
    reviewsCount: 290,
    stock: 16,
    wattage: 0,
    isFlashSale: true,
    isFeatured: true,
    tag: 'DUAL CHAMBER SHOWCASE',
    specs: {
      formSupport: 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      glass: 'Dual Seamless Tempered Glass Panels',
      radiatorSupport: 'Up to 3x 360mm Radiators',
      rgb: 'Dual L-Shaped ARGB Strips',
      dimensions: '478mm x 290mm x 471mm'
    },
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    description: 'The world famous showcase PC chassis. Features reversible layout design, dual chamber airflow, and customizable RGB accents.'
  },
  {
    id: 'case-2',
    name: 'HYTE Y70 Touch Infinite Dual-Chamber ATX Case with Touchscreen',
    category: 'case',
    brand: 'HYTE',
    price: 359.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviewsCount: 87,
    stock: 5,
    wattage: 0,
    isFlashSale: false,
    isFeatured: true,
    tag: '4K TOUCHSCREEN',
    specs: {
      formSupport: 'E-ATX, ATX, Micro-ATX, Mini-ITX',
      display: '14.5" 680x2560 60Hz 10-Point Touchscreen',
      gpuMount: 'Vertical 4-Slot Riser Included',
      radiatorSupport: 'Up to 360mm top & side',
      dimensions: '470mm x 320mm x 470mm'
    },
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Integrated 14.5" ultra-high resolution multi-touch display allows live performance monitoring, game HUD overlays, and custom animations.'
  }
];

export const reviews = [
  {
    id: 1,
    author: 'Alex "Vortex" Vance',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'Esports Streamer & Competitive Gamer',
    rating: 5,
    comment: 'Gamer Shop delivered my RTX 4090 and 7950X3D in less than 24 hours. The custom PC builder tool made checking motherboard & wattage compatibility effortless! My rig gets 360+ FPS effortlessly now.',
    verified: true,
    product: 'ROG Strix RTX 4090 OC'
  },
  {
    id: 2,
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: '3D Animator & PC Enthusiast',
    rating: 5,
    comment: 'The pricing on Gamer Shop is unbeatable! Saved over $300 on my full watercooled Lian Li build. Customer support answered my technical questions regarding PCIe 5.0 NVMe bandwidth instantly.',
    verified: true,
    product: 'LIAN LI O11 Dynamic EVO RGB'
  },
  {
    id: 3,
    author: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    role: 'Hardware Overclocker',
    rating: 5,
    comment: 'Gamer Shop is the only vendor I trust for binned high-frequency DDR5 memory and flagship motherboard stock. Packaging was bomb-proof and double buffered.',
    verified: true,
    product: 'G.Skill Trident Z5 7200MHz'
  }
];
