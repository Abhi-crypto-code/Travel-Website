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
router.post("/",validateReview,isLoggedIn,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    // if (!listing) {
    //     throw new ExpressError(404, "Listing not found"); // or res.status(404).send(...)
    // }

    listing.reviews.push(newReview);
    // await review.validate();
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    // res.send("new review saved");
    console.log(listing._id);
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);

}));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,warpAsync( async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

}));

module.exports = router;