import React from 'react';
import { Home, SlidersHorizontal, Wrench, Zap, Layers } from 'lucide-react';

export default function DashboardNav({ activeSection, setActiveSection, totalProductsCount, dealProductsCount }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      badge: null,
      description: 'Featured rigs & highlights'
    },
    {
      id: 'catalog',
      label: 'Components',
      icon: SlidersHorizontal,
      badge: `${totalProductsCount || 16} Parts`,
      description: 'Multi-criteria part search'
    },
    {
      id: 'builder',
      label: 'Build your own PC',
      icon: Wrench,
      badge: 'Interactive Configurator',
      description: 'Build your custom rig'
    },
    {
      id: 'deals',
      label: 'Flash Sale Deals',
      icon: Zap,
      badge: `${dealProductsCount || 4} On Sale`,
      badgeColor: '#ff0055',
      description: 'Up to 30% discount'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#0a0d16',
      borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
      padding: '0.75rem 0',
      position: 'sticky',
      top: '76px',
      zIndex: 990,
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Section Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#8e9bb0',
          fontSize: '0.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-stats)',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          <Layers size={16} color="#00f0ff" />
          <span>DASHBOARD SELECTION:</span>
        </div>

        {/* Section Options Selector Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: '#121624',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #00f0ff' : '1px solid transparent',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.18) 0%, rgba(112, 0, 255, 0.25) 100%)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#8e9bb0',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 600,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.3px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#8e9bb0';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={16} color={isActive ? '#00f0ff' : item.id === 'deals' ? '#ff0055' : '#8e9bb0'} />
                <span>{item.label}</span>

                {item.badge && (
                  <span style={{
                    backgroundColor: isActive
                      ? (item.badgeColor || '#00f0ff')
                      : 'rgba(255, 255, 255, 0.1)',
                    color: isActive
                      ? (item.badgeColor ? '#fff' : '#000')
                      : '#8e9bb0',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-stats)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
