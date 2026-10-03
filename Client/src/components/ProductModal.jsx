import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Zap, Truck, Check } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9000,
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
          maxWidth: '850px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.25)',
          padding: '2rem',
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
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Left Column: Image */}
          <div>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#07080c',
              marginBottom: '1rem'
            }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '0.8rem',
              fontSize: '0.78rem',
              color: '#8e9bb0',
              backgroundColor: '#121624',
              padding: '0.8rem 1rem',
              borderRadius: '8px'
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={16} color="#00ff66" />
                <span>Official Warranty</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={16} color="#00f0ff" />
                <span>Express Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Buy Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#00f0ff',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
              marginBottom: '0.3rem'
            }}>
              {product.brand} • {product.category.toUpperCase()}
            </span>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '0.6rem' }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} color="#ffaa00" fill={i < Math.floor(product.rating) ? '#ffaa00' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.8rem', color: '#5c687e' }}>({product.reviewsCount} Gamer Reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1rem', color: '#5c687e', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: '#8e9bb0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Specs Table */}
            <div style={{
              backgroundColor: '#121624',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <h4 style={{ fontSize: '0.8rem', color: '#00f0ff', fontFamily: 'var(--font-heading)', marginBottom: '0.6rem' }}>
                TECHNICAL SPECIFICATIONS:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.78rem' }}>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#5c687e', textTransform: 'uppercase', fontSize: '0.68rem' }}>{key}</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151a28',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0 0.5rem'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', color: '#fff', padding: '0.5rem 0.8rem', cursor: 'pointer', fontWeight: 800 }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.8rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-stats)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', color: '#fff', padding: '0.5rem 0.8rem', cursor: 'pointer', fontWeight: 800 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  onClose();
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <ShoppingBag size={18} />
                <span>Add {quantity} to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
