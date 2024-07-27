import React, { useState, useEffect, useContext } from 'react';
import { getChattedUsersApi } from '../apis/apiProvider'; 
import { UserContext } from '../context/UserContext'; 
import { Link } from 'react-router-dom';

const ChattedUsers = () => {
  const [chattedUsers, setChattedUsers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchChattedUsers = async () => {
      if (user) {
        try {
          const users = await getChattedUsersApi(user._id);
          setChattedUsers(users);
        } catch (error) {
          console.error('Failed to fetch chatted users:', error);
        }
      }
    };

    fetchChattedUsers();
  }, [user]);

  return (
    <div className='w-full bg-black'>
    <div className="container p-4 bg-black min-h-screen w-full text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">All Messages</h1>
      {chattedUsers.length > 0 ? (
        <ul className="list-none space-y-4">
          {chattedUsers.map((chattedUser) => (
            <Link to={`/chat/${chattedUser.id}`} key={chattedUser.id}>
              <li className="flex items-center p-3 bg-black rounded-md hover:bg-slate-950 transition duration-300">
                <img src={chattedUser.imageUrl} alt={chattedUser.username} className="w-12 h-12 rounded-full mr-4" />
                <span className="text-lg">{chattedUser.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-10">No chatted users found, you can chat with Rishav</p>
      )}
    </div>
    </div>
  );
};

export default ChattedUsers;
