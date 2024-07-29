const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const account = require('./routes/account');
const post = require('./routes/post.routes');
const chatRoutes = require('./routes/message.route');
const { getUser } = require('./controller/account.controller');
const Message = require('./models/message'); // Ensure the correct path to the Message model
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Ensure this is set to your frontend URL
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the account router
app.use('/account', account);
app.use('/post', post);
app.use('/chat', chatRoutes);

app.get('/account/user', getUser);

// Middleware to handle HTTPS redirects in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on('sendMessage', async ({ sender, receiver, content }) => {
    try {
      const newMessage = new Message({ sender, receiver, content });
      const savedMessage = await newMessage.save();
      const roomId = [sender, receiver].sort().join('_');
      io.to(roomId).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
