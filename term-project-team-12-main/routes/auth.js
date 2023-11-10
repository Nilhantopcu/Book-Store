const Router = require('express').Router();
const usermodel = require("../models/users")
const bcrypt = require('bcryptjs');
const passport = require('passport');

Router.get('/login', (req, res) => {
    if(req.user) return res.redirect('/');
    res.render('auth/login.html');
});

Router.post('/login', (req, res, next) => {
    let session;
    if(req.body["remember-me"]) session = settings.day*365;
    if(!req.body["remember-me"]) session = 3600000;

    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        badRequestMessage: 'Fill in all fields!', //missing credentials
        failureFlash: true,
        session: req.session.cookie.maxAge = session
    })(req, res, next);
});

Router.get('/register', (req, res) => {
    if(req.user) return res.redirect('/');
    res.render('auth/register.html');
});

Router.post('/register', async(req, res) => {
    let { firstname, lastname, username, email, password } = req.body;
    
    if(!firstname || !lastname || !username || !email || !password) {
        req.flash('error_message', 'Fill in all fields!');
        return res.redirect('back');
    };

    if(firstname.length < 3 || lastname.length < 3 || username.length < 3 || email.length < 3 || password.length < 3) {
        req.flash('error_message', 'Name, surname, username, e-mail and password fields must be at least 3 characters!');
        return res.redirect('back');
    };

    let usernamedb = await usermodel.findOne({ username });
    if(usernamedb) {
        req.flash('error_message', 'This username is already in use!');
        return res.redirect('back');
    };

    let emaildb = await usermodel.findOne({ email });
    if(emaildb) {
        req.flash('error_message', 'This e-mail is already in use!');
        return res.redirect('back');
    };

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let user = new usermodel({
        username,
        email,
        password: hash,
        name: firstname,
        surname: lastname
    });

    await user.save();
    req.flash('success_message', 'You have successfully registered!');
    res.redirect('/login');
});


Router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) return res.redirect('back');
        res.redirect('/login');
    });
});




module.exports = Router;