const Router = require('express').Router();
const bookModel = require('../models/books');
const loginRequired = require('../middleware/loginRequired');

let categorys = ['novel', 'childrens', 'self-help', 'poem'];

Router.get('/', loginRequired, async(req, res) => {
    let category = req.query.category;
    let cat = categorys[category-1];
    if (categorys.includes(cat)) {
        let books = await bookModel.find({ type: cat });
        res.render('dashboard/home.html', { category: cat, books });
    } else {
        let books = await bookModel.find({ type: categorys[0] });
        res.render('dashboard/home.html', { category: categorys[0], books });
    };
});

module.exports = Router;