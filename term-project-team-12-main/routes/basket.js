const Router = require('express').Router();
const loginRequired = require('../middleware/loginRequired');

Router.get('/basket', loginRequired, (req, res) => {
    res.render('dashboard/basket.html');
});

Router.post('/checkout', loginRequired, (req, res) => {
    let total = req.body.total;
    if(!total) {
        req.flash('error', 'An error occurred while redirecting to the payment page.');
        return res.redirect('back');
    };

    res.render('dashboard/pay.html', { total });
});
module.exports = Router;