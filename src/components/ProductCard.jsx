import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice > product.price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center mb-2">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.ratings?.toFixed(1) || 0} ({product.numReviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary-600">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
            >
              <FiShoppingCart size={20} />
            </button>
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-orange-500 text-sm mt-2">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="text-red-500 text-sm mt-2">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
