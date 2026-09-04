const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js")
const reviewControler = require("../controllers/review.js")
 

// reviews Post Route
router.post("/", isLoggedin,validateReview, wrapAsync(reviewControler.createReview))

// delete review route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewControler.destroyReview))



module.exports = router;