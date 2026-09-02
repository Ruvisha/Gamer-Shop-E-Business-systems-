import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Zap } from 'lucide-react';
import { products } from './products';

export default function FlashSale({ onAddToCart, onQuickView }) {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleItems = products.filter(p => p.isFlashSale).slice(0, 4);

  return (
    <section style={{
      padding: '3.5rem 0',
      backgroundColor: '#0c0e17',
      borderBottom: '1px solid rgba(255, 0, 85, 0.15)'
    }}>
      <div className="container">
        {/* Banner Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          backgroundColor: 'rgba(255, 0, 85, 0.08)',
          border: '1px solid rgba(255, 0, 85, 0.3)',
          borderRadius: '16px',
          padding: '1.2rem 1.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#ff0055',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)'
            }}>
              <Flame size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 900, lineHeight: 1.1 }}>
                FLASH DEALS OF THE DAY
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#ff0055', fontWeight: 700, fontFamily: 'var(--font-stats)' }}>
                LIMITED TIME DISCOUNTS ON TOP GAMING PARTS
              </span>
            </div>
          </div>

          {/* Ticking Countdown Clock Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#8e9bb0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="#ff0055" />
              <span>ENDS IN:</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.4rem', fontFamily: 'var(--font-stats)', fontWeight: 900, fontSize: '1.2rem' }}>
              <span style={{ backgroundColor: '#181e2e', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ff0055' }}>
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span style={{ color: '#ff0055' }}>:</span>
              <span style={{ backgroundColor: '#181e2e', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ff0055' }}>
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span style={{ color: '#ff0055' }}>:</span>
              <span style={{ backgroundColor: '#181e2e', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #ff0055' }}>
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Flash Sale Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {flashSaleItems.map((product) => {
            const savings = (product.originalPrice - product.price).toFixed(2);
            return (
              <div key={product.id} className="cyber-card" style={{
                border: '1px solid rgba(255, 0, 85, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ padding: '1.2rem' }}>
                  {/* Discount tag */}
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#ff0055',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '0.8rem',
                    fontFamily: 'var(--font-stats)'
                  }}>
                    SAVE ${savings} NOW
                  </div>

                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.8rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => onQuickView(product)}
                  />

                  <h3 style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '0.5rem',
                    lineHeight: 1.3
                  }}>
                    {product.name}
                  </h3>

                  {/* Stock Bar */}
                  <div style={{ marginTop: '0.8rem', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#ff0055', fontWeight: 700, marginBottom: '2px' }}>
                      <span>Hurry! Almost Sold Out</span>
                      <span>{product.stock} units remaining</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#1a1f2c', borderRadius: '3px' }}>
                      <div style={{
                        width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: '#ff0055',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#5c687e', textDecoration: 'line-through' }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart button */}
                <div style={{ padding: '0 1.2rem 1.2rem' }}>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #ff0055 0%, #7000ff 100%)',
                      boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)'
                    }}
                  >
                    <ShoppingCart size={16} />
                    <span>CLAIM DEAL</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
