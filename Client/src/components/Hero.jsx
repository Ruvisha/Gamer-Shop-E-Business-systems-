import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, Truck, Award, ArrowRight, Cpu, Wrench, 
  ChevronLeft, ChevronRight, Sparkles, Flame, Play, Pause, 
  CheckCircle2, RefreshCw, Layers, Star, ExternalLink, ChevronDown
} from 'lucide-react';

export default function Hero({ onExploreClick, onBuilderClick }) {
  const slides = [
    {
      id: 'rtx5090',
      badge: 'FLAGSHIP GRAPHICS',
      tagline: 'NEXT-GEN PERFORMANCE',
      badgeColor: '#00f0ff',
      accentGlow: 'rgba(0, 240, 255, 0.25)',
      title: "NEXT-GEN 4K GAMING POWERHOUSE.",
      subtitle: 'NVIDIA GeForce RTX 5090 OC 32GB GDDR7X',
      description: 'Engineered for extreme 4K 240Hz ray tracing, advanced AI frame generation, and liquid-cooled thermal efficiency. Available for immediate dispatch.',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: '/msig1.jpg',
      specs: [
        { label: 'BOOST CLOCK', value: '2.90 GHz' },
        { label: 'VRAM MEMORY', value: '32GB GDDR7X' },
        { label: 'AVAILABILITY', value: 'IN STOCK', valueColor: '#00ff66' }
      ],
      primaryCta: 'Explore Flagship GPUs',
      primaryAction: 'catalog',
      secondaryCta: 'Launch PC Builder',
      secondaryAction: 'builder'
    },
    {
      id: 'builder',
      badge: 'CUSTOM RIG CONFIGURATOR',
      tagline: 'REAL-TIME POWER & SPECS CHECK',
      badgeColor: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.25)',
      title: 'DESIGN YOUR ULTIMATE GAMING RIG.',
      subtitle: 'Interactive Custom PC Configurator',
      description: 'Select matching CPUs, liquid cooling, DDR5 RAM, and high-wattage PSUs with instant wattage & compatibility verification.',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: '/gaminpc.jpg',
      specs: [
        { label: 'COMPATIBILITY', value: '100% VERIFIED' },
        { label: 'POWER CHECK', value: 'AUTOMATIC' },
        { label: 'WARRANTY', value: '3-YR OFFICIAL', valueColor: '#00f0ff' }
      ],
      primaryCta: 'Start Building Now',
      primaryAction: 'builder',
      secondaryCta: 'View Parts Catalog',
      secondaryAction: 'catalog'
    },
    {
      id: 'flashsales',
      badge: 'EXCLUSIVE DEALS',
      tagline: 'LIMITED TIME OFFERS',
      badgeColor: '#ff0055',
      accentGlow: 'rgba(255, 0, 85, 0.25)',
      title: 'UNBEATABLE SAVINGS ON HARDWARE.',
      subtitle: 'Top-Tier CPUs, Motherboards & Gen5 SSDs',
      description: 'Upgrade your battle station with up to 30% off high-performance components. Limited inventory available with fast 24-hour shipping.',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: '/moandpo.jpg',
      specs: [
        { label: 'MAX DISCOUNT', value: 'UP TO 30% OFF', valueColor: '#ff0055' },
        { label: 'EXPRESS SHIP', value: '24H DISPATCH' },
        { label: 'DEAL STATUS', value: 'LIVE NOW' }
      ],
      primaryCta: 'Shop Flash Deals',
      primaryAction: 'catalog',
      secondaryCta: 'Build Custom Rig',
      secondaryAction: 'builder'
    },
    {
      id: 'prebuilts',
      badge: 'CUSTOM WATER-COOLED RIGS',
      tagline: 'PRE-TESTED BEAST STATIONS',
      badgeColor: '#eab308',
      accentGlow: 'rgba(234, 179, 8, 0.25)',
      title: 'MASTER-CRAFTED PRE-BUILT SYSTEMS.',
      subtitle: 'Hard-Line Liquid Cooled Gaming Rigs',
      description: 'Factory assembled, hand-tuned, and 24-hour stress tested for maximum FPS, zero thermal throttling, and whisper-quiet acoustics.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      fallbackImage: '/r9x3d.jpg',
      specs: [
        { label: 'COOLING', value: 'HARD-LINE LIQUID' },
        { label: 'MEMORY', value: '64GB DDR5 6000' },
        { label: 'STRESS TEST', value: 'PASSED 24H', valueColor: '#00ff66' }
      ],
      primaryCta: 'Configure Custom PC',
      primaryAction: 'builder',
      secondaryCta: 'Explore Rigs',
      secondaryAction: 'catalog'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Continuous slide autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const activeSlide = slides[currentSlide];

  const handleCtaClick = (action) => {
    if (action === 'builder' && onBuilderClick) {
      onBuilderClick();
    } else if (onExploreClick) {
      onExploreClick();
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 0 1.5rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#070912',
        backgroundImage: `
          radial-gradient(circle at 75% 30%, ${activeSlide.accentGlow} 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(15, 23, 42, 0.8) 0%, transparent 50%),
          linear-gradient(180deg, rgba(7, 9, 18, 0.92) 0%, rgba(7, 9, 18, 0.98) 100%)
        `,
        transition: 'background-image 0.8s ease'
      }}
    >
      {/* Background Subtle Geometric Grid Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* 1. Professional Control & Navigation Bar */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          {/* Slide Category Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: `1px solid ${isActive ? slide.badgeColor : 'transparent'}`,
                    color: isActive ? '#fff' : '#8e9bb0',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-stats)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ color: isActive ? slide.badgeColor : '#52607b' }}>
                    0{idx + 1}
                  </span>
                  <span>{slide.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Arrow Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {/* Prev / Next Arrows */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Hero Split Content View */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left Text & Value Props */}
          <div key={`slide-text-${activeSlide.id}`} className="animate-fadeIn">
            
            {/* Tagline Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: `${activeSlide.badgeColor}15`,
                border: `1px solid ${activeSlide.badgeColor}66`,
                borderRadius: '20px',
                padding: '0.35rem 0.9rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: activeSlide.badgeColor,
                fontFamily: 'var(--font-stats)',
                letterSpacing: '1px',
                marginBottom: '1.2rem'
              }}
            >
              <Sparkles size={14} color={activeSlide.badgeColor} />
              <span>{activeSlide.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: '2.9rem',
                lineHeight: 1.12,
                fontWeight: 900,
                marginBottom: '0.8rem',
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}
            >
              {activeSlide.title.split(' ')[0]}{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${activeSlide.badgeColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {activeSlide.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            {/* Subtitle */}
            <h3
              style={{
                fontSize: '1.15rem',
                color: activeSlide.badgeColor,
                fontWeight: 700,
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {activeSlide.subtitle}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.98rem',
                color: '#94a3b8',
                marginBottom: '2rem',
                lineHeight: 1.65,
                maxWidth: '560px'
              }}
            >
              {activeSlide.description}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <button
                onClick={() => handleCtaClick(activeSlide.primaryAction)}
                style={{
                  padding: '0.85rem 1.8rem',
                  background: `linear-gradient(135deg, ${activeSlide.badgeColor} 0%, #3b82f6 100%)`,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  boxShadow: `0 8px 25px ${activeSlide.badgeColor}40`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${activeSlide.badgeColor}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${activeSlide.badgeColor}40`;
                }}
              >
                <span>{activeSlide.primaryCta}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => handleCtaClick(activeSlide.secondaryAction)}
                style={{
                  padding: '0.85rem 1.6rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = activeSlide.badgeColor;
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <Wrench size={16} color={activeSlide.badgeColor} />
                <span>{activeSlide.secondaryCta}</span>
              </button>
            </div>

            {/* Professional Value Props Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.2rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={20} color="#00f0ff" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Fast Dispatch</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>24-48h Delivery</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color="#00ff66" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>100% Genuine</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Official Factory</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award size={20} color="#eab308" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>3-Yr Warranty</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Full Replacement</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Card Showcase */}
          <div key={`slide-card-${activeSlide.id}`} className="animate-fadeIn">
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                padding: '1.2rem',
                backgroundColor: 'rgba(15, 20, 32, 0.85)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${activeSlide.badgeColor}55`,
                boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px ${activeSlide.badgeColor}20`,
                transition: 'all 0.5s ease'
              }}
            >
              {/* Card Header Status Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.9rem',
                  paddingBottom: '0.6rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={15} color={activeSlide.badgeColor} />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {activeSlide.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#00ff66',
                      boxShadow: '0 0 8px #00ff66'
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#00ff66', fontWeight: 800 }}>
                    VERIFIED STOCK
                  </span>
                </div>
              </div>

              {/* High-Resolution Showcase Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '290px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = activeSlide.fallbackImage;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />
                
                {/* Dark Gradient Overlay over image bottom */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 9, 18, 0.85) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.8rem',
                    left: '0.8rem',
                    right: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 2
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    {activeSlide.subtitle}
                  </span>
                </div>
              </div>

              {/* Performance Metrics Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(7, 9, 18, 0.9)',
                  padding: '0.75rem 0.8rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center'
                }}
              >
                {activeSlide.specs.map((spec, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      {spec.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: spec.valueColor || activeSlide.badgeColor,
                        fontFamily: 'var(--font-stats)'
                      }}
                    >
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
        {/* 3. Bottom Scroll Prompt */}
        <div
          onClick={() => {
            window.scrollTo({ top: window.innerHeight - 60, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2.5rem',
            gap: '0.5rem',
            color: '#64748b',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-stats)',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00f0ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <span>SCROLL DOWN TO EXPLORE HARDWARE & DEALS</span>
          <ChevronDown size={16} color="#00f0ff" />
        </div>

      </div>
    </section>
  );
}
