import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Edit2, ShieldAlert, Sparkles, Check, Package, DollarSign,
  Tag, Cpu, Zap, MemoryStick, CircuitBoard, HardDrive, Fan, BatteryCharging,
  Box, Upload, Image as ImageIcon, Trash2, AlertCircle, RefreshCw, Flame
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'gpu',
    name: 'Graphics Cards (GPU)',
    icon: Cpu,
    defaultWattage: 280,
    defaultImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    specKeys: ['memory', 'clockSpeed', 'interface', 'recommendedPsu']
  },
  {
    id: 'cpu',
    name: 'Processors (CPU)',
    icon: Zap,
    defaultWattage: 105,
    defaultImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    specKeys: ['cores', 'clockSpeed', 'socket', 'cache']
  },
  {
    id: 'ram',
    name: 'Memory (RAM)',
    icon: MemoryStick,
    defaultWattage: 15,
    defaultImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    specKeys: ['capacity', 'speed', 'type', 'latency']
  },
  {
    id: 'mb',
    name: 'Motherboards',
    icon: CircuitBoard,
    defaultWattage: 40,
    defaultImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    specKeys: ['chipset', 'socket', 'formFactor', 'ramSlots']
  },
  {
    id: 'storage',
    name: 'Storage (SSD & HDD)',
    icon: HardDrive,
    defaultWattage: 10,
    defaultImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    specKeys: ['capacity', 'interface', 'readSpeed', 'formFactor']
  },
  {
    id: 'cooling',
    name: 'Cooling & Fans',
    icon: Fan,
    defaultWattage: 25,
    defaultImage: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80',
    specKeys: ['radiatorSize', 'fanSpeed', 'noiseLevel', 'socketCompatibility']
  },
  {
    id: 'psu',
    name: 'Power Supplies (PSU)',
    icon: BatteryCharging,
    defaultWattage: 0,
    defaultImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    specKeys: ['wattageOutput', 'efficiency', 'modularity', 'pcie5Support']
  },
  {
    id: 'case',
    name: 'PC Cases',
    icon: Box,
    defaultWattage: 0,
    defaultImage: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?auto=format&fit=crop&w=800&q=80',
    specKeys: ['formFactor', 'sidePanel', 'maxGpuLength', 'radiatorSupport']
  }
];

const PRESET_TAGS = [
  'NEW RELEASE',
  'HOT DEAL',
  'ULTRA HIGH',
  'POPULAR',
  'BESTSELLER',
  'LIMITED EDITION',
  'OVERCLOCKED'
];

export default function AdminProductModal({ isOpen, onClose, onSaveProduct, initialProduct = null }) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'specs', 'media', 'promo'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'gpu',
    brand: '',
    price: '',
    originalPrice: '',
    stock: '10',
    wattage: '280',
    image: '',
    description: '',
    tag: 'NEW RELEASE',
    isFeatured: true,
    isFlashSale: false,
    specs: {}
  });

  const [customSpecs, setCustomSpecs] = useState([]);

  useEffect(() => {
    if (initialProduct) {
      const specsObj = initialProduct.specs || {};
      const knownCategory = CATEGORIES.find(c => c.id === initialProduct.category) || CATEGORIES[0];
      const standardKeys = knownCategory.specKeys;

      const customList = [];
      Object.entries(specsObj).forEach(([k, v]) => {
        if (!standardKeys.includes(k)) {
          customList.push({ key: k, value: String(v) });
        }
      });

      setFormData({
        id: initialProduct.id || '',
        name: initialProduct.name || '',
        category: initialProduct.category || 'gpu',
        brand: initialProduct.brand || '',
        price: initialProduct.price !== undefined ? String(initialProduct.price) : '',
        originalPrice: initialProduct.originalPrice !== undefined ? String(initialProduct.originalPrice) : '',
        stock: initialProduct.stock !== undefined ? String(initialProduct.stock) : '10',
        wattage: initialProduct.wattage !== undefined ? String(initialProduct.wattage) : String(knownCategory.defaultWattage || 0),
        image: initialProduct.image || '',
        description: initialProduct.description || '',
        tag: initialProduct.tag || 'NEW RELEASE',
        isFeatured: initialProduct.isFeatured !== undefined ? Boolean(initialProduct.isFeatured) : true,
        isFlashSale: Boolean(initialProduct.isFlashSale),
        specs: { ...specsObj }
      });
      setCustomSpecs(customList);
    } else {
      setFormData({
        id: '',
        name: '',
        category: 'gpu',
        brand: '',
        price: '',
        originalPrice: '',
        stock: '10',
        wattage: '280',
        image: '',
        description: '',
        tag: 'NEW RELEASE',
        isFeatured: true,
        isFlashSale: false,
        specs: {
          memory: '16GB GDDR6X',
          clockSpeed: '2550 MHz',
          interface: 'PCIe 4.0 x16',
          recommendedPsu: '750W'
        }
      });
      setCustomSpecs([]);
    }
    setErrorMessage('');
    setActiveTab('general');
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0];

  const handleCategoryChange = (newCatId) => {
    const cat = CATEGORIES.find(c => c.id === newCatId) || CATEGORIES[0];
    const defaultSpecs = {};
    cat.specKeys.forEach(k => {
      defaultSpecs[k] = '';
    });

    setFormData(prev => ({
      ...prev,
      category: newCatId,
      wattage: prev.wattage && prev.wattage !== '0' ? prev.wattage : String(cat.defaultWattage || 0),
      image: prev.image || cat.defaultImage,
      specs: { ...defaultSpecs }
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value
      }
    }));
  };

  const handleAddCustomSpec = () => {
    setCustomSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleCustomSpecChange = (index, field, value) => {
    setCustomSpecs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveCustomSpec = (index) => {
    setCustomSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Image Upload Handling (Local File -> Base64)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file is too large! Please choose an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64 = loadEvent.target?.result;
      if (base64) {
        setFormData(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Product title is required.');
      setActiveTab('general');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setErrorMessage('A valid price (Rs.) is required.');
      setActiveTab('general');
      return;
    }

    setIsSubmitting(true);

    try {
      // Assemble structured specs
      const mergedSpecs = { ...formData.specs };
      customSpecs.forEach(item => {
        if (item.key.trim() && item.value.trim()) {
          mergedSpecs[item.key.trim()] = item.value.trim();
        }
      });

      const parsedPrice = parseFloat(formData.price);
      const parsedOrigPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : parsedPrice;
      const parsedStock = parseInt(formData.stock || '10', 10);
      const parsedWattage = parseInt(formData.wattage || '0', 10);

      const finalProductPayload = {
        ...(formData.id ? { id: formData.id } : {}),
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim() || 'Generic Gaming',
        price: parsedPrice,
        originalPrice: parsedOrigPrice >= parsedPrice ? parsedOrigPrice : parsedPrice,
        stock: isNaN(parsedStock) ? 10 : parsedStock,
        wattage: isNaN(parsedWattage) ? 0 : parsedWattage,
        image: formData.image || currentCategory.defaultImage,
        fallbackImage: formData.image || currentCategory.defaultImage,
        description: formData.description.trim() || `High-performance ${formData.category.toUpperCase()} PC component engineered for peak gaming speed.`,
        tag: formData.tag.trim() || (formData.isFlashSale ? 'FLASH SALE' : 'NEW RELEASE'),
        isFeatured: Boolean(formData.isFeatured),
        isFlashSale: Boolean(formData.isFlashSale),
        specs: mergedSpecs
      };

      await onSaveProduct(finalProductPayload);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
      setErrorMessage(err.message || 'Failed to save product to database');
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(initialProduct?.id);
  const discountPercent = (formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price))
    ? Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)
    : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9950,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#0a0d16',
          border: '1px solid rgba(255, 0, 100, 0.45)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 0, 100, 0.25)',
          padding: '1.8rem',
          borderRadius: '18px',
          position: 'relative',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#8e9bb0',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Header Badge & Title */}
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(255, 0, 100, 0.15)',
              border: '1px solid #ff0066',
              color: '#ff0066',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: "'Orbitron', sans-serif"
            }}>
              <ShieldAlert size={14} /> ADMIN PRODUCT MANAGEMENT
            </span>
            {isEditing && (
              <span style={{ fontSize: '0.75rem', color: '#00f0ff', fontFamily: 'monospace' }}>
                ID: {formData.id}
              </span>
            )}
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: '#fff',
            fontFamily: "'Orbitron', sans-serif",
            margin: '0 0 0.3rem 0',
            letterSpacing: '0.5px'
          }}>
            {isEditing ? 'EDIT STORE PRODUCT' : 'ADD NEW GAMING PRODUCT'}
          </h2>
          <p style={{ color: '#8e9bb0', fontSize: '0.8rem', margin: 0 }}>
            {isEditing
              ? 'Update specifications, pricing, stock and media in the MongoDB catalog.'
              : 'Add new gaming hardware with complete details, pricing, and specs to display across the site.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 85, 0.15)',
            border: '1px solid #ff0055',
            color: '#ff0055',
            borderRadius: '8px',
            padding: '0.6rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.6rem', marginBottom: '1.2rem', overflowX: 'auto' }}>
          {[
            { id: 'general', label: '1. GENERAL INFO' },
            { id: 'specs', label: '2. SPECIFICATIONS' },
            { id: 'media', label: '3. MEDIA & PREVIEW' },
            { id: 'promo', label: '4. PROMOTIONS & FLAGS' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? 'rgba(255, 0, 100, 0.15)' : 'transparent',
                border: activeTab === tab.id ? '1px solid #ff0066' : '1px solid transparent',
                color: activeTab === tab.id ? '#ff0066' : '#8e9bb0',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                fontFamily: "'Orbitron', sans-serif"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body Container (Scrollable) */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', paddingRight: '0.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Product Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                  PRODUCT TITLE *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 5090 OC 32GB"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Category & Brand */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem' }}>
                    CATEGORY *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem' }}>
                    BRAND / MANUFACTURER
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. ASUS, MSI, AMD, Intel, Corsair"
                    value={formData.brand}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock, Wattage */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#00ff66', fontWeight: 800, marginBottom: '0.4rem' }}>
                    PRICE (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    placeholder="599999.00"
                    value={formData.price}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(0, 255, 102, 0.3)',
                      borderRadius: '8px',
                      color: '#00ff66',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 800, marginBottom: '0.4rem' }}>
                    ORIGINAL (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    placeholder="649999.00"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#8e9bb0',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 800, marginBottom: '0.4rem' }}>
                    STOCK QTY
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="10"
                    value={formData.stock}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#ffaa00', fontWeight: 800, marginBottom: '0.4rem' }}>
                    POWER (WATTS)
                  </label>
                  <input
                    type="number"
                    name="wattage"
                    placeholder="280"
                    value={formData.wattage}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 170, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#ffaa00',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Price Calculation Info */}
              {discountPercent > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#ff0066', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={14} /> Special Discount: {discountPercent}% OFF will be highlighted on product card and detail view!
                </div>
              )}

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem' }}>
                  PRODUCT OVERVIEW & DESCRIPTION
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Engineered for high-end gaming, extreme thermal dissipation, 4K rendering..."
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 800 }}>
                  Recommended Hardware Specs for {currentCategory.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>
                  Shown in Technical Specifications tab
                </span>
              </div>

              {/* Recommended Spec Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
                {currentCategory.specKeys.map(specKey => {
                  const label = specKey
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());

                  return (
                    <div key={specKey}>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.3rem' }}>
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g. ${specKey === 'memory' ? '24GB GDDR6X' : specKey === 'clockSpeed' ? '2640 MHz' : specKey === 'cores' ? '16 Cores / 32 Threads' : 'Standard'}`}
                        value={formData.specs[specKey] || ''}
                        onChange={(e) => handleSpecChange(specKey, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.8rem',
                          backgroundColor: '#121624',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.82rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Custom Specs Entries */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#8e9bb0', fontWeight: 800 }}>
                    ADDITIONAL CUSTOM SPECIFICATIONS
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCustomSpec}
                    style={{
                      background: 'rgba(0, 240, 255, 0.12)',
                      border: '1px solid #00f0ff',
                      color: '#00f0ff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={13} /> ADD CUSTOM SPEC ROW
                  </button>
                </div>

                {customSpecs.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#56657f', textAlign: 'center', padding: '0.8rem', border: '1px dashed rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
                    No custom spec rows added. Click "+ ADD CUSTOM SPEC ROW" to add attributes like RGB Sync, Warranty, Dimensions, etc.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {customSpecs.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Spec Name (e.g. Warranty)"
                          value={item.key}
                          onChange={(e) => handleCustomSpecChange(idx, 'key', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.6rem 0.8rem',
                            backgroundColor: '#121624',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Spec Value (e.g. 3 Years Domestic)"
                          value={item.value}
                          onChange={(e) => handleCustomSpecChange(idx, 'value', e.target.value)}
                          style={{
                            flex: 1.5,
                            padding: '0.6rem 0.8rem',
                            backgroundColor: '#121624',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSpec(idx)}
                          style={{
                            background: 'rgba(255, 0, 85, 0.15)',
                            border: '1px solid #ff0055',
                            color: '#ff0055',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA & PREVIEW */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem' }}>
                  IMAGE SOURCE (URL OR DIRECT UPLOAD)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    name="image"
                    placeholder="https://images.unsplash.com/... or /api/images/..."
                    value={formData.image}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      backgroundColor: 'rgba(0, 240, 255, 0.15)',
                      border: '1px solid #00f0ff',
                      color: '#00f0ff',
                      borderRadius: '8px',
                      padding: '0 1rem',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Upload size={14} /> UPLOAD FILE
                  </button>
                </div>
              </div>

              {/* Live Preview Display */}
              <div style={{
                backgroundColor: '#121624',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem'
              }}>
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '10px',
                  backgroundColor: '#0a0d14',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Product Preview"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = currentCategory.defaultImage;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon size={36} color="#455470" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase', marginBottom: '3px' }}>
                    {formData.brand || 'BRAND'} • {currentCategory.name}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 800, marginBottom: '4px' }}>
                    {formData.name || 'Untitled Gaming Product'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#00ff66', fontWeight: 900 }}>
                    Rs. {formData.price ? Number(formData.price).toLocaleString('en-LK') : '0.00'}
                  </div>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff0055',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        padding: 0,
                        marginTop: '6px',
                        textDecoration: 'underline'
                      }}
                    >
                      Clear image (revert to category default)
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Preset Hardware Images */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#8e9bb0', fontWeight: 800, marginBottom: '0.5rem' }}>
                  QUICK PRESETS FOR {currentCategory.name.toUpperCase()}:
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: currentCategory.defaultImage }))}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#8e9bb0',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  Use Default HD {currentCategory.name} Photo
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROMOTIONS & FLAGS */}
          {activeTab === 'promo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Tag Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, marginBottom: '0.4rem' }}>
                  CARD BADGE / PROMOTION TAG
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                  {PRESET_TAGS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tag: t }))}
                      style={{
                        backgroundColor: formData.tag === t ? 'rgba(255, 0, 100, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${formData.tag === t ? '#ff0066' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: formData.tag === t ? '#ff0066' : '#8e9bb0',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  name="tag"
                  placeholder="Custom Badge Tag Text..."
                  value={formData.tag}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#121624', padding: '1rem', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#ff0066', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>FEATURE IN STOREFRONT SHOWCASE</div>
                    <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>Highlight in the Top Picks & Recommended components</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.8rem' }}>
                  <input
                    type="checkbox"
                    name="isFlashSale"
                    checked={formData.isFlashSale}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#00f0ff', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>INCLUDE IN FLASH SALE DEALS</div>
                    <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>Displays in the 24-Hour Flash Sale banner with live countdown</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Form Action Buttons Footer */}
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', marginTop: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '0.85rem',
                backgroundColor: '#151a28',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: isSubmitting ? 'default' : 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '0.85rem',
                background: isSubmitting ? 'rgba(255, 0, 100, 0.3)' : 'linear-gradient(135deg, #ff0066, #7000ff)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isSubmitting ? 'default' : 'pointer',
                boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(255, 0, 100, 0.4)',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.5px'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> SAVING TO DATABASE...
                </>
              ) : isEditing ? (
                <>
                  <Edit2 size={18} /> SAVE CHANGES TO DB
                </>
              ) : (
                <>
                  <Plus size={18} /> CREATE & SAVE PRODUCT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
