const Router = require('express').Router();
const bookModel = require('../models/books');
const loginRequired = require('../middleware/loginRequired');

Router.get('/book', loginRequired, async(req, res) => {
    let bookId = req.query.id;
    if(!bookId) return res.redirect('/');
    let book = await bookModel.findById(bookId);
    if(!book) return res.redirect('/');
    res.render('dashboard/book-detail.html', { book });
});

module.exports = Router;