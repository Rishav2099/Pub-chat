import React, { useState } from 'react';
import { addPostApi } from '../apis/apiProvider';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError('Title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await addPostApi(formData);
      if (response.message) {
        navigate('/');
      }
      setSuccess(response.message);
      setTitle('');
      setImage(null);
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-100">Add New Post</h1>
        {success && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-gray-300 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Add Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
