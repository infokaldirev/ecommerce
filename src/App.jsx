import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Fallback Combos Data in Bolivianos
const DEFAULT_COMBOS = [
  {
    id: 1,
    name: "Kit Energía Diaria",
    category: "Energía",
    price_bs: 55,
    original_price_bs: 75,
    usd_price: 55,
    original_usd_price: 75,
    includes: "2 Cordycafe + 3 Té Tianshi",
    bullets: [
      "Aumenta la vitalidad y concentración mental",
      "Combate el sueño y cansancio crónico",
      "Ideal para deportistas y jornadas largas de trabajo"
    ],
    dosage: "Disolver 1 sobre de Cordycafe en una taza de agua caliente por la mañana y tomar 1 taza de Té Tianshi a media tarde.",
    package_detail: "Empacado en bolsa doypack kraft original sellada térmicamente con sello de seguridad Kaldirev.",
    badge: "Más Vendido",
    tagline: "Energía y enfoque natural al instante",
    pinned: true
  }
];

function App() {
  // Database states
  const [combos, setCombos] = useState([]);
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // UI Interactive states
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showAdminSaveToast, setShowAdminSaveToast] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState("config"); // "config", "orders", "extras"
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // Orders history (fetched for Admin only)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState("Todos");

  // Admin Passcode Lock state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Admin forms state
  const [editingCombo, setEditingCombo] = useState(null); // for editing/creating combos
  const [formStep, setFormStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [comboStocks, setComboStocks] = useState([]);
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
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch public profile from Supabase
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
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
      if (!error) {
        fetchUserProfile(user.id);
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

  // Helper to get stock of a combo in the selected sucursal/branch
  const getComboStockForSelectedBranch = (comboId) => {
    if (!selectedBranch) return 0;
    const stockObj = comboStocks.find(s => s.combo_id === comboId && s.branch_id === selectedBranch.id);
    return stockObj ? stockObj.stock : 0;
  };

  // Helper to get total stock of a combo across all Bolivian sucursales
  const getComboTotalStock = (comboId) => {
    return comboStocks
      .filter(s => s.combo_id === comboId)
      .reduce((acc, curr) => acc + curr.stock, 0);
  };

  // Helper to check if any item in cart is low stock or out of stock in selected branch
  const getOutOfStockItemsForCity = (cityName) => {
    if (!cityName) return [];
    const matchingBranch = branches.find(b => b.name.toLowerCase().includes(cityName.toLowerCase()));
    if (!matchingBranch) return [];
    return cart.filter(item => {
      const stockObj = comboStocks.find(s => s.combo_id === item.id && s.branch_id === matchingBranch.id);
      const stock = stockObj ? stockObj.stock : 0;
      return stock < item.quantity;
    });
  };

  // Google Sign-In helper
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      alert("Error al iniciar sesión con Google: " + err.message);
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
      
      if (settingsData) {
        settingsData.forEach(item => {
          if (item.key === 'exchange_rate') currentRate = parseFloat(item.value);
          if (item.key === 'whatsapp_number') currentPhone = item.value;
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

      // 3. Fetch combos
      const { data: combosData, error: combosErr } = await supabase
        .from('combos')
        .select('*')
        .order('id', { ascending: true });
      if (combosErr) throw combosErr;
      
      const mappedData = (combosData || []).map(c => ({
        ...c,
        price_bs: parseFloat(c.price_bs || c.usd_price) || 0,
        original_price_bs: parseFloat(c.original_price_bs || c.original_usd_price) || 0
      }));
      const finalCombos = mappedData.length > 0 ? mappedData : DEFAULT_COMBOS;
      setCombos(finalCombos);

      // 4. Fetch combo stocks
      const { data: stocksData } = await supabase.from('combo_stock').select('*');
      if (!stocksData || stocksData.length === 0) {
        // Create fallback mock stocks
        const fallbackStocks = [];
        finalCombos.forEach(c => {
          branchesList.forEach(b => {
            let stock = 10;
            if (b.name.includes("Santa Cruz")) stock = c.id === 1 ? 35 : (c.id === 2 ? 20 : 15);
            if (b.name.includes("La Paz")) stock = c.id === 1 ? 18 : (c.id === 2 ? 8 : 12);
            if (b.name.includes("Cochabamba")) stock = c.id === 1 ? 10 : (c.id === 2 ? 5 : 12);
            fallbackStocks.push({ combo_id: c.id, branch_id: b.id, stock });
          });
        });
        setComboStocks(fallbackStocks);
      } else {
        setComboStocks(stocksData);
      }

      // 5. Fetch testimonials
      const { data: testData } = await supabase
        .from('testimonials')
        .select('*')
        .order('id', { ascending: true });
      setTestimonials(testData || []);

      // 6. Fetch FAQs
      const { data: faqsData } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      setFaqs(faqsData || []);

    } catch (err) {
      console.error("Error loading Kaldirev database:", err);
      setErrorMsg("No se pudieron cargar los datos de la base de datos. Mostrando datos locales de respaldo.");
      setCombos(DEFAULT_COMBOS);
      
      const fallbackBranches = [
        { id: 1, name: "Santa Cruz", address: "Av. San Martín, Equipetrol, Santa Cruz", shipping_cost_bs: 12 },
        { id: 2, name: "La Paz", address: "Av. 16 de Julio, El Prado, La Paz", shipping_cost_bs: 15 },
        { id: 3, name: "Cochabamba", address: "Calle España, Zona Central, Cochabamba", shipping_cost_bs: 15 }
      ];
      setBranches(fallbackBranches);
      setSelectedBranch(fallbackBranches[0]);
      
      const fallbackStocks = [];
      DEFAULT_COMBOS.forEach(c => {
        fallbackBranches.forEach(b => {
          let stock = 10;
          if (b.name.includes("Santa Cruz")) stock = c.id === 1 ? 35 : (c.id === 2 ? 20 : 15);
          if (b.name.includes("La Paz")) stock = c.id === 1 ? 18 : (c.id === 2 ? 8 : 12);
          if (b.name.includes("Cochabamba")) stock = c.id === 1 ? 10 : (c.id === 2 ? 5 : 12);
          fallbackStocks.push({ combo_id: c.id, branch_id: b.id, stock });
        });
      });
      setComboStocks(fallbackStocks);
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

  useEffect(() => {
    fetchStoreData();
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
  const addToCart = (combo) => {
    const computedPrice = parseFloat(combo.price_bs);
    const computedOriginalPrice = parseFloat(combo.original_price_bs);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === combo.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { 
        ...combo, 
        price: computedPrice, 
        originalPrice: computedOriginalPrice, 
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
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

  // Save General settings to Supabase
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const updatedRate = parseFloat(adminFormData.exchangeRate) || 6.96;
      const updatedPhone = adminFormData.whatsappNumber.replace(/\D/g, '');

      const { error: err1 } = await supabase
        .from('settings')
        .upsert({ key: 'exchange_rate', value: updatedRate.toString() });

      const { error: err2 } = await supabase
        .from('settings')
        .upsert({ key: 'whatsapp_number', value: updatedPhone });

      if (err1 || err2) throw (err1 || err2);

      setConfig({
        exchangeRate: updatedRate,
        whatsappNumber: updatedPhone
      });

      setShowAdminSaveToast(true);
      setTimeout(() => setShowAdminSaveToast(false), 2000);
    } catch (err) {
      alert("Error al guardar la configuración: " + err.message);
    }
  };

  // Upload image to Cloudinary (Unsigned upload)
  const handleCloudinaryUpload = async (e) => {
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
        setEditingCombo(prev => ({
          ...prev,
          image_url: resJson.secure_url
        }));
      } else {
        alert("Fallo al subir la imagen. Por favor revise el Preset de Cloudinary.");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Error en la conexión con Cloudinary.");
    } finally {
      setUploadingImage(false);
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
        const { data: currentStockObj } = await supabase
          .from('combo_stock')
          .select('stock')
          .eq('combo_id', item.id)
          .eq('branch_id', branchId)
          .maybeSingle();

        if (currentStockObj) {
          const newStock = Math.max(0, currentStockObj.stock - item.quantity);
          await supabase
            .from('combo_stock')
            .update({ stock: newStock })
            .eq('combo_id', item.id)
            .eq('branch_id', branchId);
        } else {
          // Fallback local memory sync
          setComboStocks(prev => prev.map(s => {
            if (s.combo_id === item.id && s.branch_id === branchId) {
              return { ...s, stock: Math.max(0, s.stock - item.quantity) };
            }
            return s;
          }));
        }
      }
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
        const message = `¡Hola Kaldirev! Acabo de pagar mi pedido por la Pasarela QR de Libélula:

*Estado del Pago: [APROBADO & VERIFICADO AUTOMÁTICAMENTE]*
ID Pedido: ${qrModalOrder.id.substring(0, 8)}...

Detalle del Pedido:
${itemsText}

Subtotal: Bs. ${subtotal.toFixed(1)}
Costo de Envío (${qrModalOrder.delivery_method}): Bs. ${parseFloat(qrModalOrder.shipping_cost).toFixed(1)}
*Total Pagado: Bs. ${parseFloat(qrModalOrder.total_bs).toFixed(1)}*

Datos de Envío:
- Almacén de Despacho: ${branches.find(b => b.id === branchId)?.name || 'Santa Cruz'}
- Nombre: ${qrModalOrder.customer_name}
- Teléfono: ${qrModalOrder.phone}
- Dirección: ${qrModalOrder.address}
- Ciudad/Destino: ${qrModalOrder.city}
${qrModalOrder.gps_coordinates ? `- Coordenadas GPS: ${qrModalOrder.gps_coordinates}\n` : ''}- Método de Pago: Pasarela QR Libélula (Confirmado)

Presentación: Bolsa Kraft eco-amigable con termosellado manual de seguridad.`;

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

  // Save Order in Supabase & Redirect to WhatsApp
  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert("Por favor rellena todos los campos obligatorios.");
      return;
    }

    setIsSubmittingOrder(true);
    const subtotal = getCartTotal();
    const shipping = getShippingCost();
    const total = getFinalTotal();
    const selectedBranchId = selectedBranch ? selectedBranch.id : 1;

    try {
      const orderPayload = {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        payment_method: formData.paymentMethod,
        total_bs: parseFloat(total),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        user_id: user?.id || null,
        branch_id: selectedBranchId,
        shipping_cost: parseFloat(shipping),
        delivery_method: formData.deliveryMethod,
        gps_coordinates: formData.gpsCoordinates || null,
        qr_payment_status: formData.paymentMethod === 'QR Libelula' ? 'Pendiente' : 'No Aplica',
        tracking_id: null
      };

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select();

      if (orderErr) throw orderErr;

      const createdOrder = orderData ? orderData[0] : null;

      if (user) {
        saveUserProfile({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          full_name: formData.name
        });
      }

      // Dynamic Flow: QR Pasarela vs Standard Checkout
      if (formData.paymentMethod === 'QR Libelula') {
        if (createdOrder) {
          setQrModalOrder(createdOrder);
          setQrTimer(300);
          setIsQrModalOpen(true);
          setIsCartOpen(false);
        } else {
          throw new Error("No se pudo generar los detalles del pedido QR.");
        }
      } else {
        // Direct Checkout (Cash or Manual Transfer)
        // Deduct Stock immediately
        await deductStockObj(selectedBranchId, cart);

        const itemsText = cart.map(item => 
          `• *${item.quantity}x ${item.name}* - Bs. ${(item.price * item.quantity).toFixed(1)}`
        ).join("\n");

        const message = `¡Hola Kaldirev! Deseo realizar un pedido de combos:

Detalle del Pedido:
${itemsText}

Subtotal: Bs. ${subtotal.toFixed(1)}
Costo de Envío (${formData.deliveryMethod}): Bs. ${shipping.toFixed(1)}
*Total a Pagar: Bs. ${total.toFixed(1)}*

Datos para el Envío:
- Almacén de Despacho: ${selectedBranch ? selectedBranch.name : 'Santa Cruz'}
- Nombre: ${formData.name}
- Teléfono de contacto: ${formData.phone}
- Dirección de entrega: ${formData.address}
- Ciudad/Destino: ${formData.city}
${formData.gpsCoordinates ? `- Coordenadas GPS: ${formData.gpsCoordinates}\n` : ''}- Método de Pago: ${formData.paymentMethod}

Presentación de envío: Bolsa Kraft eco-amigable con termosellado manual de seguridad.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        setIsCartOpen(false);
        setCart([]);
        setIsCheckingOut(false);
        setShowSuccessModal(true);
      }

    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Hubo un problema al procesar su pedido en la base de datos. De todas formas lo coordinaremos por WhatsApp.");
      const itemsText = cart.map(item => `• *${item.quantity}x ${item.name}*`).join("\n");
      window.open(`https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodeURIComponent("Pedido alternativo: " + itemsText)}`, '_blank');
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
  const openComboDetails = (combo) => {
    setSelectedCombo(combo);
    setView("details");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeComboDetails = () => {
    setView("catalog");
    setSelectedCombo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categories and filtering
  const categories = ["Todos", "Energía", "Bienestar", "Saludable"];
  
  const filteredCombos = combos.filter(c => {
    const matchesCategory = activeCategory === "Todos" || c.category === activeCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.includes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.bullets.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pinnedCombos = filteredCombos.filter(c => c.pinned);
  const otherCombos = filteredCombos.filter(c => !c.pinned);

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
                className={`sidebar-nav-btn ${adminActiveTab === "config" ? "active" : ""}`}
                onClick={() => setAdminActiveTab("config")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Ajustes & Combos
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
                {adminActiveTab === "config" ? "Gestión de Ajustes & Catálogo" : adminActiveTab === "orders" ? "Logística e Historial de Pedidos" : adminActiveTab === "stocks" ? "Control de Almacenes & Multi-Stock" : "Administración de FAQs & Testimonios"}
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
            
            {/* TAB 1: ADJUSTMENTS & COMBOS */}
            {adminActiveTab === "config" && (
              <div className="animate-fade-in">
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

                    <div className="admin-combo-editor-layout" style={{ marginTop: '1rem' }}>                      <div className="dash-panel-card" style={{ padding: '2rem' }}>
                        {/* Wizard Steps Indicator */}
                        <div className="form-wizard-steps" style={{ display: 'flex', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                          <div className={`wizard-step ${formStep === 1 ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', borderRadius: '8px', background: formStep === 1 ? 'var(--primary-light)' : '#fbfaf8', color: formStep === 1 ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.8rem', border: formStep === 1 ? '1px solid var(--primary-green)' : '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}>
                            1. Básico
                          </div>
                          <div className={`wizard-step ${formStep === 2 ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', borderRadius: '8px', background: formStep === 2 ? 'var(--primary-light)' : '#fbfaf8', color: formStep === 2 ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.8rem', border: formStep === 2 ? '1px solid var(--primary-green)' : '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}>
                            2. Precio & Inclusión
                          </div>
                          <div className={`wizard-step ${formStep === 3 ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', borderRadius: '8px', background: formStep === 3 ? 'var(--primary-light)' : '#fbfaf8', color: formStep === 3 ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.8rem', border: formStep === 3 ? '1px solid var(--primary-green)' : '1px solid var(--border-color)', transition: 'var(--transition-smooth)' }}>
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
                                  <select 
                                    className="form-select"
                                    value={editingCombo.category}
                                    onChange={(e) => setEditingCombo({...editingCombo, category: e.target.value})}
                                  >
                                    <option value="Energía">Energía</option>
                                    <option value="Bienestar">Bienestar</option>
                                    <option value="Saludable">Saludable</option>
                                    <option value="Defensas">Defensas</option>
                                    <option value="Detox">Detox</option>
                                    <option value="Belleza">Belleza</option>
                                  </select>
                                </div>
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Eslogan de Venta (Tagline)</label>
                                <input 
                                  type="text" 
                                  className="form-input"
                                  placeholder="Ej. Energía y enfoque natural al instante"
                                  value={editingCombo.tagline || ""}
                                  onChange={(e) => setEditingCombo({...editingCombo, tagline: e.target.value})}
                                />
                              </div>

                              {/* Image Upload Area */}
                              <div className="form-group" style={{ background: '#faf9f6', padding: '1.25rem', borderRadius: '12px', border: '1px dashed var(--accent-gold)' }}>
                                <label className="form-label" style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>Imagen / Video Ilustrativo *</label>
                                {editingCombo.image_url && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', background: 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                    {isVideoUrl(editingCombo.image_url) ? (
                                      <video src={editingCombo.image_url} muted style={{ height: '55px', width: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                      <img src={editingCombo.image_url} alt="Cargada" style={{ height: '55px', objectFit: 'contain' }} />
                                    )}
                                    <button type="button" className="btn-qty" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setEditingCombo({...editingCombo, image_url: ''})}>Eliminar Foto/Video</button>
                                  </div>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*,video/*"
                                  className="form-input"
                                  style={{ padding: '0.4rem' }}
                                  onChange={handleCloudinaryUpload}
                                />
                                {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '4px', fontWeight: 'bold' }}>Subiendo archivo a Cloudinary...</span>}
                              </div>
                            </div>
                          )}

                          {/* STEP 2: PRICING & INCLUSIONS */}
                          {formStep === 2 && (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                  <label className="form-label" style={{ fontWeight: 800 }}>Precio de Venta (Bs.) *</label>
                                  <input 
                                    type="number" 
                                    required
                                    className="form-input"
                                    placeholder="Ej. 55"
                                    value={editingCombo.price_bs}
                                    onChange={(e) => setEditingCombo({...editingCombo, price_bs: e.target.value})}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label" style={{ fontWeight: 800 }}>Precio Regular / Tachado (Bs.) *</label>
                                  <input 
                                    type="number" 
                                    required
                                    className="form-input"
                                    placeholder="Ej. 75"
                                    value={editingCombo.original_price_bs}
                                    onChange={(e) => setEditingCombo({...editingCombo, original_price_bs: e.target.value})}
                                  />
                                </div>
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>¿Qué productos incluye el Kit? *</label>
                                <input 
                                  type="text" 
                                  required
                                  className="form-input"
                                  placeholder="Ej. 2 Cordycafe + 3 Té Tianshi"
                                  value={editingCombo.includes}
                                  onChange={(e) => setEditingCombo({...editingCombo, includes: e.target.value})}
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Detalles del Empaque *</label>
                                <input 
                                  type="text" 
                                  required
                                  className="form-input"
                                  placeholder="Ej. Bolsa doypack kraft original sellada con sello de seguridad Kaldirev"
                                  value={editingCombo.package_detail}
                                  onChange={(e) => setEditingCombo({...editingCombo, package_detail: e.target.value})}
                                />
                              </div>
                            </div>
                          )}

                          {/* STEP 3: BENEFITS & DOSAGE */}
                          {formStep === 3 && (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Beneficios del Kit (Uno por línea) *</label>
                                <textarea 
                                  className="form-input"
                                  rows="3"
                                  placeholder="Escribe cada beneficio en una línea diferente..."
                                  value={Array.isArray(editingCombo.bullets) ? editingCombo.bullets.join('\n') : editingCombo.bullets}
                                  onChange={(e) => setEditingCombo({...editingCombo, bullets: e.target.value})}
                                ></textarea>
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 800 }}>Modo de Consumo / Dosis *</label>
                                <textarea 
                                  className="form-input"
                                  rows="2"
                                  placeholder="Instrucciones de cómo consumirlo..."
                                  value={editingCombo.dosage}
                                  onChange={(e) => setEditingCombo({...editingCombo, dosage: e.target.value})}
                                ></textarea>
                              </div>

                              <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                  <label className="form-label" style={{ fontWeight: 800 }}>Etiqueta Especial</label>
                                  <input 
                                    type="text" 
                                    className="form-input"
                                    placeholder="Ej. Más Vendido, Recomendado"
                                    value={editingCombo.badge || ""}
                                    onChange={(e) => setEditingCombo({...editingCombo, badge: e.target.value})}
                                  />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%', marginTop: '1.8rem' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 700 }}>
                                    <input 
                                      type="checkbox"
                                      checked={!!editingCombo.pinned}
                                      onChange={(e) => setEditingCombo({...editingCombo, pinned: e.target.checked})}
                                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span>Destacar en Catálogo principal</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Navigation buttons */}
                          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                            {formStep > 1 && (
                              <button 
                                type="button" 
                                className="btn-share" 
                                style={{ padding: '0.85rem 1.5rem', fontWeight: 'bold' }} 
                                onClick={() => setFormStep(formStep - 1)}
                              >
                                ← Anterior
                              </button>
                            )}
                            
                            {formStep < 3 ? (
                              <button 
                                type="button" 
                                className="btn-dash-save" 
                                style={{ flexGrow: 1, padding: '0.85rem' }}
                                onClick={() => {
                                  if (formStep === 1 && (!editingCombo.name || !editingCombo.category)) {
                                    alert("Por favor rellena los campos obligatorios (*).");
                                    return;
                                  }
                                  setFormStep(formStep + 1);
                                }}
                              >
                                Siguiente Paso →
                              </button>
                            ) : (
                              <button type="submit" className="btn-dash-save" style={{ flexGrow: 1, padding: '0.85rem' }}>
                                Guardar Combo en Supabase
                              </button>
                            )}

                            <button type="button" className="btn-dash-cancel" style={{ padding: '0.85rem' }} onClick={() => setEditingCombo(null)}>
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>


                      {/* Right: Live Preview Panel */}
                      <div className="live-preview-card-pane">
                        <div style={{ position: 'sticky', top: '20px' }}>
                          <h4>Previsualización en la Tienda:</h4>
                          <div className="admin-live-preview-wrapper">
                            <article className="product-card pinned" style={{ background: 'white', pointerEvents: 'none' }}>
                              {editingCombo.pinned && (
                                <span className="pinned-badge">⭐ Destacado</span>
                              )}
                              {editingCombo.badge && <span className="card-badge">{editingCombo.badge}</span>}
                              <span className="card-packaging-badge">Termosellado</span>
                              
                              <div className="product-image-container" style={{ height: '170px' }}>
                                {editingCombo.image_url ? (
                                  isVideoUrl(editingCombo.image_url) ? (
                                    <video src={editingCombo.image_url} autoPlay loop muted playsInline style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                  ) : (
                                    <img src={editingCombo.image_url} alt="Vista" style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                  )
                                ) : (
                                  <div style={{ textAlign: 'center', color: '#ccc' }}>Carga foto / video</div>
                                )}
                              </div>

                              <div className="product-details" style={{ padding: '1.25rem' }}>
                                <span className="product-category">Tiens • {editingCombo.category}</span>
                                <h3 className="product-name" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '5px 0' }}>{editingCombo.name || "Nombre del Combo"}</h3>
                                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '8px' }}>
                                  {editingCombo.tagline || "Frase comercial llamativa"}
                                </span>
                                
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '5px 0 10px 0' }}>
                                  <strong>Incluye:</strong> {editingCombo.includes || "Lista de productos"}
                                </p>

                                <div className="product-price-row" style={{ borderTop: 'none', paddingTop: 0, margin: '10px 0 0 0' }}>
                                  {editingCombo.original_price_bs && <span className="price-original">Bs. {parseFloat(editingCombo.original_price_bs).toFixed(1)}</span>}
                                  <span className="price-current">Bs. {parseFloat(editingCombo.price_bs || 0).toFixed(1)}</span>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GENERAL CONFIGURATION & FULL-WIDTH PRODUCTS TABLE LIST */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Top Row: Stats & General Settings */}
                    <div className="admin-two-cols" style={{ padding: 0 }}>
                      
                      {/* Settings Card */}
                      <form onSubmit={handleSaveSettings} className="dash-panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <h3 className="dash-panel-card-title">Ajustes del Sistema</h3>
                        
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                          <label className="form-label" style={{ fontWeight: 800 }}>WhatsApp Business de Kaldirev</label>
                          <input 
                            type="text" 
                            name="whatsappNumber"
                            className="form-input"
                            required
                            placeholder="Ej. 59163488086"
                            value={adminFormData.whatsappNumber}
                            onChange={handleAdminInputChange}
                          />
                          <span className="admin-help-text">Código de Bolivia es 591 (sin +). Ej. 59163488086</span>
                        </div>
                        
                        <button type="submit" className="btn-dash-save" style={{ width: '100%' }}>
                          Guardar Número
                        </button>
                      </form>

                      {/* CTA Panel for New Pack */}
                      <div className="dash-panel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '8px' }}>¿Deseas añadir un nuevo Kit al catálogo?</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '340px' }}>
                          Agrega nuevos combos con imágenes a tu tienda. Se sincronizará automáticamente en la base de datos de Supabase.
                        </p>
                        <button 
                          type="button" 
                          className="btn-dash-save"
                          style={{ padding: '0.75rem 2rem', fontWeight: 800 }}
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
                    </div>

                    {/* Table Row: Full width database list */}
                    <div className="dash-panel-card" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-green)', margin: 0 }}>Catálogo de Combos en la Base de Datos</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{combos.length} Combos Activos</span>
                      </div>
                      
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
                                  {combo.image_url ? (
                                    isVideoUrl(combo.image_url) ? (
                                      <video src={combo.image_url} autoPlay loop muted playsInline style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                    ) : (
                                      <img src={combo.image_url} alt={combo.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#faf9f6', border: '1px solid var(--border-color)' }} />
                                    )
                                  ) : (
                                    <span className="badge-normal" style={{ fontSize: '0.65rem' }}>Sin foto</span>
                                  )}
                                </td>
                                <td style={{ fontWeight: 800, color: 'var(--primary-green)' }}>{combo.name}</td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={combo.includes}>
                                  {combo.includes}
                                </td>
                                <td>
                                  <span className="status-pill" style={{ background: 'var(--accent-gold-light)', color: 'var(--primary-green)', border: '1px solid var(--border-color)' }}>
                                    {combo.category}
                                  </span>
                                </td>
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
                                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                    <button 
                                      type="button" 
                                      className="btn-share" 
                                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                      onClick={() => { setFormStep(1); setEditingCombo(combo); }}
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      type="button" 
                                      className="btn-back-to-cart" 
                                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'red', border: '1px solid red' }}
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
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  {order.status !== 'Completado' && (
                                    <button 
                                      className="btn-success-close" 
                                      style={{ padding: '6px 10px', fontSize: '0.75rem', background: '#276e49' }}
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Completado')}
                                    >
                                      ✔ Listo
                                    </button>
                                  )}
                                  {order.status !== 'Cancelado' && (
                                    <button 
                                      className="btn-back-to-cart" 
                                      style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#ff4d4d', border: '1px solid #ff4d4d' }}
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
                          <th>Combo / Kit</th>
                          {branches.map(b => (
                            <th key={b.id}>{b.name} (Stock)</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {combos.map(combo => (
                          <tr key={combo.id}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {combo.image_url && (
                                <img src={combo.image_url} alt="" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                              )}
                              <strong>{combo.name}</strong>
                            </td>
                            {branches.map(b => {
                              const getStockForBranch = (cId, bId) => {
                                const obj = comboStocks.find(s => s.combo_id === cId && s.branch_id === bId);
                                return obj ? obj.stock : 0;
                              };
                              return (
                                <td key={b.id}>
                                  <input 
                                    type="number" 
                                    className="form-input" 
                                    style={{ width: '100px', padding: '0.3rem 0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}
                                    value={getStockForBranch(combo.id, b.id)} 
                                    onChange={(e) => {
                                      const newStockVal = parseInt(e.target.value) || 0;
                                      setComboStocks(prev => {
                                        const exists = prev.some(s => s.combo_id === combo.id && s.branch_id === b.id);
                                        if (exists) {
                                          return prev.map(s => (s.combo_id === combo.id && s.branch_id === b.id) ? { ...s, stock: newStockVal } : s);
                                        } else {
                                          return [...prev, { combo_id: combo.id, branch_id: b.id, stock: newStockVal }];
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
                          const upsertPayload = comboStocks.map(s => ({
                            combo_id: s.combo_id,
                            branch_id: s.branch_id,
                            stock: s.stock
                          }));
                          
                          const { error } = await supabase
                            .from('combo_stock')
                            .upsert(upsertPayload, { onConflict: 'combo_id,branch_id' });
                          
                          if (error) throw error;

                          window.Swal.fire({
                            title: 'Inventario Guardado',
                            text: 'Las existencias de todos los combos y sucursales han sido actualizadas en la base de datos.',
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
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              ) : (
                <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {profile?.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="user-info-text-desktop" style={{ fontSize: '0.85rem' }}>
                <span style={{ display: 'block', fontWeight: 700, color: 'var(--primary-green)' }}>{profile?.full_name || "Cliente"}</span>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '0.75rem' }}>Cerrar Sesión</button>
              </div>
            </div>
          ) : (
            <button 
              className="btn-google-login" 
              onClick={handleGoogleLogin}
              title="Iniciar sesión con Google"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Entrar con Gmail</span>
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
      {view === "catalog" ? (
        /* ==================== VIEW 1: PRODUCT CATALOG ==================== */
        <main>
          {/* HERO BANNER SECTION */}
          <section className="hero-banner animate-fade-in">
            <div className="hero-content">
              <span className="eco-badge">
                Envío Sostenible Kraft Termosellado 🌱
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
                <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Cargando Combos Oficiales...</h2>
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
                {/* 1. PINNED / HIGHLIGHTED COMBOS */}
                {pinnedCombos.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-title-wrapper">
                      <h2 className="section-title" style={{ fontSize: '1.7rem', fontWeight: 800 }}>Kits Recomendados</h2>
                    </div>
                    <div className="products-grid" style={{ marginTop: '1rem' }}>
                      {pinnedCombos.map(combo => (
                        <article 
                          className="product-card pinned animate-fade-in" 
                          key={combo.id}
                          onClick={() => openComboDetails(combo)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="pinned-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '3px' }}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            {combo.badge || "Destacado"}
                          </span>
                          <span className="card-packaging-badge">Termosellado</span>
                          
                          <div className="product-image-container">
                            {combo.image_url ? (
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
                            <span className="product-category">Tiens • {combo.category}</span>
                            <h3 className="product-name" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '5px 0' }}>{combo.name}</h3>
                            <span style={{ display: 'block', fontSize: '0.95rem', color: '#b89047', fontWeight: 700, marginBottom: '10px' }}>
                              {combo.tagline}
                            </span>
                            
                            <ul className="product-bullet-list" style={{ paddingLeft: 0, listStyle: 'none' }}>
                              {combo.bullets.map((bullet, idx) => (
                                <li className="product-bullet-item" key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                                  <svg className="svg-icon product-bullet-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-green)', flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0 15px 0' }}>
                              <strong>Incluye:</strong> {combo.includes}
                            </p>

                            <div className="product-price-row">
                              <span className="price-original">Bs. {parseFloat(combo.original_price_bs).toFixed(1)}</span>
                              <span className="price-current">Bs. {parseFloat(combo.price_bs).toFixed(1)}</span>
                              {getComboTotalStock(combo.id) > 0 && getComboTotalStock(combo.id) <= 5 && (
                                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                                  ⚠️ ¡Solo {getComboTotalStock(combo.id)} disp.!
                                </span>
                              )}
                            </div>

                            <div className="card-actions-row">
                              {getComboTotalStock(combo.id) > 0 ? (
                                <button 
                                  className="btn-add-cart" 
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700 }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    addToCart(combo); 
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
                                title="Ver detalles"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openComboDetails(combo);
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

                {/* 2. OTHER COMBOS */}
                {otherCombos.length > 0 && (
                  <div>
                    <div className="section-title-wrapper" style={{ marginTop: '1.5rem' }}>
                      <h2 className="section-title" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Otros Combos Disponibles</h2>
                    </div>
                    <div className="products-grid" style={{ marginTop: '1rem' }}>
                      {otherCombos.map(combo => (
                        <article 
                          className="product-card animate-fade-in" 
                          key={combo.id}
                          onClick={() => openComboDetails(combo)}
                          style={{ cursor: 'pointer' }}
                        >
                          {combo.badge && <span className="card-badge">{combo.badge}</span>}
                          <span className="card-packaging-badge">Termosellado</span>
                          
                          <div className="product-image-container">
                            {combo.image_url ? (
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
                            <span className="product-category">Tiens • {combo.category}</span>
                            <h3 className="product-name" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '5px 0' }}>{combo.name}</h3>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#b89047', fontWeight: 700, marginBottom: '10px' }}>
                              {combo.tagline}
                            </span>
                            
                            <ul className="product-bullet-list" style={{ paddingLeft: 0, listStyle: 'none' }}>
                              {combo.bullets.map((bullet, idx) => (
                                <li className="product-bullet-item" key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', marginBottom: '6px' }}>
                                  <svg className="svg-icon product-bullet-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-green)', flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0' }}>
                              <strong>Incluye:</strong> {combo.includes}
                            </p>

                            <div className="product-price-row">
                              <span className="price-original">Bs. {parseFloat(combo.original_price_bs).toFixed(1)}</span>
                              <span className="price-current">Bs. {parseFloat(combo.price_bs).toFixed(1)}</span>
                              {getComboTotalStock(combo.id) > 0 && getComboTotalStock(combo.id) <= 5 && (
                                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--offer-orange)', fontWeight: 'bold' }}>
                                  ⚠️ ¡Solo {getComboTotalStock(combo.id)} disp.!
                                </span>
                              )}
                            </div>

                            <div className="card-actions-row">
                              {getComboTotalStock(combo.id) > 0 ? (
                                <button 
                                  className="btn-add-cart" 
                                  style={{ flexGrow: 1, padding: '0.8rem', fontSize: '0.95rem' }}
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    addToCart(combo); 
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
                                  openComboDetails(combo);
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
                {filteredCombos.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>No se encontraron combos para tu búsqueda.</p>
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

          {/* TESTIMONIALS SECTION */}
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
      ) : (
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

          {selectedCombo && (
            <div className="details-grid">
              {/* Image Column */}
              <div className="details-image-container" style={{ borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCombo.image_url ? (
                  isVideoUrl(selectedCombo.image_url) ? (
                    <video src={selectedCombo.image_url} autoPlay loop muted playsInline style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: '12px' }} />
                  ) : (
                    <img src={selectedCombo.image_url} alt={selectedCombo.name} style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }} />
                  )
                ) : (
                  <div className="doypack-illustration" style={{ width: '120px', height: '180px', borderRadius: '15px' }}>
                    <div className="doypack-zipper" style={{ height: '6px' }}></div>
                    <div className="doypack-tag" style={{ top: '50px', height: '65px' }}>
                      <span className="doypack-tag-logo" style={{ fontSize: '14px' }}>TIENS</span>
                    </div>
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <span className="eco-badge" style={{ margin: 0, fontSize: '0.8rem' }}>
                    Garantía Original Tiens 🛡
                  </span>
                </div>
              </div>

              {/* Info Column */}
              <div className="details-content-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <span className="details-category">Tiens • {selectedCombo.category}</span>
                  <h1 className="details-title">{selectedCombo.name}</h1>
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
                      onClick={() => addToCart(selectedCombo)}
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
          )}
        </main>
      )}

      {/* SHOPPING CART DRAWER */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          
          <div className="cart-drawer-header">
            <h3 className="cart-drawer-title">
              {isCheckingOut ? 'Datos de tu Pedido' : 'Tu Carrito de Combos'}
            </h3>
            <button className="btn-close-cart" onClick={() => setIsCartOpen(false)} aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {!isCheckingOut ? (
            <>
              <div className="cart-items-container">
                {cart.length === 0 ? (
                  <div className="cart-empty-state">
                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>El carrito está vacío</p>
                    <p style={{ fontSize: '0.9rem' }}>Agrega algunos de nuestros combos para iniciar tu pedido.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} />
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
                            onClick={() => removeFromCart(item.id)}
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
                            <button className="btn-qty" onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span className="qty-val">{item.quantity}</span>
                            <button className="btn-qty" onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                          <span className="cart-item-price" style={{ fontSize: '1.1rem' }}>Bs. {(item.price * item.quantity).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="cart-drawer-footer">
                  <div className="summary-row" style={{ fontSize: '1.05rem' }}>
                    <span>Subtotal:</span>
                    <span>Bs. {getCartTotal().toFixed(1)}</span>
                  </div>
                  <div className="summary-row" style={{ fontSize: '1.05rem' }}>
                    <span>Empaque con Sello Kaldirev:</span>
                    <span style={{ color: '#276e49', fontWeight: 600 }}>Gratis</span>
                  </div>
                  <div className="summary-row total" style={{ fontSize: '1.35rem' }}>
                    <span>Total estimado:</span>
                    <span>Bs. {getCartTotal().toFixed(1)}</span>
                  </div>
                  
                  <div className="checkout-steps">
                    <button className="btn-checkout" style={{ fontSize: '1.1rem', padding: '1rem' }} onClick={() => setIsCheckingOut(true)}>
                      Continuar con el Envío
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* VIEW: CHECKOUT FORM */
            <>
              <form className="checkout-form-container" onSubmit={handleWhatsAppSubmit}>
                <div className="checkout-form-title" style={{ fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Datos de Envío & Entrega</span>
                  {user && <span style={{ fontSize: '0.75rem', background: '#eef6f2', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '12px' }}>Autocompletado</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Nombre y Apellido *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="form-input"
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="form-input"
                    placeholder="Ej. 78945612"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Dirección de entrega en Santa Cruz *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="form-input"
                    placeholder="Calle, Número, Zona o Referencia de tu casa"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">Ciudad de Entrega *</label>
                  <select
                    id="city"
                    name="city"
                    required
                    className="form-select"
                    value={formData.city}
                    onChange={(e) => {
                      const cityName = e.target.value;
                      let delivery = 'Local (Yango)';
                      if (cityName === 'Otra Ciudad (Nacional)') {
                        delivery = 'Nacional (OCS)';
                      }
                      setFormData(prev => ({ ...prev, city: cityName, deliveryMethod: delivery }));

                      // Auto-update selectedBranch based on city name
                      const matchingBranch = branches.find(b => b.name.toLowerCase().includes(cityName.toLowerCase())) || branches.find(b => b.name.toLowerCase().includes('santa cruz')) || branches[0];
                      setSelectedBranch(matchingBranch);
                    }}
                  >
                    <option value="Santa Cruz">Santa Cruz de la Sierra</option>
                    <option value="La Paz">La Paz / El Alto</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="Otra Ciudad (Nacional)">Otra Ciudad (Envío Nacional Interdepartamental)</option>
                  </select>
                </div>

                {formData.city !== 'Otra Ciudad (Nacional)' && (
                  <div className="form-group animate-fade-in" style={{ background: '#faf9f6', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <label className="form-label" htmlFor="gpsCoordinates" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                      📍 Coordenadas GPS / Link de Ubicación (Opcional)
                    </label>
                    <input
                      type="text"
                      id="gpsCoordinates"
                      name="gpsCoordinates"
                      className="form-input"
                      placeholder="Ej. https://maps.google.com/?q=-17.78, -63.18"
                      value={formData.gpsCoordinates}
                      onChange={handleInputChange}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Pega tu enlace de ubicación compartida de Google Maps para acelerar la entrega de la moto.
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="paymentMethod">Método de pago preferido</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="Contraentrega">Pago Contraentrega (Efectivo al recibir)</option>
                    <option value="QR Libelula">Pasarela QR (Libélula / Circle.bo - Confirmación Automática)</option>
                    <option value="Transferencia Bancaria">Pago previo por QR Manual / Transferencia</option>
                  </select>
                </div>
                
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.4' }}>
                  * Se descontarán automáticamente las existencias del almacén de <strong>{selectedBranch ? selectedBranch.name : "Santa Cruz"}</strong>.
                </div>
              </form>

              <div className="cart-drawer-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Subtotal Combos:</span>
                  <span>Bs. {getCartTotal().toFixed(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span>Envío ({formData.deliveryMethod}):</span>
                  <span>Bs. {getShippingCost().toFixed(1)}</span>
                </div>
                <div className="summary-row total" style={{ border: 'none', borderTop: '1px solid rgba(235, 220, 201, 0.4)', paddingTop: '10px', marginTop: '10px', fontSize: '1.3rem', fontWeight: 900 }}>
                  <span>Total Final:</span>
                  <span>Bs. {getFinalTotal().toFixed(1)}</span>
                </div>

                {getOutOfStockItemsForCity(formData.city).length > 0 && (
                  <div className="animate-fade-in" style={{ marginTop: '12px', background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.25)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-dark)', display: 'flex', gap: '8px', alignItems: 'flex-start', textAlign: 'left', lineHeight: '1.4' }}>
                    <span style={{ fontSize: '1.1rem', marginTop: '-2px' }}>📦</span>
                    <span>
                      <strong>Despacho Interdepartamental:</strong> Algunos packs seleccionados están agotados en el almacén de {formData.city === 'Otra Ciudad (Nacional)' ? 'tu zona' : formData.city}. Los enviaremos sin costo adicional desde nuestra sucursal central de respaldo.
                    </span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button 
                    type="submit" 
                    className="btn-whatsapp-submit" 
                    style={{ fontSize: '1.15rem', padding: '1rem', fontWeight: 700 }} 
                    onClick={handleWhatsAppSubmit}
                    disabled={isSubmittingOrder}
                  >
                    {isSubmittingOrder ? (
                      <span>Registrando Pedido...</span>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.59-4.846c1.666.988 3.311 1.485 5.243 1.486 5.542.004 10.057-4.51 10.06-10.055.002-2.686-1.043-5.212-2.94-7.11s-4.426-2.943-7.11-2.943c-5.542 0-10.056 4.51-10.06 10.056-.001 2.01.536 3.69 1.547 5.356l-.99 3.616 3.733-.979zm11.332-6.862c-.3-.15-1.77-.875-2.04-.972-.27-.099-.47-.15-.67.15-.2.3-.77.975-.94 1.17-.18.195-.36.225-.66.075-.3-.15-1.27-.47-2.42-1.493-.89-.797-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.62-.92-2.22-.242-.58-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.525.714.31 1.272.496 1.706.635.717.227 1.37.195 1.885.118.575-.085 1.77-.725 2.02-1.39.25-.665.25-1.235.175-1.35-.075-.115-.275-.185-.575-.335z"/>
                        </svg>
                        Enviar Pedido por WhatsApp
                      </>
                    )}
                  </button>
                  <button type="button" className="btn-back-to-cart" onClick={() => setIsCheckingOut(false)}>
                    Regresar al Carrito
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

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
    </>
  );
}

export default App;
