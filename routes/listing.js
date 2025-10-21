const express = require("express");
const router = express();

const Listing = require("../models/listing.js");


const warpAsync = require("../utils/warpAsync.js");

const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js");

const multer  = require('multer');

const {storage} = require("../cloudConfig.js");

const upload = multer({ storage });

router.route("/")
.get(warpAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,warpAsync(listingController.createListing));
// .post(,(req,res)=>{
//     res.send(req.file);
// });

//new route ** should come before :id**
router.route("/new")
.get(isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(warpAsync(listingController.showListing))
.put(isLoggedIn ,isOwner,upload.single("listing[image]"),warpAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,warpAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, warpAsync(listingController.renderEditForm));


module.exports = router;