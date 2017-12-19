// app/models/user.js
// load the things we need
const mongoose = require('mongoose')
const bcrypt   = require('bcrypt-nodejs')

// define the schema for our user model
const userSchema = mongoose.Schema({
        email        : String,
        password     : String,
        mailvalidated: Boolean,
        gmail        : String, 
        activationtoken: String,
        timepwdreco  : Number,
        pwdrecotoken : String
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

//generate password recovery token
userSchema.methods.generatePwdRecoToken = function(email , timepwdreco) {
    return bcrypt.hashSync(email + timepwdreco, bcrypt.genSaltSync(8), null)
}

//checking if user is activated
userSchema.methods.isActivated = function() {
    return this.mailvalidated
}

// create the model for users and expose it to our app
const configDB = require('../../config/database.js')
const db = mongoose.createConnection(configDB.url)
//module.exports = mongoose.model('User', userSchema)
module.exports = db.model('User', userSchema)