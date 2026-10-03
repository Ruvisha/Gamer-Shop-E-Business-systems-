import React, { useState } from 'react';
import { ShoppingBag, Search, Wrench, Heart, Zap, Menu, X, ShieldCheck, User, LogOut, Plus, Crown } from 'lucide-react';

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
  activeSection,
  setActiveSection
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

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
          {/* Left Spacer for symmetry */}
          <div style={{ flex: 1, minWidth: '100px' }} />

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
            {/* Admin Add Product Button (Only visible for Admins) */}
            {isAdmin && (
              <button
                onClick={onOpenAddProductModal}
                style={{
                  background: 'linear-gradient(135deg, #ff0066 0%, #7000ff 100%)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.82rem',
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
                <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: isAdmin ? '1px solid #ff0066' : '1px solid #00f0ff' }} />
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

        {/* Lower Row: Search Bar (Positioned directly underneath Gamer Shop Title) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <input
            type="text"
            placeholder="Search GPUs, CPUs, Gaming Rigs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#121624',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: '24px',
              padding: '0.65rem 1rem 0.65rem 2.8rem',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 240, 255, 0.25)'}
          />
          <Search size={18} color="#00f0ff" style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#8e9bb0',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
