import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueSeries = useMemo(() => (
    stats?.revenueByMonth || [1200, 1500, 1400, 2000, 2600, 2400, 2800, 3200, 3000, 3600, 4200, 4800]
  ), [stats]);

  const ordersSeries = useMemo(() => (
    [
      { label: 'Pending', value: stats?.pendingOrders ?? 12, color: '#f59e0b' },
      { label: 'Processing', value: stats?.processingOrders ?? 22, color: '#3b82f6' },
      { label: 'Shipped', value: stats?.shippedOrders ?? 18, color: '#8b5cf6' },
      { label: 'Delivered', value: stats?.deliveredOrders ?? 40, color: '#10b981' }
    ]
  ), [stats]);

  const categorySeries = useMemo(() => (
    stats?.salesByCategory || [
      { label: 'Electronics', value: 35, color: '#3b82f6' },
      { label: 'Fashion', value: 25, color: '#8b5cf6' },
      { label: 'Home', value: 20, color: '#10b981' },
      { label: 'Other', value: 20, color: '#f59e0b' }
    ]
  ), [stats]);

  const LineChart = ({ data, height = 200, color = '#0ea5e9' }) => {
    const width = 500;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * (height - 40);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: '200px' }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <polygon 
            fill="url(#lineGradient)" 
            points={`0,${height} ${points} ${width},${height}`} 
          />
          <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
          {data.map((v, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((v - min) / (max - min || 1)) * (height - 40);
            return <circle key={i} cx={x} cy={y} r="4" fill={color} />
          })}
        </svg>
      </div>
    );
  };

  const BarChart = ({ series, height = 180 }) => {
    const max = Math.max(...series.map(s => s.value), 1);
    return (
      <div className="flex gap-4 justify-between items-end" style={{ height: '180px' }}>
        {series.map((s) => (
          <div key={s.label} className="flex flex-col flex-1 items-center">
            <div className="flex flex-col justify-end items-center w-full" style={{ height: '140px' }}>
              <div className="mb-2 text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{ height: `${(s.value / max) * 100}%`, backgroundColor: s.color }}
              />
            </div>
            <div className="mt-3 text-xs font-medium text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const DonutChart = ({ series, size = 180, stroke = 18 }) => {
    const total = series.reduce((a, b) => a + b.value, 0) || 1;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    
    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
          {series.map((s, i) => {
            const frac = s.value / total;
            const dash = circumference * frac;
            const gap = circumference - dash;
            const circle = (
              <circle
                key={i}
                cx={size/2}
                cy={size/2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500"
              />
            );
            offset += dash;
            return circle;
          })}
          <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">
            {series.reduce((a, b) => a + b.value, 0)}%
          </text>
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"></div>
          <p className="mt-4 font-medium text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: <FiUsers size={28} />, 
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'Total Products', 
      value: stats?.totalProducts || 0, 
      icon: <FiPackage size={28} />, 
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: '+8%',
      trend: 'up'
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: <FiShoppingBag size={28} />, 
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+23%',
      trend: 'up'
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats?.totalRevenue?.toFixed(2) || 0}`, 
      icon: <FiDollarSign size={28} />, 
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+18%',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bgLight} p-3 rounded-xl`}>
                  <div className={stat.textColor}>
                    {stat.icon}
                  </div>
                </div>
                <span className="flex items-center text-sm font-semibold text-green-600">
                  <FiTrendingUp size={14} className="mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="mb-1 text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow xl:col-span-2 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
                <p className="mt-1 text-sm text-gray-500">Monthly revenue for the last 12 months</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${revenueSeries[revenueSeries.length - 1].toLocaleString()}</p>
                <p className="text-sm text-gray-500">Current Month</p>
              </div>
            </div>
            <LineChart data={revenueSeries} color="#0ea5e9" />
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-lg">
            <h2 className="mb-1 text-xl font-bold text-gray-900">Order Status</h2>
            <p className="mb-6 text-sm text-gray-500">Distribution by status</p>
            <BarChart series={ordersSeries} />
          </div>
        </div>

        {/* Sales & Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-lg">
            <h2 className="mb-1 text-xl font-bold text-gray-900">Sales by Category</h2>
            <p className="mb-6 text-sm text-gray-500">Market share distribution</p>
            <DonutChart series={categorySeries} />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {categorySeries.map((c) => (
                <div key={c.label} className="flex gap-2 items-center text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-medium text-gray-700">{c.label}</span>
                  <span className="ml-auto font-semibold text-gray-500">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg lg:col-span-2">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold">Quick Actions</h2>
              <p className="text-blue-100">Manage your store efficiently</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link to="/admin/products" className="flex justify-between items-center p-4 rounded-xl border backdrop-blur-sm transition-all group bg-white/10 hover:bg-white/20 border-white/20">
                <div>
                  <FiPackage size={24} className="mb-2" />
                  <p className="font-semibold">Products</p>
                  <p className="text-sm text-blue-100">Manage inventory</p>
                </div>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/admin/orders" className="flex justify-between items-center p-4 rounded-xl border backdrop-blur-sm transition-all group bg-white/10 hover:bg-white/20 border-white/20">
                <div>
                  <FiShoppingBag size={24} className="mb-2" />
                  <p className="font-semibold">Orders</p>
                  <p className="text-sm text-blue-100">Process orders</p>
                </div>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/admin/users" className="flex justify-between items-center p-4 rounded-xl border backdrop-blur-sm transition-all group bg-white/10 hover:bg-white/20 border-white/20">
                <div>
                  <FiUsers size={24} className="mb-2" />
                  <p className="font-semibold">Users</p>
                  <p className="text-sm text-blue-100">User management</p>
                </div>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/admin/categories" className="flex justify-between items-center p-4 rounded-xl border backdrop-blur-sm transition-all group bg-white/10 hover:bg-white/20 border-white/20">
                <div>
                  <FiPackage size={24} className="mb-2" />
                  <p className="font-semibold">Categories</p>
                  <p className="text-sm text-blue-100">Organize products</p>
                </div>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow lg:col-span-2 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All <FiArrowRight className="ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600">Total</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">#{order._id.slice(-8)}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{order.user?.name}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-lg">
            <div className="flex gap-2 items-center mb-6">
              <FiAlertCircle className="text-red-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
            </div>
            <div className="overflow-y-auto space-y-3 max-h-96">
              {stats?.lowStockProducts?.map((product) => (
                <div key={product._id} className="p-4 bg-red-50 rounded-xl border border-red-100 transition-colors hover:bg-red-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock: <span className="font-bold text-red-600">{product.stock}</span></span>
                    <Link to="/admin/products" className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Update <FiArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
              {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
                <div className="py-8 text-center">
                  <div className="flex justify-center items-center mx-auto mb-3 w-16 h-16 bg-green-50 rounded-full">
                    <FiPackage className="text-green-600" size={32} />
                  </div>
                  <p className="font-medium text-gray-600">All products are well stocked!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;