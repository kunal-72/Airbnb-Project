const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

// signup
router.get("/signup", userController.renderSignupForm )
router.post("/signup", wrapAsync(userController.SignUp))


// login
router.get("/login", userController.renderLoginForm)
router.post("/login", saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),    // passport.authenticate check if the user already exist or not . "local" is a strategy
   userController.Login
);


router.get("/logout", userController.Logout)

module.exports = router;