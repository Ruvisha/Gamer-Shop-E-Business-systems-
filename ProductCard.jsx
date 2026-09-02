import React from 'react';
import { Star, ShoppingCart, Eye, Zap, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="cyber-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    }}>
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {product.tag && (
            <span className="badge-tag badge-cyan">
              {product.tag}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="badge-tag badge-pink">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        <span style={{
          backgroundColor: product.stock <= 5 ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 255, 102, 0.2)',
          color: product.stock <= 5 ? '#ff0055' : '#00ff66',
          border: product.stock <= 5 ? '1px solid rgba(255, 0, 85, 0.4)' : '1px solid rgba(0, 255, 102, 0.4)',
          borderRadius: '4px',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '2px 6px',
          fontFamily: 'var(--font-stats)'
        }}>
          {product.stock <= 5 ? `ONLY ${product.stock} LEFT` : 'IN STOCK'}
        </span>
      </div>

      {/* Image Wrapper */}
      <div 
        onClick={() => onQuickView(product)}
        style={{
          position: 'relative',
          paddingTop: '65%',
          backgroundColor: '#07080c',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 60%, rgba(14, 17, 26, 0.9) 100%)'
        }} />
      </div>

      {/* Product Information Body */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand & Category */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem'
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#00f0ff',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '1px'
          }}>
            {product.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={12} color="#ffaa00" fill="#ffaa00" />
            <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-stats)' }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#5c687e' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.35,
            marginBottom: '0.8rem',
            cursor: 'pointer',
            height: '2.7em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00f0ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          {product.name}
        </h3>

        {/* Highlight Specs Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '1rem'
        }}>
          {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
            <span key={key} style={{
              backgroundColor: '#121624',
              color: '#8e9bb0',
              fontSize: '0.7rem',
              padding: '2px 7px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontFamily: 'var(--font-stats)'
            }}>
              {val}
            </span>
          ))}
        </div>

        {/* Price & Action Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.8rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'var(--font-stats)'
              }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '0.8rem',
                  color: '#5c687e',
                  textDecoration: 'line-through',
                  fontFamily: 'var(--font-stats)'
                }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onQuickView(product)}
              title="Quick View Specs"
              style={{
                backgroundColor: '#121624',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00f0ff';
                e.currentTarget.style.color = '#00f0ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#8e9bb0';
              }}
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => onAddToCart(product)}
              title="Add to Cart"
              style={{
                background: 'linear-gradient(135deg, #00f0ff 0%, #0088ff 100%)',
                border: 'none',
                color: '#000',
                borderRadius: '8px',
                padding: '0 10px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <ShoppingCart size={15} />
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
