const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, limits } = require('../cloudinary');
const upload = multer({ storage, limits });

const { isLoggedIn, isAuthor, clearGoBack } = require('../middleware');
const memes = require('../controllers/memes');

router.get('/', clearGoBack, memes.renderStartPage);

router.get('/memes/new', isLoggedIn, memes.renderAddNewPage);

router.get('/top', clearGoBack, memes.renderTopPage);

router.get(
  '/memes/:memecategory/:page',
  clearGoBack,
  memes.renderCategoryPages
);

router.get('/memes/:page', clearGoBack, memes.renderAllMemesPages);

router.post('/meme', isLoggedIn, upload.single('image'), memes.addNewMeme);

router.get('/meme/:id', memes.showMeme);

router.put('/meme/:id', isLoggedIn, isAuthor, memes.editMeme);

router.patch('/meme/:id', isLoggedIn, memes.voteMeme);

router.delete('/meme/:id', isLoggedIn, isAuthor, memes.deleteMeme);

router.get('/meme/:id/edit', isLoggedIn, isAuthor, memes.renderEditPage);

module.exports = router;
