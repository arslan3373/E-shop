import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight, FiClock } from 'react-icons/fi';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Smart Online Shopping',
      excerpt: 'Discover the best strategies to save money and shop smarter online. From comparing prices to using coupons effectively...',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
      author: 'Sarah Johnson',
      date: 'Nov 5, 2024',
      readTime: '5 min read',
      category: 'Shopping Tips'
    },
    {
      id: 2,
      title: 'Latest Fashion Trends for 2024',
      excerpt: 'Stay ahead of the curve with the hottest fashion trends this season. From sustainable fashion to bold colors...',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
      author: 'Michael Chen',
      date: 'Nov 3, 2024',
      readTime: '7 min read',
      category: 'Fashion'
    },
    {
      id: 3,
      title: 'Tech Gadgets You Need in 2024',
      excerpt: 'Explore the must-have tech gadgets that will make your life easier and more productive this year...',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
      author: 'Emily Davis',
      date: 'Nov 1, 2024',
      readTime: '6 min read',
      category: 'Technology'
    },
    {
      id: 4,
      title: 'Home Decor Ideas on a Budget',
      excerpt: 'Transform your living space without breaking the bank. Creative and affordable home decor solutions...',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600',
      author: 'David Wilson',
      date: 'Oct 28, 2024',
      readTime: '8 min read',
      category: 'Home & Living'
    },
    {
      id: 5,
      title: 'Sustainable Shopping Guide',
      excerpt: 'Learn how to make eco-friendly choices while shopping online. Tips for reducing your carbon footprint...',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
      author: 'Lisa Anderson',
      date: 'Oct 25, 2024',
      readTime: '5 min read',
      category: 'Sustainability'
    },
    {
      id: 6,
      title: 'Gift Ideas for Every Occasion',
      excerpt: 'Find the perfect gift for your loved ones. Curated gift ideas for birthdays, anniversaries, and more...',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600',
      author: 'John Smith',
      date: 'Oct 22, 2024',
      readTime: '6 min read',
      category: 'Gift Guide'
    }
  ];

  const categories = ['All', 'Shopping Tips', 'Fashion', 'Technology', 'Home & Living', 'Sustainability', 'Gift Guide'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Tips, trends, and insights to help you shop smarter and live better
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 hover:border-primary-600 hover:text-primary-600 transition-all font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <FiUser size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar size={16} />
                      <span>{post.date}</span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="text-primary-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                      Read More <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 text-gray-100">Get the latest blog posts and exclusive deals delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
