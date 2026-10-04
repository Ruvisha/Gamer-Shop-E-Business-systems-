import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Clock, CheckCircle2, AlertCircle, Truck, RefreshCw, PackageCheck } from 'lucide-react';

export default function UserOrdersModal({ isOpen, onClose, user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserOrders = async () => {
    if (!user || !user.email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/user/orders?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.email) {
      fetchUserOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9950,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 240, 255, 0.15)',
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid #00f0ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PackageCheck size={22} color="#00f0ff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                MY ORDERS & PLACED STATUS
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>
                Account: {user?.email}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={fetchUserOrders}
              disabled={isLoading}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#00f0ff',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} className={isLoading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#8e9bb0', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Orders List Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingRight: '0.4rem' }}>
          {orders.length > 0 ? (
            orders.map((ord) => {
              const isApproved = ord.adminApprovalStatus === 'APPROVED' || ord.adminApprovalStatus === 'DISPATCHED';
              const isPending = ord.adminApprovalStatus === 'PENDING_APPROVAL';

              return (
                <div
                  key={ord.orderId}
                  style={{
                    backgroundColor: '#121624',
                    border: isApproved 
                      ? '1px solid rgba(0, 255, 102, 0.4)' 
                      : isPending 
                      ? '1px solid rgba(255, 170, 0, 0.4)' 
                      : '1px solid rgba(255, 0, 85, 0.4)',
                    borderRadius: '12px',
                    padding: '1.2rem'
                  }}
                >
                  {/* Order Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.8rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, fontFamily: 'var(--font-stats)' }}>
                        ORDER ID: {ord.orderId}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#8e9bb0', marginTop: '2px' }}>
                        Placed on: {new Date(ord.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Admin Approval Status Badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{
                        backgroundColor: isApproved 
                          ? 'rgba(0, 255, 102, 0.15)' 
                          : isPending 
                          ? 'rgba(255, 170, 0, 0.15)' 
                          : 'rgba(255, 0, 85, 0.15)',
                        color: isApproved ? '#00ff66' : isPending ? '#ffaa00' : '#ff0055',
                        border: `1px solid ${isApproved ? '#00ff66' : isPending ? '#ffaa00' : '#ff0055'}`,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-heading)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {isApproved ? <CheckCircle2 size={14} /> : isPending ? <Clock size={14} /> : <AlertCircle size={14} />}
                        <span>
                          {ord.adminApprovalStatus === 'APPROVED' ? '✓ ORDER PLACED & APPROVED BY ADMIN' :
                           ord.adminApprovalStatus === 'DISPATCHED' ? '🚀 DISPATCHED FOR DELIVERY' :
                           ord.adminApprovalStatus === 'REJECTED' ? '❌ REJECTED BY ADMIN' :
                           '⏳ PENDING ADMIN APPROVAL'}
                        </span>
                      </span>

                      <span style={{ fontSize: '0.7rem', color: '#8e9bb0' }}>
                        Payment: <strong style={{ color: ord.paymentStatus === 'PAID' ? '#00ff66' : '#ffaa00' }}>{ord.paymentStatus}</strong> ({ord.paymentMethod})
                      </span>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                    {ord.items && ord.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: '#070912', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>Brand: {item.brand} • Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00f0ff', fontFamily: 'var(--font-stats)' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#8e9bb0', backgroundColor: '#090c17', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                    <div>
                      📍 Shipping to: <strong>{ord.deliveryDetails?.fullName}</strong> ({ord.deliveryDetails?.address}, {ord.deliveryDetails?.city}, {ord.deliveryDetails?.district}) • 📞 {ord.deliveryDetails?.primaryPhone}
                    </div>
                    <div style={{ fontWeight: 900, color: '#00ff66', fontSize: '0.95rem', fontFamily: 'var(--font-stats)' }}>
                      LKR {Number(ord.amountLKR).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8e9bb0' }}>
              <ShoppingBag size={48} color="#28334e" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>NO ORDERS FOUND</div>
              <div style={{ fontSize: '0.82rem' }}>You haven't placed any hardware purchases yet.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
