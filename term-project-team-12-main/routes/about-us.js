const Router = require('express').Router();
const siteModel = require('../models/site');
const loginRequired = require('../middleware/loginRequired');

Router.get('/about', async(req, res) => {
    let site = await siteModel.findOne({ id: 1 });
    res.render('dashboard/about-us.html', { site });
});

module.exports = Router;