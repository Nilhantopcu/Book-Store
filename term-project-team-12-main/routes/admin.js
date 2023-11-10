const Router = require('express').Router();
const fs = require('fs');
const bookModel = require('../models/books');
const siteModel = require('../models/site');
const loginRequired = require('../middleware/loginRequired');

let categorys = ['novel', 'childrens', 'self-help', 'poem'];


let adminIS = (req, res, next) => {
    if(req.user.admin === true) return next();
    res.redirect('/');
};


Router.get('/admin', loginRequired, adminIS, async(req, res) => {
    let books = await bookModel.find({});
    let site = await siteModel.findOne({ id: 1 });
    res.render('dashboard/admin.html', { books, site });
});

Router.post('/admin/add-book', loginRequired, adminIS, (req, res) => {
    let { bookName, author, type, price, image, description } = req.body;
    if(!bookName || !author || !type || !price || !image || !description) {
        req.flash('error', 'Please fill in all fields.');
        return res.redirect('back');
    };

    if(isNaN(price)) {
        req.flash('error', 'Please enter a valid price.');
        return res.redirect('back');
    };

    if(!categorys.includes(type)) {
        req.flash('error', 'Please enter a valid category.');
        return res.redirect('back');
    };

    let bookImageID = new Date().getTime();
    let base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    let imageUrl = `assets/img/${bookImageID}.png`;
    fs.writeFile(imageUrl, base64Data, 'base64', (err) => {
        if (err) {
            req.flash('error', 'An error occurred while uploading the image.');
            return res.redirect('back');
        };
    });

    let book = new bookModel({
        title: bookName,
        author: author,
        type: type,
        price: price,
        image: imageUrl,
        description: description
    }).save();

    req.flash('success_message', 'Book added successfully.');
    res.redirect('/admin');
});

Router.post('/admin/delete-book', loginRequired, adminIS, async(req, res) => {
    let id = req.body.id;
    if(!id) return res.status(200).send({ code: 400, message: 'Please enter a valid id.' });

    let book = await bookModel.findById(id);
    if(!book) return res.status(200).send({ code: 400, message: 'Book not found.' });

    bookModel.findByIdAndDelete(id, (err) => {
        if(err) return res.status(200).send({ code: 400, message: 'An error occurred while deleting the book.' });
        res.status(200).send({ code: 200, message: 'Book deleted successfully.' });
    });
});

Router.post('/admin/edit-about', loginRequired, adminIS, async(req, res) => {
    let { about } = req.body;
    if(!about) {
        req.flash('error', 'Please fill in all fields.');
        return res.redirect('back');
    }

    let site = await siteModel.findOne({ id: 1 });
    site.about = about;
    site.save();
    req.flash('success_message', 'About page updated successfully.');
    res.redirect('back');
});

module.exports = Router;