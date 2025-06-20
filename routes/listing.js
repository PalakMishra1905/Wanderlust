const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const validateListing = (req, res, next)=>{
     let {error} = listingSchema.validate(req.body);
      if(error){
        let errMsg = err.details.map((el)=>el.message).join(",")
         throw new ExpressError(400, errMsg);
      }else{
        next();
      }
}

//Index Route.
router.get("/", wrapAsync(async(req, res)=>{
    const allListings = await Listing.find()
    res.render("./listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, async(req, res)=>{
    res.render("./listings/new.ejs");
})

//create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next)=>{
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
}));

//Show Route.
router.get("/:id", wrapAsync(async(req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}})
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing, Listing});
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing does not exist");
      res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {listing});
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error", "Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;