import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: '#0e111a',
      color: '#fff',
      padding: '14px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(0, 240, 255, 0.4)',
      boxShadow: '0 10px 30px rgba(0, 240, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      animation: 'float 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {toast.type === 'cart' ? (
        <ShoppingBag size={20} color="#00f0ff" />
      ) : toast.type === 'success' ? (
        <CheckCircle2 size={20} color="#00ff66" />
      ) : (
        <AlertCircle size={20} color="#ff0055" />
      )}
      <div>
        <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#00f0ff', fontFamily: 'var(--font-heading)' }}>
          {toast.title || 'NOTIFICATION'}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#c0cbdf' }}>{toast.message}</div>
      </div>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#8e9bb0',
          cursor: 'pointer',
          marginLeft: '12px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
