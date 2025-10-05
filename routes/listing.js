const express = require("express");
const router = express();

const Listing = require("../models/listing.js");


const warpAsync = require("../utils/warpAsync.js");

const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js");

router.route("/")
.get(warpAsync(listingController.index))
.post(isLoggedIn,warpAsync(listingController.createListing));

//new route ** should come before :id**
router.route("/new")
.get(isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(warpAsync(listingController.showListing))
.put(isLoggedIn ,isOwner,warpAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,warpAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, warpAsync(listingController.renderEditForm));


module.exports = router;