
if (process.env.NODE_ENV != "production") {

    require('dotenv').config()
}


const express = require('express');
const app = express()
const port = 3000
const mongoose = require('mongoose');
const path = require("path")
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

const session = require("express-session")
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash")

const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")



const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")




app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))


const dburl = process.env.ATLASDB_URL;
main()
    .then((res) => {
        console.log("DB connection successful")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);

}



const store = MongoStore.create({
        mongoUrl: dburl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    })

app.use(session({  
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(flash());


app.use(passport.initialize());       
app.use(passport.session());          


passport.use(new LocalStrategy(User.authenticate()))   
passport.serializeUser(User.serializeUser());           
passport.deserializeUser(User.deserializeUser());    



app.use((req, res, next) => {                                                     
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;         
    next();
})


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// 404 
app.use((req, res, next) => {
    throw new ExpressError(404, "Page not found");
});


// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "some thing went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})