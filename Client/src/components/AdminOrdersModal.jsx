import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Clock, Truck, RefreshCw, XCircle, DollarSign, CreditCard, User, MapPin, Phone, Mail, ShoppingBag, AlertCircle } from 'lucide-react';
export default function AdminOrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      let res;
      try {
        res = await fetch('/api/admin/orders');
      } catch (e) {
        res = await fetch('http://localhost:3000/api/admin/orders');
      }
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/admin/orders');
      }
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
      setFeedback(null);
      // Auto-poll every 5 seconds for live database updates
      const interval = setInterval(fetchAllOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleUpdateApproval = async (orderId, newStatus) => {
    if (!orderId) {
      alert('Error: Order ID is missing.');
      return;
    }

    setUpdatingId(orderId);
    setFeedback(null);

    try {
      const encodedId = encodeURIComponent(orderId);
      let res;
      const payload = {
        orderId,
        adminApprovalStatus: newStatus,
        paymentStatus: newStatus === 'REJECTED' ? 'CANCELLED' : undefined
      };

      try {
        res = await fetch(`/api/admin/orders/${encodedId}/approval`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        res = await fetch(`http://localhost:3000/api/admin/orders/${encodedId}/approval`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/admin/orders/${encodedId}/approval`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      let data = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server returned invalid response (Status: ${res.status})`);
      }

      if (res.ok && (data.success || data.order)) {
        const cleanTarget = String(orderId).replace(/^#/, '');
        setOrders(prev => prev.map(o => {
          const oClean = String(o.orderId || o._id || '').replace(/^#/, '');
          if (o.orderId === orderId || o._id === orderId || oClean === cleanTarget) {
            return {
              ...o,
              adminApprovalStatus: newStatus,
              ...(newStatus === 'REJECTED' ? { paymentStatus: 'CANCELLED' } : {}),
              ...(data.order || {})
            };
          }
          return o;
        }));

        const statusLabel = newStatus === 'REJECTED' ? 'REJECTED' : newStatus === 'APPROVED' ? 'APPROVED' : 'MARKED DISPATCHED';
        setFeedback({
          type: 'success',
          message: `Order #${cleanTarget} successfully updated to ${statusLabel}!`
        });
        setTimeout(() => setFeedback(null), 4500);
      } else {
        const errMsg = data.error || data.message || 'Failed to update order status';
        setFeedback({ type: 'error', message: errMsg });
        alert(errMsg);
      }
    } catch (err) {
      console.error('Error updating approval status:', err);
      const errMsg = 'Error updating status: ' + err.message;
      setFeedback({ type: 'error', message: errMsg });
      alert(errMsg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  const counts = {
    ALL: orders.length,
    PENDING_APPROVAL: orders.filter(o => (o.adminApprovalStatus || 'PENDING_APPROVAL') === 'PENDING_APPROVAL').length,
    APPROVED: orders.filter(o => o.adminApprovalStatus === 'APPROVED').length,
    DISPATCHED: orders.filter(o => o.adminApprovalStatus === 'DISPATCHED').length,
    REJECTED: orders.filter(o => o.adminApprovalStatus === 'REJECTED').length,
  };

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

        {/* Real-time Action Feedback Banner */}
        {feedback && (
          <div style={{
            padding: '0.65rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            backgroundColor: feedback.type === 'success' ? 'rgba(0, 230, 153, 0.15)' : 'rgba(255, 0, 85, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? '#00e699' : '#ff0055'}`,
            color: feedback.type === 'success' ? '#00e699' : '#ff0055'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
            >
              <X size={15} />
            </button>
          </div>
        )}

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
                padding: '5px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{st === 'ALL' ? 'ALL ORDERS' : st.replace('_', ' ')}</span>
              <span style={{
                backgroundColor: filter === st ? '#ff0055' : 'rgba(255, 255, 255, 0.1)',
                color: filter === st ? '#fff' : '#8e9bb0',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.65rem'
              }}>
                {counts[st] || 0}
              </span>
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
                            Order {ord.orderId?.startsWith('#') ? ord.orderId : `#${ord.orderId || ord._id}`}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: approvalStatus === 'REJECTED' || ord.paymentStatus === 'CANCELLED'
                              ? 'rgba(255, 0, 85, 0.15)'
                              : ord.paymentStatus === 'PAID'
                                ? 'rgba(0, 230, 153, 0.15)'
                                : 'rgba(255, 170, 0, 0.15)',
                            color: approvalStatus === 'REJECTED' || ord.paymentStatus === 'CANCELLED'
                              ? '#ff0055'
                              : ord.paymentStatus === 'PAID'
                                ? '#00e699'
                                : '#ffaa00',
                            border: `1px solid ${approvalStatus === 'REJECTED' || ord.paymentStatus === 'CANCELLED'
                                ? '#ff0055'
                                : ord.paymentStatus === 'PAID'
                                  ? '#00e699'
                                  : '#ffaa00'
                              }`
                          }}>
                            {approvalStatus === 'REJECTED' || ord.paymentStatus === 'CANCELLED'
                              ? 'ORDER REJECTED / CANCELLED'
                              : ord.paymentStatus === 'PAID'
                                ? 'PAYMENT APPROVED (PayHere Sandbox)'
                                : 'PENDING PAYMENT'}
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
                            <XCircle size={14} /> REJECTED BY ADMIN
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
                          <CreditCard size={13} /> PAYMENT & TOTAL
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#00f0ff' }}>
                          Rs. {Number(ord.amountLKR || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            <img
                              src={itm.image}
                              alt={itm.title}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                const fallback = itm.fallbackImage || `/images/${itm.id}.jpg`;
                                if (e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                              style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div style={{ fontSize: '0.75rem', color: '#fff' }}>
                              <span style={{ fontWeight: 700 }}>{itm.title}</span> <span style={{ color: '#ff0055' }}>x{itm.quantity || 1}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#00f0ff', marginLeft: 'auto' }}>
                              Rs. {Number((itm.price ? itm.price * (itm.quantity || 1) : itm.priceLKR) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.8rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleUpdateApproval(ord.orderId || ord._id, 'APPROVED')}
                        disabled={updatingId === (ord.orderId || ord._id) || approvalStatus === 'APPROVED'}
                        style={{
                          backgroundColor: approvalStatus === 'APPROVED' ? 'rgba(0, 230, 153, 0.15)' : '#00e699',
                          color: approvalStatus === 'APPROVED' ? '#00e699' : '#000',
                          border: approvalStatus === 'APPROVED' ? '1px solid #00e699' : 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: (updatingId === (ord.orderId || ord._id) || approvalStatus === 'APPROVED') ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          opacity: updatingId === (ord.orderId || ord._id) ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <CheckCircle2 size={14} /> {approvalStatus === 'APPROVED' ? 'APPROVED' : 'APPROVE ORDER'}
                      </button>

                      <button
                        onClick={() => handleUpdateApproval(ord.orderId || ord._id, 'DISPATCHED')}
                        disabled={updatingId === (ord.orderId || ord._id) || approvalStatus === 'DISPATCHED'}
                        style={{
                          backgroundColor: approvalStatus === 'DISPATCHED' ? 'rgba(0, 240, 255, 0.15)' : '#00f0ff',
                          color: approvalStatus === 'DISPATCHED' ? '#00f0ff' : '#000',
                          border: approvalStatus === 'DISPATCHED' ? '1px solid #00f0ff' : 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: (updatingId === (ord.orderId || ord._id) || approvalStatus === 'DISPATCHED') ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          opacity: updatingId === (ord.orderId || ord._id) ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Truck size={14} /> {approvalStatus === 'DISPATCHED' ? 'DISPATCHED' : 'MARK DISPATCHED'}
                      </button>

                      <button
                        onClick={() => handleUpdateApproval(ord.orderId || ord._id, 'REJECTED')}
                        disabled={updatingId === (ord.orderId || ord._id) || approvalStatus === 'REJECTED'}
                        style={{
                          backgroundColor: approvalStatus === 'REJECTED' ? 'rgba(255, 0, 85, 0.15)' : '#ff0055',
                          color: approvalStatus === 'REJECTED' ? '#ff0055' : '#ffffff',
                          border: approvalStatus === 'REJECTED' ? '1px solid rgba(255, 0, 85, 0.4)' : 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: (updatingId === (ord.orderId || ord._id) || approvalStatus === 'REJECTED') ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          opacity: updatingId === (ord.orderId || ord._id) ? 0.6 : 1,
                          boxShadow: approvalStatus === 'REJECTED' ? 'none' : '0 2px 10px rgba(255, 0, 85, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {updatingId === (ord.orderId || ord._id) ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> UPDATING...
                          </>
                        ) : (
                          <>
                            <XCircle size={14} /> {approvalStatus === 'REJECTED' ? 'REJECTED' : 'REJECT ORDER'}
                          </>
                        )}
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
