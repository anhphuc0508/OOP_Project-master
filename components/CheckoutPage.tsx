import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onPlaceOrder: (orderDetails: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop, onPlaceOrder }) => {
  const { cartItems, itemCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');


  const subtotal: number = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee: number = 0; 
  const total: number = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderDetails = {
        total: total,
        items: cartItems,
        customer: {
            name: fullName,
            email: email,
            phone: phone,
            address: address,
        },
        paymentStatus: paymentMethod === 'cod' ? 'Chưa thanh toán' as const : 'Đã thanh toán' as const,
        paymentMethod: paymentMethod,
    };
    
    onPlaceOrder(orderDetails);
    clearCart();
  };

  const inputStyle = "w-full bg-gym-darker border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow";

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBackToShop} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại cửa hàng
      </button>
      <h1 className="text-4xl font-extrabold text-white tracking-wider text-center mb-10">THANH TOÁN</h1>

      {itemCount === 0 ? (
        <div className="text-center bg-gym-dark p-10 rounded-lg">
          <p className="text-gym-gray text-lg">Giỏ hàng của bạn đang trống.</p>
          <button onClick={onBackToShop} className="mt-6 bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors">
            Bắt đầu mua sắm
          </button>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-12 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Shipping Details */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gym-gray mb-1">Họ và tên</label>
                  <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyle} placeholder="Nguyễn Văn A" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gym-gray mb-1">Email</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} placeholder="you@example.com" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gym-gray mb-1">Số điện thoại</label>
                  <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} placeholder="09xxxxxxxx" required />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gym-gray mb-1">Địa chỉ</label>
                  <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className={inputStyle} placeholder="Số nhà, tên đường, phường/xã, quận/huyện" required />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Phương thức thanh toán</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-gym-yellow bg-gym-dark' : 'border-gray-700 bg-gym-darker'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-5 w-5 text-gym-yellow bg-gym-darker border-gray-600 focus:ring-gym-yellow" />
                  <span className="ml-4 text-white font-semibold">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-gym-yellow bg-gym-dark' : 'border-gray-700 bg-gym-darker'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-5 w-5 text-gym-yellow bg-gym-darker border-gray-600 focus:ring-gym-yellow" />
                  <span className="ml-4 text-white font-semibold">Thẻ Tín dụng/Ghi nợ</span>
                </label>

                {/* Conditional Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-gym-dark p-4 rounded-lg border border-gym-yellow/50 mt-3 space-y-4 animate-fade-in">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gym-gray mb-1">Số thẻ</label>
                      <input type="text" id="cardNumber" className={inputStyle} placeholder="0000 0000 0000 0000" required />
                    </div>
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gym-gray mb-1">Tên trên thẻ</label>
                      <input type="text" id="cardName" className={inputStyle} placeholder="NGUYEN VAN A" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gym-gray mb-1">Ngày hết hạn</label>
                        <input type="text" id="cardExpiry" className={inputStyle} placeholder="MM / YY" required />
                      </div>
                      <div>
                        <label htmlFor="cardCvv" className="block text-sm font-medium text-gym-gray mb-1">Mã bảo mật (CVV)</label>
                        <input type="text" id="cardCvv" className={inputStyle} placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Order Summary) */}
          <div className="lg:col-span-1">
            <aside className="bg-gym-dark rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Tóm tắt đơn hàng</h2>
              <ul className="space-y-4 my-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <li key={`${item.id}-${item.size || ''}-${item.flavor || ''}`} className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <span className="absolute -top-2 -right-2 bg-gym-yellow text-gym-darker text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-white font-semibold text-sm">{item.name}</p>
                      <p className="text-gym-gray text-xs">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <p className="text-white font-semibold text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gym-gray">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-gym-gray">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}₫`}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-gym-yellow">{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
              <button type="submit" className="w-full bg-gym-yellow text-gym-darker font-bold py-3 rounded-md hover:bg-yellow-300 transition-colors mt-6">
                Đặt hàng
              </button>
            </aside>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;