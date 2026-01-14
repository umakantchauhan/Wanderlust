const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

const multer = require("multer");

const { storage } = require("../cloudConfig");

const upload = multer({ storage }); //this upod of multer will upload the files to the storage that's cloudinary

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"), //this is multer npm package to make the file type data undsrstndable to backend and send the data to cloud and save name as listing[image]
  wrapAsync(listingController.createListing)
);

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
