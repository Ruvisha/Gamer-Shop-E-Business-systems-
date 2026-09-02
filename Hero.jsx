import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Truck, Award, ArrowRight, Cpu, Wrench, ChevronLeft, ChevronRight, Sparkles, Flame, Percent } from 'lucide-react';

export default function Hero({ onExploreClick, onBuilderClick }) {
  const slides = [
    {
      id: 'rtx5090',
      badge: '🔥 NEW RELEASE 2026',
      badgeColor: '#00f0ff',
      title: 'NEXT-GEN GRAPHICS UNLEASHED',
      subtitle: 'NVIDIA RTX 5090 OC GDDR7X 32GB',
      description: 'Experience 4K 240Hz ultra ray tracing performance with 32GB GDDR7 memory and DLSS 4 AI frame generation.',
      image: '/hero-rtx5090.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      specs: [
        { label: 'BOOST CLOCK', value: '2900 MHz' },
        { label: 'VRAM MEMORY', value: '32GB GDDR7X' },
        { label: 'AVAILABILITY', value: 'IN STOCK NOW', valueColor: '#00ff66' }
      ],
      primaryCta: 'Explore Flagship GPUs',
      primaryAction: 'catalog',
      secondaryCta: 'Build Custom Rig',
      secondaryAction: 'builder'
    },
    {
      id: 'builder',
      badge: '🛠️ INTERACTIVE CONFIGURATOR',
      badgeColor: '#7000ff',
      title: 'BUILD & CUSTOMIZE YOUR DREAM PC',
      subtitle: 'Real-Time Compatibility & Power Calculator',
      description: 'Select matching CPUs, liquid coolers, DDR5 RAM & Gen5 NVMe SSDs with instant power draw verification.',
      image: '/hero-builder.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      specs: [
        { label: 'COMPATIBILITY', value: '100% VERIFIED' },
        { label: 'POWER CHECK', value: 'AUTOMATIC' },
        { label: 'WARRANTY', value: '3-YR OFFICIAL', valueColor: '#00f0ff' }
      ],
      primaryCta: 'Launch PC Builder',
      primaryAction: 'builder',
      secondaryCta: 'Browse Components',
      secondaryAction: 'catalog'
    },
    {
      id: 'flashsales',
      badge: '⚡ LIMITED TIME FLASH DEALS',
      badgeColor: '#ff0055',
      title: 'UP TO 30% OFF PREMIUM HARDWARE',
      subtitle: 'Ryzen 9 7950X3D & Samsung 990 Pro SSDs',
      description: 'Insane discounts on top-tier processors, ultra-fast PCIe 5.0 SSD storage, and 240Hz OLED gaming monitors.',
      image: '/hero-flashsale.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      specs: [
        { label: 'MAX DISCOUNT', value: 'UP TO 30% OFF', valueColor: '#ff0055' },
        { label: 'EXPRESS SHIP', value: '24H DISPATCH' },
        { label: 'DEAL STATUS', value: 'LIVE NOW' }
      ],
      primaryCta: 'Shop Flash Deals',
      primaryAction: 'deals',
      secondaryCta: 'View All Hardware',
      secondaryAction: 'catalog'
    },
    {
      id: 'prebuilts',
      badge: '🏆 EDITOR\'S CHOICE BEAST',
      badgeColor: '#ffaa00',
      title: 'CUSTOM HARD-LINE LIQUID RIGS',
      subtitle: 'Cyberpunk Beast Station 2026 Edition',
      description: 'Pre-assembled and stress-tested gaming rigs engineered for silent acoustics, extreme overclocking, and max FPS.',
      image: '/hero-prebuilt.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
      specs: [
        { label: 'COOLING', value: 'CUSTOM LIQUID' },
        { label: 'MEMORY', value: '64GB DDR5' },
        { label: 'TESTING', value: '24H STRESS-TESTED', valueColor: '#00ff66' }
      ],
      primaryCta: 'Explore Custom Rigs',
      primaryAction: 'builder',
      secondaryCta: 'Shop Hardware',
      secondaryAction: 'catalog'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slideDuration, setSlideDuration] = useState(4); // default 4 seconds
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slideshow timer
  useEffect(() => {
    if (isHovered || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, slideDuration * 1000);

    return () => clearInterval(timer);
  }, [isHovered, isPaused, slideDuration, slides.length]);

  const activeSlide = slides[currentSlide];

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleCtaClick = (action) => {
    if (action === 'builder' && onBuilderClick) {
      onBuilderClick();
    } else if (onExploreClick) {
      onExploreClick();
    }
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '3.5rem 0 2.5rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#070911'
      }}
    >
      {/* Background Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(112, 0, 255, 0.1) 50%, transparent 80%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Carousel Header & Time Controls Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Badge & Time Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0, 240, 255, 0.1)',
              border: `1px solid ${activeSlide.badgeColor}`,
              borderRadius: '20px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: activeSlide.badgeColor,
              fontFamily: 'var(--font-stats)',
              letterSpacing: '1px'
            }}>
              <Sparkles size={14} color={activeSlide.badgeColor} />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Time Timer Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#121624',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              color: '#8e9bb0',
              fontFamily: 'var(--font-stats)'
            }}>
              <span>ROTATE TIMER:</span>
              {[3, 5, 8].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSlideDuration(sec)}
                  style={{
                    backgroundColor: slideDuration === sec ? activeSlide.badgeColor : 'transparent',
                    color: slideDuration === sec ? '#000' : '#8e9bb0',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sec}s
                </button>
              ))}

              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
                style={{
                  backgroundColor: isPaused ? '#ff0055' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginLeft: '4px'
                }}
              >
                {isPaused ? 'PAUSED' : 'AUTO'}
              </button>
            </div>
          </div>

          {/* Controls: Prev / Next Buttons & Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  title={`Go to slide ${idx + 1}`}
                  style={{
                    width: idx === currentSlide ? '28px' : '9px',
                    height: '9px',
                    borderRadius: '5px',
                    backgroundColor: idx === currentSlide ? activeSlide.badgeColor : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={handlePrevSlide}
                style={{
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNextSlide}
                style={{
                  backgroundColor: '#121624',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00f0ff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Slide Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          minHeight: '380px'
        }}>
          {/* Left Text & CTAs */}
          <div key={`text-${activeSlide.id}`} className="animate-fadeIn">
            <h1 style={{
              fontSize: '2.8rem',
              lineHeight: 1.12,
              fontWeight: 900,
              marginBottom: '0.6rem',
              color: '#fff'
            }}>
              {activeSlide.title.split(' ')[0]}{' '}
              <span className="text-gradient">
                {activeSlide.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <h3 style={{
              fontSize: '1.2rem',
              color: activeSlide.badgeColor,
              fontWeight: 700,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)'
            }}>
              {activeSlide.subtitle}
            </h3>

            <p style={{
              fontSize: '1.02rem',
              color: '#8e9bb0',
              marginBottom: '2rem',
              lineHeight: 1.6,
              maxWidth: '540px'
            }}>
              {activeSlide.description}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <button
                onClick={() => handleCtaClick(activeSlide.primaryAction)}
                className="btn-primary"
              >
                <span>{activeSlide.primaryCta}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => handleCtaClick(activeSlide.secondaryAction)}
                className="btn-secondary"
              >
                <Wrench size={18} color="#00f0ff" />
                <span>{activeSlide.secondaryCta}</span>
              </button>
            </div>

            {/* Trust Guarantee Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              paddingTop: '1.2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={20} color="#00f0ff" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Fast Express</div>
                  <div style={{ fontSize: '0.7rem', color: '#8e9bb0' }}>24-48h Delivery</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color="#00ff66" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>100% Genuine</div>
                  <div style={{ fontSize: '0.7rem', color: '#8e9bb0' }}>Direct Factory</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Award size={20} color="#ffaa00" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>4.9★ Rated</div>
                  <div style={{ fontSize: '0.7rem', color: '#8e9bb0' }}>10,000+ Gamers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Banner Card with Image & Specs */}
          <div key={`img-${activeSlide.id}`} className="animate-fadeIn" style={{ position: 'relative' }}>
            <div className="cyber-card" style={{
              padding: '1.4rem',
              background: 'linear-gradient(135deg, rgba(20, 25, 40, 0.95) 0%, rgba(10, 12, 20, 0.98) 100%)',
              border: `1px solid ${activeSlide.badgeColor}`,
              boxShadow: `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px ${activeSlide.badgeColor}33`
            }}>
              {/* Product Badge Overlay */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.82)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: `1px solid ${activeSlide.badgeColor}`,
                fontSize: '0.75rem',
                color: activeSlide.badgeColor,
                fontFamily: 'var(--font-stats)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Cpu size={14} color={activeSlide.badgeColor} />
                {activeSlide.subtitle}
              </div>

              {/* Main Banner Image */}
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = activeSlide.fallbackImage;
                }}
                style={{
                  width: '100%',
                  height: '310px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}
              />

              {/* Specs Bar under image */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                backgroundColor: '#07080c',
                padding: '0.75rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center'
              }}>
                {activeSlide.specs.map((spec, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.68rem', color: '#8e9bb0', textTransform: 'uppercase' }}>
                      {spec.label}
                    </div>
                    <div style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: spec.valueColor || activeSlide.badgeColor,
                      fontFamily: 'var(--font-stats)'
                    }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
