const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const listingControler = require("../controllers/listing.js")
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

//get req for render new form
router.get('/new', isLoggedin, listingControler.renderNewForm)

// index route
// post route
router.route("/")
    .get(wrapAsync(listingControler.index))
    .post( isLoggedin, upload.single('listing[image]') ,validateListing , wrapAsync(listingControler.createListing));




router.route("/:id")
    .get(wrapAsync(listingControler.showListing))
    .put(isLoggedin, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingControler.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingControler.destroyListing));



router.get('/:id/edit', isLoggedin, isOwner, validateListing, wrapAsync(listingControler.renderEditForm));




module.exports = router;