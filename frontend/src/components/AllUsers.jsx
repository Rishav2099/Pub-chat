import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsersApi } from '../apis/apiProvider';

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsersApi();
        if (allUsers) {
          setUsers(allUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <ul>
        {users.map(user => (
          <li key={user._id} className="mb-4">
            <Link to={`/users/${user._id}`} className="flex items-center gap-5 w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
              <img src={user.imageUrl} alt="" className="rounded-full w-14 h-14 object-cover" />
              <div className="name">
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserListPage;
