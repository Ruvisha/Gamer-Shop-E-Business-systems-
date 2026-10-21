import React, { useState, useEffect } from 'react';
import { Wrench, Zap, Check, Trash2, ShoppingBag, ShieldAlert, Sparkles } from 'lucide-react';

const slotTypes = [
  { id: 'cpu', label: '1. Processor (CPU)' },
  { id: 'cooling', label: '2. Liquid Cooling' },
  { id: 'mb', label: '3. Motherboard' },
  { id: 'ram', label: '4. Memory (RAM)' },
  { id: 'gpu', label: '5. Graphics Card (GPU)' },
  { id: 'storage', label: '6. Storage (SSD)' },
  { id: 'psu', label: '7. Power Supply (PSU)' },
  { id: 'case', label: '8. PC Case' }
];

export default function PcBuilder({ products = [], onAddBuildToCart }) {
  const [selectedBuild, setSelectedBuild] = useState({
    cpu: null,
    cooling: null,
    mb: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null
  });

  useEffect(() => {
    if (products.length > 0) {
      setSelectedBuild(prev => ({
        cpu: prev.cpu || products.find(p => p.id === 'cpu-3') || products.find(p => p.category === 'cpu') || null,
        cooling: prev.cooling || products.find(p => p.category === 'cooling') || null,
        mb: prev.mb || products.find(p => p.id === 'mb-2') || products.find(p => p.category === 'mb') || null,
        ram: prev.ram || products.find(p => p.id === 'ram-2') || products.find(p => p.category === 'ram') || null,
        gpu: prev.gpu || products.find(p => p.id === 'gpu-2') || products.find(p => p.category === 'gpu') || null,
        storage: prev.storage || products.find(p => p.id === 'storage-1') || products.find(p => p.category === 'storage') || null,
        psu: prev.psu || products.find(p => p.id === 'psu-1') || products.find(p => p.category === 'psu') || null,
        case: prev.case || products.find(p => p.category === 'case') || null
      }));
    }
  }, [products]);

  const handleSelectComponent = (slotId, productId) => {
    const item = products.find(p => p.id === productId) || null;
    setSelectedBuild(prev => ({
      ...prev,
      [slotId]: item
    }));
  };

  const handleClearBuild = () => {
    setSelectedBuild({
      cpu: null,
      cooling: null,
      mb: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null
    });
  };

  // Preset Loaders
  const loadPreset = (presetType) => {
    if (presetType === 'flagship') {
      setSelectedBuild({
        cpu: products.find(p => p.id === 'cpu-1') || products.find(p => p.category === 'cpu'),
        cooling: products.find(p => p.category === 'cooling'),
        mb: products.find(p => p.id === 'mb-1') || products.find(p => p.category === 'mb'),
        ram: products.find(p => p.id === 'ram-1') || products.find(p => p.category === 'ram'),
        gpu: products.find(p => p.id === 'gpu-1') || products.find(p => p.category === 'gpu'),
        storage: products.find(p => p.id === 'storage-2') || products.find(p => p.category === 'storage'),
        psu: products.find(p => p.id === 'psu-1') || products.find(p => p.category === 'psu'),
        case: products.find(p => p.category === 'case'),
      });
    } else if (presetType === 'streamer') {
      setSelectedBuild({
        cpu: products.find(p => p.id === 'cpu-3') || products.find(p => p.category === 'cpu'),
        cooling: products.find(p => p.category === 'cooling'),
        mb: products.find(p => p.id === 'mb-2') || products.find(p => p.category === 'mb'),
        ram: products.find(p => p.id === 'ram-2') || products.find(p => p.category === 'ram'),
        gpu: products.find(p => p.id === 'gpu-2') || products.find(p => p.category === 'gpu'),
        storage: products.find(p => p.id === 'storage-1') || products.find(p => p.category === 'storage'),
        psu: products.find(p => p.id === 'psu-1') || products.find(p => p.category === 'psu'),
        case: products.find(p => p.category === 'case'),
      });
    }
  };

  // Calculated totals
  const totalBuildPrice = Object.values(selectedBuild).reduce(
    (sum, item) => sum + (item ? item.price : 0), 0
  );

  const totalWattage = Object.values(selectedBuild).reduce(
    (sum, item) => sum + (item ? (item.wattage || 0) : 0), 0
  );

  const psuWattage = selectedBuild.psu ? 1000 : 0; // 1000W PSU rating
  const hasSufficientPower = !selectedBuild.psu || psuWattage >= totalWattage + 100;

  const buildItemsList = Object.values(selectedBuild).filter(Boolean);

  return (
    <section id="pc-builder" style={{
      padding: '4rem 0',
      backgroundColor: '#090b12',
      borderTop: '1px solid rgba(0, 240, 255, 0.15)',
      borderBottom: '1px solid rgba(0, 240, 255, 0.15)'
    }}>
      <div className="container">
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#00f0ff',
            fontSize: '0.82rem',
            fontWeight: 800,
            fontFamily: 'var(--font-stats)',
            letterSpacing: '1px',
            marginBottom: '0.4rem'
          }}>
            <Wrench size={16} />
            INTERACTIVE RIG CONFIGURATOR
          </div>

          <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: 900 }}>
            CUSTOM <span className="text-gradient">PC BUILDER</span>
          </h2>
          <p style={{ color: '#8e9bb0', fontSize: '0.95rem', maxWidth: '600px', margin: '0.4rem auto 1.5rem' }}>
            Select individual computer components, inspect live wattage requirement, and verify complete system compatibility before ordering.
          </p>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => loadPreset('flagship')}
              className="btn-outline-cyan"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.75rem' }}
            >
              <Sparkles size={14} />
              Load Preset: 4K Ultra RTX 4090 Rig
            </button>
            <button
              onClick={() => loadPreset('streamer')}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.75rem' }}
            >
              Load Preset: Streamer Sweet Spot
            </button>
            <button
              onClick={handleClearBuild}
              style={{
                backgroundColor: 'rgba(255, 0, 85, 0.1)',
                color: '#ff0055',
                border: '1px solid rgba(255, 0, 85, 0.3)',
                borderRadius: '8px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={14} />
              Clear Slots
            </button>
          </div>
        </div>

        {/* Builder Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Component Slot Selectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {slotTypes.map((slot) => {
              const selectedItem = selectedBuild[slot.id];
              const availableItems = products.filter(p => p.category === slot.id);

              return (
                <div key={slot.id} className="cyber-card" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.6rem'
                  }}>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#00f0ff',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {slot.label}
                    </span>
                    {selectedItem && (
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: '#00ff66',
                        fontFamily: 'var(--font-stats)'
                      }}>
                        Rs. {Number(selectedItem.price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  <select
                    value={selectedItem ? selectedItem.id : ''}
                    onChange={(e) => handleSelectComponent(slot.id, e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#121624',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Choose {slot.label.split('.')[1]} --</option>
                    {availableItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.brand} {item.name} (Rs. {Number(item.price).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                      </option>
                    ))}
                  </select>

                  {selectedItem && (
                    <div style={{
                      marginTop: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#8e9bb0'
                    }}>
                      <Check size={14} color="#00ff66" />
                      <span>Wattage: {selectedItem.wattage || 0}W</span>
                      <span style={{ color: '#5c687e' }}>•</span>
                      <span>Stock: {selectedItem.stock} units</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Build Summary Card */}
          <div className="glass-panel" style={{
            padding: '2rem',
            position: 'sticky',
            top: '90px',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>BUILD SUMMARY</span>
              <span style={{
                fontSize: '0.75rem',
                color: '#00f0ff',
                fontFamily: 'var(--font-stats)'
              }}>
                {buildItemsList.length}/6 SLOTS FILLED
              </span>
            </h3>

            {/* Wattage Calculation Meter */}
            <div style={{
              backgroundColor: '#07080c',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#8e9bb0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={14} color="#00f0ff" />
                  ESTIMATED SYSTEM WATTAGE
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00f0ff', fontFamily: 'var(--font-stats)' }}>
                  {totalWattage} WATT
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#1a2235',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min((totalWattage / 1000) * 100, 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00f0ff 0%, #00ff66 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              <div style={{ fontSize: '0.72rem', color: '#5c687e', marginTop: '0.4rem' }}>
                Recommended Power Supply: 850W - 1000W Gold
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8e9bb0', fontSize: '0.85rem' }}>
                <span>Selected Components ({buildItemsList.length})</span>
                <span>Rs. {Number(totalBuildPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8e9bb0', fontSize: '0.85rem' }}>
                <span>Professional Assembly & Testing</span>
                <span style={{ color: '#00ff66', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#8e9bb0', fontSize: '0.85rem' }}>
                <span>Insured Express Shipping</span>
                <span style={{ color: '#00ff66', fontWeight: 700 }}>FREE</span>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  TOTAL RIG PRICE:
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00f0ff', fontFamily: 'var(--font-stats)' }}>
                  Rs. {Number(totalBuildPrice).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              disabled={buildItemsList.length === 0}
              onClick={() => onAddBuildToCart(buildItemsList)}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                opacity: buildItemsList.length === 0 ? 0.5 : 1,
                cursor: buildItemsList.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ShoppingBag size={18} />
              <span>Add Entire Rig to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
