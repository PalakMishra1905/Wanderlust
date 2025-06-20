if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema} = require("./Schema.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn, isReviewAuthor } = require("./middleware.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Middleware's
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//mongodb connection.
async function main(){
     await mongoose.connect(process.env.DB_URL);
}

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
     console.log(err);
})

const store = MongoStore.create({
    mongoUrl:process.env.DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store", err);
})

//Session
const sessionOptions = {
   store, 
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
   }
}

app.use(session(sessionOptions));
app.use(flash());

//passport.
app.use(passport.initialize());  //Initialize passport.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//demoUser
app.get("/demouser", async(req, res)=>{
   const fakeUser = new User({
      email:"student@gmail.com",
      username:"student"
   })
      
   //User.register(usermodel, password, callback);
   let registeredUser = await User.register(fakeUser, "helloworld");
   res.send(registeredUser);
})

//Control flash
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//Review Routes
//Post Review Route.
app.post("/listings/:id/reviews", isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success", "New Review Added!");

   console.log("New review saved");

   res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Request
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req, res)=>{
   console.log("DELETE route hit, params:", req.params); // Debug 
   let {id, reviewId} =  req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review Deleted");

   res.redirect(`/listings/${id}`);
}));

//Routes
app.use('/listings', listingRouter);
app.use("/", userRouter);


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message});
});

//start server with npm start
app.listen(8080, ()=>{
    console.log("Server is listening to port 8080.")
})
