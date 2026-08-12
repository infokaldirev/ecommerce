import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Fallback Combos Data in Bolivianos
// Fallback Combos Data in Bolivianos
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Energía", slug: "energia" },
  { id: 2, name: "Bienestar", slug: "bienestar" },
  { id: 3, name: "Saludable", slug: "saludable" },
  { id: 4, name: "Café", slug: "cafe" },
  { id: 5, name: "Belleza", slug: "belleza" }
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Cordycafe Tiens",
    price_bs: 188.5,
    original_price_bs: 220,
    category_id: 4,
    description: "Café instantáneo gourmet elaborado con granos seleccionados y adicionado con polvo de micelio de hongo Cordyceps Sinensis.",
    bullets: [
      "Energía natural de larga duración sin nerviosismo",
      "Fortalece la función pulmonar y renal",
      "Apoya al sistema inmune y rendimiento físico"
    ],
    dosage: "Disolver 1 sobre en una taza de agua caliente por la mañana.",
    package_detail: "Caja conteniendo 12 sobres de 15g cada uno.",
    badge: "Popular",
    tagline: "Tu café con energía natural y salud",
    pinned: true
  },
  {
    id: 2,
    name: "Calcio Nutritivo Tiens",
    price_bs: 260,
    original_price_bs: 300,
    category_id: 2,
    description: "Suplemento dietario de calcio en polvo de alta absorción biológica, enriquecido con vitaminas, minerales y aminoácidos.",
    bullets: [
      "Tasa de absorción superior al 95% patentada",
      "Fortalece la estructura ósea y dientes",
      "Previene calambres y dolores articulares"
    ],
    dosage: "Disolver 1 sobre en media taza de agua tibia antes de acostarse.",
    package_detail: "Caja con sobres individuales sellados herméticamente de 10g cada uno.",
    badge: "Más Vendido",
    tagline: "Huesos fuertes y vitalidad diaria",
    pinned: true
  },
  {
    id: 3,
    name: "Té Tianshi",
    price_bs: 260,
    original_price_bs: 300,
    category_id: 1,
    description: "Té herbal tradicional formulado con hojas de té verde y extractos naturales para la desintoxicación celular.",
    bullets: [
      "Potente antioxidante y desintoxicador natural",
      "Ayuda a regular el colesterol y triglicéridos",
      "Promueve una digestión saludable"
    ],
    dosage: "Hervir 1 sobre en un litro de agua y tomar como agua de tiempo.",
    package_detail: "Caja conteniendo sobres filtrantes con doble empaque sellado.",
    badge: "Detox",
    tagline: "Limpia, desintoxica y renueva tu cuerpo",
    pinned: false
  },
  {
    id: 4,
    name: "Calcio para Niños",
    price_bs: 260,
    original_price_bs: 300,
    category_id: 2,
    description: "Fórmula de calcio en polvo enriquecida para apoyar el sano desarrollo óseo e intelectual de los niños.",
    bullets: [
      "Apoya el desarrollo físico y el crecimiento óseo",
      "Enriquecido con taurina, lecitina y vitaminas esenciales",
      "Apoya al desarrollo intelectual y memoria infantil"
    ],
    dosage: "Disolver 1 sobre en media taza de agua tibia antes de dormir.",
    package_detail: "Caja conteniendo 10 sobres de 10g cada uno.",
    badge: "Infantil",
    tagline: "Crecimiento fuerte y desarrollo inteligente",
    pinned: false
  },
  {
    id: 5,
    name: "Spakare Aceite Corporal",
    price_bs: 249.6,
    original_price_bs: 290,
    category_id: 5,
    description: "Aceite corporal nutritivo con extractos de hierbas y aceites esenciales para la suavidad de la piel.",
    bullets: [
      "Hidratación profunda sin efecto grasoso",
      "Ideal para masajes y alivio de tensión muscular",
      "Combate la resequedad de la piel"
    ],
    dosage: "Aplicar sobre la piel limpia y masajear suavemente hasta absorber.",
    package_detail: "Botella dispensadora premium sellada de fábrica.",
    badge: "Cuidado Piel",
    tagline: "Suavidad e hidratación profunda",
    pinned: true
  },
  {
    id: 6,
    name: "Gel Rejuvenecedor Tiens",
    price_bs: 313.3,
    original_price_bs: 360,
    category_id: 5,
    description: "Gel facial tensor enriquecido con extractos de plantas naturales para una piel más firme y radiante.",
    bullets: [
      "Efecto tensor inmediato que disminuye líneas",
      "Estimula la producción de colágeno",
      "Fórmula refrescante e hidratante"
    ],
    dosage: "Aplicar unas gotas sobre el rostro limpio por la mañana y noche.",
    package_detail: "Frasco premium con dosificador sellado.",
    badge: "Antiedad",
    tagline: "Juventud y firmeza en tu rostro",
    pinned: true
  }
];

const DEFAULT_PRODUCT_IMAGES = [
  { id: 1, product_id: 1, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840055/A75_vzmmrq.png', position: 0, is_video: false },
  { id: 2, product_id: 1, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1774966537/video-1005263159337962_zpdaac.mp4', position: 1, is_video: true },
  { id: 3, product_id: 2, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840051/A01_zf5hc8.png', position: 0, is_video: false },
  { id: 4, product_id: 2, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775017763/create-a-hyper-realistic-video-of-a-nutritional-ca_uienjb.mp4', position: 1, is_video: true },
  { id: 5, product_id: 3, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840052/A05_eazlgz.png', position: 0, is_video: false },
  { id: 6, product_id: 3, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775064602/quiero-que-las-imagenes-dentro-del-producto-se-mue_b3bqjw.mp4', position: 1, is_video: true },
  { id: 7, product_id: 4, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840051/A03_huuq0n.png', position: 0, is_video: false },
  { id: 8, product_id: 4, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775017763/video-1055317540999190_ian3cg.mp4', position: 1, is_video: true },
  { id: 9, product_id: 5, url: 'products/belleza_antienvejecimiento.png', position: 0, is_video: false },
  { id: 10, product_id: 6, url: 'products/belleza_antienvejecimiento.png', position: 0, is_video: false }
];

const DEFAULT_COMBOS = [
  {
    id: 1,
    name: "Kit Energía Diaria",
    price_bs: 55,
    original_price_bs: 75,
    description: "El pack ideal para comenzar tus mañanas con enfoque total. Incluye 2 sobres de café gourmet Cordycafe y 3 sobres del digestivo Té Tianshi.",
    badge: "Más Vendido",
    tagline: "Energía y enfoque natural al instante",
    pinned: true
  },
  {
    id: 2,
    name: "Kit Bienestar & Huesos",
    price_bs: 85,
    original_price_bs: 110,
    description: "Combina el poder de absorción del Calcio Nutritivo de Tiens con la vitalidad y calor del hongo Cordycafe. Incluye 1 sobre de Calcio y 2 sobres de Cordycafe.",
    badge: "Recomendado",
    tagline: "Huesos fuertes y vitalidad física diaria",
    pinned: true
  },
  {
    id: 3,
    name: "Kit Antojo Saludable",
    price_bs: 50,
    original_price_bs: 65,
    description: "Una forma exquisita de cuidar tus ojos del cansancio de pantallas. Bolsa kraft sellada herméticamente conteniendo 10 tabletas masticables de Luteína.",
    badge: "Exclusivo",
    tagline: "Protección visual con delicioso sabor natural",
    pinned: false
  }
];

const DEFAULT_COMBO_PRODUCTS = [
  { combo_id: 1, product_id: 1, quantity: 2 },
  { combo_id: 1, product_id: 3, quantity: 3 },
  { combo_id: 2, product_id: 2, quantity: 1 },
  { combo_id: 2, product_id: 1, quantity: 2 },
  { combo_id: 3, product_id: 4, quantity: 1 }
];

function App() {
  // Database states
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productStocks, setProductStocks] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
  // App configurations
  const [config, setConfig] = useState({
    whatsappNumber: "59163488086",
    exchangeRate: 6.96
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Auth states
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('kaldirev_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // UI Navigation states
  const [view, setView] = useState("catalog"); // "catalog", "details", or "admin"
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // UI Interactive states
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showAdminSaveToast, setShowAdminSaveToast] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState("dashboard"); // "dashboard", "config", "orders", "stocks", "extras"
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [countdownTime, setCountdownTime] = useState({ hours: 4, minutes: 32, seconds: 15 });
  const [flashDeal, setFlashDeal] = useState({
    title: "¡Llévate el Kit Energía Diaria con 25% OFF!",
    subtitle: "Potencia tus mañanas con Cordycafe y Té Tianshi.",
    discount_tag: "Oferta Relámpago del Día",
    hours: 4,
    minutes: 32,
    seconds: 15,
    combo_id: 1,
    is_active: true
  });
  const [socialProofOrder, setSocialProofOrder] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoActiveTab, setInfoActiveTab] = useState("mision"); // "mision" or "legal"
  
  // Orders history (fetched for Admin only)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState("Todos");

  // User Personal Orders History
  const [userOrders, setUserOrders] = useState([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const preloadedUrls = useRef(new Set());

  // Email/Password Auth Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  // Admin Passcode Lock state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Admin forms state
  const [editingCombo, setEditingCombo] = useState(null); // for editing/creating combos
  const [formStep, setFormStep] = useState(1);
  const [configSubTab, setConfigSubTab] = useState("products"); // "products" | "combos" | "settings"
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormStep, setProductFormStep] = useState(1);
  const [branches, setBranches] = useState([]);
  // Relational catalog states (comboStocks replaced by productStocks)
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrModalOrder, setQrModalOrder] = useState(null);
  const [qrTimer, setQrTimer] = useState(300);
  const [adminFormData, setAdminFormData] = useState({
    whatsappNumber: "",
    exchangeRate: 6.96
  });

  // Extras forms state (Testimonials and FAQs management)
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  // Checkout Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Santa Cruz',
    paymentMethod: 'Contraentrega',
    deliveryMethod: 'Local (Yango)',
    gpsCoordinates: ''
  });

  // Initialize Auth session & listen to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user);
        fetchUserOrders(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user);
        fetchUserOrders(session.user.id);
      } else {
        setProfile(null);
        setUserOrders([]); // Clear orders on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch public profile from Supabase with client-side fallback
  const fetchUserProfile = async (userId, currentUser = null) => {
    try {
      let { data: profilesList, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      let data = profilesList && profilesList.length > 0 ? profilesList[0] : null;
      
      if (!data) {
        const savedProfile = localStorage.getItem(`kaldirev_local_profile_${userId}`);
        if (savedProfile) {
          try {
            data = JSON.parse(savedProfile);
          } catch (e) {
            console.error("Error parsing saved profile:", e);
          }
        }
      }
      
      if (!data && currentUser) {
        const meta = currentUser.user_metadata || {};
        const newProfile = {
          id: userId,
          full_name: meta.full_name || meta.name || currentUser.email?.split('@')[0] || 'Cliente',
          email: currentUser.email,
          avatar_url: meta.avatar_url || meta.picture || '',
          phone: '',
          address: '',
          city: 'Santa Cruz'
        };
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        
        if (!insertError && insertedData) {
          data = insertedData;
        } else {
          console.warn("Could not write profile to Supabase (possibly RLS restriction). Utilizing local profile fallback.", insertError);
          data = newProfile;
          localStorage.setItem(`kaldirev_local_profile_${userId}`, JSON.stringify(newProfile));
        }
      }

      if (data) {
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          name: prev.name || data.full_name || '',
          phone: prev.phone || data.phone || '',
          address: prev.address || data.address || '',
          city: prev.city || data.city || 'Santa Cruz'
        }));
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Save changes to user profile
  const saveUserProfile = async (updatedFields) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updatedFields,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      const savedProfile = localStorage.getItem(`kaldirev_local_profile_${user.id}`);
      let currentLocal = {};
      if (savedProfile) {
        try { currentLocal = JSON.parse(savedProfile); } catch (e) {}
      }
      const newLocal = { ...currentLocal, ...updatedFields, id: user.id };
      localStorage.setItem(`kaldirev_local_profile_${user.id}`, JSON.stringify(newLocal));
      
      setProfile(newLocal);
      setFormData(prev => ({
        ...prev,
        name: newLocal.full_name || prev.name || '',
        phone: newLocal.phone || prev.phone || '',
        address: newLocal.address || prev.address || '',
        city: newLocal.city || prev.city || 'Santa Cruz'
      }));

      if (!error) {
        fetchUserProfile(user.id, user);
        fetchUserOrders(user.id);
      } else {
        console.warn("Could not save profile changes to remote DB (likely RLS policy active). Local copy updated.", error);
      }
    } catch (err) {
      console.error("Error saving user profile:", err);
    }
  };

  // Helper to check if URL is a video (MP4, WebM, etc.)
  const isVideoUrl = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.ogv') ||
           url.toLowerCase().endsWith('.mov') ||
           url.includes('/video/upload/');
  };

  // Helper to get stock of a product in a branch
  const getProductStock = (productId, branchId) => {
    const stockObj = productStocks.find(s => s.product_id === productId && s.branch_id === branchId);
    return stockObj ? stockObj.stock : 0;
  };

  // Helper to get stock of a combo in a branch (dynamically calculated)
  const getComboStock = (comboId, branchId) => {
    const linked = comboProducts.filter(cp => cp.combo_id === comboId);
    if (linked.length === 0) return 0;
    let minStock = Infinity;
    for (const cp of linked) {
      const pStock = getProductStock(cp.product_id, branchId);
      const possibleCombos = Math.floor(pStock / cp.quantity);
      if (possibleCombos < minStock) {
        minStock = possibleCombos;
      }
    }
    return minStock === Infinity ? 0 : minStock;
  };

  // Helper to get stock of a combo in the selected sucursal/branch
  const getComboStockForSelectedBranch = (comboId) => {
    if (!selectedBranch) return 0;
    return getComboStock(comboId, selectedBranch.id);
  };

  // Helper to get total stock of a combo across all Bolivian sucursales
  const getComboTotalStock = (comboId) => {
    return branches.reduce((acc, branch) => acc + getComboStock(comboId, branch.id), 0);
  };

  // Helper to get total stock of a product across all branches
  const getProductTotalStock = (productId) => {
    return productStocks
      .filter(s => s.product_id === productId)
      .reduce((acc, curr) => acc + curr.stock, 0);
  };

  // Helper to get the main image of a product
  const getProductImage = (productId) => {
    const img = productImages.find(i => String(i.product_id) === String(productId) && !i.is_video);
    return img ? img.url : '';
  };

  // Helper to resolve local and remote asset URLs (Added by Antigravity)
  const resolveAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanUrl = url.replace(/^\//, '');
    const base = import.meta.env.BASE_URL || '/';
    return `${base.endsWith('/') ? base : base + '/'}${cleanUrl}`;
  };

  // Helper to get the main image of a combo dynamically (Added by Antigravity)
  const getComboImage = (comboId) => {
    const linked = comboProducts.filter(cp => String(cp.combo_id) === String(comboId));
    if (linked.length > 0) {
      const prod = products.find(p => String(p.id) === String(linked[0].product_id));
      if (prod) {
        const img = productImages.find(i => String(i.product_id) === String(prod.id) && !i.is_video);
        if (img) return img.url;
        return prod.image_url;
      }
    }
    if (comboId === 1) return "products/kit_energia_diaria.jpg";
    if (comboId === 2) return "products/kit_bienestar_huesos.jpg";
    if (comboId === 3) return "products/kit_antojo_saludable.jpg";
    return "";
  };

  // Dynamic Image Preloading Algorithm to speed up image rendering (Added by Antigravity)
  useEffect(() => {
    if (products.length > 0) {
      products.forEach(p => {
        const imgUrl = getProductImage(p.id) || p.image_url;
        if (imgUrl) {
          const resolvedUrl = resolveAssetUrl(imgUrl);
          if (!preloadedUrls.current.has(resolvedUrl)) {
            preloadedUrls.current.add(resolvedUrl);
            const img = new Image();
            img.src = resolvedUrl;
          }
        }
      });
    }
    if (combos.length > 0) {
      combos.forEach(c => {
        const imgUrl = getComboImage(c.id) || c.image_url;
        if (imgUrl) {
          const resolvedUrl = resolveAssetUrl(imgUrl);
          if (!preloadedUrls.current.has(resolvedUrl)) {
            preloadedUrls.current.add(resolvedUrl);
            const img = new Image();
            img.src = resolvedUrl;
          }
        }
      });
    }
  }, [products, combos, productImages]);

  // One-time database sync trigger for new products, Cloudinary images, videos, and stock levels (Added by Antigravity)
  const syncDatabaseItemsOnce = async () => {
    const hasSynced = localStorage.getItem('db_cloudinary_synced_v6');
    if (hasSynced) return;
    
    console.log("[Antigravity] Starting dynamic DB sync for Cloudinary assets...");
    try {
      // 1. Categories
      await supabase.from('categories').upsert([
        { id: 1, name: "Energía", slug: "energia" },
        { id: 2, name: "Bienestar", slug: "bienestar" },
        { id: 3, name: "Saludable", slug: "saludable" },
        { id: 4, name: "Café", slug: "cafe" },
        { id: 5, name: 'Belleza', slug: 'belleza', description: 'Cuidado corporal y rejuvenecimiento de la piel' }
      ]);
      
      // 2. Products
      const productsList = [
        {
          id: 1,
          name: 'Cordycafe Tiens',
          sku: 'TIENS-A75',
          slug: 'cordycafe-tiens',
          price_bs: 188.5,
          original_price_bs: 220,
          category_id: 4,
          description: 'Café instantáneo gourmet elaborado con granos seleccionados y adicionado con polvo de micelio de hongo Cordyceps Sinensis.',
          bullets: ['Energía natural de larga duración sin nerviosismo', 'Fortalece la función pulmonar y renal', 'Apoya al sistema inmune y rendimiento físico'],
          dosage: 'Disolver 1 sobre en una taza de agua caliente por la mañana.',
          package_detail: 'Caja conteniendo 12 sobres de 15g cada uno.',
          badge: 'Popular',
          tagline: 'Tu café con energía natural y salud',
          pinned: true
        },
        {
          id: 2,
          name: 'Calcio Nutritivo Tiens',
          sku: 'TIENS-A01',
          slug: 'calcio-nutritivo',
          price_bs: 260,
          original_price_bs: 300,
          category_id: 2,
          description: 'Suplemento dietario de calcio en polvo de alta absorción biológica, enriquecido con vitaminas, minerales y aminoácidos.',
          bullets: ['Tasa de absorción superior al 95% patentada', 'Fortalece la estructura ósea y dientes', 'Previene calambres y dolores articulares'],
          dosage: 'Disolver 1 sobre en media taza de agua tibia antes de acostarse.',
          package_detail: 'Caja con sobres individuales sellados herméticamente de 10g cada uno.',
          badge: 'Más Vendido',
          tagline: 'Huesos fuertes y vitalidad diaria',
          pinned: true
        },
        {
          id: 3,
          name: 'Té Tianshi',
          sku: 'TIENS-A05',
          slug: 'te-tianshi',
          price_bs: 260,
          original_price_bs: 300,
          category_id: 1,
          description: 'Té herbal tradicional formulado con hojas de té verde y extractos naturales para la desintoxicación celular.',
          bullets: ['Potente antioxidante y desintoxicador natural', 'Ayuda a regular el colesterol y triglicéridos', 'Promueve una digestión saludable'],
          dosage: 'Hervir 1 sobre en un litro de agua y tomar como agua de tiempo.',
          package_detail: 'Caja conteniendo sobres filtrantes con doble empaque sellado.',
          badge: 'Detox',
          tagline: 'Limpia, desintoxica y renueva tu cuerpo',
          pinned: false
        },
        {
          id: 4,
          name: 'Calcio para Niños',
          sku: 'TIENS-A03',
          slug: 'calcio-ninos',
          price_bs: 260,
          original_price_bs: 300,
          category_id: 2,
          description: 'Fórmula de calcio en polvo enriquecida para apoyar el sano desarrollo óseo e intelectual de los niños.',
          bullets: ['Apoya el desarrollo físico y el crecimiento óseo', 'Enriquecido con taurina, lecitina y vitaminas esenciales', 'Apoya al desarrollo intelectual y memoria infantil'],
          dosage: 'Disolver 1 sobre en media taza de agua tibia antes de dormir.',
          package_detail: 'Caja conteniendo 10 sobres de 10g cada uno.',
          badge: 'Infantil',
          tagline: 'Crecimiento fuerte y desarrollo inteligente',
          pinned: false
        },
        {
          id: 5,
          name: 'Spakare Aceite Corporal',
          sku: 'TIENS-C63',
          slug: 'spakare-aceite-corporal',
          price_bs: 249.6,
          original_price_bs: 290,
          category_id: 5,
          description: 'Aceite corporal nutritivo con extractos de hierbas y aceites esenciales para la suavidad de la piel.',
          bullets: ['Hidratación profunda sin efecto grasoso', 'Ideal para masajes y alivio de tensión muscular', 'Combate la resequedad de la piel'],
          dosage: 'Aplicar sobre la piel limpia y masajear suavemente hasta absorber.',
          package_detail: 'Botella dispensadora premium sellada de fábrica.',
          badge: 'Cuidado Piel',
          tagline: 'Suavidad e hidratación profunda',
          pinned: true
        },
        {
          id: 6,
          name: 'Gel Rejuvenecedor Tiens',
          sku: 'TIENS-C64',
          slug: 'gel-rejuvenecedor',
          price_bs: 313.3,
          original_price_bs: 360,
          category_id: 5,
          description: 'Gel facial tensor enriquecido con extractos de plantas naturales para una piel más firme y radiante.',
          bullets: ['Efecto tensor inmediato que disminuye líneas', 'Estimula la producción de colágeno', 'Fórmula refrescante e hidratante'],
          dosage: 'Aplicar unas gotas sobre el rostro limpio por la mañana y noche.',
          package_detail: 'Frasco premium con dosificador sellado.',
          badge: 'Antiedad',
          tagline: 'Juventud y firmeza en tu rostro',
          pinned: true
        }
      ];
      await supabase.from('products').upsert(productsList);
      
      // 3. Product Images & Videos
      const productImagesList = [
        { id: 1, product_id: 1, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840055/A75_vzmmrq.png', position: 0, is_video: false },
        { id: 2, product_id: 1, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1774966537/video-1005263159337962_zpdaac.mp4', position: 1, is_video: true },
        { id: 3, product_id: 2, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840051/A01_zf5hc8.png', position: 0, is_video: false },
        { id: 4, product_id: 2, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775017763/create-a-hyper-realistic-video-of-a-nutritional-ca_uienjb.mp4', position: 1, is_video: true },
        { id: 5, product_id: 3, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840052/A05_eazlgz.png', position: 0, is_video: false },
        { id: 6, product_id: 3, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775064602/quiero-que-las-imagenes-dentro-del-producto-se-mue_b3bqjw.mp4', position: 1, is_video: true },
        { id: 7, product_id: 4, url: 'https://res.cloudinary.com/dv6d41ect/image/upload/v1758840051/A03_huuq0n.png', position: 0, is_video: false },
        { id: 8, product_id: 4, url: 'https://res.cloudinary.com/dv6d41ect/video/upload/v1775017763/video-1055317540999190_ian3cg.mp4', position: 1, is_video: true },
        { id: 9, product_id: 5, url: 'products/belleza_antienvejecimiento.png', position: 0, is_video: false },
        { id: 10, product_id: 6, url: 'products/belleza_antienvejecimiento.png', position: 0, is_video: false }
      ];
      await supabase.from('product_images').upsert(productImagesList);
      
      // 4. Product Stocks per branch (Santa Cruz: 50, La Paz: 30, Cochabamba: 20)
      const stockList = [];
      productsList.forEach(p => {
        [1, 2, 3].forEach(b => {
          stockList.push({ product_id: p.id, branch_id: b, stock: b === 1 ? 50 : (b === 2 ? 30 : 20) });
        });
      });
      await supabase.from('product_stock').upsert(stockList);

      localStorage.setItem('db_cloudinary_synced_v6', 'true');
      console.log("[Antigravity] Database synced with Cloudinary assets successfully!");
    } catch (e) {
      console.error("[Antigravity] Failed to sync database items on startup:", e);
    }
  };

  // Helper to check if any item in cart is low stock or out of stock in selected branch
  const getOutOfStockItemsForCity = (cityName) => {
    if (!cityName) return [];
    const matchingBranch = branches.find(b => b.name.toLowerCase().includes(cityName.toLowerCase()));
    if (!matchingBranch) return [];
    return cart.filter(item => {
      const itemType = item.cartItemType || 'combo';
      if (itemType === 'product') {
        const stock = getProductStock(item.id, matchingBranch.id);
        return stock < item.quantity;
      } else {
        const stock = getComboStock(item.id, matchingBranch.id);
        return stock < item.quantity;
      }
    });
  };

  // Google Sign-In helper
  const handleGoogleLogin = async () => {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const cleanBase = base.startsWith('/') ? base : '/' + base;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + cleanBase
        }
      });
      if (error) throw error;
    } catch (err) {
      alert("Error al iniciar sesión con Google: " + err.message);
    }
  };

  // Email Sign-In helper
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Por favor, ingresa tu correo y contraseña.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      setIsAuthModalOpen(false);
      setAuthPassword("");
      setAuthEmail("");
    } catch (err) {
      setAuthError(err.message === "Invalid login credentials" ? "Credenciales incorrectas. Verifica tu correo y contraseña." : err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Email Sign-Up helper
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName) {
      setAuthError("Por favor, rellena todos los campos obligatorios.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: {
            full_name: authName
          }
        }
      });
      if (error) throw error;
      window.Swal.fire({
        title: '¡Registro completado!',
        text: 'Tu cuenta ha sido creada. Si la confirmación de correo está activa, verifica tu correo; de lo contrario, tu sesión se iniciará automáticamente.',
        icon: 'success',
        confirmButtonColor: 'var(--primary-green)'
      });
      setIsAuthModalOpen(false);
      setAuthPassword("");
      setAuthEmail("");
      setAuthName("");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign-Out helper
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  // Fetch all database store items
  const fetchStoreData = async () => {
    setLoading(true);
    try {
      // 1. Fetch settings
      const { data: settingsData } = await supabase.from('settings').select('*');
      let currentRate = 6.96;
      let currentPhone = "59163488086";
      let currentFlashDeal = {
        title: "¡Llévate el Kit Energía Diaria con 25% OFF!",
        subtitle: "Potencia tus mañanas con Cordycafe y Té Tianshi.",
        discount_tag: "Oferta Relámpago del Día",
        hours: 4,
        minutes: 32,
        seconds: 15,
        combo_id: 1,
        is_active: true
      };
      
      if (settingsData) {
        settingsData.forEach(item => {
          if (item.key === 'exchange_rate') currentRate = parseFloat(item.value);
          if (item.key === 'whatsapp_number') currentPhone = item.value;
          if (item.key === 'flash_deal') {
            try {
              const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
              if (val) currentFlashDeal = { ...currentFlashDeal, ...val };
            } catch (e) {
              console.error("Error parsing flash_deal setting:", e);
            }
          }
        });
      }
      
      setConfig({
        exchangeRate: currentRate,
        whatsappNumber: currentPhone
      });

      setAdminFormData({
        exchangeRate: currentRate,
        whatsappNumber: currentPhone
      });

      setFlashDeal(currentFlashDeal);
      setCountdownTime({
        hours: parseInt(currentFlashDeal.hours) || 0,
        minutes: parseInt(currentFlashDeal.minutes) || 0,
        seconds: parseInt(currentFlashDeal.seconds) || 0
      });

      // 2. Fetch branches
      const { data: branchesData } = await supabase.from('branches').select('*').order('id', { ascending: true });
      const branchesList = branchesData && branchesData.length > 0 ? branchesData : [
        { id: 1, name: "Santa Cruz", address: "Av. San Martín, Equipetrol, Santa Cruz", shipping_cost_bs: 12 },
        { id: 2, name: "La Paz", address: "Av. 16 de Julio, El Prado, La Paz", shipping_cost_bs: 15 },
        { id: 3, name: "Cochabamba", address: "Calle España, Zona Central, Cochabamba", shipping_cost_bs: 15 }
      ];
      setBranches(branchesList);
      
      // Set default branch to Santa Cruz (if exists) or first branch
      const defaultBranch = branchesList.find(b => b.name.toLowerCase().includes('santa cruz')) || branchesList[0];
      setSelectedBranch(prev => prev || defaultBranch);

      // 3. Fetch categories
      const { data: categoriesData } = await supabase.from('categories').select('*').order('id', { ascending: true });
      const finalCategories = categoriesData && categoriesData.length > 0 ? categoriesData : DEFAULT_CATEGORIES;
      setCategoriesList(finalCategories);

      // 4. Fetch product images
      const { data: imagesData } = await supabase.from('product_images').select('*').order('position', { ascending: true });
      const finalImages = imagesData && imagesData.length > 0 ? imagesData : DEFAULT_PRODUCT_IMAGES;
      setProductImages(finalImages);

      // 5. Fetch products
      const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true });
      const finalProducts = (productsData || []).map(p => {
        const mainImg = finalImages.find(img => String(img.product_id) === String(p.id) && !img.is_video);
        let imageUrl = mainImg ? mainImg.url : '';
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('products/') && !imageUrl.startsWith('/src/')) {
          imageUrl = `products/${imageUrl.replace(/^\//, '')}`;
        } else if (imageUrl && imageUrl.startsWith('/products/')) {
          imageUrl = imageUrl.substring(1);
        }
        return {
          ...p,
          image_url: imageUrl,
          price_bs: parseFloat(p.price_bs) || 0,
          original_price_bs: parseFloat(p.original_price_bs) || 0
        };
      });
      const finalProductsList = finalProducts.length > 0 ? finalProducts : DEFAULT_PRODUCTS;
      setProducts(finalProductsList);

      // 6. Fetch combos
      const { data: combosData } = await supabase.from('combos').select('*').order('id', { ascending: true });
      const finalCombos = (combosData || []).map(c => {
        return {
          ...c,
          price_bs: parseFloat(c.price_bs) || 0,
          original_price_bs: parseFloat(c.original_price_bs) || 0
        };
      });
      const finalCombosList = finalCombos.length > 0 ? finalCombos : DEFAULT_COMBOS;
      setCombos(finalCombosList);

      // 7. Fetch combo products link
      const { data: comboProductsData } = await supabase.from('combo_products').select('*');
      setComboProducts(comboProductsData && comboProductsData.length > 0 ? comboProductsData : DEFAULT_COMBO_PRODUCTS);

      // 8. Fetch product stock per branch
      const { data: productStockData } = await supabase.from('product_stock').select('*');
      if (productStockData && productStockData.length > 0) {
        setProductStocks(productStockData);
      } else {
        const fallbackProductStocks = [];
        finalProductsList.forEach(p => {
          branchesList.forEach(b => {
            let stock = 20;
            if (b.name.includes("Santa Cruz")) {
              stock = p.id === 1 ? 50 : (p.id === 2 ? 30 : (p.id === 3 ? 100 : 40));
            } else if (b.name.includes("La Paz")) {
              stock = p.id === 1 ? 30 : (p.id === 2 ? 15 : (p.id === 3 ? 60 : 25));
            } else if (b.name.includes("Cochabamba")) {
              stock = p.id === 1 ? 20 : (p.id === 2 ? 10 : (p.id === 3 ? 40 : 20));
            }
            fallbackProductStocks.push({ product_id: p.id, branch_id: b.id, stock });
          });
        });
        setProductStocks(fallbackProductStocks);
      }

      // 9. Fetch testimonials
      const { data: testData } = await supabase
        .from('testimonials')
        .select('*')
        .order('id', { ascending: true });
      setTestimonials(testData || []);

      // 10. Fetch FAQs
      const { data: faqsData } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      setFaqs(faqsData || []);

    } catch (err) {
      console.error("Error loading Kaldirev database:", err);
      setErrorMsg("No se pudieron cargar los datos de la base de datos. Mostrando datos locales de respaldo.");
      setCategoriesList(DEFAULT_CATEGORIES);
      setProductImages(DEFAULT_PRODUCT_IMAGES);
      setProducts(DEFAULT_PRODUCTS);
      setCombos(DEFAULT_COMBOS);
      setComboProducts(DEFAULT_COMBO_PRODUCTS);
      
      const fallbackBranches = [
        { id: 1, name: "Santa Cruz", address: "Av. San Martín, Equipetrol, Santa Cruz", shipping_cost_bs: 12 },
        { id: 2, name: "La Paz", address: "Av. 16 de Julio, El Prado, La Paz", shipping_cost_bs: 15 },
        { id: 3, name: "Cochabamba", address: "Calle España, Zona Central, Cochabamba", shipping_cost_bs: 15 }
      ];
      setBranches(fallbackBranches);
      setSelectedBranch(fallbackBranches[0]);
      
      const fallbackProductStocks = [];
      DEFAULT_PRODUCTS.forEach(p => {
        fallbackBranches.forEach(b => {
          let stock = 20;
          if (b.name.includes("Santa Cruz")) {
            stock = p.id === 1 ? 50 : (p.id === 2 ? 30 : (p.id === 3 ? 100 : 40));
          } else if (b.name.includes("La Paz")) {
            stock = p.id === 1 ? 30 : (p.id === 2 ? 15 : (p.id === 3 ? 60 : 25));
          } else if (b.name.includes("Cochabamba")) {
            stock = p.id === 1 ? 20 : (p.id === 2 ? 10 : (p.id === 3 ? 40 : 20));
          }
          fallbackProductStocks.push({ product_id: p.id, branch_id: b.id, stock });
        });
      });
      setProductStocks(fallbackProductStocks);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from Supabase (Admin view)
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch personal orders from Supabase (User view)
  const fetchUserOrders = async (userId) => {
    if (!userId) return;
    setUserOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserOrders(data || []);
    } catch (err) {
      console.error("Error loading user orders:", err);
    } finally {
      setUserOrdersLoading(false);
    }
  };

  useEffect(() => {
    const initStore = async () => {
      await syncDatabaseItemsOnce();
      await fetchStoreData();
    };
    initStore();
  }, []);

  // Handle QR code timer countdown
  useEffect(() => {
    let interval = null;
    if (isQrModalOpen && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer(prev => prev - 1);
      }, 1000);
    } else if (qrTimer === 0) {
      setIsQrModalOpen(false);
      window.Swal.fire({
        title: 'Código QR Expirado',
        text: 'El tiempo límite de 5 minutos ha expirado. Por favor realice su pedido de nuevo.',
        icon: 'error',
        confirmButtonColor: 'var(--primary-green)'
      });
    }
    return () => clearInterval(interval);
  }, [isQrModalOpen, qrTimer]);

  // Listen to hash changes in URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setView("admin");
        if (isAdminUnlocked) {
          fetchOrders();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#catalog') {
        setView("catalog");
        setSelectedCombo(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash && view === "admin") {
        setView("catalog");
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminUnlocked, view]);

  // Tick countdown timer down every second (24 hours reset)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCountdownTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => window.clearInterval(timerInterval);
  }, []);

  // Load orders when admin is unlocked and admin tab changes
  useEffect(() => {
    if (view === "admin" && isAdminUnlocked && adminActiveTab === "orders") {
      fetchOrders();
    }
  }, [view, isAdminUnlocked, adminActiveTab]);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('kaldirev_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (item, type = 'combo', bypassAuthCheck = false) => {
    if (!user && !bypassAuthCheck) {
      setPendingCartItem({ item, type });
      setShowLoginPrompt(true);
      return;
    }

    const computedPrice = parseFloat(item.price_bs);
    const computedOriginalPrice = parseFloat(item.original_price_bs);
    const cartItemId = `${type}-${item.id}`;
    
    let imageUrl = item.image_url || '';
    if (type === 'product') {
      imageUrl = getProductImage(item.id) || imageUrl;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(c => c.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(c =>
          c.cartItemId === cartItemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { 
        ...item, 
        cartItemId,
        cartItemType: type,
        price: computedPrice, 
        originalPrice: computedOriginalPrice, 
        image_url: imageUrl,
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const getCartCount = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  const getCartTotal = () => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const getShippingCost = () => {
    return selectedBranch ? parseFloat(selectedBranch.shipping_cost_bs) : 15;
  };
  const getFinalTotal = () => getCartTotal() + getShippingCost();

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Get current GPS location using Geolocation API and auto-fill link
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }
    
    window.Swal.fire({
      title: 'Obteniendo tu ubicación actual...',
      text: 'Por favor, acepta los permisos de ubicación en tu navegador.',
      allowOutsideClick: false,
      didOpen: () => {
        window.Swal.showLoading();
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData(prev => ({
          ...prev,
          gpsCoordinates: mapsLink
        }));
        window.Swal.fire({
          title: '📍 ¡Ubicación Obtenida!',
          text: 'Se ha completado el enlace de Google Maps con tus coordenadas actuales.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });
      },
      (error) => {
        let msg = "No pudimos obtener tu ubicación.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permiso denegado. Habilita los permisos de ubicación en tu navegador e inténtalo de nuevo.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "La ubicación no está disponible actualmente.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Se agotó el tiempo de espera al buscar tu ubicación.";
        }
        window.Swal.fire({
          title: 'Error de Ubicación',
          text: msg,
          icon: 'error',
          confirmButtonColor: 'var(--primary-green)'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({ ...prev, [name]: value }));
  };

  // Unlock Admin dashboard
  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    if (adminPasscode === "1928" || adminPasscode === "admin") {
      setIsAdminUnlocked(true);
      setPasscodeError("");
      fetchOrders();
    } else {
      setPasscodeError("Contraseña incorrecta. Intente de nuevo.");
    }
  };


  // Upload image/video to Cloudinary (Unsigned upload)
  const handleCloudinaryUpload = async (e, target = 'combo') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "hsfhcaic";
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ecommerce";
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER || "tienda";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("folder", folder);

    try {
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: data
      });
      const resJson = await res.json();
      if (resJson.secure_url) {
        if (target === 'combo') {
          setEditingCombo(prev => ({
            ...prev,
            image_url: resJson.secure_url
          }));
          if (window.Swal) {
            window.Swal.fire('Subido', 'Archivo subido correctamente a Cloudinary.', 'success');
          } else {
            alert('Archivo subido correctamente a Cloudinary.');
          }
        } else if (target === 'product') {
          setEditingProduct(prev => {
            const currentUrls = prev.media_urls ? prev.media_urls.trim() : "";
            const newUrls = currentUrls ? `${currentUrls}\n${resJson.secure_url}` : resJson.secure_url;
            return {
              ...prev,
              media_urls: newUrls
            };
          });
          if (window.Swal) {
            window.Swal.fire('Subido', 'Archivo subido correctamente a Cloudinary y agregado a la lista.', 'success');
          } else {
            alert('Archivo subido correctamente a Cloudinary y agregado a la lista.');
          }
        }
      } else {
        if (window.Swal) {
          window.Swal.fire('Error', 'Fallo al subir el archivo. Revisa el Preset de Cloudinary.', 'error');
        } else {
          alert("Fallo al subir la imagen. Por favor revise el Preset de Cloudinary.");
        }
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      if (window.Swal) {
        window.Swal.fire('Error', 'Error en la conexión con Cloudinary.', 'error');
      } else {
        alert("Error en la conexión con Cloudinary.");
      }
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Save or edit combo in Supabase
  const handleSaveCombo = async (e) => {
    e.preventDefault();
    if (typeof window.Swal === 'undefined') {
      if (!window.confirm("¿Está seguro de que desea guardar este combo?")) return;
      executeSaveCombo();
      return;
    }

    window.Swal.fire({
      title: '¿Guardar Combo?',
      text: '¿Está seguro de que desea guardar los cambios de este Combo/Kit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f3d2e',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeSaveCombo();
      }
    });
  };

  const executeSaveCombo = async () => {
    try {
      const payload = {
        name: editingCombo.name,
        category: editingCombo.category,
        price_bs: parseFloat(editingCombo.price_bs),
        original_price_bs: parseFloat(editingCombo.original_price_bs),
        includes: editingCombo.includes,
        bullets: typeof editingCombo.bullets === 'string' 
          ? editingCombo.bullets.split('\n').filter(b => b.trim() !== '')
          : editingCombo.bullets,
        dosage: editingCombo.dosage,
        package_detail: editingCombo.package_detail,
        badge: editingCombo.badge || null,
        tagline: editingCombo.tagline || null,
        image_url: editingCombo.image_url || null,
        pinned: !!editingCombo.pinned
      };

      if (editingCombo.id) {
        const { error } = await supabase
          .from('combos')
          .update(payload)
          .eq('id', editingCombo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('combos')
          .insert([payload]);
        if (error) throw error;
      }

      setEditingCombo(null);
      fetchStoreData();
      
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Guardado!',
          text: 'El combo se ha registrado correctamente en Supabase.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Combo guardado correctamente.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Fallo al guardar combo: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al guardar combo: " + err.message);
      }
    }
  };

  // Delete Combo from Supabase
  const handleDeleteCombo = async (id) => {
    if (typeof window.Swal === 'undefined') {
      if (!window.confirm("¿Está seguro de que desea eliminar este combo?")) return;
      executeDeleteCombo(id);
      return;
    }

    window.Swal.fire({
      title: '¿Eliminar Combo?',
      text: 'Esta acción no se puede deshacer y borrará el combo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeDeleteCombo(id);
      }
    });
  };

  const executeDeleteCombo = async (id) => {
    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchStoreData();
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Eliminado!',
          text: 'El combo ha sido eliminado de la base de datos.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Combo eliminado.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Error al eliminar combo: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al eliminar combo: " + err.message);
      }
    }
  };

  // Save Product to Supabase
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (typeof window.Swal === 'undefined') {
      executeSaveProduct();
      return;
    }
    window.Swal.fire({
      title: '¿Guardar Producto?',
      text: 'Se actualizarán los datos de este producto en la base de datos de Supabase.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f3d2e',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeSaveProduct();
      }
    });
  };

  const executeSaveProduct = async () => {
    try {
      const payload = {
        name: editingProduct.name,
        sku: editingProduct.sku || "",
        slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price_bs: parseFloat(editingProduct.price_bs),
        original_price_bs: parseFloat(editingProduct.original_price_bs),
        category_id: parseInt(editingProduct.category_id),
        description: editingProduct.description || "",
        bullets: typeof editingProduct.bullets === 'string' 
          ? editingProduct.bullets.split('\n').filter(b => b.trim() !== '')
          : editingProduct.bullets || [],
        dosage: editingProduct.dosage || "",
        package_detail: editingProduct.package_detail || "",
        badge: editingProduct.badge || null,
        tagline: editingProduct.tagline || null,
        pinned: !!editingProduct.pinned
      };

      let resId = editingProduct.id;
      if (editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          resId = data[0].id;
        }
      }

      // Save multiple images/videos
      if (resId && editingProduct.media_urls !== undefined) {
        // Clear existing product images
        await supabase.from('product_images').delete().eq('product_id', resId);
        
        // Insert new ones
        const list = (editingProduct.media_urls || "")
          .split('\n')
          .map(url => url.trim())
          .filter(url => url !== "");
        
        if (list.length > 0) {
          const insertPayload = list.map((url, index) => ({
            product_id: resId,
            url,
            position: index,
            is_video: isVideoUrl(url)
          }));
          const { error } = await supabase.from('product_images').insert(insertPayload);
          if (error) throw error;
        }
      }

      setEditingProduct(null);
      fetchStoreData();
      
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Guardado!',
          text: 'El producto se ha guardado correctamente en Supabase.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Producto guardado correctamente.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Fallo al guardar producto: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al guardar producto: " + err.message);
      }
    }
  };

  // Delete Product from Supabase
  const handleDeleteProduct = async (id) => {
    if (typeof window.Swal === 'undefined') {
      if (!window.confirm("¿Está seguro de que desea eliminar este producto?")) return;
      executeDeleteProduct(id);
      return;
    }

    window.Swal.fire({
      title: '¿Eliminar Producto?',
      text: 'Esta acción borrará el producto y todas sus imágenes/stock permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeDeleteProduct(id);
      }
    });
  };

  const executeDeleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchStoreData();
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado de la base de datos.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Producto eliminado.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Error al eliminar producto: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al eliminar producto: " + err.message);
      }
    }
  };

  // Save Settings to Supabase
  const handleSaveSettings = async (settingsKey, settingsVal) => {
    try {
      const valStr = typeof settingsVal === 'object' ? JSON.stringify(settingsVal) : String(settingsVal);
      const { error } = await supabase.from('settings').upsert({ key: settingsKey, value: valStr });
      if (error) throw error;
      
      setConfig(prev => {
        const next = { ...prev };
        if (settingsKey === 'exchange_rate') next.exchangeRate = parseFloat(settingsVal);
        if (settingsKey === 'whatsapp_number') next.whatsappNumber = String(settingsVal);
        if (settingsKey === 'flash_deal') next.flashDeal = settingsVal;
        return next;
      });
      
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Guardado!',
          text: `Ajuste "${settingsKey}" actualizado correctamente.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        alert("Ajuste guardado.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Error al actualizar ajuste: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al actualizar ajuste: " + err.message);
      }
    }
  };

  // Save Testimonial
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        text: editingTestimonial.text,
        author: editingTestimonial.author,
        stars: parseInt(editingTestimonial.stars) || 5
      };

      if (editingTestimonial.id) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
      }
      setEditingTestimonial(null);
      fetchStoreData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm("¿Eliminar opinión?")) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchStoreData();
  };

  // Save FAQ
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question: editingFaq.question,
        answer: editingFaq.answer,
        display_order: parseInt(editingFaq.display_order) || 0
      };

      if (editingFaq.id) {
        const { error } = await supabase.from('faqs').update(payload).eq('id', editingFaq.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert([payload]);
        if (error) throw error;
      }
      setEditingFaq(null);
      fetchStoreData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm("¿Eliminar esta pregunta frecuente?")) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchStoreData();
  };

  // Order status modification
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      fetchOrders();
    } catch (err) {
      alert("Error al actualizar estado: " + err.message);
    }
  };

  // Deduct stock levels for items ordered
  const deductStockObj = async (branchId, itemsList) => {
    try {
      for (const item of itemsList) {
        const itemType = item.cartItemType || item.type || 'combo';
        
        if (itemType === 'product') {
          const { data: currentStockObj } = await supabase
            .from('product_stock')
            .select('stock')
            .eq('product_id', item.id)
            .eq('branch_id', branchId)
            .maybeSingle();
            
          if (currentStockObj) {
            const newStock = Math.max(0, currentStockObj.stock - item.quantity);
            await supabase
              .from('product_stock')
              .update({ stock: newStock })
              .eq('product_id', item.id)
              .eq('branch_id', branchId);
          }
        } else {
          const linked = comboProducts.filter(cp => cp.combo_id === item.id);
          for (const cp of linked) {
            const qtyToDeduct = cp.quantity * item.quantity;
            const { data: currentStockObj } = await supabase
              .from('product_stock')
              .select('stock')
              .eq('product_id', cp.product_id)
              .eq('branch_id', branchId)
              .maybeSingle();
              
            if (currentStockObj) {
              const newStock = Math.max(0, currentStockObj.stock - qtyToDeduct);
              await supabase
                .from('product_stock')
                .update({ stock: newStock })
                .eq('product_id', cp.product_id)
                .eq('branch_id', branchId);
            }
          }
        }
      }
      setProductStocks(prev => {
        let updatedStocks = [...prev];
        for (const item of itemsList) {
          const itemType = item.cartItemType || item.type || 'combo';
          if (itemType === 'product') {
            updatedStocks = updatedStocks.map(s => {
              if (s.product_id === item.id && s.branch_id === branchId) {
                return { ...s, stock: Math.max(0, s.stock - item.quantity) };
              }
              return s;
            });
          } else {
            const linked = comboProducts.filter(cp => cp.combo_id === item.id);
            for (const cp of linked) {
              const qtyToDeduct = cp.quantity * item.quantity;
              updatedStocks = updatedStocks.map(s => {
                if (s.product_id === cp.product_id && s.branch_id === branchId) {
                  return { ...s, stock: Math.max(0, s.stock - qtyToDeduct) };
                }
                return s;
              });
            }
          }
        }
        return updatedStocks;
      });
      fetchStoreData();
    } catch (err) {
      console.error("Error deducting stock:", err);
    }
  };

  // Simulates bank confirmation webhook from Libélula / Circle.bo
  const handleSimulateQrSuccess = async () => {
    if (!qrModalOrder) return;
    try {
      // 1. Update QR payment status in database
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ qr_payment_status: 'Pagado' })
        .eq('id', qrModalOrder.id);
      
      if (updateErr) throw updateErr;

      // 2. Deduct stock for selected branch
      const branchId = qrModalOrder.branch_id || (selectedBranch ? selectedBranch.id : 1);
      await deductStockObj(branchId, qrModalOrder.items);

      // 3. Close QR Modal
      setIsQrModalOpen(false);
      
      window.Swal.fire({
        title: '¡Pago Confirmado! 🎉',
        text: 'La pasarela Libélula ha verificado su transferencia QR con éxito. Despacharemos su pedido de inmediato.',
        icon: 'success',
        confirmButtonColor: 'var(--primary-green)'
      }).then(() => {
        // 4. Open WhatsApp to send receipt details
        const itemsText = qrModalOrder.items.map(item => 
          `• *${item.quantity}x ${item.name}* - Bs. ${(item.price * item.quantity).toFixed(1)}`
        ).join("\n");

        const subtotal = qrModalOrder.total_bs - qrModalOrder.shipping_cost;
        const message = `*¡HOLA KALDIREV BOLIVIA!* 🚀 Acabo de pagar mi pedido por la Pasarela QR de Libélula:

*ESTADO DEL PAGO:* *[APROBADO & VERIFICADO AUTOMÁTICAMENTE]* ✅
*ID PEDIDO:* ${qrModalOrder.id.substring(0, 8)}...

*DETALLE DEL PEDIDO:*
${itemsText}

*Subtotal:* Bs. ${subtotal.toFixed(1)}
*Costo de Envío (${qrModalOrder.delivery_method}):* Bs. ${parseFloat(qrModalOrder.shipping_cost).toFixed(1)}
*TOTAL PAGADO:* *Bs. ${parseFloat(qrModalOrder.total_bs).toFixed(1)}*

*DATOS DE ENVÍO:*
- *Almacén de Despacho:* ${branches.find(b => b.id === branchId)?.name || 'Santa Cruz'}
- *Nombre:* ${qrModalOrder.customer_name}
- *Teléfono:* ${qrModalOrder.phone}
- *Dirección:* ${qrModalOrder.address}
- *Ciudad/Destino:* ${qrModalOrder.city}
${qrModalOrder.gps_coordinates ? `- *Coordenadas GPS:* ${qrModalOrder.gps_coordinates}\n` : ''}- *Método de Pago:* *Pasarela QR Libélula (Confirmado)*

*Presentación:* Bolsa Kraft eco-amigable con termosellado manual de seguridad.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        // Reset states
        setCart([]);
        setIsCheckingOut(false);
        setQrModalOrder(null);
        setShowSuccessModal(true);
      });

    } catch (err) {
      alert("Error al simular confirmación: " + err.message);
    }
  };

  // Save Order in Supabase & Redirect to WhatsApp directly
  const handleDirectWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSubmittingOrder(true);
    const subtotal = getCartTotal();

    try {
      // 1. Deduct Stock immediately from default branch (Santa Cruz)
      await deductStockObj(1, cart);

      // 2. Prepare payload for database registry
      const orderPayload = {
        customer_name: profile?.full_name || user?.email || "Cliente de WhatsApp",
        phone: profile?.phone || "Coordinar por WhatsApp",
        address: profile?.address || "Coordinar por WhatsApp",
        city: profile?.city || "Coordinar por WhatsApp",
        payment_method: "WhatsApp",
        total_bs: parseFloat(subtotal),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        user_id: user?.id || null,
        branch_id: 1, // Default main branch
        shipping_cost: 0,
        delivery_method: "WhatsApp",
        gps_coordinates: null,
        qr_payment_status: "No Aplica",
        tracking_id: null
      };

      // 3. Insert order in Supabase so user can see it in "Mis Pedidos" and Admin dashboard
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select();

      if (orderErr) throw orderErr;

      // 4. Construct pre-filled WhatsApp message
      const itemsText = cart.map(item => 
        `• *${item.quantity}x ${item.name}* - Bs. ${(item.price * item.quantity).toFixed(1)}`
      ).join("\n");

      const message = `¡Hola Kaldirev! Deseo realizar un pedido de combos:

Detalle del Pedido:
${itemsText}

*Total a Pagar: Bs. ${subtotal.toFixed(1)}*
*(Envío en bolsa Kraft eco-amigable con termosellado manual de seguridad)*

Por favor, ayúdenme a coordinar el envío completando estos datos:
- Nombre Completo: ${profile?.full_name || '[Escribe tu nombre aquí]'}
- Teléfono / WhatsApp: ${profile?.phone || '[Escribe tu número de celular]'}
- Ciudad de Entrega (ej. Santa Cruz/La Paz/Cochabamba): ${profile?.city || '[Escribe la ciudad]'}
- Dirección de Entrega (calle, nro, zona): ${profile?.address || '[Escribe tu dirección]'}
- Ubicación GPS (Adjunta tu ubicación en este chat o escribe el link): [Adjunta tu ubicación de Google Maps aquí]
- Método de Pago preferido (Contraentrega / QR / Transferencia): [Contraentrega]`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`;

      // 5. Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // 6. Reset cart and view
      setCart([]);
      setIsCheckingOut(false);
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Direct WhatsApp checkout failed:", err);
      alert("Hubo un problema al procesar su pedido en la base de datos. De todas formas lo coordinaremos por WhatsApp.");
      const itemsText = cart.map(item => `• *${item.quantity}x ${item.name}*`).join("\n");
      window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent("Deseo ordenar:\n" + itemsText)}`, '_blank');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      window.Swal.fire({
        title: 'Geolocalización no soportada',
        text: 'Tu navegador o dispositivo no soporta la geolocalización directa.',
        icon: 'error',
        confirmButtonColor: 'var(--primary-green)'
      });
      return;
    }
    
    window.Swal.fire({
      title: 'Obteniendo ubicación...',
      text: 'Por favor, permite el acceso a tu ubicación exacta para garantizar que el delivery llegue sin errores a tu puerta.',
      allowOutsideClick: false,
      didOpen: () => {
        window.Swal.showLoading();
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setFormData(prev => ({ 
          ...prev, 
          gpsCoordinates: mapsLink,
          address: prev.address ? prev.address : "📍 Dirección vía Ubicación GPS (Entregar en este punto exacto)"
        }));

        window.Swal.fire({
          title: '📍 ¡Ubicación Obtenida!',
          text: `Coordenadas GPS registradas con alta precisión (precisión: ±${Math.round(accuracy)} metros).`,
          icon: 'success',
          confirmButtonColor: 'var(--primary-green)'
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "No pudimos obtener tu ubicación. Por favor, asegúrate de activar el GPS en tu teléfono y dar permisos.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permiso de ubicación denegado. Habilita los permisos de ubicación para esta página en la configuración de tu navegador.";
        } else if (error.code === error.TIMEOUT) {
          msg = "La solicitud de GPS expiró. Por favor, inténtalo nuevamente.";
        }
        window.Swal.fire({
          title: 'Error de Ubicación',
          text: msg,
          icon: 'error',
          confirmButtonColor: 'var(--primary-green)'
        });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 0 
      }
    );
  };

  // Synchronize city selection with the active branch (Added by Antigravity)
  const handleCityChange = (cityName) => {
    setFormData(prev => ({ 
      ...prev, 
      city: cityName,
      deliveryMethod: cityName.toLowerCase().includes('santa cruz') ? 'Local (Yango)' : 'Envíos Nacionales'
    }));
    const matchingBranch = branches.find(b => b.name.toLowerCase().includes(cityName.toLowerCase()));
    if (matchingBranch) {
      setSelectedBranch(matchingBranch);
    }
  };

  // Handle detailed interactive checkout submission (Added by Antigravity)
  const handleCreateOrderCheckout = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.name || !formData.name.trim() || !formData.phone || !formData.phone.trim() || !formData.address || !formData.address.trim()) {
      window.Swal.fire({
        title: 'Campos Incompletos',
        text: 'Por favor, complete todos los campos obligatorios (*)',
        icon: 'warning',
        confirmButtonColor: 'var(--primary-green)'
      });
      return;
    }

    const outOfStockItems = getOutOfStockItemsForCity(formData.city);
    if (outOfStockItems.length > 0) {
      window.Swal.fire({
        title: 'Sin Stock Suficiente',
        text: `Algunos productos de su carrito no cuentan con stock suficiente en la sucursal de ${formData.city}. Por favor, modifique su cantidad o cambie de sucursal.`,
        icon: 'error',
        confirmButtonColor: 'var(--primary-green)'
      });
      return;
    }

    setIsSubmittingOrder(true);
    const selectedBranchObj = branches.find(b => b.name.toLowerCase().includes(formData.city.toLowerCase())) || branches[0];
    const shippingCost = formData.deliveryMethod === 'Retiro en Oficina' ? 0 : (selectedBranchObj ? parseFloat(selectedBranchObj.shipping_cost_bs) : 15);
    const subtotal = getCartTotal();
    const totalOrderAmount = subtotal + shippingCost;

    try {
      // 1. Deduct Stock immediately from selected branch (if not paying via QR, which deducts on webhook confirmation)
      if (formData.paymentMethod !== 'Pago QR Directo') {
        await deductStockObj(selectedBranchObj.id, cart);
      }

      // 2. Prepare order payload
      const orderPayload = {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        payment_method: formData.paymentMethod,
        total_bs: parseFloat(totalOrderAmount),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        user_id: user?.id || null,
        branch_id: selectedBranchObj.id,
        shipping_cost: parseFloat(shippingCost),
        delivery_method: formData.deliveryMethod,
        gps_coordinates: formData.gpsCoordinates || null,
        qr_payment_status: formData.paymentMethod === 'Pago QR Directo' ? 'Pendiente' : 'No Aplica',
        tracking_id: null
      };

      // 3. Insert order in Supabase
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 4. Handle QR Payment flow
      if (formData.paymentMethod === 'Pago QR Directo') {
        setQrModalOrder(orderData);
        setIsQrModalOpen(true);
        setIsCartOpen(false); // Close cart drawer
        setQrTimer(300); // 5 min timer
        setIsSubmittingOrder(false);
        return;
      }

      // 5. Normal checkout (Contraentrega or Transferencia) -> WhatsApp Redirect
      const itemsText = cart.map(item => 
        `• *${item.quantity}x ${item.name}* - Bs. ${(item.price * item.quantity).toFixed(1)}`
      ).join("\n");

      const message = `*¡HOLA KALDIREV BOLIVIA!* 🚀 Deseo confirmar mi pedido de combos:

*DETALLE DEL PEDIDO:*
${itemsText}

*Subtotal:* Bs. ${subtotal.toFixed(1)}
*Costo de Envío (${formData.deliveryMethod}):* Bs. ${shippingCost.toFixed(1)}
*TOTAL A PAGAR:* *Bs. ${totalOrderAmount.toFixed(1)}*
_(Envío en bolsa Kraft eco-amigable con termosellado manual de seguridad)_

*MIS DATOS DE DESPACHO:*
- *Nombre Completo:* ${formData.name}
- *Teléfono / WhatsApp:* ${formData.phone}
- *Ciudad de Entrega:* ${formData.city}
- *Dirección de Entrega:* ${formData.address}
${formData.gpsCoordinates ? `- *Ubicación GPS (Link):* ${formData.gpsCoordinates}\n` : ''}- *Método de Pago:* *Pago QR Directo*

Por favor, confírmenme el despacho y el horario aproximado de entrega. ¡Muchas gracias!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Reset cart and checkout states
      setCart([]);
      setIsCheckingOut(false);
      setShowSuccessModal(true);

      // Refresh orders history if user logged in
      if (user) {
        fetchUserOrders(user.id);
      }

    } catch (err) {
      console.error("Order creation failed:", err);
      window.Swal.fire({
        title: 'Error al registrar pedido',
        text: 'Hubo un inconveniente al registrar su pedido en la base de datos: ' + err.message,
        icon: 'error',
        confirmButtonColor: 'var(--primary-green)'
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const confirmOrderSuccess = () => {
    setShowSuccessModal(false);
    setCart([]);
    setIsCheckingOut(false);
  };

  // Share combo link copy function
  const handleShareCombo = (combo) => {
    const shareText = `*${combo.name}* en Kaldirev Bolivia: ${combo.tagline}. Precio: Bs. ${parseFloat(combo.price_bs).toFixed(1)}. Incluye: ${combo.includes}. Consulta en: ${window.location.origin}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 1800);
    });
  };

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Open details view
  const openComboDetails = (item, type = 'combo') => {
    const detailsObj = { ...item, type };
    
    if (type === 'product') {
      const imgs = productImages.filter(img => String(img.product_id) === String(item.id)).sort((a,b) => a.position - b.position);
      if (imgs.length > 0) {
        detailsObj.image_url = imgs.map(img => img.url).join(',');
      } else {
        detailsObj.image_url = item.image_url || '';
      }
    } else {
      const comboImgList = [];
      if (item.image_url) {
        comboImgList.push(item.image_url);
      }
      
      const linked = comboProducts.filter(cp => String(cp.combo_id) === String(item.id));
      for (const cp of linked) {
        const prodImgs = productImages.filter(img => String(img.product_id) === String(cp.product_id)).sort((a,b) => a.position - b.position);
        prodImgs.forEach(img => {
          if (!comboImgList.includes(img.url)) {
            comboImgList.push(img.url);
          }
        });
      }
      detailsObj.image_url = comboImgList.join(',');
      
      // Add helper values for render compatibility
      detailsObj.bullets = detailsObj.bullets || [
        "Ahorra al comprar este paquete combinado",
        "Empacado al vacío con sellos de seguridad oficiales",
        "Distribución y garantía oficial Tiens Bolivia"
      ];
      detailsObj.dosage = detailsObj.dosage || "Consultar dosis individual detallada de cada producto incluido en el pack.";
      detailsObj.package_detail = detailsObj.package_detail || "Empacado en bolsa doypack kraft original sellada térmicamente con sello de seguridad Kaldirev.";
      detailsObj.category = detailsObj.category || "Combo Especial";
    }
    
    setSelectedCombo(detailsObj);
    setActiveImageIndex(0);
    setView("details");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeComboDetails = () => {
    setView("catalog");
    setSelectedCombo(null);
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories and filtering
  const categories = ["Todos", ...categoriesList.map(c => c.name)];
  
  // Filtered products list
  const filteredProducts = products.filter(p => {
    const cat = categoriesList.find(c => c.id === p.category_id);
    const categoryName = cat ? cat.name : "";
    const matchesCategory = activeCategory === "Todos" || categoryName === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.bullets.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered combos list
  const filteredCombos = combos.filter(c => {
    const linked = comboProducts.filter(cp => cp.combo_id === c.id);
    const comboProductCategories = linked.map(cp => {
      const p = products.find(prod => prod.id === cp.product_id);
      if (!p) return "";
      const cat = categoriesList.find(catObj => catObj.id === p.category_id);
      return cat ? cat.name : "";
    }).filter(Boolean);
    
    const matchesCategory = activeCategory === "Todos" || comboProductCategories.includes(activeCategory);
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stable lists of featured and standard combos (Removed random shuffling to keep cards static)
  const pinnedCombos = useMemo(() => {
    const items = combos.filter(c => c.pinned);
    // Filter by category
    return items.filter(c => {
      const linked = comboProducts.filter(cp => cp.combo_id === c.id);
      const comboProductCategories = linked.map(cp => {
        const p = products.find(prod => prod.id === cp.product_id);
        if (!p) return "";
        const cat = categoriesList.find(catObj => catObj.id === p.category_id);
        return cat ? cat.name : "";
      }).filter(Boolean);
      
      const matchesCategory = activeCategory === "Todos" || comboProductCategories.includes(activeCategory);
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [combos, comboProducts, products, categoriesList, activeCategory, searchTerm]);

  const otherCombos = useMemo(() => {
    const items = combos.filter(c => !c.pinned);
    // Filter by category
    return items.filter(c => {
      const linked = comboProducts.filter(cp => cp.combo_id === c.id);
      const comboProductCategories = linked.map(cp => {
        const p = products.find(prod => prod.id === cp.product_id);
        if (!p) return "";
        const cat = categoriesList.find(catObj => catObj.id === p.category_id);
        return cat ? cat.name : "";
      }).filter(Boolean);
      
      const matchesCategory = activeCategory === "Todos" || comboProductCategories.includes(activeCategory);
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [combos, comboProducts, products, categoriesList, activeCategory, searchTerm]);

  // Filter orders for Admin display
  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus === "Todos") return true;
    return o.status === orderFilterStatus;
  });

  // Calculations for stats card
  const getTotalSales = () => {
    return orders
      .filter(o => o.status === "Completado")
      .reduce((acc, curr) => acc + parseFloat(curr.total_bs), 0)
      .toFixed(1);
  };

  const getPendingOrdersCount = () => {
    return orders.filter(o => o.status === "Pendiente").length;
  };

  const getCompletedOrdersCount = () => {
    return orders.filter(o => o.status === "Completado").length;
  };

  const getCancelledOrdersCount = () => {
    return orders.filter(o => o.status === "Cancelado").length;
  };

  const getAverageOrderValue = () => {
    const completed = orders.filter(o => o.status === "Completado");
    if (completed.length === 0) return "0.0";
    const total = completed.reduce((acc, curr) => acc + parseFloat(curr.total_bs), 0);
    return (total / completed.length).toFixed(1);
  };

  const getLowStockAlerts = () => {
    const alerts = [];
    productStocks.forEach(stockItem => {
      if (stockItem.stock <= 5) {
        const product = products.find(p => p.id === stockItem.product_id);
        const branch = (branches || []).find(b => b.id === stockItem.branch_id);
        if (product && branch) {
          alerts.push({
            id: `${stockItem.product_id}-${stockItem.branch_id}`,
            productName: product.name,
            branchName: branch.name,
            stock: stockItem.stock
          });
        }
      }
    });
    return alerts;
  };

  const getTopProductsData = () => {
    const counts = {};
    orders.forEach(o => {
      if (o.status === "Completado" && o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const name = item.name || `Pack ${item.id}`;
          counts[name] = (counts[name] || 0) + (parseInt(item.quantity) || 0);
        });
      }
    });
    return Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  };

  const getCategorySalesData = () => {
    const sales = {};
    orders.forEach(o => {
      if (o.status === "Completado" && o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const product = combos.find(c => c.id === item.id);
          const category = product ? product.category : "General";
          const itemTotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
          sales[category] = (sales[category] || 0) + itemTotal;
        });
      }
    });
    const total = Object.values(sales).reduce((acc, curr) => acc + curr, 0) || 1;
    return Object.entries(sales)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / total) * 100).toFixed(0)
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getBranchSalesData = () => {
    const sales = {};
    orders.forEach(o => {
      if (o.status === "Completado") {
        const city = o.city || "No especificada";
        sales[city] = (sales[city] || 0) + (parseFloat(o.total_bs) || 0);
      }
    });
    return Object.entries(sales)
      .map(([city, amount]) => ({ city, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getRevenueOverTime = () => {
    const salesByDate = {};
    const dateKeys = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      dateKeys.push(key);
      salesByDate[key] = 0;
    }
    
    orders.forEach(o => {
      if (o.status === "Completado") {
        const orderDate = new Date(o.created_at);
        const key = orderDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        if (key in salesByDate) {
          salesByDate[key] += parseFloat(o.total_bs) || 0;
        }
      }
    });
    
    return dateKeys.map(date => ({
      date,
      amount: salesByDate[date]
    }));
  };

  /* ==================== VIEW 3: PREMIUM SIDEBAR ADMIN DASHBOARD ==================== */
  if (view === "admin") {
    if (!isAdminUnlocked) {
      return (
        <div className="admin-lock-screen animate-fade-in">
          <div className="lock-card">
            <div className="lock-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Kaldirev Administrador</h2>
            <p>Ingresa la contraseña maestra para desbloquear la base de datos de Kaldirev Bolivia.</p>
            
            <form onSubmit={handleVerifyPasscode}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Contraseña (ej. admin o 1928)"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                required
                style={{ textAlign: 'center' }}
              />
              {passcodeError && <span className="error-text">{passcodeError}</span>}
              <button type="submit" className="btn-dash-save" style={{ marginTop: '1.5rem', width: '100%' }}>
                Desbloquear Panel
              </button>
            </form>
            <button className="btn-dash-exit" style={{ marginTop: '1rem', width: '100%', border: '1px solid var(--border-color)', color: 'var(--text-dark)', background: 'none' }} onClick={() => { window.location.hash = '#catalog'; }}>
              Volver a la Tienda
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-layout animate-fade-in">
        {/* SIDEBAR NAVIGATION PANEL */}
        <aside className="admin-sidebar">
          <div>
            <div className="sidebar-logo">
              <div className="logo-mark">K</div>
              <div className="logo-text">
                <span className="logo-title" style={{ color: 'white', fontSize: '1.25rem' }}>Kaldirev</span>
                <span className="logo-subtitle" style={{ color: 'var(--accent-gold)' }}>Dark Store</span>
              </div>
            </div>
            
            <nav className="sidebar-nav" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "dashboard" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("dashboard")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                Estadísticas
              </button>
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "config" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("config")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Ajustes & Catálogo
              </button>
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "orders" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("orders")}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  Pedidos
                </span>
                {getPendingOrdersCount() > 0 && <span className="sidebar-badge">{getPendingOrdersCount()}</span>}
              </button>
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "stocks" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("stocks")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                </svg>
                Sucursales & Stock
              </button>
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "extras" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("extras")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Opiniones & FAQs
              </button>
            </nav>
          </div>
          
          <div className="sidebar-footer">
            <div className="admin-profile-sidebar" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
              <div className="user-avatar-placeholder" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
              <div>
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>Administrador</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Kaldirev Bolivia</span>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-dash-exit" 
              style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }} 
              onClick={() => { window.location.hash = '#catalog'; }}
            >
              Salir de Admin
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="topbar-title-section">
              <span className="admin-dash-subtitle">Panel Master</span>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                {adminActiveTab === "dashboard" ? "Estadísticas e Indicadores de Negocio" : adminActiveTab === "config" ? "Gestión de Ajustes & Catálogo" : adminActiveTab === "orders" ? "Logística e Historial de Pedidos" : adminActiveTab === "stocks" ? "Control de Almacenes & Multi-Stock" : "Administración de FAQs & Testimonios"}
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href="#catalog" 
                className="btn-share" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              >
                Ver Tienda
              </a>
            </div>
          </header>

          {/* Page body */}
          <div className="admin-content-area" style={{ padding: '2rem', overflowY: 'auto', flexGrow: 1 }}>
            
            {/* TAB 0: DASHBOARD / ESTADISTICAS */}
            {adminActiveTab === "dashboard" && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* 1. Metric Cards Grid */}
                <div className="admin-dash-stats-grid" style={{ padding: 0 }}>
                  <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-green)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="stat-card-label">Ventas Totales</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <span className="stat-card-value">Bs. {parseFloat(getTotalSales()).toLocaleString('es-BO', {minimumFractionDigits: 1})}</span>
                    <span className="stat-card-change" style={{ color: 'var(--text-muted)' }}>De órdenes con estado 'Completado'</span>
                  </div>

                  <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="stat-card-label">Pedidos Recibidos</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                    <span className="stat-card-value">{orders.length}</span>
                    <span className="stat-card-change" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{getCompletedOrdersCount()} Comp</span> |{' '}
                      <span style={{ color: 'var(--offer-orange)', fontWeight: 'bold' }}>{getPendingOrdersCount()} Pend</span> |{' '}
                      <span style={{ color: '#d33', fontWeight: 'bold' }}>{getCancelledOrdersCount()} Can</span>
                    </span>
                  </div>

                  <div className="stat-card" style={{ borderLeft: '4px solid #0284c7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="stat-card-label">Ticket Promedio</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                      </svg>
                    </div>
                    <span className="stat-card-value">Bs. {parseFloat(getAverageOrderValue()).toLocaleString('es-BO', {minimumFractionDigits: 1})}</span>
                    <span className="stat-card-change" style={{ color: 'var(--text-muted)' }}>Monto medio por venta</span>
                  </div>

                  <div className="stat-card" style={{ borderLeft: `4px solid ${getLowStockAlerts().length > 0 ? 'var(--offer-orange)' : 'var(--primary-green)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="stat-card-label">Alertas de Stock</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={getLowStockAlerts().length > 0 ? 'var(--offer-orange)' : 'var(--primary-green)'} strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                    <span className="stat-card-value" style={{ color: getLowStockAlerts().length > 0 ? 'var(--offer-orange)' : 'inherit' }}>
                      {getLowStockAlerts().length}
                    </span>
                    <span className="stat-card-change" style={{ color: 'var(--text-muted)' }}>Productos con bajo inventario (≤ 5)</span>
                  </div>
                </div>

                {/* 2. Charts and Visualization Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                  
                  {/* Column 1: Sales trends (7 days) */}
                  <div className="stat-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>Historial de Ventas (Últimos 7 Días)</h3>
                    {(() => {
                      const trendData = getRevenueOverTime();
                      const maxAmount = Math.max(...trendData.map(d => d.amount), 200);
                      return (
                        <div style={{ width: '100%' }}>
                          <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
                            {/* Grid Lines */}
                            <line x1="30" y1="30" x2="390" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="30" y1="80" x2="390" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="30" y1="130" x2="390" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="30" y1="170" x2="390" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />
                            
                            {/* Bars */}
                            {trendData.map((d, index) => {
                              const barHeight = (d.amount / maxAmount) * 130;
                              const x = 45 + index * 48;
                              const y = 170 - barHeight;
                              return (
                                <g key={index}>
                                  <rect 
                                    x={x} 
                                    y={y} 
                                    width="24" 
                                    height={barHeight} 
                                    fill="var(--primary-green)" 
                                    rx="3" 
                                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                  >
                                    <title>{`Bs. ${d.amount.toFixed(1)}`}</title>
                                  </rect>
                                  {d.amount > 0 && (
                                    <text 
                                      x={x + 12} 
                                      y={y - 6} 
                                      textAnchor="middle" 
                                      fontSize="9" 
                                      fontWeight="bold" 
                                      fill="var(--primary-green)"
                                    >
                                      {d.amount.toFixed(0)}
                                    </text>
                                  )}
                                  <text 
                                    x={x + 12} 
                                    y="185" 
                                    textAnchor="middle" 
                                    fontSize="9" 
                                    fill="var(--text-muted)"
                                    fontWeight="bold"
                                  >
                                    {d.date}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Column 2: Category Breakdown */}
                  <div className="stat-card" style={{ padding: '2rem', background: 'white' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>Ventas por Categoría</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                      {getCategorySalesData().length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', textAlign: 'center', margin: '2rem 0' }}>Sin ventas registradas en categorías aún.</p>
                      ) : (
                        getCategorySalesData().map((c, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 'bold' }}>
                              <span>{c.category}</span>
                              <span style={{ color: 'var(--primary-green)' }}>Bs. {c.amount.toFixed(1)} ({c.percentage}%)</span>
                            </div>
                            <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '12px', width: '100%', overflow: 'hidden' }}>
                              <div style={{ background: 'var(--primary-green)', height: '100%', width: `${c.percentage}%`, borderRadius: '999px' }}></div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* 3. Detailed Lists Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                  
                  {/* Top Selling Products */}
                  <div className="stat-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--primary-green)' }}>Packs más Vendidos</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table" style={{ width: '100%' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '8px' }}>Rank</th>
                            <th style={{ padding: '8px' }}>Producto / Pack</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Cant. Vendida</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getTopProductsData().length === 0 ? (
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aún no hay ventas de productos completadas.</td>
                            </tr>
                          ) : (
                            getTopProductsData().map((p, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>#{idx + 1}</td>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.name}</td>
                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: 'var(--primary-green)' }}>{p.qty} uds.</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sales by Branch/City */}
                  <div className="stat-card" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--primary-green)' }}>Ventas por Sucursal / Ciudad</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table" style={{ width: '100%' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '8px' }}>Ciudad / Sucursal</th>
                            <th style={{ padding: '8px', textAlign: 'right' }}>Total Recaudado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getBranchSalesData().length === 0 ? (
                            <tr>
                              <td colSpan="2" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aún no hay ventas por sucursal completadas.</td>
                            </tr>
                          ) : (
                            getBranchSalesData().map((b, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{b.city}</td>
                                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-green)' }}>Bs. {b.amount.toFixed(1)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* 4. Critical Stock Warnings Alert */}
                {getLowStockAlerts().length > 0 && (
                  <div style={{ padding: '1.5rem', background: '#fffbeb', borderLeft: '5px solid var(--offer-orange)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span>¡Alerta Crítica! Productos con bajo nivel de stock (≤ 5 unidades)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '0.5rem' }}>
                      {getLowStockAlerts().map((alert) => (
                        <div key={alert.id} style={{ background: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-dark)' }}>{alert.productName}</strong>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Sucursal: {alert.branchName}</span>
                          </div>
                          <span style={{ background: '#ffedd5', color: 'var(--offer-orange)', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {alert.stock} uds.
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: ADJUSTMENTS & COMBOS */}
            {adminActiveTab === "config" && (
              <div className="animate-fade-in">
                {/* SUB-TABS NAVIGATION BAR FOR CONFIG PANEL (Visible only when not editing) */}
                {!editingCombo && !editingProduct && (
                  <div className="admin-subtabs-bar">
                    <button
                      type="button"
                      className={`admin-subtab-btn ${configSubTab === 'products' ? 'active' : ''}`}
                      onClick={() => setConfigSubTab('products')}
                    >
                      📦 Productos Individuales
                    </button>
                    <button
                      type="button"
                      className={`admin-subtab-btn ${configSubTab === 'combos' ? 'active' : ''}`}
                      onClick={() => setConfigSubTab('combos')}
                    >
                      🧪 Combos y Recetas
                    </button>
                    <button
                      type="button"
                      className={`admin-subtab-btn ${configSubTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setConfigSubTab('settings')}
                    >
                      ⚙️ Ajustes de Tienda
                    </button>
                  </div>
                )}

                {/* SUB-TAB: PRODUCTS MANAGEMENT */}
                {configSubTab === "products" && !editingCombo && (
                  <div>
                    {editingProduct ? (
                      /* PRODUCT EDITOR WIZARD */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                          <div>
                            <span className="admin-dash-subtitle" style={{ display: 'block' }}>Edición de Producto</span>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>
                              {editingProduct.id ? `✏️ Modificar Producto: ${editingProduct.name}` : "✨ Registrar Nuevo Producto"}
                            </h3>
                          </div>
                          <button 
                            type="button" 
                            className="btn-share" 
                            style={{ padding: '0.6rem 1.25rem', fontWeight: 800, fontSize: '0.9rem' }}
                            onClick={() => setEditingProduct(null)}
                          >
                            ← Volver a la Lista
                          </button>
                        </div>

                        <div className="admin-combo-editor-layout" style={{ marginTop: '1rem' }}>
                          <div className="dash-panel-card" style={{ padding: '2rem' }}>
                            {/* Product Wizard steps */}
                            <div className="wizard-steps-container">
                              <div className={`wizard-step ${productFormStep === 1 ? 'active' : ''}`}>
                                1. Información Básica
                              </div>
                              <div className={`wizard-step ${productFormStep === 2 ? 'active' : ''}`}>
                                2. Precios e Imágenes
                              </div>
                              <div className={`wizard-step ${productFormStep === 3 ? 'active' : ''}`}>
                                3. Consumo y Detalles
                              </div>
                            </div>

                            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              {productFormStep === 1 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Nombre del Producto *</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Categoría *</label>
                                      <select 
                                        className="form-input"
                                        value={editingProduct.category_id}
                                        onChange={(e) => setEditingProduct({...editingProduct, category_id: e.target.value})}
                                        required
                                      >
                                        <option value="">Seleccionar Categoría</option>
                                        {categoriesList.map(cat => (
                                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>SKU Código (ej. A05) *</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={editingProduct.sku}
                                        onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Tagline Frase (ej. Tu café con energía) *</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={editingProduct.tagline || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, tagline: e.target.value})}
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Descripción Larga</label>
                                    <textarea 
                                      className="form-input" 
                                      rows="3"
                                      value={editingProduct.description || ""}
                                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                    ></textarea>
                                  </div>
                                </div>
                              )}

                              {productFormStep === 2 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Precio Oferta (Bs.) *</label>
                                      <input 
                                        type="number" 
                                        step="0.1" 
                                        className="form-input" 
                                        value={editingProduct.price_bs}
                                        onChange={(e) => setEditingProduct({...editingProduct, price_bs: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Precio Regular (Bs.) *</label>
                                      <input 
                                        type="number" 
                                        step="0.1" 
                                        className="form-input" 
                                        value={editingProduct.original_price_bs}
                                        onChange={(e) => setEditingProduct({...editingProduct, original_price_bs: e.target.value})}
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>URLs de Fotos/Videos (Uno por línea) *</label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                      Copia y pega los enlaces de Cloudinary u otros servidores. Admite fotos y videos. El primer enlace se usará como portada principal.
                                    </span>
                                    <textarea 
                                      className="form-input" 
                                      rows="4" 
                                      placeholder="https://res.cloudinary.com/...\nhttps://..."
                                      value={editingProduct.media_urls || ""}
                                      onChange={(e) => setEditingProduct({...editingProduct, media_urls: e.target.value})}
                                      required
                                    ></textarea>
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <label className="form-label" style={{ fontSize: '0.88rem', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 800 }}>
                                        📥 Subir imagen o video a Cloudinary:
                                      </label>
                                      <input 
                                        type="file" 
                                        accept="image/*,video/*"
                                        onChange={(e) => handleCloudinaryUpload(e, 'product')}
                                        disabled={uploadingImage}
                                        style={{ fontSize: '0.88rem' }}
                                      />
                                      {uploadingImage && (
                                        <span style={{ fontSize: '0.85rem', color: 'var(--offer-orange)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          ⏳ Subiendo archivo... por favor espere...
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {productFormStep === 3 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Dosis / Modo de Uso</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Tomar 1 cápsula 2 veces al día"
                                        value={editingProduct.dosage || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, dosage: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Detalle de Empaque</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Caja con 30 sobres de 10g"
                                        value={editingProduct.package_detail || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, package_detail: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Etiqueta Destacada (ej. Más Vendido, Popular)</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        value={editingProduct.badge || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, badge: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.5rem' }}>
                                      <input 
                                        type="checkbox" 
                                        id="prodPinned"
                                        checked={!!editingProduct.pinned}
                                        onChange={(e) => setEditingProduct({...editingProduct, pinned: e.target.checked})}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                      />
                                      <label htmlFor="prodPinned" style={{ fontWeight: 800, cursor: 'pointer' }}>Destacar en Inicio (Pinear)</label>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Beneficios (Uno por línea)</label>
                                    <textarea 
                                      className="form-input" 
                                      rows="3" 
                                      placeholder="ej. Mejora la digestión\nAumenta los niveles de calcio"
                                      value={Array.isArray(editingProduct.bullets) ? editingProduct.bullets.join('\n') : editingProduct.bullets || ""}
                                      onChange={(e) => setEditingProduct({...editingProduct, bullets: e.target.value})}
                                    ></textarea>
                                  </div>
                                </div>
                              )}

                              {/* Wizard Navigation */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                                <button
                                  type="button"
                                  className="btn-details-back"
                                  disabled={productFormStep === 1}
                                  onClick={() => setProductFormStep(prev => prev - 1)}
                                  style={{ padding: '0.6rem 1.2rem' }}
                                >
                                  Anterior
                                </button>

                                {productFormStep < 3 ? (
                                  <button
                                    type="button"
                                    className="btn-share"
                                    onClick={() => {
                                      if (productFormStep === 1 && (!editingProduct.name || !editingProduct.category_id || !editingProduct.sku)) {
                                        alert("Por favor completa los campos requeridos (*)");
                                        return;
                                      }
                                      if (productFormStep === 2 && (!editingProduct.price_bs || !editingProduct.original_price_bs || !editingProduct.media_urls)) {
                                        alert("Por favor completa los precios y URL de imagen");
                                        return;
                                      }
                                      setProductFormStep(prev => prev + 1);
                                    }}
                                    style={{ padding: '0.6rem 1.2rem' }}
                                  >
                                    Siguiente
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="btn-add-cart"
                                    style={{ padding: '0.6rem 1.5rem', background: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                                  >
                                    Guardar Producto
                                  </button>
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* PRODUCTS LIST SECTION */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="admin-dash-subtitle" style={{ display: 'block' }}>Configuración de Catálogo</span>
                            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>Productos en la Base de Datos</h2>
                          </div>
                          <button
                            type="button"
                            className="btn-admin-primary"
                            onClick={() => {
                              setProductFormStep(1);
                              setEditingProduct({
                                name: "",
                                sku: "",
                                tagline: "",
                                category_id: "1",
                                description: "",
                                price_bs: 260,
                                original_price_bs: 300,
                                media_urls: "",
                                bullets: "",
                                dosage: "",
                                package_detail: "",
                                badge: "",
                                pinned: false
                              });
                            }}
                          >
                            + Crear Nuevo Producto
                          </button>
                        </div>

                        <div className="dash-panel-card" style={{ width: '100%' }}>
                          <div className="admin-price-table-container">
                            <table className="admin-price-table">
                              <thead>
                                <tr>
                                  <th>Imagen</th>
                                  <th>SKU / Nombre</th>
                                  <th>Categoría</th>
                                  <th>Precio Oferta</th>
                                  <th>Precio Regular</th>
                                  <th>Destacado</th>
                                  <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {products.map(prod => {
                                  const mainImg = getProductImage(prod.id);
                                  return (
                                    <tr key={prod.id}>
                                      <td>
                                        {mainImg ? (
                                          isVideoUrl(mainImg) ? (
                                            <video src={resolveAssetUrl(mainImg)} autoPlay loop muted playsInline style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                          ) : (
                                            <img src={resolveAssetUrl(mainImg)} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                          )
                                        ) : (
                                          <span className="badge-normal" style={{ fontSize: '0.65rem' }}>Sin foto</span>
                                        )}
                                      </td>
                                      <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)' }}>SKU: {prod.sku || 'N/A'}</span>
                                          <span style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{prod.name}</span>
                                        </div>
                                      </td>
                                      <td>{categoriesList.find(c => String(c.id) === String(prod.category_id))?.name || 'General'}</td>
                                      <td style={{ fontWeight: 900, color: 'var(--primary-green)' }}>Bs. {parseFloat(prod.price_bs).toFixed(1)}</td>
                                      <td style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bs. {parseFloat(prod.original_price_bs).toFixed(1)}</td>
                                      <td>
                                        {prod.pinned ? (
                                          <span className="badge-highlight" style={{ fontSize: '0.7rem' }}>⭐ Destacado</span>
                                        ) : (
                                          <span className="badge-normal" style={{ fontSize: '0.7rem' }}>Básico</span>
                                        )}
                                      </td>
                                      <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                          <button 
                                            type="button" 
                                            className="btn-admin-edit"
                                            onClick={async () => {
                                              let mediaUrls = "";
                                              const { data: imgList } = await supabase.from('product_images').select('url').eq('product_id', prod.id).order('position', { ascending: true });
                                              if (imgList && imgList.length > 0) {
                                                mediaUrls = imgList.map(i => i.url).join('\n');
                                              }
                                              
                                              setProductFormStep(1);
                                              setEditingProduct({
                                                ...prod,
                                                media_urls: mediaUrls
                                              });
                                            }}
                                          >
                                            Editar
                                          </button>
                                          <button 
                                            type="button" 
                                            className="btn-admin-delete"
                                            onClick={() => handleDeleteProduct(prod.id)}
                                          >
                                            Borrar
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TAB: COMBOS/KITS MANAGEMENT */}
                {configSubTab === "combos" && !editingProduct && (
                  <div>
                    {editingCombo ? (
                      /* DEDICATED WORKSPACE FOR EDITING/CREATING COMBOS */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                          <div>
                            <span className="admin-dash-subtitle" style={{ display: 'block' }}>Edición de Producto</span>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>
                              {editingCombo.id ? `✏️ Modificar Pack: ${editingCombo.name}` : "✨ Registrar Nuevo Pack / Combo"}
                            </h3>
                          </div>
                          <button 
                            type="button" 
                            className="btn-share" 
                            style={{ padding: '0.6rem 1.25rem', fontWeight: 800, fontSize: '0.9rem' }}
                            onClick={() => setEditingCombo(null)}
                          >
                            ← Volver a la Lista
                          </button>
                        </div>

                        <div className="admin-combo-editor-layout" style={{ marginTop: '1rem' }}>
                          <div className="dash-panel-card" style={{ padding: '2rem' }}>
                            {/* Wizard Steps Indicator */}
                            <div className="wizard-steps-container">
                              <div className={`wizard-step ${formStep === 1 ? 'active' : ''}`}>
                                1. Básico
                              </div>
                              <div className={`wizard-step ${formStep === 2 ? 'active' : ''}`}>
                                2. Precio & Inclusión
                              </div>
                              <div className={`wizard-step ${formStep === 3 ? 'active' : ''}`}>
                                3. Consumo & Destacar
                              </div>
                            </div>

                            <form onSubmit={handleSaveCombo} className="admin-edit-combo-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              
                              {/* STEP 1: BASIC INFORMATION */}
                              {formStep === 1 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Nombre del Kit *</label>
                                      <input 
                                        type="text" 
                                        required
                                        className="form-input"
                                        placeholder="Ej. Kit Energía Diaria"
                                        value={editingCombo.name}
                                        onChange={(e) => setEditingCombo({...editingCombo, name: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Categoría *</label>
                                      <input 
                                        type="text" 
                                        required
                                        className="form-input"
                                        placeholder="Ej. Energía o Bienestar"
                                        value={editingCombo.category}
                                        onChange={(e) => setEditingCombo({...editingCombo, category: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Frase de Impacto (Tagline) *</label>
                                    <input 
                                      type="text" 
                                      required
                                      className="form-input"
                                      placeholder="Ej. Despierta tu potencial con Cordycafe y Té Tianshi"
                                      value={editingCombo.tagline || ""}
                                      onChange={(e) => setEditingCombo({...editingCombo, tagline: e.target.value})}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Imagen o Video Oficial (URL de Cloudinary) *</label>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                                      Enlace directo o sube un archivo. Si lo dejas vacío, se autogenerará un mosaico.
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input 
                                          type="text" 
                                          className="form-input"
                                          placeholder="https://res.cloudinary.com/..."
                                          value={editingCombo.image_url || ""}
                                          onChange={(e) => setEditingCombo({...editingCombo, image_url: e.target.value})}
                                          style={{ flexGrow: 1 }}
                                        />
                                        {editingCombo.image_url && (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {isVideoUrl(editingCombo.image_url) ? (
                                              <video src={editingCombo.image_url} muted style={{ height: '55px', width: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                              <img src={editingCombo.image_url} alt="Cargada" style={{ height: '55px', objectFit: 'contain' }} />
                                            )}
                                            <button type="button" className="btn-qty" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setEditingCombo({...editingCombo, image_url: ''})}>Eliminar</button>
                                          </div>
                                        )}
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label className="form-label" style={{ fontSize: '0.88rem', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 800 }}>
                                          📥 Subir imagen o video para este Combo:
                                        </label>
                                        <input 
                                          type="file" 
                                          accept="image/*,video/*"
                                          onChange={(e) => handleCloudinaryUpload(e, 'combo')}
                                          disabled={uploadingImage}
                                          style={{ fontSize: '0.88rem' }}
                                        />
                                        {uploadingImage && (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                                            ⏳ Subiendo archivo... por favor espere...
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* STEP 2: PRICING AND INCLUSIONS */}
                              {formStep === 2 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Precio Oferta del Pack (Bs.) *</label>
                                      <input 
                                        type="number" 
                                        required
                                        className="form-input"
                                        placeholder="Ej. 188.5"
                                        value={editingCombo.price_bs}
                                        onChange={(e) => setEditingCombo({...editingCombo, price_bs: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Precio Regular Sumado (Bs.) *</label>
                                      <input 
                                        type="number" 
                                        required
                                        className="form-input"
                                        placeholder="Ej. 220"
                                        value={editingCombo.original_price_bs}
                                        onChange={(e) => setEditingCombo({...editingCombo, original_price_bs: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Lista de Productos Incluidos (ej: 1x Cordycafe, 1x Calcio) *</label>
                                    <input 
                                      type="text" 
                                      required
                                      className="form-input"
                                      placeholder="Ej. 1x Cordycafe Tiens, 1x Calcio Nutritivo"
                                      value={editingCombo.includes}
                                      onChange={(e) => setEditingCombo({...editingCombo, includes: e.target.value})}
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Presentación del Combo (Envase)</label>
                                    <input 
                                      type="text" 
                                      className="form-input"
                                      placeholder="Ej. Caja original de cartón + Doypack kraft"
                                      value={editingCombo.package_detail}
                                      onChange={(e) => setEditingCombo({...editingCombo, package_detail: e.target.value})}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* STEP 3: CONSUMPTION AND PINNED BADGES */}
                              {formStep === 3 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Detalles/Beneficios Clave (Uno por línea) *</label>
                                    <textarea 
                                      required
                                      className="form-input"
                                      rows="4"
                                      placeholder="Ej. Estimula el sistema inmune&#10;Aporta energía natural sin taquicardia&#10;Contiene calcio orgánico altamente absorbible"
                                      value={Array.isArray(editingCombo.bullets) ? editingCombo.bullets.join('\n') : editingCombo.bullets}
                                      onChange={(e) => setEditingCombo({...editingCombo, bullets: e.target.value})}
                                    ></textarea>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: 800 }}>Dosis recomendada y Modo de uso *</label>
                                    <input 
                                      type="text" 
                                      required
                                      className="form-input"
                                      placeholder="Ej. Tomar 1 sobre de Cordycafe en la mañana y 1 sobre de Calcio antes de dormir."
                                      value={editingCombo.dosage}
                                      onChange={(e) => setEditingCombo({...editingCombo, dosage: e.target.value})}
                                    />
                                  </div>

                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', alignItems: 'center' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Etiqueta de Oferta especial (ej: Popular, Más Vendido)</label>
                                      <input 
                                        type="text" 
                                        className="form-input"
                                        placeholder="Ej. Popular"
                                        value={editingCombo.badge || ""}
                                        onChange={(e) => setEditingCombo({...editingCombo, badge: e.target.value})}
                                      />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.5rem' }}>
                                      <input 
                                        type="checkbox" 
                                        id="pinned"
                                        checked={!!editingCombo.pinned}
                                        onChange={(e) => setEditingCombo({...editingCombo, pinned: e.target.checked})}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                      />
                                      <label htmlFor="pinned" style={{ fontWeight: 800, cursor: 'pointer' }}>Destacar en Inicio (Pinear)</label>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Navigation Buttons for Wizard */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                                <button 
                                  type="button" 
                                  className="btn-details-back"
                                  disabled={formStep === 1}
                                  onClick={() => setFormStep(prev => prev - 1)}
                                  style={{ padding: '0.6rem 1.2rem' }}
                                >
                                  Anterior
                                </button>
                                
                                {formStep < 3 ? (
                                  <button 
                                    type="button" 
                                    className="btn-share"
                                    onClick={() => {
                                      if (formStep === 1 && (!editingCombo.name || !editingCombo.category)) {
                                        alert("Por favor completa los campos requeridos (*)");
                                        return;
                                      }
                                      if (formStep === 2 && (!editingCombo.price_bs || !editingCombo.original_price_bs || !editingCombo.includes)) {
                                        alert("Por favor completa los precios e ingredientes requeridos (*)");
                                        return;
                                      }
                                      setFormStep(prev => prev + 1);
                                    }}
                                    style={{ padding: '0.6rem 1.25rem' }}
                                  >
                                    Siguiente
                                  </button>
                                ) : (
                                  <button 
                                    type="submit" 
                                    className="btn-add-cart"
                                    style={{ padding: '0.6rem 1.5rem', background: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                                  >
                                    Guardar Combo / Kit
                                  </button>
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* LIST OF COMBOS IN CONFIG DATABASE */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="admin-dash-subtitle" style={{ display: 'block' }}>Configuración de Catálogo</span>
                            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>Combos y Packs Registrados</h2>
                          </div>
                          <button 
                            type="button" 
                            className="btn-admin-primary" 
                            onClick={() => {
                              setFormStep(1);
                              setEditingCombo({
                                name: "",
                                category: "Energía",
                                price_bs: 50,
                                original_price_bs: 70,
                                includes: "",
                                bullets: "",
                                dosage: "",
                                package_detail: "Bolsa doypack kraft original sellada con sello de seguridad Kaldirev.",
                                badge: "",
                                tagline: "",
                                image_url: "",
                                pinned: false
                              });
                            }}
                          >
                            + Crear Nuevo Combo / Kit
                          </button>
                        </div>

                        {/* Combos list table card */}
                        <div className="dash-panel-card" style={{ width: '100%' }}>
                          <div className="admin-price-table-container">
                            <table className="admin-price-table">
                              <thead>
                                <tr>
                                  <th>Imagen</th>
                                  <th>Nombre del Kit</th>
                                  <th>Productos Incluidos</th>
                                  <th>Categoría</th>
                                  <th>Precio Oferta</th>
                                  <th>Precio Regular</th>
                                  <th>Catálogo</th>
                                  <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {combos.map(combo => (
                                  <tr key={combo.id}>
                                    <td>
                                      {getComboImage(combo.id) ? (
                                        isVideoUrl(getComboImage(combo.id)) ? (
                                          <video src={resolveAssetUrl(getComboImage(combo.id))} autoPlay loop muted playsInline style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                        ) : (
                                          <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                        )
                                      ) : (
                                        <span className="badge-normal" style={{ fontSize: '0.65rem' }}>Sin foto</span>
                                      )}
                                    </td>
                                    <td style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{combo.name}</td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={combo.includes}>
                                      {combo.includes}
                                    </td>
                                    <td>{combo.category}</td>
                                    <td style={{ fontWeight: 900, color: 'var(--primary-green)' }}>Bs. {parseFloat(combo.price_bs).toFixed(1)}</td>
                                    <td style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bs. {parseFloat(combo.original_price_bs).toFixed(1)}</td>
                                    <td>
                                      {combo.pinned ? (
                                        <span className="badge-highlight" style={{ fontSize: '0.7rem' }}>⭐ Destacado</span>
                                      ) : (
                                        <span className="badge-normal" style={{ fontSize: '0.7rem' }}>Básico</span>
                                      )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                          type="button" 
                                          className="btn-admin-edit" 
                                          onClick={() => { setFormStep(1); setEditingCombo(combo); }}
                                        >
                                          Editar
                                        </button>
                                        <button 
                                          type="button" 
                                          className="btn-admin-delete" 
                                          onClick={() => handleDeleteCombo(combo.id)}
                                        >
                                          Borrar
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TAB: STORE SETTINGS */}
                {configSubTab === "settings" && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <span className="admin-dash-subtitle" style={{ display: 'block' }}>Ajustes e Integraciones</span>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>Configuración de Tienda</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="admin-settings-layout">
                      {/* Generales settings */}
                      <div className="dash-panel-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>🚀 Enlace de WhatsApp & Delivery</h3>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const val = e.target.whatsapp_number.value;
                          handleSaveSettings('whatsapp_number', val);
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Número Oficial de WhatsApp (con código de país, sin +)</label>
                            <input 
                              type="text" 
                              name="whatsapp_number"
                              className="form-input" 
                              defaultValue={config.whatsappNumber}
                              required
                            />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ej. 59163488086 (código de Bolivia 591 + número)</span>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Tipo de Cambio (Bs. por USD)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              className="form-input" 
                              value={config.exchangeRate}
                              onChange={(e) => handleSaveSettings('exchange_rate', e.target.value)}
                              required
                            />
                          </div>

                          <button type="submit" className="btn-add-cart" style={{ width: '100%', marginTop: '10px', background: 'var(--primary-green)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 'bold' }}>
                            Guardar Enlace Oficial
                          </button>
                        </form>
                      </div>

                      {/* Flash Deal Settings */}
                      <div className="dash-panel-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>⚡ Oferta Relámpago (Banner Superior)</h3>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const val = {
                            is_active: e.target.is_active.checked,
                            title: e.target.title.value,
                            subtitle: e.target.subtitle.value,
                            discount_tag: e.target.discount_tag.value,
                            hours: parseInt(e.target.hours.value) || 0,
                            minutes: parseInt(e.target.minutes.value) || 0,
                            seconds: 0,
                            combo_id: parseInt(e.target.combo_id.value)
                          };
                          handleSaveSettings('flash_deal', val);
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <input 
                              type="checkbox" 
                              name="is_active"
                              id="flashActive"
                              defaultChecked={config.flashDeal?.is_active}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="flashActive" style={{ fontWeight: 800, cursor: 'pointer' }}>Activar Oferta Relámpago</label>
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Título de la Oferta</label>
                            <input 
                              type="text" 
                              name="title"
                              className="form-input" 
                              defaultValue={config.flashDeal?.title}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Subtítulo / Detalles</label>
                            <input 
                              type="text" 
                              name="subtitle"
                              className="form-input" 
                              defaultValue={config.flashDeal?.subtitle}
                              required
                            />
                          </div>

                          <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 800 }}>Etiqueta Descuento</label>
                              <input 
                                type="text" 
                                name="discount_tag"
                                className="form-input" 
                                placeholder="ej. 25% OFF"
                                defaultValue={config.flashDeal?.discount_tag}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 800 }}>Combo Enlazado</label>
                              <select 
                                name="combo_id"
                                className="form-input"
                                defaultValue={config.flashDeal?.combo_id}
                                required
                              >
                                {combos.map(combo => (
                                  <option key={combo.id} value={combo.id}>{combo.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 800 }}>Duración (Horas)</label>
                              <input 
                                type="number" 
                                name="hours"
                                className="form-input" 
                                defaultValue={config.flashDeal?.hours || 4}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 800 }}>Minutos</label>
                              <input 
                                type="number" 
                                name="minutes"
                                className="form-input" 
                                defaultValue={config.flashDeal?.minutes || 30}
                                required
                              />
                            </div>
                          </div>

                          <button type="submit" className="btn-add-cart" style={{ width: '100%', marginTop: '10px', background: 'var(--primary-green)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 'bold' }}>
                            Guardar Ajuste de Oferta
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REGISTERED ORDERS LOG */}
            {adminActiveTab === "orders" && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section className="admin-dash-stats-grid" style={{ padding: 0 }}>
                  <div className="stat-card">
                    <span className="stat-card-label">Ventas Totales</span>
                    <span className="stat-card-value">Bs. {getTotalSales()}</span>
                    <span className="stat-card-change">Pedidos completados</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card-label">Pedidos Pendientes</span>
                    <span className="stat-card-value">{getPendingOrdersCount()} Activos</span>
                    <span className="stat-card-change">Por despachar</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-card-label">Total Pedidos</span>
                    <span className="stat-card-value">{orders.length}</span>
                    <span className="stat-card-change">Pedidos registrados en base de datos</span>
                  </div>
                </section>

                <div className="dash-panel-card">
                  <div className="orders-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <h3 className="dash-panel-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>Historial de Ventas</h3>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Filtrar Estado:</span>
                      <select 
                        className="form-select"
                        style={{ width: '150px', padding: '0.4rem 0.6rem' }}
                        value={orderFilterStatus}
                        onChange={(e) => setOrderFilterStatus(e.target.value)}
                      >
                        <option value="Todos">Todos</option>
                        <option value="Pendiente">Pendientes</option>
                        <option value="Completado">Completados</option>
                        <option value="Cancelado">Cancelados</option>
                      </select>
                      <button type="button" className="btn-share" onClick={fetchOrders} style={{ padding: '0.5rem 1rem' }}>Refrescar</button>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="skeleton-container" style={{ padding: '2rem' }}>
                      <div className="skeleton-line" style={{ height: '30px', margin: '10px 0' }}></div>
                      <div className="skeleton-line" style={{ height: '30px', margin: '10px 0' }}></div>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="admin-empty-state" style={{ padding: '4rem 1rem' }}>
                      <p>No se encontraron pedidos con el filtro seleccionado.</p>
                    </div>
                  ) : (
                    <div className="admin-price-table-container">
                      <table className="admin-price-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>WhatsApp</th>
                            <th>Detalle Envío</th>
                            <th>Detalle de Kits</th>
                            <th>Pago</th>
                            <th>Logística</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map(order => (
                            <tr key={order.id}>
                              <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                {new Date(order.created_at).toLocaleDateString('es-BO', {
                                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                })}
                              </td>
                              <td style={{ fontWeight: 700 }}>{order.customer_name}</td>
                              <td>
                                <a 
                                  href={`https://wa.me/${order.phone}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  style={{ color: 'var(--primary-green)', fontWeight: 800, textDecoration: 'underline' }}
                                >
                                  {order.phone}
                                </a>
                              </td>
                              <td>
                                <span style={{ display: 'block', fontSize: '0.82rem' }}>{order.address}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                                  {order.city} ({branches.find(b => b.id === order.branch_id)?.name || 'SCZ'})
                                </span>
                                {order.gps_coordinates && (
                                  <a 
                                    href={order.gps_coordinates} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', color: '#1a73e8', textDecoration: 'underline', marginTop: '4px' }}
                                  >
                                    📍 Ver GPS Maps
                                  </a>
                                )}
                              </td>
                              <td>
                                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.82rem' }}>
                                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                                    <li key={idx}>
                                      <strong>{item.quantity}x</strong> {item.name}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td>
                                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600 }}>{order.payment_method === 'QR Libelula' ? 'QR Libélula' : order.payment_method}</span>
                                {order.payment_method === 'QR Libelula' && (
                                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className={`status-pill status-${order.qr_payment_status === 'Pagado' ? 'completado' : 'pendiente'}`} style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                                      {order.qr_payment_status || 'Pendiente'}
                                    </span>
                                    {order.qr_payment_status !== 'Pagado' && (
                                      <button
                                        className="btn-qty"
                                        style={{ fontSize: '0.7rem', padding: '2px 4px', border: '1px solid var(--accent-gold)', cursor: 'pointer', background: 'none' }}
                                        onClick={async () => {
                                          const { error } = await supabase
                                            .from('orders')
                                            .update({ qr_payment_status: 'Pagado' })
                                            .eq('id', order.id);
                                          if (error) {
                                            window.Swal.fire('Error', error.message, 'error');
                                          } else {
                                            window.Swal.fire('Pago Confirmado', 'Pedido marcado como pagado exitosamente.', 'success');
                                            fetchOrders();
                                          }
                                        }}
                                      >
                                        Confirmar
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td>
                                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 'bold' }}>{order.delivery_method}</span>
                                {order.delivery_method?.includes('Nacional') || order.delivery_method?.includes('OCS') ? (
                                  <div style={{ marginTop: '5px', display: 'flex', gap: '4px', flexDirection: 'column' }}>
                                    <input 
                                      type="text" 
                                      placeholder="Guía OCS..." 
                                      className="form-input"
                                      style={{ width: '105px', padding: '0.2rem 0.4rem', fontSize: '0.78rem' }}
                                      defaultValue={order.tracking_id || ''}
                                      onBlur={async (e) => {
                                        const newTrackingId = e.target.value;
                                        if (newTrackingId !== order.tracking_id) {
                                          const { error } = await supabase
                                            .from('orders')
                                            .update({ tracking_id: newTrackingId })
                                            .eq('id', order.id);
                                          if (error) {
                                            window.Swal.fire('Error', error.message, 'error');
                                          } else {
                                            window.Swal.fire({
                                              title: 'Rastreo Guardado',
                                              text: `Guía de envío actualizada.`,
                                              icon: 'success',
                                              timer: 1200,
                                              showConfirmButton: false
                                            });
                                            fetchOrders();
                                          }
                                        }
                                      }}
                                    />
                                    {order.tracking_id && (
                                      <button
                                        className="btn-share"
                                        style={{ padding: '2px 6px', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => {
                                          const trackingMsg = `¡Hola ${order.customer_name}! Tu pedido de suplementos Kaldirev ya ha sido despachado por OCS Courier interdepartamental. 📦\n\nTu número de guía de rastreo es: *${order.tracking_id}*.\nPuedes realizar el seguimiento en la sucursal de OCS o bus de flota indicada.\n\n¡Gracias por tu confianza! 🌱`;
                                          const waUrl = `https://api.whatsapp.com/send?phone=${order.phone}&text=${encodeURIComponent(trackingMsg)}`;
                                          window.open(waUrl, '_blank');
                                        }}
                                      >
                                        📲 Enviar Guía WA
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mismo día local</span>
                                )}
                              </td>
                              <td style={{ fontWeight: 800, color: 'var(--primary-green)', fontSize: '1.05rem' }}>Bs. {parseFloat(order.total_bs).toFixed(1)}</td>
                              <td>
                                <span className={`status-pill status-${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  {order.status !== 'Completado' && (
                                    <button 
                                      className="btn-admin-edit" 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Completado')}
                                    >
                                      ✔ Listo
                                    </button>
                                  )}
                                  {order.status !== 'Cancelado' && (
                                    <button 
                                      className="btn-admin-delete" 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Cancelado')}
                                    >
                                      ✖ Cancelar
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: STOCKS AND BRANCHES */}
            {adminActiveTab === "stocks" && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Branches List & Management */}
                <div className="dash-panel-card" style={{ width: '100%' }}>
                  <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-green)', margin: 0 }}>
                      Sucursales Activas y Costos de Envío
                    </h3>
                  </div>
                  <div className="admin-price-table-container">
                    <table className="admin-price-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Ciudad / Sucursal</th>
                          <th>Dirección / Almacén</th>
                          <th>Costo de Envío (Bs.)</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branches.map(b => (
                          <tr key={b.id}>
                            <td>{b.id}</td>
                            <td><strong>{b.name}</strong></td>
                            <td>{b.address || 'Sin dirección registrada'}</td>
                            <td>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ width: '80px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                value={b.shipping_cost_bs} 
                                onChange={(e) => {
                                  const newVal = parseFloat(e.target.value) || 0;
                                  setBranches(prev => prev.map(item => item.id === b.id ? { ...item, shipping_cost_bs: newVal } : item));
                                }}
                              />
                            </td>
                            <td>
                              <button 
                                className="btn-success-close" 
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', width: 'auto', background: 'var(--accent-gold)' }}
                                onClick={async () => {
                                  const { error } = await supabase
                                    .from('branches')
                                    .update({ shipping_cost_bs: b.shipping_cost_bs })
                                    .eq('id', b.id);
                                  if (error) {
                                    window.Swal.fire('Error', error.message, 'error');
                                  } else {
                                    window.Swal.fire({
                                      title: 'Costo Guardado',
                                      text: `Envío para ${b.name} actualizado.`,
                                      icon: 'success',
                                      timer: 1500,
                                      showConfirmButton: false
                                    });
                                    fetchStoreData();
                                  }
                                }}
                              >
                                Guardar Bs.
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stock Matrix Editor Grid */}
                <div className="dash-panel-card" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-green)', margin: 0 }}>
                      Matriz de Existencias Multi-Stock
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                      Control de Inventario por Almacén
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Modifica el stock directamente en los casilleros de cada sucursal y presiona el botón "Guardar Cambios de Inventario" para actualizar la base de datos de Supabase.
                  </p>

                  <div className="admin-price-table-container">
                    <table className="admin-price-table">
                      <thead>
                        <tr>
                          <th>Producto Individual</th>
                          {branches.map(b => (
                            <th key={b.id}>{b.name} (Stock)</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {getProductImage(product.id) && (
                                <img src={getProductImage(product.id)} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                              )}
                              <strong>{product.name}</strong>
                            </td>
                            {branches.map(b => {
                              const getStockForBranch = (pId, bId) => {
                                const obj = productStocks.find(s => s.product_id === pId && s.branch_id === bId);
                                return obj ? obj.stock : 0;
                              };
                              return (
                                <td key={b.id}>
                                  <input 
                                    type="number" 
                                    className="form-input" 
                                    style={{ width: '100px', padding: '0.3rem 0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}
                                    value={getStockForBranch(product.id, b.id)} 
                                    onChange={(e) => {
                                      const newStockVal = parseInt(e.target.value) || 0;
                                      setProductStocks(prev => {
                                        const exists = prev.some(s => s.product_id === product.id && s.branch_id === b.id);
                                        if (exists) {
                                          return prev.map(s => (s.product_id === product.id && s.branch_id === b.id) ? { ...s, stock: newStockVal } : s);
                                        } else {
                                          return [...prev, { product_id: product.id, branch_id: b.id, stock: newStockVal }];
                                        }
                                      });
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-success-close"
                      style={{ padding: '0.85rem 1.75rem', width: 'auto', background: 'var(--primary-green)', fontWeight: 'bold', fontSize: '0.95rem' }}
                      onClick={async () => {
                        try {
                          const upsertPayload = productStocks.map(s => ({
                            product_id: s.product_id,
                            branch_id: s.branch_id,
                            stock: s.stock
                          }));
                          
                          const { error } = await supabase
                            .from('product_stock')
                            .upsert(upsertPayload, { onConflict: 'product_id,branch_id' });
                          
                          if (error) throw error;

                          window.Swal.fire({
                            title: 'Inventario Guardado',
                            text: 'Las existencias de todos los productos y sucursales han sido actualizadas en la base de datos.',
                            icon: 'success',
                            confirmButtonColor: 'var(--primary-green)'
                          });
                          fetchStoreData();
                        } catch (err) {
                          window.Swal.fire('Error al guardar inventario', err.message, 'error');
                        }
                      }}
                    >
                      💾 Guardar Cambios de Inventario
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TESTIMONIALS & FAQS */}
            {adminActiveTab === "extras" && (
              <div className="admin-two-cols animate-fade-in" style={{ padding: 0 }}>
                {/* Testimonials */}
                <div className="dash-panel-card">
                  <h3 className="dash-panel-card-title">Gestionar Opiniones de Clientes</h3>
                  <form onSubmit={handleSaveTestimonial} style={{ marginBottom: '2rem', padding: '1rem', background: '#faf9f5', borderRadius: '12px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{editingTestimonial?.id ? "Editar Opinión" : "Crear Nueva Opinión"}</h4>
                    <div className="form-group">
                      <label className="form-label">Texto de la Opinión</label>
                      <textarea 
                        className="form-input"
                        rows="2"
                        required
                        value={editingTestimonial?.text || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                      />
                    </div>
                    <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Autor y Ciudad</label>
                        <input 
                          type="text" 
                          className="form-input"
                          placeholder="Ej. Pedro V. (Santa Cruz)"
                          required
                          value={editingTestimonial?.author || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Estrellas</label>
                        <select 
                          className="form-select"
                          value={editingTestimonial?.stars || 5}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, stars: e.target.value })}
                        >
                          <option value="5">5 Estrellas</option>
                          <option value="4">4 Estrellas</option>
                          <option value="3">3 Estrellas</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-dash-save" style={{ flexGrow: 1 }}>
                        Guardar Opinión
                      </button>
                      {editingTestimonial && (
                        <button type="button" className="btn-dash-cancel" onClick={() => setEditingTestimonial(null)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>

                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {testimonials.map(t => (
                      <div key={t.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{t.text}"</p>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{t.author} - {t.stars} ⭐</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button type="button" className="btn-share" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={() => setEditingTestimonial(t)}>Editar</button>
                          <button type="button" className="btn-back-to-cart" style={{ padding: '2px 6px', fontSize: '0.75rem', color: 'red' }} onClick={() => handleDeleteTestimonial(t.id)}>Borrar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="dash-panel-card">
                  <h3 className="dash-panel-card-title">Gestionar Preguntas Frecuentes</h3>
                  <form onSubmit={handleSaveFaq} style={{ marginBottom: '2rem', padding: '1rem', background: '#faf9f5', borderRadius: '12px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{editingFaq?.id ? "Editar Pregunta" : "Crear Nueva Pregunta"}</h4>
                    <div className="form-group">
                      <label className="form-label">Pregunta</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required
                        value={editingFaq?.question || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Respuesta</label>
                      <textarea 
                        className="form-input"
                        rows="3"
                        required
                        value={editingFaq?.answer || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Orden</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={editingFaq?.display_order || 0}
                        onChange={(e) => setEditingFaq({ ...editingFaq, display_order: e.target.value })}
                      />
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-dash-save" style={{ flexGrow: 1 }}>
                        Guardar Pregunta
                      </button>
                      {editingFaq && (
                        <button type="button" className="btn-dash-cancel" onClick={() => setEditingFaq(null)}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {faqs.map(f => (
                      <div key={f.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ maxWidth: '75%' }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{f.question}</p>
                          <p style={{ fontSize: '0.75rem', color: '#666' }}>{f.answer.substring(0, 85)}...</p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button type="button" className="btn-share" style={{ padding: '2px 6px', fontSize: '0.75rem' }} onClick={() => setEditingFaq(f)}>Editar</button>
                          <button type="button" className="btn-back-to-cart" style={{ padding: '2px 6px', fontSize: '0.75rem', color: 'red' }} onClick={() => handleDeleteFaq(f.id)}>Borrar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Save Toast Notification */}
        {showAdminSaveToast && (
          <div className="toast-admin-save">
            ¡Configuración guardada exitosamente en Supabase!
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* HEADER SECTION */}
      <header>
        <div className="logo-container" onClick={() => { setActiveCategory("Todos"); setSearchTerm(""); closeComboDetails(); }}>
          <div className="logo-mark">
            <span className="logo-title" style={{ fontSize: '1.8rem', color: 'white' }}>K</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">Kaldirev</span>
            <span className="logo-subtitle">Bienestar & Energía</span>
          </div>
        </div>



        {/* AUTHENTICATION / ACCESS CONTROLS */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div className="user-badge-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                onClick={() => { setView("pedidos"); fetchUserOrders(user.id); }}
                title="Ver mis pedidos"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-gold)' }} />
                ) : (
                  <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info-text-desktop" style={{ fontSize: '0.85rem' }}>
                <span 
                  style={{ display: 'block', fontWeight: 700, color: 'var(--primary-green)', cursor: 'pointer' }}
                  onClick={() => { setView("pedidos"); fetchUserOrders(user.id); }}
                >
                  {profile?.full_name || "Cliente"}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { setView("pedidos"); fetchUserOrders(user.id); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Mis Pedidos
                  </button>
                  <span style={{ color: 'var(--border-color)', fontSize: '0.75rem' }}>|</span>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '0.75rem' }}>Salir</button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              className="btn-google-login" 
              onClick={() => { setView("perfil"); setAuthError(""); }}
              title="Iniciar sesión / Registrarse"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="desktop-only">Iniciar Sesión</span>
            </button>
          )}

          <button 
            className="cart-trigger" 
            onClick={() => { setIsCartOpen(true); setIsCheckingOut(false); }}
            aria-label="Abrir Carrito"
            style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '50%' }}
          >
            <svg className="svg-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </button>
        </div>
      </header>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div style={{ background: '#ffeeee', border: '1px solid #ffcccc', color: '#cc0000', margin: '1rem 1.5rem', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* CORE PAGES ROUTING */}
      {view === "catalog" && (
        /* ==================== VIEW 1: PRODUCT CATALOG ==================== */
        <main>
          {/* HERO BANNER SECTION */}
          <section className="hero-banner animate-fade-in">
            <div className="hero-content">
              <span className="eco-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.5C18.6 17 15 20 11 20z"></path>
                  <path d="M19 2c-2.26 4.33-5.27 7.14-8 10"></path>
                </svg>
                Envío Sostenible Kraft Termosellado
              </span>
              <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Kaldirev • Bienestar & Energía</h1>
              <p className="hero-description" style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
                Combos exclusivos empacados con sello de seguridad. Pedidos rápidos por WhatsApp y delivery en Santa Cruz de la Sierra.
              </p>
              <button className="hero-cta" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }} onClick={() => {
                const el = document.getElementById('catalog-title');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                Ver Catálogo en Bolivianos
              </button>
            </div>
          </section>

          {/* ECO INFO STRIP */}
          <div className="info-strip animate-fade-in" style={{ fontSize: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <strong>Garantía de Calidad:</strong> Todo el catálogo se entrega sellado térmicamente para asegurar cero manipulación.
            </div>
          </div>

          {/* DYNAMIC MARKETING PROMOTIONS GRID (Amazon/Shopify style) */}
          <section className="marketing-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="promo-tile-card" style={{ background: 'linear-gradient(135deg, #103d2e 0%, #175743 100%)', borderRadius: '12px', padding: '1.5rem', color: 'white', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Despacho Express</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>Entregas coordinadas en menos de 2 horas en Santa Cruz por courier express.</p>
              </div>
            </div>

            <div className="promo-tile-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ background: 'rgba(16, 61, 46, 0.05)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-green)' }}>Garantía 100% Sellado</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bolsas kraft termoselladas manuales con precinto de seguridad anti-manipulación.</p>
              </div>
            </div>

            <div className="promo-tile-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ background: 'rgba(197, 160, 89, 0.08)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b89047" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#b89047' }}>Asesoría Directa</h4>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>¿Dudas sobre dosis? Chatea en vivo con nuestros asesores de salud autorizados.</p>
              </div>
            </div>
          </section>

          {/* SEARCH BAR */}
          <section className="search-container animate-fade-in" style={{ padding: '0 1.5rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div className="search-icon-wrapper" style={{ position: 'absolute', left: '15px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                className="search-input" 
                style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3rem', fontSize: '1.05rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white' }}
                placeholder="Buscar kit o combo (ej. Energía, Calcio, Huesos, Antojo)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </section>

          {/* DYNAMIC FLASH DEAL COUNTDOWN BANNER (Marketing Hero Promo) */}
          {flashDeal && flashDeal.is_active && (
            <section className="flash-deal-banner animate-fade-in" style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '2px dashed var(--accent-gold)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(197, 160, 89, 0.08)' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(217, 83, 30, 0.1)', color: 'var(--offer-orange)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ flexShrink: 0 }}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <span style={{ background: 'var(--offer-orange)', color: 'white', fontSize: '0.68rem', fontWeight: 900, padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {flashDeal.discount_tag || "Oferta Relámpago"}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-green)' }}>{flashDeal.title}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                      {flashDeal.subtitle}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                  {/* Countdown display */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>Termina en:</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ background: 'var(--primary-green)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', minWidth: '38px', textAlign: 'center' }}>
                        {String(countdownTime.hours).padStart(2, '0')}
                        <div style={{ fontSize: '0.52rem', fontWeight: 500, opacity: 0.8, marginTop: '2px' }}>Horas</div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-green)', alignSelf: 'center' }}>:</span>
                      <div style={{ background: 'var(--primary-green)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', minWidth: '38px', textAlign: 'center' }}>
                        {String(countdownTime.minutes).padStart(2, '0')}
                        <div style={{ fontSize: '0.52rem', fontWeight: 500, opacity: 0.8, marginTop: '2px' }}>Min</div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-green)', alignSelf: 'center' }}>:</span>
                      <div style={{ background: 'var(--primary-green)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', minWidth: '38px', textAlign: 'center' }}>
                        {String(countdownTime.seconds).padStart(2, '0')}
                        <div style={{ fontSize: '0.52rem', fontWeight: 500, opacity: 0.8, marginTop: '2px' }}>Seg</div>
                      </div>
                    </div>
                  </div>

                  {/* Direct CTA */}
                  <button
                    type="button"
                    className="btn-add-cart"
                    style={{ background: 'var(--offer-orange)', padding: '0.8rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => {
                      const kit = combos.find(c => c.id === flashDeal.combo_id);
                      if (kit) {
                        addToCart(kit, 'combo');
                      } else {
                        const prod = products.find(p => p.id === flashDeal.combo_id);
                        if (prod) addToCart(prod, 'product');
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Reclamar Oferta
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TABS FILTER */}
          <section className="filter-container animate-fade-in" style={{ marginTop: '1.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                style={{ fontSize: '0.95rem', padding: '0.6rem 1.25rem' }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "Todos" ? "Todos los Combos" : cat}
              </button>
            ))}
          </section>

          {/* CATALOG SECTION */}
          <section className="products-section animate-fade-in" id="catalog-title">
            
            {loading ? (
              <div>
                <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Cargando Catálogo Oficial...</h2>
                <div className="products-grid">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="product-card skeleton-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '15px', padding: '1.5rem', background: 'white' }}>
                      <div className="skeleton-image loading-shimmer" style={{ height: '180px', borderRadius: '8px' }}></div>
                      <div className="skeleton-line loading-shimmer" style={{ height: '24px', width: '70%', borderRadius: '4px' }}></div>
                      <div className="skeleton-line loading-shimmer" style={{ height: '16px', width: '90%', borderRadius: '4px' }}></div>
                      <div className="skeleton-line loading-shimmer" style={{ height: '36px', marginTop: 'auto', borderRadius: '8px' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* 1. PINNED / HIGHLIGHTED COMBOS (Kits Recomendados) */}
                {pinnedCombos.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      <h2 className="section-title" style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0 }}>Kits Recomendados</h2>
                    </div>
                    <div className="recommended-container" style={{ marginTop: '1rem' }}>
                      {pinnedCombos.map(combo => (
                        <article 
                          className="product-card pinned animate-fade-in" 
                          key={combo.id}
                          onClick={() => openComboDetails(combo, 'combo')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-image-container">
                            {getComboImage(combo.id) ? (
                              isVideoUrl(getComboImage(combo.id)) ? (
                                <video src={resolveAssetUrl(getComboImage(combo.id))} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              )
                            ) : (
                              <div className="product-image-placeholder">
                                <div className="doypack-illustration">
                                  <div className="doypack-zipper"></div>
                                  <div className="doypack-tag">
                                    <span className="doypack-tag-logo">TIENS</span>
                                    <div className="doypack-tag-dot"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="product-details">
                            <span className="product-category">Combo Especial</span>
                            <h3 className="product-name" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 4px' }}>{combo.name}</h3>
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#b89047', fontWeight: 700, marginBottom: '6px' }}>
                              {combo.tagline}
                            </span>
                            
                            <div className="stars-row" style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(4.9)</span>
                            </div>

                            <div className="product-price-row-container" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(235, 220, 201, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span className="price-original">Bs. {parseFloat(combo.original_price_bs).toFixed(1)}</span>
                                  <span className="price-current">Bs. {parseFloat(combo.price_bs).toFixed(1)}</span>
                                </div>
                                
                                <div className="mobile-add-action">
                                  {getComboStock(combo.id, selectedBranch?.id || 1) > 0 ? (
                                    <button 
                                      className="btn-add-cart-circle" 
                                      onClick={(e) => { 
                                        e.stopPropagation();
                                        addToCart(combo, 'combo'); 
                                      }}
                                      title="Añadir al pedido"
                                      aria-label="Añadir al pedido"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                    </button>
                                  ) : (
                                    <span className="mobile-badge-soldout">Agotado</span>
                                  )}
                                </div>
                              </div>
                              {getComboStock(combo.id, selectedBranch?.id || 1) > 0 && getComboStock(combo.id, selectedBranch?.id || 1) <= 5 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--offer-orange)', fontWeight: 'bold', textAlign: 'left' }}>
                                  ⚠️ ¡Solo {getComboStock(combo.id, selectedBranch?.id || 1)} disponibles!
                                </div>
                              )}
                            </div>

                            <div className="card-actions-row desktop-only-actions">
                              {getComboStock(combo.id, selectedBranch?.id || 1) > 0 ? (
                                <button 
                                  className="btn-add-cart" 
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700 }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    addToCart(combo, 'combo'); 
                                  }}
                                >
                                  Añadir al Pedido
                                </button>
                              ) : (
                                <button 
                                  className="btn-add-cart" 
                                  disabled
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.78rem', fontWeight: 700, background: '#a89e90', cursor: 'not-allowed', color: 'white', border: 'none' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Agotado
                                </button>
                              )}
                              <button 
                                  type="button"
                                  className="btn-share"
                                  style={{ padding: '0.8rem', fontSize: '0.9rem' }}
                                  title="Ver detalles"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openComboDetails(combo, 'combo');
                                  }}
                                >
                                  Detalles
                                </button>
                              </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. INDIVIDUAL PRODUCTS GRID */}
                {filteredProducts.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        <path d="M12 2v20"></path>
                      </svg>
                      <h2 className="section-title" style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0 }}>Suplementos Individuales</h2>
                    </div>
                    <div className="products-grid" style={{ marginTop: '1rem' }}>
                      {filteredProducts.map(product => (
                        <article 
                          className="product-card animate-fade-in" 
                          key={product.id}
                          onClick={() => openComboDetails(product, 'product')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-image-container">
                            {(() => {
                              const mainImg = getProductImage(product.id);
                              if (mainImg) {
                                if (isVideoUrl(mainImg)) {
                                  return <video src={resolveAssetUrl(mainImg)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                                } else {
                                  return <img src={resolveAssetUrl(mainImg)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                                }
                              } else {
                                return (
                                  <div className="product-image-placeholder">
                                    <div className="doypack-illustration">
                                      <div className="doypack-zipper"></div>
                                      <div className="doypack-tag">
                                        <span className="doypack-tag-logo">TIENS</span>
                                        <div className="doypack-tag-dot"></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })()}
                          </div>

                          <div className="product-details">
                            <span className="product-category">
                              Tiens • {categoriesList.find(cat => cat.id === product.category_id)?.name || 'Nutrición'}
                            </span>
                            <h3 className="product-name" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '2px 0 4px' }}>{product.name}</h3>
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#b89047', fontWeight: 700, marginBottom: '6px' }}>
                              {product.tagline}
                            </span>
                            
                            <div className="stars-row" style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(4.8)</span>
                            </div>
                            
                            <div className="product-trust-line" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#2e7d32', fontWeight: 600, marginBottom: '6px' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <span>
                                {String(product.id) === "1" && "98 comprados esta semana en Bolivia"}
                                {String(product.id) === "2" && "Fórmula patentada • Alta demanda"}
                                {String(product.id) === "3" && "15 personas lo están viendo ahora"}
                                {String(product.id) === "4" && "Recomendado por asesores Tiens"}
                                {String(product.id) === "5" && "Cuidado corporal premium verificado"}
                                {String(product.id) === "6" && "Efecto tensor antiedad verificado"}
                                {!["1","2","3","4","5","6"].includes(String(product.id)) && "Garantía original de fábrica"}
                              </span>
                            </div>

                            <div className="product-price-row-container" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(235, 220, 201, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span className="price-original">Bs. {parseFloat(product.original_price_bs).toFixed(1)}</span>
                                  <span className="price-current">Bs. {parseFloat(product.price_bs).toFixed(1)}</span>
                                </div>
                                
                                <div className="mobile-add-action">
                                  {getProductStock(product.id, selectedBranch?.id || 1) > 0 ? (
                                    <button 
                                      className="btn-add-cart-circle" 
                                      onClick={(e) => { 
                                        e.stopPropagation();
                                        addToCart(product, 'product'); 
                                      }}
                                      title="Añadir al pedido"
                                      aria-label="Añadir al pedido"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                    </button>
                                  ) : (
                                    <span className="mobile-badge-soldout">Agotado</span>
                                  )}
                                </div>
                              </div>
                              {getProductStock(product.id, selectedBranch?.id || 1) > 0 && getProductStock(product.id, selectedBranch?.id || 1) <= 5 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--offer-orange)', fontWeight: 'bold', textAlign: 'left' }}>
                                  ⚠️ ¡Solo {getProductStock(product.id, selectedBranch?.id || 1)} disponibles!
                                </div>
                              )}
                            </div>

                            <div className="card-actions-row desktop-only-actions">
                              {getProductStock(product.id, selectedBranch?.id || 1) > 0 ? (
                                <button 
                                  className="btn-add-cart" 
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.95rem' }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    addToCart(product, 'product'); 
                                  }}
                                >
                                  Añadir al Pedido
                                </button>
                              ) : (
                                <button 
                                  className="btn-add-cart" 
                                  disabled
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.78rem', fontWeight: 700, background: '#a89e90', cursor: 'not-allowed', color: 'white', border: 'none' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Agotado
                                </button>
                              )}
                              <button 
                                className="btn-share"
                                style={{ padding: '0.8rem', fontSize: '0.9rem' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openComboDetails(product, 'product');
                                }}
                              >
                                Detalles
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. OTHER COMBOS GRID */}
                {otherCombos.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-title-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--offer-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                      </svg>
                      <h2 className="section-title" style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0 }}>Otros Combos en Oferta</h2>
                    </div>
                    <div className="products-grid" style={{ marginTop: '1rem' }}>
                      {otherCombos.map(combo => (
                        <article 
                          className="product-card animate-fade-in" 
                          key={combo.id}
                          onClick={() => openComboDetails(combo, 'combo')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-image-container">
                            {getComboImage(combo.id) ? (
                              isVideoUrl(getComboImage(combo.id)) ? (
                                <video src={resolveAssetUrl(getComboImage(combo.id))} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              )
                            ) : combo.image_url ? (
                              isVideoUrl(combo.image_url) ? (
                                <video src={combo.image_url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={combo.image_url} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              )
                            ) : (
                              <div className="product-image-placeholder">
                                <div className="doypack-illustration">
                                  <div className="doypack-zipper"></div>
                                  <div className="doypack-tag">
                                    <span className="doypack-tag-logo">TIENS</span>
                                    <div className="doypack-tag-dot"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="product-details">
                            <span className="product-category">Combo Especial</span>
                            <h3 className="product-name" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 4px' }}>{combo.name}</h3>
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#b89047', fontWeight: 700, marginBottom: '6px' }}>
                              {combo.tagline}
                            </span>
                            
                            <div className="stars-row" style={{ color: 'var(--accent-gold)', marginBottom: '8px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>(4.9)</span>
                            </div>

                            <div className="product-price-row-container" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div className="product-price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(235, 220, 201, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span className="price-original">Bs. {parseFloat(combo.original_price_bs).toFixed(1)}</span>
                                  <span className="price-current">Bs. {parseFloat(combo.price_bs).toFixed(1)}</span>
                                </div>
                                
                                <div className="mobile-add-action">
                                  {getComboStock(combo.id, selectedBranch?.id || 1) > 0 ? (
                                    <button 
                                      className="btn-add-cart-circle" 
                                      onClick={(e) => { 
                                        e.stopPropagation();
                                        addToCart(combo, 'combo'); 
                                      }}
                                      title="Añadir al pedido"
                                      aria-label="Añadir al pedido"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                    </button>
                                  ) : (
                                    <span className="mobile-badge-soldout">Agotado</span>
                                  )}
                                </div>
                              </div>
                              {getComboStock(combo.id, selectedBranch?.id || 1) > 0 && getComboStock(combo.id, selectedBranch?.id || 1) <= 5 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--offer-orange)', fontWeight: 'bold', textAlign: 'left' }}>
                                  ⚠️ ¡Solo {getComboStock(combo.id, selectedBranch?.id || 1)} disponibles!
                                </div>
                              )}
                            </div>

                            <div className="card-actions-row desktop-only-actions">
                              {getComboStock(combo.id, selectedBranch?.id || 1) > 0 ? (
                                <button 
                                  className="btn-add-cart" 
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.95rem' }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    addToCart(combo, 'combo'); 
                                  }}
                                >
                                  Añadir al Pedido
                                </button>
                              ) : (
                                <button 
                                  className="btn-add-cart" 
                                  disabled
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.78rem', fontWeight: 700, background: '#a89e90', cursor: 'not-allowed', color: 'white', border: 'none' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Agotado
                                </button>
                              )}
                              <button 
                                className="btn-share"
                                style={{ padding: '0.8rem', fontSize: '0.9rem' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openComboDetails(combo, 'combo');
                                }}
                              >
                                Detalles
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty search state */}
                {filteredCombos.length === 0 && filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>No se encontraron productos o combos para tu búsqueda.</p>
                    <button 
                      className="hero-cta" 
                      style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
                      onClick={() => { setSearchTerm(""); setActiveCategory("Todos"); }}
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                )}
              </>
            )}

          </section>

          {testimonials.length > 0 && (
            <section className="testimonials-section">
              <div className="faq-section" style={{ padding: '3rem 1.5rem' }}>
                <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Opiniones en Santa Cruz</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Valoraciones de quienes ordenan sus packs y reciben por delivery.</p>
                
                <div className="testimonials-grid">
                  {testimonials.map(t => (
                    <div className="testimonial-card" key={t.id} style={{ padding: '1.5rem' }}>
                      <div className="stars-row" style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>
                        {[...Array(t.stars || 5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ))}
                      </div>
                      <p className="testimonial-text" style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '10px', color: 'var(--text-dark)' }}>"{t.text}"</p>
                      <span className="testimonial-author">{t.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* FAQ ACCORDION SECTION */}
          {faqs.length > 0 && (
            <section className="faq-section" style={{ padding: '3rem 1.5rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Preguntas Frecuentes</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Resolvemos tus dudas antes de realizar tu compra.</p>
              
              <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {faqs.map((faq, index) => (
                  <div 
                    className={`faq-item ${activeFaqIndex === index ? 'active' : ''}`} 
                    key={faq.id}
                    style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}
                  >
                    <button 
                      className="faq-question-btn" 
                      onClick={() => toggleFaq(index)}
                      type="button"
                      style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-green)', cursor: 'pointer', padding: '0.5rem 0' }}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-arrow" style={{ transition: 'transform 0.2s' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>
                    <div className="faq-answer" style={{ display: activeFaqIndex === index ? 'block' : 'none', padding: '0.5rem 0', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {view === "details" && selectedCombo && (
        /* ==================== VIEW 2: DEDICATED DETAILS PAGE ==================== */
        <main className="details-page-wrapper" style={{ padding: '2rem 1.5rem' }}>
          <div className="details-back-bar" style={{ marginBottom: '1.5rem' }}>
            <button 
              className="btn-details-back" 
              onClick={closeComboDetails}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Volver al Catálogo
            </button>
          </div>

          {selectedCombo && (() => {
            // Build media list dynamically (Added by Antigravity)
            const mediaList = [];
            if (selectedCombo.image_url) {
              const urls = selectedCombo.image_url.split(',');
              urls.forEach(url => {
                if (url.trim()) {
                  mediaList.push({ type: isVideoUrl(url.trim()) ? 'video' : 'image', url: url.trim() });
                }
              });
            }
            
            // Sort videos first, then images
            mediaList.sort((a, b) => {
              if (a.type === 'video' && b.type !== 'video') return -1;
              if (a.type !== 'video' && b.type === 'video') return 1;
              return 0;
            });
            
            return (
              <div className="details-grid">
                {/* Image/Video Stack Column */}
                <div className="details-gallery-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {mediaList.map((media, index) => {
                    if (media.type === 'video') {
                      return (
                        <div key={index} className="details-main-media-box" style={{ overflow: 'hidden', borderRadius: '12px', background: '#faf9f6', border: '1px solid var(--border-color)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <video src={resolveAssetUrl(media.url)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      );
                    } else if (media.type === 'image') {
                      return (
                        <div key={index} className="details-main-media-box" style={{ overflow: 'hidden', borderRadius: '12px', background: '#faf9f6', border: '1px solid var(--border-color)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={resolveAssetUrl(media.url)} alt={selectedCombo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Info Column */}
                <div className="details-content-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h1 className="details-title">{selectedCombo.name}</h1>
                    
                    {/* Amazon-style Rating Breakdown */}
                    <div className="amazon-rating-container">
                      <span className="amazon-rating-text">4.9</span>
                      <div className="amazon-stars-row">
                        {[1, 2, 3, 4].map(n => (
                          <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        ))}
                        {/* Half star */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.85 }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <span className="amazon-rating-link">98 calificaciones de clientes</span>
                    </div>

                    <p className="details-tagline">{selectedCombo.tagline}</p>
                  </div>

                  <div>
                    <h4 className="details-box-title">Beneficios Clave</h4>
                    <ul className="details-bullets-list" style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {selectedCombo.bullets.map((bullet, idx) => (
                        <li className="details-bullet-item" key={idx}>
                          <svg className="svg-icon details-bullet-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="details-box-title">¿Qué incluye este pack?</h4>
                    <div className="details-box" style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.95rem' }}>{selectedCombo.includes}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="details-box-title">Presentación del empaque</h4>
                    <div className="details-box" style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.95rem' }}>{selectedCombo.package_detail}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="details-box-title">Dosis sugerida</h4>
                    <div className="details-box dosage-box" style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.95rem' }}>{selectedCombo.dosage}</p>
                    </div>
                  </div>

                  {/* Amazon Technical Specs Table */}
                  <div>
                    <h4 className="details-box-title">Especificaciones Técnicas</h4>
                    <table className="tech-specs-table">
                      <tbody>
                        <tr>
                          <td className="label-cell">Marca</td>
                          <td className="value-cell">Tiens (Tianshi) Oficial</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Origen</td>
                          <td className="value-cell">Suplementos Legítimos Importados</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Empaque</td>
                          <td className="value-cell">Bolsa Doypack Kraft Ecológica con zipper</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Sellado</td>
                          <td className="value-cell">Termosellado manual de seguridad Kaldirev</td>
                        </tr>
                        <tr>
                          <td className="label-cell">Manipulación</td>
                          <td className="value-cell">Cero contacto humano en fraccionamiento</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Amazon Trust Badges Grid */}
                  <div className="trust-badges-grid">
                    <div className="trust-badge-card">
                      <div className="trust-badge-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <span className="trust-badge-title">100% Original</span>
                      <span className="trust-badge-desc">Garantía oficial Tiens Bolivia</span>
                    </div>

                    <div className="trust-badge-card">
                      <div className="trust-badge-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <span className="trust-badge-title">Termosellado</span>
                      <span className="trust-badge-desc">Higiene y hermeticidad</span>
                    </div>

                    <div className="trust-badge-card">
                      <div className="trust-badge-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <span className="trust-badge-title">Pago Seguro</span>
                      <span className="trust-badge-desc">Contraentrega o transferencia</span>
                    </div>

                    <div className="trust-badge-card">
                      <div className="trust-badge-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <span className="trust-badge-title">Envío Express</span>
                      <span className="trust-badge-desc">Yango en el día (Santa Cruz)</span>
                    </div>
                  </div>

                  {/* Price and Cart Buttons */}
                  <div className="details-price-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <div>
                      <span style={{ display: 'block', textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Regular: Bs. {parseFloat(selectedCombo.original_price_bs).toFixed(1)}</span>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-green)' }}>Bs. {parseFloat(selectedCombo.price_bs).toFixed(1)}</span>
                    </div>
                    
                    <div className="details-action-buttons">
                      <button 
                        type="button" 
                        className="btn-details-buy"
                        onClick={() => addToCart(selectedCombo, selectedCombo.type)}
                      >
                        Añadir al Pedido
                      </button>
                      <button 
                        type="button" 
                        className="btn-details-share"
                        onClick={() => handleShareCombo(selectedCombo)}
                      >
                        {shareSuccess ? '¡Copiado!' : 'Compartir'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      )}


      {/* ==================== VIEW 4: DEDICATED ORDERS TRACKING PAGE ==================== */}
      {view === "pedidos" && (
        <main className="orders-page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '750px', margin: '0 auto', minHeight: '60vh' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>Mis Pedidos Realizados 📦</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Rastreo de tus compras de suplementos en tiempo real.</p>

          {!user ? (
            /* Logged out orders screen */
            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem 1.5rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-gold)', opacity: 0.3, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary-green)', marginBottom: '8px' }}>Historial Inactivo</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto' }}>Inicia sesión de forma segura para rastrear el despacho de tus compras y guardar tus datos.</p>
              <button 
                type="button" 
                onClick={() => setView("perfil")}
                style={{ padding: '10px 20px', background: 'var(--primary-green)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          ) : userOrdersLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <div style={{ border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--accent-gold)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 10px auto' }}></div>
              <p>Descargando tu historial de compras...</p>
            </div>
          ) : userOrders.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem 1.5rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary-green)' }}>No registras pedidos todavía</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>¡Explora la tienda y realiza tu primera compra hoy mismo!</p>
              <button 
                type="button" 
                onClick={() => setView("catalog")}
                style={{ padding: '10px 20px', background: 'var(--primary-green)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            /* Orders tracking feed list */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {userOrders.map(order => {
                let currentStep = 1;
                if (order.status === 'Completado') currentStep = 4;
                else if (order.status === 'En Camino') currentStep = 3;
                else if (order.status === 'Pendiente') currentStep = 2; // Preparing state

                return (
                  <div 
                    key={order.id} 
                    className="order-history-card animate-fade-in" 
                    style={{ 
                      background: 'white', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '16px', 
                      padding: '1.25rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {/* ID and date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        📅 {new Date(order.created_at).toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span 
                        className={`order-status-badge ${order.status}`} 
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: order.status === 'Completado' ? '#e6f4ea' : order.status === 'Cancelado' ? '#fce8e6' : '#fff7e6',
                          color: order.status === 'Completado' ? '#137333' : order.status === 'Cancelado' ? '#c5221f' : '#b06000',
                          border: `1px solid ${order.status === 'Completado' ? '#c2e7c9' : order.status === 'Cancelado' ? '#fad2cf' : '#ffe7b3'}`
                        }}
                      >
                        {order.status === 'Completado' ? '✅ Completado' : order.status === 'Cancelado' ? '❌ Cancelado' : '⏳ Pendiente'}
                      </span>
                    </div>

                    {/* Stepper timeline */}
                    <div style={{ background: '#fcfbf7', padding: '1rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(235,220,201,0.5)', margin: '4px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '3px', background: '#e2e8f0', zIndex: 1 }}></div>
                        <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${(currentStep - 1) * 26.6}%`, height: '3px', background: 'var(--primary-green)', zIndex: 2, transition: 'width 0.3s' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, flex: 1 }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 1 ? 'var(--primary-green)' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>✓</div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: currentStep >= 1 ? 'var(--primary-green)' : 'var(--text-muted)', marginTop: '4px' }}>Recibido</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, flex: 1 }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 2 ? 'var(--primary-green)' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>📦</div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: currentStep >= 2 ? 'var(--primary-green)' : 'var(--text-muted)', marginTop: '4px' }}>Preparando</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, flex: 1 }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 3 ? 'var(--primary-green)' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>🛵</div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: currentStep >= 3 ? 'var(--primary-green)' : 'var(--text-muted)', marginTop: '4px' }}>En Camino</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, flex: 1 }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: currentStep >= 4 ? 'var(--primary-green)' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>★</div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: currentStep >= 4 ? 'var(--primary-green)' : 'var(--text-muted)', marginTop: '4px' }}>Entregado</span>
                        </div>
                      </div>
                    </div>

                    {/* Order items */}
                    <div style={{ border: '1px solid rgba(235,220,201,0.5)', borderRadius: '8px', padding: '8px 12px', background: '#faf9f6' }}>
                      {order.items && Array.isArray(order.items) ? (
                        order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '3px 0', borderBottom: idx < order.items.length - 1 ? '1px solid #f1ece4' : 'none' }}>
                            <span><strong>{item.quantity}x</strong> {item.name}</span>
                            <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>Bs. {(item.price * item.quantity).toFixed(1)}</span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Detalle de productos no disponible</span>
                      )}
                    </div>

                    {/* Delivery address */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                      📍 <strong>Destino:</strong> {order.address} ({order.city})
                      {order.gps_coordinates && (
                        <a 
                          href={order.gps_coordinates} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '8px', color: '#1a73e8', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                          Ver en Google Maps
                        </a>
                      )}
                    </div>

                    {/* WhatsApp check support */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                        Total: Bs. {parseFloat(order.total_bs).toFixed(1)}
                      </div>

                      {order.status !== 'Cancelado' && (
                        <button
                          type="button"
                          className="btn-whatsapp-submit"
                          style={{ padding: '8px 12px', fontSize: '0.78rem', width: 'auto', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', background: '#25d366', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                          onClick={() => {
                            const trackingMsg = `Hola Kaldirev Bolivia, quería consultar el despacho de mi pedido:\n- ID Pedido: ${order.id.substring(0,8)}\n- Cliente: ${order.customer_name}\n- Total: Bs. ${parseFloat(order.total_bs).toFixed(1)}\n- Estado: ${order.status}`;
                            const waUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(trackingMsg)}`;
                            window.open(waUrl, '_blank');
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.249 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.42 9.864-9.856.002-2.63-1.023-5.101-2.887-6.967C16.38 1.916 13.91 1.012 11.285 1.012 5.848 1.012 1.425 5.435 1.422 10.873c-.001 1.5.399 2.969 1.157 4.298l-.997 3.642 3.73-.978c-.001.002-.001.002-.001.002zm12.338-7.989c-.334-.168-1.977-.975-2.28-1.087-.302-.111-.522-.168-.742.168-.22.33-.852 1.079-1.044 1.302-.192.223-.385.253-.718.084-.334-.168-1.409-.52-2.684-1.657-1.002-.894-1.677-2.002-1.874-2.337-.197-.335-.021-.516.146-.682.151-.15.334-.385.501-.58.167-.192.222-.334.334-.56.111-.223.056-.417-.028-.585-.084-.168-.742-1.787-1.016-2.45-.269-.65-.539-.562-.742-.573-.191-.01-.41-.01-.628-.01-.22 0-.577.082-.88.411-.303.33-1.154 1.128-1.154 2.75 0 1.622 1.18 3.19 1.346 3.414.167.223 2.323 3.548 5.626 4.974.786.34 1.398.543 1.877.697.79.25 1.509.215 2.078.13.633-.095 1.977-.807 2.254-1.59.277-.783.277-1.456.195-1.59-.082-.134-.302-.253-.633-.421z"/>
                          </svg>
                          Consultar por WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ==================== VIEW 5: DEDICATED CORPORATE NOSOTROS PAGE ==================== */}
      {view === "nosotros" && (
        <main className="nosotros-page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>Sobre Nosotros 📖</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Identidad, misión y deslinde de responsabilidad corporativa.</p>

          <div style={{ display: 'flex', borderBottom: '1px solid #ebdcc9', background: 'white', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
            <button 
              type="button" 
              style={{ flex: 1, padding: '12px', border: 'none', borderBottom: infoActiveTab === 'mision' ? '3px solid var(--accent-gold)' : 'none', background: infoActiveTab === 'mision' ? '#fff' : '#f8f9fa', fontSize: '0.92rem', fontWeight: 700, color: infoActiveTab === 'mision' ? 'var(--primary-green)' : 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setInfoActiveTab('mision')}
            >
              Misión, Visión y Valores
            </button>
            <button 
              type="button" 
              style={{ flex: 1, padding: '12px', border: 'none', borderBottom: infoActiveTab === 'legal' ? '3px solid var(--accent-gold)' : 'none', background: infoActiveTab === 'legal' ? '#fff' : '#f8f9fa', fontSize: '0.92rem', fontWeight: 700, color: infoActiveTab === 'legal' ? 'var(--primary-green)' : 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setInfoActiveTab('legal')}
            >
              Deslinde Legal & Compliance
            </button>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0 0 8px 8px', border: '1px solid var(--border-color)', borderTop: 'none', fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
            {infoActiveTab === 'mision' ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--primary-green)', fontSize: '1.15rem', margin: '0 0 8px 0', fontWeight: 800 }}>Nuestra Misión</h4>
                  <p style={{ margin: 0, background: '#fcfbf7', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)' }}>
                    "Proveer un sistema operativo y logístico integral que profesionalice la distribución de suplementos de bienestar en Bolivia, ofreciendo a clientes y emprendedores tecnología de cobro, atención estandarizada y entregas eficientes con absoluta transparencia comercial."
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--primary-green)', fontSize: '1.15rem', margin: '0 0 8px 0', fontWeight: 800 }}>Nuestra Visión</h4>
                  <p style={{ margin: 0, background: '#fcfbf7', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)' }}>
                    "Consolidarse para el año 2028 como la red independiente de distribución e intermediación comercial más confiable y mejor estructurada de Bolivia, reconocida por su excelencia operativa, rigor ético y modernización tecnológica de canales de venta."
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--primary-green)', fontSize: '1.15rem', margin: '0 0 10px 0', fontWeight: 800 }}>Valores Corporativos</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--primary-green)' }}>• Excelencia Operativa:</strong> Rigor y exactitud en el cumplimiento de tiempos, empaque secundario y trazabilidad de cada pedido.
                    </div>
                    <div style={{ background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--primary-green)' }}>• Transparencia y Compliance:</strong> Delimitación clara de roles comerciales, respetando las marcas registradas de terceros y las normativas vigentes.
                    </div>
                    <div style={{ background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--primary-green)' }}>• Innovación Digital:</strong> Implementación continua de herramientas tecnológicas para cobros inmediatos vía QR y atención al cliente ágil.
                    </div>
                    <div style={{ background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--primary-green)' }}>• Dignificación Comercial:</strong> Promoción de un modelo de venta ético, estandarizado y transparente que eleve la confianza del consumidor final.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.92rem' }}>
                <div style={{ borderBottom: '1px solid #ebdcc9', paddingBottom: '1rem' }}>
                  <h4 style={{ color: '#d93025', fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: 800 }}>KALDIREV • RED EMPRESARIAL DE DISTRIBUCIÓN</h4>
                  <p style={{ margin: 0, color: 'var(--text-dark)' }}>
                    Kaldirev es un emprendimiento y marca independiente dedicado a la intermediación comercial, logística urbana y facilitación de ventas mediante herramientas tecnológicas. No constituimos una subsidiaria, filial, ni representación corporativa directa de marcas multinacionales.
                  </p>
                </div>

                <div>
                  <h5 style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '0.95rem' }}>Aviso de Autonomía de Marcas Terciarias</h5>
                  <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>
                    Todos los nombres de productos, marcas registradas y logotipos de terceros citados en esta plataforma (incluyendo Tiens Bolivia, Yango, PedidosYa, inDrive, BCP y Yape) son propiedad exclusiva de sus respectivos titulares.
                  </p>
                </div>

                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.95rem' }}>Marco de Relación y Responsabilidad</h5>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', border: '1px solid #ebdcc9', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                      <tr style={{ background: '#fcfbf7' }}>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Ámbito Legal</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Fabricante (Tiens)</th>
                        <th style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Intermediario (Kaldirev)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Registro / Importación</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9' }}>Titular de registros sanitarios (SENASAG/UNIMED), calidad de origen.</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9' }}>Comercialización independiente de unidades oficiales adquiridas legítimamente.</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Garantía</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9' }}>Respaldo técnico de laboratorio y sellos de fábrica.</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #ebdcc9' }}>Gestión de entrega, empaque secundario y recepción en conformidad.</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>Estructura</td>
                        <td style={{ padding: '8px 12px' }}>Estructura corporativa multinacional y almacenes autorizados.</td>
                        <td style={{ padding: '8px 12px' }}>Plataforma digital independiente de atención, cobro QR y despacho.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 14px', borderRadius: '8px', color: '#c2410c' }}>
                  <strong>Cláusula de Exención de Responsabilidad Sanitaria:</strong> Los productos comercializados por la red KALDIREV no son medicamentos ni sustituyen tratamientos médicos profesionales. KALDIREV prohíbe taxativamente la emisión de diagnósticos o curaciones no respaldadas legalmente.
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ==================== VIEW 6: DEDICATED PROFILE PAGE ==================== */}
      {view === "perfil" && (
        <main className="perfil-page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '500px', margin: '0 auto', minHeight: '60vh' }}>
          {!user ? (
            /* Login native box */
            <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--primary-green)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Iniciar Sesión</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Guarda tu dirección de entrega y accede al rastreo de tus pedidos al instante.</p>

              {authError && (
                <div style={{ background: '#ffeeee', border: '1px solid #ffcccc', color: '#cc0000', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'left' }}>
                  {authError}
                </div>
              )}

              {/* Google Button */}
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="btn-google-login"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ebdcc9', background: '#fcfaf2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem' }}
                onMouseEnter={(e) => { e.target.style.background = '#f2edd9'; }}
                onMouseLeave={(e) => { e.target.style.background = '#fcfaf2'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Entrar con Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#bbb' }}>
                <div style={{ flexGrow: 1, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>o utiliza tu correo</span>
                <div style={{ flexGrow: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="correo@ejemplo.com"
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)} 
                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Contraseña</label>
                  <input 
                    type="password" 
                    required 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={authPassword} 
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                  />
                </div>
                <button type="submit" className="btn-add-cart" style={{ width: '100%', padding: '10px', border: 'none', background: 'var(--primary-green)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                  {authLoading ? "Cargando..." : "Ingresar con Correo"}
                </button>
              </form>
            </div>
          ) : (
            /* User profile dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid var(--accent-gold)' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-green)' }}>{profile?.full_name || "Cliente"}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
                </div>
              </div>

              {/* Form details defaults */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--primary-green)' }}>Mis Datos de Entrega Predeterminados</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Nombre de Contacto</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Celular o WhatsApp</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={formData.phone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Ciudad</label>
                    <select 
                      className="form-select" 
                      value={formData.city} 
                      onChange={(e) => handleCityChange(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '38px' }}
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.82rem' }}>Dirección de Entrega</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.address} 
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <button 
                    type="button" 
                    className="btn-add-cart" 
                    style={{ width: '100%', padding: '12px', border: 'none', background: 'var(--primary-green)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', marginTop: '0.5rem' }}
                    onClick={async () => {
                      try {
                        const updatedProfile = {
                          ...profile,
                          full_name: formData.name,
                          phone: formData.phone,
                          address: formData.address,
                          city: formData.city
                        };
                        const { error } = await supabase.from('profiles').upsert(updatedProfile);
                        if (error) throw error;
                        setProfile(updatedProfile);
                        localStorage.setItem(`kaldirev_local_profile_${user.id}`, JSON.stringify(updatedProfile));
                        window.Swal.fire({
                          title: '¡Guardado!',
                          text: 'Datos actualizados de forma segura.',
                          icon: 'success',
                          confirmButtonColor: 'var(--primary-green)'
                        });
                      } catch (err) {
                        console.warn("Could not save profile directly, fallback to local storage:", err);
                        localStorage.setItem(`kaldirev_local_profile_${user.id}`, JSON.stringify({
                          id: user.id,
                          full_name: formData.name,
                          phone: formData.phone,
                          address: formData.address,
                          city: formData.city
                        }));
                        window.Swal.fire({
                          title: '¡Guardado Local!',
                          text: 'Datos guardados en este dispositivo (RLS activo).',
                          icon: 'success',
                          confirmButtonColor: 'var(--primary-green)'
                        });
                      }
                    }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button 
                type="button" 
                style={{ width: '100%', padding: '10px', background: 'none', border: '2px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </main>
      )}

      {/* SHOPPING CART DRAWER */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          
          <div className="cart-drawer-header">
            <h3 className="cart-drawer-title">
              {isCheckingOut ? "Datos de Envío & Pago" : "Tu Carrito de Combos"}
            </h3>
            <button className="btn-close-cart" onClick={() => setIsCartOpen(false)} aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="cart-items-container">
            {isCheckingOut ? (
              /* ==================== STEP 2: CHECKOUT FORM ==================== */
              <div className="checkout-form-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 className="checkout-form-title" style={{ margin: 0, fontSize: '1.1rem' }}>Información de Contacto</h4>
                
                {/* Nombre y Celular en fila de 2 columnas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-name" style={{ fontSize: '0.82rem' }}>Nombre *</label>
                    <input 
                      type="text" 
                      id="chk-name" 
                      required
                      className="form-input" 
                      placeholder="Tu nombre" 
                      value={formData.name} 
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-phone" style={{ fontSize: '0.82rem' }}>WhatsApp *</label>
                    <input 
                      type="tel" 
                      id="chk-phone" 
                      required
                      className="form-input" 
                      placeholder="Celular" 
                      value={formData.phone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <h4 className="checkout-form-title" style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Dirección de Entrega</h4>

                {/* Ciudad y Botón de Ubicación */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'end' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-city" style={{ fontSize: '0.82rem' }}>Ciudad *</label>
                    <select 
                      id="chk-city" 
                      className="form-select" 
                      value={formData.city} 
                      onChange={(e) => handleCityChange(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '0.9rem', height: '38px' }}
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn-add-cart"
                    style={{ 
                      width: '100%', 
                      whiteSpace: 'nowrap', 
                      padding: '0 8px', 
                      fontSize: '0.82rem', 
                      background: 'var(--primary-green)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '4px', 
                      height: '38px', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onClick={handleGetLocation}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Fijar GPS (Exacto)
                  </button>
                </div>

                {formData.gpsCoordinates && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e6f4ea', border: '1px solid #c2e7c9', padding: '6px 10px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#137333', fontWeight: 'bold' }}>📍 GPS Cargado Correctamente</span>
                    <button type="button" style={{ border: 'none', background: 'none', color: '#d93025', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }} onClick={() => setFormData(prev => ({ ...prev, gpsCoordinates: '', address: prev.address === "📍 Dirección vía Ubicación GPS (Entregar en este punto exacto)" ? "" : prev.address }))}>Quitar</button>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="chk-address" style={{ fontSize: '0.82rem' }}>Dirección Específica (Calle, Nro, Zona) *</label>
                  <input 
                    type="text" 
                    id="chk-address" 
                    required
                    className="form-input" 
                    placeholder="Ej. Av. Bush, Calle 4, Nro 125" 
                    value={formData.address} 
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                  />
                </div>

                <h4 className="checkout-form-title" style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Forma de Pago</h4>

                <div className="form-group">
                  <label className="form-label" htmlFor="chk-payment" style={{ fontSize: '0.82rem' }}>Método de Pago *</label>
                  <select 
                    id="chk-payment" 
                    className="form-select" 
                    value={formData.paymentMethod} 
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    style={{ padding: '8px 12px', fontSize: '0.9rem', height: '38px' }}
                  >
                    <option value="Contraentrega">Efectivo / QR al recibir (Contraentrega)</option>
                    <option value="Pago QR Directo">Pago QR Inmediato (Pasarela Libélula)</option>
                    <option value="Transferencia Bancaria">Transferencia Bancaria Directa</option>
                  </select>
                </div>

                {/* Stock Warning inside checkout form */}
                {(() => {
                  const outOfStockItems = getOutOfStockItemsForCity(formData.city);
                  if (outOfStockItems.length > 0) {
                    return (
                      <div style={{ background: '#ffeeee', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', marginTop: '10px', fontWeight: 600 }}>
                        ⚠️ Los siguientes combos no tienen stock suficiente en {formData.city}:
                        <ul style={{ paddingLeft: '15px', marginTop: '4px' }}>
                          {outOfStockItems.map(item => (
                            <li key={item.id}>{item.name} (Requerido: {item.quantity})</li>
                          ))}
                        </ul>
                        Por favor, reduzca cantidades en el carrito o cambie de ciudad.
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              /* ==================== STEP 1: CART LIST ==================== */
              cart.length === 0 ? (
                <div className="cart-empty-state" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary-green)', opacity: 0.3, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-green)' }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>¿No sabes por dónde empezar? Descubre nuestros recomendados:</p>
                  
                  <div className="cart-recommendations" style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    {products.slice(0, 3).map(prod => (
                      <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #ebdcc9' }}>
                        <img src={resolveAssetUrl(getProductImage(prod.id))} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>Bs. {parseFloat(prod.price_bs).toFixed(1)}</div>
                        </div>
                        <button
                          type="button"
                          className="btn-add-cart"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', width: 'auto' }}
                          onClick={() => addToCart(prod, 'product')}
                        >
                          + Añadir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.cartItemId}>
                    <div className="cart-item-image">
                      {item.image_url ? (
                        isVideoUrl(item.image_url) ? (
                          <video src={resolveAssetUrl(item.image_url)} muted style={{ width: '45px', height: '65px', objectFit: 'contain', borderRadius: '4px' }} />
                        ) : (
                          <img src={resolveAssetUrl(item.image_url)} alt={item.name} style={{ width: '45px', height: '65px', objectFit: 'contain' }} />
                        )
                      ) : (
                        <div className="doypack-illustration" style={{ width: '30px', height: '45px', borderRadius: '4px', borderWidth: '1px' }}>
                          <div className="doypack-zipper" style={{ top: '4px', height: '2px' }}></div>
                        </div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p className="cart-item-name" style={{ fontSize: '0.95rem' }}>{item.name}</p>
                          <span className="cart-item-meta" style={{ fontSize: '0.75rem' }}>Kraft Termosellado</span>
                        </div>
                        <button 
                          style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '2px' }}
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label="Eliminar producto"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="cart-item-bottom">
                        <div className="cart-quantity-controls">
                          <button className="btn-qty" onClick={() => updateQuantity(item.cartItemId, -1)}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="btn-qty" onClick={() => updateQuantity(item.cartItemId, 1)}>+</button>
                        </div>
                        <span className="cart-item-price" style={{ fontSize: '1.1rem' }}>Bs. {(item.price * item.quantity).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="summary-row" style={{ fontSize: '1.05rem' }}>
                <span>Subtotal:</span>
                <span>Bs. {getCartTotal().toFixed(1)}</span>
              </div>
              
              {isCheckingOut ? (
                <>
                  <div className="summary-row" style={{ fontSize: '1.05rem' }}>
                    <span>Costo de Envío ({formData.deliveryMethod === 'Retiro en Oficina' ? 'Sucursal' : formData.city}):</span>
                    <span>
                      {(() => {
                        const selectedBranchObj = branches.find(b => b.name.toLowerCase().includes(formData.city.toLowerCase())) || branches[0];
                        const cost = formData.deliveryMethod === 'Retiro en Oficina' ? 0 : (selectedBranchObj ? parseFloat(selectedBranchObj.shipping_cost_bs) : 15);
                        return cost === 0 ? "Gratis" : `Bs. ${cost.toFixed(1)}`;
                      })()}
                    </span>
                  </div>
                  <div className="summary-row total" style={{ fontSize: '1.35rem' }}>
                    <span>Total a pagar:</span>
                    <span>
                      Bs. {(() => {
                        const selectedBranchObj = branches.find(b => b.name.toLowerCase().includes(formData.city.toLowerCase())) || branches[0];
                        const cost = formData.deliveryMethod === 'Retiro en Oficina' ? 0 : (selectedBranchObj ? parseFloat(selectedBranchObj.shipping_cost_bs) : 15);
                        return (getCartTotal() + cost).toFixed(1);
                      })()}
                    </span>
                  </div>
                  
                  <div className="checkout-steps">
                    <button 
                      className="btn-checkout" 
                      style={{ fontSize: '1.1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
                      onClick={handleCreateOrderCheckout}
                      disabled={isSubmittingOrder}
                    >
                      {isSubmittingOrder ? (
                        <span>Procesando Pedido...</span>
                      ) : (
                        <>
                          {formData.paymentMethod === 'Pago QR Directo' ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <rect x="7" y="7" width="3" height="3"></rect>
                                <rect x="14" y="7" width="3" height="3"></rect>
                                <rect x="7" y="14" width="3" height="3"></rect>
                                <rect x="14" y="14" width="3" height="3"></rect>
                              </svg>
                              <span>Generar QR para Pago</span>
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.59-4.846c1.666.988 3.311 1.485 5.243 1.486 5.542.004 10.057-4.51 10.06-10.055.002-2.686-1.043-5.212-2.94-7.11s-4.426-2.943-7.11-2.943c-5.542 0-10.056 4.51-10.06 10.056-.001 2.01.536 3.69 1.547 5.356l-.99 3.616 3.733-.979zm11.332-6.862c-.3-.15-1.77-.875-2.04-.972-.27-.099-.47-.15-.67.15-.2.3-.77.975-.94 1.17-.18.195-.36.225-.66.075-.3-.15-1.27-.47-2.42-1.493-.89-.797-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.62-.92-2.22-.242-.58-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.525.714.31 1.272.496 1.706.635.717.227 1.37.195 1.885.118.575-.085 1.77-.725 2.02-1.39.25-.665.25-1.235.175-1.35-.075-.115-.275-.185-.575-.335z"/>
                              </svg>
                              <span>Confirmar Pedido (WhatsApp)</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn-back-to-cart" 
                      onClick={() => setIsCheckingOut(false)}
                      style={{ marginTop: '8px' }}
                    >
                      Volver al Carrito
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="summary-row" style={{ fontSize: '1.05rem' }}>
                    <span>Empaque con Sello Kaldirev:</span>
                    <span style={{ color: '#276e49', fontWeight: 600 }}>Gratis</span>
                  </div>
                  <div className="summary-row total" style={{ fontSize: '1.35rem' }}>
                    <span>Total estimado:</span>
                    <span>Bs. {getCartTotal().toFixed(1)}</span>
                  </div>
                  
                  <div className="checkout-steps">
                    <button 
                      className="btn-checkout" 
                      style={{ fontSize: '1.1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }} 
                      onClick={() => setIsCheckingOut(true)}
                    >
                      Proceder con el Pedido
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GUEST OR LOGIN PROMPT MODAL */}
      {showLoginPrompt && (
        <div className="auth-modal-overlay open" onClick={() => setShowLoginPrompt(false)}>
          <div className="auth-modal" style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowLoginPrompt(false)} aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '0.75rem' }}>
              ¿Deseas iniciar sesión?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1.5rem' }}>
              Te sugerimos ingresar a tu cuenta para guardar tu ubicación de entrega automáticamente. O puedes continuar como invitado si prefieres realizar tu compra rápido.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn-add-cart"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--primary-green)', border: 'none', color: 'white', fontWeight: 800, borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => {
                  setShowLoginPrompt(false);
                  setIsAuthModalOpen(true);
                  setAuthMode('login');
                  setAuthError('');
                }}
              >
                Iniciar Sesión / Registrarse
              </button>
              <button
                type="button"
                className="btn-details-back"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-dark)', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                onClick={() => {
                  setShowLoginPrompt(false);
                  if (pendingCartItem) {
                    addToCart(pendingCartItem.item, pendingCartItem.type, true);
                    setPendingCartItem(null);
                  }
                }}
              >
                Continuar como Invitado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL (GOOGLE + EMAIL/PASSWORD) */}
      {isAuthModalOpen && (
        <div className="auth-modal-overlay open" onClick={() => setIsAuthModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setIsAuthModalOpen(false)} aria-label="Cerrar modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="auth-modal-header">
              <h2>Kaldirev Bolivia</h2>
              <p>Únete o ingresa para registrar tus datos de envío e historial de compras.</p>
            </div>

            <div className="auth-modal-tabs">
              <button 
                type="button"
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(""); }}
              >
                Iniciar Sesión
              </button>
              <button 
                type="button"
                className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setAuthError(""); }}
              >
                Crear Cuenta
              </button>
            </div>

            {authError && <div className="auth-error-banner">{authError}</div>}

            <form onSubmit={authMode === 'login' ? handleEmailLogin : handleEmailSignup} className="auth-modal-form">
              {authMode === 'signup' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="authName">Nombre Completo *</label>
                  <input
                    type="text"
                    id="authName"
                    required
                    className="form-input"
                    placeholder="Ej. Juan Pérez"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="authEmail">Correo Electrónico *</label>
                <input
                  type="email"
                  id="authEmail"
                  required
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="authPassword">Contraseña *</label>
                <input
                  type="password"
                  id="authPassword"
                  required
                  minLength="6"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-auth-submit" disabled={authLoading}>
                {authLoading ? 'Procesando...' : authMode === 'login' ? 'Ingresar con Correo' : 'Registrar Cuenta'}
              </button>
            </form>

            <div className="auth-divider">
              <span>O</span>
            </div>

            <button 
              type="button" 
              className="btn-google-login-modal" 
              onClick={() => { handleGoogleLogin(); setIsAuthModalOpen(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline-block' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Acceder rápido con Gmail</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      <div className={`success-modal-overlay ${showSuccessModal ? 'open' : ''}`}>
        <div className="success-modal">
          <div className="success-icon" style={{ background: '#eef6f2', color: 'var(--primary-green)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 className="success-title">¡Pedido Registrado y Enviado!</h3>
          <p className="success-desc" style={{ fontSize: '1.05rem', lineHeight: '1.5' }}>
            Hemos registrado tu pedido en nuestra base de datos. Se ha abierto tu WhatsApp para que confirmemos tu despacho y coordinemos el delivery. Por favor envía el mensaje en WhatsApp.
          </p>
          <button className="btn-success-close" onClick={confirmOrderSuccess}>
            Entendido, Excelente
          </button>
        </div>
      </div>

      {/* PASARELA QR LIBELULA SIMULATOR MODAL */}
      {isQrModalOpen && qrModalOrder && (
        <div className="success-modal-overlay open" style={{ zIndex: 1100 }}>
          <div className="success-modal" style={{ maxWidth: '460px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>Pasarela de Pago QR</h3>
              <span style={{ fontSize: '0.8rem', background: 'var(--accent-gold-light)', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Libélula API</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Escanea el código QR de Kaldirev desde la app de tu banco en Bolivia para realizar la transferencia.
            </p>

            {/* MOCK QR CODE WITH STYLISH DESIGN */}
            <div style={{ background: '#faf9f6', padding: '1.25rem', borderRadius: '12px', display: 'inline-block', border: '2px solid var(--accent-gold)', marginBottom: '1rem', position: 'relative' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=kaldirev-pago-pasarela-mock" 
                  alt="QR Code Pago" 
                  style={{ display: 'block', margin: '0 auto', width: '180px', height: '180px' }}
                />
              </div>
              
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: '#c5a059', fontWeight: 'bold' }}>
                <span className="live-indicator-dot" style={{ width: '8px', height: '8px', background: '#c5a059', borderRadius: '50%', display: 'inline-block' }}></span>
                Esperando confirmación bancaria...
              </div>
            </div>

            <div style={{ background: 'var(--accent-gold-light)', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monto a Transferir:</span>
                <strong style={{ color: 'var(--primary-green)', fontSize: '1rem' }}>Bs. {parseFloat(qrModalOrder.total_bs).toFixed(1)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>Destinatario:</span>
                <strong>KALDIREV S.R.L.</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: qrTimer < 60 ? 'red' : 'var(--text-dark)', marginBottom: '1.25rem' }}>
              El código QR expirará en: {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
            </div>

            <button 
              type="button" 
              className="btn-whatsapp-submit" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', background: '#2e7d32', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.6rem', boxShadow: '0 4px 12px rgba(46,125,50,0.2)' }}
              onClick={handleSimulateQrSuccess}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Simular Confirmación de Pago (Webhook)
            </button>

            <button 
              type="button" 
              className="btn-back-to-cart" 
              style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }} 
              onClick={() => {
                setIsQrModalOpen(false);
                setQrModalOrder(null);
              }}
            >
              Cancelar y Volver al Carrito
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-info-col">
            <h3>Kaldirev</h3>
            <p className="footer-info-desc">
              Bienestar & Energía. Packs exclusivos de suplementos en Santa Cruz de la Sierra, Bolivia. Empacado con termosellado manual de seguridad.
            </p>
            <div className="footer-tags">
              <span className="footer-tag">Social Commerce</span>
              <span className="footer-tag">Termosellado</span>
              <span className="footer-tag">Santa Cruz</span>
            </div>
          </div>
          
          <div>
            <h4 className="footer-col-title">Combos Populares</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory("Energía"); closeComboDetails(); }}>Kit Energía Diaria</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory("Bienestar"); closeComboDetails(); }}>Kit Bienestar & Huesos</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveCategory("Saludable"); closeComboDetails(); }}>Kit Antojo Saludable</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Atención y Soporte</h4>
            <ul className="footer-links">
              <li>Lunes a Sábado: 8:00 AM - 8:00 PM</li>
              <li>Entregas a domicilio por delivery en Santa Cruz</li>
              <li>Pago Contraentrega QR / Transferencia</li>
              <li>Enlace al <a href="#admin" style={{ textDecoration: 'underline', color: 'var(--accent-gold)' }}>Panel Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Kaldirev. Todos los derechos reservados. Santa Cruz, Bolivia.</p>
        </div>
      </footer>

      {/* SOCIAL PROOF FLOAT NOTIFICATION POPUP */}
      {socialProofOrder && (
        <div 
          className="social-proof-toast"
          style={{ 
            background: 'white', 
            borderLeft: '4px solid var(--primary-green)', 
            borderRadius: '8px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
            padding: '10px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            zIndex: 1000
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)', textAlign: 'left', flexGrow: 1 }}>
            <strong>{socialProofOrder.name}</strong> ({socialProofOrder.city}) compró <strong style={{ color: 'var(--primary-green)' }}>{socialProofOrder.item}</strong> • <span style={{ color: '#888', fontSize: '0.75rem' }}>{socialProofOrder.time}</span>
          </span>
          <button 
            type="button" 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '18px', 
              color: '#bbb', 
              cursor: 'pointer', 
              padding: '0 4px', 
              lineHeight: '1',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = '#bbb'}
            onClick={() => setSocialProofOrder(null)}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {/* PWA BOTTOM NAVIGATION BAR (Mobile & App Tab Navigation) */}
      <div 
        className="pwa-bottom-navbar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65px',
          background: 'white',
          borderTop: '1px solid var(--border-color)',
          boxShadow: '0 -4px 15px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 999,
          padding: '0 5px'
        }}
      >
        <button 
          type="button" 
          className={view === 'catalog' ? 'active-tab' : ''}
          onClick={() => { setActiveCategory("Todos"); setSearchTerm(""); closeComboDetails(); setView("catalog"); }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: view === 'catalog' ? 'var(--primary-green)' : '#888', flexGrow: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Tienda</span>
        </button>


        <button 
          type="button" 
          className={view === 'pedidos' ? 'active-tab' : ''}
          onClick={() => {
            if (user) {
              setView("pedidos");
              fetchUserOrders(user.id);
            } else {
              setView("perfil");
              setAuthError("Inicia sesión para ver tu historial de pedidos.");
            }
          }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: view === 'pedidos' ? 'var(--primary-green)' : '#888', flexGrow: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Mis Pedidos</span>
        </button>

        <button 
          type="button" 
          className={view === 'nosotros' ? 'active-tab' : ''}
          onClick={() => setView("nosotros")}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: view === 'nosotros' ? 'var(--primary-green)' : '#888', flexGrow: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Nosotros</span>
        </button>

        <button 
          type="button" 
          className={view === 'perfil' ? 'active-tab' : ''}
          onClick={() => {
            setView("perfil");
            setAuthError("");
          }}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: view === 'perfil' ? 'var(--primary-green)' : '#888', flexGrow: 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Perfil</span>
        </button>
      </div>

      {/* NOSOTROS & DOSSIER LEGAL MODAL */}
      {isInfoModalOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }} onClick={() => setIsInfoModalOpen(false)}>
          <div className="modal-content" style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '650px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #ebdcc9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-green)', color: 'white' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Dossier & Información Corporativa</h3>
              <button style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }} onClick={() => setIsInfoModalOpen(false)}>×</button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ebdcc9', background: '#fcfbf7' }}>
              <button 
                type="button" 
                style={{ flex: 1, padding: '12px', border: 'none', borderBottom: infoActiveTab === 'mision' ? '3px solid var(--accent-gold)' : 'none', background: 'none', fontSize: '0.92rem', fontWeight: 700, color: infoActiveTab === 'mision' ? 'var(--primary-green)' : 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setInfoActiveTab('mision')}
              >
                Misión, Visión y Valores
              </button>
              <button 
                type="button" 
                style={{ flex: 1, padding: '12px', border: 'none', borderBottom: infoActiveTab === 'legal' ? '3px solid var(--accent-gold)' : 'none', background: 'none', fontSize: '0.92rem', fontWeight: 700, color: infoActiveTab === 'legal' ? 'var(--primary-green)' : 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setInfoActiveTab('legal')}
              >
                Deslinde Legal & Compliance
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
              {infoActiveTab === 'mision' ? (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 800 }}>Nuestra Misión</h4>
                    <p style={{ margin: 0, background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)' }}>
                      "Proveer un sistema operativo y logístico integral que profesionalice la distribución de suplementos de bienestar en Bolivia, ofreciendo a clientes y emprendedores tecnología de cobro, atención estandarizada y entregas eficientes con absoluta transparencia comercial."
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: 800 }}>Nuestra Visión</h4>
                    <p style={{ margin: 0, background: '#fcfbf7', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid var(--accent-gold)' }}>
                      "Consolidarse para el año 2028 como la red independiente de distribución e intermediación comercial más confiable y mejor estructurada de Bolivia, reconocida por su excelencia operativa, rigor ético y modernización tecnológica de canales de venta."
                    </p>
                  </div>

                  <div>
                    <h4 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: 800 }}>Valores Corporativos</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                      <div>
                        <strong>• Excelencia Operativa:</strong> Rigor y exactitud en el cumplimiento de tiempos, empaque secundario y trazabilidad de cada pedido.
                      </div>
                      <div>
                        <strong>• Transparencia y Compliance:</strong> Delimitación clara de roles comerciales, respetando las marcas registradas de terceros y las normativas vigentes.
                      </div>
                      <div>
                        <strong>• Innovation Digital:</strong> Implementación continua de herramientas tecnológicas para cobros inmediatos vía QR y atención al cliente ágil.
                      </div>
                      <div>
                        <strong>• Dignificación Comercial:</strong> Promoción de un modelo de venta ético, estandarizado y transparente que eleve la confianza del consumidor final.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                  <div style={{ borderBottom: '1px solid #ebdcc9', paddingBottom: '0.75rem' }}>
                    <h4 style={{ color: '#d93025', fontSize: '1rem', margin: '0 0 4px 0', fontWeight: 800 }}>KALDIREV • RED EMPRESARIAL DE DISTRIBUCIÓN</h4>
                    <p style={{ margin: 0 }}>
                      Kaldirev es un emprendimiento y marca independiente dedicado a la intermediación comercial, logística urbana y facilitación de ventas mediante herramientas tecnológicas. No constituimos una subsidiaria, filial, ni representación corporativa directa de marcas multinacionales.
                    </p>
                  </div>

                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontWeight: 700 }}>Aviso de Autonomía de Marcas Terciarias</h5>
                    <p style={{ margin: 0, fontStyle: 'italic', color: '#666' }}>
                      Todos los nombres de productos, marcas registradas y logotipos de terceros citados en esta app (incluyendo Tiens Bolivia, Yango, PedidosYa, inDrive, BCP y Yape) son propiedad exclusiva de sus respectivos titulares.
                    </p>
                  </div>

                  <div>
                    <h5 style={{ margin: '0 0 6px 0', fontWeight: 700 }}>Marco de Relación y Responsabilidad</h5>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', border: '1px solid #ebdcc9' }}>
                      <thead>
                        <tr style={{ background: '#fcfbf7' }}>
                          <th style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Ámbito Legal</th>
                          <th style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Fabricante (Tiens)</th>
                          <th style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Intermediario (Kaldirev)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Registro / Importación</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Titular de registros sanitarios (SENASAG/UNIMED), calidad de origen.</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Comercialización independiente de unidades oficiales adquiridas legítimamente.</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9', fontWeight: 'bold' }}>Garantía</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Respaldo técnico de laboratorio y sellos de fábrica.</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #ebdcc9' }}>Gestión de entrega, empaque secundario y recepción conforme.</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 10px', fontWeight: 'bold' }}>Estructura</td>
                          <td style={{ padding: '6px 10px' }}>Estructura corporativa multinacional y almacenes autorizados.</td>
                          <td style={{ padding: '6px 10px' }}>Plataforma digital independiente de atención, cobro QR y despacho.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 12px', borderRadius: '8px' }}>
                    <strong>Cláusula de Exención de Responsabilidad Sanitaria:</strong> Los productos comercializados no son medicamentos ni sustituyen tratamientos médicos. Prohibida la emisión de diagnósticos o curaciones no respaldadas legalmente.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #ebdcc9', display: 'flex', justifyContent: 'flex-end', background: '#fcfbf7' }}>
              <button className="btn-add-cart" style={{ width: 'auto', padding: '0.5rem 1.5rem', background: 'var(--primary-green)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setIsInfoModalOpen(false)}>Entendido</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default App;
