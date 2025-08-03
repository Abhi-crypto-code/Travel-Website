const express = require("express");
const router = express();

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

const validateListing = (req,res,next)=>{
        let {error} = listingSchema.validate(req.body);
        
        // console.log(result);
        if(error){
            let errorMessage = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errorMessage);
        }
        else{
            next();
        }
};


//Index route
router.get("/",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
 
//new route ** should come before :id**
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",async (req,res)=>{
    let {id} = req.params;
    // const listing = await Listing.findById(id);
    //** */
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

});

//create routee
router.post("/",async (req,res,next)=>{
    // let listing = req.body.listing;
    
    try{
        let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
    
});

//edit route
router.get("/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


//update route
router.put("/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)

});

//Delete Route
router.delete("/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


module.exports = router;