import React, { useEffect, useState } from 'react';
import { productsAPI, categoriesAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
const Products = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    images: [{ url: '' }],
    featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ page: 1 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
      if (response.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: response.data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = { url: value };
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(formData);
        toast.success('Product created successfully!');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      images: product.images.length > 0 ? product.images : [{ url: '' }],
      featured: product.featured
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: categories.length > 0 ? categories[0].name : '',
      brand: '',
      stock: '',
      images: [{ url: '' }],
      featured: false
    });
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
         <button 
   onClick={() => navigate(-1)}
    class="px-5 py-3 my-4 font-medium text-white rounded-lg shadow-md transition-all duration-300 bg-primary-600 hover:-translate-y-1"
  >
    ⬅ Back to Dashboard
  </button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <button
            onClick={openCreateModal}
            className="flex gap-2 items-center px-6 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
          >
            <FiPlus /> Add Product
          </button>
        </div>
   <div >
 
</div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={product.images[0]?.url || 'https://via.placeholder.com/50'} alt={product.name} className="object-cover w-12 h-12 rounded" />
                    </td>
                    <td className="px-4 py-3 font-semibold">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                          <FiEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="mb-6 text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="px-4 py-2 w-full rounded-md border" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="px-4 py-2 w-full rounded-md border"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="px-4 py-2 w-full rounded-md border" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Original Price</label>
                    <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="px-4 py-2 w-full rounded-md border" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="px-4 py-2 w-full rounded-md border">
                      {categories.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="px-4 py-2 w-full rounded-md border" />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="px-4 py-2 w-full rounded-md border" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Image URL</label>
                  <input type="url" value={formData.images[0]?.url} onChange={(e) => handleImageChange(0, e.target.value)} required className="px-4 py-2 w-full rounded-md border" />
                </div>
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mr-2" />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700">
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
