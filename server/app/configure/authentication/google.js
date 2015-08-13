'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {
        UserModel.findOne({
                'google.id': profile.id
            }).exec()
            .then(function(user) {
                if (user) {
                    return user;
                } else {
                    return UserModel.create({
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        photo: profile._json.picture
                    });
                }

            }).then(function(userToLogin) {
                console.log(userToLogin)
                done(null, userToLogin);
            }, function(err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google/user', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
            // 'https://mail.google.com'
        ]
    }));

    app.get('/auth/google/user/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            console.log('logged in')
            res.redirect('/');
        });

};