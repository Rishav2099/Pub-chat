const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const { authenticateToken } = require('../middleware/authMiddleware'); // Add authentication middleware
const upload = require('../middleware/multer'); // Add multer middleware for file uploads

router.post('/create', authenticateToken, upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', authenticateToken, upload.single('image'), postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);
router.post('/:id/like', authenticateToken, postController.likePost);
router.post('/:id/unlike', authenticateToken, postController.unlikePost);


module.exports = router;
