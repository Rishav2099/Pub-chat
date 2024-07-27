const Post = require('../models/post');
const User = require('../models/user');
const uploadOnCloudinary = require('../utils/cloudinary');
const { verifyToken } = require('../utils/jwt');

// Create Post
exports.createPost = async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  try {
    const token = req.cookies.token;
    if (!token) {
      console.error('Token not found');
      return res.status(401).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    let imageUrl = '';
    if (file) {
      try {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        imageUrl = cloudinaryResponse.url;
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return res.status(500).json({ message: 'Error uploading image', error: uploadError });
      }
    }

    const newPost = new Post({
      title,
      imageUrl,
      author: decoded.id,
    });

    await newPost.save();

    await User.findByIdAndUpdate(decoded.id, {
      $push: { posts: newPost._id }
    });

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name username imageUrl');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Single Post
exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Fetching post with ID:', id); // Log the ID
    const post = await Post.findById(id).populate('author', 'name username');
    console.log('Fetched Post:', post); // Log the fetched post
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Update Post
// Update Post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const file = req.file;

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let imageUrl;
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      imageUrl = cloudinaryResponse.url;
    }

    // Build the update object dynamically
    const updateData = { title };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete Post
exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await User.findByIdAndUpdate(decoded.id, {
      $pull: { posts: id }
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Like Post
exports.likePost = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(decoded.id)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(decoded.id);
    await post.save();

    await User.findByIdAndUpdate(decoded.id, {
      $addToSet: { likedPosts: post._id },
    });

    const updatedPost = await Post.findById(id).populate('author', 'name username imageUrl');
    res.status(200).json({ message: 'Post liked successfully', post: updatedPost });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unlike Post
exports.unlikePost = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const index = post.likes.indexOf(decoded.id);
    if (index === -1) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }

    post.likes.splice(index, 1);
    await post.save();

    await User.findByIdAndUpdate(decoded.id, {
      $pull: { likedPosts: post._id },
    });

    const updatedPost = await Post.findById(id).populate('author', 'name username imageUrl');
    res.status(200).json({ message: 'Post unliked successfully', post: updatedPost });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
