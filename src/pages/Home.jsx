import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiTruck, FiShield, FiCreditCard, FiHeadphones, FiStar, FiArrowRight, FiTag, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
    fetchAllProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured();
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await productsAPI.getAll({ page: 1 });
      setAllProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };

  const features = [
    { icon: <FiTruck size={40} />, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-600' },
    { icon: <FiShield size={40} />, title: 'Secure Payment', desc: '100% secure payment', color: 'text-green-600' },
    { icon: <FiCreditCard size={40} />, title: 'Easy Returns', desc: '30 days return policy', color: 'text-purple-600' },
    { icon: <FiHeadphones size={40} />, title: '24/7 Support', desc: 'Dedicated support', color: 'text-orange-600' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', rating: 5, comment: 'Amazing products and fast delivery! Highly recommend.', avatar: 'SJ' },
    { name: 'Michael Chen', rating: 5, comment: 'Great quality and excellent customer service.', avatar: 'MC' },
    { name: 'Emily Davis', rating: 5, comment: 'Best online shopping experience I\'ve ever had!', avatar: 'ED' }
  ];

  const deals = [
    { title: 'Summer Sale', discount: '50% OFF', description: 'On selected items', color: 'from-orange-500 to-red-500' },
    { title: 'New Arrivals', discount: '30% OFF', description: 'Latest collection', color: 'from-blue-500 to-purple-500' },
    { title: 'Clearance', discount: '70% OFF', description: 'Limited stock', color: 'from-green-500 to-teal-500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 opacity-5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold">🎉 New Season Collection</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight fade-in">
                Discover Your Perfect Style
              </h1>
              <p className="text-xl mb-8 text-gray-100 fade-in">
                Shop the latest trends with exclusive deals and free shipping on orders over $50
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg">
                  Shop Now <FiArrowRight />
                </Link>
                <Link to="/products?category=Electronics" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary-600 transition-all inline-flex items-center justify-center gap-2">
                  View Deals <FiTag />
                </Link>
              </div>
              <div className="mt-8 flex gap-8 justify-center lg:justify-start text-sm">
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-gray-200">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-gray-200">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-gray-200">Brands</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" 
                  alt="Shopping" 
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <div key={index} className={`bg-gradient-to-r ${deal.color} rounded-2xl p-6 text-white transform hover:scale-105 transition-all cursor-pointer shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                    <p className="text-white text-opacity-90 mb-2">{deal.description}</p>
                    <div className="text-3xl font-bold">{deal.discount}</div>
                  </div>
                  <FiTag size={48} className="opacity-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
                <div className={`${feature.color} flex justify-center mb-4`}>{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12 md:hidden">
            <Link to="/products" className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-colors inline-flex items-center gap-2">
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiTrendingUp className="text-orange-500" size={32} />
                <h2 className="text-4xl font-bold text-gray-900">Trending Now</h2>
              </div>
              <p className="text-gray-600">Most popular products this week</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category.name}`}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all text-center group transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <FiTag className="text-primary-600" size={32} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-center text-gray-500">No categories available yet</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-current" size={16} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 text-gray-100">Get exclusive deals and updates delivered to your inbox</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-200 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">VISA</div>
            <div className="text-2xl font-bold text-gray-400">MASTERCARD</div>
            <div className="text-2xl font-bold text-gray-400">PAYPAL</div>
            <div className="text-2xl font-bold text-gray-400">AMEX</div>
            <div className="text-2xl font-bold text-gray-400">STRIPE</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
