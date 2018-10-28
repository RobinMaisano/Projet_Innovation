// Load ORM (here Mongoose) + encryption library
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt-nodejs');


// Schema for user model
var userSchema  = mongoose.Schema({

    id              : Number,
    email           : String,
    password        : String,
    status          : String,
    city            : String,
    lastLocation    : String,
    doNotDisturbed  : Boolean,
    licenseExpiration : Date,

});

// Schema's methods
// Generate Hash from password
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Compare passwords hashes
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// Model instantiation and expose for the app
module.exports = mongoose.model('User', userSchema, 'users');