// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import api from '../lib/axios'; 
import { CartItem, User, UserResponse } from '../types'; 

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (sku: string, quantity: number) => Promise<void>; 
  
  // SỬA LẠI INTERFACE: Các hàm này nhận 'variantId' (number)
  // để khớp với CartSidebar.tsx
  removeFromCart: (variantId: number) => Promise<void>; 
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;

  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  currentUser: User | null; 
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, currentUser }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart'); 
      setCartItems(res.data.items || []); 
    } catch (err: any) {
      console.error('Lỗi lấy giỏ hàng:', err.response?.data || err.message);
      setCartItems([]); // Nếu lỗi thì set giỏ rỗng
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && currentUser) {
      fetchCart();
    } else if (!currentUser) {
      setCartItems([]);
    }
  }, [currentUser, fetchCart]);

  const addToCart = useCallback(async (sku: string, quantity: number = 1) => {
    try {
      await api.post('/cart/add', { variantID: sku, quantity: quantity }); 
      await fetchCart();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể thêm vào giỏ');
    }
  }, [fetchCart]);

  // --- SỬA LOGIC CỦA 2 HÀM NÀY ---

  const removeFromCart = useCallback(async (variantId: number) => {
    // 1. Nhận 'variantId' (số) từ CartSidebar
    // 2. Tìm 'sku' (chuỗi) trong state
    const item = cartItems.find(i => i.variantId === variantId);
    if (!item) {
        console.error("Không tìm thấy item để xóa");
        return; 
    }
    
    try {
      // 3. Gọi API backend bằng 'sku'
      await api.delete(`/cart/remove/${item.sku}`); 
      await fetchCart(); // Tải lại giỏ
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể xóa');
    }
  }, [cartItems, fetchCart]); // Cần 'cartItems' để tìm SKU

  const updateQuantity = useCallback(async (variantId: number, quantity: number) => {
    // 1. Nhận 'variantId' (số) từ CartSidebar
    // 2. Tìm 'sku' (chuỗi)
    const item = cartItems.find(i => i.variantId === variantId);
    if (!item) {
        console.error("Không tìm thấy item để cập nhật");
        return;
    }

    if (quantity <= 0) {
      // Nếu số lượng là 0, gọi hàm xóa
      await removeFromCart(variantId);
      return;
    }
    
    try {
      // 3. Gọi API backend bằng 'sku'
      await api.put('/cart/update', { variantID: item.sku, quantity: quantity }); 
      await fetchCart(); // Tải lại giỏ
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể cập nhật');
    }
  }, [cartItems, fetchCart, removeFromCart]); // Cần 'cartItems' và 'removeFromCart'

  const clearCart = useCallback(async () => {
    try {
      // (TODO: Backend chưa có API /cart/clear)
      // await api.delete('/cart/clear'); 
      setCartItems([]); // Tạm thời xóa ở frontend
    } catch (err: any) {
      console.error('Lỗi xóa giỏ:', err.response?.data || err.message);
    }
  }, []); 
  
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      total,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};