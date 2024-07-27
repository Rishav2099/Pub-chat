import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserDetailApi } from '../apis/apiProvider';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserDetailApi(id);
        setUser(user);
        setPosts(user.posts);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user details');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="bg-black min-h-screen text-gray-100 flex flex-col items-center py-8">
      <div className="bg-slate-950 w-full max-w-md p-6 rounded-lg shadow-lg">
        {user && (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.imageUrl || 'default-profile.png'}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-gray-700"
              />
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold">{user.name}</p>
                <p className="text-xl text-gray-400">@{user.username}</p>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <Link
                to={`/chat/${user._id}`} // Ensure currentUserId is correctly defined
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 transition"
              >
                Message
              </Link>
            </div>
          </>
        )}
      </div>
      <div className=" w-full max-w-3xl p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="bg-slate-950 p-2 mb-4 rounded-lg  shadow-md pb-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-[50vh] object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-300">{post.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
