const Comment = require('../models/comment');
const Meme = require('../models/meme');
const catchAsync = require('../utilities/catchAsync');
const moment = require('moment');
moment().format();

module.exports.addNewComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  meme.comments.push(comment);
  await comment.save();
  await meme.save();
  req.flash('success', `Succesfully made a new comment!`);
  res.redirect(`/meme/${id}`);
});

module.exports.deleteComment = catchAsync(async (req, res) => {
  const { id, commentId } = req.params;
  await Meme.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash('info', 'Successfully deleted your comment');
  res.redirect(`/meme/${id}`);
});

module.exports.voteComment = catchAsync(async (req, res) => {
  req.session.voteAwaiting = true;
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (req.body.vote === 'upvote') {
    if (comment.upvotedBy.includes(req.user._id)) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { upvotedBy: req.user._id },
      });
    } else {
      if (comment.downvotedBy.includes(req.user._id)) {
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { downvotedBy: req.user._id },
        });
      }
      comment.upvotedBy.push(req.user._id);
    }
  }
  if (req.body.vote === 'downvote') {
    if (comment.downvotedBy.includes(req.user._id)) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { downvotedBy: req.user._id },
      });
    } else {
      if (comment.upvotedBy.includes(req.user._id)) {
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { upvotedBy: req.user._id },
        });
      }
      comment.downvotedBy.push(req.user._id);
    }
  }
  await comment.save();
  const changedComment = await Comment.findById(commentId);
  const totalUpvotes = changedComment.upvotedBy.length;
  const totalDownvotes = changedComment.downvotedBy.length;
  delete req.session.voteAwaiting;
  res.json({ totalUpvotes, totalDownvotes });
});
