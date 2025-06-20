const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

//Sugnup GET Route.
router.get("/signup", async(req, res)=>{
   res.render("./users/signup.ejs");
});

//Signup POST Route.
router.post("/signup", wrapAsync(async(req, res)=>{
    try{
       let {email, username, password} = req.body;
       const newUser = new User({email, username});
       const registeredUser = await User.register(newUser, password);
       console.log(registeredUser);
       //Automatic login after signup.
       req.login(registeredUser, (err)=>{
         if(err){
            next(err);
         }
       req.flash("success", "Welcome to Wanderlust!");
       res.redirect("/listings");         
       });
    }catch(err){
        req.flash("error", err.message);    
        res.redirect("/signup");
    }
}));

//Login GET Route
router.get("/login", async(req, res)=>{
     res.render("./users/login.ejs");
})

//Login POST Route
router.post("/login",saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login', failureFlash:true}),
 async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

//Logout Route
router.get("/logout", async(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next();
        }
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    });
})

module.exports = router;



