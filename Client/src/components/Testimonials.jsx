import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Quote, User } from 'lucide-react';
const fallbackReviews = [
  {
    id: 1,
    author: 'Alex "Vortex" Vance',
    role: 'Esports Streamer & Competitive Gamer',
    rating: 5,
    comment: 'Gamer Shop delivered my RTX 4090 and 7950X3D in less than 24 hours. The custom PC builder tool made checking motherboard & wattage compatibility effortless! My rig gets 360+ FPS effortlessly now.',
    verified: true,
    product: 'ROG Strix RTX 4090 OC'
  },
  {
    id: 2,
    author: 'Elena Rostova',
    role: '3D Animator & PC Enthusiast',
    rating: 5,
    comment: 'The pricing on Gamer Shop is unbeatable! Saved over Rs. 90,000 on my full watercooled Lian Li build. Customer support answered my technical questions regarding PCIe 5.0 NVMe bandwidth instantly.',
    verified: true,
    product: 'LIAN LI O11 Dynamic EVO RGB'
  },
  {
    id: 3,
    author: 'Marcus Brody',
    role: 'Hardware Overclocker',
    rating: 5,
    comment: 'Gamer Shop is the only vendor I trust for binned high-frequency DDR5 memory and flagship motherboard stock. Packaging was bomb-proof and double buffered.',
    verified: true,
    product: 'G.Skill Trident Z5 7200MHz'
  }
];

export default function Testimonials() {
  const [reviewsList, setReviewsList] = useState(fallbackReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let res = await fetch('/api/testimonials').catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('http://localhost:3000/api/testimonials').catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setReviewsList(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch testimonials from MongoDB:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section style={{
      padding: '4rem 0',
      backgroundColor: '#07080c',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#00ff66',
            fontFamily: 'var(--font-stats)',
            letterSpacing: '1.5px',
            marginBottom: '0.4rem'
          }}>
            COMMUNITY FEEDBACK
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#fff', fontWeight: 900 }}>
            TRUSTED BY <span className="text-gradient">PRO GAMERS & BUILDERS</span>
          </h2>
          <p style={{ color: '#8e9bb0', fontSize: '0.95rem' }}>
            Over 10,000+ custom gaming rigs built with components supplied by Gamer Shop.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {reviewsList.map((rev) => (
            <div key={rev.id} className="cyber-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} color="#ffaa00" fill="#ffaa00" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#00ff66' }}>
                    <ShieldCheck size={14} />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#d0d9e8', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '1rem'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  color: '#00f0ff',
                  flexShrink: 0
                }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{rev.author}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>{rev.role}</div>
                  <div style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: 'var(--font-stats)', marginTop: '2px' }}>
                    Bought: {rev.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
