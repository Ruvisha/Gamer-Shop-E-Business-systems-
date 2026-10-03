import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onShowToast
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = (subtotal * discountPercent) / 100;
  const shippingThreshold = 200;
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GAMER10') {
      setDiscountPercent(10);
      onShowToast({ type: 'success', title: 'PROMO APPLIED', message: '10% Gamer Discount applied!' });
    } else {
      onShowToast({ type: 'error', title: 'INVALID CODE', message: 'Use code "GAMER10" for 10% OFF' });
    }
  };

  const handleSimulateCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckoutSuccess(false);
      onClose();
      onShowToast({ 
        type: 'success', 
        title: 'ORDER PLACED!', 
        message: 'Your gaming hardware order #GS-94281 has been confirmed!' 
      });
    }, 2000);
  };

  return (
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
              YOUR SHOPPING CART
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
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#fff',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '0.6rem',
                marginTop: '0.4rem',
                fontFamily: 'var(--font-stats)'
              }}>
                <span>TOTAL:</span>
                <span style={{ color: '#00f0ff' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              disabled={isCheckoutSuccess}
              onClick={handleSimulateCheckout}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              {isCheckoutSuccess ? (
                <span>PROCESSING PAYMENT...</span>
              ) : (
                <>
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
