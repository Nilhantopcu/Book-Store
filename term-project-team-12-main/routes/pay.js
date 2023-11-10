const Router = require('express').Router();
const loginRequired = require('../middleware/loginRequired');

Router.post('/pay', loginRequired, (req, res) => {
    req.flash('success_message', 'Your payment has been made successfully.')
    res.redirect('/')
});

module.exports = Router;