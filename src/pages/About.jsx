import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiAward, FiUsers, FiTrendingUp, FiShield } from 'react-icons/fi';

const About = () => {
  const values = [
    { icon: <FiTarget size={40} />, title: 'Our Mission', desc: 'To provide quality products at affordable prices with exceptional customer service' },
    { icon: <FiHeart size={40} />, title: 'Customer First', desc: 'Your satisfaction is our top priority. We go above and beyond for you' },
    { icon: <FiAward size={40} />, title: 'Quality Assured', desc: 'Every product is carefully selected and quality-checked before shipping' },
    { icon: <FiShield size={40} />, title: 'Secure Shopping', desc: '100% secure payments and data protection for peace of mind' }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Brands' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  const team = [
    { name: 'John Smith', role: 'CEO & Founder', image: 'https://via.placeholder.com/150' },
    { name: 'Sarah Johnson', role: 'Head of Operations', image: 'https://via.placeholder.com/150' },
    { name: 'Michael Chen', role: 'Customer Success', image: 'https://via.placeholder.com/150' },
    { name: 'Emily Davis', role: 'Marketing Director', image: 'https://via.placeholder.com/150' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About E-Shop</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Your trusted online shopping destination since 2020. We're committed to bringing you the best products with exceptional service.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                E-Shop was founded in 2020 with a simple mission: to make online shopping easy, affordable, and enjoyable for everyone. What started as a small operation has grown into a trusted platform serving thousands of customers worldwide.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We believe that shopping should be more than just a transaction. It's about finding products you love, delivered with care, and backed by a team that genuinely cares about your experience.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we partner with top brands and sellers to bring you a curated selection of products across multiple categories, all at competitive prices with fast, reliable shipping.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800" 
                alt="Our Story" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-xl">
                <div className="text-3xl font-bold">4+ Years</div>
                <div className="text-sm">Of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and help us deliver the best experience to our customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="text-primary-600 flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals working together to bring you the best shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of satisfied customers and discover amazing products today
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
