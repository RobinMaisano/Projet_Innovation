const LocalStrategy = require('passport-local').Strategy;

// Loading models
const User          = require('../app/models/user');


module.exports = function(passport) {


    // --------------
    // Passport session setup
    // Required for persistent sessions, serialize & deserialize ability needed by passport
    // --------------

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });

    // --------------
    // Local sign up
    // --------------

    passport.use('local-signup', new LocalStrategy({
        // Using email instead of username
        usernameField: 'email',
        passReqToCallback: true
    },
        
        function (req, email, password, done) {

            process.nextTick(function () {
                User.findOne({'email': email}, function (err, user) {

                    // If error, return it
                    if(err)
                        return done(err);

                    if(user)
                        return done(null, false, req.flash('signupMessage','That email is already taken.'));

                    else {

                        // New user creation
                        var newUser     = new User();

                        //Set credentials
                        newUser.email   = email;
                        newUser.password= newUser.generateHash(password);
                        newUser.status  = "student";
                        newUser.city    = req.body.city;
                        newUser.licenseExpiration = "111";

                        //Save the new user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })

                    }

                })
            })

        }));


    // --------------
    // Local login
    // --------------

    passport.use('local-login', new LocalStrategy({
        // Using email instead of username
        usernameField: 'email',
        passReqToCallback: true
    },
        function(req, email, password, done){

            User.findOne({'email': email}, function (err, user) {

                // Error encountered
                if(err)
                    return done(err);

                // User not found
                if(!user)
                    return done(null, false, req.flash('loginMessage','That email has not been found'));

                // Wrong Password
                if(!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage','Wrong password'));

                // Successful, return user
                return done(null, user);

            });

        }
    ));

};