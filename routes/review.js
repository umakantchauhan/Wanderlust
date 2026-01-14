const express = require("express");
const router = express.Router({ mergeParams: true }); //this line is important because this make it possible to access the listing ID
const wrapAsync = require("../utils/wrapAsync");

const Review = require("../models/review");
const Listing = require("../models/listing");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
