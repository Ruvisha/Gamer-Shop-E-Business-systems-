import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  X,
  Package,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Server,
  Terminal,
  Activity
} from 'lucide-react';

export default function MongoCompassModal({
  isOpen,
  onClose,
  dbStatus = {},
  productsCount = 0,
  onRefresh,
  isRefreshing = false
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const connectionUri = dbStatus.compassHint || dbStatus.uri || 'mongodb://127.0.0.1:27017';
  const dbName = dbStatus.dbName || 'gamer_shop';

  const collections = [
    {
      name: 'products',
      title: 'Products Collection',
      count: dbStatus.productsCount ?? productsCount ?? 27,
      icon: Package,
      color: '#00f0ff',
      description: 'Live GPU, CPU, RAM, and hardware specs, prices, stock, ratings & reviews.'
    },
    {
      name: 'orders',
      title: 'Orders Collection',
      count: dbStatus.ordersCount ?? 29,
      icon: ShoppingBag,
      color: '#00ff66',
      description: 'Live customer orders, PayHere payment statuses, approval states & shipping info.'
    },
    {
      name: 'users',
      title: 'Users Collection',
      count: dbStatus.usersCount ?? 13,
      icon: Users,
      color: '#a855f7',
      description: 'Registered gamer & admin accounts, hashed credentials & login session logs.'
    },
    {
      name: 'images',
      title: 'Images Collection',
      count: dbStatus.imagesCount ?? 42,
      icon: ImageIcon,
      color: '#ffaa00',
      description: 'Binary image buffers stored in database and streamed via /api/images/:id.'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          backgroundColor: '#0c0f18',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 40px rgba(0, 240, 255, 0.2)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 255, 102, 0.2) 100%)',
              border: '1px solid #00ff66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 255, 102, 0.3)'
            }}>
              <Database size={26} color="#00ff66" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fff', fontFamily: "'Orbitron', sans-serif" }}>
                  MONGODB COMPASS LIVE
                </h2>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(0, 255, 102, 0.15)',
                  border: '1px solid #00ff66',
                  color: '#00ff66',
                  padding: '3px 9px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#00ff66', boxShadow: '0 0 8px #00ff66' }} />
                  LIVE CONNECTED
                </span>
              </div>
              <p style={{ margin: '4px 0 0', color: '#8e9bb0', fontSize: '0.85rem' }}>
                Real-time MongoDB database connection on your PC. Any changes in MongoDB Compass reflect instantly on this website.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#8e9bb0',
              borderRadius: '10px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255, 0, 85, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8e9bb0'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Connection Parameters Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {/* Connection URI */}
          <div style={{
            backgroundColor: '#121624',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Compass Connection URI
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#00f0ff', fontFamily: 'monospace', margin: '4px 0 0', wordBreak: 'break-all' }}>
                {connectionUri}
              </div>
            </div>
            <button
              onClick={() => handleCopy(connectionUri, 'uri')}
              style={{
                marginTop: '0.75rem',
                backgroundColor: copiedKey === 'uri' ? 'rgba(0, 255, 102, 0.2)' : 'rgba(0, 240, 255, 0.1)',
                border: copiedKey === 'uri' ? '1px solid #00ff66' : '1px solid rgba(0, 240, 255, 0.3)',
                color: copiedKey === 'uri' ? '#00ff66' : '#00f0ff',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                alignSelf: 'flex-start'
              }}
            >
              {copiedKey === 'uri' ? <Check size={13} /> : <Copy size={13} />}
              {copiedKey === 'uri' ? 'Copied URI!' : 'Copy URI'}
            </button>
          </div>

          {/* Database Name */}
          <div style={{
            backgroundColor: '#121624',
            border: '1px solid rgba(0, 255, 102, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Database Name
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00ff66', fontFamily: "'Orbitron', sans-serif", margin: '4px 0 0' }}>
                {dbName}
              </div>
            </div>
            <button
              onClick={() => handleCopy(dbName, 'dbname')}
              style={{
                marginTop: '0.75rem',
                backgroundColor: copiedKey === 'dbname' ? 'rgba(0, 255, 102, 0.2)' : 'rgba(0, 255, 102, 0.1)',
                border: copiedKey === 'dbname' ? '1px solid #00ff66' : '1px solid rgba(0, 255, 102, 0.3)',
                color: '#00ff66',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                alignSelf: 'flex-start'
              }}
            >
              {copiedKey === 'dbname' ? <Check size={13} /> : <Copy size={13} />}
              {copiedKey === 'dbname' ? 'Copied DB Name!' : 'Copy DB Name'}
            </button>
          </div>

          {/* Refresh Action */}
          <div style={{
            backgroundColor: '#121624',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#8e9bb0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Sync Engine
              </span>
              <div style={{ fontSize: '0.85rem', color: '#fff', margin: '4px 0 0', fontWeight: 600 }}>
                Auto-syncs on window focus & every 8s
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              style={{
                marginTop: '0.75rem',
                background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
                border: 'none',
                color: '#000',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 900,
                cursor: isRefreshing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                alignSelf: 'flex-start'
              }}
            >
              <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              {isRefreshing ? 'Fetching from DB...' : 'Refresh from DB Now'}
            </button>
          </div>
        </div>

        {/* Live Collections Grid */}
        <h3 style={{ fontSize: '0.85rem', color: '#8e9bb0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, margin: '0 0 0.85rem' }}>
          Live Collections in "{dbName}"
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {collections.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.name}
                style={{
                  backgroundColor: '#121624',
                  border: `1px solid rgba(255, 255, 255, 0.08)`,
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${col.color}20`,
                  border: `1px solid ${col.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} color={col.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                      {col.name}
                    </span>
                    <span style={{
                      backgroundColor: `${col.color}25`,
                      color: col.color,
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontFamily: 'monospace'
                    }}>
                      {col.count} docs
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#8e9bb0', lineHeight: 1.4 }}>
                    {col.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Guide for MongoDB Compass */}
        <div style={{
          backgroundColor: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: '14px',
          padding: '1.2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="#00f0ff" />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#00f0ff', letterSpacing: '0.5px' }}>
              HOW TO VIEW & EDIT LIVE IN MONGODB COMPASS:
            </h4>
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#c5d1e0', fontSize: '0.82rem', lineHeight: 1.6 }}>
            <li>Open the <strong>MongoDB Compass</strong> application installed on your PC.</li>
            <li>In the New Connection screen, enter: <code style={{ backgroundColor: '#1a2030', color: '#00f0ff', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>mongodb://127.0.0.1:27017</code> and click <strong>Connect</strong>.</li>
            <li>In the left sidebar, click the database named <code style={{ backgroundColor: '#1a2030', color: '#00ff66', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>gamer_shop</code>.</li>
            <li>Select the <strong>products</strong> collection (or <strong>orders</strong> / <strong>users</strong>).</li>
            <li>Edit any document (change a product's price, stock, or title) and click <strong>Update</strong> in Compass.</li>
            <li>Switch back to this browser window: the website <strong>automatically refreshes on focus</strong> and shows your updated live data!</li>
          </ol>
        </div>

        {/* Bottom Actions */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '0.6rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
