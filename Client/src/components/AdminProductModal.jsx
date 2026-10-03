import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, ShieldAlert, Sparkles, Check, Package, DollarSign, Tag, Cpu } from 'lucide-react';
import { categories } from './products';

export default function AdminProductModal({ isOpen, onClose, onSaveProduct, initialProduct = null }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'gpu',
    brand: '',
    price: '',
    originalPrice: '',
    stock: '10',
    image: '',
    description: '',
    tag: 'NEW RELEASE'
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        id: initialProduct.id || '',
        name: initialProduct.name || '',
        category: initialProduct.category || 'gpu',
        brand: initialProduct.brand || '',
        price: initialProduct.price || '',
        originalPrice: initialProduct.originalPrice || '',
        stock: initialProduct.stock !== undefined ? String(initialProduct.stock) : '10',
        image: initialProduct.image || '',
        description: initialProduct.description || '',
        tag: initialProduct.tag || 'FEATURED'
      });
    } else {
      setFormData({
        id: '',
        name: '',
        category: 'gpu',
        brand: '',
        price: '',
        originalPrice: '',
        stock: '10',
        image: '',
        description: '',
        tag: 'NEW RELEASE'
      });
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    onSaveProduct({
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
      stock: parseInt(formData.stock || '10', 10)
    });
    onClose();
  };

  const isEditing = Boolean(initialProduct);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9950,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }} 
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(255, 0, 100, 0.4)',
          boxShadow: '0 20px 60px rgba(255, 0, 100, 0.2)',
          padding: '2rem',
          borderRadius: '16px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
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
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <span style={{
            background: 'rgba(255, 0, 100, 0.15)',
            border: '1px solid #ff0066',
            color: '#ff0066',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <ShieldAlert size={14} /> ADMIN PRODUCT MANAGEMENT
          </span>
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          fontFamily: "'Orbitron', sans-serif",
          marginBottom: '0.4rem'
        }}>
          {isEditing ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        </h2>
        <p style={{ color: '#8e9bb0', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {isEditing ? 'Modify item specifications, pricing & stock.' : 'Create a new gaming product entry for the store catalog.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Product Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
              PRODUCT TITLE *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. ROG Strix RTX 5090 OC 32GB"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                backgroundColor: '#131826',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category & Brand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
                CATEGORY *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#131826',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
                BRAND / MANUFACTURER
              </label>
              <input
                type="text"
                name="brand"
                placeholder="ASUS, MSI, AMD, Intel"
                value={formData.brand}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#131826',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Price, Original Price, Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
                PRICE ($) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                placeholder="1999.99"
                value={formData.price}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#131826',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, marginBottom: '0.4rem' }}>
                ORIG. PRICE ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="originalPrice"
                placeholder="2199.99"
                value={formData.originalPrice}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#131826',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, marginBottom: '0.4rem' }}>
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
                  padding: '0.8rem 1rem',
                  backgroundColor: '#131826',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
              IMAGE URL OR PATH
            </label>
            <input
              type="text"
              name="image"
              placeholder="/r9x3d.jpg or https://..."
              value={formData.image}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                backgroundColor: '#131826',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, marginBottom: '0.4rem' }}>
              DESCRIPTION
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="High-performance gaming product details..."
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                backgroundColor: '#131826',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.9rem',
                backgroundColor: '#151a28',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glow-btn"
              style={{
                flex: 2,
                padding: '0.9rem',
                background: 'linear-gradient(135deg, #ff0066, #7000ff)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255, 0, 100, 0.4)'
              }}
            >
              {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
              {isEditing ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
