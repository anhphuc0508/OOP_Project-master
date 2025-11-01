
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gym-dark border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Hệ thống cửa hàng */}
          <div>
            <h3 className="text-lg font-bold text-gym-yellow uppercase mb-4">Hệ thống cửa hàng GymSup</h3>
            <ul className="space-y-3 text-sm text-gym-gray">
              <li><strong className="text-white">GYMSUP HÀ NỘI:</strong> 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</li>
              <li><strong className="text-white">Hotline:</strong> 1800 6969</li>
              <li><strong className="text-white">Giờ mở cửa:</strong> 8:30 - 21:30 (T2-CN)</li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><a href="#" className="hover:text-gym-yellow">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Chính sách khách hàng</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Tích điểm đổi quà</a></li>
              <li><a href="#" className="hover:text-gym-yellow">So sánh sản phẩm</a></li>
            </ul>
          </div>
          
          {/* Chính sách chung */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Chính sách chung</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><a href="#" className="hover:text-gym-yellow">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* Giới thiệu */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Giới thiệu GymSup</h3>
            <ul className="space-y-2 text-sm text-gym-gray">
              <li><a href="#" className="hover:text-gym-yellow">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Hệ thống cửa hàng</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-gym-yellow">Liên hệ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-sm text-gym-gray mb-4 md:mb-0">© Bản quyền thuộc về GYMSUP.</p>
          <div className="flex space-x-4">
            {/* Social Icons Placeholder */}
            <a href="#" className="text-gym-gray hover:text-gym-yellow">FB</a>
            <a href="#" className="text-gym-gray hover:text-gym-yellow">IG</a>
            <a href="#" className="text-gym-gray hover:text-gym-yellow">YT</a>
            <a href="#" className="text-gym-gray hover:text-gym-yellow">TT</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;