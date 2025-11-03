// ProductPage.tsx – HOÀN CHỈNH (Đã dọn dẹp)
import React, { useState } from 'react';
import { Product } from '../types';
import { StarIcon } from '../constants';
import { useCart } from '../contexts/CartContext';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onBack }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // 1. Lấy data CHUẨN từ props (đã được App.tsx parse)
  // Không cần tính toán lại, chỉ cần lấy từ product
  const availableSizes = product.sizes || [];
  const availableFlavors = product.flavors || [];

  // 2. Chỉ dùng data thật, KHÔNG DÙNG 'fallback'
  const finalSizes = availableSizes;
  const finalFlavors = availableFlavors;

  // 3. Đặt state ban đầu
  // Lấy phần tử đầu tiên, hoặc chuỗi rỗng '' nếu mảng rỗng
  const [selectedSize, setSelectedSize] = useState(finalSizes[0] || '');
  const [selectedFlavor, setSelectedFlavor] = useState(finalFlavors[0] || '');

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;
    
    // 4. Tìm variant thật (sử dụng data thật đã được parse)
    const foundVariant = product.variants?.find(
      v => v.flavor === selectedFlavor && v.size === selectedSize
    );

    // Nếu không tìm thấy (ví dụ admin nhập thiếu), báo lỗi
    if (!foundVariant) {
        alert('Biến thể sản phẩm này không tồn tại hoặc đã hết hàng. Vui lòng chọn lại.');
        return;
    }
    
    // 5. Kiểm tra tồn kho trước khi thêm
    if (foundVariant.stockQuantity < quantity) {
        alert('Số lượng tồn kho không đủ.');
        return;
    }

    setIsAdding(true);
    try {
      // 6. Gửi SKU chính xác
      await addToCart(foundVariant.sku, quantity);
      alert('Đã thêm vào giỏ hàng!');
    } catch (err: any) {
      // Hiển thị lỗi từ backend (ví dụ: CartContext báo lỗi)
      alert(err.message || 'Lỗi khi thêm vào giỏ');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-6">
        Quay lại cửa hàng
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="border border-gray-800 rounded-lg overflow-hidden mb-4">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover aspect-square" />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(img)} className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${mainImage === img ? 'border-gym-yellow' : 'border-gray-800'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-gym-yellow">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${i < 4 ? 'text-gym-yellow' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-sm text-gym-gray ml-2">(0 đánh giá)</span>
            <span className="mx-2 text-gym-gray">|</span>
            {/* Lấy 'inStock' từ product (được map từ firstVariant) */}
            <span className={`text-sm ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
              {product.inStock ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>

          <p className="text-3xl font-bold text-gym-yellow mb-6">
            {product.price.toLocaleString('vi-VN')}₫
          </p>

          {/* FLAVORS (Sẽ không render nếu mảng rỗng) */}
          {finalFlavors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">
                Hương vị: <span className="text-white font-bold">{selectedFlavor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {finalFlavors.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlavor(f)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                      selectedFlavor === f
                        ? 'bg-gym-yellow text-gym-darker border-gym-yellow'
                        : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZES (Sẽ không render nếu mảng rỗng) */}
          {finalSizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">
                Kích cỡ: <span className="text-white font-bold">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {finalSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                      selectedSize === s
                        ? 'bg-gym-yellow text-gym-darker border-gym-yellow'
                        : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-700 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 text-lg font-bold">-</button>
              <span className="px-6 py-3 text-lg font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 text-lg font-bold">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.inStock}
              className="flex-grow bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Đang thêm...' : (product.inStock ? 'Thêm vào giỏ' : 'Hết hàng')}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">Mô tả sản phẩm</h3>
            <p className="text-gym-gray">{product.description || 'Sản phẩm chưa có mô tả.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;