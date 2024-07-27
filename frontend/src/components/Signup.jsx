import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signupApi } from '../apis/apiProvider';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(true);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('image', data.image[0]); // Assuming 'image' is the name of the file input field

    setLoading(true); // Set loading to true when submission starts

    try {
      await signupApi(formData);
      navigate('/')
      // Handle successful signup (e.g., redirect to login page or show success message)
    } catch (error) {
      setError(error.message); // Set error message based on response from the API
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  const togglePassword = () => setShowPass(prev => !prev);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-100">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              id="name"
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <input
              id="username"
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <span className="text-sm text-red-600">{errors.username.message}</span>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type={showPass ? 'password' : 'text'}
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
                pattern: {
                  value: /^(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                  message: 'Password must include at least one number',
                },
              })}
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
            <button type="button" onClick={togglePassword} className="text-sm text-indigo-600">
              {showPass ? 'Show' : 'Hide'}
            </button>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300">Profile Photo</label>
            <input
              id="image"
              type="file"
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('image')}
            />
            {errors.image && <span className="text-sm text-red-600">{errors.image.message}</span>}
          </div>
          
          {error && <div className="text-sm text-red-600">{error}</div>}
          {loading && <div className="text-sm text-indigo-600">Submitting...</div>} {/* Loading message */}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading} 
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
