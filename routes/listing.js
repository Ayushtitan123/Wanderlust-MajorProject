const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const Listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



router
    .route("/")
    .get(wrapAsync(Listingcontroller.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(Listingcontroller.createListing)
    );
//New route
router.get("/new", isLoggedIn, Listingcontroller.renderNewForm)


router
    .route("/:id")
    .get(wrapAsync(Listingcontroller.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,  
        wrapAsync(Listingcontroller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(Listingcontroller.destroyListing)
    );


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(Listingcontroller.renderEditForm))

module.exports = router;