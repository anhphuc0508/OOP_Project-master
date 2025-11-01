import React, { useState } from 'react';
import { Product } from '../types';
import { StarIcon, HeartIcon, EyeIcon } from '../constants';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleProductClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation when clicking on a button inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onProductSelect(product);
  };

  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);
    addToCart({ ...product, quantity: 1 });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-gym-dark rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-gym-yellow/20 hover:-translate-y-1">
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onProductSelect(product)}>
        <img src={product.images[0]} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {/* Discount Badge */}
        {product.oldPrice && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
        )}

        {/* Wishlist and Quick View Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            className="bg-gym-darker bg-opacity-70 p-2 rounded-full text-white hover:text-gym-yellow hover:bg-opacity-90 transition-all"
            title="Add to Wishlist"
            aria-label="Add to Wishlist"
          >
            <HeartIcon className="w-5 h-5" />
          </button>
          <button 
            className="bg-gym-darker bg-opacity-70 p-2 rounded-full text-white hover:text-gym-yellow hover:bg-opacity-90 transition-all"
            title="Quick View"
            aria-label="Quick View"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>

      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 onClick={() => onProductSelect(product)} className="font-semibold text-white text-base mb-2 flex-grow h-12 cursor-pointer hover:text-gym-yellow transition-colors">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex text-gym-yellow">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-gym-yellow' : 'text-gray-600'}`} />
            ))}
          </div>
          <span className="text-xs text-gym-gray ml-2">({product.reviews})</span>
        </div>
        <div className="flex items-baseline space-x-2 mb-4">
          <p className="text-lg font-bold text-gym-yellow">{product.price.toLocaleString('vi-VN')}₫</p>
          {product.oldPrice && (
            <p className="text-sm text-gym-gray line-through">{product.oldPrice.toLocaleString('vi-VN')}₫</p>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-auto w-full bg-gym-yellow text-gym-darker font-bold py-2 rounded-md hover:bg-yellow-300 transition-colors duration-300 transform group-hover:scale-105 disabled:opacity-75 disabled:cursor-wait ${isAdding ? 'animate-cart-bump' : ''}`}
        >
          {isAdding ? 'Đã thêm!' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;