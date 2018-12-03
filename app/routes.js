// app/routes.js
// const async;


module.exports      = function(app, passport) {

const User          = require('./models/user');

// ------------
// INDEX ROUTE
    app.get('/', isLoggedIn, function(req, res){

        // res.redirect("/login");
        res.redirect("/tutors");
        // res.send('index');
        // res.render('index')

    });


// ------------
// AUTHENTICATION
    require('./routes/authentification')(app, passport, User);



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
// UPDATE LOCALISATION
    app.get('/updateLocal/:email/:localisation/:hash', function (req, res) {

        // Set all URL parameters in tab
        if(req.params.hash === "81cc0e0f1c871be52b881c7fd9b9f989") {
            var param = {
                email: req.params.email,
                localisation: req.params.localisation,
            };
            param.localisation = param.localisation.toLowerCase();
            param.localisation = param.localisation.charAt(0).toUpperCase() + param.localisation.slice(1);

            User.findOneAndUpdate({ email: param.email}, {lastLocation: param.localisation}, function (err, docs) {
                if(err)
                    console.log("Something was wrong updating data ! :(");
                else
                    res.send('200');
            })

        }
    });


// ------------
// DISPLAY MAP
 app.get('/map/:localisation', function (req, res) {

    res.render('location', {
        image: req.params.localisation
    });

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



