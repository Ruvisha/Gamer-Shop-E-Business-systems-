import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Clock, Truck, RefreshCw, XCircle, DollarSign, User, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';

export default function AdminOrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/orders');
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllOrders();
    }
  }, [isOpen]);

  const handleUpdateApproval = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/orders/${orderId}/approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminApprovalStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, adminApprovalStatus: newStatus } : o));
      } else {
        alert(data.message || 'Failed to update order status');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter(o => {
    if (filter === 'ALL') return true;
    return (o.adminApprovalStatus || 'PENDING_APPROVAL') === filter;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9960,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: '88vh',
          backgroundColor: '#0a0d14',
          border: '1px solid rgba(255, 0, 85, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 0, 85, 0.2)',
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 0, 85, 0.15)',
              border: '1px solid #ff0055',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#ff0055" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}>
                ADMIN ORDERS & APPROVAL MANAGEMENT
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>
                GAMER SHOP • Customer Purchases Verification & Admin Order Approvals
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={fetchAllOrders}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ff0055',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8e9bb0',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                backgroundColor: filter === st ? 'rgba(255, 0, 85, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${filter === st ? '#ff0055' : 'rgba(255, 255, 255, 0.08)'}`,
                color: filter === st ? '#ff0055' : '#8e9bb0',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {st === 'ALL' ? 'ALL ORDERS' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.4rem' }}>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8e9bb0' }}>
              <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#ff0055' }} />
              <p>Loading customer orders database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8e9bb0', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No customer orders found in this filter.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {filteredOrders.map(ord => {
                const approvalStatus = ord.adminApprovalStatus || 'PENDING_APPROVAL';

                return (
                  <div
                    key={ord._id || ord.orderId}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    {/* Header line of Order Card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#00f0ff' }}>
                            Order #{ord.orderId}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: ord.paymentStatus === 'PAID' ? 'rgba(0, 230, 153, 0.15)' : 'rgba(255, 170, 0, 0.15)',
                            color: ord.paymentStatus === 'PAID' ? '#00e699' : '#ffaa00',
                            border: `1px solid ${ord.paymentStatus === 'PAID' ? '#00e699' : '#ffaa00'}`
                          }}>
                            {ord.paymentStatus === 'PAID' ? 'PAYMENT APPROVED (PayHere Sandbox)' : 'PENDING PAYMENT'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#667799', marginTop: '2px' }}>
                          Date: {new Date(ord.createdAt || Date.now()).toLocaleString()} • Method: {ord.paymentMethod || 'PayHere Online Card'}
                        </div>
                      </div>

                      {/* Approval Status Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {approvalStatus === 'PENDING_APPROVAL' && (
                          <span style={{ backgroundColor: 'rgba(255, 170, 0, 0.15)', border: '1px solid #ffaa00', color: '#ffaa00', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> PENDING ADMIN APPROVAL
                          </span>
                        )}
                        {approvalStatus === 'APPROVED' && (
                          <span style={{ backgroundColor: 'rgba(0, 230, 153, 0.15)', border: '1px solid #00e699', color: '#00e699', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> APPROVED BY ADMIN
                          </span>
                        )}
                        {approvalStatus === 'DISPATCHED' && (
                          <span style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Truck size={14} /> DISPATCHED FOR DELIVERY
                          </span>
                        )}
                        {approvalStatus === 'REJECTED' && (
                          <span style={{ backgroundColor: 'rgba(255, 0, 85, 0.15)', border: '1px solid #ff0055', color: '#ff0055', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <XCircle size={14} /> REJECTED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer & Delivery Information Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#ff0055', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <User size={13} /> CUSTOMER DETAILS
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{ord.deliveryDetails?.fullName || ord.userName || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8e9bb0', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {ord.deliveryDetails?.email || ord.userEmail}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8e9bb0', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> Phone: {ord.deliveryDetails?.phone || 'N/A'}</div>
                        {ord.deliveryDetails?.secondaryPhone && (
                          <div style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>WhatsApp: {ord.deliveryDetails?.secondaryPhone}</div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#ff0055', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <MapPin size={13} /> DELIVERY ADDRESS
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#fff' }}>{ord.deliveryDetails?.address || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>City: {ord.deliveryDetails?.city || 'N/A'}, District: {ord.deliveryDetails?.district || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>Country: {ord.deliveryDetails?.country || 'Sri Lanka'}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#ff0055', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <DollarSign size={13} /> PAYMENT & TOTAL
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#00f0ff' }}>
                          Rs. {(ord.amountLKR || 0).toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#8e9bb0' }}>(${(ord.amountUSD || 0).toLocaleString()})</span>
                        </div>
                        {ord.payherePaymentId && (
                          <div style={{ fontSize: '0.7rem', color: '#00e699', fontFamily: 'monospace' }}>
                            PayHere Txn ID: #{ord.payherePaymentId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items Purchased List */}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#8e9bb0', fontWeight: 700, marginBottom: '6px' }}>PURCHASED ITEMS:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {(ord.items || []).map((itm, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              padding: '4px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            {itm.image && (
                              <img src={itm.image} alt={itm.title} style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <div style={{ fontSize: '0.75rem', color: '#fff' }}>
                              <span style={{ fontWeight: 700 }}>{itm.title}</span> <span style={{ color: '#ff0055' }}>x{itm.quantity || 1}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#00f0ff', marginLeft: 'auto' }}>
                              Rs. {(itm.priceLKR || 0).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.8rem' }}>
                      <button
                        onClick={() => handleUpdateApproval(ord.orderId, 'APPROVED')}
                        disabled={updatingId === ord.orderId || approvalStatus === 'APPROVED'}
                        style={{
                          backgroundColor: approvalStatus === 'APPROVED' ? 'rgba(0, 230, 153, 0.2)' : '#00e699',
                          color: approvalStatus === 'APPROVED' ? '#00e699' : '#000',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: approvalStatus === 'APPROVED' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={14} /> APPROVE ORDER
                      </button>

                      <button
                        onClick={() => handleUpdateApproval(ord.orderId, 'DISPATCHED')}
                        disabled={updatingId === ord.orderId || approvalStatus === 'DISPATCHED'}
                        style={{
                          backgroundColor: approvalStatus === 'DISPATCHED' ? 'rgba(0, 240, 255, 0.2)' : '#00f0ff',
                          color: approvalStatus === 'DISPATCHED' ? '#00f0ff' : '#000',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: approvalStatus === 'DISPATCHED' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Truck size={14} /> MARK DISPATCHED
                      </button>

                      <button
                        onClick={() => handleUpdateApproval(ord.orderId, 'REJECTED')}
                        disabled={updatingId === ord.orderId || approvalStatus === 'REJECTED'}
                        style={{
                          backgroundColor: 'rgba(255, 0, 85, 0.15)',
                          color: '#ff0055',
                          border: '1px solid #ff0055',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: approvalStatus === 'REJECTED' ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={14} /> REJECT
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
