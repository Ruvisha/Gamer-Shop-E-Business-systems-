import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardNav from './components/DashboardNav';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import FlashSale from './components/FlashSale';
import PcBuilder from './components/PcBuilder';
import ProductGrid from './components/ProductGrid';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductDetailsPage from './components/ProductDetailsPage';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AdminProductModal from './components/AdminProductModal';
import UserOrdersModal from './components/UserOrdersModal';
import AdminOrdersModal from './components/AdminOrdersModal';
import Toast from './components/Toast';

export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousSection, setPreviousSection] = useState('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserOrdersOpen, setIsUserOrdersOpen] = useState(false);
  const [isAdminOrdersOpen, setIsAdminOrdersOpen] = useState(false);
  const [authReason, setAuthReason] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  
  // Admin & User Role Management
  const [user, setUser] = useState(null);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'catalog', 'builder', 'deals', 'product-details'

  // Fetch product list directly from MongoDB database on mount
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setDbError(null);
    try {
      let res = await fetch('/api/products').catch(() => null);
      if (!res || !res.ok) {
        res = await fetch('http://localhost:3000/api/products').catch(() => null);
      }
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map(p => ({
            ...p,
            image: p.image || `/api/images/${p.id}`,
            fallbackImage: p.fallbackImage || `/images/${p.id}.jpg`
          }));
          setAllProducts(normalized);
        } else {
          setAllProducts([]);
        }
      } else {
        setDbError('Could not connect to MongoDB server. Ensure backend is running.');
      }
    } catch (err) {
      console.error('Failed to fetch products from MongoDB:', err);
      setDbError(err.message || 'Database connection error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      // Auto-recheck if initial fetch was before backend/MongoDB ready
      if (allProducts.length === 0) {
        fetchProducts();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [allProducts.length]);

  // Handle PayHere Payment Return Redirect URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const orderId = params.get('orderId');

    if (paymentStatus === 'success') {
      setCartItems([]);
      setToast({
        type: 'auth',
        title: 'PAYHERE PAYMENT CONFIRMED!',
        message: `Your PayHere Sandbox order ${orderId ? `#${orderId}` : ''} has been confirmed!`
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel') {
      setToast({
        type: 'info',
        title: 'PAYMENT CANCELLED',
        message: 'PayHere Sandbox transaction was cancelled.'
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOpenProductDetails = (product) => {
    setSelectedProduct(product);
    if (activeSection !== 'product-details') {
      setPreviousSection(activeSection);
    }
    setActiveSection('product-details');
  };

  // Cart Handlers
  const handleAddToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prevItems, { ...product, quantity: qty }];
    });

    setToast({
      type: 'cart',
      title: 'ADDED TO CART',
      message: `${product.name} ${qty > 1 ? `(${qty}x)` : ''} has been added!`
    });
    return true;
  };

  const handleAddBuildToCart = (buildItems) => {
    setCartItems((prev) => {
      let updated = [...prev];
      buildItems.forEach((part) => {
        const existing = updated.find((item) => item.id === part.id);
        if (existing) {
          updated = updated.map((item) =>
            item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updated.push({ ...part, quantity: 1 });
        }
      });
      return updated;
    });

    setIsCartOpen(true);
    setToast({
      type: 'cart',
      title: 'CUSTOM BUILD ADDED',
      message: `All ${buildItems.length} build components added to your cart!`
    });
    return true;
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    setToast({
      type: 'info',
      title: 'ITEM REMOVED',
      message: 'Product removed from your cart.'
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setToast({
      type: 'info',
      title: 'CART CLEARED',
      message: 'All items removed.'
    });
  };

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    setToast({
      type: 'auth',
      title: `LOGGED IN AS ${userProfile.role.toUpperCase()}`,
      message: `Welcome back, ${userProfile.name}! (${userProfile.role === 'admin' ? 'Full Admin CRUD Enabled' : 'User Browse & Search Mode'})`
    });

    // Execute pending action if user tried to add to cart or purchase before signing in
    if (pendingAction) {
      if (pendingAction.type === 'addToCart' && pendingAction.product) {
        const qty = pendingAction.quantity || 1;
        setCartItems((prevItems) => {
          const existing = prevItems.find((item) => item.id === pendingAction.product.id);
          if (existing) {
            return prevItems.map((item) =>
              item.id === pendingAction.product.id ? { ...item, quantity: item.quantity + qty } : item
            );
          }
          return [...prevItems, { ...pendingAction.product, quantity: qty }];
        });
        setToast({
          type: 'cart',
          title: 'ADDED TO CART',
          message: `${pendingAction.product.name} has been added to your cart!`
        });
      } else if (pendingAction.type === 'addBuildToCart' && pendingAction.buildItems) {
        setCartItems((prev) => {
          let updated = [...prev];
          pendingAction.buildItems.forEach((part) => {
            const existing = updated.find((item) => item.id === part.id);
            if (existing) {
              updated = updated.map((item) =>
                item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
              );
            } else {
              updated.push({ ...part, quantity: 1 });
            }
          });
          return updated;
        });
        setIsCartOpen(true);
        setToast({
          type: 'cart',
          title: 'CUSTOM BUILD ADDED',
          message: `All ${pendingAction.buildItems.length} build components added to your cart!`
        });
      } else if (pendingAction.type === 'buyNow' && pendingAction.product) {
        const qty = pendingAction.quantity || 1;
        setCartItems((prevItems) => {
          const existing = prevItems.find((item) => item.id === pendingAction.product.id);
          if (existing) {
            return prevItems.map((item) =>
              item.id === pendingAction.product.id ? { ...item, quantity: item.quantity + qty } : item
            );
          }
          return [...prevItems, { ...pendingAction.product, quantity: qty }];
        });
        setIsCartOpen(true);
      } else if (pendingAction.type === 'checkout') {
        setIsCartOpen(true);
      }
      setPendingAction(null);
    }
    setAuthReason('');
  };

  const handleLogout = () => {
    setUser(null);
    setToast({
      type: 'info',
      title: 'SIGNED OUT',
      message: 'You have signed out.'
    });
  };


  // ADMIN CRUD HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsAdminModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setIsAdminModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    const isEditing = Boolean(productData.id);
    const method = isEditing ? 'PUT' : 'POST';

    try {
      let res = await fetch(`/api/products${isEditing ? `/${productData.id}` : ''}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`http://localhost:3000/api/products${isEditing ? `/${productData.id}` : ''}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        }).catch(() => null);
      }

      if (res && res.ok) {
        const responseData = await res.json();
        const savedItem = responseData.product || productData;

        if (isEditing) {
          setAllProducts(prev => prev.map(p => p.id === savedItem.id ? savedItem : p));
        } else {
          setAllProducts(prev => [savedItem, ...prev]);
        }
        // Force re-fetch fresh product list directly from MongoDB
        await fetchProducts();

        setToast({
          type: 'auth',
          title: isEditing ? 'PRODUCT UPDATED IN DB' : 'PRODUCT SAVED TO DB',
          message: `"${savedItem.name || productData.name}" saved to MongoDB database successfully!`
        });

        return savedItem;
      } else {
        const errData = res ? await res.json().catch(() => null) : null;
        const errMsg = errData?.error || `Server returned ${res?.status || 'network failure'}`;
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error('Failed to save product to MongoDB:', err);
      setToast({
        type: 'cart',
        title: 'DATABASE SAVE ERROR',
        message: err.message || 'Could not save product to MongoDB.'
      });
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      let res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE'
        }).catch(() => null);
      }

      if (res && res.ok) {
        await fetchProducts();
        setToast({
          type: 'info',
          title: 'PRODUCT DELETED FROM DB',
          message: 'Product removed from MongoDB database successfully.'
        });
      } else {
        const errData = res ? await res.json().catch(() => null) : null;
        throw new Error(errData?.error || 'Failed to delete from MongoDB');
      }
    } catch (err) {
      console.error('Failed to delete product from database:', err);
      setToast({
        type: 'cart',
        title: 'DELETE FAILED',
        message: err.message || 'Could not delete product from database.'
      });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const dealProducts = allProducts.filter((p) => p.isFlashSale);

  return (
    <div style={{ backgroundColor: '#07080c', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Sticky Header Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={3}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateBuilder={() => setActiveSection('builder')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={activeCategory}
        setSelectedCategory={setActiveCategory}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAddProductModal={handleOpenAddProduct}
        onOpenUserOrders={() => setIsUserOrdersOpen(true)}
        onOpenAdminOrders={() => setIsAdminOrdersOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        products={allProducts}
        onQuickView={handleOpenProductDetails}
        onAddToCart={handleAddToCart}
      />

      {/* Secondary Dashboard Navigation Bar */}
      <DashboardNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        totalProductsCount={allProducts.length}
        dealProductsCount={dealProducts.length}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Database Connection Status Notice */}
      {dbError && (
        <div style={{
          backgroundColor: 'rgba(255, 0, 85, 0.15)',
          borderBottom: '1px solid #ff0055',
          padding: '0.8rem 1rem',
          textAlign: 'center',
          color: '#ff6699',
          fontSize: '0.88rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span>Database Notice: {dbError}</span>
          <button
            onClick={fetchProducts}
            style={{
              backgroundColor: '#ff0055',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.3rem 0.8rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Retry DB Connection
          </button>
        </div>
      )}

      {isLoadingProducts && allProducts.length === 0 && (
        <div style={{
          backgroundColor: 'rgba(0, 240, 255, 0.08)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
          padding: '0.6rem 1rem',
          textAlign: 'center',
          color: '#00f0ff',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }}></span>
          <span>Connecting directly to MongoDB database & fetching live products...</span>
        </div>
      )}

      {/* Main Content Area */}
      <div>
        {/* 1. HOME LANDING PAGE */}
        {activeSection === 'home' && (
          <>
            <Hero
              onExploreClick={() => setActiveSection('catalog')}
              onBuilderClick={() => setActiveSection('builder')}
            />

            {/* Quick Category Bar */}
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                setActiveSection('catalog');
              }}
              products={allProducts}
            />

            {/* Flash Sale Banner */}
            <FlashSale
              products={allProducts}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProductDetails}
            />

            {/* Live Hardware Catalog from MongoDB */}
            <ProductGrid
              products={allProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProductDetails}
              user={user}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onOpenAddProductModal={handleOpenAddProduct}
            />

            <Testimonials />
          </>
        )}

        {/* 2. DEDICATED CATALOG / SHOP PAGE */}
        {activeSection === 'catalog' && (
          <div style={{ padding: '1rem 0 3rem' }}>
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              products={allProducts}
            />
            <ProductGrid
              products={allProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProductDetails}
              user={user}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onOpenAddProductModal={handleOpenAddProduct}
            />
          </div>
        )}

        {/* 3. DEDICATED CUSTOM PC BUILDER PAGE */}
        {activeSection === 'builder' && (
          <div style={{ padding: '1rem 0' }}>
            <PcBuilder
              products={allProducts}
              onAddBuildToCart={handleAddBuildToCart}
            />
          </div>
        )}

        {/* 4. DEDICATED FLASH SALE DEALS SECTION */}
        {activeSection === 'deals' && (
          <div style={{ padding: '1rem 0 3rem' }}>
            <FlashSale
              products={allProducts}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProductDetails}
            />
            <ProductGrid
              products={dealProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProductDetails}
              user={user}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onOpenAddProductModal={handleOpenAddProduct}
            />
          </div>
        )}

        {/* 5. DEDICATED FULL PRODUCT DETAILS PAGE */}
        {activeSection === 'product-details' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            allProducts={allProducts}
            user={user}
            onOpenAuth={(reason, action) => {
              if (reason) setAuthReason(reason);
              if (action) setPendingAction(action);
              setIsAuthOpen(true);
              setToast({
                type: 'auth',
                title: 'SIGN IN REQUIRED',
                message: 'Please sign in to complete your purchase!'
              });
            }}
            onBack={() => setActiveSection(previousSection || 'catalog')}
            onAddToCart={handleAddToCart}
            onViewProduct={handleOpenProductDetails}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
      </div>

      {/* Footer */}
      <Footer onShowToast={(t) => setToast(t)} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        user={user}
        onOpenAuth={(reason) => {
          setAuthReason(reason || 'Please sign in or create an account to proceed to checkout.');
          setPendingAction({ type: 'checkout' });
          setIsAuthOpen(true);
          setToast({
            type: 'auth',
            title: 'SIGN IN REQUIRED',
            message: 'Please sign in to complete your purchase!'
          });
        }}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onShowToast={(t) => setToast(t)}
      />

      {/* Auth & Role Selector Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthReason('');
        }}
        authReason={authReason}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Product Management Modal (CRUD) */}
      <AdminProductModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSaveProduct={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* User My Orders & Status Modal */}
      <UserOrdersModal
        isOpen={isUserOrdersOpen}
        onClose={() => setIsUserOrdersOpen(false)}
        user={user}
      />

      {/* Admin Customer Purchases & Order Approvals Modal */}
      <AdminOrdersModal
        isOpen={isAdminOrdersOpen}
        onClose={() => setIsAdminOrdersOpen(false)}
      />

      {/* Toast Notification System */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
