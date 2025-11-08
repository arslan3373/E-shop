import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    try {
      await productsAPI.addReview(id, review);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-12 text-center">Product not found</div>;
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  className="object-cover w-full h-96 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="ml-3 text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="mb-6 text-gray-700">{product.description}</p>
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-4 items-center mb-6">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="px-3 py-2 w-20 rounded-md border"
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex gap-2 justify-center items-center py-3 w-full text-white rounded-md transition-colors bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
            
            {/* Submit Review */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="p-6 mb-8 bg-gray-50 rounded-lg">
                <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Rating</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                    className="px-4 py-2 rounded-md border"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Comment</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    rows="4"
                    className="px-4 py-2 w-full rounded-md border"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="px-6 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700">
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="pb-4 border-b">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold">{review.name}</span>
                    <div className="flex ml-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          size={16}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
