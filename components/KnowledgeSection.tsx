
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-gym-dark rounded-lg overflow-hidden group">
      <img src={article.image} alt={article.title} className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity" />
      <div className="p-4">
        <p className="text-xs text-gym-yellow font-semibold mb-1">{article.category}</p>
        <h3 className="font-bold text-white mb-2 h-12 overflow-hidden">{article.title}</h3>
        <p className="text-sm text-gym-gray mb-3 h-10 overflow-hidden">{article.snippet}</p>
        <span className="text-xs text-gray-500">{article.date}</span>
      </div>
    </div>
  );
};

interface KnowledgeSectionProps {
  supplementArticles: Article[];
  nutritionArticles: Article[];
}

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ supplementArticles, nutritionArticles }) => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Supplement Knowledge */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold uppercase text-white">Kiến thức Supplement</h3>
            <a href="#" className="text-gym-yellow font-semibold hover:underline">Xem tất cả</a>
          </div>
          <div className="space-y-6">
            {supplementArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Nutrition Knowledge */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold uppercase text-white">Kiến thức Dinh dưỡng</h3>
            <a href="#" className="text-gym-yellow font-semibold hover:underline">Xem tất cả</a>
          </div>
          <div className="space-y-6">
            {nutritionArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeSection;
