const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/creachives', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
});

const User = mongoose.model('User ', userSchema);

// Define Post schema
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Define Message schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Routes for authentication, posts, users, messages will go here...

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    const message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();

    // Emit message to receiver if connected
    io.to(receiverId).emit('receiveMessage', message);
  });

  socket.on('join', (userId) => {
    socket.join(userId); // Join room with userId for private messaging
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
