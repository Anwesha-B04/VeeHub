const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const messageController = require('../controllers/messageController');

// Create a message (authenticated)
router.post('/', authMiddleware, messageController.createMessage);

// Get messages for a listing (authenticated)
// Get unread messages count for the authenticated user
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);

// Get conversations grouped by listing + participant
router.get('/conversations', authMiddleware, messageController.getConversations);

// Get messages for a listing (authenticated)
router.get('/:listingId', authMiddleware, messageController.getMessagesForListing);

module.exports = router;
