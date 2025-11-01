import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductFormData } from './AdminPage';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductFormData) => void;
  onUpdateProduct: (product: ProductFormData) => void;
  productToEdit: Product | null;
}

const subCategoryMap: { [key: string]: string[] } = {
  "Whey Protein": [
    "Whey Protein Blend",
    "Whey Protein Isolate",
    "Hydrolyzed Whey",
    "Vegan Protein",
    "Protein Bar",
    "Meal Replacements",
  ],
};

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct, onUpdateProduct, productToEdit }) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const isEditMode = !!productToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && productToEdit) {
            setSku(productToEdit.sku || '');
            setName(productToEdit.name);
            setPrice(String(productToEdit.price));
            setStock(String(productToEdit.total || 0));
            setImage(productToEdit.images[0] || '');
            setCategory(productToEdit.category);
            setSubCategory(productToEdit.subCategory || '');
            setDescription(productToEdit.description || '');
        } else {
            setSku('');
            setName('');
            setPrice('');
            setStock('');
            setImage('');
            setCategory('');
            setSubCategory('');
            setDescription('');
        }
        setError('');
    }
  }, [isOpen, productToEdit, isEditMode]);

  useEffect(() => {
    // Reset subCategory when category changes
    setSubCategory('');
  }, [category]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku.trim()) { setError('SKU sản phẩm là bắt buộc.'); return; }
    if (!name.trim()) { setError('Tên sản phẩm là bắt buộc.'); return; }
    if (!price.trim()) { setError('Giá sản phẩm là bắt buộc.'); return; }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) { setError('Giá phải là một số dương hợp lệ.'); return; }
    if (!stock.trim()) { setError('Số lượng tồn kho là bắt buộc.'); return; }
    const stockNum = parseFloat(stock);
    if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) { setError('Tồn kho phải là một số nguyên không âm.'); return; }
    if (!image.trim()) { setError('URL hình ảnh là bắt buộc.'); return; }
    try { new URL(image.trim()); } catch (_) { setError('Vui lòng nhập URL hình ảnh hợp lệ.'); return; }
    if (!category) { setError('Vui lòng chọn một danh mục sản phẩm.'); return; }
    if (!description.trim()) { setError('Mô tả sản phẩm là bắt buộc.'); return; }

    setError('');

    const productData: ProductFormData = {
      sku: sku.trim(),
      name: name.trim(),
      price: priceNum,
      stock: stockNum,
      image: image.trim(),
      category: category,
      subCategory: subCategory,
      description: description.trim(),
    };

    if (isEditMode) {
        onUpdateProduct(productData);
    } else {
        onAddProduct(productData);
    }
  };
  
  const inputStyles = "w-full bg-[var(--admin-bg-hover)] border border-[var(--admin-border-color)] rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 ring-[var(--admin-text-accent)]";

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-[var(--admin-bg-card)] rounded-2xl shadow-xl w-full max-w-lg p-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Tên sản phẩm</label>
            <input type="text" id="productName" value={name} onChange={e => setName(e.target.value)} className={inputStyles} placeholder="ví dụ: Optimum Nutrition Gold Standard 100% Whey" />
          </div>
          <div>
              <label htmlFor="productSku" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">ID (SKU)</label>
              <input type="text" id="productSku" value={sku} onChange={e => setSku(e.target.value)} className={inputStyles} placeholder="ví dụ: ON-GSW-5LB" />
          </div>
          <div>
            <label htmlFor="productCategory" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Danh mục</label>
            <select id="productCategory" value={category} onChange={e => setCategory(e.target.value)} className={inputStyles}>
                <option value="" disabled>Chọn một danh mục</option>
                <option value="Whey Protein">Whey Protein</option>
                <option value="Tăng cân">Tăng cân</option>
                <option value="Tăng sức mạnh">Tăng sức mạnh</option>
                <option value="Hỗ trợ sức khỏe">Hỗ trợ sức khỏe</option>
                <option value="Phụ kiện">Phụ kiện</option>
            </select>
          </div>
          {subCategoryMap[category] && (
            <div>
              <label htmlFor="productSubCategory" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Loại (nếu có)</label>
              <select id="productSubCategory" value={subCategory} onChange={e => setSubCategory(e.target.value)} className={inputStyles}>
                <option value="">Chọn loại sản phẩm</option>
                {subCategoryMap[category].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productPrice" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Giá (đ)</label>
              <input type="text" id="productPrice" value={price} onChange={e => setPrice(e.target.value)} className={inputStyles} placeholder="ví dụ: 1850000" />
            </div>
            <div>
              <label htmlFor="productStock" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Tồn kho</label>
              <input type="text" id="productStock" value={stock} onChange={e => setStock(e.target.value)} className={inputStyles} placeholder="ví dụ: 150"/>
            </div>
          </div>
          <div>
            <label htmlFor="productImage" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">URL hình ảnh</label>
            <input type="text" id="productImage" value={image} onChange={e => setImage(e.target.value)} className={inputStyles} placeholder="https://example.com/image.png" />
          </div>
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Mô tả</label>
            <textarea id="productDescription" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputStyles} placeholder="Viết mô tả chi tiết cho sản phẩm..."></textarea>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

          <div className="flex justify-end items-center space-x-4 pt-4">
            <button 
                type="button" 
                onClick={onClose}
                className="py-2 px-5 text-sm font-bold text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-main)] transition-colors"
            >
              Hủy
            </button>
            <button 
                type="submit"
                className="bg-[var(--admin-button-bg)] text-[var(--admin-button-text)] font-bold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;