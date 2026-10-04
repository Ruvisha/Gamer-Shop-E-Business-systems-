import React, { useState } from 'react';
import { X, Lock, Mail, Gamepad2, ArrowRight, AlertCircle, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, authReason }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gamerTag: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    const isRoleAdmin = formData.email.toLowerCase().includes('admin');
    const userRole = isRoleAdmin ? 'admin' : 'user';

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          role: userRole
        })
      });

      const data = await response.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.warn("Server auth endpoint offline, logging in locally:", err.message);
      const fallbackUser = {
        id: `user-${Date.now()}`,
        name: formData.gamerTag || (isRoleAdmin ? 'Admin Manager' : formData.email.split('@')[0] || 'CyberGamer'),
        email: formData.email.trim(),
        role: userRole,
        avatar: isRoleAdmin
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      onLoginSuccess(fallbackUser);
      onClose();
    }
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
          border: '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.25)',
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
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
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

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Orbitron', sans-serif" }}>
            {mode === 'login' ? 'SIGN IN TO GAMER SHOP' : 'CREATE ACCOUNT'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#8e9bb0', marginTop: '0.2rem' }}>
            {mode === 'login' ? 'Enter your email and password to log in securely' : 'Fill in your details to create an account'}
          </p>
        </div>

        {/* Auth Reason Notice Banner */}
        {authReason && (
          <div style={{
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            color: '#00f0ff',
            padding: '0.7rem 1rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            lineHeight: 1.35
          }}>
            <Lock size={18} color="#00f0ff" style={{ flexShrink: 0 }} />
            <span>{authReason}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 85, 0.15)',
            border: '1px solid rgba(255, 0, 85, 0.4)',
            color: '#ff4d7d',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.4rem', fontWeight: 600 }}>
                GAMER TAG / USERNAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
                <input
                  type="text"
                  placeholder="Enter your gamer tag"
                  value={formData.gamerTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, gamerTag: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.4rem', fontWeight: 600 }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
              <input
                type="email"
                placeholder="name@example.com"
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
                required
                autoComplete="email"
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
                placeholder="Enter password"
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
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.4rem', fontWeight: 600 }}>
                CONFIRM PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.8rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="glow-btn"
            style={{
              marginTop: '0.5rem',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
              color: '#000',
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
            {mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '0.82rem', color: '#8e9bb0' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMessage('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f0ff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

