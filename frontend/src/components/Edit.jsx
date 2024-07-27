import React, { useEffect, useState } from 'react';
import { getuserApi, updateUserApi } from '../apis/apiProvider'; // Assuming updateUserApi is added
import { useNavigate } from 'react-router-dom'; // To navigate after update

const Edit = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    image: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getuserApi();
        if (fetchedUser) {
          setUser(fetchedUser);
          setFormData({
            name: fetchedUser.name,
            username: fetchedUser.username,
            email: fetchedUser.email,
            image: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      const updatedUser = await updateUserApi(formData);
      setUser(updatedUser);
      navigate('/profile'); // Navigate to profile page after successful update
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Username already exists') {
        setError('Username already exists');
      } else {
        setError(error.message || 'An error occurred');
      }
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-black">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen bg-black">No user found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-100">Edit Profile</h2>
        {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Profile Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
