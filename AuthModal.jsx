import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, Gamepad2, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gamerTag: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userProfile = {
      name: formData.gamerTag || (mode === 'login' ? 'CyberGamer_99' : 'ProGamer_X'),
      email: formData.email || 'gamer@gamershop.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    onLoginSuccess(userProfile);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9900,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.25)',
          padding: '2.2rem',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: '#151a28',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#8e9bb0',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            <Gamepad2 size={28} color="#000" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
            {mode === 'login' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE GAMER ACCOUNT'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#8e9bb0', marginTop: '0.2rem' }}>
            {mode === 'login' ? 'Access your saved PC builds, wishlist & order tracking' : 'Join the VIP Gamer Club & unlock 10% instant discount'}
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: '#121624',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'login' ? '#00f0ff' : 'transparent',
              color: mode === 'login' ? '#000' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.8rem',
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: mode === 'register' ? '#00f0ff' : 'transparent',
              color: mode === 'register' ? '#000' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.8rem',
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            REGISTER
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                GAMER TAG / ALIAS
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#8e9bb0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. CyberVortex_99"
                  required
                  value={formData.gamerTag}
                  onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem 0.65rem 2.4rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#8e9bb0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="gamer@domain.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#8e9bb0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            <span>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Social Auth */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.2rem',
          marginTop: '1.2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#5c687e', marginBottom: '0.8rem' }}>
            OR QUICK AUTH WITH
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                backgroundColor: '#5865F2',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Discord
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                backgroundColor: '#171a21',
                color: '#66c0f4',
                border: '1px solid #66c0f4',
                borderRadius: '8px',
                padding: '0.55rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Steam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
