import React from 'react';
import { Cpu, ArrowRight, Zap, Flame, ShieldCheck, Wrench, Sparkles } from 'lucide-react';

export default function GearUpBanner({ onExploreClick, onBuilderClick }) {
  const bgImageUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80';
  const fallbackBgUrl = 'gaminpc.jpg';

  return (
    <section style={{
      padding: '3rem 0',
      backgroundColor: '#07080c',
      position: 'relative'
    }}>
      <div className="container">
        <div 
          className="cyber-card" 
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.15)',
            minHeight: '340px',
            display: 'flex',
            alignItems: 'center',
            padding: '3.5rem 2.5rem'
          }}
        >
          {/* Background Image Container with Cyberpunk Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImageUrl}), url(${fallbackBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.65) contrast(1.15)',
            transform: 'scale(1.02)',
            transition: 'transform 0.5s ease'
          }} />

          {/* Dark Neon Gradient Mask */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(7, 9, 17, 0.95) 0%, rgba(7, 9, 17, 0.82) 50%, rgba(7, 9, 17, 0.45) 100%)',
            zIndex: 1
          }} />

          {/* Radial Glow Ambient Lights */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2
          }} />

          <div style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255, 0, 85, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2
          }} />

          {/* Banner Main Content */}
          <div style={{ position: 'relative', zIndex: 5, maxWidth: '680px' }}>
            {/* Top Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid #00f0ff',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#00f0ff',
              fontFamily: 'var(--font-stats)',
              letterSpacing: '1.5px',
              marginBottom: '1.2rem',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
            }}>
              <Sparkles size={14} color="#00f0ff" />
              <span>NEXT-LEVEL GAMING HARDWARE 2026</span>
            </div>

            {/* Main Headline */}
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Gear up your gaming.{' '}
              <span className="text-gradient" style={{ display: 'inline-block' }}>
                Find your Engines.
              </span>
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.05rem',
              color: '#c2d1e8',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '580px'
            }}>
              Unleash maximum FPS with custom-tuned liquid rigs, extreme overclocked GPUs, and ultra-low latency hardware built for ultimate victory.
            </p>

            {/* Spec Features Grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.8rem',
              marginBottom: '2rem'
            }}>
              {[
                { icon: Cpu, label: 'CUSTOM TUNED ENGINES' },
                { icon: Flame, label: 'MAX FPS PERFORMANCE' },
                { icon: Zap, label: 'ZERO-LATENCY' },
                { icon: ShieldCheck, label: '3-YR WARRANTY' }
              ].map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: 'rgba(18, 22, 36, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: 'var(--font-stats)'
                    }}
                  >
                    <Icon size={14} color="#00f0ff" />
                    <span>{spec.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={onExploreClick}
                className="btn-primary"
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '0.92rem'
                }}
              >
                <span>EXPLORE ENGINES & RIGS</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onBuilderClick}
                className="btn-secondary"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem'
                }}
              >
                <Wrench size={18} color="#00f0ff" />
                <span>START CUSTOM BUILD</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
