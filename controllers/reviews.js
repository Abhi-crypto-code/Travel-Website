const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req,res)=>{
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

};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

};