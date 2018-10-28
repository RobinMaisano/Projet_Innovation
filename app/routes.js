// app/routes.js
// const async;


module.exports      = function(app, passport) {



// ------------
// INDEX ROUTE
    app.get('/', function(req, res){

        // res.redirect("/login");
        res.send("bonjour");
        // res.render('index')

    });


// ------------
// LOGIN ROUTES
    app.get('/login', function (req, res) {
        // If user is already logged in
        if(req.isAuthenticated()){
            req.flash('indexMessage',"You'r already authenticated.");
            req.redirect('/index')
        }else {
            res.render('login', {message: req.flash('loginMessage')});
        }
    });

    app.post('/login',passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));



    function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();

        res.redirect('/login');
    }


};



