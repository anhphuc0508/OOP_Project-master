import React, { useState } from 'react';
import { User } from '../types';

interface AccountPageProps {
  currentUser: User;
  onBack: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ currentUser, onBack }) => {
  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.name.toLowerCase().replace(' ','.') + '.vip234@email.com'); // Simulated email
  const [phone, setPhone] = useState('0987654321'); // Simulated phone
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Password change validation
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' });
        return;
      }
      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
        return;
      }
    }
    
    // In a real app, you would make an API call here.
    // For now, we just simulate a success.
    setMessage({ type: 'success', text: 'Thông tin đã được cập nhật thành công!' });
    
    // Clear password fields after submission
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const inputStyle = "w-full bg-gym-dark border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow";
  const labelStyle = "block text-sm font-medium text-gym-gray mb-1";
  
  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại trang chủ
      </button>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white tracking-wider text-center mb-10 uppercase">Tài khoản của tôi</h1>

        <form onSubmit={handleSubmit} className="bg-gym-dark p-8 rounded-lg shadow-lg space-y-8">
          {/* Personal Information Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">Thông tin cá nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className={labelStyle}>Họ và tên</label>
                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="email" className={labelStyle}>Email</label>
                <input type="email" id="email" value={email} className={`${inputStyle} bg-gym-darker cursor-not-allowed`} readOnly />
              </div>
              <div>
                <label htmlFor="phone" className={labelStyle}>Số điện thoại</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputStyle} />
              </div>
            </div>
          </section>

          {/* Change Password Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">Đổi mật khẩu</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className={labelStyle}>Mật khẩu hiện tại</label>
                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputStyle} placeholder="Bỏ trống nếu không đổi" />
              </div>
              <div>
                <label htmlFor="newPassword" className={labelStyle}>Mật khẩu mới</label>
                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputStyle} placeholder="Bỏ trống nếu không đổi"/>
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelStyle}>Xác nhận mật khẩu mới</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputStyle} placeholder="Bỏ trống nếu không đổi"/>
              </div>
            </div>
          </section>
          
          {message && (
             <p className={`text-sm text-center font-semibold ${message.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                {message.text}
             </p>
          )}

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;