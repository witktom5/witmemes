const Meme = require('../models/meme');
const catchAsync = require('../utilities/catchAsync');
const { cloudinary } = require('../cloudinary');
const moment = require('moment');
moment().format();

module.exports.renderStartPage = catchAsync(async (req, res) => {
  const memes = await Meme.find({}).limit(6).sort('-added').populate('author');
  const page = 1;
  const count = await Meme.count();
  const pageCount = Math.ceil(count / 6);

  for (let meme of memes) {
    meme.date = moment(meme.added).fromNow();
  }

  res.render('memes/index', { memes, page, pageCount });
});

module.exports.renderAddNewPage = (req, res) => {
  res.render('memes/new');
};

module.exports.renderTopPage = catchAsync(async (req, res) => {
  const allMemes = await Meme.find({}).populate('author');

  allMemes.sort(function (a, b) {
    if (a.totalUpvotes > b.totalUpvotes) return -1;
    if (a.totalUpvotes < b.totalUpvotes) return 1;
    return 0;
  });

  const memes = allMemes.slice(0, 10);

  for (let meme of memes) {
    meme.date = moment(meme.added).fromNow();
  }

  res.render('memes/index', { memes });
});

module.exports.renderCategoryPages = catchAsync(async (req, res) => {
  const { memecategory, page } = req.params;
  const category = memecategory.charAt(0).toUpperCase() + memecategory.slice(1);
  const count = await Meme.count({ category: category });
  const pageCount = Math.ceil(count / 6);
  if (page > pageCount || page < 1) {
    req.flash('info', 'This page is empty');
    return res.redirect('/');
  }
  const memes = await Meme.find({ category: category })
    .skip(page * 6 - 6)
    .limit(6)
    .sort('-added')
    .populate('author');

  for (let meme of memes) {
    meme.date = moment(meme.added).fromNow();
  }
  res.render('memes/index', { memes, page, category, pageCount });
});

module.exports.renderAllMemesPages = catchAsync(async (req, res) => {
  const { page } = req.params;
  const count = await Meme.count();
  const pageCount = Math.ceil(count / 6);
  if (page === '1' || page > pageCount || page < 1 || !parseInt(page))
    return res.redirect('/');
  const memes = await Meme.find({})
    .skip(page * 6 - 6)
    .limit(6)
    .sort('-added')
    .populate('author');
  for (let meme of memes) {
    meme.date = moment(meme.added).fromNow();
  }
  res.render('memes/index', { memes, page, pageCount });
});

module.exports.addNewMeme = catchAsync(async (req, res, next) => {
  const meme = new Meme(req.body.meme);
  meme.author = req.user._id;
  meme.image = { url: req.file.path, name: req.file.filename };
  await meme.save();
  req.flash('success', `Succesfully added a new meme!`);
  res.redirect('/');
});

module.exports.showMeme = catchAsync(async (req, res) => {
  const { id } = req.params;
  const meme = await Meme.findById(id)
    .populate({
      path: 'comments',
      populate: 'author',
      options: { sort: '-added' },
    })
    .populate('author');
  meme.date = moment(meme.added).fromNow();
  for (let comment of meme.comments) {
    comment.date = moment(comment.added).fromNow();
  }
  if (!req.session.goBack) {
    req.session.goBack = req.get('referer');
  }
  if (typeof req.session.goBack === 'undefined') {
    req.session.goBack = '/';
  }
  const { goBack } = req.session;
  res.render('memes/show', { meme, goBack });
});

module.exports.editMeme = catchAsync(async (req, res) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  meme.title = req.body.meme.title;
  meme.category = req.body.meme.category;
  await meme.save();
  res.redirect(`/meme/${id}`);
});

module.exports.voteMeme = catchAsync(async (req, res) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  if (req.body.vote === 'upvote') {
    if (meme.upvotedBy.includes(req.user._id)) {
      await Meme.findByIdAndUpdate(id, {
        $pull: { upvotedBy: req.user._id },
      });
    } else {
      if (meme.downvotedBy.includes(req.user._id)) {
        await Meme.findByIdAndUpdate(id, {
          $pull: { downvotedBy: req.user._id },
        });
      }
      meme.upvotedBy.push(req.user._id);
    }
  }
  if (req.body.vote === 'downvote') {
    if (meme.downvotedBy.includes(req.user._id)) {
      await Meme.findByIdAndUpdate(id, {
        $pull: { downvotedBy: req.user._id },
      });
    } else {
      if (meme.upvotedBy.includes(req.user._id)) {
        await Meme.findByIdAndUpdate(id, {
          $pull: { upvotedBy: req.user._id },
        });
      }
      meme.downvotedBy.push(req.user._id);
    }
  }
  await meme.save();
  const changedMeme = await Meme.findById(id);
  const totalUpvotes = changedMeme.upvotedBy.length;
  const totalDownvotes = changedMeme.downvotedBy.length;
  res.json({ totalUpvotes, totalDownvotes });
});

module.exports.deleteMeme = catchAsync(async (req, res) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  await cloudinary.uploader.destroy(meme.image.name);
  await Meme.findByIdAndDelete(id);
  req.flash('info', 'Successfully deleted your meme');
  res.redirect('/');
});

module.exports.renderEditPage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const meme = await Meme.findById(id);
  res.render('memes/edit', { meme });
});
