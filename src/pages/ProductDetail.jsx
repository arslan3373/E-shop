import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeart, FiShare2, FiCheck } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      
      // Fetch related products
      if (response.data.category) {
        fetchRelatedProducts(response.data.category);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await productsAPI.getAll({ category, limit: 4 });
      setRelatedProducts(response.data.products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error fetching related products:', error);
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

  const getRatingPercentage = (stars) => {
    if (!product?.reviews?.length) return 0;
    const count = product.reviews.filter(r => r.rating === stars).length;
    return (count / product.reviews.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 rounded-full border-t-4 border-b-4 animate-spin border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center bg-gray-50">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
  

      {/* Product Details */}
      <div className="py-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
              {/* Images Section */}
              <div className="space-y-4">
                <div className="overflow-hidden relative bg-gray-100 rounded-xl">
                  <img
                    src={product.images[selectedImage]?.url || 'https://via.placeholder.com/600'}
                    alt={product.name}
                    className="object-contain w-full h-[500px] transition-transform duration-300 hover:scale-105"
                  />
                  {/* <div className="flex absolute top-4 right-4 gap-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <FiHeart className="w-6 h-6 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <FiShare2 className="w-6 h-6 text-gray-700" />
                    </button>
                  </div> */}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                        selectedImage === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="object-cover w-full h-24"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">{product.name}</h1>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-1 items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{product.ratings.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm text-gray-600">{product.numReviews} reviews</span>
                    <span className="text-sm text-gray-500">|</span>
                    <span className="text-sm font-medium text-green-600">
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-baseline">
                  <span className="text-4xl font-bold text-primary-600">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                      <span className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-100 rounded-full">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="leading-relaxed text-gray-700">{product.description}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex gap-4 items-center">
                  <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center rounded-lg border-2 border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="px-4 py-2 w-16 font-semibold text-center border-gray-200 border-x-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex gap-3 justify-center items-center py-4 w-full text-lg font-semibold text-white rounded-xl shadow-lg transition-all bg-primary-600 hover:bg-primary-700 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart size={22} />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-4 pt-6 border-t md:grid-cols-3">
                  <div className="flex gap-3 items-start mt-4">
                    <FiTruck className="flex-shrink-0 mt-2 w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start mt-4">
                    <FiShield className="flex-shrink-0 mt-2 w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                      <p className="text-sm text-gray-600">100% secure</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start mt-4">
                    <FiRefreshCw className="flex-shrink-0 mt-2 w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                      <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t">
              <div className="px-3 sm:px-8">
                <div className="flex gap-2 border-b sm:gap-8">
                  {['description', 'specifications', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 font-semibold sm:texl-xl texl-[16px] capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 sm:p-8">
                {activeTab === 'description' && (
                  <div className="max-w-none prose">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Product Description</h3>
                    <p className="leading-relaxed text-gray-700">{product.description}</p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex gap-2 items-start">
                        <FiCheck className="flex-shrink-0 mt-1 w-5 h-5 text-green-600" />
                        <span>High-quality materials for lasting durability</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <FiCheck className="flex-shrink-0 mt-1 w-5 h-5 text-green-600" />
                        <span>Carefully crafted with attention to detail</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <FiCheck className="flex-shrink-0 mt-1 w-5 h-5 text-green-600" />
                        <span>Perfect for everyday use</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="mb-4 text-xl font-bold text-gray-900">Specifications</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">SKU:</span>
                        <span className="ml-2 text-gray-600">{product._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">Category:</span>
                        <span className="ml-2 text-gray-600">{product.category}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">Availability:</span>
                        <span className="ml-2 text-gray-600">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">Brand:</span>
                        <span className="ml-2 text-gray-600">{product.brand || 'Generic'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Reviews Summary */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                      <div className="p-6 text-center bg-gray-50 rounded-xl">
                        <div className="mb-2 text-5xl font-bold text-gray-900">{product.ratings.toFixed(1)}</div>
                        <div className="flex gap-1 justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Based on {product.numReviews} reviews</p>
                      </div>

                      <div className="col-span-2 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex gap-3 items-center">
                            <span className="w-12 text-sm font-medium text-gray-700">{stars} star</span>
                            <div className="overflow-hidden flex-1 h-3 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-yellow-400 transition-all"
                                style={{ width: `${getRatingPercentage(stars)}%` }}
                              ></div>
                            </div>
                            <span className="w-12 text-sm text-right text-gray-600">
                              {Math.round(getRatingPercentage(stars))}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Review */}
                    {isAuthenticated && (
                      <div className="p-6 bg-gray-50 rounded-xl">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Your Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => setReview({ ...review, rating: num })}
                                  className="transition-transform hover:scale-110"
                                >
                                  <FiStar
                                    className={`w-8 h-8 ${num <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Your Review</label>
                            <textarea
                              value={review.comment}
                              onChange={(e) => setReview({ ...review, comment: e.target.value })}
                              rows="4"
                              placeholder="Share your experience with this product..."
                              className="px-4 py-3 w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                              required
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            className="px-8 py-3 font-semibold text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700"
                          >
                            Submit Review
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                      {product.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {product.reviews.map((review) => (
                            <div key={review._id} className="p-6 bg-white rounded-xl border-2 border-gray-100">
                              <div className="flex gap-4 items-start">
                                <div className="flex justify-center items-center w-12 h-12 font-bold text-white bg-gradient-to-br rounded-full from-primary-500 to-primary-700">
                                  {review.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap gap-3 justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                      <p className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                    <div className="flex gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <FiStar
                                          key={i}
                                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="leading-relaxed text-gray-700">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="py-8 text-center text-gray-500">No reviews yet. Be the first to review this product!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Related Products</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                    className="overflow-hidden bg-white rounded-xl shadow-md transition-all cursor-pointer hover:shadow-xl"
                  >
                    <div className="overflow-hidden relative h-48 bg-gray-100">
                      <img
                        src={relatedProduct.images[0]?.url || 'https://via.placeholder.com/300'}
                        alt={relatedProduct.name}
                        className="object-cover w-full h-full transition-transform hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-semibold text-gray-900 truncate">{relatedProduct.name}</h3>
                      <div className="flex gap-1 items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(relatedProduct.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">({relatedProduct.numReviews})</span>
                      </div>
                      <div className="flex gap-2 items-baseline">
                        <span className="text-xl font-bold text-primary-600">${relatedProduct.price}</span>
                        {relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-400 line-through">${relatedProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;