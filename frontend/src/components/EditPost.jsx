import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updatePostApi, getPostByIdApi } from '../apis/apiProvider';

const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    if (!postId) {
      console.error('Post ID is missing'); // Add log here
      setError('Post ID is missing');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', postId); // Log the ID
        const postData = await getPostByIdApi(postId);
        setPost(postData);
        setTitle(postData.title);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (file) {
      formData.append('image', file);
    }

    try {
      console.log('Updating post with ID:', postId); // Add log here
      await updatePostApi(postId, formData);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-black">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen bg-black">No post found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Edit Post</h2>
        {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300">Image</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
