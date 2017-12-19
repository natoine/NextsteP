
// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'sessionsecret' : process.env.sessionsecretIAUTH, //passport needs this for sessions
    'jwtsecret' : process.env.jwtsecretIAUTH

}