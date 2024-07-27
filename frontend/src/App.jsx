import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditPage from './pages/EditPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import AllUsersPage from './pages/AllUsersPage';
import UserDetailPage from './pages/UserDetailPage';
import ChatPage from './pages/ChatPage';
import { UserProvider } from './context/UserContext';
import ChattedUsersPage from './pages/ChattedUsersPage';

function App() {

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/edit-post/:postId" element={<EditPostPage />} />
        <Route path='/users' element={<AllUsersPage />} />
        <Route path='/users/:id' element={<UserDetailPage />} />
        <Route path='/chat/:userId2' element={<ChatPage />} />
        <Route path="/chats" element={<ChattedUsersPage />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
