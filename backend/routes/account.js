const express = require('express')
const router = express.Router()
const {signup, login, editUser, userPosts, getAllUsers, getUserDetail, getUser, UserProfilePosts} = require('../controller/account.controller')
const upload = require('../middleware/multer');
const { authenticateToken } = require('../middleware/authMiddleware');

// to sign up user
router.post('/signup', upload.single('image'), signup);

// to login user
router.post('/login', login)
router.put('/edit', upload.single('image'), editUser);
router.get('/user', getUser)
router.get('/users', authenticateToken , getAllUsers)
router.get('/posts',userPosts)
router.get('/:id', getUserDetail, UserProfilePosts)

module.exports = router