import React, { useState, useEffect } from 'react';
import { LayoutGrid, Cpu, Zap, MemoryStick, CircuitBoard, HardDrive, Fan, BatteryCharging, Box } from 'lucide-react';
const defaultCategories = [
  { id: 'all', name: 'All Products', icon: 'LayoutGrid', count: 0 },
  { id: 'gpu', name: 'Graphics Cards', icon: 'Cpu', count: 0 },
  { id: 'cpu', name: 'Processors', icon: 'Zap', count: 0 },
  { id: 'ram', name: 'RAM & Memory', icon: 'MemoryStick', count: 0 },
  { id: 'mb', name: 'Motherboards', icon: 'CircuitBoard', count: 0 },
  { id: 'storage', name: 'SSDs & Storage', icon: 'HardDrive', count: 0 },
  { id: 'cooling', name: 'Liquid Cooling', icon: 'Fan', count: 0 },
  { id: 'psu', name: 'Power Supplies', icon: 'BatteryCharging', count: 0 },
  { id: 'case', name: 'PC Cases', icon: 'Box', count: 0 }
];

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

export default function CategoryNav({ activeCategory, onSelectCategory, categories: categoriesProp = null, products = [] }) {
  const [categoriesList, setCategoriesList] = useState(categoriesProp || defaultCategories);

  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) {
      setCategoriesList(categoriesProp);
      return;
    }
    if (products && products.length > 0) {
      setCategoriesList(defaultCategories.map(cat => ({
        ...cat,
        count: cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length
      })));
    }
    const fetchCategories = async () => {
      try {
        let res = await fetch('/api/categories').catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('http://localhost:3000/api/categories').catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategoriesList(data);
          }
        }
      } catch (err) {
        console.error('Failed to load categories from MongoDB:', err);
      }
    };
    fetchCategories();
  }, [categoriesProp, products]);

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
          {categoriesList.map((cat) => {
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
