import React from 'react';
import { Order } from '../types';

interface OrderHistoryPageProps {
  onBack: () => void;
  orders: Order[]; // Now receives orders as a prop
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onBack, orders }) => {

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'Đã giao hàng':
        return 'bg-green-500/20 text-green-400';
      case 'Đang xử lý':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Đã hủy':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại trang chủ
      </button>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white tracking-wider text-center mb-10 uppercase">Lịch sử đơn hàng</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-gym-dark rounded-lg shadow-lg overflow-hidden">
                <header className="bg-gym-darker p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700">
                  <div>
                    <h2 className="font-bold text-white">Mã đơn hàng: <span className="text-gym-yellow">{order.id}</span></h2>
                    <p className="text-sm text-gym-gray">Ngày đặt: {order.date}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-white text-lg">{order.total.toLocaleString('vi-VN')}₫</p>
                  </div>
                </header>
                <div className="p-4 space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-grow">
                        <p className="font-semibold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gym-gray">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-white font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                    </div>
                  ))}
                </div>
                <footer className="bg-gym-darker p-3 text-right">
                    <button className="text-sm font-semibold text-gym-yellow hover:underline">Xem chi tiết</button>
                </footer>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gym-dark p-10 rounded-lg">
            <p className="text-gym-gray text-lg">Bạn chưa có đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;