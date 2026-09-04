const User = require("../models/user.js")
module.exports.renderSignupForm =(req, res) => {
    res.render("users/signup.ejs")
}
module.exports.SignUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
    
        req.login(registeredUser, (err) => {                          
            if (err) {
                return next(err)
            }
            req.flash("success", "welcome to wanderlust")
            res.redirect("/listings");
        })
    } catch (err) {                                
        req.flash("error", err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}
module.exports.Login =  async (req, res) => {
    req.flash("success", "login successfully!!")
    let redirectUrl = res.locals.redirectUrl  || "/listings"
    res.redirect(redirectUrl)
}

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {                      
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings")
    })
}