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
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors ? product.flavors[0] : undefined);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => { // Thêm async
    if (isAdding || !product.inStock) return; // Sửa: Thêm check inStock
    setIsAdding(true);

    // --- LOGIC MỚI ĐỂ TÌM SKU ---
    // 1. Tìm biến thể (variant) trong mảng 'product.variants'
    // (product.variants BẮT BUỘC phải có, dựa trên file constants.tsx)
    const foundVariant = product.variants.find(variant => 
      variant.flavor === selectedFlavor && variant.size === selectedSize
    );

    // 2. Kiểm tra
    if (!foundVariant) {
      console.error("Lỗi: Không tìm thấy SKU cho:", selectedFlavor, selectedSize);
      // (Bạn có thể setMessage("Lỗi: Không tìm thấy sản phẩm") ở đây)
      setIsAdding(false);
      return;
    }

    // 3. Lấy SKU (string) và gọi API
    const skuToSend = foundVariant.sku; 
    
    try {
      // Gọi addToCart (từ CartContext) với (SKU, số lượng)
      // Giờ nó đã khớp với CartContext.tsx
      await addToCart(skuToSend, quantity); 
      
      // (Code cũ của bạn, có thể thêm message)
      // setMessage('Đã thêm vào giỏ hàng!');
      // setTimeout(() => setMessage(''), 2000);

    } catch (err) {
      console.error(err);
      // setMessage('Lỗi: Không thể thêm vào giỏ');
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-6">
        &larr; Quay lại cửa hàng
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="border border-gray-800 rounded-lg overflow-hidden mb-4">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover aspect-square" />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <button key={index} onClick={() => setMainImage(img)} className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${mainImage === img ? 'border-gym-yellow' : 'border-gray-800 hover:border-gray-600'}`}>
                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-gym-yellow">
              {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-gym-yellow' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-sm text-gym-gray ml-2">({product.reviews} đánh giá)</span>
            <span className="mx-2 text-gym-gray">|</span>
            <span className={`text-sm ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
          </div>

          <div className="flex items-baseline space-x-3 mb-6">
            <p className="text-3xl font-bold text-gym-yellow">{product.price.toLocaleString('vi-VN')}₫</p>
            {product.oldPrice && (
              <p className="text-xl text-gym-gray line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</p>
            )}
          </div>

          {/* Flavors */}
          {product.flavors && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">Hương vị: <span className="text-white font-bold">{selectedFlavor}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(flavor => (
                  <button key={flavor} onClick={() => setSelectedFlavor(flavor)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedFlavor === flavor ? 'bg-gym-yellow text-gym-darker border-gym-yellow' : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'}`}>
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Sizes */}
          {product.sizes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">Kích cỡ: <span className="text-white font-bold">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedSize === size ? 'bg-gym-yellow text-gym-darker border-gym-yellow' : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-700 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 text-lg font-bold hover:bg-gym-dark transition-colors">-</button>
              <span className="px-6 py-3 text-lg font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 text-lg font-bold hover:bg-gym-dark transition-colors">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={!product.inStock || isAdding} className={`flex-grow bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed ${isAdding ? 'animate-cart-bump' : ''}`}>
              {isAdding ? 'Đã thêm!' : (product.inStock ? 'Thêm vào giỏ' : 'Hết hàng')}
            </button>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">Mô tả sản phẩm</h3>
            <p className="text-gym-gray leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;