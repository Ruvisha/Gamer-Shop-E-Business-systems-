import React, { useState } from 'react';
import { ShoppingBag, Search, Wrench, Heart, Zap, Menu, X, ShieldCheck, User, LogOut, SlidersHorizontal } from 'lucide-react';

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
  activeSection,
  setActiveSection
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={14} color="#00f0ff" />
          <span><strong style={{ color: '#00f0ff' }}>FLASH SALE:</strong> Up to 30% OFF RTX GPUs & Ryzen CPUs!</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid #202738', paddingLeft: '1.5rem' }}>
          <ShieldCheck size={14} color="#00ff66" />
          <span>3-Year Official Manufacturer Warranty on All Parts</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '1.5rem'
      }}>
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setActiveSection && setActiveSection('home'); }}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
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
            <Zap size={24} color="#000" fill="#000" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '1px',
              color: '#fff',
              display: 'block',
              lineHeight: 1
            }}>
              GAMER <span className="text-cyan">SHOP</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              color: '#8e9bb0',
              fontFamily: 'var(--font-stats)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              ULTIMATE HARDWARE
            </span>
          </div>
        </a>

        {/* Live Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '440px',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search GPUs, CPUs, DDR5 RAM, Liquid Coolers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#121624',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '0.65rem 1rem 0.65rem 2.8rem',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
          />
          <Search size={18} color="#8e9bb0" style={{
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

        {/* Upper Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
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

          {/* Upper Right Register / Sign In Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#121624', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #00f0ff' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#00f0ff', fontFamily: 'var(--font-heading)' }}>
                {user.name}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                style={{ background: 'none', border: 'none', color: '#ff0055', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
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
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 4px 15px rgba(112, 0, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <User size={16} />
              <span>SIGN IN / REGISTER</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
