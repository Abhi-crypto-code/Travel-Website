const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews");
const { listingSchema } = require("../schema");

const ListingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },
    // image : {
    //     type : String,
    //     //default : "https://images.unsplash.com/photo-1720884413532-59289875c3e1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     //set : (v) => v === ""?"https://images.unsplash.com/photo-1720884413532-59289875c3e1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    // },
    image: {
        filename: String,
        url: String,
        // default : "https://unsplash.com/photos/person-in-black-shorts-sitting-on-brown-wooden-bench-pb7gfl7_Ni8",
        // set : (v)=>v === ""?"https://unsplash.com/photos/person-in-black-shorts-sitting-on-brown-wooden-bench-pb7gfl7_Ni8" : v,
    },

    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User",
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

