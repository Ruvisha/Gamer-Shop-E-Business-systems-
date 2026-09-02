import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, Flame, SearchX, RotateCcw, Filter, Check, Tag, Star, DollarSign, Cpu } from 'lucide-react';
import { categories } from './products';

export default function ProductGrid({ 
  products, 
  activeCategory, 
  setActiveCategory,
  searchQuery, 
  setSearchQuery,
  onAddToCart, 
  onQuickView 
}) {
  // Multi-Criteria State
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2500); // Price Range Adjustment Bar (slider max)
  const [availability, setAvailability] = useState('all'); // all, instock, sale, featured
  const [minRating, setMinRating] = useState('all'); // all, 4.5, 4.8, 4.9
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, rating

  // Unique list of brands dynamically extracted from products catalog
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Multi-Criteria Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Radio Filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // 2. Brand Radio Filter
      if (selectedBrand !== 'all' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // 3. Price Range Adjustment Bar Filter (Max Price Slider)
      if (product.price > maxPrice) {
        return false;
      }

      // 4. Availability & Special Status Filter
      if (availability === 'instock' && product.stock <= 0) return false;
      if (availability === 'sale' && !product.isFlashSale) return false;
      if (availability === 'featured' && !product.isFeatured) return false;

      // 5. Rating Filter
      if (minRating !== 'all' && product.rating < parseFloat(minRating)) return false;

      // 6. Live Search Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // popular default
    });
  }, [products, activeCategory, selectedBrand, maxPrice, availability, minRating, searchQuery, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setActiveCategory('all');
    setSelectedBrand('all');
    setMaxPrice(2500);
    setAvailability('all');
    setMinRating('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  const hasActiveFilters = activeCategory !== 'all' || selectedBrand !== 'all' || maxPrice < 2500 || availability !== 'all' || minRating !== 'all' || searchQuery !== '';

  return (
    <section id="products-section" style={{ padding: '3.5rem 0 4rem' }}>
      <div className="container">
        
        {/* Section Title Header */}
        <div style={{
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#00f0ff',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: 'var(--font-stats)',
              letterSpacing: '1px',
              marginBottom: '0.3rem'
            }}>
              <Filter size={16} />
              FULL STORE HARDWARE CATALOG
            </div>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: 900 }}>
              GAMING <span className="text-gradient">COMPONENTS & PARTS</span>
            </h2>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                backgroundColor: 'rgba(255, 0, 85, 0.1)',
                color: '#ff0055',
                border: '1px solid rgba(255, 0, 85, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-heading)'
              }}
            >
              <RotateCcw size={15} />
              <span>RESET ALL FILTERS</span>
            </button>
          )}
        </div>

        {/* Main 2-Column Layout: Left Multi-Criteria Sidebar + Right Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>

          {/* LEFT SIDEBAR: Radio Buttons & Price Slider Filters */}
          <aside style={{
            position: 'sticky',
            top: '90px',
            backgroundColor: '#0c0f18',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '18px',
            padding: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Sidebar Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.8rem'
            }}>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#00f0ff',
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <SlidersHorizontal size={18} />
                <span>FILTER CATALOG</span>
              </div>
              <span style={{
                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                color: '#00f0ff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                fontFamily: 'var(--font-stats)'
              }}>
                {filteredProducts.length} ITEMS
              </span>
            </div>

            {/* 1. Category Radio Buttons */}
            <div>
              <label style={{
                fontSize: '0.75rem',
                color: '#8e9bb0',
                fontWeight: 800,
                display: 'block',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                1. Hardware Category
              </label>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                maxHeight: '220px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {categories.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  return (
                    <label
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#00f0ff' : '#8e9bb0',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 700 : 500,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="hardware-category"
                        checked={isSelected}
                        onChange={() => setActiveCategory(cat.id)}
                        style={{ accentColor: '#00f0ff', cursor: 'pointer' }}
                      />
                      <span style={{ flex: 1 }}>{cat.name}</span>
                      <span style={{
                        fontSize: '0.68rem',
                        color: isSelected ? '#00f0ff' : '#5c687e',
                        fontFamily: 'var(--font-stats)',
                        fontWeight: 700
                      }}>
                        ({cat.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Brand / Manufacturer Radio Buttons */}
            <div>
              <label style={{
                fontSize: '0.75rem',
                color: '#8e9bb0',
                fontWeight: 800,
                display: 'block',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                2. Brand / Manufacturer
              </label>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                maxHeight: '190px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                <label
                  onClick={() => setSelectedBrand('all')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: selectedBrand === 'all' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: selectedBrand === 'all' ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: selectedBrand === 'all' ? '#00f0ff' : '#8e9bb0',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: selectedBrand === 'all' ? 700 : 500
                  }}
                >
                  <input
                    type="radio"
                    name="hardware-brand"
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                    style={{ accentColor: '#00f0ff', cursor: 'pointer' }}
                  />
                  <span>All Brands</span>
                </label>

                {availableBrands.map((b) => {
                  const isSelected = selectedBrand.toLowerCase() === b.toLowerCase();
                  return (
                    <label
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: isSelected ? '#00f0ff' : '#8e9bb0',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 700 : 500
                      }}
                    >
                      <input
                        type="radio"
                        name="hardware-brand"
                        checked={isSelected}
                        onChange={() => setSelectedBrand(b)}
                        style={{ accentColor: '#00f0ff', cursor: 'pointer' }}
                      />
                      <span>{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Price Adjustment Bar (Slider) */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.75rem',
                  color: '#8e9bb0',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  3. Max Price Adjustment
                </label>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  color: '#00f0ff',
                  fontFamily: 'var(--font-stats)',
                  backgroundColor: 'rgba(0, 240, 255, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}>
                  Under ${maxPrice.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#00f0ff',
                  cursor: 'pointer',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: '#121624'
                }}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#5c687e',
                marginTop: '0.3rem',
                fontFamily: 'var(--font-stats)'
              }}>
                <span>$100</span>
                <span>$1,250</span>
                <span>$2,500+</span>
              </div>

              {/* Quick Preset Buttons for Price Slider */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {[300, 750, 1200, 2500].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMaxPrice(preset)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: maxPrice === preset ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: maxPrice === preset ? 'rgba(0, 240, 255, 0.15)' : '#121624',
                      color: maxPrice === preset ? '#00f0ff' : '#8e9bb0',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-stats)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset === 2500 ? 'All Prices' : `< $${preset}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Special Status & Deals Select */}
            <div>
              <label style={{
                fontSize: '0.75rem',
                color: '#8e9bb0',
                fontWeight: 800,
                display: 'block',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                4. Availability & Deals
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#121624',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.8rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Items</option>
                <option value="sale">🔥 On Flash Sale Deals</option>
                <option value="featured">★ Featured Hardware</option>
                <option value="instock">In Stock Only</option>
              </select>
            </div>

            {/* 5. Star Rating Select */}
            <div>
              <label style={{
                fontSize: '0.75rem',
                color: '#8e9bb0',
                fontWeight: 800,
                display: 'block',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                5. Gamer Star Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#121624',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.8rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Star Ratings</option>
                <option value="4.8">4.8★ & Above (Top Rated)</option>
                <option value="4.9">4.9★ & Above (Flagship Only)</option>
              </select>
            </div>

            {/* Reset Button inside Sidebar */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="btn-outline-cyan"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                  padding: '0.65rem'
                }}
              >
                <RotateCcw size={15} />
                <span>Reset All Filters</span>
              </button>
            )}
          </aside>

          {/* RIGHT COLUMN: Sort Toolbar & Product Grid */}
          <main>
            {/* Sort Toolbar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: '#0e111a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '0.8rem 1.2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.82rem', color: '#8e9bb0', fontFamily: 'var(--font-stats)' }}>
                SHOWING <strong style={{ color: '#00f0ff', fontSize: '0.95rem' }}>{filteredProducts.length}</strong> MATCHING PARTS
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowUpDown size={16} color="#8e9bb0" />
                <span style={{ fontSize: '0.8rem', color: '#8e9bb0', fontWeight: 600 }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: '#121624',
                    color: '#00f0ff',
                    border: '1px solid #00f0ff',
                    borderRadius: '8px',
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="popular">Most Popular / Reviews</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated ★</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid-products">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#0e111a',
                borderRadius: '16px',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <SearchX size={48} color="#5c687e" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
                  NO MATCHING HARDWARE FOUND
                </h3>
                <p style={{ color: '#8e9bb0', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  No components matched your left sidebar criteria. Try resetting the sidebar options.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-outline-cyan"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
