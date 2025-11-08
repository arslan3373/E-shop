import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import { FiPackage, FiTruck, FiCheckCircle, FiMail } from 'react-icons/fi';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Order #{order._id.slice(-8)}</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              
              {/* Email Notification Info */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <FiMail className="text-green-600" size={20} />
                <div className="text-sm text-green-800">
                  <p className="font-semibold">Email notifications active</p>
                  <p>You'll receive updates when your order status changes</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <FiPackage className={`text-2xl ${order.status !== 'Cancelled' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-xs mt-2">Placed</span>
                </div>
                <div className={`flex-1 h-1 ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="flex flex-col items-center">
                  <FiTruck className={`text-2xl ${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-xs mt-2">Shipped</span>
                </div>
                <div className={`flex-1 h-1 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="flex flex-col items-center">
                  <FiCheckCircle className={`text-2xl ${order.status === 'Delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-xs mt-2">Delivered</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-700">{order.shippingAddress.country}</p>
              <p className="text-gray-700 mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price</span>
                  <span className="font-semibold">${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-gray-700">{order.paymentMethod}</p>
                <p className={`mt-2 text-sm ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
