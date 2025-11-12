'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';
import { useCategoryStore } from '@/store/categoryStore';

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setname] = useState('');
  const [slug, setslug] = useState('')
  const [description, setdescription] = useState('')
  const [parentId, setparentId] = useState(0)
  const [image, setimage] = useState<File | null>(null)
  const [isActive, setisActive] = useState(false)


  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { categories: catgoryDat, loading: loadingCategoriesdata, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [reloadTrigger]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get('/api/user/Addcategory');
      console.log("data", response);

      setCategories(response.data.Allcategory || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setimage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  const generateSlug = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setslug(slug);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return false;
    }

    if (!slug.trim()) {
      toast.error('Slug is required');
      return false;
    }

    if (name.length < 2) {
      toast.error('Category name must be at least 2 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      formData.append('isActive', isActive.toString()); 

      const response = await axios.post('/api/user/Addcategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      toast.success('Category created successfully!');
      setReloadTrigger(prev => prev + 1);
      useCategoryStore.getState().addCategory(response.data.category);
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An error occurred while creating the category');
    } finally {
      setLoading(false);
    }
  };

  async function handleDeleteUser(_id: any) {

    setLoading(true);
    try {
      const response = await axios.put(`api/user/Addcategory/${_id}`)
      toast.success(`delete successfully this record  id : ${_id} `)
      useCategoryStore.getState().deleteCategory(_id)
    }
    catch (err) {
      console.error('Error creating category:', error);
      toast.error('An error occurred while creating the category');
    }
    finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(_id: any) {

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
      formData.append('isActive', isActive.toString());
      const response = await axios.put(`api/user/Addcategory/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important!
        },
      });
      toast.success(`update successfully this record  id : ${_id} `)
      useCategoryStore.getState().updateCategory(_id)
    }
    catch (err) {
      console.error('Error creating category:', error);
      toast.error('An error occurred while creating the category');
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600 mt-2">Create a new product category for your store</p>
        </div>


        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
                required
              />
              <p className="mt-1 text-sm text-gray-500">The name of your category (e.g., Electronics, Clothing)</p>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setslug(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="category-slug"
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
                >
                  Generate
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">URL-friendly version of the category name</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category description..."
            />
            <p className="mt-1 text-sm text-gray-500">Optional description for the category</p>
          </div>

          {/* Parent Category and Sort Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category
              </label>
              {loadingCategories ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                  Loading categories...
                </div>
              ) : (
                <select
                  id="parentId"
                  name="parentId"
                  value={parentId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No Parent (Top Level)</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id} onChange={(e) => setparentId(category._id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-1 text-sm text-gray-500">Select parent category if this is a subcategory</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <div className="flex items-center space-x-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={isActive}
                onChange={(e) => setisActive(true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Category
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">Uncheck to disable this category</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>

      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', alignItems: 'center' }}>
        <h1 style={{ color: 'black', display: 'flex', justifyContent: 'center', fontWeight: "bold" }}>Category Data </h1>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>}
            {count !== 0 && <p>Data Count: {count}</p>}
            <label>serach userName</label>
            <input id="searchbox" value={searchText} className='ml-10 p-4 w-30 bg-gray h-10' onChange={(e) => setSearchText(e.target.value)}></input> */}
        {categories.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Image</th>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>slug</th>
                  <th style={tableHeaderStyle}>Parent category</th>
                  <th style={tableHeaderStyle}>Description</th>
                  <th style={tableHeaderStyle}>Is Active</th>
                  <th style={tableHeaderStyle}>DELETE ACTION</th>
                  <th style={tableHeaderStyle}>EDIT ACTION</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((user) => (
                  <tr key={user._id}>
                    <td style={tableCellStyle}>{user._id}</td>
                    <td style={tableCellStyle}>{user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={50}
                        height={50}
                        unoptimized // This disables Next.js image optimization
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}</td>
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.slug}</td>
                    <td style={tableCellStyle}>{user.parentId}</td>
                    <td style={tableCellStyle}>{user.description}</td>
                    <td style={tableCellStyle}>{user.isActive}</td>
                    <td style={tableCellStyle}>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user._id)} // ✅ Pass user ID
                        style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        type="button"
                        onClick={() => handleUpdateUser(user._id)} // ✅ Pass user ID
                        style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#000000ff',
  textAlign: 'left' as const,
};

const tableCellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#000',
  whiteSpace: 'normal',
  overflowWrap: 'break-word' as React.CSSProperties['overflowWrap'],
  maxWidth: '250px',
  verticalAlign: 'top',
};