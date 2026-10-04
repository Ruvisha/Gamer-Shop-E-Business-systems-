import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, CheckCircle2, CreditCard, Lock, Check } from 'lucide-react';

const sriLankaDistricts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle'
];

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  user,
  onOpenAuth,
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onShowToast
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer Delivery & Billing Form details matching project report spec
  const [customerDetails, setCustomerDetails] = useState({
    fullName: user?.name || 'Sunil Ratnayake',
    email: user?.email || 'customer@example.com',
    primaryPhone: '0771234567',
    whatsappPhone: '0779876543',
    district: 'Colombo',
    city: 'Colombo',
    address: '466/1, Galle Road',
    country: 'Sri Lanka'
  });

  const [paymentMethod, setPaymentMethod] = useState('Online Card Payment (PayHere)');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = (subtotal * discountPercent) / 100;
  const shippingThreshold = 200;
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 15;
  const finalTotalUSD = Math.max(0, subtotal - discount + shippingCost);
  // Convert USD total to LKR for PayHere Sandbox (approx 300 LKR / USD)
  const lkrRate = 300;
  const finalTotalLKR = (finalTotalUSD * lkrRate).toFixed(2);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GAMER10') {
      setDiscountPercent(10);
      onShowToast({ type: 'success', title: 'PROMO APPLIED', message: '10% Gamer Discount applied!' });
    } else {
      onShowToast({ type: 'error', title: 'INVALID CODE', message: 'Use code "GAMER10" for 10% OFF' });
    }
  };

  const handleStartCheckout = () => {
    if (!user) {
      onClose();
      if (onOpenAuth) {
        onOpenAuth('Please sign in or create an account to proceed to checkout and complete your order.');
      }
      return;
    }
    setCustomerDetails(prev => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email
    }));
    setIsCheckoutModalOpen(true);
  };

  // PayHere Form Submission & Validation matching project report spec
  const handlePayHereSubmit = async (e) => {
    e.preventDefault();

    // 1. Environment & Request Origin Check (Prevent PayHere Unauthorized Payment Request)
    if (window.location.protocol === 'file:') {
      alert("ENVIRONMENT ERROR: PayHere Sandbox blocks payments initiated directly from 'file://' paths because browsers omit domain headers.\n\nPlease run your website via a local web server (e.g. http://localhost:5173 or http://localhost).");
      return;
    }

    // 2. Mandatory JS Form Validation as specified in report
    if (
      !customerDetails.fullName.trim() || 
      !customerDetails.primaryPhone.trim() || 
      !customerDetails.address.trim() || 
      !customerDetails.city.trim() ||
      !customerDetails.district.trim()
    ) {
      alert("Please complete Full Name, Phone, Address and City.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Call backend API to generate PayHere Hash & save pending order in MongoDB
      const response = await fetch('http://localhost:3000/api/payment/checkout-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotalLKR,
          amountUSD: finalTotalUSD,
          items: cartItems,
          customerDetails,
          paymentMethod,
          userEmail: user?.email || customerDetails.email,
          userName: customerDetails.fullName
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate PayHere payment parameters.');
      }

      // If Cash on Delivery selected
      if (paymentMethod.includes('Cash')) {
        onClearCart();
        setIsProcessing(false);
        setIsCheckoutModalOpen(false);
        onClose();
        onShowToast({
          type: 'success',
          title: 'ORDER PLACED (CASH ON DELIVERY)',
          message: `Order ${data.orderId} submitted! Waiting for Admin approval.`
        });
        return;
      }

      // 2. Build hidden HTML form & auto-submit directly to PayHere Sandbox
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.sandboxUrl || 'https://sandbox.payhere.lk/pay/checkout';

      const fields = {
        merchant_id: data.merchantId,
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
        notify_url: data.notifyUrl,
        order_id: data.orderId,
        items: data.items,
        currency: data.currency,
        amount: data.amount,
        first_name: data.customerDetails.first_name,
        last_name: data.customerDetails.last_name,
        email: data.customerDetails.email,
        phone: data.customerDetails.phone,
        address: data.customerDetails.address,
        city: data.customerDetails.city,
        country: data.customerDetails.country,
        hash: data.hash
      };

      Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      onShowToast({
        type: 'info',
        title: 'REDIRECTING TO PAYHERE',
        message: 'Opening PayHere Sandbox secure payment gateway...'
      });

      form.submit();
    } catch (err) {
      console.error('[PayHere Sandbox Error]:', err.message);
      onShowToast({
        type: 'error',
        title: 'PAYMENT INITIATION FAILED',
        message: err.message
      });
      setIsProcessing(false);
    }
  };

  // Instant Test Confirmation (Simulate Instant Sandbox Success)
  const handleInstantSandboxConfirm = async () => {
    setIsProcessing(true);
    try {
      const orderId = `#${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      
      // Save order in MongoDB
      await fetch('http://localhost:3000/api/payment/checkout-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotalLKR,
          amountUSD: finalTotalUSD,
          items: cartItems,
          customerDetails,
          paymentMethod,
          userEmail: user?.email || customerDetails.email,
          userName: customerDetails.fullName
        })
      });

      setTimeout(() => {
        onClearCart();
        setIsProcessing(false);
        setIsCheckoutModalOpen(false);
        onClose();
        onShowToast({
          type: 'success',
          title: 'ORDER PLACED!',
          message: `PayHere Sandbox Order ${orderId} submitted! Waiting for Admin approval.`
        });
      }, 1200);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9500,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }} onClick={onClose}>
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '460px',
            height: '100%',
            backgroundColor: '#0c0e17',
            borderLeft: '1px solid rgba(0, 240, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
            position: 'relative'
          }}
        >
          {/* Drawer Header */}
          <div style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShoppingBag size={20} color="#00f0ff" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                GAMER SHOP CART
              </h3>
              <span style={{
                backgroundColor: '#00f0ff',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '10px',
                fontFamily: 'var(--font-stats)'
              }}>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} ITEMS
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#8e9bb0',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div style={{
            backgroundColor: '#121624',
            padding: '0.8rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: isFreeShipping ? '#00ff66' : '#8e9bb0', fontWeight: 700 }}>
                {isFreeShipping ? '🎉 UNLOCKED FREE EXPRESS SHIPPING' : `Add $${(shippingThreshold - subtotal).toFixed(2)} more for Free Express Shipping`}
              </span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: '#1f273d', borderRadius: '3px' }}>
              <div style={{
                width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%`,
                height: '100%',
                backgroundColor: isFreeShipping ? '#00ff66' : '#00f0ff',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Cart Item List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '1rem',
                  backgroundColor: '#121624',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  alignItems: 'center'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                      {item.brand}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, lineHeight: 1.2, marginBottom: '0.4rem' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff0055', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#07080c',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '2px 8px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', padding: '0 4px' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '2px 8px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#8e9bb0' }}>
                <ShoppingBag size={48} color="#28334e" style={{ marginBottom: '1rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>YOUR CART IS EMPTY</div>
                <div style={{ fontSize: '0.82rem' }}>Add some extreme gaming hardware to get started!</div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div style={{
              padding: '1.2rem 1.5rem',
              backgroundColor: '#090b12',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {/* Promo code */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Promo Code (Try GAMER10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.8rem',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{
                    backgroundColor: '#1a2235',
                    color: '#00f0ff',
                    border: '1px solid #00f0ff',
                    borderRadius: '8px',
                    padding: '0 0.8rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  APPLY
                </button>
              </div>

              {/* Price Calculations */}
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e9bb0' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff66' }}>
                    <span>Gamer Discount (10%):</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e9bb0' }}>
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? <strong style={{ color: '#00ff66' }}>FREE</strong> : `$${shippingCost}`}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '0.6rem',
                  marginTop: '0.4rem'
                }}>
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                      TOTAL: ${finalTotalUSD.toFixed(2)}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 700 }}>
                      ≈ LKR {Number(finalTotalLKR).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    border: '1px solid #2563eb',
                    color: '#60a5fa',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    PAYHERE SANDBOX
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleStartCheckout}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7000ff 100%)',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                }}
              >
                <CreditCard size={18} />
                <span>PROCEED TO PAYHERE CHECKOUT</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GAMER SHOP - PAYHERE SANDBOX CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: '#0c0f18',
            border: '1px solid rgba(37, 99, 235, 0.5)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(37, 99, 235, 0.25)',
            padding: '1.8rem',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CreditCard size={22} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    GAMER SHOP • PAYHERE CHECKOUT
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>
                    Merchant ID: 1238431 • Currency: LKR
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8e9bb0', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Price Banner */}
            <div style={{
              backgroundColor: '#121624',
              padding: '0.9rem 1.2rem',
              borderRadius: '10px',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              marginBottom: '1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>PAYHERE TOTAL (LKR)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00ff66', fontFamily: 'var(--font-stats)' }}>
                  LKR {Number(finalTotalLKR).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>CART TOTAL (USD)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-stats)' }}>
                  ${finalTotalUSD.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Environment Protocol Warning Banner */}
            {typeof window !== 'undefined' && window.location.protocol === 'file:' && (
              <div style={{
                backgroundColor: 'rgba(255, 0, 85, 0.15)',
                border: '1px solid #ff0055',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.78rem',
                color: '#ff99bb'
              }}>
                <strong style={{ color: '#ff0055', display: 'block', marginBottom: '2px' }}>
                  ⚠️ ENVIRONMENT WARNING: DIRECT FILE PROTOCOL (file://) DETECTED
                </strong>
                PayHere Sandbox blocks payments initiated directly from local HTML files (`file://`). Please run your app over a web server (`http://localhost:5173`) so browsers include origin headers.
              </div>
            )}

            {/* PayHere Sandbox Setup & Troubleshooting Guide Box */}
            <div style={{
              backgroundColor: 'rgba(0, 240, 255, 0.05)',
              border: '1px dashed rgba(0, 240, 255, 0.3)',
              borderRadius: '10px',
              padding: '0.8rem 1rem',
              marginBottom: '1.2rem',
              fontSize: '0.75rem',
              color: '#8e9bb0'
            }}>
              <div style={{ color: '#00f0ff', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>💡 PAYHERE SANDBOX TROUBLESHOOTING TIP</span>
              </div>
              <div>
                To prevent <strong>"Unauthorized payment request"</strong> errors on PayHere Sandbox:
                <ul style={{ margin: '4px 0 0 1.2rem', padding: 0 }}>
                  <li>Ensure your Merchant Integration type in PayHere Portal is set as <strong>Domain</strong> (globe icon for <code>localhost</code>), NOT an <strong>App</strong>.</li>
                  <li>Merchant ID: <code>1238431</code> • Currency: <code>LKR</code> (strictly 2 decimal places e.g., <code>1000.00</code>).</li>
                  <li>Security Hash: <code>UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))))</code></li>
                </ul>
              </div>
            </div>

            <form onSubmit={handlePayHereSubmit}>
              {/* Delivery Information Section matching project report specification */}
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#00f0ff', marginBottom: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                📦 DELIVERY INFORMATION
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                  Full Name <span style={{ color: '#ff0055' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Sunil Ratnayake"
                  value={customerDetails.fullName}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    Email Address <span style={{ color: '#ff0055' }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    Primary Phone Number <span style={{ color: '#ff0055' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0771234567"
                    value={customerDetails.primaryPhone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, primaryPhone: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    Secondary / WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    placeholder="0779876543 (Optional)"
                    value={customerDetails.whatsappPhone}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, whatsappPhone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    District <span style={{ color: '#ff0055' }}>*</span>
                  </label>
                  <select
                    value={customerDetails.district}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, district: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {sriLankaDistricts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    City / Town <span style={{ color: '#ff0055' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Colombo 03"
                    value={customerDetails.city}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, city: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#121624',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={customerDetails.country}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#090c14',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#8e9bb0',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#8e9bb0', marginBottom: '4px', fontWeight: 600 }}>
                  Delivery Street Address <span style={{ color: '#ff0055' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="466/1, Galle Road"
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#121624',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Payment Options Section matching report spec */}
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#00f0ff', marginBottom: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                💳 PAYMENT METHOD OPTIONS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  backgroundColor: paymentMethod.includes('Online') ? 'rgba(37, 99, 235, 0.15)' : '#121624',
                  border: `1px solid ${paymentMethod.includes('Online') ? '#2563eb' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethod.includes('Online')}
                    onChange={() => setPaymentMethod('Online Card Payment (PayHere)')}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                      Online Card Payment (Secure PayHere Payment)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>
                      Visa, MasterCard, Amex & Mobile Wallets via PayHere Sandbox
                    </div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  backgroundColor: paymentMethod.includes('Cash') ? 'rgba(0, 255, 102, 0.12)' : '#121624',
                  border: `1px solid ${paymentMethod.includes('Cash') ? '#00ff66' : 'rgba(255, 255, 255, 0.1)'}`,
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment_option"
                    checked={paymentMethod.includes('Cash')}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
                      Cash on Delivery (COD)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8e9bb0' }}>
                      Pay in cash upon doorstep hardware delivery
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.95rem',
                    fontSize: '1rem',
                    fontWeight: 900,
                    cursor: isProcessing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  <CreditCard size={20} />
                  <span>{isProcessing ? 'PROCESSING ORDER...' : 'PLACE ORDER NOW'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantSandboxConfirm}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0, 255, 102, 0.12)',
                    color: '#00ff66',
                    border: '1px solid rgba(0, 255, 102, 0.3)',
                    borderRadius: '8px',
                    padding: '0.6rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Check size={16} />
                  <span>Instant Test Sandbox Confirmation (Quick Demo)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
