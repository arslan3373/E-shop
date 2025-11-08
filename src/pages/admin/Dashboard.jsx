import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

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

  // Mock-safe fallbacks for charts if backend does not provide series
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

  const LineChart = ({ data, height = 140, color = '#0ea5e9' }) => {
    const width = 360;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((v - min) / (max - min || 1)) * height;
          return <circle key={i} cx={x} cy={y} r="3" fill={color} />
        })}
      </svg>
    );
  };

  const BarChart = ({ series, height = 140 }) => {
    const max = Math.max(...series.map(s => s.value), 1);
    return (
      <div className="flex items-end gap-3 h-36">
        {series.map((s) => (
          <div key={s.label} className="flex-1">
            <div
              className="w-full rounded-t"
              style={{ height: `${(s.value / max) * height}px`, backgroundColor: s.color }}
              title={`${s.label}: ${s.value}`}
            />
            <div className="text-xs text-gray-600 mt-2 text-center">{s.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const DonutChart = ({ series, size = 160, stroke = 14 }) => {
    const total = series.reduce((a, b) => a + b.value, 0) || 1;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
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
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers size={32} />, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: <FiPackage size={32} />, color: 'bg-green-500' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingBag size={32} />, color: 'bg-purple-500' },
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || 0}`, icon: <FiDollarSign size={32} />, color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics (Charts) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-1">Revenue</h2>
            <p className="text-gray-500 text-sm mb-4">Last 12 months</p>
            <LineChart data={revenueSeries} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-1">Orders</h2>
            <p className="text-gray-500 text-sm mb-4">By status</p>
            <BarChart series={ordersSeries} />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-1">Sales by Category</h2>
            <p className="text-gray-500 text-sm mb-4">Share</p>
            <DonutChart series={categorySeries} />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categorySeries.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-700">{c.label}</span>
                  <span className="ml-auto text-gray-500">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Orders</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                  {stats?.pendingOrders || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivered Orders</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                  {stats?.deliveredOrders || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/admin/products" className="block w-full bg-primary-600 text-white text-center py-2 rounded-md hover:bg-primary-700">
                Manage Products
              </Link>
              <Link to="/admin/categories" className="block w-full bg-orange-600 text-white text-center py-2 rounded-md hover:bg-orange-700">
                Manage Categories
              </Link>
              <Link to="/admin/orders" className="block w-full bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700">
                Manage Orders
              </Link>
              <Link to="/admin/users" className="block w-full bg-purple-600 text-white text-center py-2 rounded-md hover:bg-purple-700">
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order._id.slice(-8)}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {stats?.lowStockProducts?.map((product) => (
              <div key={product._id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </div>
                <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Update
                </Link>
              </div>
            ))}
            {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
              <p className="text-gray-500">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
