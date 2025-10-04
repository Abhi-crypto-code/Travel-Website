const express = require("express");

const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/warpAsync");
const passport = require("passport");
const {saveRedirectedUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    // res.send("form");
    res.render("./users/signup.ejs");
});

router.post("/signup", warpAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect(req.session.redirectUrl);
        });
        

    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}));

router.get("/login",async(req,res)=>{
    res.render("./users/login.ejs");
});
router.post("/login",saveRedirectedUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),async(req,res,next)=>{
    req.flash("success","Welcome back!");
    //check  
    console.log(res.locals.redirectUrl);
    res.redirect(res.locals.redirectUrl || "/listings");
});

router.get("/logout",async(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");

    })
});
 
module.exports = router;