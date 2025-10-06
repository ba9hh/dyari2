import React from "react";

const ArticleShop = ({ article, onClick }) => {
  return (
    <div className="relative group" onClick={onClick}>
      <img className="w-full border object-cover" src={article.article_image} />
      <div className="absolute top-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
        <p className="text-center text-sm font-medium">
          {article.article_price} dt par {article.article_type}
        </p>
      </div>
      <div className="absolute bottom-0 right-0 left-0 h-8 p-1 bg-white border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
        <p className="text-center text-sm font-medium">
          {article.article_title}
        </p>
      </div>
    </div>
  );
};

export default ArticleShop;
