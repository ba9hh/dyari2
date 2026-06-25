import React from "react";

const ShopArticle = ({ article, onClick }) => {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <img
        className="w-full object-cover aspect-square rounded-md sm:rounded-lg border border-gray-100"
        src={article.article_image}
        alt={article.article_title}
      />
      {/* Price — visible on hover (desktop) or always-visible overlay on mobile */}
      <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white/95 border-b border-gray-100 rounded-t-md
        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
        <p className="text-center text-xs sm:text-sm font-medium text-gray-700 truncate">
          {article.article_price} dt / {article.article_type}
        </p>
      </div>
      {/* Title — visible on hover (desktop) or always-visible on mobile */}
      <div className="absolute bottom-0 right-0 left-0 h-8 p-1 bg-white/95 border-t border-gray-100 rounded-b-md
        opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
        <p className="text-center text-xs sm:text-sm font-medium text-gray-700 truncate">
          {article.article_title}
        </p>
      </div>
    </div>
  );
};

export default ShopArticle;
