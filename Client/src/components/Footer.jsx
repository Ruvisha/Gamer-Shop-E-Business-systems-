import React, { useState } from 'react';
import { Zap, Mail, Send, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onShowToast }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      onShowToast({
        type: 'success',
        title: 'WELCOME TO THE CLAN!',
        message: 'Use promo code "GAMER10" for 10% OFF your first order!'
      });
      setEmail('');
    }
  };

  return (
    <footer style={{
      backgroundColor: '#050609',
      color: '#8e9bb0',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '4rem',
      paddingBottom: '2rem'
    }}>
      <div className="container">
        {/* Top Newsletter Card */}
        <div className="glass-panel" style={{
          padding: '2.5rem',
          marginBottom: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          border: '1px solid rgba(0, 240, 255, 0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-stats)' }}>
              <Mail size={16} />
              JOIN THE VIP GAMER CLUB
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 900, marginTop: '0.3rem' }}>
              GET 10% OFF YOUR FIRST HARDWARE ORDER
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8e9bb0', marginTop: '0.3rem' }}>
              Receive instant drop alerts for RTX 4090 restocks & secret flash discount codes.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Enter your gamer email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#07080c',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-primary">
              <span>JOIN NOW</span>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Footer Links Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={22} color="#00f0ff" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                GAMER <span className="text-cyan">SHOP</span>
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Your #1 destination for high performance PC gaming components, GPUs, CPUs, liquid cooling gear, and custom handcrafted gaming rigs.
            </p>
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="#00f0ff" />
                <span>24/7 Hotline: +1 (800) 555-GAMER</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="#00f0ff" />
                <span>Cyber City Tower 4, Tech Plaza</span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
              HARDWARE CATEGORIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>NVIDIA GeForce RTX 40-Series</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>AMD Radeon RX 7000 Series</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>Intel Core i9 & i7 Processors</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>AMD Ryzen 7000 & 8000 AM5</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>Gen5 NVMe M.2 Solid State Drives</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
              CUSTOMER SUPPORT
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>Track Your Order</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>Warranty & Rをした Replacement</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>PC Building Compatibility Guide</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>Shipping & Express Delivery Info</a></li>
              <li><a href="#" style={{ color: '#8e9bb0', textDecoration: 'none' }}>30-Day Money Back Guarantee</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.78rem'
        }}>
          <div>
            © 2026 <strong>GAMER SHOP</strong> Inc. All Rights Reserved. Built for ultimate PC gaming performance.
          </div>

          <div style={{ display: 'flex', gap: '1rem', color: '#5c687e' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
