const express = require('express');
const router = express.Router();
const { getAllChat, postMessage, getChattedUsers } = require('../controller/message.controller');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all chat between authenticated user and userId2
router.get('/:userId2', authenticateToken, getAllChat);

// Post a new message
router.post('/', authenticateToken, postMessage);

// Get all users the authenticated user has chatted with
router.get('/chattedUsers/:userId', authenticateToken, getChattedUsers);

module.exports = router;
