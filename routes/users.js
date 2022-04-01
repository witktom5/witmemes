const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

router.get('/login', users.renderLoginPage);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  users.loginUser
);

router.get('/logout', users.logoutUser);

router.get('/register', users.renderRegisterPage);

router.post('/register', users.registerNewUser);

module.exports = router;
