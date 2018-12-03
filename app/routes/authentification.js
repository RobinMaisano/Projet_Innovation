
module.exports      = function (app, passport, User) {

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
        successRedirect: '/tutors',
        failureRedirect: '/login',
        failureFlash: true
    }));



// ------------
// LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login')
    });

};
