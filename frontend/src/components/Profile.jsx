import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserPosts, getuserApi, deletePostApi, updatePostApi } from '../apis/apiProvider';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getuserApi();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postData = await getUserPosts();
        setPosts(postData.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to fetch user posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deletePostApi(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  const handleEditPost = async (postId, updatedData) => {
    try {
      const updatedPost = await updatePostApi(postId, updatedData);
      setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-4">Loading...</div>;
  }

  return (
    <div className="pt-5 flex flex-col items-center min-h-screen bg-black text-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 rounded-lg shadow-md">
        {user ? (
          <div>
            <img className='rounded-full w-20 h-20' src={user.imageUrl} alt="" />
            <h2 className="text-2xl font-bold text-center text-gray-100">
              {user.name} 
            </h2>
            <p className="text-center text-gray-400">@{user.username}</p>
            <Link to="/edit">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                Edit Profile
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-100">Profile</h2>
            <p className="text-center text-gray-400">
              Please <Link to="/login" className="text-blue-600">login</Link> to see your profile.
            </p>
          </div>
        )}
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      <div className="w-full max-w-4xl p-4 space-y-6 mt-6 mb-20">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-slate-950 border border-slate-600 rounded-lg shadow-sm">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-h-96 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-100">{post.title}</h3>
                <div className="flex gap-2 mt-2">
                  <Link to={`/edit-post/${post._id}`}>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
