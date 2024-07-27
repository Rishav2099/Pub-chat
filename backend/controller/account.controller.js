const User = require('../models/user');
const Post = require('../models/post');
const { hashPassword, passwordCompare } = require('../utils/hashPassword');
const uploadOnCloudinary = require('../utils/cloudinary');
const { generateToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/authMiddleware');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const file = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    let imageUrl = '';
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      imageUrl = cloudinaryResponse.url;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      imageUrl,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Sign up first' });
    }

    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User
exports.getUser = [
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

// Edit User
exports.editUser = [
  authenticateToken,
  async (req, res) => {
    try {
      const { name, username, email } = req.body;
      const file = req.file;

      let updatedData = { name, username, email };

      if (username) {
        const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } });
        if (existingUsername) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }

      if (file) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        updatedData.imageUrl = cloudinaryResponse.url;
      }

      const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

// Get User's Posts
exports.userPosts = [
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('posts', 'imageUrl title');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ posts: user.posts });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

// Get User Profile Posts
exports.UserProfilePosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts', 'imageUrl title');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ posts: user.posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User Detail
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts', 'imageUrl title');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
