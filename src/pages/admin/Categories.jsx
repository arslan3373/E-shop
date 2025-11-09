import React, { useEffect, useState } from 'react';
import { categoriesAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });
const navigate=useNavigate()
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAllAdmin();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoriesAPI.create(formData);
        toast.success('Category created successfully!');
      }
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
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
        <div className="flex justify-between items-center mb-8">
                  <button 
   onClick={() => navigate(-1)}
    class="px-5 py-3 my-4 font-medium text-white rounded-lg shadow-md transition-all duration-300 bg-primary-600 hover:-translate-y-1"
  >
    ⬅ Back to Dashboard
  </button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
          <button
            onClick={openCreateModal}
            className="flex gap-2 items-center px-6 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
          >
            <FiPlus /> Add Category
          </button>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="object-cover w-12 h-12 rounded" />
                      ) : (
                        <div className="flex justify-center items-center w-12 h-12 text-xs text-gray-500 bg-gray-200 rounded">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">{category.name}</td>
                    <td className="px-4 py-3 max-w-xs text-gray-600 truncate">
                      {category.description || 'No description'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{category.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800">
                          <FiEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="text-red-600 hover:text-red-800">
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
            <div className="p-8 w-full max-w-md bg-white rounded-lg">
              <h2 className="mb-6 text-2xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 w-full rounded-md border focus:ring-2 focus:ring-primary-600"
                    placeholder="e.g., Electronics, Clothing"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="px-4 py-2 w-full rounded-md border focus:ring-2 focus:ring-primary-600"
                    placeholder="Brief description of the category"
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="px-4 py-2 w-full rounded-md border focus:ring-2 focus:ring-primary-600"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Active Category</span>
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
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

export default Categories;
