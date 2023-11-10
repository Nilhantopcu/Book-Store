const usermodel = require("../models/users")
const bcrypt = require('bcryptjs');

const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {

    passport.use(new localStrategy({ 
        usernameField: 'username', 
        passwordField: 'password' 
    }, async(username, password, done) => {

        let userdb = await usermodel.findOne({ username: username });
        if (!userdb) {
            userdb = await usermodel.findOne({ email: username });
            if(!userdb) return done(null, false, { message: "Your login information is wrong!" });
        }

        let match = await bcrypt.compare(password, userdb.password)
        if (!match) {
            return done(null, false, { message: "Your login information is wrong!" });
        }
        if (match) {
            return done(null, userdb);
        }
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        usermodel.findById(id, function (err, user) {
            cb(err, user);
        });
    });

}