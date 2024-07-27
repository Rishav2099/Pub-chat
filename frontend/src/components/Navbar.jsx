import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
       <Link to='/'> <h2 className="text-white text-2xl font-bold">Pub-Chat</h2> </Link>
        <ul className="flex gap-3 text-white">
          {!user && (
             <>
             <li><Link to="/login" className="hover:text-indigo-400">Login</Link></li>
             <li><Link to="/signup" className="hover:text-indigo-400">Signup</Link></li>
           </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
