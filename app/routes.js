// app/routes.js
// const async;


module.exports      = function(app, passport) {

const User          = require('./models/user');

// ------------
// INDEX ROUTE
    app.get('/', function(req, res){

        // res.redirect("/login");
        res.send('index');
        // res.render('index')

    });


// ------------
// SIGN UP ROUTES
    app.get('/signup', function (req, res) {
        if(req.isAuthenticated()){
            req.flash();
            res.redirect('/')
        }else{
            res.render('signup')
        }
    });

    app.post('/signup', /*isPasswordConfirmed,*/ passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash: true
    }));


// ------------
// LOGIN ROUTES
    app.get('/login', function (req, res) {
        // If user is already logged in
        if(req.isAuthenticated()){
            req.flash('indexMessage',"You'r already authenticated.");
            res.redirect('/')
        }else {
            res.render('login', {message: req.flash('loginMessage')});
        }
    });

    app.post('/login',passport.authenticate('local-login', {
        // successRedirect: '/',
        successRedirect: '/login',
        failureRedirect: '/login',
        failureFlash: true
    }));


// ------------
// LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login')
    });


// ------------
// LOCALISATION
    app.get('/tutors', isLoggedIn, function (req, res){

        User.find({ status: 'tutor', city: req.user.city }, function (err, docs) {

            if(err)
                res.return("Fail");

            res.render('tutors', {

                tutors: docs,
                city: req.user.city

            })
        })

    });




// ------------
// MIDDLEWARE

    // Logged in middleware
    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();

        res.redirect('/login');
    }

    // Password confirmation middleware
    function isPasswordConfirmed(req, res, next) {

        // If password is confirmed, go on
        if (req.body.password === req.body.confirm)
            return next();

        // If not, go back to sign up
        req.flash('signupMessage','Confirmation password does not match');
        res.redirect('/signup');

    }

};



