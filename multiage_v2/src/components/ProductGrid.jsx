import React from 'react';

const ProductGrid = ({ products = [], onAddToCart }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-2 py-6">
      {/* 
          Mobile: grid-cols-2 with gap-2
          Desktop: lg:grid-cols-4, xl:grid-cols-5 
      */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full overflow-hidden"
          >
            {/* 
                Image Container: Fixed aspect-square ensures card height consistency.
                p-4 and object-contain provide a clean Amazon-style tech product look.
            */}
            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden p-4">
              <img
                src={product.images?.[0] || product.image || '/placeholder-product.png'}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* 
                Card Content: flex flex-col + justify-between ensures that 
                Price and Buttons stay at the bottom regardless of title length.
            */}
            <div className="p-3 flex flex-col flex-grow justify-between">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
                  {product.name}
                </h3>
                <p className="text-[10px] text-[#C5620B] font-bold mt-1 uppercase tracking-widest">{product.brand}</p>
              </div>

              <div className="mt-auto">
                <div className="flex items-baseline mb-3">
                  <span className="text-xs font-bold mr-1 text-[#C5620B]">GHS</span>
                  <span className="text-lg font-bold text-gray-900">
                    {product.price?.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={`Add ${product.name} to cart`}
                  onClick={() => onAddToCart?.(product._id || product.id)}
                  className="w-full bg-gradient-to-r from-[#C5620B] to-[#6A2B09] text-white text-sm font-bold py-2.5 rounded-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-orange-900/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
