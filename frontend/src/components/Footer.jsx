import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { AiFillHome, AiOutlinePlusCircle } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { IoChatbubblesOutline } from "react-icons/io5";

const Footer = () => {
  const { user } = useContext(UserContext);

  return (
    <footer className="bg-black fixed bottom-0 w-full py-2">
      <div className="container mx-auto">
        {user && (
          <div className="flex items-center justify-between w-full text-white">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-indigo-400 flex flex-col items-center ${isActive ? "text-indigo-400" : ""}`}
            >
              <AiFillHome size={24} />
              <span className="text-xs">Home</span>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `hover:text-indigo-400 flex flex-col items-center ${isActive ? "text-indigo-400" : ""}`}
            >
              <BsPeople size={24} />
              <span className="text-xs">Users</span>
            </NavLink>
            <NavLink
              to="/post"
              className={({ isActive }) =>
                `hover:text-indigo-400 flex flex-col items-center ${isActive ? "text-indigo-400" : ""}`}
            >
              <AiOutlinePlusCircle size={24} />
              <span className="text-xs">Add</span>
            </NavLink>
            <NavLink
              to="/chats"
              className={({ isActive }) =>
                `hover:text-indigo-400 flex flex-col items-center ${isActive ? "text-indigo-400" : ""}`}
            >
              <IoChatbubblesOutline size={24} />
              <span className="text-xs">Chats</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `hover:text-indigo-400 flex flex-col items-center ${isActive ? "text-indigo-400" : ""}`}
            >
              <img src={user.imageUrl} className="w-10 rounded-full h-10" alt="Profile" />
            </NavLink>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
