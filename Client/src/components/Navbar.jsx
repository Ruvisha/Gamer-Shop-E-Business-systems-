import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Wrench, Heart, Zap, Menu, X, ShieldCheck, User, LogOut, Plus, Crown, PackageCheck, ChevronRight, Sparkles, ArrowRight, Package, Database, RefreshCw } from 'lucide-react';

function highlightSearchMatch(text = '', query = '') {
  if (!query || !text) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escapedQuery})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        style={{
          color: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.25)',
          padding: '0 2px',
          borderRadius: '3px',
          fontWeight: 800,
          textShadow: '0 0 8px rgba(0, 240, 255, 0.6)'
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onNavigateBuilder,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  user,
  onOpenAuth,
  onLogout,
  onOpenAddProductModal,
  onOpenAdminProducts,
  onOpenUserOrders,
  onOpenAdminOrders,
  activeSection,
  setActiveSection,
  products = [],
  onQuickView,
  onAddToCart,
  dbStatus,
  onOpenMongoInfo,
  onRefreshProducts,
  isRefreshingProducts
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const isAdmin = user?.role === 'admin';

  // Handle clicking outside of search bar or pressing Escape to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute live letter-by-letter matching products from MongoDB database catalog
  const matchingProducts = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return [];

    return (products || []).filter((product) => {
      const name = (product.name || '').toLowerCase();
      const brand = (product.brand || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const tag = (product.tag || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      return name.includes(q) || brand.includes(q) || category.includes(q) || tag.includes(q) || desc.includes(q);
    }).sort((a, b) => {
      const qLower = q;
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const aBrand = (a.brand || '').toLowerCase();
      const bBrand = (b.brand || '').toLowerCase();

      // Products starting with the entered letter/term appear first
      const aStarts = aName.startsWith(qLower) || aBrand.startsWith(qLower);
      const bStarts = bName.startsWith(qLower) || bBrand.startsWith(qLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, searchQuery]);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsSearchFocused(true);
    // As customer types first letter, ensure website displays catalog view
    if (val.trim().length > 0 && activeSection !== 'catalog' && activeSection !== 'product-details') {
      setActiveSection('catalog');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(7, 8, 12, 0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Top Banner Notice */}
      <div style={{
        backgroundColor: '#0c0f18',
        borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
        fontSize: '0.78rem',
        padding: '0.4rem 1rem',
        textAlign: 'center',
        color: '#8e9bb0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={14} color="#00f0ff" />
          <span><strong style={{ color: '#00f0ff' }}>FLASH SALE:</strong> Up to 30% OFF RTX GPUs & Ryzen CPUs!</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.75rem 1rem 0.9rem',
        gap: '0.75rem'
      }}>
        {/* Upper Row: Brand Logo Centered & Actions Right */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left: Live MongoDB Compass Status & Refresh (Admin Only) or Spacer for User Side */}
          <div style={{ flex: 1, minWidth: isAdmin ? '220px' : '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAdmin && (
              <>
                <button
                  onClick={onOpenMongoInfo}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    color: '#00f0ff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'Orbitron', sans-serif",
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to view live MongoDB Compass connection details & collections"
                >
                  <Database size={14} color="#00ed64" />
                  <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: dbStatus?.connected ? '#00ed64' : '#ffaa00', boxShadow: dbStatus?.connected ? '0 0 8px #00ed64' : 'none' }}></span>
                  <span>MONGO: {dbStatus?.database || 'gamer_shop'}</span>
                </button>

                <button
                  onClick={onRefreshProducts}
                  disabled={isRefreshingProducts}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.5rem',
                    color: '#fff',
                    cursor: isRefreshingProducts ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Sync live products immediately from MongoDB"
                >
                  <RefreshCw size={13} style={{ animation: isRefreshingProducts ? 'spin 1s linear infinite' : 'none' }} />
                </button>
              </>
            )}
          </div>

          {/* Center Section: GAMER SHOP Title */}
          <div
            onClick={() => setActiveSection('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
            }}>
              <Zap size={24} color="#000" />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                letterSpacing: '1.5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                fontFamily: "'Orbitron', sans-serif"
              }}>
                GAMER<span style={{ color: '#00f0ff', WebkitTextFillColor: '#00f0ff' }}>SHOP</span>
              </h1>
              {isAdmin && (
                <span style={{ fontSize: '0.65rem', color: '#ff0066', letterSpacing: '1.5px', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                  🛡️ ADMIN CONTROL PANEL
                </span>
              )}
            </div>
          </div>

          {/* Right Section: Upper Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.8rem', flex: 1 }}>
            {/* Admin Controls (Only visible for Admins) */}
            {isAdmin && (
              <>
                <button
                  onClick={onOpenAdminProducts}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(112, 0, 255, 0.3) 100%)',
                    border: '1px solid #00f0ff',
                    color: '#00f0ff',
                    borderRadius: '12px',
                    padding: '0.6rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontFamily: "'Orbitron', sans-serif",
                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
                  }}
                  title="View all products and live inventory from database"
                >
                  <Package size={16} color="#00f0ff" />
                  <span>MANAGE PRODUCTS ({products.length})</span>
                </button>

                <button
                  onClick={onOpenAddProductModal}
                  style={{
                    background: 'linear-gradient(135deg, #ff0066 0%, #7000ff 100%)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: "'Orbitron', sans-serif",
                    boxShadow: '0 4px 15px rgba(255, 0, 100, 0.4)'
                  }}
                >
                  <Plus size={16} />
                  <span>+ ADD PRODUCT</span>
                </button>

                <button
                  onClick={onOpenAdminOrders}
                  style={{
                    background: 'rgba(255, 0, 85, 0.15)',
                    border: '1px solid #ff0055',
                    color: '#ff0055',
                    borderRadius: '12px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: "'Orbitron', sans-serif",
                    boxShadow: '0 0 12px rgba(255, 0, 85, 0.3)'
                  }}
                  title="View customer purchases and approve orders"
                >
                  <ShieldCheck size={16} />
                  <span>APPROVE ORDERS</span>
                </button>
              </>
            )}

            {/* User My Orders Button */}
            {user && (
              <button
                onClick={onOpenUserOrders}
                style={{
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: '#00f0ff',
                  borderRadius: '12px',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                title="View your purchases and placement status"
              >
                <PackageCheck size={16} />
                <span>MY ORDERS</span>
              </button>
            )}

            {/* Custom PC Builder Button */}
            <button
              onClick={onNavigateBuilder}
              className="btn-outline-cyan"
              style={{ padding: '0.55rem 1rem' }}
            >
              <Wrench size={16} />
              <span>PC Builder</span>
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                background: '#121624',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0.65rem',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingBag size={20} color="#00f0ff" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#ff0055',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(255, 0, 85, 0.6)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Admin Authentication State */}
            {user ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#121624',
                padding: '0.4rem 0.8rem',
                borderRadius: '12px',
                border: isAdmin ? '1px solid rgba(255, 0, 100, 0.5)' : '1px solid rgba(0, 240, 255, 0.3)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isAdmin ? 'rgba(255, 0, 102, 0.15)' : 'rgba(0, 240, 255, 0.15)',
                  border: isAdmin ? '1px solid #ff0066' : '1px solid #00f0ff',
                  color: isAdmin ? '#ff0066' : '#00f0ff',
                  flexShrink: 0
                }}>
                  {isAdmin ? <Crown size={15} /> : <User size={15} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isAdmin ? '#ff0066' : '#00f0ff', lineHeight: 1 }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: '#8e9bb0', textTransform: 'uppercase', fontWeight: 700 }}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  style={{ background: 'none', border: 'none', color: '#ff0055', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px', marginLeft: '0.2rem' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'linear-gradient(135deg, #7000ff 0%, #00f0ff 100%)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(112, 0, 255, 0.3)'
                }}
              >
                <User size={16} />
                <span>SIGN IN</span>
              </button>
            )}
          </div>
        </div>

        {/* Lower Row: Search Bar with Live Instant Autocomplete Dropdown */}
        <div ref={searchContainerRef} style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
          <input
            type="text"
            placeholder="Search GPUs, CPUs, Motherboards, RAM, Cases..."
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setIsSearchFocused(true);
            }}
            style={{
              width: '100%',
              backgroundColor: '#121624',
              border: isSearchFocused && searchQuery.trim().length > 0 ? '1px solid #00f0ff' : '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: isSearchFocused && searchQuery.trim().length > 0 ? '16px 16px 0 0' : '24px',
              padding: '0.7rem 2.8rem 0.7rem 2.9rem',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: isSearchFocused && searchQuery.trim().length > 0
                ? '0 0 20px rgba(0, 240, 255, 0.35)'
                : '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
          />
          <Search size={18} color="#00f0ff" style={{
            position: 'absolute',
            left: '1.1rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              title="Clear search"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8e9bb0',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 0, 85, 0.2)';
                e.currentTarget.style.color = '#ff0055';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#8e9bb0';
              }}
            >
              <X size={14} />
            </button>
          )}

          {/* Live Instant Search Dropdown (Matches as each letter is typed) */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#0c0f18',
              border: '1px solid #00f0ff',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 240, 255, 0.25)',
              zIndex: 1200,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)'
            }}>
              {/* Dropdown Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 1rem',
                backgroundColor: 'rgba(0, 240, 255, 0.08)',
                borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
                fontSize: '0.72rem',
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '1px'
              }}>
                <span style={{ color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="#00f0ff" />
                  LIVE SEARCH RESULTS
                </span>
                <span style={{
                  backgroundColor: matchingProducts.length > 0 ? '#00f0ff' : 'rgba(255, 0, 85, 0.2)',
                  color: matchingProducts.length > 0 ? '#000' : '#ff0055',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 800
                }}>
                  {matchingProducts.length} {matchingProducts.length === 1 ? 'MATCH' : 'MATCHES'}
                </span>
              </div>

              {/* Matching Products List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {matchingProducts.length > 0 ? (
                  matchingProducts.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setIsSearchFocused(false);
                        if (onQuickView) onQuickView(product);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        gap: '0.8rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        backgroundColor: '#161a29',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = product.fallbackImage || '/images/gpu-1.jpg'; }}
                        />
                      </div>

                      {/* Title & Metadata */}
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: '#00f0ff',
                            backgroundColor: 'rgba(0, 240, 255, 0.15)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {product.category}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 600 }}>
                            {product.brand}
                          </span>
                          {product.isFlashSale && (
                            <span style={{
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              color: '#ff0055',
                              backgroundColor: 'rgba(255, 0, 85, 0.15)',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              SALE
                            </span>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {highlightSearchMatch(product.name, searchQuery)}
                        </div>
                      </div>

                      {/* Price & Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#00ff66', fontFamily: 'var(--font-stats)' }}>
                            Rs. {Number(product.price).toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: product.stock > 0 ? '#00f0ff' : '#ff0055' }}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                          </div>
                        </div>
                        <ChevronRight size={16} color="#8e9bb0" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: '#8e9bb0' }}>
                    <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700, marginBottom: '0.4rem' }}>
                      No components found matching "{searchQuery}"
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#687790', maxWidth: '320px', margin: '0 auto' }}>
                      Try typing a component category (GPU, CPU, RAM) or brand (ASUS, MSI, AMD, Intel, Corsair).
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown Footer Action */}
              {matchingProducts.length > 0 && (
                <div
                  onClick={() => {
                    setIsSearchFocused(false);
                    setActiveSection('catalog');
                  }}
                  style={{
                    padding: '0.7rem 1rem',
                    backgroundColor: '#121624',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#00f0ff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#121624';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    View all {matchingProducts.length} matching products in Catalog <ArrowRight size={14} />
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#8e9bb0', textTransform: 'uppercase' }}>
                    Instant Search
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
