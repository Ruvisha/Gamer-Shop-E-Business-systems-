import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, Gamepad2, ArrowRight, Crown } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gamerTag: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleQuickRoleLogin = (role) => {
    const isRoleAdmin = role === 'admin';
    const userProfile = {
      id: `user-${Date.now()}`,
      name: isRoleAdmin ? 'Admin Overlord' : 'CyberGamer_99',
      email: isRoleAdmin ? 'admin@gamershop.com' : 'user@gamershop.com',
      role: role,
      avatar: isRoleAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    onLoginSuccess(userProfile);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isRoleAdmin = selectedRole === 'admin' || formData.email.toLowerCase().includes('admin');
    const userProfile = {
      id: `user-${Date.now()}`,
      name: formData.gamerTag || (isRoleAdmin ? 'Admin Manager' : 'CyberGamer_99'),
      email: formData.email || (isRoleAdmin ? 'admin@gamershop.com' : 'user@gamershop.com'),
      role: isRoleAdmin ? 'admin' : 'user',
      avatar: isRoleAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
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
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#0c0f18',
          border: selectedRole === 'admin' ? '1px solid rgba(255, 0, 100, 0.5)' : '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: selectedRole === 'admin' ? '0 20px 60px rgba(255, 0, 100, 0.25)' : '0 20px 60px rgba(0, 240, 255, 0.25)',
          padding: '2.2rem',
          position: 'relative',
          borderRadius: '16px'
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
            background: selectedRole === 'admin' 
              ? 'linear-gradient(135deg, #ff0066 0%, #7000ff 100%)' 
              : 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem',
            boxShadow: selectedRole === 'admin' ? '0 0 20px rgba(255, 0, 100, 0.5)' : '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            {selectedRole === 'admin' ? <Crown size={28} color="#fff" /> : <Gamepad2 size={28} color="#000" />}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Orbitron', sans-serif" }}>
            {mode === 'login' ? 'SIGN IN TO GAMER SHOP' : 'CREATE ACCOUNT'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#8e9bb0', marginTop: '0.2rem' }}>
            Select your account role to continue
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          marginBottom: '1.2rem',
          padding: '4px',
          backgroundColor: '#121624',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedRole === 'user' ? '#00f0ff' : 'transparent',
              color: selectedRole === 'user' ? '#000' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={16} /> USER ROLE
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedRole === 'admin' ? '#ff0066' : 'transparent',
              color: selectedRole === 'admin' ? '#fff' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Crown size={16} /> ADMIN ROLE (CRUD)
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('user')}
            style={{
              flex: 1,
              padding: '0.6rem',
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              color: '#00f0ff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <User size={14} /> Fast Login: USER
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('admin')}
            style={{
              flex: 1,
              padding: '0.6rem',
              backgroundColor: 'rgba(255, 0, 100, 0.1)',
              border: '1px solid rgba(255, 0, 100, 0.3)',
              borderRadius: '8px',
              color: '#ff0066',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem'
            }}
          >
            <Crown size={14} /> Fast Login: ADMIN
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.4rem', fontWeight: 600 }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
              <input
                type="email"
                placeholder={selectedRole === 'admin' ? "admin@gamershop.com" : "user@gamershop.com"}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.8rem',
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.4rem', fontWeight: 600 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.8rem',
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="glow-btn"
            style={{
              marginTop: '0.5rem',
              padding: '0.9rem',
              background: selectedRole === 'admin' 
                ? 'linear-gradient(135deg, #ff0066 0%, #7000ff 100%)'
                : 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
              color: selectedRole === 'admin' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            LOG IN AS {selectedRole.toUpperCase()} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
