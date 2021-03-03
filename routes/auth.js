const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
const authModel = require ("./../model/User");


router.get("/signin", (req,res, next)=>{

    res.render('auth/signin.hbs');

});
router.get("/signup", (req,res, next)=>{

    res.render('auth/signup.hbs');

});

router.get( "/signout", async (req, res, next)=> { 
 req.session.destroy(function (err)
 {
     res.redirect("auth/signin");
 });
});

