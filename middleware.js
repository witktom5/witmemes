const Meme = require('./models/meme');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to do that');
    return res.redirect('/login');
  }
  next();
};

module.exports.voteAwaiting = (req, res, next) => {
  if (req.session.voteAwaiting) {
    return res.end();
  }
  next();
};

module.exports.clearGoBack = (req, res, next) => {
  if (req.session.goBack) {
    delete req.session.goBack;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  if (!req.user || !meme.author.equals(req.user._id)) {
    req.flash('error', 'You have no permission to do that');
    return res.redirect(`/meme/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!req.user || !comment.author.equals(req.user._id)) {
    req.flash('error', 'You have no permission to do that');
    return res.redirect(`/meme/${id}`);
  }
  next();
};
