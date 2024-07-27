// components/Login.jsx
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { loginApi } from '../apis/apiProvider';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi(data);

      if (res && res.user) {
        // Set user in context
        setUser(res.user);
        navigate('/');
      } else {
        setError(res?.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPass(prev => !prev);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-100">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm bg-slate-950 border-slate-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="text-sm text-indigo-600 mt-1"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {loading && <div className="text-sm text-indigo-600">Submitting...</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
