const Message = require('../models/message');
const { verifyToken } = require('../utils/jwt');

exports.getAllChat = async (req, res) => {
  const decoded = req.user; // User info from authenticateToken middleware

  try {
    const { userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: decoded.id, receiver: userId2 },
        { sender: userId2, receiver: decoded.id }
      ]
    })
    .populate('sender receiver', 'name username imageUrl')
    .sort({ timestamp: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: 'No chat history found' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.postMessage = async (req, res) => {
  const decoded = req.user; // User info from authenticateToken middleware

  try {
    const { receiver, content } = req.body;
    const newMessage = new Message({ sender: decoded.id, receiver, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getChattedUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender receiver', 'name username imageUrl');

    const users = new Set();
    messages.forEach(msg => {
      if (msg.sender._id.toString() !== userId) {
        users.add(JSON.stringify({ id: msg.sender._id, name: msg.sender.name, username: msg.sender.username, imageUrl: msg.sender.imageUrl }));
      }
      if (msg.receiver._id.toString() !== userId) {
        users.add(JSON.stringify({ id: msg.receiver._id, name: msg.receiver.name, username: msg.receiver.username, imageUrl: msg.receiver.imageUrl }));
      }
    });

    res.status(200).json([...users].map(user => JSON.parse(user)));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
