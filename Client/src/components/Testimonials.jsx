import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { reviews } from './products';

export default function Testimonials() {
  return (
    <section style={{
      padding: '4rem 0',
      backgroundColor: '#07080c',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#00ff66',
            fontFamily: 'var(--font-stats)',
            letterSpacing: '1.5px',
            marginBottom: '0.4rem'
          }}>
            COMMUNITY FEEDBACK
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: 900 }}>
            TRUSTED BY <span className="text-gradient">PRO GAMERS & BUILDERS</span>
          </h2>
          <p style={{ color: '#8e9bb0', fontSize: '0.95rem' }}>
            Over 10,000+ custom gaming rigs built with components supplied by Gamer Shop.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="cyber-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} color="#ffaa00" fill="#ffaa00" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#00ff66' }}>
                    <ShieldCheck size={14} />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#d0d9e8', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '1rem'
              }}>
                <img 
                  src={rev.avatar} 
                  alt={rev.author}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #00f0ff' }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{rev.author}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>{rev.role}</div>
                  <div style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: 'var(--font-stats)', marginTop: '2px' }}>
                    Bought: {rev.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
