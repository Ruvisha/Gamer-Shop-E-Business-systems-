import React, { useState, useEffect } from 'react';
import { 
  Star, ShoppingBag, ShieldCheck, Zap, Truck, ArrowLeft, Check, 
  RotateCcw, Cpu, Wrench, Share2, Heart, Award, Sparkles, ChevronRight, MessageSquare 
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductDetailsPage({ 
  product, 
  allProducts, 
  onBack, 
  onAddToCart, 
  onViewProduct, 
  onOpenCart 
}) {
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'specs', 'reviews', 'shipping'
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) return null;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Filter related products in same category (excluding current)
  const relatedProducts = (allProducts || [])
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const galleryImages = [
    product.image,
    product.fallbackImage || product.image,
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80'
  ].filter(Boolean);

  return (
    <div style={{ padding: '2rem 0 4rem', backgroundColor: '#07080c', minHeight: '100vh' }}>
      <div className="container">

        {/* Top Navigation & Breadcrumbs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Back Button & Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: '#121624',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-heading)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#121624'}
            >
              <ArrowLeft size={16} />
              <span>Back to Hardware</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: '#8e9bb0',
              fontFamily: 'var(--font-stats)'
            }}>
              <span>HOME</span>
              <ChevronRight size={12} />
              <span>{product.category.toUpperCase()}</span>
              <ChevronRight size={12} />
              <span style={{ color: '#fff', fontWeight: 700 }}>{product.brand}</span>
            </div>
          </div>

          {/* Utility Actions */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              style={{
                backgroundColor: isWishlisted ? 'rgba(255, 0, 85, 0.15)' : '#121624',
                border: `1px solid ${isWishlisted ? '#ff0055' : 'rgba(255, 255, 255, 0.1)'}`,
                color: isWishlisted ? '#ff0055' : '#8e9bb0',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Heart size={16} fill={isWishlisted ? '#ff0055' : 'none'} color={isWishlisted ? '#ff0055' : '#8e9bb0'} />
              <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
            </button>

            <button
              onClick={handleShare}
              style={{
                backgroundColor: '#121624',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '10px',
                padding: '0.5rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <Share2 size={16} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Product Hero Display Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div className="cyber-card" style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#0c0f18',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 240, 255, 0.1)',
              marginBottom: '1.2rem',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Badges Overlay */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {product.tag && (
                  <span className="badge-tag badge-cyan" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    {product.tag}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="badge-tag badge-pink" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    -{discountPercent}% SPECIAL DEAL
                  </span>
                )}
              </div>

              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = product.fallbackImage || product.image;
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  padding: '1rem',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>

            {/* Thumbnail Selection Bar */}
            <div style={{
              display: 'flex',
              gap: '0.8rem',
              marginBottom: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '0.4rem'
            }}>
              {galleryImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgSrc)}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#0c0f18',
                    border: selectedImage === imgSrc ? '2px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    padding: '2px',
                    flexShrink: 0,
                    opacity: selectedImage === imgSrc ? 1 : 0.6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = product.image;
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Quick Guarantees Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.8rem',
              backgroundColor: '#0c0f18',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShieldCheck size={24} color="#00ff66" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>3-Year Warranty</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>Official Brand Coverage</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Truck size={24} color="#00f0ff" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Express Dispatch</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>24-48 Hours Delivery</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Zap size={24} color="#ffaa00" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>100% Authentic</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>Direct Factory Sealed</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <RotateCcw size={24} color="#ff0055" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Easy Returns</div>
                  <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>30-Day Money Back</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Specs, Buy Box */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Category & Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
              <span style={{
                backgroundColor: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                color: '#00f0ff',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '1px'
              }}>
                {product.brand.toUpperCase()}
              </span>

              <span style={{
                fontSize: '0.78rem',
                color: '#8e9bb0',
                fontFamily: 'var(--font-stats)',
                letterSpacing: '1px'
              }}>
                CATEGORY: {product.category.toUpperCase()}
              </span>
            </div>

            {/* Product Title */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.25,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)'
            }}>
              {product.name}
            </h1>

            {/* Reviews & Stock Status Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      color="#ffaa00"
                      fill={i < Math.floor(product.rating) ? '#ffaa00' : 'none'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-stats)' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#8e9bb0' }}>
                  ({product.reviewsCount} Verified Gamer Reviews)
                </span>
              </div>

              <div style={{
                backgroundColor: 'rgba(0, 255, 102, 0.1)',
                border: '1px solid rgba(0, 255, 102, 0.3)',
                color: '#00ff66',
                borderRadius: '20px',
                padding: '3px 12px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-stats)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#00ff66',
                  boxShadow: '0 0 8px #00ff66'
                }} />
                <span>IN STOCK • READY TO SHIP</span>
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#0c0f18',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8e9bb0', textTransform: 'uppercase', marginBottom: '2px' }}>
                  SPECIAL PRICE
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: '#fff',
                    fontFamily: 'var(--font-stats)'
                  }}>
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span style={{
                      fontSize: '1.2rem',
                      color: '#5c687e',
                      textDecoration: 'line-through',
                      fontFamily: 'var(--font-stats)'
                    }}>
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <div style={{
                  backgroundColor: 'rgba(255, 0, 85, 0.15)',
                  border: '1px solid #ff0055',
                  color: '#ff0055',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-stats)'
                }}>
                  SAVE ${(product.originalPrice - product.price).toFixed(2)} ({discountPercent}% OFF)
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.98rem',
              color: '#8e9bb0',
              lineHeight: 1.65,
              marginBottom: '1.5rem'
            }}>
              {product.description}
            </p>

            {/* Specs Quick Pill Highlights */}
            <div style={{
              backgroundColor: '#121624',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <h4 style={{
                fontSize: '0.82rem',
                color: '#00f0ff',
                fontFamily: 'var(--font-heading)',
                marginBottom: '0.8rem',
                letterSpacing: '1px'
              }}>
                ⚡ KEY PERFORMANCE HIGHLIGHTS:
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.8rem'
              }}>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      backgroundColor: '#0c0f18',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#5c687e', textTransform: 'uppercase' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Purchase Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Quantity Control */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#121624',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0 0.5rem'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 900,
                      fontSize: '1.1rem'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    padding: '0 1rem',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-stats)'
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 900,
                      fontSize: '1.1rem'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product);
                    }
                  }}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: '0.9rem 1.5rem',
                    fontSize: '1rem'
                  }}
                >
                  <ShoppingBag size={20} />
                  <span>ADD {quantity} TO CART</span>
                </button>
              </div>

              {/* Buy Now Instant Checkout Button */}
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  if (onOpenCart) onOpenCart();
                }}
                style={{
                  backgroundColor: '#151a28',
                  border: '1px solid #7000ff',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(112, 0, 255, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(112, 0, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#151a28'}
              >
                <Zap size={18} color="#7000ff" />
                <span>BUY NOW • INSTANT CHECKOUT</span>
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Information Tabs Section */}
        <div style={{
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '4rem'
        }}>
          {/* Tab Selection Header */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1rem',
            marginBottom: '1.8rem',
            overflowX: 'auto'
          }}>
            {[
              { id: 'overview', label: 'OVERVIEW & FEATURES' },
              { id: 'specs', label: 'FULL SPECIFICATIONS' },
              { id: 'reviews', label: `GAMER REVIEWS (${product.reviewsCount})` },
              { id: 'shipping', label: 'WARRANTY & SHIPPING' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid #00f0ff' : '1px solid transparent',
                  color: activeTab === tab.id ? '#00f0ff' : '#8e9bb0',
                  borderRadius: '10px',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ color: '#8e9bb0', lineHeight: 1.7 }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Engineered for Peak Performance & Extreme Acoustic Efficiency
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                The {product.name} is meticulously designed for high-demanding gamers, content creators, and PC hardware enthusiasts. Featuring next-generation architecture and premium manufacturing components, it delivers smooth thermal dissipation and exceptional frame rates under maximum load.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#121624',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <Cpu size={28} color="#00f0ff" style={{ marginBottom: '0.6rem' }} />
                  <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Advanced Cooling Dynamics</h4>
                  <p style={{ fontSize: '0.88rem' }}>
                    Custom heatpipe routing and precision-engineered fan blades ensure ultra-low noise levels even during prolonged 4K gaming sessions.
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#121624',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <Zap size={28} color="#7000ff" style={{ marginBottom: '0.6rem' }} />
                  <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Maximum Overclock Stability</h4>
                  <p style={{ fontSize: '0.88rem' }}>
                    Reinforced power stages and premium capacitors guarantee clean power delivery for maximum overclock potential.
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#121624',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <Award size={28} color="#00ff66" style={{ marginBottom: '0.6rem' }} />
                  <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Cyberpunk RGB Lighting</h4>
                  <p style={{ fontSize: '0.88rem' }}>
                    Fully customizable ARGB zones compatible with major motherboard lighting software suites.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Full Specifications Table */}
          {activeTab === 'specs' && (
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem' }}>
                Technical Specifications Sheet
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: idx % 2 === 0 ? '#121624' : '#0c0f18',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}
                  >
                    <span style={{ color: '#8e9bb0', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      {key}
                    </span>
                    <span style={{ color: '#00f0ff', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-stats)' }}>
                      {val}
                    </span>
                  </div>
                ))}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#121624',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  <span style={{ color: '#8e9bb0', fontSize: '0.85rem' }}>MANUFACTURER</span>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{product.brand}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#0c0f18',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  <span style={{ color: '#8e9bb0', fontSize: '0.85rem' }}>WARRANTY</span>
                  <span style={{ color: '#00ff66', fontWeight: 700, fontSize: '0.9rem' }}>3 Years Official</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.3rem' }}>
                    Verified Gamer Feedback
                  </h3>
                  <p style={{ color: '#8e9bb0', fontSize: '0.88rem' }}>
                    Based on {product.reviewsCount} verified purchase reviews
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#121624',
                  padding: '0.8rem 1.4rem',
                  borderRadius: '12px'
                }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffaa00', fontFamily: 'var(--font-stats)' }}>
                    {product.rating}
                  </span>
                  <div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} color="#ffaa00" fill="#ffaa00" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>Overall Score</span>
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Alex V.', rating: 5, date: '2 days ago', title: 'Absolute performance beast!', comment: 'Easily handles 4K ultra settings with insane framerates. Temps stay under 65C even during heavy gaming.' },
                  { name: 'Marcus T.', rating: 5, date: '1 week ago', title: 'Solid build quality & fast delivery', comment: 'Ordered yesterday and received it within 24 hours. Packaging was pristine and sealed. Highly recommended!' }
                ].map((rev, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#121624',
                      padding: '1.2rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{rev.name}</span>
                        <span style={{
                          backgroundColor: 'rgba(0, 255, 102, 0.1)',
                          color: '#00ff66',
                          fontSize: '0.68rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>VERIFIED BUYER</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#5c687e' }}>{rev.date}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} color="#ffaa00" fill="#ffaa00" />
                      ))}
                    </div>

                    <h4 style={{ color: '#fff', fontSize: '0.92rem', marginBottom: '0.3rem' }}>{rev.title}</h4>
                    <p style={{ color: '#8e9bb0', fontSize: '0.85rem' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Warranty */}
          {activeTab === 'shipping' && (
            <div style={{ color: '#8e9bb0', lineHeight: 1.7 }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Shipping Policy & Warranty Guarantee
              </h3>
              <p style={{ marginBottom: '1rem' }}>
                All orders are dispatched from our central warehouse within 24-48 hours. Every shipment is fully insured against theft or transit damage.
              </p>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><strong>3-Year Official Manufacturer Warranty:</strong> Covers all hardware defects and component failures.</li>
                <li><strong>Hassle-Free Returns:</strong> 30-day money-back return policy on all unopened/sealed hardware.</li>
                <li><strong>Dedicated Support:</strong> 24/7 technical customer support for installation and setup guidance.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Related Hardware Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  COMPATIBLE & SIMILAR HARDWARE
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#8e9bb0' }}>
                  Explore matching components in {product.category.toUpperCase()}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
              {relatedProducts.map(relProduct => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onAddToCart={onAddToCart}
                  onQuickView={(p) => onViewProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
