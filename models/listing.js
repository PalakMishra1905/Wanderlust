const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },    
    description:String,
    image:{
         type:String,
         default:"https://img.freepik.com/free-photo/morskie-oko-tatry_1204-510.jpg?semt=ais_hybrid&w=740",
         set:(v)=> v ==="" ? "https://img.freepik.com/free-photo/morskie-oko-tatry_1204-510.jpg?semt=ais_hybrid&w=740":v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }], 
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
      await Review.deleteMany({_id: {$in: listing.reviews}});
    }

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;