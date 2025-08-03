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
const Review = require("./models/reviews.js");
const {reviewSchema} = require("./schema.js");
const warpAsync = require("./utils/warpAsync.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
        
        // console.log(result);
        if(error){
            let errorMessage = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errorMessage);
        }
        else{
            next();
        }
};

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



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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

//--------



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