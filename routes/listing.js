const express = require("express");
const router = express();

const Listing = require("../models/listing.js");


const warpAsync = require("../utils/warpAsync.js");

const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js");

//Index route
router.get("/",warpAsync(listingController.index));
 
//new route ** should come before :id**
router.get("/new",isLoggedIn,(req,res)=>{
    // console.log(req.user);
   
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",async (req,res)=>{
    let {id} = req.params;
    // const listing = await Listing.findById(id);
    //** */
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {
        path : "author",
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    // console.log(listing);

    res.render("listings/show.ejs",{listing});

});

//create routee
router.post("/",isLoggedIn,async (req,res,next)=>{
    // let listing = req.body.listing;
    
    try{
        let newListing = new Listing(req.body.listing);
        console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
    
});

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
});


//update route
router.put("/:id",isLoggedIn ,isOwner,async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`)

});

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
});


module.exports = router;