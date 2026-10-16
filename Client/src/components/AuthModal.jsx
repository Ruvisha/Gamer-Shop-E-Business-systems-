import React, { useState } from 'react';
import { X, Lock, Mail, Gamepad2, ArrowRight, AlertCircle, User, Phone, CheckCircle2, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, authReason }) {
  const [mode, setMode] = useState('login'); // 'login' (Sign In) or 'register' (Sign Up)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gamerTag: '',
    phone: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegisteredAlert, setIsRegisteredAlert] = useState(false);
  const [notRegisteredAlert, setNotRegisteredAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setIsRegisteredAlert(false);
    setNotRegisteredAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsRegisteredAlert(false);
    setNotRegisteredAlert(false);

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (mode === 'register') {
      if (!formData.gamerTag.trim()) {
        setErrorMessage('Please enter your Gamer Tag or display name.');
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter your password.');
        return;
      }
    }

    setIsLoading(true);

    const isRoleAdmin = formData.email.toLowerCase().includes('admin');
    const userRole = isRoleAdmin ? 'admin' : 'user';

    try {
      const apiPath = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register' ? {
        email: formData.email.trim(),
        password: formData.password,
        gamerTag: formData.gamerTag.trim(),
        phone: formData.phone.trim(),
        role: userRole
      } : {
        email: formData.email.trim(),
        password: formData.password
      };

      let response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (!response) {
        response = await fetch(`http://localhost:3000${apiPath}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch((err) => {
          throw new Error('Could not connect to authentication server. Please ensure the backend is running.');
        });
      }

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setIsLoading(false);
        onLoginSuccess(data.user);
        onClose();
        return;
      }

      // Handle specific registration / signin conditions
      setIsLoading(false);
      if (data.isRegistered === true) {
        setIsRegisteredAlert(true);
        setErrorMessage(data.error || 'This email is already registered. Please sign in instead.');
      } else if (data.isRegistered === false) {
        setNotRegisteredAlert(true);
        setErrorMessage(data.error || 'No account found with this email. Please sign up first.');
      } else {
        setErrorMessage(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.warn("Server auth endpoint offline:", err.message);
      setIsLoading(false);
      setErrorMessage(`Server connection error (${err.message}). Ensure the backend server is running.`);
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
          maxWidth: '480px',
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
            background: mode === 'login' 
              ? 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)' 
              : 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.8rem',
            boxShadow: mode === 'login' ? '0 0 20px rgba(0, 240, 255, 0.4)' : '0 0 20px rgba(255, 0, 85, 0.4)'
          }}>
            {mode === 'login' ? <Gamepad2 size={28} color="#000" /> : <UserPlus size={28} color="#fff" />}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Orbitron', sans-serif" }}>
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT (SIGN UP)'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#8e9bb0', marginTop: '0.2rem' }}>
            {mode === 'login' 
              ? 'Enter your registered email and password to validate your session' 
              : 'Register your details to create an account in Gamer Shop'}
          </p>
        </div>

        {/* Segmented Mode Tabs: SIGN IN vs SIGN UP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          backgroundColor: '#121624',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            style={{
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'login' ? '#00f0ff' : 'transparent',
              color: mode === 'login' ? '#000' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={15} />
            <span>SIGN IN</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            style={{
              padding: '0.65rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: mode === 'register' ? '#ff0055' : 'transparent',
              color: mode === 'register' ? '#fff' : '#8e9bb0',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={15} />
            <span>SIGN UP</span>
          </button>
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

        {/* Dynamic Registration Status Guidance Alerts */}
        {isRegisteredAlert && (
          <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid #eab308',
            color: '#fef08a',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#eab308' }}>
              <AlertCircle size={16} />
              <span>ALREADY REGISTERED</span>
            </div>
            <span>You already have an account with this email. Please switch to Sign In to validate your password.</span>
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              style={{
                alignSelf: 'flex-start',
                marginTop: '4px',
                padding: '0.35rem 0.8rem',
                backgroundColor: '#eab308',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              👉 SWITCH TO SIGN IN
            </button>
          </div>
        )}

        {notRegisteredAlert && (
          <div style={{
            backgroundColor: 'rgba(0, 240, 255, 0.15)',
            border: '1px solid #00f0ff',
            color: '#cffafe',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#00f0ff' }}>
              <AlertCircle size={16} />
              <span>NOT REGISTERED YET</span>
            </div>
            <span>No account was found with <strong>{formData.email}</strong>. Please switch to Sign Up to register and save your details.</span>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              style={{
                alignSelf: 'flex-start',
                marginTop: '4px',
                padding: '0.35rem 0.8rem',
                backgroundColor: '#00f0ff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              👉 SWITCH TO SIGN UP
            </button>
          </div>
        )}

        {/* Generic Error Alert */}
        {errorMessage && !isRegisteredAlert && !notRegisteredAlert && (
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.35rem', fontWeight: 600 }}>
                GAMER TAG / FULL NAME <span style={{ color: '#ff0055' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
                <input
                  type="text"
                  placeholder="e.g. CyberViper99"
                  value={formData.gamerTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, gamerTag: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.8rem',
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
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.35rem', fontWeight: 600 }}>
              EMAIL ADDRESS <span style={{ color: '#00f0ff' }}>*</span>
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
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
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

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.35rem', fontWeight: 600 }}>
                PHONE NUMBER (OPTIONAL)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
                <input
                  type="text"
                  placeholder="e.g. 0771234567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.8rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.35rem', fontWeight: 600 }}>
              PASSWORD {mode === 'register' && '(MIN 6 CHARACTERS)'} <span style={{ color: '#00f0ff' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
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
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '0.35rem', fontWeight: 600 }}>
                CONFIRM PASSWORD <span style={{ color: '#ff0055' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52607b' }} />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.8rem',
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
            disabled={isLoading}
            className="glow-btn"
            style={{
              marginTop: '0.5rem',
              padding: '0.9rem',
              background: mode === 'login' 
                ? 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)' 
                : 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
              color: mode === 'login' ? '#000' : '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <span>VALIDATING CREDENTIALS...</span>
            ) : mode === 'login' ? (
              <><span>SIGN IN</span> <ArrowRight size={18} /></>
            ) : (
              <><span>CREATE ACCOUNT & SIGN IN</span> <CheckCircle2 size={18} /></>
            )}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '0.82rem', color: '#8e9bb0' }}>
            {mode === 'login' ? "Don't have an account yet? " : "Already registered your account? "}
          </span>
          <button
            type="button"
            onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'login' ? '#00f0ff' : '#ff0055',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Create an Account (Sign Up)' : 'Sign In with Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
