const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

module.exports.renderRegisterPage = (req, res) => {
  if (req.user) {
    req.flash('info', 'You are already registered!');
    return res.redirect('/');
  }
  res.render('users/register');
};

module.exports.registerNewUser = catchAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', `Welcome to WitMemes, ${req.user.username}!`);
      res.redirect('/');
    });
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/register');
  }
});

module.exports.logoutUser = (req, res) => {
  if (!req.user) {
    req.flash('info', "Can't log you out, because you are not logged in!");
    return res.redirect('/');
  }
  if (req.session.returnTo) {
    delete req.session.returnTo;
  }
  req.logout();
  req.flash('info', 'You have been logged out...');
  res.redirect('/');
};

module.exports.renderLoginPage = (req, res) => {
  if (!req.session.returnTo) {
    req.session.returnTo = req.get('referer');
  }
  res.render('users/login');
};

module.exports.loginUser = (req, res) => {
  req.flash('success', `Welcome back, ${req.user.username}!`);
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo);
    delete req.session.returnTo;
  } else {
    res.redirect('/');
  }
};
