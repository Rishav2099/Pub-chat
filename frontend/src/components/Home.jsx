import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getuserApi, likePost, unlikePost } from '../apis/apiProvider';


const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getuserApi();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (error) {
        setError('Error fetching posts');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);
      const updatedPost = response.post;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleUnlike = async (postId) => {
    try {
      const response = await unlikePost(postId);
      const updatedPost = response.post;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  return (
    <div className=" mb-20 flex flex-col items-center min-h-screen bg-black text-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-950 rounded-lg shadow-md">
        {user ? (
          <h2 className="text-2xl font-bold text-center">
            Welcome, {user.name}!
          </h2>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Welcome!</h2>
            <p className="text-center">
              Please <Link to="/signup" className="text-indigo-400 hover:underline">Sign Up</Link> or <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>.
            </p>
          </div>
        )}
      </div>
      {error && <div className="text-red-400 mt-4">{error}</div>}
      <div className="w-full max-w-4xl p-4 space-y-6 mt-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-slate-950 border border-gray-700 rounded-lg shadow-sm hover:bg-slate-900 transition duration-300">
              <div className="flex items-center p-4 border-b border-gray-700">
                <img
                  src={post.author.imageUrl || 'default-profile.png'}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-200">{post.author.name}</h3>
                  <p className="text-sm text-gray-400">@{post.author.username}</p>
                  <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-100">{post.title}</h3>
                <p className="text-gray-300">{post.description}</p>
                <div className="flex items-center mt-2">
                  {post.likes.includes(user._id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleUnlike(post._id)} height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" className="cursor-pointer hover:fill-red-500 transition duration-300">
                      <path d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleLike(post._id)} height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" className="cursor-pointer hover:fill-green-500 transition duration-300">
                      <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/>
                    </svg>
                  )}
                  <span className="ml-2 text-gray-400">{(post.likes.length === 0) ? '' : `${post.likes.length} Likes`} </span>
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

export default Home;
