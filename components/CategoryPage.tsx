import React, { useState, useMemo, useEffect } from 'react';
import { Product, SortOptionValue } from '../types';
import { SORT_OPTIONS } from '../constants';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';

interface CategoryPageProps {
  products: Product[];
  filterBy: { type: 'category' | 'brand'; value: string };
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ products, filterBy, onProductSelect, onBack }) => {
  const pageTitle = filterBy.value;
  
  const initialProducts = useMemo(() => {
    if (filterBy.type === 'brand') {
      return products.filter(p => p.brand === filterBy.value);
    }
    return products.filter(p => p.category === filterBy.value);
  }, [filterBy, products]);

  const priceBounds = useMemo(() => {
    if (initialProducts.length === 0) return { min: 0, max: 5000000 };
    const prices = initialProducts.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [initialProducts]);

  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionValue>('default');

  const resetFilters = () => {
    setMaxPrice(priceBounds.max);
    setSelectedRating(0);
    setShowInStockOnly(false);
    setSortOption('default');
  };

  useEffect(() => {
    resetFilters();
  }, [filterBy]);
  
  useEffect(() => {
    setMaxPrice(priceBounds.max);
  }, [priceBounds.max]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = initialProducts.filter(product => {
      const priceMatch = product.price <= maxPrice;
      const ratingMatch = product.rating >= selectedRating;
      const stockMatch = !showInStockOnly || product.inStock;
      return priceMatch && ratingMatch && stockMatch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popularity':
          return b.reviews - a.reviews;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [initialProducts, maxPrice, selectedRating, showInStockOnly, sortOption]);

  const activeFilterCount =
    (maxPrice < priceBounds.max ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-8">
        &larr; Quay lại trang chủ
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold uppercase text-white tracking-wider">{pageTitle}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxPriceBound={priceBounds.max}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            showInStockOnly={showInStockOnly}
            setShowInStockOnly={setShowInStockOnly}
            onResetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-gym-dark p-3 rounded-lg">
            <p className="text-sm text-gym-gray mb-2 sm:mb-0">
              Hiển thị <span className="font-bold text-white">{filteredAndSortedProducts.length}</span> trên <span className="font-bold text-white">{initialProducts.length}</span> sản phẩm
            </p>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-by" className="text-sm text-gym-gray">Sắp xếp theo:</label>
              <select
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOptionValue)}
                className="bg-gym-darker border border-gray-600 rounded-md p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gym-yellow"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))}
            </div>
          ) : (
            <div className="bg-gym-dark rounded-lg p-10 text-center text-gym-gray flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử thay đổi hoặc xóa bộ lọc để xem thêm kết quả.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;