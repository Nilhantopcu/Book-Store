const settings = require('./settings');
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const connectFlash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const app = express();

// Mongoose connection
mongoose.set('strictQuery', true);
mongoose.connect(settings.mongodb, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database connected!');
}).catch(err => {
    console.log(err);
});

// ejs
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// cookieParser
app.use(cookieParser());

// Express session and connect mongo
app.use(session({ 
    secret: 'seesafkdfkkd kssak', 
    resave: true, 
    saveUninitialized: true,
    store: new MongoStore({ 
        mongoUrl: mongoose.connection._connectionString,
        mongoOptions: { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        },
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport);

// Bodyparser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Connect flash
app.use(connectFlash());
app.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// assets
app.use('/assets', express.static(path.join(__dirname, "assets")));

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/about-us'));
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/basket'));
app.use('/', require('./routes/book-detail'));
app.use('/', require('./routes/home'));
app.use('/', require('./routes/pay'));


// Server
app.listen(settings.port, () => {
    console.log(`Server started on port ${settings.port}`);
});