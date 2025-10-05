const express = require("express");

const router = express.Router({ mergeParams: true });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const {reviewSchema} = require("../schema.js");
const warpAsync = require("../utils/warpAsync.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const controllerReview = require("../controllers/reviews.js")

const validateReview = (req,res,next)=>{
        let {error} = reviewSchema.validate(req.body);
        
        // console.log(result);
        if(error){
            let errorMessage = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errorMessage);
        }
        else{
            next();
        }
};

//review
router.post("/",validateReview,isLoggedIn,wrapAsync(controllerReview.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,warpAsync(controllerReview.destroyReview));

module.exports = router;