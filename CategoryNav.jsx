import React from 'react';
import { LayoutGrid, Cpu, Zap, MemoryStick, CircuitBoard, HardDrive, Fan, BatteryCharging, Box } from 'lucide-react';
import { categories } from './products';

const iconMap = {
  LayoutGrid,
  Cpu,
  Zap,
  MemoryStick,
  CircuitBoard,
  HardDrive,
  Fan,
  BatteryCharging,
  Box
};

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  return (
    <div style={{
      backgroundColor: '#0a0d14',
      padding: '1.2rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.4rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || LayoutGrid;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.15)' : '#121624',
                  color: isActive ? '#00f0ff' : '#8e9bb0',
                  border: isActive ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '30px',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#8e9bb0';
                  }
                }}
              >
                <IconComponent size={16} color={isActive ? '#00f0ff' : '#8e9bb0'} />
                <span>{cat.name}</span>
                <span style={{
                  backgroundColor: isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#000' : '#8e9bb0',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  fontFamily: 'var(--font-stats)'
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
