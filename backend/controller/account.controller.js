const User = require('../models/user');
const Post = require('../models/post');
const { hashPassword, passwordCompare } = require('../utils/hashPassword');
const uploadOnCloudinary = require('../utils/cloudinary');
const { generateToken, verifyToken } = require('../utils/jwt');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const file = req.file;

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Upload image to Cloudinary
    let cloudinaryResponse = '';
    if (file) {
      cloudinaryResponse = await uploadOnCloudinary(file.path);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      imageUrl: cloudinaryResponse.url,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use true in production with HTTPS
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
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Sign up first' });
    }

    // Compare the password
    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use true in production with HTTPS
      sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User
exports.getUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit User
exports.editUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { name, username, email } = req.body;
    const file = req.file;

    let updatedData = { name, username, email };

    // Check if the new username already exists (except for the current user)
    if (username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: decoded.id } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      updatedData.imageUrl = cloudinaryResponse.url;
    }

    const user = await User.findByIdAndUpdate(decoded.id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User's Posts
exports.userPosts = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id).populate('posts', 'imageUrl title');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ posts: user.posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//to get user profile post
exports.UserProfilePosts = async (req, res) => {
  try {
    const post = await User.findById(req.params.id).populate('posts', 'imageUrl title');
    if (!post) {
      return res.status(404).json({ message: 'No post found' });
    }

    res.status(200).json({ posts: post.posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// to get user detail
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts', 'imageUrl title');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
