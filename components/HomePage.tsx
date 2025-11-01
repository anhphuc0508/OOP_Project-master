import React from 'react';
import HeroSection from './HeroSection';
import TrendingProducts from './TrendingProducts';
import CategorySection from './CategorySection';
import KnowledgeSection from './KnowledgeSection';
import { supplementArticles, nutritionArticles } from '../constants';
import { Product } from '../types';

interface HomePageProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onCategorySelect: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, onProductSelect, onCategorySelect }) => {
  const trendingProducts = products.slice(0, 4);
  const wheyProducts = products.filter(p => p.category === 'Whey Protein').slice(0, 6);
  const strengthProducts = products.filter(p => p.category === 'Tăng sức mạnh').slice(0, 6);

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 space-y-16 py-12">
        <TrendingProducts products={trendingProducts} onProductSelect={onProductSelect} />
        <CategorySection 
          title="WHEY PROTEIN"
          categoryKey="Whey Protein"
          subCategories={['Whey Protein Blend', 'Whey Protein Isolate', 'Hydrolyzed Whey', 'Vegan Protein', 'Protein Bar']}
          products={wheyProducts}
          onProductSelect={onProductSelect}
          onCategorySelect={onCategorySelect}
        />
        <CategorySection 
          title="TĂNG SỨC MẠNH"
          categoryKey="Tăng sức mạnh"
          subCategories={['Pre-Workout', 'Creatine', 'Intra-Workout', 'BCAAs']}
          products={strengthProducts}
          onProductSelect={onProductSelect}
          onCategorySelect={onCategorySelect}
        />
        <KnowledgeSection 
          supplementArticles={supplementArticles}
          nutritionArticles={nutritionArticles}
        />
      </div>
    </>
  );
};

export default HomePage;