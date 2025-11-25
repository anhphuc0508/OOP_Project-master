// File: src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import api from './lib/axios';
import { CartProvider } from './contexts/CartContext';
import BrandsPage from './components/BrandsPage';
import { 
    Product, 
    Theme, 
    User, 
    Order, 
    OrderStatus, 
    CartItem, 
    UserResponse , 
    CreateProductRequest,
    PaymentStatus,
} from './types';

import Header from './components/Header';
import Footer from './components/Footer'; 
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import { navLinks, brands } from './constants';
import AdminPage from './components/AdminPage';
import AccountPage from './components/AccountPage';
import OrderHistoryPage from './components/OrderHistoryPage';

const parseVariantName = (name: string): { flavor: string, size: string } => {
    const sizeRegex = /(\d+(\.\d+)?\s*(Lbs|kg|Servings))/i;
    const sizeMatch = name.match(sizeRegex);
    let size = "Standard";
    let flavor = name;
    if (sizeMatch && sizeMatch[0]) {
        size = sizeMatch[0].replace(/\s+/g, '');
        flavor = name.replace(sizeRegex, '').replace(/^Vị\s+/i, '').trim();
    } else {
         flavor = name.replace(/^Vị\s+/i, '').trim();
    }
    return { flavor: flavor || 'Default Flavor', size: size };
};

// === HÀM MAP DỮ LIỆU ===
// ... (Giữ nguyên hàm mapProductResponseToProduct cũ của ông) ...
// ... (Giữ nguyên hàm mapBackendOrderToFrontendOrder cũ của ông) ...

type Page = 'home' | 'product' | 'category' | 'checkout' | 'brands' | 'account' | 'order-history';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // State Filter
  const [filterBy, setFilterBy] = useState<{ type: 'category' | 'brand', value: string }>({ type: 'category', value: '' });

  const [theme, setTheme] = useState<Theme>('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminViewingSite, setIsAdminViewingSite] = useState(false);

  // ... (Giữ nguyên useEffect Theme) ...

  // ... (Giữ nguyên các hàm fetchProducts, fetchOrders, useEffect init app, Login/Logout, Admin CRUD...) ...
  // (Copy lại các hàm fetch và handler từ file cũ của ông vào đây nếu cần, tôi chỉ viết phần thay đổi chính)

  // === NAVIGATION HANDLERS ===
  const handleCategorySelect = useCallback((categoryName: string) => {
    setFilterBy({ type: 'category', value: categoryName });
    setPage('category');
    window.scrollTo(0, 0);
  }, []);
  
  const handleBrandSelect = useCallback((brandName: string) => {
    setFilterBy({ type: 'brand', value: brandName });
    setPage('category');
    window.scrollTo(0, 0);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo(0, 0);
  }, []);

  const handleGoHome = useCallback(() => {
    setPage('home');
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  }, []);
  
  // ... (Giữ nguyên các hàm Checkout, Account, History...) ...

  const renderPage = () => {
    switch (page) {
      case 'product':
        return <ProductPage 
                  product={selectedProduct!} 
                  onBack={handleGoHome} 
                  currentUser={currentUser}
                  onAuthClick={() => setIsAuthModalOpen(true)}
                  onStockSubscribe={() => {}}
                  onCategorySelect={handleCategorySelect} // 👈 ĐÃ TRUYỀN PROP NÀY XUỐNG
                />;
      case 'category':
        return <CategoryPage 
                  products={products} 
                  filterBy={filterBy} // Sử dụng state filterBy mới
                  onProductSelect={handleProductSelect} 
                  onBack={handleGoHome} 
               />;
      case 'checkout':
        return <CheckoutPage onBackToShop={handleGoHome} onOrderSuccess={handleGoHome} currentUser={currentUser} />;
      case 'brands':
        return <BrandsPage brands={brands} onBack={handleGoHome} onBrandSelect={handleBrandSelect} />;
      case 'account':
        return <AccountPage currentUser={currentUser!} onBack={handleGoHome} />;
      case 'order-history':
        return <OrderHistoryPage onBack={handleGoHome} orders={orders} onUpdateOrderStatus={() => {}} />;
      case 'home':
      default:
        return <HomePage products={products} onProductSelect={handleProductSelect} onCategorySelect={handleCategorySelect} />;
    }
  };

  if (currentUser?.role === 'ADMIN' && !isAdminViewingSite) {
    // ... (Code Admin cũ giữ nguyên)
     return <AdminPage currentUser={currentUser} onLogout={()=>{}} onViewSite={()=>{}} products={products} onAddProduct={()=>{}} onUpdateProduct={()=>{}} onDeleteProduct={()=>{}} orders={orders} onUpdateOrderStatus={()=>{}} />;
  }

  return (
    <CartProvider currentUser={currentUser}>
      <div className="bg-gym-darker text-white font-sans selection:bg-gym-yellow selection:text-gym-darker">
        <Header 
            navLinks={navLinks}
            products={products}
            onCartClick={() => setIsCartOpen(true)} 
            onAuthClick={() => setIsAuthModalOpen(true)}
            onCategorySelect={handleCategorySelect}
            onProductSelect={handleProductSelect}
            onLogoClick={handleGoHome}
            theme={theme}
            setTheme={setTheme}
            currentUser={currentUser}
            onLogout={()=>{}}
            onAccountClick={()=>{}}
            onOrderHistoryClick={()=>{}}
            isAdminViewingSite={currentUser?.role === 'ADMIN' && isAdminViewingSite}
            onReturnToAdmin={()=>{}}
        />
        <main className="min-h-screen">{renderPage()}</main>
        
        {/* ... (Các Sidebar, Modal, Footer giữ nguyên) ... */}
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={()=>{}} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={()=>{}} />
        <Footer />
        <Chatbot />
      </div>
    </CartProvider>
  );
};

export default App;