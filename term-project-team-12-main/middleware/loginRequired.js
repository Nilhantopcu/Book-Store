const loginRequired = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    req.flash('error_message', 'You must login!');
    res.redirect('/login');
};

module.exports = loginRequired;