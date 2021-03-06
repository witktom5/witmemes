const express = require('express');
const router = express.Router();
const comments = require('../controllers/comments');
const { isLoggedIn, isCommentAuthor } = require('../middleware');

router.post('/:id', isLoggedIn, comments.addNewComment);

router.delete(
  '/:id/comments/:commentId',
  isLoggedIn,
  isCommentAuthor,
  comments.deleteComment
);

router.patch('/:id/comments/:commentId', isLoggedIn, comments.voteComment);

module.exports = router;
