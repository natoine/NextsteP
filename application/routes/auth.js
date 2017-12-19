// load up the user model
const User            = require('../models/user')

const security = require('../utils/securityMiddleware')

module.exports = function(app, express, passport) {

	// get an instance of the router for clientfiles routes
	const authRoutes = express.Router()

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    authRoutes.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') })
    })

    // process the login form
    authRoutes.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    authRoutes.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') })
    })

    // process the signup form
    authRoutes.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }))

    // =====================================
    // ACTIVATE ACCOUNT ==============================
    // =====================================
    authRoutes.get('/activateaccount', function(req, res) {
        const token = req.query.token
        User.findOne({ 'activationtoken' : token }, function(err, user) 
            {
                // if there are any errors, return the error
                if (err)
                {
                    console.log(err)
                    req.flash('activateAccountDangerMessage', 'An error occured, try later')
                    res.render('activateaccount.ejs', 
                        { messagedanger: req.flash('activateAccountDangerMessage') , messageok: "" })
                }
                if(user)
                {
                    if(user.email.localeCompare(req.query.email)==0)
                    {
                        if(user.isActivated())
                        {
                            res.redirect('/')
                        }
                        else
                        {
                            user.mailvalidated = true
                            user.save(function(err) 
                            {
                                if (err) 
                                {
                                    console.log(err)
                                    //flash
                                    req.flash('activateAccountDangerMessage', 'An error occured, try later')
                                    res.render('activateaccount.ejs', 
                                        { messagedanger: req.flash('activateAccountDangerMessage') , 
                                        messageok: "" })
                                }
                                else
                                {
                                    req.flash('activateAccountOkMessage', 'Account activated !')
                                    res.render('activateaccount.ejs', 
                                        { messagedanger: "" , messageok: req.flash('activateAccountOkMessage') })
                                }
                            })
                        }    
                    }
                    else res.redirect('/')    
                }
                else res.redirect('/')
            })
    })


    // =====================================
    // LOGOUT ==============================
    // =====================================
    authRoutes.get('/logout', function(req, res) { 
        req.logout()
        res.redirect('/')
    })

	// apply the routes to our application
	app.use('/', authRoutes)

}