const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/warpAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
main()
.then(()=>{
    console.log("connected to db");
}).catch((err)=>console.log(err));

async function main() {
    mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi , I am root");
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

const validateListing = (req,res,next)=>{
        let {error} = listingSchema.validate(req.body);
        let errorMessage = error.details.map((el)=>el.message).join(",");
        // console.log(result);
        if(error){
            throw new ExpressError(400, errorMessage);
        }
        else{
            next();
        }
}


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute,Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Sample listing saved successfully!");
// });

//Index route
app.get("/listings",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
 
//new route ** should come before :id**
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

});

//create routee
app.post("/listings",async (req,res,next)=>{
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
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)

});

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not Found!"));
// });


app.use((err,req,res,next)=>{
    // res.send("Something went wrong");
    let {statusCode = 500,message = "Unknown error"} = err;
    // console.log(err);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});