import React from 'react';
import { Star, ShoppingCart, Eye, Zap, ShieldCheck, Edit3, Trash2, ShieldAlert } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView, user, onEditProduct, onDeleteProduct }) {
  const isAdmin = user?.role === 'admin';
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="cyber-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      position: 'relative',
      border: isAdmin ? '1px solid rgba(255, 0, 100, 0.4)' : '1px solid rgba(0, 240, 255, 0.12)',
      boxShadow: isAdmin ? '0 4px 20px rgba(255, 0, 100, 0.15)' : 'none'
    }}>
      {/* Admin Quick Action Overlay Toolbar */}
      {isAdmin && (
        <div style={{
          backgroundColor: '#160814',
          borderBottom: '1px solid #ff0066',
          padding: '0.4rem 0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ff0066', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} /> ADMIN CONTROLS
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onEditProduct(product); }}
              title="Edit Product Details"
              style={{
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Edit3 size={11} /> EDIT
            </button>

            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                  onDeleteProduct(product.id);
                }
              }}
              title="Delete Product"
              style={{
                backgroundColor: 'rgba(255, 0, 85, 0.15)',
                border: '1px solid #ff0055',
                color: '#ff0055',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Trash2 size={11} /> DELETE
            </button>
          </div>
        </div>
      )}

      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: isAdmin ? '44px' : '12px',
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
          backgroundColor: '#0c0f18',
          overflow: 'hidden',
          cursor: 'pointer',
          marginTop: isAdmin ? '32px' : 0
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
            transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.brand || product.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={12} fill="#ffb700" color="#ffb700" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>{product.rating || '4.9'}</span>
            <span style={{ fontSize: '0.7rem', color: '#5c687e' }}>({product.reviewsCount || 12})</span>
          </div>
        </div>

        <h3 
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: '1.35',
            margin: '0 0 0.6rem 0',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h3>

        {/* Quick Specs Snippets */}
        {product.specs && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
            {Object.values(product.specs).slice(0, 2).map((val, idx) => (
              <span key={idx} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
        )}

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
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '0.8rem',
                  color: '#5c687e',
                  textDecoration: 'line-through',
                  fontFamily: 'var(--font-stats)'
                }}>
                  ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
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
