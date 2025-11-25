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

// === HÀM MAP DỮ LIỆU QUAN TRỌNG (ĐÃ SỬA) ===
const mapProductResponseToProduct = (res: any): Product => {
  const mappedVariants = (res.variants || []).map((v: any) => {
      const { flavor: parsedFlavor, size: parsedSize } = parseVariantName(v.name);
      return { 
          ...v, 
          flavor: parsedFlavor, 
          size: parsedSize,
          imageUrl: v.imageUrl,
          categoryId: res.categoryId || 0,
          parentCategoryId: res.parentCategoryId || undefined,
          oldPrice: v.salePrice 
      };
  });
  const allFlavors: string[] = [...new Set<string>(mappedVariants.map((v: any) => v.flavor as string).filter(Boolean))];
  const allSizes: string[] = [...new Set<string>(mappedVariants.map((v: any) => v.size as string).filter(Boolean))];
  const firstVariant = mappedVariants.length > 0 ? mappedVariants[0] : null;

  // 1. Logic Ảnh
  let finalImages: string[] = [];
  if (res.gallery && Array.isArray(res.gallery) && res.gallery.length > 0) finalImages = res.gallery;
  else if (res.thumbnail && typeof res.thumbnail === 'string') finalImages = [res.thumbnail];
  else if (res.imageUrls && Array.isArray(res.imageUrls) && res.imageUrls.length > 0) finalImages = res.imageUrls;
  else if (res.images && Array.isArray(res.images) && res.images.length > 0) finalImages = res.images;
  else if (res.imageUrl && typeof res.imageUrl === 'string') finalImages = [res.imageUrl];
  else if (res.image && typeof res.image === 'string') finalImages = [res.image];
  
  if (finalImages.length === 0) finalImages = [`https://placehold.co/400x400?text=No+Image`];

  // 2. Logic Comment
  const rawComments = res.reviews || res.comments || []; // Backend của bạn trả về reviewsList hay reviews thì sửa ở đây nếu cần
  const mappedComments = Array.isArray(rawComments) ? rawComments.map((c: any) => ({
      id: c.id || Math.random(),
      author: c.author || c.userName || c.user?.fullName || c.username || "Người dùng",
      rating: c.rating || 5,
      comment: c.content || c.comment || c.text || "",
      date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : "Vừa xong",
      avatar: c.avatar || `https://ui-avatars.com/api/?name=${c.author || "User"}&background=random`
  })) : [];

  // Map reviewList từ backend (nếu có trường reviewList riêng)
  const finalReviewsList = res.reviewList ? res.reviewList.map((r: any) => ({
      id: r.id,
      username: r.username,
      avatar: r.avatar,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
  })) : mappedComments; // Fallback về mappedComments nếu ko có reviewList

  return {
    id: res.productId || res.id,
    name: res.name,
    description: res.description,
    category: res.categoryName || 'Chưa phân loại', 
    brand: res.brandName || 'Chưa rõ',       
    variants: mappedVariants, 
    price: firstVariant?.price || 0,
    oldPrice: firstVariant?.oldPrice || undefined,
    sku: firstVariant?.sku || 'N/A',
    inStock: (firstVariant?.stockQuantity || 0) > 0,
    stockQuantity: firstVariant?.stockQuantity || 0,
    images: finalImages, 
    
    // Dùng reviewList chuẩn từ backend
    
    
    rating: res.averageRating || 0,
    reviews: res.totalReviews || finalReviewsList.length || 0,
    sold: 0,
    flavors: allFlavors, 
    sizes: allSizes,     
    categoryId: res.categoryId || 0, 
    brandId: res.brandId || 0,     
  };
};
// =========================================

const mapBackendOrderToFrontendOrder = (beOrder: any): Order => {
  const mapPaymentStatus = (status: string): PaymentStatus => {
    if (status === 'PAID') return 'Đã thanh toán';
    return 'Chưa thanh toán'; 
  };
  const mapItems = (details: any[]): CartItem[] => {
    return details.map(d => {
      const { flavor: parsedFlavor, size: parsedSize } = parseVariantName(d.variantName || d.productName || 'Default Variant');
      return {
        variantId: d.variantId,
        productId: d.productId || 0, 
        productName: d.productName || 'N/A', 
        name: d.variantName || d.productName, 
        image: `https://placehold.co/400x400?text=Product`, 
        price: d.priceAtPurchase,
        quantity: d.quantity,
        sku: d.sku || 'N/A', 
        size: parsedSize,     
        flavor: parsedFlavor  
      };
    });
  };
  return {
    id: String(beOrder.orderId), 
    date: new Date(beOrder.createdAt).toLocaleString('vi-VN'),
    status: beOrder.status as OrderStatus, 
    total: beOrder.totalAmount,
    items: mapItems(beOrder.orderDetails || []),
    customer: {
      name: beOrder.shippingFullName,
      email: beOrder.shippingEmail || '', 
      phone: beOrder.shippingPhone || '', 
      address: beOrder.shippingAddress,
    },
    paymentStatus: mapPaymentStatus(beOrder.paymentStatus),
    paymentMethod: String(beOrder.paymentMethod).toLowerCase() as ('cod' | 'card'),
  };
};

type Page = 'home' | 'product' | 'category' | 'checkout' | 'brands' | 'account' | 'order-history';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminViewingSite, setIsAdminViewingSite] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.className = 'bg-gym-darker text-white'; 
    if (currentUser?.role === 'ADMIN' && !isAdminViewingSite) {
        body.classList.add(`admin-theme-${theme}`);
    } else {
        body.classList.add(`theme-${theme}`);
    }
  }, [theme, currentUser, isAdminViewingSite]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/products');
      console.log("Data products từ Backend:", res.data);
      const mappedProducts = res.data.map(mapProductResponseToProduct);
      setProducts(mappedProducts); 
    } catch (err: any) {
      console.error("Lỗi tải lại products:", err);
    }
  }, []); 

  const fetchOrders = useCallback(async (userRole: 'ADMIN' | 'USER') => {
    try {
      const endpoint = userRole === 'ADMIN' ? '/orders' : '/orders/my-orders';
      const res = await api.get(endpoint);
      const mappedOrders = res.data.map(mapBackendOrderToFrontendOrder);
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Lỗi tải đơn hàng:", err);
      setOrders([]); 
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user'); 
    if (token && userJson) {
      try {
        const user: UserResponse = JSON.parse(userJson); 
        const userRole = user.role as ('USER' | 'ADMIN'); 
        setCurrentUser({
          name: `${user.firstName} ${user.lastName}`,
          role: userRole
        });
        fetchOrders(userRole); 
      } catch (e) {
        console.error("Lỗi parse user JSON:", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    fetchProducts(); 
  }, [fetchProducts, fetchOrders]);

  const handleLoginSuccess = useCallback((userResponse: UserResponse) => { 
    localStorage.setItem('user', JSON.stringify(userResponse));
    const userRole = userResponse.role as ('USER' | 'ADMIN');
    setCurrentUser({
      name: `${userResponse.firstName} ${userResponse.lastName}`, 
      role: userRole
    });
    fetchOrders(userRole);
    setIsAuthModalOpen(false);
    if (userRole === 'ADMIN') setIsAdminViewingSite(false);
  }, [fetchOrders]); 

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    setCurrentUser(null);
    setOrders([]); 
    setPage('home');
    setIsAdminViewingSite(false);
  }, []);

  const handleAddProduct = useCallback(async (request: CreateProductRequest) => {
    try {
      await api.post('/products', request); 
      alert('Thêm sản phẩm thành công!');
      await fetchProducts(); 
    } catch (err: any) {
      console.error("Lỗi Thêm sản phẩm:", err);
      alert("LỖI: " + (err as any).response?.data?.message || (err as any).message);
    }
  }, [fetchProducts]);

  const handleUpdateProduct = useCallback(async (productId: number, request: CreateProductRequest) => {
    try {
      await api.put(`/products/${productId}`, request);
      alert('Cập nhật thành công!');
      await fetchProducts(); 
    } catch (err: any) {
      console.error("Lỗi Cập nhật sản phẩm:", err);
      alert("LỖI: " + (err as any).response?.data?.message || (err as any).message);
    }
  }, [fetchProducts]);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn XÓA sản phẩm này không?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    } catch (err: any) {
      console.error("Lỗi Xóa sản phẩm:", err);
      alert("LỖI: " + (err as any).response?.data?.message || (err as any).message);
    }
  }, []);
  
  const handleOrderSuccess = useCallback(() => {
    fetchProducts(); 
    if (currentUser) fetchOrders(currentUser.role); 
    setPage('home'); 
    window.scrollTo(0, 0);
  }, [fetchProducts, fetchOrders, currentUser]); 

  const handleUpdateOrderStatus = useCallback(async (
      orderId: string, 
      action: OrderStatus | 'CANCEL_USER' 
    ) => {
    if (!currentUser) {
        alert('Vui lòng đăng nhập lại để thực hiện.');
        return;
    }
    try {
        const orderIdNum = parseInt(orderId.replace(/[^0-9]/g, ''));
        if (currentUser.role === 'ADMIN' && action !== 'CANCEL_USER') {
             await api.put(`/orders/admin/${orderIdNum}/status`, { newStatus: action });
        } else if (currentUser.role === 'USER' && action === 'CANCEL_USER') {
            await api.put(`/orders/${orderIdNum}/cancel`);
        } else {
            alert('Không có quyền thay đổi trạng thái này.');
            return;
        }
        await fetchOrders(currentUser.role);
        alert(`Cập nhật đơn hàng ${orderId} thành công!`); 
    } catch (err: any) {
        console.error("Lỗi Cập nhật trạng thái đơn hàng:", err);
        alert("LỖI: " + (err as any).response?.data?.message || (err as any).message);
    }
  }, [currentUser, fetchOrders]);

  const handleAdminViewSite = useCallback(() => {
    setIsAdminViewingSite(true);
    setPage('home');
    window.scrollTo(0, 0);
  }, []);

  const handleAdminReturnToPanel = useCallback(() => {
    setIsAdminViewingSite(false);
    window.scrollTo(0, 0);
  }, []);

  const handleGoHome = useCallback(() => {
    setPage('home');
    setSelectedProduct(null);
    setSelectedCategory(null);
    setSelectedBrand(null);
    window.scrollTo(0, 0);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    if (category === 'Thương hiệu') setPage('brands');
    else {
        setSelectedCategory(category);
        setSelectedBrand(null);
        setPage('category');
    }
    window.scrollTo(0, 0);
  }, []);
  
  const handleBrandSelect = useCallback((brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedCategory(null);
    setPage('category');
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    if (currentUser) {
      setPage('checkout');
      window.scrollTo(0, 0);
    } else {
      setIsAuthModalOpen(true);
    }
  }, [currentUser]);
  
  const handleAccountClick = useCallback(() => {
    if (currentUser) {
      setPage('account');
      window.scrollTo(0, 0);
    } else setIsAuthModalOpen(true);
  }, [currentUser]);

  const handleOrderHistoryClick = useCallback(() => {
    if (currentUser) {
      setPage('order-history');
      window.scrollTo(0, 0);
    } else setIsAuthModalOpen(true);
  }, [currentUser]);

  const handleAuthClick = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const handleStockSubscribe = useCallback((productId: number, email: string) => {
    console.log("Gửi đăng ký nhận hàng:", { productId, email });
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'product':
        return <ProductPage 
                  product={selectedProduct!} 
                  onBack={handleGoHome} 
                  currentUser={currentUser}
                  onAuthClick={handleAuthClick}
                  onStockSubscribe={handleStockSubscribe}
                  onCategorySelect={handleCategorySelect} // Pass thêm prop này
                />;
      case 'category':
        const filterBy = selectedBrand 
          ? { type: 'brand' as const, value: selectedBrand }
          : { type: 'category' as const, value: selectedCategory! };
        return <CategoryPage products={products} filterBy={filterBy} onProductSelect={handleProductSelect} onBack={handleGoHome} />;
      case 'checkout':
        return <CheckoutPage 
                  onBackToShop={handleGoHome} 
                  onOrderSuccess={handleOrderSuccess} 
                  currentUser={currentUser} 
                />;
      case 'brands':
        return <BrandsPage brands={brands} onBack={handleGoHome} onBrandSelect={handleBrandSelect} />;
      case 'account':
        return <AccountPage currentUser={currentUser!} onBack={handleGoHome} />;
      case 'order-history':
        return <OrderHistoryPage 
                  onBack={handleGoHome} 
                  orders={orders} 
                  onUpdateOrderStatus={handleUpdateOrderStatus} 
                />;
      case 'home':
      default:
        return <HomePage products={products} onProductSelect={handleProductSelect} onCategorySelect={handleCategorySelect} />;
    }
  };

  if (currentUser?.role === 'ADMIN' && !isAdminViewingSite) {
    return <AdminPage 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onViewSite={handleAdminViewSite}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus} 
    />;
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
            onLogout={handleLogout}
            onAccountClick={handleAccountClick}
            onOrderHistoryClick={handleOrderHistoryClick}
            isAdminViewingSite={currentUser?.role === 'ADMIN' && isAdminViewingSite}
            onReturnToAdmin={handleAdminReturnToPanel}
        />
        <main className="min-h-screen">{renderPage()}</main>
        <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            onCheckout={handleCheckout} 
        />
        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
        />
        <Footer />
        <Chatbot />
      </div>
    </CartProvider>
  );
};

export default App;