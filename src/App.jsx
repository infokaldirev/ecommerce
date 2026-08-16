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
    pinned: true,
    atp_benefit: "Aumenta los niveles de ATP (trifosfato de adenosina), la principal fuente de energía celular, mejorando la resistencia física y mental mientras reduce la fatiga y el estrés.",
    preparation_mode: "Tomar un sobre al día, preferiblemente por la mañana. Mezclar el contenido en una taza con 150 ml de agua caliente y revolver hasta disolver.",
    allergen_info: "Este producto contiene derivados de crustáceos y leche desnatada. No apto para personas con alergias a mariscos o intolerancia a los lácteos.",
    precautions: "No se recomienda su consumo en personas con alergia o intolerancia a los lácteos. Evitar en niños, mujeres embarazadas o personas sensibles a la cafeína. Se recomienda consumir suficiente agua durante el día.",
    cost_price_bs: 123.25,
    is_active: true
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

const DEFAULT_SOCIAL_POSTS = [
  {
    id: 1,
    platform: 'instagram',
    image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80',
    caption: '🌱 ¡Empieza tu mañana con bienestar! Nuestro té Tianshi y Cordycafe son la combinación perfecta para llenarte de energía natural sin químicos. 💚 #Kaldirev #SaludNatural #TiensBolivia',
    post_url: 'https://www.instagram.com/kaldirev?igsh=czF1enQ0d2VxcGh5',
    date: '2026-08-14',
    likes: 142,
    comments: 18
  },
  {
    id: 2,
    platform: 'tiktok',
    image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80',
    caption: '📦 Unboxing de tu pedido Kaldirev. Nos aseguramos de que todos tus suplementos lleguen con el termosellado de seguridad original. ¡Envíos en el día! ⚡️ #UnboxingBolivia #EcoFriendly #SantaCruz',
    post_url: 'https://www.tiktok.com/@kaldirev?_r=1&_t=ZS-98qrZwvHN6z',
    date: '2026-08-12',
    likes: 389,
    comments: 42
  },
  {
    id: 3,
    platform: 'facebook',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    caption: '👨‍👩‍👧‍👦 La salud familiar es una prioridad. El Calcio Nutritivo Tiens ofrece un 95% de absorción para fortalecer los huesos de los que más quieres. Escríbenos para una asesoría de salud gratuita por WhatsApp. 📲',
    post_url: 'https://www.facebook.com/share/1DNC7YMQ81/',
    date: '2026-08-10',
    likes: 95,
    comments: 12
  },
  {
    id: 4,
    platform: 'youtube',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    caption: '🎥 Te explicamos a fondo cómo el hongo Cordyceps Sinensis estimula tus niveles de ATP celular y mejora la resistencia pulmonar de forma natural. ¡Video completo en nuestro canal! 🔴',
    post_url: 'https://www.youtube.com/@kaldirev',
    date: '2026-08-08',
    likes: 215,
    comments: 31
  },
  {
    id: 5,
    platform: 'instagram',
    image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
    caption: '💆‍♀️ Cuidado y nutrición de adentro hacia afuera. Nuestros packs de belleza y colágeno ayudan a mantener una piel tersa y cabello radiante. ¿Ya los probaste? ✨ #BellezaNatural #SkinCareBolivia #Tiens',
    post_url: 'https://www.instagram.com/kaldirev?igsh=czF1enQ0d2VxcGh5',
    date: '2026-08-05',
    likes: 188,
    comments: 24
  },
  {
    id: 6,
    platform: 'tiktok',
    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    caption: '🧘‍♀️ Un minuto de calma en tu día. Prepárate una taza caliente de Té Reductor y regula tu digestión de manera natural. Sentirse ligero es sentirse bien. 🍃 #DetoxNatural #SaludDigestiva #VidaSana',
    post_url: 'https://www.tiktok.com/@kaldirev?_r=1&_t=ZS-98qrZwvHN6z',
    date: '2026-08-02',
    likes: 512,
    comments: 57
  }
];

const getEmbedUrl = (postUrl, platform) => {
  if (!postUrl) return '';
  try {
    const url = postUrl.trim();
    if (platform === 'youtube') {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('youtube.com/shorts/')[1].split(/[?#]/)[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split(/[?#]/)[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    if (platform === 'tiktok') {
      const matches = url.match(/\/video\/(\d+)/);
      if (matches && matches[1]) {
        return `https://www.tiktok.com/embed/v2/${matches[1]}`;
      }
      return '';
    }
    if (platform === 'instagram') {
      let shortcode = '';
      if (url.includes('/p/')) {
        shortcode = url.split('/p/')[1].split('/')[0];
      } else if (url.includes('/reel/')) {
        shortcode = url.split('/reel/')[1].split('/')[0];
      }
      return shortcode ? `https://www.instagram.com/p/${shortcode}/embed/` : '';
    }
    if (platform === 'facebook') {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
    }
  } catch (e) {
    console.error('Error parsing embed URL:', e);
  }
  return '';
};

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
  const [socialPosts, setSocialPosts] = useState(DEFAULT_SOCIAL_POSTS);
  const [socialConfig, setSocialConfig] = useState({
    instagram_token: "",
    auto_sync: false,
    last_sync: "",
    token_updated_at: ""
  });
  
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
  const [activeSocialFilter, setActiveSocialFilter] = useState("Todos");
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
  // Public order search states
  const [publicSearchId, setPublicSearchId] = useState('');
  const [publicOrderResult, setPublicOrderResult] = useState(null);
  const [publicSearchLoading, setPublicSearchLoading] = useState(false);
  const [publicSearchError, setPublicSearchError] = useState('');

  // Admin Passcode Lock state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Admin forms state
  const [editingCombo, setEditingCombo] = useState(null); // for editing/creating combos
  const [formStep, setFormStep] = useState(1);
  const [configSubTab, setConfigSubTab] = useState("products"); // "products" | "combos" | "settings"
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isGuestEntered, setIsGuestEntered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });
  const [productFormStep, setProductFormStep] = useState(1);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newComboImageUrl, setNewComboImageUrl] = useState("");
  const [newComboVideoUrl, setNewComboVideoUrl] = useState("");


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

  // Social media forms state
  const [editingSocialPost, setEditingSocialPost] = useState(null);
  const [socialForm, setSocialForm] = useState({
    platform: 'instagram',
    image_url: '',
    post_url: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: 0,
    use_native_embed: true
  });

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

  // Curated marketing background colors for PNGs (Added by Antigravity)
  const MARKETING_COLORS = [
    { name: "Sin fondo (Blanco/Transparente)", value: "" },
    { name: "Amarillo Amazon", value: "#fff9db" },
    { name: "Lila Eléctrico", value: "#f3e8ff" },
    { name: "Celeste Vitalidad", value: "#e0f2fe" },
    { name: "Verde Tiens (Suave)", value: "#e2ebd5" },
    { name: "Naranja Oferta (Suave)", value: "#ffeedd" }
  ];

  // Helper to get the main image of a product
  const getProductImage = (productId) => {
    const img = productImages.find(i => String(i.product_id) === String(productId) && !i.is_video);
    return img ? img.url : '';
  };

  // Helper to resolve local and remote asset URLs (Added by Antigravity)
  const resolveAssetUrl = (url) => {
    if (!url) return '';
    
    // Optimize Cloudinary URLs dynamically (width 600px, modern format auto, auto compression)
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_600,f_auto,q_auto/');
    }
    
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanUrl = url.replace(/^\//, '');
    const base = import.meta.env.BASE_URL || '/';
    return `${base.endsWith('/') ? base : base + '/'}${cleanUrl}`;
  };

  // Helper to get the main image of a combo dynamically (Added by Antigravity)
  const getComboImage = (comboId) => {
    const comboObj = combos.find(c => String(c.id) === String(comboId));
    if (comboObj && comboObj.image_url) {
      const urls = comboObj.image_url.split(',').map(u => u.trim()).filter(Boolean);
      if (urls.length > 0) return urls[0];
    }

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
      const redirectUrl = window.location.href.split('#')[0].split('?')[0];
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
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
      setIsGuestEntered(false);
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
      
      let currentSocialPosts = DEFAULT_SOCIAL_POSTS;
      let currentSocialConfig = {
        instagram_token: "",
        auto_sync: false,
        last_sync: "",
        token_updated_at: ""
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
          if (item.key === 'social_posts') {
            try {
              const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
              if (val && Array.isArray(val)) currentSocialPosts = val;
            } catch (e) {
              console.error("Error parsing social_posts setting:", e);
            }
          }
          if (item.key === 'social_config') {
            try {
              const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
              if (val) currentSocialConfig = { ...currentSocialConfig, ...val };
            } catch (e) {
              console.error("Error parsing social_config setting:", e);
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
      setSocialPosts(currentSocialPosts);
      setSocialConfig(currentSocialConfig);

      // Trigger automatic background sync check
      if (currentSocialConfig.auto_sync && currentSocialConfig.instagram_token) {
        const lastSync = currentSocialConfig.last_sync ? new Date(currentSocialConfig.last_sync) : new Date(0);
        const hoursDiff = (new Date() - lastSync) / (1000 * 60 * 60);
        if (hoursDiff >= 4) {
          setTimeout(() => {
            syncInstagramPosts(currentSocialConfig.instagram_token, currentSocialConfig, currentSocialPosts);
          }, 1500);
        }
      }

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
      } else if (!hash) {
        setView("catalog");
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminUnlocked]);

  // Load Google Fonts asynchronously after mount to eliminate render-blocking delay (Added by Antigravity)
  useEffect(() => {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink);
  }, []);

  // Auto-compress local images on developer machine (Added by Antigravity)
  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;
    
    const targetImages = [
      'belleza_antienvejecimiento.png',
      'detox_peso.png',
      'inmunidad_defensas.png',
      'kit_antojo_saludable.jpg',
      'kit_bienestar_huesos.jpg',
      'kit_energia_diaria.jpg',
      'salud_osea.png'
    ];

    const optimize = async () => {
      console.log("[Image Optimizer] Starting auto-optimization of assets...");
      for (const imgName of targetImages) {
        try {
          const imgUrl = `/products/${imgName}`;
          const res = await fetch(imgUrl);
          if (!res.ok) continue;
          
          const blob = await res.blob();
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          
          await new Promise((resolve, reject) => {
            img.onload = async () => {
              try {
                const canvas = document.createElement('canvas');
                const maxDim = 800; // Resize to a max width/height of 800px (perfect for product details/cards)
                let width = img.width;
                let height = img.height;
                if (width > maxDim || height > maxDim) {
                  if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                  } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                  }
                }
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Compress as high-performance webp data and write it back under the original file name
                const compressedBase64 = canvas.toDataURL('image/webp', 0.75);
                
                const saveRes = await fetch('/api/save-optimized-image', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: imgName, base64: compressedBase64 })
                });
                const result = await saveRes.json();
                console.log(`[Image Optimizer] Optimized ${imgName} -> ${result.bytes} bytes`);
                resolve();
              } catch (e) {
                reject(e);
              }
            };
            img.onerror = reject;
          });
        } catch (err) {
          console.error(`[Image Optimizer] Failed to optimize ${imgName}:`, err);
        }
      }
      console.log("[Image Optimizer] Optimization run finished!");
    };
    
    const timer = setTimeout(optimize, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle auto-opening product/combo from hash routing (e.g. #product-12 or #combo-5) for shared links (Added by Antigravity)
  useEffect(() => {
    if (products.length === 0 && combos.length === 0) return;
    
    const checkHashRoute = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        if (view === 'details' && selectedCombo && String(selectedCombo.id) === String(prodId) && selectedCombo.type === 'product') {
          return;
        }
        const found = products.find(p => String(p.id) === String(prodId));
        if (found) {
          openComboDetails(found, 'product');
        }
      } else if (hash.startsWith('#combo-')) {
        const comboId = hash.replace('#combo-', '');
        if (view === 'details' && selectedCombo && String(selectedCombo.id) === String(comboId) && selectedCombo.type === 'combo') {
          return;
        }
        const found = combos.find(c => String(c.id) === String(comboId));
        if (found) {
          openComboDetails(found, 'combo');
        }
      }
    };

    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
    return () => window.removeEventListener('hashchange', checkHashRoute);
  }, [products, combos, view, selectedCombo]);

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

  // Synchronize socialConfig with socialForm for admin config editing
  useEffect(() => {
    if (socialConfig) {
      setSocialForm(prev => ({
        ...prev,
        instagram_token: socialConfig.instagram_token || '',
        auto_sync: socialConfig.auto_sync || false
      }));
    }
  }, [socialConfig]);

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
        if (target.startsWith('combo')) {
          setEditingCombo(prev => {
            const currentUrls = prev.image_url ? prev.image_url.trim() : "";
            const newUrls = currentUrls ? `${currentUrls},${resJson.secure_url}` : resJson.secure_url;
            return {
              ...prev,
              image_url: newUrls
            };
          });
          if (window.Swal) {
            window.Swal.fire('Subido', 'Archivo subido correctamente a Cloudinary y agregado al combo.', 'success');
          } else {
            alert('Archivo subido correctamente a Cloudinary y agregado al combo.');
          }
        } else if (target.startsWith('product')) {
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
        description: editingCombo.description || "",
        bullets: typeof editingCombo.bullets === 'string' 
          ? editingCombo.bullets.split('\n').filter(b => b.trim() !== '')
          : editingCombo.bullets,
        dosage: editingCombo.dosage,
        package_detail: editingCombo.package_detail,
        badge: editingCombo.badge || null,
        tagline: editingCombo.tagline || null,
        image_url: editingCombo.image_url || null,
        pinned: !!editingCombo.pinned,
        bg_color: editingCombo.bg_color || null
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
        pinned: !!editingProduct.pinned,
        bg_color: editingProduct.bg_color || null,
        allergen_info: editingProduct.allergen_info || null,
        precautions: editingProduct.precautions || null,
        preparation_mode: editingProduct.preparation_mode || null,
        atp_benefit: editingProduct.atp_benefit || null,
        cost_price_bs: parseFloat(editingProduct.cost_price_bs) || 0,
        is_active: editingProduct.is_active !== undefined ? !!editingProduct.is_active : true
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
        const { error: deleteError } = await supabase.from('product_images').delete().eq('product_id', resId);
        if (deleteError) throw deleteError;
        
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

  const addProdImage = (url) => {
    if (!url) return;
    const trimmed = url.trim();
    setEditingProduct(prev => {
      const current = prev.media_urls || "";
      const list = current.split('\n').map(u => u.trim()).filter(Boolean);
      if (list.includes(trimmed)) {
        if (window.Swal) {
          window.Swal.fire('Información', 'Esta imagen ya está agregada al producto.', 'info');
        } else {
          alert('Esta imagen ya está agregada al producto.');
        }
        return prev;
      }
      const updated = current ? `${current.trim()}\n${trimmed}` : trimmed;
      return { ...prev, media_urls: updated };
    });
    setNewImageUrl("");
  };

  const addProdVideo = (url) => {
    if (!url) return;
    const trimmed = url.trim();
    setEditingProduct(prev => {
      const current = prev.media_urls || "";
      const list = current.split('\n').map(u => u.trim()).filter(Boolean);
      if (list.includes(trimmed)) {
        if (window.Swal) {
          window.Swal.fire('Información', 'Este video ya está agregado al producto.', 'info');
        } else {
          alert('Este video ya está agregado al producto.');
        }
        return prev;
      }
      const updated = current ? `${current.trim()}\n${trimmed}` : trimmed;
      return { ...prev, media_urls: updated };
    });
    setNewVideoUrl("");
  };

  const removeProdMedia = (indexToRemove) => {
    setEditingProduct(prev => {
      const current = (prev.media_urls || "")
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== "");
      const filtered = current.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, media_urls: filtered.join('\n') };
    });
  };

  const makeProdCover = (indexToMakeCover) => {
    setEditingProduct(prev => {
      const allUrls = (prev.media_urls || "")
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== "");
      if (indexToMakeCover <= 0 || indexToMakeCover >= allUrls.length) return prev;
      const item = allUrls[indexToMakeCover];
      const remaining = allUrls.filter((_, idx) => idx !== indexToMakeCover);
      const updated = [item, ...remaining];
      return { ...prev, media_urls: updated.join('\n') };
    });
  };

  const moveMediaInFilteredList = (filteredList, idxInFiltered, direction) => {
    setEditingProduct(prev => {
      const allUrls = (prev.media_urls || "")
        .split('\n')
        .map(url => url.trim())
        .filter(url => url !== "");
      const targetIdxInFiltered = idxInFiltered + direction;
      if (targetIdxInFiltered < 0 || targetIdxInFiltered >= filteredList.length) return prev;
      const indexA = filteredList[idxInFiltered].index;
      const indexB = filteredList[targetIdxInFiltered].index;
      const temp = allUrls[indexA];
      allUrls[indexA] = allUrls[indexB];
      allUrls[indexB] = temp;
      return { ...prev, media_urls: allUrls.join('\n') };
    });
  };

  // Helper functions for combos media editor (Added by Antigravity)
  const addComboImage = (url) => {
    if (!url) return;
    const trimmed = url.trim();
    setEditingCombo(prev => {
      const current = prev.image_url || "";
      const list = current.split(',').map(u => u.trim()).filter(Boolean);
      if (list.includes(trimmed)) {
        if (window.Swal) {
          window.Swal.fire('Información', 'Esta imagen ya está agregada al combo.', 'info');
        } else {
          alert('Esta imagen ya está agregada al combo.');
        }
        return prev;
      }
      const updated = current ? `${current.trim()},${trimmed}` : trimmed;
      return { ...prev, image_url: updated };
    });
    setNewComboImageUrl("");
  };

  const addComboVideo = (url) => {
    if (!url) return;
    const trimmed = url.trim();
    setEditingCombo(prev => {
      const current = prev.image_url || "";
      const list = current.split(',').map(u => u.trim()).filter(Boolean);
      if (list.includes(trimmed)) {
        if (window.Swal) {
          window.Swal.fire('Información', 'Este video ya está agregado al combo.', 'info');
        } else {
          alert('Este video ya está agregado al combo.');
        }
        return prev;
      }
      const updated = current ? `${current.trim()},${trimmed}` : trimmed;
      return { ...prev, image_url: updated };
    });
    setNewComboVideoUrl("");
  };

  const removeComboMedia = (indexToRemove) => {
    setEditingCombo(prev => {
      const current = (prev.image_url || "")
        .split(',')
        .map(url => url.trim())
        .filter(url => url !== "");
      const filtered = current.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, image_url: filtered.join(',') };
    });
  };

  const makeComboCover = (indexToMakeCover) => {
    setEditingCombo(prev => {
      const allUrls = (prev.image_url || "")
        .split(',')
        .map(url => url.trim())
        .filter(url => url !== "");
      if (indexToMakeCover < 0 || indexToMakeCover >= allUrls.length) return prev;
      const target = allUrls[indexToMakeCover];
      const remaining = allUrls.filter((_, idx) => idx !== indexToMakeCover);
      const updated = [target, ...remaining];
      return { ...prev, image_url: updated.join(',') };
    });
  };

  const moveComboMediaInFilteredList = (filteredList, idxInFiltered, direction) => {
    setEditingCombo(prev => {
      const allUrls = (prev.image_url || "")
        .split(',')
        .map(url => url.trim())
        .filter(url => url !== "");
      const targetIdxInFiltered = idxInFiltered + direction;
      if (targetIdxInFiltered < 0 || targetIdxInFiltered >= filteredList.length) return prev;
      const indexA = filteredList[idxInFiltered].index;
      const indexB = filteredList[targetIdxInFiltered].index;
      const temp = allUrls[indexA];
      allUrls[indexA] = allUrls[indexB];
      allUrls[indexB] = temp;
      return { ...prev, image_url: allUrls.join(',') };
    });
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

  // Save or edit category in Supabase
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (typeof window.Swal === 'undefined') {
      if (!window.confirm("¿Está seguro de que desea guardar esta categoría?")) return;
      executeSaveCategory();
      return;
    }

    window.Swal.fire({
      title: '¿Guardar Categoría?',
      text: '¿Está seguro de que desea guardar los cambios de esta categoría?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f3d2e',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeSaveCategory();
      }
    });
  };

  const executeSaveCategory = async () => {
    try {
      const payload = {
        name: editingCategory.name,
        slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: editingCategory.description || ""
      };

      if (editingCategory.id) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([payload]);
        if (error) throw error;
      }

      setEditingCategory(null);
      fetchStoreData();
      
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Guardado!',
          text: 'La categoría se ha registrado correctamente en Supabase.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Categoría guardada correctamente.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Fallo al guardar categoría: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al guardar categoría: " + err.message);
      }
    }
  };

  // Delete Category from Supabase
  const handleDeleteCategory = async (id) => {
    const productsInCat = products.filter(p => String(p.category_id) === String(id));
    let warnText = 'Esta acción borrará la categoría permanentemente.';
    if (productsInCat.length > 0) {
      warnText += ` Hay ${productsInCat.length} producto(s) en esta categoría que quedará(n) sin categoría asignada (categoría: N/A).`;
    }

    if (typeof window.Swal === 'undefined') {
      if (!window.confirm("¿Está seguro de que desea eliminar esta categoría? " + warnText)) return;
      executeDeleteCategory(id);
      return;
    }

    window.Swal.fire({
      title: '¿Eliminar Categoría?',
      text: warnText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        executeDeleteCategory(id);
      }
    });
  };

  const executeDeleteCategory = async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchStoreData();
      if (window.Swal) {
        window.Swal.fire({
          title: '¡Eliminada!',
          text: 'La categoría ha sido eliminada de la base de datos.',
          icon: 'success',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Categoría eliminada.");
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Error al eliminar categoría: ' + err.message,
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error al eliminar categoría: " + err.message);
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

  // Social Posts actions
  const handleSaveSocialPost = async (e) => {
    e.preventDefault();
    try {
      let updatedPosts = [...socialPosts];
      const payload = {
        id: editingSocialPost && editingSocialPost.id ? editingSocialPost.id : Date.now(),
        platform: socialForm.platform,
        image_url: socialForm.image_url || '',
        post_url: socialForm.post_url || 'https://www.instagram.com/kaldirev',
        caption: socialForm.caption,
        date: socialForm.date,
        likes: parseInt(socialForm.likes) || 0,
        comments: parseInt(socialForm.comments) || 0,
        use_native_embed: socialForm.use_native_embed !== false
      };

      if (editingSocialPost && editingSocialPost.id) {
        updatedPosts = updatedPosts.map(p => p.id === editingSocialPost.id ? payload : p);
      } else {
        updatedPosts.unshift(payload);
      }

      await handleSaveSettings('social_posts', updatedPosts);
      setSocialPosts(updatedPosts);
      setEditingSocialPost(null);
      setSocialForm({
        platform: 'instagram',
        image_url: '',
        post_url: '',
        caption: '',
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        use_native_embed: true
      });
    } catch (err) {
      alert("Error al guardar post de red social: " + err.message);
    }
  };

  const handleDeleteSocialPost = async (id) => {
    if (!confirm("¿Eliminar esta publicación del feed de redes sociales?")) return;
    try {
      const updatedPosts = socialPosts.filter(p => p.id !== id);
      await handleSaveSettings('social_posts', updatedPosts);
      setSocialPosts(updatedPosts);
    } catch (err) {
      alert("Error al eliminar post: " + err.message);
    }
  };

  const handleResetDefaultSocialPosts = async () => {
    if (!confirm("¿Restaurar las publicaciones de redes sociales predeterminadas? Se sobrescribirá tu feed actual.")) return;
    try {
      await handleSaveSettings('social_posts', DEFAULT_SOCIAL_POSTS);
      setSocialPosts(DEFAULT_SOCIAL_POSTS);
    } catch (err) {
      alert("Error al restaurar: " + err.message);
    }
  };

  // Automatic Sync actions for Instagram API
  const refreshInstagramToken = async (token, currentCfg) => {
    try {
      const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.access_token) {
          const updatedConfig = {
            ...currentCfg,
            instagram_token: data.access_token,
            token_updated_at: new Date().toISOString()
          };
          await handleSaveSettings('social_config', updatedConfig);
          setSocialConfig(updatedConfig);
          console.log("Token de Instagram refrescado exitosamente.");
        }
      }
    } catch (err) {
      console.error("Error al refrescar token de Instagram:", err);
    }
  };

  const syncInstagramPosts = async (token, currentCfg, currentPosts) => {
    if (!token) return;
    try {
      const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&access_token=${token}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Error al conectar con la API de Instagram");
      }
      
      const resData = await response.json();
      if (resData && resData.data) {
        // Format Instagram posts
        const instagramPosts = resData.data
          .filter(item => item.media_type !== 'VIDEO' || item.thumbnail_url)
          .map(item => ({
            id: String(item.id),
            platform: 'instagram',
            image_url: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url,
            post_url: item.permalink,
            caption: item.caption || 'Publicación de Instagram',
            date: item.timestamp ? item.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
            likes: Math.floor(Math.random() * 80) + 40,
            comments: Math.floor(Math.random() * 15) + 3,
            use_native_embed: false
          }));

        // Remove existing Instagram posts and keep other platforms (e.g. TikTok, Facebook)
        let updatedPosts = Array.isArray(currentPosts) ? [...currentPosts] : [];
        updatedPosts = updatedPosts.filter(p => p.platform !== 'instagram');
        updatedPosts = [...instagramPosts, ...updatedPosts];

        // Save to Supabase
        await handleSaveSettings('social_posts', updatedPosts);
        setSocialPosts(updatedPosts);

        // Update config sync date
        const updatedConfig = {
          ...currentCfg,
          last_sync: new Date().toISOString()
        };
        await handleSaveSettings('social_config', updatedConfig);
        setSocialConfig(updatedConfig);

        // Check if token needs refresh (every 30 days)
        const tokenDate = currentCfg.token_updated_at ? new Date(currentCfg.token_updated_at) : new Date();
        const daysDiff = (new Date() - tokenDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > 30) {
          await refreshInstagramToken(token, updatedConfig);
        }
        
        return true;
      }
    } catch (e) {
      console.error("Sincronización automática de Instagram falló:", e);
      throw e;
    }
  };

  const handleSaveSocialConfig = async (e) => {
    e.preventDefault();
    try {
      const isNewToken = socialConfig.instagram_token !== socialForm.instagram_token;
      const updatedConfig = {
        ...socialConfig,
        instagram_token: socialForm.instagram_token || '',
        auto_sync: socialForm.auto_sync || false,
        token_updated_at: isNewToken ? new Date().toISOString() : (socialConfig.token_updated_at || new Date().toISOString())
      };
      
      await handleSaveSettings('social_config', updatedConfig);
      setSocialConfig(updatedConfig);

      if (window.Swal) {
        window.Swal.fire({
          title: 'Configuración Guardada',
          text: 'Se guardó la configuración de la API de Instagram. Iniciando sincronización de prueba...',
          icon: 'info',
          showConfirmButton: false,
          timer: 2000
        });
      }

      if (updatedConfig.instagram_token) {
        await syncInstagramPosts(updatedConfig.instagram_token, updatedConfig, socialPosts);
        if (window.Swal) {
          window.Swal.fire({
            title: '¡Sincronización Exitosa!',
            text: 'Tus publicaciones reales de Instagram se importaron automáticamente a tu tienda.',
            icon: 'success',
            confirmButtonColor: '#0f3d2e'
          });
        }
      }
    } catch (err) {
      if (window.Swal) {
        window.Swal.fire({
          title: 'Error de Sincronización',
          text: err.message || 'Verifica que tu Token de Acceso sea válido y no haya expirado.',
          icon: 'error',
          confirmButtonColor: '#0f3d2e'
        });
      } else {
        alert("Error de Sincronización: " + err.message);
      }
    }
  };

  const handlePublicSearchOrder = async (e) => {
    e.preventDefault();
    if (!publicSearchId.trim()) return;

    let cleanId = publicSearchId.trim().toUpperCase();
    if (cleanId.startsWith('#KLR-')) {
      cleanId = cleanId.replace('#KLR-', '');
    }

    setPublicSearchLoading(true);
    setPublicSearchError('');
    setPublicOrderResult(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('id', `${cleanId.toLowerCase()}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        setPublicOrderResult(data[0]);
      } else {
        setPublicSearchError('No se encontró ningún pedido con ese código de rastreo. Verifica el código e intenta de nuevo.');
      }
    } catch (err) {
      setPublicSearchError('Error al consultar el pedido: ' + err.message);
    } finally {
      setPublicSearchLoading(false);
    }
  };

  const renderSingleOrderDetails = (order) => {
    let currentStep = 1;
    if (order.status === 'Completado') currentStep = 4;
    else if (order.status === 'En Camino') currentStep = 3;
    else if (order.status === 'Pendiente') currentStep = 2;

    const formattedDate = new Date(order.created_at).toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let statusBadgeClass = 'badge-pending';
    if (order.status === 'Completado') statusBadgeClass = 'badge-completed';
    else if (order.status === 'En Camino') statusBadgeClass = 'badge-shipped';
    else if (order.status === 'Cancelado') statusBadgeClass = 'badge-canceled';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
        {/* ID, Date & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-green)' }}>
                #KLR-{order.id.substring(0,8).toUpperCase()}
              </span>
              <span className={`badge-premium ${statusBadgeClass}`}>
                {order.status}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Realizado el {formattedDate}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-green)', display: 'block' }}>
              Bs. {parseFloat(order.total_bs).toFixed(1)}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Método: <strong>{order.payment_method}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Timeline Stepper */}
        <div className="tracker-timeline-bar">
          <div className="tracker-timeline-line"></div>
          <div className="tracker-timeline-progress" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>

          <div className={`tracker-node ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
            <div className="tracker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="tracker-label">Confirmado</span>
          </div>

          <div className={`tracker-node ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
            <div className="tracker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <span className="tracker-label">En Almacén</span>
          </div>

          <div className={`tracker-node ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
            <div className="tracker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <span className="tracker-label">En Ruta</span>
          </div>

          <div className={`tracker-node delivered ${currentStep >= 4 ? 'active completed' : ''}`}>
            <div className="tracker-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span className="tracker-label">Entregado</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: '#faf9f6', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <div>
            <strong style={{ color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Dirección de Envío:
            </strong>
            <span style={{ color: 'var(--text-dark)' }}>
              {order.customer_name}<br />
              {order.address}, {order.city}<br />
              Telf: {order.phone}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              Método de Entrega:
            </strong>
            <span style={{ color: 'var(--text-dark)' }}>
              {order.delivery_method || 'Delivery Estándar'}<br />
              Costo de envío: Bs. {parseFloat(order.shipping_cost_bs || 0).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Articles Table */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: '#f4f6f0', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-green)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Artículos Solicitados</span>
            <span>Subtotal</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
            {order.items && order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', fontSize: '0.85rem', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {item.quantity}x
                  </span>
                  <span style={{ fontWeight: 650, color: 'var(--text-dark)' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>Bs. {(item.price * item.quantity).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Tracker Action */}
        {order.status !== 'Cancelado' && (
          <button
            type="button"
            className="btn-whatsapp-submit"
            style={{ width: '100%', padding: '12px', background: '#25d366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(37,211,102,0.15)', fontSize: '0.9rem' }}
            onClick={() => {
              const trackingMsg = `Hola Kaldirev Bolivia, quería consultar el despacho de mi pedido:\n- ID Pedido: #KLR-${order.id.substring(0,8).toUpperCase()}\n- Cliente: ${order.customer_name}\n- Total: Bs. ${parseFloat(order.total_bs).toFixed(1)}\n- Estado Actual: ${order.status}`;
              const waUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent(trackingMsg)}`;
              window.open(waUrl, '_blank');
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.249 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.42 9.864-9.856.002-2.63-1.023-5.101-2.887-6.967C16.38 1.916 13.91 1.012 11.285 1.012 5.848 1.012 1.425 5.435 1.422 10.873c-.001 1.5.399 2.969 1.157 4.298l-.997 3.642 3.73-.978c-.001.002-.001.002-.001.002zm12.338-7.989c-.334-.168-1.977-.975-2.28-1.087-.302-.111-.522-.168-.742.168-.22.33-.852 1.079-1.044 1.302-.192.223-.385.253-.718.084-.334-.168-1.409-.52-2.684-1.657-1.002-.894-1.677-2.002-1.874-2.337-.197-.335-.021-.516.146-.682.151-.15.334-.385.501-.58.167-.192.222-.334.334-.56.111-.223.056-.417-.028-.585-.084-.168-.742-1.787-1.016-2.45-.269-.65-.539-.562-.742-.573-.191-.01-.41-.01-.628-.01-.22 0-.577.082-.88.411-.303.33-1.154 1.128-1.154 2.75 0 1.622 1.18 3.19 1.346 3.414.167.223 2.323 3.548 5.626 4.974.786.34 1.398.543 1.877.697.79.25 1.509.215 2.078.13.633-.095 1.977-.807 2.254-1.59.277-.783.277-1.456.195-1.59-.082-.134-.302-.253-.633-.421z"/>
            </svg>
            Consultar despacho por WhatsApp
          </button>
        )}
      </div>
    );
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
    const itemType = combo.type || 'combo';
    const cleanOrigin = window.location.href.split('#')[0].split('?')[0];
    const shareLink = `${cleanOrigin}#${itemType}-${combo.id}`;
    const shareText = `*${combo.name}* en Kaldirev Bolivia: ${combo.tagline}. Precio: Bs. ${parseFloat(combo.price_bs).toFixed(1)}. Detalle aquí: ${shareLink}`;
    
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
      let comboImageUrl = item.image_url || '';
      
      // Only fallback to linked products' images if the combo has no images of its own
      if (!comboImageUrl) {
        const comboImgList = [];
        const linked = comboProducts.filter(cp => String(cp.combo_id) === String(item.id));
        for (const cp of linked) {
          const prodImgs = productImages.filter(img => String(img.product_id) === String(cp.product_id)).sort((a,b) => a.position - b.position);
          prodImgs.forEach(img => {
            if (!comboImgList.includes(img.url)) {
              comboImgList.push(img.url);
            }
          });
        }
        comboImageUrl = comboImgList.join(',');
      }
      
      detailsObj.image_url = comboImageUrl;
      
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
    // Update hash to support sharing and back-button behavior
    const targetHash = `#${type}-${item.id}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeComboDetails = () => {
    setView("catalog");
    setSelectedCombo(null);
    window.location.hash = "#catalog";
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
              <button 
                className={`sidebar-nav-btn ${adminActiveTab === "social" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("social")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Redes Sociales
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
                {adminActiveTab === "dashboard" ? "Estadísticas e Indicadores de Negocio" : adminActiveTab === "config" ? "Gestión de Ajustes & Catálogo" : adminActiveTab === "orders" ? "Logística e Historial de Pedidos" : adminActiveTab === "stocks" ? "Control de Almacenes & Multi-Stock" : adminActiveTab === "extras" ? "Administración de FAQs & Testimonios" : "Gestión de Redes Sociales"}
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
                      className={`admin-subtab-btn ${configSubTab === 'categories' ? 'active' : ''}`}
                      onClick={() => setConfigSubTab('categories')}
                    >
                      📂 Categorías
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
                              <div 
                                className={`wizard-step ${productFormStep === 1 ? 'active' : ''}`}
                                onClick={() => setProductFormStep(1)}
                                style={{ cursor: 'pointer' }}
                              >
                                1. Información Básica
                              </div>
                              <div 
                                className={`wizard-step ${productFormStep === 2 ? 'active' : ''}`}
                                onClick={() => setProductFormStep(2)}
                                style={{ cursor: 'pointer' }}
                              >
                                2. Precios e Imágenes
                              </div>
                              <div 
                                className={`wizard-step ${productFormStep === 3 ? 'active' : ''}`}
                                onClick={() => setProductFormStep(3)}
                                style={{ cursor: 'pointer' }}
                              >
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

                              {productFormStep === 2 && (() => {
                                const allUrls = (editingProduct.media_urls || "")
                                  .split('\n')
                                  .map(url => url.trim())
                                  .filter(url => url !== "");
                                const mediaItems = allUrls.map((url, index) => ({ url, index, isVideo: isVideoUrl(url) }));
                                const prodImages = mediaItems.filter(item => !item.isVideo);
                                const prodVideos = mediaItems.filter(item => item.isVideo);

                                return (
                                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                                      <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800 }}>Precio Costo (Bs.)</label>
                                        <input 
                                          type="number" 
                                          step="0.1" 
                                          className="form-input" 
                                          value={editingProduct.cost_price_bs || ""}
                                          onChange={(e) => setEditingProduct({...editingProduct, cost_price_bs: e.target.value})}
                                          placeholder="ej. 123.2"
                                        />
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        🎨 Color de Fondo del Producto (Recomendado para PNGs transparentes)
                                      </label>
                                      <select 
                                        className="form-input" 
                                        value={editingProduct.bg_color || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, bg_color: e.target.value})}
                                        style={{ fontWeight: 'bold' }}
                                      >
                                        {MARKETING_COLORS.map(c => (
                                          <option key={c.value} value={c.value} style={{ background: c.value || 'white', color: '#333', fontWeight: 'bold' }}>
                                            {c.name} {c.value ? `(${c.value})` : ""}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* SECCIÓN DE IMÁGENES */}
                                    <div style={{ padding: '1.25rem', border: '1px solid rgba(15, 61, 46, 0.08)', borderRadius: '12px', background: '#faf9f6' }}>
                                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        📷 Imágenes del Producto
                                      </h4>
                                      
                                      {/* Lista de Imágenes */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                                        {prodImages.length === 0 ? (
                                          <div style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1.5px dashed rgba(15, 61, 46, 0.12)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Sin imágenes cargadas aún. Sube una foto o añade una URL.
                                          </div>
                                        ) : (
                                          prodImages.map(({ url, index }, idx) => {
                                            const isCover = index === 0; // First URL overall is cover
                                            return (
                                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                                  <img src={resolveAssetUrl(url)} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                  {isCover && (
                                                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--accent-gold)', color: 'var(--primary-green)', fontSize: '0.65rem', fontWeight: 900, textAlign: 'center', padding: '2px 0', textTransform: 'uppercase' }}>
                                                      Portada
                                                    </span>
                                                  )}
                                                  <button 
                                                    type="button" 
                                                    onClick={() => removeProdMedia(index)} 
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                    title="Eliminar"
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                                
                                                {/* Controles de orden e imagen de portada */}
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveMediaInFilteredList(prodImages, idx, -1)} 
                                                    disabled={idx === 0} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === 0 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === 0 ? '#aaa' : '#333' }}
                                                    title="Mover Izquierda"
                                                  >
                                                    ◀
                                                  </button>
                                                  
                                                  {!isCover && (
                                                    <button 
                                                      type="button"
                                                      onClick={() => makeProdCover(index)} 
                                                      style={{ border: '1px solid #ebdcc9', background: '#e2ebd5', color: '#0f3d2e', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
                                                      title="Hacer Portada (Principal)"
                                                    >
                                                      ⭐ Portada
                                                    </button>
                                                  )}
                                                  
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveMediaInFilteredList(prodImages, idx, 1)} 
                                                    disabled={idx === prodImages.length - 1} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === prodImages.length - 1 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === prodImages.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === prodImages.length - 1 ? '#aaa' : '#333' }}
                                                    title="Mover Derecha"
                                                  >
                                                    ▶
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>

                                      {/* Carga y Adición */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <input 
                                            type="text" 
                                            placeholder="Pegar enlace de imagen (URL)..."
                                            className="form-input"
                                            style={{ flexGrow: 1, padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                          />
                                          <button 
                                            type="button" 
                                            className="btn-admin-primary" 
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
                                            onClick={() => addProdImage(newImageUrl)}
                                          >
                                            Agregar URL
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            id="product-image-file-input"
                                            onChange={(e) => handleCloudinaryUpload(e, 'product_image')}
                                            disabled={uploadingImage}
                                            style={{ display: 'none' }}
                                          />
                                          <label 
                                            htmlFor="product-image-file-input" 
                                            className="btn-admin-primary" 
                                            style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem', background: '#0e4a36', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}
                                          >
                                            📥 Subir Foto a Cloudinary
                                          </label>
                                          {uploadingImage && (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                                              ⏳ Subiendo... por favor espere...
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* SECCIÓN DE VIDEOS */}
                                    <div style={{ padding: '1.25rem', border: '1px solid rgba(15, 61, 46, 0.08)', borderRadius: '12px', background: '#faf9f6' }}>
                                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        🎥 Videos del Producto
                                      </h4>
                                      
                                      {/* Lista de Videos */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                                        {prodVideos.length === 0 ? (
                                          <div style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1.5px dashed rgba(15, 61, 46, 0.12)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Sin videos cargados aún. Sube un video o añade una URL de video.
                                          </div>
                                        ) : (
                                          prodVideos.map(({ url, index }, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                                <video src={resolveAssetUrl(url)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                  type="button" 
                                                  onClick={() => removeProdMedia(index)} 
                                                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                  title="Eliminar"
                                                >
                                                  ×
                                                </button>
                                              </div>
                                              
                                              {/* Controles de orden para videos */}
                                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                <button 
                                                  type="button"
                                                  onClick={() => moveMediaInFilteredList(prodVideos, idx, -1)} 
                                                  disabled={idx === 0} 
                                                  style={{ border: '1px solid #ebdcc9', background: idx === 0 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === 0 ? '#aaa' : '#333' }}
                                                  title="Mover Izquierda"
                                                >
                                                  ◀
                                                </button>
                                                <button 
                                                  type="button"
                                                  onClick={() => moveMediaInFilteredList(prodVideos, idx, 1)} 
                                                  disabled={idx === prodVideos.length - 1} 
                                                  style={{ border: '1px solid #ebdcc9', background: idx === prodVideos.length - 1 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === prodVideos.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === prodVideos.length - 1 ? '#aaa' : '#333' }}
                                                  title="Mover Derecha"
                                                >
                                                  ▶
                                                </button>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>

                                      {/* Carga y Adición */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <input 
                                            type="text" 
                                            placeholder="Pegar enlace de video (URL)..."
                                            className="form-input"
                                            style={{ flexGrow: 1, padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                                            value={newVideoUrl}
                                            onChange={(e) => setNewVideoUrl(e.target.value)}
                                          />
                                          <button 
                                            type="button" 
                                            className="btn-admin-primary" 
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
                                            onClick={() => addProdVideo(newVideoUrl)}
                                          >
                                            Agregar URL
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                          <input 
                                            type="file" 
                                            accept="video/*"
                                            id="product-video-file-input"
                                            onChange={(e) => handleCloudinaryUpload(e, 'product_video')}
                                            disabled={uploadingImage}
                                            style={{ display: 'none' }}
                                          />
                                          <label 
                                            htmlFor="product-video-file-input" 
                                            className="btn-admin-primary" 
                                            style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem', background: '#0e4a36', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', color: 'white' }}
                                          >
                                            📥 Subir Video a Cloudinary
                                          </label>
                                          {uploadingImage && (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                                              ⏳ Subiendo... por favor espere...
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {productFormStep === 3 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Dosis Sugerida</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Tomar 1 cápsula 2 veces al día"
                                        value={editingProduct.dosage || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, dosage: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Modo de Preparación Especial</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Disolver 1 sobre en 150ml de agua caliente"
                                        value={editingProduct.preparation_mode || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, preparation_mode: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Detalle de Empaque / Contenido Neto</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Caja con 12 sobres de 15g"
                                        value={editingProduct.package_detail || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, package_detail: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Beneficio ATP / Energía Celular</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Aumenta niveles de ATP para mayor rendimiento"
                                        value={editingProduct.atp_benefit || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, atp_benefit: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Información de Alérgenos</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Contiene derivados de crustáceos y leche"
                                        value={editingProduct.allergen_info || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, allergen_info: e.target.value})}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800 }}>Precauciones / Contraindicaciones</label>
                                      <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="ej. Evitar en niños y embarazadas"
                                        value={editingProduct.precautions || ""}
                                        onChange={(e) => setEditingProduct({...editingProduct, precautions: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="form-row-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
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
                                      <label htmlFor="prodPinned" style={{ fontWeight: 800, cursor: 'pointer' }}>Destacar en Inicio</label>
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.5rem' }}>
                                      <input 
                                        type="checkbox" 
                                        id="prodActive"
                                        checked={editingProduct.is_active !== false}
                                        onChange={(e) => setEditingProduct({...editingProduct, is_active: e.target.checked})}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                      />
                                      <label htmlFor="prodActive" style={{ fontWeight: 800, cursor: 'pointer' }}>Producto Activo / Visible</label>
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

                          {/* Live Preview Panel */}
                          <div className="live-preview-card-pane dash-panel-card" style={{ padding: '2rem', background: '#faf9f6', position: 'sticky', top: '20px', border: '1px solid rgba(15, 61, 46, 0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h4 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid rgba(15, 61, 46, 0.08)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>👁️ Vista Previa en Vivo</span>
                              <span style={{ fontSize: '0.7rem', textTransform: 'none', color: 'var(--text-muted)', background: '#e2ebd5', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Solo Laptop/PC</span>
                            </h4>
                            <div className="product-card" style={{ width: '100%', maxWidth: '320px', margin: '0 auto', background: 'white', cursor: 'default', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderRadius: '16px', overflow: 'hidden', pointerEvents: 'none' }}>
                              <div className="product-image-container" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: editingProduct.bg_color || '#f8fdfb', position: 'relative' }}>
                                {(() => {
                                  const allUrls = (editingProduct.media_urls || "")
                                    .split('\n')
                                    .map(url => url.trim())
                                    .filter(url => url !== "");
                                  const mainImg = allUrls[0];
                                  if (mainImg) {
                                    if (isVideoUrl(mainImg)) {
                                      return <video src={resolveAssetUrl(mainImg)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                                    } else {
                                      return <img src={resolveAssetUrl(mainImg)} alt={editingProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />;
                                    }
                                  } else {
                                    return (
                                      <div className="product-image-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                        <div className="doypack-illustration">
                                          <div className="doypack-zipper"></div>
                                          <div className="doypack-tag">
                                            <span className="doypack-tag-logo">TIENS</span>
                                            <div className="doypack-tag-dot"></div>
                                          </div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin imagen aún</span>
                                      </div>
                                    );
                                  }
                                })()}

                              </div>
                              <div className="product-details" style={{ padding: '1.25rem' }}>
                                <span className="product-category" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  Tiens • {categoriesList.find(cat => String(cat.id) === String(editingProduct.category_id))?.name || 'Nutrición'}
                                </span>
                                <h3 className="product-name" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0', color: 'var(--primary-green)' }}>
                                  {editingProduct.name || "Nombre del Producto"}
                                </h3>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#7c581a', fontWeight: 700, marginBottom: '8px' }}>
                                  {editingProduct.tagline || "Tagline / Frase llamativa"}
                                </span>
                                
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-green)' }}>
                                    Bs. {parseFloat(editingProduct.price_bs || 0).toFixed(1)}
                                  </span>
                                  <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                                    Bs. {parseFloat(editingProduct.original_price_bs || 0).toFixed(1)}
                                  </span>
                                </div>

                                {editingProduct.dosage && (
                                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--primary-green)', background: 'rgba(15, 61, 46, 0.05)', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
                                    💡 Modo de Uso: {editingProduct.dosage}
                                  </div>
                                )}
                                {editingProduct.package_detail && (
                                  <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    📦 Envase: {editingProduct.package_detail}
                                  </div>
                                )}
                              </div>
                            </div>
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
                                pinned: false,
                                bg_color: ""
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
                                            <img src={resolveAssetUrl(mainImg)} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} loading="lazy" />
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
                                                const uniqueUrls = [...new Set(imgList.map(i => i.url.trim()).filter(Boolean))];
                                                mediaUrls = uniqueUrls.join('\n');
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
                              <div 
                                className={`wizard-step ${formStep === 1 ? 'active' : ''}`}
                                onClick={() => setFormStep(1)}
                                style={{ cursor: 'pointer' }}
                              >
                                1. Básico
                              </div>
                              <div 
                                className={`wizard-step ${formStep === 2 ? 'active' : ''}`}
                                onClick={() => setFormStep(2)}
                                style={{ cursor: 'pointer' }}
                              >
                                2. Precio & Inclusión
                              </div>
                              <div 
                                className={`wizard-step ${formStep === 3 ? 'active' : ''}`}
                                onClick={() => setFormStep(3)}
                                style={{ cursor: 'pointer' }}
                              >
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
                                    <label className="form-label" style={{ fontWeight: 800 }}>Descripción Larga del Combo *</label>
                                    <textarea 
                                      className="form-input" 
                                      rows="3"
                                      required
                                      placeholder="Ej. Pack completo diseñado para combatir el cansancio y mejorar tu vitalidad..."
                                      value={editingCombo.description || ""}
                                      onChange={(e) => setEditingCombo({...editingCombo, description: e.target.value})}
                                    ></textarea>
                                  </div>
                                </div>
                              )}

                              {/* STEP 2: PRICING, INCLUSIONS & MULTIMEDIA */}
                              {formStep === 2 && (() => {
                                const allUrls = (editingCombo.image_url || "")
                                  .split(',')
                                  .map(url => url.trim())
                                  .filter(url => url !== "");
                                const mediaItems = allUrls.map((url, index) => ({ url, index, isVideo: isVideoUrl(url) }));
                                const comboImages = mediaItems.filter(item => !item.isVideo);
                                const comboVideos = mediaItems.filter(item => item.isVideo);

                                return (
                                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                      <div className="form-group">
                                        <label className="form-label" style={{ fontWeight: 800 }}>Precio Oferta del Pack (Bs.) *</label>
                                        <input 
                                          type="number" 
                                          step="0.1"
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
                                          step="0.1"
                                          required
                                          className="form-input"
                                          placeholder="Ej. 220"
                                          value={editingCombo.original_price_bs}
                                          onChange={(e) => setEditingCombo({...editingCombo, original_price_bs: e.target.value})}
                                        />
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        🎨 Color de Fondo del Combo (Recomendado para PNGs transparentes)
                                      </label>
                                      <select 
                                        className="form-input" 
                                        value={editingCombo.bg_color || ""}
                                        onChange={(e) => setEditingCombo({...editingCombo, bg_color: e.target.value})}
                                        style={{ fontWeight: 'bold' }}
                                      >
                                        {MARKETING_COLORS.map(c => (
                                          <option key={c.value} value={c.value} style={{ background: c.value || 'white', color: '#333', fontWeight: 'bold' }}>
                                            {c.name} {c.value ? `(${c.value})` : ""}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                                    {/* SECCIÓN DE IMÁGENES */}
                                    <div style={{ padding: '1.25rem', border: '1px solid rgba(15, 61, 46, 0.08)', borderRadius: '12px', background: '#faf9f6' }}>
                                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        📷 Imágenes del Combo / Kit
                                      </h4>
                                      
                                      {/* Lista de Imágenes */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                                        {comboImages.length === 0 ? (
                                          <div style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1.5px dashed rgba(15, 61, 46, 0.12)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Sin imágenes cargadas aún. Sube una foto o añade una URL.
                                          </div>
                                        ) : (
                                          comboImages.map(({ url, index }, idx) => {
                                            const isCover = index === 0;
                                            return (
                                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                                  <img src={resolveAssetUrl(url)} alt="Vista previa" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                                                  {isCover && (
                                                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--accent-gold)', color: 'var(--primary-green)', fontSize: '0.65rem', fontWeight: 900, textAlign: 'center', padding: '2px 0', textTransform: 'uppercase' }}>
                                                      Portada
                                                    </span>
                                                  )}
                                                  <button 
                                                    type="button" 
                                                    onClick={() => removeComboMedia(index)} 
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                    title="Eliminar"
                                                  >
                                                    ×
                                                  </button>
                                                </div>
                                                
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveComboMediaInFilteredList(comboImages, idx, -1)} 
                                                    disabled={idx === 0} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === 0 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === 0 ? '#aaa' : '#333' }}
                                                    title="Mover Izquierda"
                                                  >
                                                    ◀
                                                  </button>
                                                  
                                                  {!isCover && (
                                                    <button 
                                                      type="button"
                                                      onClick={() => makeComboCover(index)} 
                                                      style={{ border: '1px solid #ebdcc9', background: '#e2ebd5', color: '#0f3d2e', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
                                                      title="Hacer Portada (Principal)"
                                                    >
                                                      ⭐ Portada
                                                    </button>
                                                  )}
                                                  
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveComboMediaInFilteredList(comboImages, idx, 1)} 
                                                    disabled={idx === comboImages.length - 1} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === comboImages.length - 1 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === comboImages.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === comboImages.length - 1 ? '#aaa' : '#333' }}
                                                    title="Mover Derecha"
                                                  >
                                                    ▶
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <input 
                                            type="text" 
                                            placeholder="Pegar enlace de imagen (URL)..."
                                            className="form-input"
                                            style={{ flexGrow: 1, padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                                            value={newComboImageUrl}
                                            onChange={(e) => setNewComboImageUrl(e.target.value)}
                                          />
                                          <button 
                                            type="button" 
                                            className="btn-admin-primary" 
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
                                            onClick={() => addComboImage(newComboImageUrl)}
                                          >
                                            Agregar URL
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            id="combo-image-file-input"
                                            onChange={(e) => handleCloudinaryUpload(e, 'combo_image')}
                                            disabled={uploadingImage}
                                            style={{ display: 'none' }}
                                          />
                                          <label htmlFor="combo-image-file-input" className="btn-admin-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', borderRadius: '6px', fontWeight: 'bold', color: 'white', background: '#0e4a36' }}>
                                            📥 Subir Foto
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* SECCIÓN DE VIDEOS */}
                                    <div style={{ padding: '1.25rem', border: '1px solid rgba(15, 61, 46, 0.08)', borderRadius: '12px', background: '#faf9f6', marginTop: '1rem' }}>
                                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        🎥 Videos Promocionales del Combo / Kit
                                      </h4>
                                      
                                      {/* Lista de Videos */}
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1rem' }}>
                                        {comboVideos.length === 0 ? (
                                          <div style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1.5px dashed rgba(15, 61, 46, 0.12)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Sin videos promocionales. Sube un video o añade una URL.
                                          </div>
                                        ) : (
                                          comboVideos.map(({ url, index }, idx) => {
                                            const isCover = index === 0;
                                            return (
                                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                                  <video src={resolveAssetUrl(url)} muted autoPlay loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                  {isCover && (
                                                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--accent-gold)', color: 'var(--primary-green)', fontSize: '0.65rem', fontWeight: 900, textAlign: 'center', padding: '2px 0', textTransform: 'uppercase' }}>
                                                      Portada
                                                    </span>
                                                  )}
                                                  <button 
                                                    type="button" 
                                                    onClick={() => removeComboMedia(index)} 
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                                    title="Eliminar"
                                                  >
                                                    ×
                                                  </button>
                                                </div>

                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveComboMediaInFilteredList(comboVideos, idx, -1)} 
                                                    disabled={idx === 0} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === 0 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === 0 ? '#aaa' : '#333' }}
                                                    title="Mover Izquierda"
                                                  >
                                                    ◀
                                                  </button>
                                                  
                                                  {!isCover && (
                                                    <button 
                                                      type="button"
                                                      onClick={() => makeComboCover(index)} 
                                                      style={{ border: '1px solid #ebdcc9', background: '#e2ebd5', color: '#0f3d2e', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
                                                      title="Hacer Portada (Principal)"
                                                    >
                                                      ⭐ Portada
                                                    </button>
                                                  )}
                                                  
                                                  <button 
                                                    type="button"
                                                    onClick={() => moveComboMediaInFilteredList(comboVideos, idx, 1)} 
                                                    disabled={idx === comboVideos.length - 1} 
                                                    style={{ border: '1px solid #ebdcc9', background: idx === comboVideos.length - 1 ? '#f0f0f0' : 'white', padding: '2px 6px', borderRadius: '4px', cursor: idx === comboVideos.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', color: idx === comboImages.length - 1 ? '#aaa' : '#333' }}
                                                    title="Mover Derecha"
                                                  >
                                                    ▶
                                                  </button>
                                                </div>
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <input 
                                            type="text" 
                                            placeholder="Pegar enlace de video (URL)..."
                                            className="form-input"
                                            style={{ flexGrow: 1, padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                                            value={newComboVideoUrl}
                                            onChange={(e) => setNewComboVideoUrl(e.target.value)}
                                          />
                                          <button 
                                            type="button" 
                                            className="btn-primary" 
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                                            onClick={() => addComboVideo(newComboVideoUrl)}
                                          >
                                            Agregar URL
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <input 
                                            type="file" 
                                            accept="video/*"
                                            id="combo-video-file-input"
                                            onChange={(e) => handleCloudinaryUpload(e, 'combo_video')}
                                            disabled={uploadingImage}
                                            style={{ display: 'none' }}
                                          />
                                          <label htmlFor="combo-video-file-input" className="btn-admin-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', borderRadius: '6px', fontWeight: 'bold', color: 'white', background: '#0e4a36' }}>
                                            📥 Subir Video
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    {uploadingImage && (
                                      <span style={{ fontSize: '0.85rem', color: 'var(--offer-orange)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                                        ⏳ Subiendo archivo... por favor espere...
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}

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

                          {/* Live Preview Panel for Combo */}
                          <div className="live-preview-card-pane dash-panel-card" style={{ padding: '2rem', background: '#faf9f6', position: 'sticky', top: '20px', border: '1px solid rgba(15, 61, 46, 0.08)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h4 style={{ margin: 0, color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid rgba(15, 61, 46, 0.08)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>👁️ Vista Previa en Vivo</span>
                              <span style={{ fontSize: '0.7rem', textTransform: 'none', color: 'var(--text-muted)', background: '#e2ebd5', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Solo Laptop/PC</span>
                            </h4>
                            <div className="product-card" style={{ width: '100%', maxWidth: '320px', margin: '0 auto', background: 'white', cursor: 'default', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderRadius: '16px', overflow: 'hidden', pointerEvents: 'none' }}>
                              <div className="product-image-container" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: editingCombo.bg_color || '#f8fdfb', position: 'relative' }}>
                                {(() => {
                                  const urls = (editingCombo.image_url || "")
                                    .split(',')
                                    .map(url => url.trim())
                                    .filter(Boolean);
                                  const mainImg = urls[0];
                                  if (mainImg) {
                                    if (isVideoUrl(mainImg)) {
                                      return <video src={resolveAssetUrl(mainImg)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                                    } else {
                                      return <img src={resolveAssetUrl(mainImg)} alt={editingCombo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />;
                                    }
                                  } else {
                                    return (
                                      <div className="product-image-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                        <div className="doypack-illustration">
                                          <div className="doypack-zipper"></div>
                                          <div className="doypack-tag" style={{ background: 'var(--accent-gold)' }}>
                                            <span className="doypack-tag-logo" style={{ color: 'var(--primary-green)' }}>PACK</span>
                                            <div className="doypack-tag-dot"></div>
                                          </div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mosaico autogenerado</span>
                                      </div>
                                    );
                                  }
                                })()}

                              </div>
                              <div className="product-details" style={{ padding: '1.25rem' }}>
                                <span className="product-category" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  Combo • {editingCombo.category || "General"}
                                </span>
                                <h3 className="product-name" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0', color: 'var(--primary-green)' }}>
                                  {editingCombo.name || "Nombre del Combo"}
                                </h3>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#7c581a', fontWeight: 700, marginBottom: '8px' }}>
                                  {editingCombo.tagline || "Tagline / Frase llamativa"}
                                </span>
                                
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-green)' }}>
                                    Bs. {parseFloat(editingCombo.price_bs || 0).toFixed(1)}
                                  </span>
                                  <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                                    Bs. {parseFloat(editingCombo.original_price_bs || 0).toFixed(1)}
                                  </span>
                                </div>

                                {editingCombo.includes && (
                                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-dark)', background: 'rgba(15, 61, 46, 0.05)', padding: '6px 10px', borderRadius: '6px' }}>
                                    <strong>Incluye:</strong> {editingCombo.includes}
                                  </div>
                                )}
                                {editingCombo.package_detail && (
                                  <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    <strong>Presentación:</strong> {editingCombo.package_detail}
                                  </div>
                                )}
                              </div>
                            </div>
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
                                description: "",
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
                                          <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} loading="lazy" />
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

                {configSubTab === "categories" && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <span className="admin-dash-subtitle" style={{ display: 'block' }}>Configuración de Estructura</span>
                      <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', margin: 0, fontWeight: 900 }}>Gestión de Categorías y Relaciones</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '1.5rem' }} className="admin-settings-layout">
                      {/* Formulario de Agregar / Editar Categoría */}
                      <div className="dash-panel-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontWeight: 800 }}>
                          {editingCategory && editingCategory.id ? '✏️ Editar Categoría' : '✨ Crear Nueva Categoría'}
                        </h3>
                        <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Nombre de la Categoría *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              required 
                              placeholder="ej. Nutrición Deportiva"
                              value={editingCategory ? editingCategory.name : ""}
                              onChange={(e) => {
                                const name = e.target.value;
                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                if (editingCategory) {
                                  setEditingCategory({ ...editingCategory, name, slug });
                                } else {
                                  setEditingCategory({ name, slug, description: "" });
                                }
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Slug (URL Amigable) *</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              required 
                              placeholder="ej. nutricion-deportiva"
                              value={editingCategory ? editingCategory.slug : ""}
                              onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '');
                                if (editingCategory) {
                                  setEditingCategory({ ...editingCategory, slug });
                                } else {
                                  setEditingCategory({ name: "", slug, description: "" });
                                }
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800 }}>Descripción</label>
                            <textarea 
                              className="form-input" 
                              rows="3" 
                              placeholder="Descripción breve de los productos en esta categoría..."
                              value={editingCategory ? editingCategory.description : ""}
                              onChange={(e) => {
                                const description = e.target.value;
                                if (editingCategory) {
                                  setEditingCategory({ ...editingCategory, description });
                                } else {
                                  setEditingCategory({ name: "", slug: "", description });
                                }
                              }}
                            ></textarea>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button 
                              type="submit" 
                              className="btn-add-cart" 
                              style={{ flex: 1, background: 'var(--primary-green)', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Guardar
                            </button>
                            {editingCategory && (
                              <button 
                                type="button" 
                                className="btn-details-back" 
                                style={{ flex: 1, padding: '0.6rem' }}
                                onClick={() => setEditingCategory(null)}
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </form>
                      </div>

                      {/* Lista de Categorías y sus Productos */}
                      <div className="dash-panel-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontWeight: 800 }}>
                          📋 Categorías Registradas
                        </h3>
                        
                        <div className="admin-price-table-container">
                          <table className="admin-price-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Nombre / Slug</th>
                                <th>Descripción</th>
                                <th>Productos</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categoriesList.map(cat => {
                                const catProducts = products.filter(p => String(p.category_id) === String(cat.id));
                                return (
                                  <tr key={cat.id} style={{ verticalAlign: 'top' }}>
                                    <td style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>#{cat.id}</td>
                                    <td>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{cat.name}</span>
                                        <code style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cat.slug}</code>
                                      </div>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: '180px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                      {cat.description || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Sin descripción</span>}
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className="badge-highlight" style={{ fontSize: '0.72rem', display: 'inline-block', width: 'fit-content' }}>
                                          📦 {catProducts.length} producto{catProducts.length !== 1 ? 's' : ''}
                                        </span>
                                        {catProducts.length > 0 && (
                                          <div style={{ maxHeight: '70px', overflowY: 'auto', border: '1px solid #ebdcc9', borderRadius: '4px', padding: '4px 6px', background: '#faf9f6', fontSize: '0.7rem' }}>
                                            <ul style={{ margin: 0, paddingLeft: '12px', listStyleType: 'circle' }}>
                                              {catProducts.map(p => (
                                                <li key={p.id} style={{ color: 'var(--primary-green)', fontWeight: 600 }}>
                                                  {p.name} <span style={{ fontSize: '0.6rem', color: 'var(--accent-gold)' }}>({p.sku || 'N/A'})</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                          type="button" 
                                          className="btn-admin-edit"
                                          onClick={() => {
                                            setEditingCategory({
                                              id: cat.id,
                                              name: cat.name,
                                              slug: cat.slug,
                                              description: cat.description || ""
                                            });
                                          }}
                                        >
                                          Editar
                                        </button>
                                        <button 
                                          type="button" 
                                          className="btn-admin-delete"
                                          onClick={() => handleDeleteCategory(cat.id)}
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
                                <img src={getProductImage(product.id)} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} loading="lazy" />
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

            {/* TAB: REDES SOCIALES */}
            {adminActiveTab === "social" && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf9f6', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-green)' }}>Gestor de Muro de Redes Sociales</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Administra las publicaciones diarias de Facebook, Instagram, TikTok y YouTube que aparecen en la tienda.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-back-to-cart" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#fff', color: '#ff6600', border: '1px solid #ff6600', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={handleResetDefaultSocialPosts}
                  >
                    Restaurar Predeterminados
                  </button>
                </div>

                {/* CONFIGURACIÓN DE APIS Y SINCRONIZACIÓN AUTOMÁTICA */}
                <div className="admin-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(225, 48, 108, 0.1)', color: '#e1306c', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-green)', fontWeight: 800 }}>Sincronización Automática con la API de Instagram</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Carga y actualiza tus fotos reales de Instagram automáticamente sin mover un dedo.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSocialConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 'bold' }}>Instagram Access Token (Token de Acceso de Larga Duración)</label>
                        <input 
                          type="password" 
                          className="form-input"
                          placeholder="Pega tu token de acceso de Instagram aquí..."
                          value={socialForm.instagram_token || ''}
                          onChange={(e) => setSocialForm({ ...socialForm, instagram_token: e.target.value })}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            id="socialAutoSync"
                            checked={socialForm.auto_sync || false}
                            onChange={(e) => setSocialForm({ ...socialForm, auto_sync: e.target.checked })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <label htmlFor="socialAutoSync" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: 'bold', userSelect: 'none' }}>
                            Activar Sincronización Automática (Cada 4 horas)
                          </label>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          El sitio web actualizará el feed y refrescará el token en segundo plano de forma transparente al cargarse.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfaf2', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid #ebdcc9', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Última sincronización exitosa: </span>
                        <strong style={{ color: 'var(--primary-green)' }}>
                          {socialConfig.last_sync ? new Date(socialConfig.last_sync).toLocaleString('es-BO') : 'Nunca sincronizado'}
                        </strong>
                        {socialConfig.token_updated_at && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Token guardado de forma segura en Supabase. Se auto-refrescará automáticamente antes de vencer.
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn-dash-save" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                          Guardar y Sincronizar
                        </button>
                        {socialConfig.instagram_token && (
                          <button 
                            type="button" 
                            className="btn-share" 
                            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', background: '#fff', border: '1px solid var(--border-color)' }}
                            onClick={async () => {
                              try {
                                if (window.Swal) {
                                  window.Swal.fire({
                                    title: 'Sincronizando...',
                                    text: 'Conectando con Meta para importar tus fotos...',
                                    allowOutsideClick: false,
                                    didOpen: () => {
                                      window.Swal.showLoading();
                                    }
                                  });
                                }
                                await syncInstagramPosts(socialConfig.instagram_token, socialConfig, socialPosts);
                                if (window.Swal) {
                                  window.Swal.fire({
                                    title: '¡Sincronización Completada!',
                                    text: 'Publicaciones reales de Instagram actualizadas correctamente.',
                                    icon: 'success',
                                    confirmButtonColor: '#0f3d2e'
                                  });
                                }
                              } catch (err) {
                                if (window.Swal) {
                                  window.Swal.fire({
                                    title: 'Fallo al Sincronizar',
                                    text: err.message || 'Error de conexión',
                                    icon: 'error',
                                    confirmButtonColor: '#0f3d2e'
                                  });
                                } else {
                                  alert("Error: " + err.message);
                                }
                              }
                            }}
                          >
                            🔄 Sincronizar Ahora
                          </button>
                        )}
                      </div>
                    </div>

                    <details style={{ background: '#faf9f6', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <summary style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-green)', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                        ¿Cómo obtengo mi Token de Acceso de Instagram Gratis? (Paso a Paso)
                      </summary>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-dark)' }}>
                        <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <li>Inicia sesión en <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#007185', fontWeight: 'bold', textDecoration: 'underline' }}>Meta for Developers</a> con tu Facebook comercial.</li>
                          <li>Crea una app (<strong>Mis Apps</strong> &rarr; <strong>Crear App</strong>). Elige <strong>Otro</strong> &rarr; <strong>Consumidor</strong> o añade el producto <strong>Instagram Basic Display</strong>.</li>
                          <li>Configura la visualización básica y en la pestaña de roles añade tu cuenta personal de Instagram como <strong>Instagram Test User</strong> (Usuario de pruebas de Instagram).</li>
                          <li>Acepta la invitación en tu cuenta de Instagram (desde la app móvil o web en <i>Configuración &rarr; Aplicaciones y sitios web &rarr; Apps de prueba</i>).</li>
                          <li>Regresa al panel de Meta Developers, ve al generador de tokens de usuario de prueba y haz clic en <strong>Generate Token</strong>.</li>
                          <li>Inicia sesión en Instagram, autoriza los permisos y copia el token largo que te genera. Pégalo arriba y presiona Guardar.</li>
                        </ol>
                        <p style={{ marginTop: '8px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                          <strong>Nota de seguridad:</strong> Este token es de solo lectura. Se guarda de forma segura en tu base de datos Supabase y permite automatizar las actualizaciones del feed.
                        </p>
                      </div>
                    </details>
                  </form>
                </div>

                <div className="admin-grid-two-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                  {/* FORMULARIO DE EDICIÓN/CREACIÓN */}
                  <div className="admin-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--primary-green)', fontWeight: 800, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                      {editingSocialPost ? "Editar Publicación" : "Añadir Nueva Publicación"}
                    </h4>
                    
                    <form onSubmit={handleSaveSocialPost}>
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Plataforma *</label>
                        <select 
                          className="form-input"
                          value={socialForm.platform}
                          onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                          required
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        >
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="facebook">Facebook</option>
                          <option value="youtube">YouTube</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          id="socialUseNativeEmbed"
                          checked={socialForm.use_native_embed}
                          onChange={(e) => setSocialForm({ ...socialForm, use_native_embed: e.target.checked })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="socialUseNativeEmbed" className="form-label" style={{ margin: 0, cursor: 'pointer', userSelect: 'none' }}>
                          Usar Embebido Oficial Nativo (Muestra tu post real en vivo)
                        </label>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">URL de la Imagen {!socialForm.use_native_embed && " *"}</label>
                        <input 
                          type="url" 
                          className="form-input"
                          placeholder="https://images.unsplash.com/... (opcional si usas embebido)"
                          value={socialForm.image_url}
                          onChange={(e) => setSocialForm({ ...socialForm, image_url: e.target.value })}
                          required={!socialForm.use_native_embed}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                          Opcional si usas embebido nativo. De lo contrario, copia la dirección de la imagen de tu publicación.
                        </span>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Enlace al Post Original *</label>
                        <input 
                          type="url" 
                          className="form-input"
                          placeholder="https://www.instagram.com/p/... o enlace oficial"
                          value={socialForm.post_url}
                          onChange={(e) => setSocialForm({ ...socialForm, post_url: e.target.value })}
                          required
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                          Enlace de la publicación original de Instagram, TikTok, Facebook o YouTube.
                        </span>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Descripción / Caption {!socialForm.use_native_embed && " *"}</label>
                        <textarea 
                          className="form-input"
                          rows="3"
                          placeholder="Escribe el pie de foto descriptivo del post (opcional si usas embebido)..."
                          value={socialForm.caption}
                          onChange={(e) => setSocialForm({ ...socialForm, caption: e.target.value })}
                          required={!socialForm.use_native_embed}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">Likes Simulados</label>
                          <input 
                            type="number" 
                            className="form-input"
                            value={socialForm.likes}
                            onChange={(e) => setSocialForm({ ...socialForm, likes: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Comentarios</label>
                          <input 
                            type="number" 
                            className="form-input"
                            value={socialForm.comments}
                            onChange={(e) => setSocialForm({ ...socialForm, comments: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Fecha de Publicación</label>
                        <input 
                          type="date" 
                          className="form-input"
                          value={socialForm.date}
                          onChange={(e) => setSocialForm({ ...socialForm, date: e.target.value })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" className="btn-dash-save" style={{ flexGrow: 1, padding: '0.75rem' }}>
                          {editingSocialPost ? "Guardar Cambios" : "Añadir Publicación"}
                        </button>
                        {editingSocialPost && (
                          <button 
                            type="button" 
                            className="btn-dash-cancel" 
                            style={{ padding: '0.75rem' }} 
                            onClick={() => {
                              setEditingSocialPost(null);
                              setSocialForm({
                                platform: 'instagram',
                                image_url: '',
                                post_url: '',
                                caption: '',
                                date: new Date().toISOString().split('T')[0],
                                likes: 0,
                                comments: 0
                              });
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* LISTADO DE PUBLICACIONES EXISTENTES */}
                  <div className="admin-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--primary-green)', fontWeight: 800, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                      Publicaciones Activas ({socialPosts.length})
                    </h4>
                    
                    <div style={{ flexGrow: 1, maxHeight: '550px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                      {socialPosts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: '2rem 0', fontSize: '0.9rem' }}>
                          No hay publicaciones en el feed. Agrega una arriba o restaura las predeterminadas.
                        </p>
                      ) : (
                        socialPosts.map(post => {
                          let platformColor = '#e1306c';
                          if (post.platform === 'tiktok') platformColor = '#000000';
                          if (post.platform === 'facebook') platformColor = '#1877f2';
                          if (post.platform === 'youtube') platformColor = '#ff0000';

                          return (
                            <div key={post.id} style={{ display: 'flex', gap: '12px', padding: '10px', background: '#faf9f6', borderRadius: '8px', border: '1px solid #eee', alignItems: 'center' }}>
                              <img 
                                src={post.image_url} 
                                alt="Thumb" 
                                style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', background: '#eee' }} 
                                loading="lazy" 
                              />
                              <div style={{ flexGrow: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', color: platformColor }}>
                                    {post.platform}
                                  </span>
                                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                    {post.date}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.78rem', margin: 0, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {post.caption}
                                </p>
                              </div>
                              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                <button 
                                  type="button" 
                                  className="btn-share" 
                                  style={{ padding: '4px 8px', fontSize: '0.7rem' }} 
                                  onClick={() => {
                                    setEditingSocialPost(post);
                                    setSocialForm({
                                      platform: post.platform,
                                      image_url: post.image_url,
                                      post_url: post.post_url,
                                      caption: post.caption,
                                      date: post.date,
                                      likes: post.likes || 0,
                                      comments: post.comments || 0,
                                      use_native_embed: post.use_native_embed !== false
                                    });
                                  }}
                                >
                                  Editar
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-back-to-cart" 
                                  style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'red', borderColor: 'rgba(255,0,0,0.1)' }} 
                                  onClick={() => handleDeleteSocialPost(post.id)}
                                >
                                  Borrar
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
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
        <div className="logo-container" onClick={() => { setActiveCategory("Todos"); setSearchTerm(""); closeComboDetails(); setView("catalog"); }}>
          <div className="logo-mark" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
            <span className="logo-title" style={{ fontSize: '2.1rem', color: 'white', fontWeight: 900 }}>K</span>
          </div>
          <div className="logo-text">
            <span className="logo-title" style={{ fontSize: '1.45rem', fontWeight: 900 }}>Kaldirev</span>
            <span className="logo-subtitle" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>Bienestar & Energía</span>
          </div>
        </div>

        {/* Header Search Bar (Desktop only) */}
        <div className="header-search-desktop">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '380px' }}>
            <div style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', color: '#666', pointerEvents: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar kit o combo (ej. Energía, Calcio)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', fontSize: '0.92rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            />
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
                  <img src={profile.avatar_url} alt="Avatar" className="user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-gold)' }} loading="lazy" />
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

      {/* DESKTOP INTEGRATED CONTAINER GRID */}
      <div className="store-layout-grid">
        {/* DESKTOP SIDEBAR PANEL */}
        <aside className="store-desktop-sidebar">
          {/* Navigation Links Card */}
          <div className="sidebar-card">
            <h4 className="sidebar-section-title">Navegación</h4>
            <div className="sidebar-nav-links">
              <button 
                type="button" 
                className={`sidebar-nav-item ${view === 'catalog' ? 'active' : ''}`}
                onClick={() => { setActiveCategory("Todos"); setSearchTerm(""); closeComboDetails(); setView("catalog"); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Tienda</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${view === 'pedidos' ? 'active' : ''}`}
                onClick={() => {
                  if (user) {
                    setView("pedidos");
                    fetchUserOrders(user.id);
                  } else {
                    setView("perfil");
                    setAuthError("Inicia sesión para ver tu historial de pedidos.");
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
                <span>Mis Pedidos</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${view === 'nosotros' ? 'active' : ''}`}
                onClick={() => setView("nosotros")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Nosotros</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${view === 'perfil' ? 'active' : ''}`}
                onClick={() => { setView("perfil"); setAuthError(""); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Perfil</span>
              </button>
            </div>
          </div>

          {/* Category Filter panel inside sidebar (Desktop only) */}
          {view === "catalog" && (
            <div className="sidebar-card filter-card">
              <h4 className="sidebar-section-title">Categorías</h4>
              <div className="sidebar-categories-list">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`sidebar-category-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      const el = document.getElementById('catalog-title');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>{cat === "Todos" ? "Todos los Combos" : cat}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}



          {/* Support help card in sidebar */}
          <div className="sidebar-card support-card" style={{ background: 'linear-gradient(135deg, #103d2e 0%, #082018 100%)', color: 'white', padding: '1.2rem', borderRadius: '12px' }}>
            <h5 style={{ margin: 0, color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.9rem' }}>¿Necesitas Ayuda?</h5>
            <p style={{ margin: '6px 0 12px', fontSize: '0.75rem', opacity: 0.9, lineHeight: '1.4' }}>Chatea en vivo con nuestros asesores de salud por WhatsApp.</p>
            <a 
              href={`https://wa.me/${config.whatsappNumber || '59163488086'}?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20suplementos.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="sidebar-support-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--accent-gold)', color: 'var(--primary-green)', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-2.735c1.634.97 3.25 1.487 4.827 1.489 5.5.004 9.978-4.474 9.982-9.98.002-2.668-1.03-5.176-2.905-7.054C16.678 3.84 14.183 2.809 11.517 2.809c-5.503 0-9.98 4.478-9.985 9.984-.002 1.704.453 3.37 1.32 4.823L1.835 21.36l3.963-1.04.148.087-.299.16z"></path>
              </svg>
              Contactar Asesor
            </a>
          </div>

          {/* Redes Sociales en Sidebar */}
          <div className="sidebar-card social-sidebar-card" style={{ padding: '1.1rem', border: '1px solid rgba(15, 61, 46, 0.08)', borderRadius: '12px', background: 'white' }}>
            <h5 style={{ margin: '0 0 10px 0', color: 'var(--primary-green)', fontWeight: 800, fontSize: '0.85rem' }}>Síguenos en Redes</h5>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a href="https://www.facebook.com/share/1DNC7YMQ81/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(15, 61, 46, 0.06)', color: 'var(--primary-green)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-green)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 61, 46, 0.06)'; e.currentTarget.style.color = 'var(--primary-green)'; }} title="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/kaldirev?igsh=czF1enQ0d2VxcGh5" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(15, 61, 46, 0.06)', color: 'var(--primary-green)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-green)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 61, 46, 0.06)'; e.currentTarget.style.color = 'var(--primary-green)'; }} title="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@kaldirev?_r=1&_t=ZS-98qrZwvHN6z" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(15, 61, 46, 0.06)', color: 'var(--primary-green)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-green)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15, 61, 46, 0.06)'; e.currentTarget.style.color = 'var(--primary-green)'; }} title="TikTok">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1.08-.21.17-.31.25-.02 3.86-.01 7.72-.02 11.58-.15 2.18-.84 4.39-2.42 5.92-1.74 1.78-4.32 2.58-6.77 2.23-2.61-.26-5.07-1.89-6.22-4.29-1.28-2.58-1.07-5.91.56-8.28 1.44-2.14 4.01-3.41 6.61-3.21v4.07c-1.39-.12-2.84.44-3.56 1.65-.77 1.2-.57 2.92.46 3.91.95.96 2.53 1.11 3.63.36.76-.49 1.19-1.39 1.21-2.3.03-3.69.01-7.39.02-11.08-.03-2.22.42-4.5 1.83-6.22C10.53 1.05 11.53.44 12.525.02z"/>
                </svg>
              </a>
            </div>
          </div>
        </aside>

        {/* MAIN STORE VIEWS CONTAINER */}
        <div className="store-views-container">
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
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)' }}>Despacho Express</h2>
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
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-green)' }}>Garantía 100% Sellado</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bolsas kraft termoselladas manuales con precinto de seguridad anti-manipulación.</p>
              </div>
            </div>

            <div className="promo-tile-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ background: 'rgba(124, 88, 26, 0.08)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c581a" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#7c581a' }}>Asesoría Directa</h2>
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
                          <div className="product-image-container" style={combo.bg_color ? { backgroundColor: combo.bg_color } : {}}>
                            {getComboImage(combo.id) ? (
                              isVideoUrl(getComboImage(combo.id)) ? (
                                <video src={resolveAssetUrl(getComboImage(combo.id))} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
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
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#7c581a', fontWeight: 700, marginBottom: '6px' }}>
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
                          <div className="product-image-container" style={product.bg_color ? { backgroundColor: product.bg_color } : {}}>
                            {(() => {
                              const mainImg = getProductImage(product.id);
                              if (mainImg) {
                                if (isVideoUrl(mainImg)) {
                                  return <video src={resolveAssetUrl(mainImg)} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
                                } else {
                                  return <img src={resolveAssetUrl(mainImg)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />;
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
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#7c581a', fontWeight: 700, marginBottom: '6px' }}>
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
                          <div className="product-image-container" style={combo.bg_color ? { backgroundColor: combo.bg_color } : {}}>
                            {getComboImage(combo.id) ? (
                              isVideoUrl(getComboImage(combo.id)) ? (
                                <video src={resolveAssetUrl(getComboImage(combo.id))} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={resolveAssetUrl(getComboImage(combo.id))} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
                              )
                            ) : combo.image_url ? (
                              isVideoUrl(combo.image_url) ? (
                                <video src={combo.image_url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <img src={combo.image_url} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
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
                            <span style={{ display: 'block', fontSize: '0.88rem', color: '#7c581a', fontWeight: 700, marginBottom: '6px' }}>
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

          {/* SECCIÓN DE REDES SOCIALES (SOCIAL MEDIA HUB) */}
          <section className="social-hub-section animate-fade-in" style={{ padding: '3.5rem 1.5rem', background: '#ffffff', borderRadius: '24px', margin: '2rem 1.5rem', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="eco-badge" style={{ background: 'var(--accent-gold-light)', color: '#7c581a', fontWeight: 'bold', fontSize: '0.85rem', padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Nuestra Comunidad
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.75rem', marginBottom: '0.5rem', color: 'var(--primary-green)', fontWeight: 800 }}>
                Kaldirev en Redes Sociales
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
                Sigue nuestras publicaciones diarias. Compartimos consejos de salud, unboxings de envíos y testimonios reales.
              </p>
            </div>

            {/* Filtros de Plataforma */}
            <div className="social-filters" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
              {['Todos', 'Instagram', 'TikTok', 'Facebook', 'YouTube'].map(filter => {
                let icon = null;
                if (filter === 'Instagram') {
                  icon = (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  );
                } else if (filter === 'TikTok') {
                  icon = (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1.08-.21.17-.31.25-.02 3.86-.01 7.72-.02 11.58-.15 2.18-.84 4.39-2.42 5.92-1.74 1.78-4.32 2.58-6.77 2.23-2.61-.26-5.07-1.89-6.22-4.29-1.28-2.58-1.07-5.91.56-8.28 1.44-2.14 4.01-3.41 6.61-3.21v4.07c-1.39-.12-2.84.44-3.56 1.65-.77 1.2-.57 2.92.46 3.91.95.96 2.53 1.11 3.63.36.76-.49 1.19-1.39 1.21-2.3.03-3.69.01-7.39.02-11.08-.03-2.22.42-4.5 1.83-6.22C10.53 1.05 11.53.44 12.525.02z"/>
                    </svg>
                  );
                } else if (filter === 'Facebook') {
                  icon = (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  );
                } else if (filter === 'YouTube') {
                  icon = (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  );
                }
                
                const isActive = activeSocialFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveSocialFilter(filter)}
                    className={`social-filter-btn ${isActive ? 'active' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.88rem',
                      fontWeight: 'bold',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--primary-green)' : '#e2e8f0',
                      background: isActive ? 'var(--primary-green)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {icon}
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Cuadrícula de Publicaciones */}
            <div className="social-posts-grid">
              {socialPosts
                .filter(post => activeSocialFilter === 'Todos' || post.platform.toLowerCase() === activeSocialFilter.toLowerCase())
                .map(post => {
                  let platformColor = '#a81747'; // Darker pink for Instagram text contrast
                  let badgeBgColor = '#fdf2f4';   // Solid background color with high contrast
                  let platformName = 'Instagram';
                  if (post.platform === 'tiktok') {
                    platformColor = '#1a1a1a';
                    badgeBgColor = '#f5f5f5';
                    platformName = 'TikTok';
                  }
                  if (post.platform === 'facebook') {
                    platformColor = '#0f60c4';
                    badgeBgColor = '#edf5ff';
                    platformName = 'Facebook';
                  }
                  if (post.platform === 'youtube') {
                    platformColor = '#c41c1c';
                    badgeBgColor = '#fff5f5';
                    platformName = 'YouTube';
                  }
                  
                  const embedUrl = getEmbedUrl(post.post_url, post.platform);
                  const useEmbed = post.use_native_embed !== false && (post.use_native_embed || !post.image_url || !post.image_url.startsWith('http'));

                  if (useEmbed && embedUrl) {
                    let iframeHeight = '480px';
                    if (post.platform === 'tiktok') iframeHeight = '580px';
                    if (post.platform === 'youtube') iframeHeight = '315px';
                    if (post.platform === 'facebook') iframeHeight = '500px';

                    return (
                      <div className="social-post-card native-embed-card animate-fade-in" key={post.id} style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height={iframeHeight}
                          style={{ border: '1px solid var(--border-color)', borderRadius: '16px', background: '#fff', overflow: 'hidden' }}
                          scrolling="no"
                          frameBorder="0"
                          allowFullScreen={true}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          title={`Social Embed ${post.id}`}
                        ></iframe>
                      </div>
                    );
                  }

                  return (
                    <div className="social-post-card animate-fade-in" key={post.id}>
                      <div className="post-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="post-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            K
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-green)' }}>kaldirev</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{post.date}</span>
                          </div>
                        </div>
                        <span className="post-platform-badge" style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', backgroundColor: badgeBgColor, color: platformColor }}>
                          {platformName}
                        </span>
                      </div>
                      
                      <div className="post-image-container">
                        <img src={post.image_url} alt={post.caption} className="post-img" loading="lazy" />
                        <div className="post-overlay">
                          <div style={{ display: 'flex', gap: '20px', color: 'white', fontWeight: 'bold', marginBottom: '15px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                              {post.likes || 0}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                              </svg>
                              {post.comments || 0}
                            </span>
                          </div>
                          <a 
                            href={post.post_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="post-action-btn"
                            aria-label={`Ver publicación de ${platformName} del ${post.date}`}
                          >
                            Ver en {platformName}
                          </a>
                        </div>
                      </div>
                      
                      <div className="post-caption-container">
                        <p className="post-caption">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* CTA para Seguir en todas */}
            <div style={{ textAlign: 'center', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <p style={{ color: 'var(--text-dark)', fontWeight: 'bold', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                ¡Forma parte de nuestra comunidad activa!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com/kaldirev?igsh=czF1enQ0d2VxcGh5" target="_blank" rel="noopener noreferrer" className="btn-share" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  📸 Instagram
                </a>
                <a href="https://www.tiktok.com/@kaldirev?_r=1&_t=ZS-98qrZwvHN6z" target="_blank" rel="noopener noreferrer" className="btn-share" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  🎵 TikTok
                </a>
                <a href="https://www.facebook.com/share/1DNC7YMQ81/" target="_blank" rel="noopener noreferrer" className="btn-share" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.65rem 1.25rem', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  👥 Facebook
                </a>
              </div>
            </div>
          </section>

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
              const urls = [...new Set(selectedCombo.image_url.split(',').map(u => u.trim()).filter(Boolean))];
              urls.forEach(url => {
                mediaList.push({ type: isVideoUrl(url) ? 'video' : 'image', url });
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
                        <div key={index} className="details-main-media-box" style={{ overflow: 'hidden', borderRadius: '12px', background: selectedCombo.bg_color || '#faf9f6', border: '1px solid var(--border-color)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={resolveAssetUrl(media.url)} alt={selectedCombo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
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
                      {(Array.isArray(selectedCombo.bullets) 
                        ? selectedCombo.bullets 
                        : typeof selectedCombo.bullets === 'string' 
                          ? selectedCombo.bullets.split('\n').filter(b => b.trim() !== '')
                          : []
                      ).map((bullet, idx) => (
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

                  {/* ATP / Energía Celular */}
                  {selectedCombo.atp_benefit && (
                    <div className="atp-benefit-card" style={{
                      background: '#f4fbf7',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{
                        background: '#e2ebd5',
                        color: 'var(--primary-green)',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--primary-green)', fontWeight: '800' }}>Energía y Resistencia Celular (ATP)</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: '1.4' }}>{selectedCombo.atp_benefit}</p>
                      </div>
                    </div>
                  )}

                  {/* Modo de Uso / Dosis sugerida */}
                  {(selectedCombo.preparation_mode || selectedCombo.dosage) && (
                    <div>
                      <h4 className="details-box-title">Modo de Uso y Preparación</h4>
                      <div className="details-box dosage-box" style={{ padding: '1rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ color: 'var(--primary-green)', marginTop: '2px', flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                          </svg>
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.4', color: 'var(--text-dark)' }}>
                          {selectedCombo.preparation_mode || selectedCombo.dosage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Advertencias de Salud e Ingesta */}
                  {(selectedCombo.allergen_info || selectedCombo.precautions) && (
                    <div className="health-warnings-card" style={{
                      background: '#fff9db',
                      border: '1px solid #ebdcc9',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ color: '#7c581a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <h5 style={{ margin: 0, fontSize: '0.92rem', color: '#8a6d3b', fontWeight: '800' }}>Información de Alérgenos y Precauciones</h5>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#7a5f30', lineHeight: '1.4' }}>
                        {selectedCombo.allergen_info && (
                          <div>
                            <strong>Alérgenos:</strong> {selectedCombo.allergen_info}
                          </div>
                        )}
                        {selectedCombo.precautions && (
                          <div>
                            <strong>Precauciones:</strong> {selectedCombo.precautions}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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


      {/* ==================== VIEW 4: DEDICATED ORDERS & PROFILE DASHBOARD PAGE ==================== */}
      {view === "pedidos" && (() => {
        return (
          <main className="orders-page-wrapper animate-fade-in" style={{ minHeight: '70vh' }}>
            {/* Page Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                Logística y Envíos Bolivia
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-green)', fontWeight: 900, marginTop: '8px', marginBottom: '8px' }}>
                Portal de Rastreo de Pedidos
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                Consulta el estado de despacho de tus suplementos Tiens en tiempo real.
              </p>
            </div>

            <div className="premium-dashboard-grid">
              
              {/* MAIN CONTAINER: ORDERS / SEARCH RESULT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                
                {/* 1. PUBLIC TRACKING SEARCH BAR (Always accessible if logged out, or as tool if logged in) */}
                {(!user || publicOrderResult || publicSearchError) && (
                  <div className="premium-panel-card" style={{ padding: '1.75rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-green)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      Rastrear un Pedido Específico
                    </h2>
                    <p style={{ margin: '4px 0 1.25rem 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Ingresa el código de compra que recibiste por WhatsApp o correo para ver su despacho.
                    </p>

                    <form onSubmit={handlePublicSearchOrder} style={{ display: 'flex', gap: '10px' }}>
                      <div className="premium-input-wrapper" style={{ flexGrow: 1 }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: #KLR-A1B2C3D4 o el ID de tu pedido"
                          value={publicSearchId}
                          onChange={(e) => setPublicSearchId(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border-color)' }}
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="btn-dash-save"
                        disabled={publicSearchLoading}
                        style={{ padding: '0 1.5rem', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                      >
                        {publicSearchLoading ? (
                          <div style={{ border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}></div>
                        ) : 'Buscar'}
                      </button>
                    </form>

                    {publicSearchError && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⚠️ {publicSearchError}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PUBLIC SEARCH RESULT */}
                {publicOrderResult && (
                  <div className="premium-panel-card" style={{ border: '1.5px solid var(--primary-green)', background: '#fafcfa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-green)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Resultado de Búsqueda
                        </span>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-green)' }}>
                          Pedido #KLR-{publicOrderResult.id.substring(0,8).toUpperCase()}
                        </h2>
                      </div>
                      <button 
                        onClick={() => { setPublicOrderResult(null); setPublicSearchId(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Limpiar Búsqueda
                      </button>
                    </div>

                    {/* Render order card detail */}
                    {renderSingleOrderDetails(publicOrderResult)}
                  </div>
                )}

                {/* 3. LOGGED-IN USERS ORDER LIST */}
                {user && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary-green)' }}>Historial de tus Compras</h2>
                    </div>

                    {userOrdersLoading ? (
                      <div className="premium-panel-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid var(--accent-gold)', borderRadius: '50%', width: '36px', height: '36px', animation: 'spin 1s linear infinite', margin: '0 auto 15px auto' }}></div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Descargando tu historial de compras de forma segura...</p>
                      </div>
                    ) : userOrders.length === 0 ? (
                      <div className="premium-panel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                        <div style={{ color: 'var(--accent-gold)', opacity: 0.15, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                          <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-green)', marginBottom: '8px' }}>Aún no tienes pedidos registrados</h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>Explora nuestros combos de suplementos naturales en oferta y haz tu primer pedido por WhatsApp hoy.</p>
                        <button 
                          type="button" 
                          onClick={() => setView("catalog")}
                          className="btn-add-cart"
                          style={{ padding: '12px 24px', width: 'auto', background: 'var(--primary-green)', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Explorar Catálogo de Combos
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {userOrders.map(order => (
                          <div key={order.id} className="premium-panel-card" style={{ padding: '1.5rem' }}>
                            {renderSingleOrderDetails(order)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SIDEBAR COLUMNS: GREETINGS & INFORMATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* User Info card (Logged in) */}
                {user ? (
                  <div className="premium-panel-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 12px auto', border: '3px solid var(--accent-gold)', overflow: 'hidden', background: '#f4f6f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(profile?.avatar_url || user?.user_metadata?.avatar_url) ? (
                        <img 
                          src={resolveAssetUrl(profile?.avatar_url || user?.user_metadata?.avatar_url)} 
                          alt="Avatar" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                          {(profile?.full_name || user?.user_metadata?.full_name || user?.email || "U")[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-green)', fontWeight: 900 }}>
                      {profile?.full_name || user?.user_metadata?.full_name || "Cliente Kaldirev"}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</span>
                    
                    <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', margin: '4px 0' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Membresía:</span>
                        <strong style={{ color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          Cliente Gold
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', margin: '4px 0' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Pedidos hechos:</span>
                        <strong>{userOrders.length} compras</strong>
                      </div>
                      {profile?.city && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', margin: '4px 0' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Ciudad:</span>
                          <strong>{profile.city}</strong>
                        </div>
                      )}
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setView("perfil")}
                      className="btn-share"
                      style={{ width: '100%', padding: '8px', fontSize: '0.8rem', background: '#fff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      Editar mis Datos
                    </button>
                  </div>
                ) : (
                  /* Welcome Info Card (Logged out) */
                  <div className="premium-panel-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--primary-green)', fontWeight: 800 }}>
                      ¿Quieres guardar tu historial?
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: '1.45', marginBottom: '1.25rem' }}>
                      Regístrate gratis con tu correo o cuenta de Google para guardar tus direcciones de entrega por defecto y rastrear tus pedidos sin tener que ingresar códigos.
                    </p>
                    <button 
                      type="button" 
                      onClick={() => setView("perfil")}
                      className="btn-add-cart"
                      style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                    >
                      Crear Cuenta / Ingresar
                    </button>
                  </div>
                )}

                {/* Live Support Card */}
                <div className="premium-panel-card" style={{ padding: '1.5rem', background: '#f6fdf9', border: '1px solid #d1fae5' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#065f46', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></span>
                    Asistencia Logística
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857', lineHeight: '1.4', marginBottom: '1rem' }}>
                    ¿Tienes dudas sobre el horario de entrega o el delivery? Chatea directamente con el operador de despacho de Kaldirev Bolivia.
                  </p>
                  <a 
                    href={`https://wa.me/${config.whatsappNumber || '59163488086'}?text=Hola,%20necesito%20ayuda%20con%20el%20despacho%20de%20un%20pedido.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-submit"
                    style={{ background: '#25d366', color: '#fff', fontSize: '0.82rem', padding: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Contactar Soporte
                  </a>
                </div>
              </div>

            </div>
          </main>
        );
      })()}

      {/* ==================== VIEW 5: DEDICATED CORPORATE NOSOTROS PAGE ==================== */}
      {view === "nosotros" && (
        <main className="nosotros-page-wrapper animate-fade-in" style={{ minHeight: '70vh' }}>
          
          {/* About Us Hero Cover */}
          <div className="about-hero-section">
            <span style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M2 22C2 22 6 12 12 12C12 12 16 16 22 2C22 2 12 6 12 12C12 12 8 16 2 22Z"></path></svg>
              Transparencia y Propósito
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '10px', marginBottom: '10px' }}>
              Sobre Nosotros
            </h2>
            <p style={{ margin: '0 auto', maxWidth: '650px', fontSize: '0.98rem', opacity: 0.9, lineHeight: '1.5' }}>
              Profesionalizando la distribución logística y el e-commerce de bienestar en Bolivia con sellos de seguridad y empaques ecológicos.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', background: '#f4f6f0', borderRadius: '14px', padding: '6px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '6px' }}>
            <button 
              type="button" 
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: infoActiveTab === 'mision' ? 'var(--primary-green)' : 'transparent', fontSize: '0.9rem', fontWeight: 700, color: infoActiveTab === 'mision' ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={() => setInfoActiveTab('mision')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              Nuestra Esencia
            </button>
            <button 
              type="button" 
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: infoActiveTab === 'ecologia' ? 'var(--primary-green)' : 'transparent', fontSize: '0.9rem', fontWeight: 700, color: infoActiveTab === 'ecologia' ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={() => setInfoActiveTab('ecologia')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              Compromiso Ecológico
            </button>
            <button 
              type="button" 
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: infoActiveTab === 'legal' ? 'var(--primary-green)' : 'transparent', fontSize: '0.9rem', fontWeight: 700, color: infoActiveTab === 'legal' ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={() => setInfoActiveTab('legal')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 22V2M12 5h8M12 19H4M12 12h10M12 12H2"></path></svg>
              Deslinde y Cumplimiento
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="premium-panel-card" style={{ padding: '2rem' }}>
            
            {infoActiveTab === 'mision' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ background: '#fafcfa', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--primary-green)', border: '1px solid var(--border-color)', borderLeftWidth: '5px' }}>
                    <h2 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Nuestra Misión</h2>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                      Proveer un canal logístico y digital estandarizado que modernice la distribución de suplementos de bienestar en Bolivia, garantizando a los consumidores entregas higiénicas, empaques responsables y total claridad comercial.
                    </p>
                  </div>

                  <div style={{ background: '#fafcfa', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-gold)', border: '1px solid var(--border-color)', borderLeftWidth: '5px' }}>
                    <h2 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0' }}>Nuestra Visión</h2>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                      Consolidarse como la plataforma de intermediación digital de suplementos independientes más confiable de Bolivia, destacando por nuestro rigor en la manipulación y la transparencia de cara al cliente final.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 style={{ color: 'var(--primary-green)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
                    Nuestros Valores Fundamentales
                  </h2>
                  <div className="about-grid-cards">
                    <div className="about-value-card">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      <strong style={{ display: 'block', color: 'var(--primary-green)', fontSize: '0.9rem', marginBottom: '4px' }}>Rigor y Ética</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Respetamos estrictamente los derechos de marcas registradas y promovemos una venta clara sin diagnósticos falsos.</span>
                    </div>
                    <div className="about-value-card">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><path d="M2 22C2 22 6 12 12 12C12 12 16 16 22 2C22 2 12 6 12 12C12 12 8 16 2 22Z"></path></svg>
                      <strong style={{ display: 'block', color: 'var(--primary-green)', fontSize: '0.9rem', marginBottom: '4px' }}>Responsabilidad Verde</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Reducimos el uso de plásticos utilizando cajas reciclables y papel kraft de relleno en todas nuestras entregas.</span>
                    </div>
                    <div className="about-value-card">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      <strong style={{ display: 'block', color: 'var(--primary-green)', fontSize: '0.9rem', marginBottom: '4px' }}>Eficiencia Digital</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>Facilitamos tu compra mediante integraciones de pago QR inmediato de transferencia bancaria y chat en un clic.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {infoActiveTab === 'ecologia' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
                    Eco-Logística Bolivia
                  </span>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-green)', fontWeight: 800, marginTop: '8px', marginBottom: '10px' }}>
                    Empaques Biodegradables y Seguros
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5', marginBottom: '12px' }}>
                    En <strong>Kaldirev</strong> creemos que cuidar tu salud interna no debe significar dañar nuestro entorno externo. Por eso, hemos diseñado un protocolo de despacho libre de envoltorios plásticos contaminantes.
                  </p>
                  <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ color: 'var(--primary-green)' }}>•</span> Cajas de cartón corrugado 100% reciclables y reutilizables.</li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ color: 'var(--primary-green)' }}>•</span> Cinta adhesiva de papel activada por agua (biodegradable).</li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ color: 'var(--primary-green)' }}>•</span> Etiquetas impresas en papel reciclado con tinta ecológica.</li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}><span style={{ color: 'var(--primary-green)' }}>•</span> Sellos de seguridad inviolables que garantizan que tu producto viene directo de origen.</li>
                  </ul>
                </div>
                <div style={{ background: '#faf9f6', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--accent-gold)', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', background: 'var(--primary-light)', color: 'var(--primary-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  </div>
                  <strong style={{ color: 'var(--primary-green)', display: 'block', fontSize: '0.95rem', marginBottom: '6px' }}>Nuestro Compromiso Local</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', margin: 0, lineHeight: '1.4' }}>
                    Coordinamos rutas de despacho optimizadas con mensajería local para reducir la huella de carbono de cada envío dentro de Santa Cruz, La Paz y Cochabamba.
                  </p>
                </div>
              </div>
            )}

            {infoActiveTab === 'legal' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.88rem', textAlign: 'left' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <h2 style={{ color: '#d93025', fontSize: '1rem', margin: '0 0 6px 0', fontWeight: 800 }}>
                    AVISO DE AUTONOMÍA Y COMPLIANCE
                  </h2>
                  <p style={{ margin: 0, color: 'var(--text-dark)', lineHeight: '1.45' }}>
                    <strong>Kaldirev</strong> es una red digital y logística independiente de distribución comercial. No formamos parte corporativa, ni somos representantes legales, filiales, ni sucursales directas de la corporación multinacional <strong>Tiens (Tianshi)</strong>. Adquirimos de manera legítima los productos originales para su venta e intermediación minorista en Bolivia.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-green)' }}>Trademarks de Terceros</h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Todas las marcas y logotipos como Tiens, BCP, Yape, PedidosYa, inDrive, etc., pertenecen de forma exclusiva a sus respectivos titulares legales. Su mención es meramente logística y referencial para el consumidor.
                    </p>
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-green)' }}>Deslinde Sanitario</h5>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Los suplementos alimenticios Tiens son productos preventivos y coadyuvantes de bienestar. No son medicamentos, ni pretenden reemplazar terapias o prescripciones médicas autorizadas por profesionales de salud.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 14px', borderRadius: '12px', color: '#c2410c', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  <strong>Aviso Importante:</strong> Kaldirev prohíbe explícitamente a sus asesores y distribuidores formular diagnósticos médicos, prescribir tratamientos curativos definitivos, o alterar las dosificaciones oficiales establecidas por los registros sanitarios correspondientes (SENASAG / UNIMED).
                </div>
              </div>
            )}

          </div>
        </main>
      )}

      {/* ==================== VIEW 6: DEDICATED PROFILE PAGE ==================== */}
      {view === "perfil" && (
        <main className="perfil-page-wrapper animate-fade-in" style={{ minHeight: '70vh' }}>
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', padding: '6px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Mi Cuenta Cliente
            </span>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-green)', fontWeight: 900, marginTop: '8px', marginBottom: '8px' }}>
              {user ? "Panel de Control de Cliente" : "Mi Cuenta Kaldirev"}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              {user ? "Administra tus direcciones y haz seguimiento de tus compras de bienestar." : "Guarda tus direcciones de entrega por defecto y haz seguimiento de tus pedidos en Bolivia."}
            </p>
          </div>

          {!user ? (
            /* ==================== LOGIN VIEW ==================== */
            <div className="premium-panel-card" style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}>
              {/* Logo / Badge */}
              <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 4px 12px rgba(15, 61, 46, 0.08)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M2 22C2 22 6 12 12 12C12 12 16 16 22 2C22 2 12 6 12 12C12 12 8 16 2 22Z"></path></svg>
              </div>
              
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-green)', fontWeight: 900, marginBottom: '6px' }}>
                Acceder a mi Cuenta
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: '1.45' }}>
                Ingresa con tu método preferido de forma rápida y segura.
              </p>

              {authError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '1.25rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚠️ {authError}
                </div>
              )}

              {/* Google Sign In */}
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="btn-google-login"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.25s', fontSize: '0.92rem', color: 'var(--text-dark)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfa'; e.currentTarget.style.borderColor = 'var(--primary-green)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Acceder con Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#bbb' }}>
                <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ padding: '0 12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>o ingresa con tu correo</span>
                <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="premium-input-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="correo@ejemplo.com"
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)} 
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Contraseña</label>
                  <input 
                    type="password" 
                    required 
                    className="form-input" 
                    placeholder="••••••••" 
                    value={authPassword} 
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-dash-save animate-pulse-slow" 
                  style={{ width: '100%', padding: '12px', height: '46px', border: 'none', background: 'var(--primary-green)', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <div style={{ border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }}></div>
                  ) : "Iniciar Sesión"}
                </button>
              </form>

              {/* Login Benefits list */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'left' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary-green)', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  Beneficios de tener cuenta:
                </strong>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent-gold)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    Compra rápida en 1-clic (dirección precargada).
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--primary-green)' }}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    Historial y rastreo de envíos en tiempo real.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent-gold)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Acceso a ofertas y cupones exclusivos.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* ==================== USER DASHBOARD VIEW ==================== */
            <div className="premium-dashboard-grid animate-fade-in">
              
              {/* SIDEBAR: USER ACCOUNT OVERVIEW */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Profile Card */}
                <div className="premium-panel-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px auto', border: '3px solid var(--accent-gold)', overflow: 'hidden', background: '#f4f6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                        {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-green)', fontWeight: 900 }}>
                    {profile?.full_name || "Cliente"}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    {user.email}
                  </span>
                  
                  <span style={{ background: '#fff9db', color: '#7c581a', border: '1px solid #ebdcc9', fontSize: '0.72rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    Cliente Prime Gold
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setView("catalog")}
                      className="btn-share"
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      Ir a la Tienda
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setView("pedidos")}
                      className="btn-share"
                      style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                      Rastrear Envíos
                    </button>
                  </div>
                </div>

                {/* Logout Card */}
                <button 
                  type="button" 
                  style={{ width: '100%', padding: '12px', background: 'none', border: '2px solid #ff4d4d', color: '#ff4d4d', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fff55'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  Cerrar Sesión
                </button>
              </div>

              {/* MAIN CONTENT: SHIPPINGS PRESETS FORM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Stats Overview Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  <div className="profile-stat-box">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Pedidos</span>
                    <strong style={{ fontSize: '1.6rem', color: 'var(--primary-green)', fontWeight: 900 }}>{userOrders.length}</strong>
                  </div>
                  <div className="profile-stat-box">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Ciudad Local</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary-green)', fontWeight: 900, display: 'block', marginTop: '6px' }}>{formData.city}</strong>
                  </div>
                  <div className="profile-stat-box">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Nivel Fidelidad</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', fontWeight: 900, display: 'block', marginTop: '6px' }}>Gold VIP</strong>
                  </div>
                </div>

                {/* Form Details Card */}
                <div className="premium-panel-card" style={{ padding: '2rem' }}>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--primary-green)', fontWeight: 800 }}>
                    Datos de Despacho Predeterminados
                  </h2>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Configura tus datos para que el sistema rellene tu formulario de compras automáticamente al hacer un pedido.
                  </p>

                  <form className="premium-input-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 'bold' }}>Nombre de Contacto</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Tu nombre completo"
                          value={formData.name} 
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 'bold' }}>Celular / WhatsApp</label>
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="Ej: 78945612"
                          value={formData.phone} 
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 'bold' }}>Ciudad Sucursal</label>
                        <select 
                          className="form-select" 
                          value={formData.city} 
                          onChange={(e) => handleCityChange(e.target.value)}
                          style={{ width: '100%', height: '46px' }}
                        >
                          {branches.map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 'bold' }}>Dirección de Entrega</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Calle, número de casa, barrio o referencias"
                          value={formData.address} 
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <button 
                      type="button" 
                      className="btn-dash-save animate-pulse-slow" 
                      style={{ width: '100%', padding: '12px', height: '46px', border: 'none', background: 'var(--primary-green)', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.25s', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                      Guardar Cambios de Entrega
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </main>
      )}
      </div>
      </div>

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

            {/* Redes Sociales en Footer */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
              <a href="https://www.facebook.com/share/1DNC7YMQ81/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(235,220,201,0.15)', color: 'var(--accent-gold)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--primary-green)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(235,220,201,0.15)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} title="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/kaldirev?igsh=czF1enQ0d2VxcGh5" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(235,220,201,0.15)', color: 'var(--accent-gold)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--primary-green)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(235,220,201,0.15)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} title="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@kaldirev?_r=1&_t=ZS-98qrZwvHN6z" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(235,220,201,0.15)', color: 'var(--accent-gold)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--primary-green)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(235,220,201,0.15)'; e.currentTarget.style.color = 'var(--accent-gold)'; }} title="TikTok">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1.08-.21.17-.31.25-.02 3.86-.01 7.72-.02 11.58-.15 2.18-.84 4.39-2.42 5.92-1.74 1.78-4.32 2.58-6.77 2.23-2.61-.26-5.07-1.89-6.22-4.29-1.28-2.58-1.07-5.91.56-8.28 1.44-2.14 4.01-3.41 6.61-3.21v4.07c-1.39-.12-2.84.44-3.56 1.65-.77 1.2-.57 2.92.46 3.91.95.96 2.53 1.11 3.63.36.76-.49 1.19-1.39 1.21-2.3.03-3.69.01-7.39.02-11.08-.03-2.22.42-4.5 1.83-6.22C10.53 1.05 11.53.44 12.525.02z"/>
                </svg>
              </a>
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
            <strong>{socialProofOrder.name}</strong> ({socialProofOrder.city}) compró <strong style={{ color: 'var(--primary-green)' }}>{socialProofOrder.item}</strong> • <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{socialProofOrder.time}</span>
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
