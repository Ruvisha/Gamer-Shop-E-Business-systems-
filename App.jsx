import React, { useState } from 'react';
import Navbar from './Navbar';
import DashboardNav from './DashboardNav';
import Hero from './Hero';
import CategoryNav from './CategoryNav';
import FlashSale from './FlashSale';
import PcBuilder from './PcBuilder';
import ProductGrid from './ProductGrid';
import Testimonials from './Testimonials';
import Footer from './Footer';
import ProductModal from './ProductModal';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import Toast from './Toast';

import { products } from './products';

export default function App() {
  const [cartItems, setCartItems] = useState([
    { ...products[0], quantity: 1 } // Pre-add RTX 4090 to demo cart badge
  ]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState('home'); // 'home', 'catalog', 'builder', 'deals'

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    setToast({
      type: 'cart',
      title: 'ADDED TO CART',
      message: `${product.name} has been added!`
    });
  };

  const handleAddBuildToCart = (buildItems) => {
    if (!buildItems || buildItems.length === 0) return;

    setCartItems((prevItems) => {
      let updated = [...prevItems];
      buildItems.forEach((product) => {
        const existing = updated.find((item) => item.id === product.id);
        if (existing) {
          updated = updated.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updated.push({ ...product, quantity: 1 });
        }
      });
      return updated;
    });

    setToast({
      type: 'success',
      title: 'RIG ADDED TO CART',
      message: `Added ${buildItems.length} custom computer parts to cart!`
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    setToast({
      type: 'error',
      title: 'REMOVED',
      message: 'Item removed from cart'
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    setToast({
      type: 'success',
      title: 'WELCOME BACK!',
      message: `Signed in as ${userProfile.name}`
    });
  };

  const handleLogout = () => {
    setUser(null);
    setToast({
      type: 'cart',
      title: 'SIGNED OUT',
      message: 'You have been signed out safely.'
    });
  };

  const dealProducts = products.filter(p => p.isFlashSale);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={3}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateBuilder={() => setActiveSection('builder')}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q) setActiveSection('catalog');
        }}
        selectedCategory={activeCategory}
        setSelectedCategory={setActiveCategory}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Dashboard Section Selection Navigation Bar */}
      <DashboardNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        totalProductsCount={products.length}
        dealProductsCount={dealProducts.length}
      />

      {/* DYNAMIC SECTION RENDERING ACCORDING TO SELECTION */}
      <div style={{ flex: 1 }}>
        {/* 1. HOME OVERVIEW SECTION */}
        {activeSection === 'home' && (
          <>
            <Hero
              onExploreClick={() => setActiveSection('catalog')}
              onBuilderClick={() => setActiveSection('builder')}
            />
            <FlashSale
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                setActiveSection('catalog');
              }}
            />
            <Testimonials />
          </>
        )}

        {/* 2. DEDICATED HARDWARE CATALOG & FILTERING PAGE */}
        {activeSection === 'catalog' && (
          <div>
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={(catId) => setActiveCategory(catId)}
            />
            <ProductGrid
              products={products}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          </div>
        )}

        {/* 3. DEDICATED CUSTOM PC BUILDER PAGE */}
        {activeSection === 'builder' && (
          <div style={{ padding: '1rem 0' }}>
            <PcBuilder
              onAddBuildToCart={handleAddBuildToCart}
            />
          </div>
        )}

        {/* 4. DEDICATED FLASH SALE DEALS SECTION */}
        {activeSection === 'deals' && (
          <div style={{ padding: '1rem 0 3rem' }}>
            <FlashSale
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
            <ProductGrid
              products={dealProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer onShowToast={(t) => setToast(t)} />

      {/* Modals & Drawers */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onShowToast={(t) => setToast(t)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
