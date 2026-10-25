import React, { useState, useMemo } from 'react';
import {
  X, Search, Filter, Plus, Edit3, Trash2, Eye, ShieldAlert,
  Cpu, Zap, MemoryStick, CircuitBoard, HardDrive, Fan, BatteryCharging,
  Box, ArrowUpDown, RefreshCw, CheckCircle2, AlertTriangle, Layers,
  ExternalLink, Copy, Check, Download, Image as ImageIcon, Flame, Star,
  TrendingUp, Package, Database, Sparkles, SlidersHorizontal
} from 'lucide-react';

const CATEGORY_ICONS = {
  gpu: Cpu,
  cpu: Zap,
  ram: MemoryStick,
  mb: CircuitBoard,
  storage: HardDrive,
  cooling: Fan,
  psu: BatteryCharging,
  case: Box
};

const CATEGORY_NAMES = {
  gpu: 'Graphics Cards',
  cpu: 'Processors',
  ram: 'Memory (RAM)',
  mb: 'Motherboards',
  storage: 'Storage (SSD/HDD)',
  cooling: 'Cooling & Fans',
  psu: 'Power Supplies',
  case: 'PC Cases'
};

const CATEGORY_COLORS = {
  gpu: '#00f0ff',
  cpu: '#ff0055',
  ram: '#a855f7',
  mb: '#3b82f6',
  storage: '#10b981',
  cooling: '#06b6d4',
  psu: '#f59e0b',
  case: '#ec4899'
};

export default function AdminProductsManagerModal({
  isOpen,
  onClose,
  products = [],
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProductDetails,
  onQuickUpdateStock,
  onQuickToggleFlashSale,
  onRefreshProducts,
  onSyncDatabase,
  isLoadingProducts = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'instock', 'low', 'out'
  const [dealFilter, setDealFilter] = useState('all'); // 'all', 'flash', 'featured'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-desc', 'price-asc', 'stock-desc', 'stock-asc', 'rating-desc', 'name-asc'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Copy helper
  const handleCopy = (text, idKey) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Refresh handler
  const handleTriggerRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshProducts) {
      await onRefreshProducts();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Sync handler
  const handleTriggerSync = async () => {
    if (window.confirm('Trigger full synchronization of Data folder images and products into MongoDB database?')) {
      setIsSyncing(true);
      if (onSyncDatabase) {
        await onSyncDatabase();
      }
      setTimeout(() => setIsSyncing(false), 1200);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!products.length) return;
    const headers = ['ID', 'MongoDB_ID', 'Name', 'Category', 'Brand', 'Price_LKR', 'OriginalPrice_LKR', 'Stock', 'Wattage_W', 'Rating', 'ReviewsCount', 'IsFlashSale', 'IsFeatured', 'Tag', 'Image_URL'];
    const rows = products.map(p => [
      `"${p.id || ''}"`,
      `"${p._id || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      p.price || 0,
      p.originalPrice || p.price || 0,
      p.stock !== undefined ? p.stock : 10,
      p.wattage || 0,
      p.rating || 5,
      p.reviewsCount || 0,
      p.isFlashSale ? 'TRUE' : 'FALSE',
      p.isFeatured ? 'TRUE' : 'FALSE',
      `"${p.tag || ''}"`,
      `"${p.image || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gamershop_products_mongodb_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Key KPI stats
  const stats = useMemo(() => {
    const total = products.length;
    const totalStock = products.reduce((acc, p) => acc + (typeof p.stock === 'number' ? p.stock : 10), 0);
    const totalValue = products.reduce((acc, p) => acc + ((p.price || 0) * (typeof p.stock === 'number' ? p.stock : 10)), 0);
    const flashCount = products.filter(p => p.isFlashSale).length;
    const lowStockCount = products.filter(p => (typeof p.stock === 'number' ? p.stock : 10) <= 5).length;
    const outOfStockCount = products.filter(p => (typeof p.stock === 'number' ? p.stock : 10) === 0).length;

    // Categories breakdown
    const categoryCounts = {};
    products.forEach(p => {
      const cat = p.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return { total, totalStock, totalValue, flashCount, lowStockCount, outOfStockCount, categoryCounts };
  }, [products]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (product.name || '').toLowerCase().includes(q);
        const matchBrand = (product.brand || '').toLowerCase().includes(q);
        const matchCat = (product.category || '').toLowerCase().includes(q);
        const matchId = (product.id || '').toLowerCase().includes(q);
        const matchMongoId = (product._id || '').toLowerCase().includes(q);
        const matchTag = (product.tag || '').toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCat && !matchId && !matchMongoId && !matchTag) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Stock Filter
      const stock = typeof product.stock === 'number' ? product.stock : 10;
      if (stockFilter === 'instock' && stock <= 0) return false;
      if (stockFilter === 'low' && (stock > 5 || stock <= 0)) return false;
      if (stockFilter === 'out' && stock !== 0) return false;

      // 4. Deal Filter
      if (dealFilter === 'flash' && !product.isFlashSale) return false;
      if (dealFilter === 'featured' && !product.isFeatured) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
      if (sortBy === 'stock-asc') return (a.stock || 0) - (b.stock || 0);
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [products, searchQuery, selectedCategory, stockFilter, dealFilter, sortBy]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9940,
        backgroundColor: 'rgba(5, 7, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1440px',
          height: '94vh',
          backgroundColor: '#0a0d16',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 240, 255, 0.2)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* TOP MODAL HEADER */}
        <div style={{
          backgroundColor: '#0c0f1a',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '1.2rem 1.8rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Title & DB Connection Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 0, 85, 0.4)'
            }}>
              <ShieldAlert size={26} color="#fff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#fff',
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '1px',
                  margin: 0
                }}>
                  ADMIN PRODUCT INVENTORY
                </h2>
                <span style={{
                  backgroundColor: 'rgba(0, 255, 102, 0.15)',
                  border: '1px solid #00ff66',
                  color: '#00ff66',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-stats)'
                }}>
                  <Database size={11} /> MONGODB CONNECTED: gamer_shop
                </span>
              </div>
              <p style={{ color: '#8e9bb0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                Showing live product catalog, image buffers, pricing, stock levels and specifications fetched directly from the database.
              </p>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleTriggerRefresh}
              disabled={isRefreshing || isLoadingProducts}
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                color: '#00f0ff',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
              title="Re-query MongoDB database for fresh products"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh DB'}</span>
            </button>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              style={{
                backgroundColor: 'rgba(112, 0, 255, 0.15)',
                border: '1px solid #7000ff',
                color: '#c084fc',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              title="Synchronize Data directory images into MongoDB"
            >
              <Sparkles size={14} />
              <span>{isSyncing ? 'Syncing...' : 'Sync MongoDB'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '10px',
                padding: '0.55rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              title="Download complete products inventory as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onAddNewProduct}
              style={{
                background: 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
                border: 'none',
                color: '#fff',
                borderRadius: '10px',
                padding: '0.55rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: "'Orbitron', sans-serif",
                boxShadow: '0 0 16px rgba(255, 0, 85, 0.4)'
              }}
            >
              <Plus size={16} />
              <span>+ ADD NEW PRODUCT</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '0.4rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* METRICS & KPI STRIP */}
        <div style={{
          backgroundColor: '#070910',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '0.8rem 1.8rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {/* Metric 1: Total Products */}
          <div style={{
            backgroundColor: '#101423',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 240, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00f0ff'
            }}>
              <Package size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Products
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00f0ff', fontFamily: 'var(--font-stats)' }}>
                {stats.total} Items
              </div>
            </div>
          </div>

          {/* Metric 2: Inventory Stock */}
          <div style={{
            backgroundColor: '#101423',
            border: '1px solid rgba(0, 255, 102, 0.25)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 255, 102, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00ff66'
            }}>
              <Layers size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 700, textTransform: 'uppercase' }}>
                Stock Units in DB
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00ff66', fontFamily: 'var(--font-stats)' }}>
                {stats.totalStock.toLocaleString()} Units
              </div>
            </div>
          </div>

          {/* Metric 3: Total Asset Valuation */}
          <div style={{
            backgroundColor: '#101423',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 700, textTransform: 'uppercase' }}>
                Inventory Asset Value
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-stats)' }}>
                Rs. {stats.totalValue.toLocaleString('en-LK')}
              </div>
            </div>
          </div>

          {/* Metric 4: Flash Deals */}
          <div style={{
            backgroundColor: '#101423',
            border: '1px solid rgba(255, 0, 85, 0.25)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 0, 85, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff0055'
            }}>
              <Flame size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 700, textTransform: 'uppercase' }}>
                Active Flash Deals
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff0055', fontFamily: 'var(--font-stats)' }}>
                {stats.flashCount} On Sale
              </div>
            </div>
          </div>

          {/* Metric 5: Stock Warning */}
          <div style={{
            backgroundColor: '#101423',
            border: stats.lowStockCount > 0 ? '1px solid rgba(255, 75, 75, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: stats.lowStockCount > 0 ? 'rgba(255, 75, 75, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stats.lowStockCount > 0 ? '#ff4b4b' : '#8e9bb0'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 700, textTransform: 'uppercase' }}>
                Low Stock (≤5)
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: stats.lowStockCount > 0 ? '#ff4b4b' : '#8e9bb0', fontFamily: 'var(--font-stats)' }}>
                {stats.lowStockCount} Items
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS CONTROLS BAR */}
        <div style={{
          backgroundColor: '#0c0f1a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.8rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {/* Upper Toolbar: Search Input + Selectors + View Toggle */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              flex: '1 1 320px',
              maxWidth: '480px'
            }}>
              <Search
                size={16}
                color="#00f0ff"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by title, brand, category, custom ID (e.g. gpu-1), or MongoDB _id..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 2.2rem 0.6rem 2.5rem',
                  backgroundColor: '#121626',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8e9bb0',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selectors Strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                style={{
                  backgroundColor: '#121626',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.8rem',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Stock Statuses</option>
                <option value="instock">In Stock Only</option>
                <option value="low">⚠️ Low Stock (≤ 5 units)</option>
                <option value="out">🔴 Out of Stock (0 units)</option>
              </select>

              {/* Deal / Promotion Filter */}
              <select
                value={dealFilter}
                onChange={e => setDealFilter(e.target.value)}
                style={{
                  backgroundColor: '#121626',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.8rem',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Deals & Flags</option>
                <option value="flash">🔥 On Flash Sale Deals</option>
                <option value="featured">★ Featured Products</option>
              </select>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ArrowUpDown size={14} color="#8e9bb0" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: '#121626',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.8rem',
                    color: '#00f0ff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="stock-desc">Stock: High to Low</option>
                  <option value="stock-asc">Stock: Low to High</option>
                  <option value="rating-desc">Highest Rated ★</option>
                  <option value="name-asc">Product Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: '#121626',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    backgroundColor: viewMode === 'table' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    border: viewMode === 'table' ? '1px solid #00f0ff' : '1px solid transparent',
                    color: viewMode === 'table' ? '#00f0ff' : '#8e9bb0',
                    borderRadius: '6px',
                    padding: '0.4rem 0.7rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>📋 Table</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    border: viewMode === 'grid' ? '1px solid #00f0ff' : '1px solid transparent',
                    color: viewMode === 'grid' ? '#00f0ff' : '#8e9bb0',
                    borderRadius: '6px',
                    padding: '0.4rem 0.7rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🗂️ Cards</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lower Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? '#00f0ff' : 'rgba(255, 255, 255, 0.05)',
                border: selectedCategory === 'all' ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                color: selectedCategory === 'all' ? '#000' : '#8e9bb0',
                borderRadius: '8px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>ALL HARDWARE</span>
              <span style={{
                backgroundColor: selectedCategory === 'all' ? '#000' : 'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === 'all' ? '#00f0ff' : '#fff',
                fontSize: '0.65rem',
                padding: '1px 6px',
                borderRadius: '6px'
              }}>
                {stats.total}
              </span>
            </button>

            {Object.keys(CATEGORY_NAMES).map(catKey => {
              const Icon = CATEGORY_ICONS[catKey] || Cpu;
              const isSelected = selectedCategory === catKey;
              const count = stats.categoryCounts[catKey] || 0;
              const color = CATEGORY_COLORS[catKey] || '#00f0ff';

              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  style={{
                    backgroundColor: isSelected ? `${color}25` : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#fff' : '#8e9bb0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={13} color={color} />
                  <span>{CATEGORY_NAMES[catKey]}</span>
                  <span style={{
                    backgroundColor: isSelected ? color : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#000' : '#8e9bb0',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '6px'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN BODY: TABLE OR GRID VIEW */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1.8rem' }}>
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#0c0f18',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <Package size={48} color="#56657f" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                NO PRODUCTS FOUND
              </h3>
              <p style={{ color: '#8e9bb0', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                No items matched your search query or filter selection in MongoDB database.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setStockFilter('all');
                  setDealFilter('all');
                }}
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.15)',
                  border: '1px solid #00f0ff',
                  color: '#00f0ff',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* PROFESSIONAL ADMIN DATA TABLE VIEW */
            <div style={{
              backgroundColor: '#0c0f1a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1050px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#101424',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
                    color: '#8e9bb0',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    fontFamily: "'Orbitron', sans-serif"
                  }}>
                    <th style={{ padding: '0.9rem 1rem', width: '70px' }}>Image</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Product & Database IDs</th>
                    <th style={{ padding: '0.9rem 1rem', width: '130px' }}>Category</th>
                    <th style={{ padding: '0.9rem 1rem', width: '140px' }}>Price (LKR)</th>
                    <th style={{ padding: '0.9rem 1rem', width: '150px' }}>Stock & Quick Adjust</th>
                    <th style={{ padding: '0.9rem 1rem', width: '80px' }}>Watts</th>
                    <th style={{ padding: '0.9rem 1rem', width: '90px' }}>Rating</th>
                    <th style={{ padding: '0.9rem 1rem', width: '130px' }}>Flags & Deals</th>
                    <th style={{ padding: '0.9rem 1rem', width: '120px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
                    const CatIcon = CATEGORY_ICONS[product.category] || Cpu;
                    const catColor = CATEGORY_COLORS[product.category] || '#00f0ff';
                    const stock = typeof product.stock === 'number' ? product.stock : 10;
                    const isLowStock = stock <= 5 && stock > 0;
                    const isOutOfStock = stock === 0;
                    const discountPercent = (product.originalPrice && product.originalPrice > product.price)
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <tr
                        key={product.id || index}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.04)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'}
                      >
                        {/* 1. Image Thumbnail with preview lightbox */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div
                            onClick={() => setPreviewImage(product)}
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '8px',
                              backgroundColor: '#070910',
                              border: '1px solid rgba(0, 240, 255, 0.3)',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Click to view full image in high resolution"
                          >
                            <img
                              src={product.image || `/api/images/${product.id}`}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => {
                                e.currentTarget.onerror = null;
                                const fallback = product.fallbackImage || `/images/${product.id}.jpg`;
                                if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                                  e.currentTarget.src = fallback;
                                } else {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
                                }
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              padding: '1px 3px',
                              borderRadius: '3px 0 0 0'
                            }}>
                              <Eye size={10} color="#00f0ff" />
                            </div>
                          </div>
                        </td>

                        {/* 2. Product Name, Brand & Database IDs */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase' }}>
                                {product.brand || 'GAMER BRAND'}
                              </span>
                              {product.tag && (
                                <span style={{
                                  backgroundColor: 'rgba(255, 0, 85, 0.15)',
                                  color: '#ff0055',
                                  border: '1px solid #ff0055',
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '4px'
                                }}>
                                  {product.tag}
                                </span>
                              )}
                            </div>

                            <div
                              onClick={() => onViewProductDetails && onViewProductDetails(product)}
                              style={{
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                lineHeight: '1.3',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = '#00f0ff'}
                              onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                              title="Click to view details in shop"
                            >
                              {product.name}
                            </div>

                            {/* Database IDs Strip */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                              <span
                                onClick={() => handleCopy(product.id, `custom-${product.id}`)}
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.68rem',
                                  backgroundColor: 'rgba(0, 240, 255, 0.08)',
                                  color: '#00f0ff',
                                  border: '1px solid rgba(0, 240, 255, 0.25)',
                                  borderRadius: '4px',
                                  padding: '1px 6px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Click to copy Custom ID"
                              >
                                {copiedId === `custom-${product.id}` ? <Check size={10} color="#00ff66" /> : <Copy size={10} />}
                                ID: {product.id}
                              </span>

                              {product._id && (
                                <span
                                  onClick={() => handleCopy(product._id, `oid-${product._id}`)}
                                  style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.68rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                    color: '#8e9bb0',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '4px',
                                    padding: '1px 6px',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                  title="Click to copy MongoDB ObjectId"
                                >
                                  {copiedId === `oid-${product._id}` ? <Check size={10} color="#00ff66" /> : <Copy size={10} />}
                                  _id: {product._id.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 3. Category */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <span style={{
                            backgroundColor: `${catColor}15`,
                            border: `1px solid ${catColor}40`,
                            color: catColor,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            textTransform: 'uppercase'
                          }}>
                            <CatIcon size={12} />
                            {CATEGORY_NAMES[product.category] || product.category}
                          </span>
                        </td>

                        {/* 4. Price (LKR) */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#00ff66', fontFamily: 'var(--font-stats)' }}>
                              Rs. {(product.price || 0).toLocaleString('en-LK')}
                            </div>
                            {discountPercent > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                                <span style={{ fontSize: '0.7rem', color: '#687790', textDecoration: 'line-through', fontFamily: 'var(--font-stats)' }}>
                                  Rs. {(product.originalPrice || 0).toLocaleString('en-LK')}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#ff0055', fontWeight: 800 }}>
                                  -{discountPercent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Stock & Quick Adjust Controls */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => onQuickUpdateStock && onQuickUpdateStock(product.id, Math.max(0, stock - 1))}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontWeight: 900,
                                fontSize: '0.85rem'
                              }}
                              title="Decrease stock by 1"
                            >
                              -
                            </button>

                            <span style={{
                              backgroundColor: isOutOfStock
                                ? 'rgba(255, 75, 75, 0.15)'
                                : isLowStock
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(0, 255, 102, 0.15)',
                              border: isOutOfStock
                                ? '1px solid #ff4b4b'
                                : isLowStock
                                  ? '1px solid #f59e0b'
                                  : '1px solid #00ff66',
                              color: isOutOfStock ? '#ff4b4b' : isLowStock ? '#f59e0b' : '#00ff66',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              fontFamily: 'var(--font-stats)',
                              minWidth: '55px',
                              textAlign: 'center'
                            }}>
                              {isOutOfStock ? '0 (OUT)' : `${stock} Units`}
                            </span>

                            <button
                              onClick={() => onQuickUpdateStock && onQuickUpdateStock(product.id, stock + 1)}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontWeight: 900,
                                fontSize: '0.85rem'
                              }}
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* 6. Wattage */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <span style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#8e9bb0',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-stats)'
                          }}>
                            {product.wattage ? `${product.wattage}W` : '0W'}
                          </span>
                        </td>

                        {/* 7. Rating */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Star size={13} fill="#ffb700" color="#ffb700" />
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.78rem' }}>
                              {product.rating || '5.0'}
                            </span>
                            <span style={{ color: '#56657f', fontSize: '0.68rem' }}>
                              ({product.reviewsCount || 0})
                            </span>
                          </div>
                        </td>

                        {/* 8. Flags & Quick Deals */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            <button
                              onClick={() => onQuickToggleFlashSale && onQuickToggleFlashSale(product.id, Boolean(product.isFlashSale))}
                              style={{
                                backgroundColor: product.isFlashSale ? 'rgba(255, 0, 85, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                border: product.isFlashSale ? '1px solid #ff0055' : '1px solid rgba(255, 255, 255, 0.08)',
                                color: product.isFlashSale ? '#ff0055' : '#56657f',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Click to toggle Flash Sale in MongoDB"
                            >
                              <Flame size={10} />
                              {product.isFlashSale ? 'SALE ON' : 'NO SALE'}
                            </button>

                            {product.isFeatured && (
                              <span style={{
                                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                color: '#00f0ff',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 800
                              }}>
                                ★ FEATURED
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 9. Actions */}
                        <td style={{ padding: '0.8rem 1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => onEditProduct && onEditProduct(product)}
                              style={{
                                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                                border: '1px solid #00f0ff',
                                color: '#00f0ff',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Edit complete product details"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete "${product.name}" from MongoDB database?`)) {
                                  onDeleteProduct && onDeleteProduct(product.id);
                                }
                              }}
                              style={{
                                backgroundColor: 'rgba(255, 0, 85, 0.15)',
                                border: '1px solid #ff0055',
                                color: '#ff0055',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              title="Delete product from database"
                            >
                              <Trash2 size={13} />
                              <span>Del</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* VISUAL GRID CARDS VIEW */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1.2rem'
            }}>
              {filteredProducts.map((product) => {
                const CatIcon = CATEGORY_ICONS[product.category] || Cpu;
                const catColor = CATEGORY_COLORS[product.category] || '#00f0ff';
                const stock = typeof product.stock === 'number' ? product.stock : 10;
                const isLowStock = stock <= 5 && stock > 0;
                const isOutOfStock = stock === 0;
                const discountPercent = (product.originalPrice && product.originalPrice > product.price)
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: '#0c0f1a',
                      border: '1px solid rgba(0, 240, 255, 0.18)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = '#00f0ff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.18)';
                    }}
                  >
                    {/* Card Header Strip */}
                    <div style={{
                      backgroundColor: '#101424',
                      padding: '0.6rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <span style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}40`,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CatIcon size={12} />
                        {CATEGORY_NAMES[product.category] || product.category}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          onClick={() => handleCopy(product.id, `grid-${product.id}`)}
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.65rem',
                            color: '#00f0ff',
                            backgroundColor: 'rgba(0, 240, 255, 0.1)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Click to copy ID"
                        >
                          {copiedId === `grid-${product.id}` ? 'COPIED!' : product.id}
                        </span>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div
                      onClick={() => setPreviewImage(product)}
                      style={{
                        height: '180px',
                        backgroundColor: '#070910',
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                      title="Click to preview large image"
                    >
                      <img
                        src={product.image || `/api/images/${product.id}`}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => {
                          e.currentTarget.onerror = null;
                          const fallback = product.fallbackImage || `/images/${product.id}.jpg`;
                          if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                            e.currentTarget.src = fallback;
                          } else {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
                          }
                        }}
                      />

                      {/* Badges on Image */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px' }}>
                        {product.isFlashSale && (
                          <span style={{
                            backgroundColor: '#ff0055',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            boxShadow: '0 0 10px rgba(255, 0, 85, 0.6)'
                          }}>
                            🔥 FLASH SALE
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span style={{
                            backgroundColor: '#7000ff',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                        <span style={{
                          backgroundColor: isOutOfStock
                            ? '#ff4b4b'
                            : isLowStock
                              ? '#f59e0b'
                              : '#00ff66',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '2px 7px',
                          borderRadius: '4px'
                        }}>
                          {isOutOfStock ? 'OUT OF STOCK' : `${stock} IN STOCK`}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase' }}>
                          {product.brand || 'BRAND'}
                        </div>
                        <h4
                          onClick={() => onViewProductDetails && onViewProductDetails(product)}
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: '#fff',
                            margin: '4px 0 8px 0',
                            lineHeight: '1.3',
                            cursor: 'pointer'
                          }}
                        >
                          {product.name}
                        </h4>

                        {/* Specs Chips */}
                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.8rem' }}>
                            {Object.entries(product.specs).slice(0, 3).map(([k, v], i) => (
                              <span key={i} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                color: '#8e9bb0',
                                fontSize: '0.68rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255, 255, 255, 0.06)'
                              }}>
                                {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing & Stock Adjust */}
                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.8rem', marginTop: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00ff66', fontFamily: 'var(--font-stats)' }}>
                              Rs. {(product.price || 0).toLocaleString('en-LK')}
                            </div>
                            {product.originalPrice > product.price && (
                              <div style={{ fontSize: '0.72rem', color: '#687790', textDecoration: 'line-through' }}>
                                Rs. {product.originalPrice.toLocaleString('en-LK')}
                              </div>
                            )}
                          </div>

                          {/* Quick +/- Stock */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              onClick={() => onQuickUpdateStock && onQuickUpdateStock(product.id, Math.max(0, stock - 1))}
                              style={{
                                width: '26px',
                                height: '26px',
                                backgroundColor: '#161b2c',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 900
                              }}
                            >
                              -
                            </button>
                            <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 800, padding: '0 4px', minWidth: '24px', textAlign: 'center' }}>
                              {stock}
                            </span>
                            <button
                              onClick={() => onQuickUpdateStock && onQuickUpdateStock(product.id, stock + 1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                backgroundColor: '#161b2c',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 900
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <button
                            onClick={() => onEditProduct && onEditProduct(product)}
                            style={{
                              backgroundColor: 'rgba(0, 240, 255, 0.15)',
                              border: '1px solid #00f0ff',
                              color: '#00f0ff',
                              padding: '0.45rem',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={13} />
                            <span>Edit Item</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${product.name}" from MongoDB database?`)) {
                                onDeleteProduct && onDeleteProduct(product.id);
                              }
                            }}
                            style={{
                              backgroundColor: 'rgba(255, 0, 85, 0.15)',
                              border: '1px solid #ff0055',
                              color: '#ff0055',
                              padding: '0.45rem',
                              borderRadius: '8px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER BAR: SUMMARY STATS */}
        <div style={{
          backgroundColor: '#0c0f1a',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.8rem 1.8rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#8e9bb0'
        }}>
          <div>
            Showing <strong style={{ color: '#00f0ff' }}>{filteredProducts.length}</strong> of <strong style={{ color: '#fff' }}>{products.length}</strong> total products in MongoDB database
            {selectedCategory !== 'all' && <span> • Category: <strong style={{ color: '#fff' }}>{CATEGORY_NAMES[selectedCategory] || selectedCategory}</strong></span>}
            {searchQuery && <span> • Filtered by query: <strong style={{ color: '#00f0ff' }}>"{searchQuery}"</strong></span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Database URI: <code style={{ color: '#00ff66', fontFamily: 'monospace' }}>mongodb://127.0.0.1:27017/gamer_shop</code></span>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.35rem 0.9rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Close Window
            </button>
          </div>
        </div>

        {/* IMAGE PREVIEW LIGHTBOX MODAL */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '650px',
                width: '100%',
                backgroundColor: '#0c0f18',
                border: '1px solid #00f0ff',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 20px 60px rgba(0, 240, 255, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    {previewImage.name}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#00f0ff', fontFamily: 'monospace' }}>
                    ID: {previewImage.id} {previewImage._id ? `• MongoDB _id: ${previewImage._id}` : ''}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewImage(null)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{
                height: '360px',
                backgroundColor: '#05070d',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img
                  src={previewImage.image || `/api/images/${previewImage.id}`}
                  alt={previewImage.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    const fallback = previewImage.fallbackImage || `/images/${previewImage.id}.jpg`;
                    e.currentTarget.src = fallback;
                  }}
                />
              </div>

              <div style={{
                backgroundColor: '#121626',
                padding: '0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#8e9bb0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  Image URL in Database: <code style={{ color: '#00f0ff' }}>{previewImage.image || `/api/images/${previewImage.id}`}</code>
                </div>
                <button
                  onClick={() => handleCopy(previewImage.image || `/api/images/${previewImage.id}`, 'preview-url')}
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid #00f0ff',
                    color: '#00f0ff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === 'preview-url' ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
