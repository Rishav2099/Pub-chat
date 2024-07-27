import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetailApi } from '../apis/apiProvider';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext';

const socket = io(`${import.meta.env.VITE_URL}`, { withCredentials: true });

const Chat = () => {
  const { userId2 } = useParams();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverProfile, setReceiverProfile] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/chat/${userId2}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const chatHistory = await response.json();
        // Add isSender property based on sender id
        const updatedChatHistory = chatHistory.map((msg) => ({
          ...msg,
          isSender: msg.sender._id === user._id,
        }));
        setMessages(Array.isArray(updatedChatHistory) ? updatedChatHistory : []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    const fetchReceiverProfile = async () => {
      try {
        const profile = await getUserDetailApi(userId2);
        setReceiverProfile(profile);
      } catch (error) {
        console.error('Error fetching receiver profile:', error);
      }
    };

    fetchChatHistory();
    fetchReceiverProfile();

    const roomId = [user._id, userId2].sort().join('_');
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (message) => {
      const updatedMessage = {
        ...message,
        isSender: message.sender === user._id,
      };
      setMessages((prevMessages) => [...prevMessages, updatedMessage]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', roomId);
    };
  }, [userId2, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user._id,
      receiver: userId2,
      content: newMessage,
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col">
      {receiverProfile && (
        <div className="p-4 flex items-center bg-slate-900 shadow-lg">
          <img src={receiverProfile.imageUrl} alt="Receiver Avatar" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 className="text-xl font-bold">{getFirstName(receiverProfile.name)}</h2>
          </div>
        </div>
      )}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg max-w-[70%] w-fit ${message.isSender ? 'bg-slate-900 ml-auto text-right' : 'bg-slate-800 mr-auto text-left'} break-words overflow-hidden`}
          >
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 flex mb-14">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 bg-slate-950 text-white rounded-l-md"
          placeholder="Type your message..."
        />
        <button type="submit" className="p-2 bg-slate-800 hover:bg-slate-950 text-white rounded-r-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
